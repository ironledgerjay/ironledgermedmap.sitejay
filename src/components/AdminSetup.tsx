import React, { useState } from 'react';
import { supabase } from '../superbaseClient';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminSetupProps {
  onComplete?: () => void;
}

export default function AdminSetup({ onComplete }: AdminSetupProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.fullName) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.email.includes('@')) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSetupAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'admin'
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create user profile with admin role
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            full_name: formData.fullName,
            role: 'admin',
            email_verified: true,
            created_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw here as the user was created successfully
          toast({
            title: "Warning",
            description: "Admin user created but profile may need manual setup",
            variant: "destructive"
          });
        }

        setIsComplete(true);
        toast({
          title: "Admin Setup Complete!",
          description: `Admin user ${formData.email} has been created successfully`,
        });

        if (onComplete) {
          setTimeout(onComplete, 2000);
        }
      }
    } catch (error) {
      console.error('Admin setup error:', error);
      toast({
        title: "Setup Failed",
        description: error instanceof Error ? error.message : "Failed to create admin user",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isComplete) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Setup Complete!</CardTitle>
          <CardDescription>
            Admin user has been created successfully
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              You can now log in with the admin credentials you just created.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl">Admin Setup</CardTitle>
        <CardDescription>
          Create your first administrator account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Security Notice</AlertTitle>
          <AlertDescription>
            This will create an administrator account with full system access. 
            Choose a strong password and keep these credentials secure.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSetupAdmin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Administrator Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="admin@ironledgermedmap.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Choose a strong password"
              required
              minLength={8}
            />
            <p className="text-sm text-muted-foreground">
              Password must be at least 8 characters long
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Setting up Admin...' : 'Create Admin Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
