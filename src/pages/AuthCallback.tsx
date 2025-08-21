import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../superbaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type VerificationStatus = 'loading' | 'success' | 'error' | 'expired';

export default function AuthCallback() {
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash parameters from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        // Check if there's an error in the URL
        if (error) {
          console.error('Auth error:', error, errorDescription);
          setErrorMessage(errorDescription || error);
          setStatus('error');
          return;
        }

        // Handle email verification
        if (type === 'signup' || type === 'email') {
          if (accessToken && refreshToken) {
            // Set the session
            const { data, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });

            if (sessionError) {
              console.error('Session error:', sessionError);
              setErrorMessage(sessionError.message);
              setStatus('error');
              return;
            }

            if (data.user) {
              // Update user's email verification status
              const { error: updateError } = await supabase.auth.updateUser({
                data: { email_verified: true }
              });

              if (updateError) {
                console.error('Update error:', updateError);
              }

              setStatus('success');
              
              toast({
                title: "Email Verified! 🎉",
                description: "Your account has been successfully verified. Welcome to IronledgerMedMap!",
                duration: 5000,
              });

              // Redirect to login after a short delay
              setTimeout(() => {
                navigate('/login', { 
                  replace: true,
                  state: { message: 'Account verified successfully! Please log in to continue.' }
                });
              }, 3000);
            } else {
              setErrorMessage('No user found in session');
              setStatus('error');
            }
          } else {
            setErrorMessage('Missing authentication tokens');
            setStatus('error');
          }
        } else {
          // Handle other auth types or default behavior
          const { data, error: authError } = await supabase.auth.getSession();
          
          if (authError) {
            console.error('Auth error:', authError);
            setErrorMessage(authError.message);
            setStatus('error');
          } else if (data.session) {
            setStatus('success');
            navigate('/login', { replace: true });
          } else {
            setErrorMessage('No valid session found');
            setStatus('error');
          }
        }
      } catch (error) {
        console.error('Callback error:', error);
        setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  const handleReturnToLogin = () => {
    navigate('/login', { replace: true });
  };

  const handleReturnToSignup = () => {
    navigate('/signup', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-lg mx-auto mb-4">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Verifying Your Account'}
            {status === 'success' && 'Account Verified! ✅'}
            {status === 'error' && 'Verification Failed ❌'}
            {status === 'expired' && 'Link Expired ⏰'}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Please wait while we verify your email address...'}
            {status === 'success' && 'Welcome to IronledgerMedMap! Your account is now active.'}
            {status === 'error' && 'There was an issue verifying your account.'}
            {status === 'expired' && 'Your verification link has expired.'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {status === 'loading' && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  🎉 Your email has been successfully verified!
                </p>
                <p className="text-sm text-muted-foreground">
                  You will be redirected to the login page in a few seconds...
                </p>
              </div>
              <Button onClick={handleReturnToLogin} className="w-full">
                Continue to Login
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {errorMessage || 'An unexpected error occurred during verification.'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Please try signing up again or contact support if the issue persists.
                </p>
              </div>
              <div className="space-y-2">
                <Button onClick={handleReturnToSignup} className="w-full">
                  Try Signing Up Again
                </Button>
                <Button variant="outline" onClick={handleReturnToLogin} className="w-full">
                  Back to Login
                </Button>
              </div>
            </div>
          )}

          {status === 'expired' && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <XCircle className="h-16 w-16 text-amber-500" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Your verification link has expired for security reasons.
                </p>
                <p className="text-sm text-muted-foreground">
                  Please sign up again to receive a new verification email.
                </p>
              </div>
              <div className="space-y-2">
                <Button onClick={handleReturnToSignup} className="w-full">
                  Sign Up Again
                </Button>
                <Button variant="outline" onClick={handleReturnToLogin} className="w-full">
                  Back to Login
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
