import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2 } from "lucide-react";
import { supabase } from "../superbaseClient";
import { useToast } from "@/hooks/use-toast";

const TestUserRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'patient'
  });
  
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateRandomUser = () => {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily', 'James', 'Maria'];
    const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas'];
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    
    setFormData({
      full_name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
      phone: `+27 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
      role: Math.random() > 0.7 ? 'doctor' : 'patient'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // First, try to create a new user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: 'TempPassword123!', // Temporary password for testing
        options: {
          data: {
            full_name: formData.full_name,
            phone: formData.phone,
            role: formData.role
          }
        }
      });

      if (authError) {
        // If user already exists, that's okay for testing purposes
        if (authError.message.includes('already registered')) {
          // Create a direct user profile entry for testing
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              full_name: formData.full_name,
              email: formData.email,
              phone: formData.phone,
              role: formData.role
            });

          if (profileError) {
            console.error('Error creating profile directly:', profileError);
            throw new Error('Failed to create user profile');
          }
        } else {
          throw authError;
        }
      } else {
        // If auth user was created successfully, create the profile
        const userId = authData.user?.id;
        if (userId) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: userId,
              full_name: formData.full_name,
              email: formData.email,
              phone: formData.phone,
              role: formData.role
            });

          if (profileError) {
            console.error('Error creating profile:', profileError);
          }
        }
      }

      // If the user is a doctor, create a doctor record too
      if (formData.role === 'doctor') {
        const specialties = ['Cardiology', 'Family Medicine', 'Neurology', 'Pediatrics', 'Dermatology', 'Orthopedic Surgery'];
        const randomSpecialty = specialties[Math.floor(Math.random() * specialties.length)];
        
        const { error: doctorError } = await supabase
          .from('doctors')
          .insert({
            specialty: randomSpecialty,
            years_of_experience: Math.floor(Math.random() * 20) + 1,
            consultation_fee: Math.floor(Math.random() * 1000) + 500,
            bio: `Experienced ${randomSpecialty.toLowerCase()} specialist.`,
            license_number: `MP${Math.floor(Math.random() * 900000) + 100000}`,
            verification_status: 'pending'
          });

        if (doctorError) {
          console.error('Error creating doctor profile:', doctorError);
        }
      }

      toast({
        title: "User Created Successfully",
        description: `${formData.role === 'doctor' ? 'Dr. ' : ''}${formData.full_name} has been registered.`,
      });

      // Clear form
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        role: 'patient'
      });

    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to create user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Test User Registration
        </CardTitle>
        <CardDescription>
          Create test users to see real-time updates in the admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient">Patient</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create User
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={generateRandomUser}
              disabled={loading}
            >
              Random
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TestUserRegistration;
