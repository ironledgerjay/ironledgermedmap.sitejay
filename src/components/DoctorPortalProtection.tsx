import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../superbaseClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Clock, Mail, Shield, Stethoscope } from 'lucide-react';

interface DoctorPortalProtectionProps {
  children: React.ReactNode;
}

interface DoctorProfile {
  id: string;
  full_name: string;
  email: string;
  verified: boolean;
  application_status: 'pending' | 'approved' | 'rejected';
  specialty?: string;
}

export default function DoctorPortalProtection({ children }: DoctorPortalProtectionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [accessDeniedReason, setAccessDeniedReason] = useState<string>('');
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    checkDoctorPortalAccess();
  }, [user]);

  const checkDoctorPortalAccess = async () => {
    try {
      setIsLoading(true);

      // First check if user is admin
      if (isAdmin) {
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      // Check for admin session in localStorage as fallback
      const isAdminLocal = localStorage.getItem('isAdmin') === 'true';
      const adminEmail = localStorage.getItem('userEmail');

      if (isAdminLocal && adminEmail === 'admin@ironledgermedmap.com') {
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      // If no user is logged in, deny access
      if (!user) {
        setAccessDeniedReason('Please log in to access the Doctor Portal.');
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      // Check if user is a registered doctor
      const { data: doctorData, error } = await supabase
        .from('doctors')
        .select('id, full_name, email, verified, application_status, specialty')
        .eq('email', user.email)
        .single();

      if (error || !doctorData) {
        // User is not a registered doctor
        setAccessDeniedReason('Only enrolled doctors and administrators can access the Doctor Portal. Please complete doctor enrollment first.');
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      setDoctorProfile(doctorData);

      // Check if doctor is verified/approved
      if (!doctorData.verified || doctorData.application_status !== 'approved') {
        if (doctorData.application_status === 'pending') {
          setAccessDeniedReason('Your doctor application is currently under review. You will receive email notification once approved.');
        } else if (doctorData.application_status === 'rejected') {
          setAccessDeniedReason('Your doctor application was not approved. Please contact support for more information.');
        } else {
          setAccessDeniedReason('Your doctor account is not yet verified. Please contact admin for assistance.');
        }
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      // Doctor is verified and approved
      setIsAuthorized(true);
      setIsLoading(false);

    } catch (error) {
      console.error('Doctor portal access check error:', error);
      setAccessDeniedReason('An error occurred while checking access permissions.');
      setIsAuthorized(false);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg font-medium text-gray-900 mb-2">Verifying Access</p>
              <p className="text-gray-600">Checking doctor credentials and permissions...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Access Restricted
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                {accessDeniedReason}
              </AlertDescription>
            </Alert>

            {doctorProfile && doctorProfile.application_status === 'pending' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium text-blue-900">Application Status: Pending Review</h3>
                </div>
                <p className="text-blue-700 text-sm mb-3">
                  Hi Dr. {doctorProfile.full_name}, your application for {doctorProfile.specialty} is being reviewed by our admin team.
                </p>
                <div className="flex items-center space-x-2 text-sm text-blue-600">
                  <Mail className="h-4 w-4" />
                  <span>We'll email you at {doctorProfile.email} once approved</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {!user && (
                <Button 
                  onClick={() => window.location.href = '/login'}
                  className="w-full"
                >
                  Sign In
                </Button>
              )}
              
              {user && !doctorProfile && (
                <Button 
                  onClick={() => window.location.href = '/doctor-enrollment'}
                  className="w-full"
                >
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Enroll as Doctor
                </Button>
              )}

              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Return to Home
              </Button>

              <Button 
                variant="ghost"
                onClick={() => window.location.href = '/contact'}
                className="w-full text-sm"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500 mt-4">
              <p>Need help? Email us at doctors@ironledgermedmap.site</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
