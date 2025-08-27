import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Crown, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AdminQuickLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await adminLogin(formData.email, formData.password);
      if (result.success) {
        navigate('/admin-dashboard');
      }
    } catch (error) {
      console.error('Admin login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick login for demo purposes
  const handleQuickAdminLogin = async () => {
    setFormData({
      email: 'ironledgermedmap@gmail.com',
      password: 'Medm@p'
    });
    
    setIsLoading(true);
    try {
      const result = await adminLogin('ironledgermedmap@gmail.com', 'Medm@p');
      if (result.success) {
        navigate('/admin-dashboard');
      }
    } catch (error) {
      console.error('Quick admin login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg mx-auto mb-4">
          <Crown className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl text-purple-900">Administrator Access</CardTitle>
        <CardDescription className="text-purple-700">
          Secure login for IronledgerMedMap administrators
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Security Notice */}
        <Alert className="border-purple-200 bg-purple-50">
          <Shield className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            <strong>Secure Access:</strong> This portal is restricted to authorized IronledgerMedMap administrators only. 
            All login attempts are monitored and logged.
          </AlertDescription>
        </Alert>

        {/* Admin Credentials Information */}
        <Alert className="border-indigo-200 bg-indigo-50">
          <AlertCircle className="h-4 w-4 text-indigo-600" />
          <AlertDescription className="text-indigo-800">
            <strong>Admin Access:</strong> Use your administrator email and password to access the management dashboard.
          </AlertDescription>
        </Alert>

        {/* Quick Admin Login Button */}
        <div className="text-center p-4 bg-white/50 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2">Quick Administrator Access</h4>
          <p className="text-sm text-purple-700 mb-4">
            Click below to access the admin dashboard with your configured credentials
          </p>
          <Button
            onClick={handleQuickAdminLogin}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Authenticating...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Access Admin Dashboard
              </>
            )}
          </Button>
        </div>

        {/* Manual Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="text-purple-900">
              <Mail className="h-4 w-4 inline mr-2" />
              Administrator Email
            </Label>
            <Input
              id="admin-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="ironledgermedmap@gmail.com"
              className="border-purple-200 focus:border-purple-400 focus:ring-purple-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-purple-900">
              <Lock className="h-4 w-4 inline mr-2" />
              Administrator Password
            </Label>
            <div className="relative">
              <Input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter admin password"
                className="border-purple-200 focus:border-purple-400 focus:ring-purple-200 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-purple-100"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-purple-600" />
                ) : (
                  <Eye className="h-4 w-4 text-purple-600" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verifying Credentials...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Sign In as Administrator
              </>
            )}
          </Button>
        </form>

        {/* Admin Features Preview */}
        <div className="bg-white/30 rounded-lg p-4 border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Administrator Capabilities
          </h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Approve and manage doctor applications</li>
            <li>• View real-time user and doctor enrollment data</li>
            <li>• Monitor appointment bookings and notifications</li>
            <li>• Manually add doctors and admin accounts</li>
            <li>• Full platform administration and oversight</li>
          </ul>
        </div>

        <div className="text-center text-xs text-purple-600">
          Protected by enterprise-grade security • All actions are logged and audited
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminQuickLogin;
