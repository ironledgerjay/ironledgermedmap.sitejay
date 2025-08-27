import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../superbaseClient';
import { useToast } from './use-toast';

export interface User {
  id: string;
  email: string;
  role?: 'admin' | 'doctor' | 'patient';
  profile?: {
    full_name?: string;
    phone?: string;
    verified?: boolean;
  };
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDoctor: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
    isDoctor: false,
  });
  const { toast } = useToast();

  // Admin login function for specified credentials
  const adminLogin = useCallback(async (email: string, password: string) => {
    // Check for specific admin credentials
    if (email === 'ironledgermedmap@gmail.com' && password === 'Medm@p') {
      // Set admin session in localStorage
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('adminSession', 'true');

      setAuthState({
        user: {
          id: 'admin-main',
          email: email,
          role: 'admin',
          profile: {
            full_name: 'Main Administrator',
            verified: true,
          }
        },
        isLoading: false,
        isAuthenticated: true,
        isAdmin: true,
        isDoctor: false,
      });

      toast({
        title: "Admin Login Successful",
        description: "Welcome back, Administrator!",
      });

      return { success: true };
    } else {
      toast({
        title: "Invalid Admin Credentials",
        description: "Please check your email and password.",
        variant: "destructive",
      });
      return { success: false, error: "Invalid credentials" };
    }
  }, [toast]);

  const updateAuthState = useCallback(async (supabaseUser: any) => {
    if (!supabaseUser) {
      // Check localStorage for admin session
      const isAdminStored = localStorage.getItem('isAdmin') === 'true';
      const adminEmail = localStorage.getItem('userEmail');
      const adminSession = localStorage.getItem('adminSession') === 'true';

      if (isAdminStored && adminEmail && adminSession) {
        setAuthState({
          user: {
            id: 'admin-main',
            email: adminEmail,
            role: 'admin',
            profile: {
              full_name: 'Main Administrator',
              verified: true,
            }
          },
          isLoading: false,
          isAuthenticated: true,
          isAdmin: true,
          isDoctor: false,
        });
        return;
      }

      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        isAdmin: false,
        isDoctor: false,
      });
      return;
    }

    try {
      // Fetch user profile to determine role
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('role, full_name, phone, verified')
        .eq('id', supabaseUser.id)
        .single();

      const userRole = profile?.role || 'patient';
      const isAdmin = userRole === 'admin';
      const isDoctor = userRole === 'doctor';

      // Update localStorage for admin users
      if (isAdmin) {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('userEmail', supabaseUser.email);
      } else {
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userEmail');
      }

      setAuthState({
        user: {
          id: supabaseUser.id,
          email: supabaseUser.email,
          role: userRole,
          profile: profile ? {
            full_name: profile.full_name,
            phone: profile.phone,
            verified: profile.verified,
          } : undefined,
        },
        isLoading: false,
        isAuthenticated: true,
        isAdmin,
        isDoctor,
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // If profile fetch fails, still set basic auth state
      setAuthState({
        user: {
          id: supabaseUser.id,
          email: supabaseUser.email,
          role: 'patient',
        },
        isLoading: false,
        isAuthenticated: true,
        isAdmin: false,
        isDoctor: false,
      });
    }
  }, []);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await updateAuthState(session?.user);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      await updateAuthState(session?.user);
      
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userEmail');
        toast({
          title: "Signed Out",
          description: "You have been successfully signed out",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [updateAuthState, toast]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('adminSession');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign Out Error",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const refreshProfile = useCallback(async () => {
    if (authState.user) {
      await updateAuthState(authState.user);
    }
  }, [authState.user, updateAuthState]);

  return {
    ...authState,
    signOut,
    refreshProfile,
    adminLogin,
  };
};
