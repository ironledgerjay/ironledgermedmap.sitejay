import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../superbaseClient';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'doctor' | 'patient';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, [requiredRole]);

  const checkAuth = async () => {
    try {
      // Check for admin session in localStorage first
      if (requiredRole === 'admin') {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        const adminEmail = localStorage.getItem('userEmail');

        if (isAdmin && adminEmail === 'admin@ironledgermedmap.com') {
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      if (!requiredRole) {
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      // Check user role in user_profiles table
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || !profile) {
        console.error('Error fetching user profile:', error);
        console.error('Profile error details:', JSON.stringify(error, null, 2));

        // If user_profiles table doesn't exist, allow access for non-admin routes
        if (error && (error.code === 'PGRST116' || error.message?.includes('relation "public.user_profiles" does not exist'))) {
          console.log('user_profiles table not found');
          if (requiredRole === 'admin') {
            setIsAuthorized(false);
          } else {
            setIsAuthorized(true); // Allow access for non-admin routes
          }
        } else {
          setIsAuthorized(false);
        }
      } else {
        // Admin users can access any role
        const hasAccess = profile.role === requiredRole || profile.role === 'admin';
        setIsAuthorized(hasAccess);

        if (!hasAccess) {
          toast({
            title: "Access Denied",
            description: `You need ${requiredRole} privileges to access this page.`,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking access permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
