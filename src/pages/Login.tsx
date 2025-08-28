import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../superbaseClient';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stethoscope, Mail, Lock, Eye, EyeOff, Shield, Users, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, validateFormData } from "@/lib/validation";
import AdminQuickLogin from "@/components/AdminQuickLogin";
import HomeButton from "@/components/HomeButton";

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Handle verification messages from signup or auth callback
  useEffect(() => {
    if (location.state?.message) {
      toast({
        title: "Account Status",
        description: location.state.message,
        duration: 8000,
      });

      // Pre-fill email if provided
      if (location.state?.email) {
        setFormData(prev => ({ ...prev, email: location.state.email }));
      }

      // Clear the state to prevent showing the message again
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, toast, navigate, location.pathname]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form data
    const validation = validateFormData(loginSchema, formData);
    if (!validation.success) {
      const firstError = validation.errors?.[0];
      toast({
        title: "Validation Error",
        description: firstError?.message || "Please check your input",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) throw error;

      if (data.user) {

        // Get user profile to determine role-based navigation
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('role, email')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);

          // If user_profiles table doesn't exist or user has no profile, treat as regular user
          if (profileError.code === 'PGRST116' || profileError.message?.includes('relation "public.user_profiles" does not exist')) {
            console.log('user_profiles table not found, treating as regular user');
            toast({
              title: "Welcome back!",
              description: "You have been successfully logged in"
            });
            navigate('/');
            return;
          }

          // For other profile errors, still allow login but as regular user
          toast({
            title: "Welcome back!",
            description: "You have been successfully logged in"
          });
          navigate('/');
          return;
        }

        // Handle role-based navigation and admin setup
        if (profile?.role === 'admin') {
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('userEmail', data.user.email || '');

          toast({
            title: "Welcome back, Admin!",
            description: "You have been successfully logged in as administrator"
          });
          navigate('/admin-dashboard');
        } else if (profile?.role === 'doctor') {
          toast({
            title: "Welcome back, Doctor!",
            description: "You have been successfully logged in"
          });
          navigate('/doctor-portal');
        } else {
          toast({
            title: "Welcome back!",
            description: "You have been successfully logged in"
          });
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-xl mx-auto mb-6 shadow-lg">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back to IronledgerMedMap</h1>
          <p className="text-gray-600">Choose your login method to access your account</p>
        </div>

        <Tabs defaultValue="user" className="w-full animate-fade-in-scale">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="user" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>User Login</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center space-x-2">
              <Crown className="h-4 w-4" />
              <span>Admin Access</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="animate-fade-in-up">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Patient & Doctor Login</CardTitle>
                <CardDescription>
                  Sign in to book appointments or manage your practice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">
                      <Lock className="h-4 w-4 inline mr-2" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-primary/10"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:shadow-lg transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                <Separator className="my-6" />

                <div className="text-center space-y-3">
                  <div className="text-sm">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary hover:underline font-medium">
                      Sign up
                    </Link>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Are you a doctor?{' '}
                    <Link to="/doctor-enrollment" className="text-primary hover:underline font-medium">
                      Join as a Provider
                    </Link>
                    {' or '}
                    <Link to="/doctor-portal" className="text-primary hover:underline font-medium">
                      Doctor Portal
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin" className="animate-fade-in-up">
            <AdminQuickLogin />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
