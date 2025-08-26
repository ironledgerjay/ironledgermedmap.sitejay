import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/superbaseClient';
import { emailService } from '@/utils/emailService';
import { Shield, Stethoscope, Award, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

const DoctorEnrollment = () => {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: '',
    consultationFee: '',
    bio: '',
    practiceName: '',
    practiceAddress: '',
    city: '',
    province: '',
    availabilityHours: ''
  });

  const specialties = [
    'General Practice',
    'Cardiology',
    'Neurology',
    'Dermatology',
    'Pediatrics',
    'Orthopedic Surgery',
    'Emergency Medicine',
    'Internal Medicine',
    'Psychiatry',
    'Obstetrics & Gynecology'
  ];

  const provinces = [
    'Gauteng',
    'Western Cape',
    'KwaZulu-Natal',
    'Eastern Cape',
    'Free State',
    'Limpopo',
    'Mpumalanga',
    'North West',
    'Northern Cape'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Pre-fill form with user data when component mounts
  useEffect(() => {
    if (user && user.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        fullName: user.profile?.full_name || '',
        phone: user.profile?.phone || ''
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate unique application ID
      const applicationId = `DOC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Check if user is authenticated
      if (!user?.id) {
        throw new Error('User must be logged in to submit doctor enrollment');
      }

      // First, create or update medical practice
      const { data: practiceData, error: practiceError } = await supabase
        .from('medical_practices')
        .insert({
          name: formData.practiceName,
          address: formData.practiceAddress,
          city: formData.city,
          province: formData.province,
          phone: formData.phone,
          email: formData.email,
          is_verified: false,
          specialties: [formData.specialization]
        })
        .select()
        .single();

      if (practiceError) throw practiceError;

      // Insert doctor data with application tracking
      const { data: doctorData, error } = await supabase
        .from('doctors')
        .insert({
          user_id: user.id, // Connect to authenticated user
          practice_id: practiceData.id,
          license_number: formData.licenseNumber,
          specialty: formData.specialization,
          years_of_experience: parseInt(formData.yearsOfExperience),
          consultation_fee: parseFloat(formData.consultationFee),
          bio: formData.bio,
          is_verified: false, // Will be verified by admin
          is_accepting_patients: false, // Will be enabled after approval
          application_status: 'pending',
          application_id: applicationId,
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Send application confirmation email to doctor
      await emailService.sendEmail('verification', {
        to: formData.email,
        name: formData.fullName,
        verificationUrl: `https://ironledgermedmap.co.za/application-status?id=${applicationId}`
      });

      // Create notification for admin (could be enhanced with real-time push notifications)
      const { error: notificationError } = await supabase
        .from('admin_notifications')
        .insert({
          type: 'doctor_application',
          title: 'New Doctor Application',
          message: `${formData.fullName} (${formData.specialization}) has submitted a new application`,
          data: { doctorId: doctorData.id, applicationId },
          read: false,
          created_at: new Date().toISOString()
        });

      if (notificationError) {
        console.error('Failed to create admin notification:', notificationError);
      }

      toast({
        title: "Application Submitted Successfully! 🎉",
        description: `Your application (#${applicationId.split('_')[1]}) has been submitted. You'll receive updates via email from IronledgerMedMap within 48 hours.`,
        duration: 8000,
      });

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        specialization: '',
        licenseNumber: '',
        yearsOfExperience: '',
        consultationFee: '',
        bio: '',
        practiceName: '',
        practiceAddress: '',
        city: '',
        province: '',
        availabilityHours: ''
      });

    } catch (error) {
      console.error('Doctor enrollment error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-full mb-4">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Doctor Enrollment</h1>
          <p className="text-xl text-gray-600">Join IronledgerMedMap and connect with patients across South Africa</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-5 w-5 text-teal-600" />
                <h3 className="font-semibold">Verified Platform</h3>
              </div>
              <p className="text-sm text-gray-600">All doctors are verified for patient safety and trust</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="h-5 w-5 text-teal-600" />
                <h3 className="font-semibold">Professional Growth</h3>
              </div>
              <p className="text-sm text-gray-600">Expand your practice and reach more patients</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-2">
                <Stethoscope className="h-5 w-5 text-teal-600" />
                <h3 className="font-semibold">Easy Management</h3>
              </div>
              <p className="text-sm text-gray-600">Simple tools to manage appointments and patients</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Doctor Registration Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Dr. John Smith"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="doctor@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+27 11 123 4567"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Medical License Number *</Label>
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    placeholder="MP123456"
                    required
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Select onValueChange={(value) => handleSelectChange('specialization', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                  <Input
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    placeholder="5"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultationFee">Consultation Fee (ZAR) *</Label>
                <Input
                  id="consultationFee"
                  name="consultationFee"
                  type="number"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  placeholder="800"
                  min="0"
                  step="50"
                  required
                />
              </div>

              {/* Practice Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="practiceName">Practice Name *</Label>
                  <Input
                    id="practiceName"
                    name="practiceName"
                    value={formData.practiceName}
                    onChange={handleInputChange}
                    placeholder="City Medical Centre"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Cape Town"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="province">Province *</Label>
                  <Select onValueChange={(value) => handleSelectChange('province', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availabilityHours">Availability Hours *</Label>
                  <Input
                    id="availabilityHours"
                    name="availabilityHours"
                    value={formData.availabilityHours}
                    onChange={handleInputChange}
                    placeholder="Mon-Fri: 9AM-5PM"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="practiceAddress">Practice Address *</Label>
                <Input
                  id="practiceAddress"
                  name="practiceAddress"
                  value={formData.practiceAddress}
                  onChange={handleInputChange}
                  placeholder="123 Medical Street, Suburb"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio *</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Brief description of your experience, qualifications, and approach to patient care..."
                  required
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-teal-600 hover:bg-teal-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Doctor Application'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorEnrollment;
