import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../superbaseClient';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Eye, EyeOff, LogIn, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminQuickLoginProps {
  onLoginSuccess?: () => void;
  compact?: boolean;
}

export default function AdminQuickLogin({ onLoginSuccess, compact = false }: AdminQuickLoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      // First try regular Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        // If Supabase auth fails, check for demo admin credentials
        if (formData.email === 'admin@ironledgermedmap.com' && formData.password === 'admin123') {
          // Set admin session in localStorage for demo
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('userEmail', formData.email);
          
          toast({
            title: "🚀 Admin Access Granted!",
            description: "Welcome to the IronledgerMedMap Admin Dashboard",
            duration: 4000,
          });

          if (onLoginSuccess) {
            onLoginSuccess();
          } else {
            navigate('/admin-dashboard');
          }
          return;
        }
        throw error;
      }

      if (data.user) {
        // Check if user has admin role
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('role, email')
          .eq('id', data.user.id)
          .single();

        if (profileError || profile?.role !== 'admin') {
          // Sign out the user if they're not admin
          await supabase.auth.signOut();
          throw new Error('Access denied: Admin privileges required');
        }

        // Set admin session
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('userEmail', data.user.email || '');

        toast({
          title: "🚀 Admin Access Granted!",
          description: `Welcome back, ${profile.email}`,
          duration: 4000,
        });

        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          navigate('/admin-dashboard');
        }
      }
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Invalid admin credentials",
        variant: "destructive",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickFillDemo = () => {
    setFormData({
      email: 'admin@ironledgermedmap.com',
      password: 'admin123'
    });
  };

  if (compact) {
    return (
      <Card className="w-full max-w-sm border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Crown className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-amber-800">Quick Admin Access</h3>
          </div>
          <Button 
            onClick={quickFillDemo}
            variant="outline" 
            className="w-full mb-3 border-amber-300 hover:bg-amber-100"
          >
            <Shield className="h-4 w-4 mr-2" />
            Demo Admin Login
          </Button>
          <form onSubmit={handleAdminLogin} className="space-y-3">
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="admin@ironledgermedmap.com"
              required
              className="text-sm"
            />
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter admin password"
                required
                className="text-sm pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-7 w-7 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full text-sm">
              {isLoading ? 'Authenticating...' : 'Admin Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto border-amber-200 shadow-xl">
      <CardHeader className="text-center bg-gradient-to-r from-amber-100 to-orange-100 rounded-t-lg">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl mx-auto mb-4 shadow-lg">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl text-amber-800 flex items-center justify-center gap-2">
          <Shield className="h-6 w-6" />
          Admin Login
        </CardTitle>
        <CardDescription className="text-amber-700">
          Administrative access to IronledgerMedMap platform
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Demo Access:</strong> Use the demo button below for quick access, or enter your admin credentials.
          </AlertDescription>
        </Alert>

        <div className="mb-6">
          <Button 
            onClick={quickFillDemo}
            variant="outline" 
            className="w-full border-amber-300 hover:bg-amber-100 text-amber-700"
          >
            <Shield className="h-4 w-4 mr-2" />
            Fill Demo Admin Credentials
          </Button>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-amber-800">Admin Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="admin@ironledgermedmap.com"
              required
              className="border-amber-200 focus:border-amber-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-amber-800">Admin Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your admin password"
                required
                className="border-amber-200 focus:border-amber-400 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-amber-100"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Authenticating...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Access Admin Dashboard
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-amber-200">
          <div className="flex items-center justify-center space-x-2">
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              <Shield className="h-3 w-3 mr-1" />
              Secure Access
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              24/7 Monitoring
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
