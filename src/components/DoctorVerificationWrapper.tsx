import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/superbaseClient';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  Stethoscope,
  UserCheck,
  FileText,
  Building
} from 'lucide-react';

interface DoctorStatus {
  isEnrolled: boolean;
  isVerified: boolean;
  isApproved: boolean;
  enrollmentStatus: 'not_enrolled' | 'pending' | 'approved' | 'rejected';
  doctorData?: any;
}

interface DoctorVerificationWrapperProps {
  children: React.ReactNode;
  fallbackComponent?: React.ReactNode;
}

export default function DoctorVerificationWrapper({ 
  children, 
  fallbackComponent 
}: DoctorVerificationWrapperProps) {
  const { user, isAdmin, isLoading } = useAuth();
  const [doctorStatus, setDoctorStatus] = useState<DoctorStatus>({
    isEnrolled: false,
    isVerified: false,
    isApproved: false,
    enrollmentStatus: 'not_enrolled'
  });
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && user) {
      checkDoctorStatus();
    }
  }, [user, isLoading]);

  const checkDoctorStatus = async () => {
    if (!user?.id) return;

    try {
      setStatusLoading(true);

      // Check if user has a doctor record
      const { data: doctorData, error } = await supabase
        .from('doctors')
        .select(`
          *,
          medical_practices (
            name,
            address,
            is_verified
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking doctor status:', error);
        setDoctorStatus({
          isEnrolled: false,
          isVerified: false,
          isApproved: false,
          enrollmentStatus: 'not_enrolled'
        });
        return;
      }

      if (!doctorData) {
        // No doctor record found - user not enrolled
        setDoctorStatus({
          isEnrolled: false,
          isVerified: false,
          isApproved: false,
          enrollmentStatus: 'not_enrolled'
        });
      } else {
        // Doctor record exists
        const isVerified = doctorData.is_verified || false;
        const enrollmentStatus = isVerified ? 'approved' : 
          (doctorData.application_status === 'rejected' ? 'rejected' : 'pending');

        setDoctorStatus({
          isEnrolled: true,
          isVerified,
          isApproved: isVerified,
          enrollmentStatus,
          doctorData
        });
      }

    } catch (error) {
      console.error('Unexpected error checking doctor status:', error);
      setDoctorStatus({
        isEnrolled: false,
        isVerified: false,
        isApproved: false,
        enrollmentStatus: 'not_enrolled'
      });
    } finally {
      setStatusLoading(false);
    }
  };

  // Admin users get full access
  if (isAdmin) {
    return <>{children}</>;
  }

  // Show loading state
  if (isLoading || statusLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Checking doctor verification status...</p>
        </div>
      </div>
    );
  }

  // Doctor is enrolled and approved - show full portal
  if (doctorStatus.isApproved) {
    return <>{children}</>;
  }

  // Show appropriate status message based on enrollment status
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Stethoscope className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Portal</h1>
            <p className="text-gray-600">Access to IronledgerMedMap's professional platform</p>
          </div>

          {doctorStatus.enrollmentStatus === 'not_enrolled' && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800">
                  <FileText className="h-5 w-5 mr-2" />
                  Enrollment Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-orange-800">
                    You need to enroll as a doctor to access the doctor portal. Complete the enrollment process to start receiving patient bookings.
                  </AlertDescription>
                </Alert>

                <div className="bg-white p-6 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-gray-900 mb-3">What you'll need to enroll:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Valid medical license number
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Medical practice information
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Professional credentials and experience
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Contact and practice details
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center">
                  <Button 
                    onClick={() => window.location.href = '/doctor-enrollment'}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Start Doctor Enrollment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {doctorStatus.enrollmentStatus === 'pending' && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-800">
                  <Clock className="h-5 w-5 mr-2" />
                  Application Under Review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription className="text-yellow-800">
                    Your doctor enrollment application is currently being reviewed by our admin team. You'll receive an email notification once approved.
                  </AlertDescription>
                </Alert>

                <div className="bg-white p-6 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Application Status:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Application Submitted</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Admin Review</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        In Progress
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Verification</span>
                      <Badge variant="outline" className="text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Application submitted on: {doctorStatus.doctorData?.created_at ? 
                      new Date(doctorStatus.doctorData.created_at).toLocaleDateString() : 'Unknown'
                    }
                  </p>
                  <Button 
                    variant="outline"
                    onClick={checkDoctorStatus}
                  >
                    Check Status Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {doctorStatus.enrollmentStatus === 'rejected' && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center text-red-800">
                  <XCircle className="h-5 w-5 mr-2" />
                  Application Not Approved
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <XCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">
                    Your doctor enrollment application was not approved. Please contact our support team for more information or to resubmit with additional documentation.
                  </AlertDescription>
                </Alert>

                <div className="bg-white p-6 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Next Steps:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <Building className="h-4 w-4 text-blue-500 mr-2" />
                      Contact our doctor support team for feedback
                    </li>
                    <li className="flex items-center">
                      <FileText className="h-4 w-4 text-blue-500 mr-2" />
                      Review and update your credentials if needed
                    </li>
                    <li className="flex items-center">
                      <UserCheck className="h-4 w-4 text-blue-500 mr-2" />
                      Resubmit your application with additional documentation
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/contact'}
                  >
                    Contact Support
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/doctor-enrollment'}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Apply Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fallback content if provided */}
          {fallbackComponent && (
            <div className="mt-8">
              {fallbackComponent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
