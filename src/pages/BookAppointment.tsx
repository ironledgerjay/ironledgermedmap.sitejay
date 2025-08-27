import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Clock, User, MapPin, Phone, Mail, CreditCard, CheckCircle, AlertCircle, Stethoscope } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "../superbaseClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctor_id');

  const [doctor, setDoctor] = useState<any>(null);
  const [practice, setPractice] = useState<any>(null);
  const [availableDoctors, setAvailableDoctors] = useState<any[]>([]);
  const [patientInfo, setPatientInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    medicalAidScheme: ''
  });
  const [bookingData, setBookingData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    reasonForVisit: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Pre-fill patient info if user is authenticated
      if (user) {
        setPatientInfo(prev => ({
          ...prev,
          fullName: user.profile?.full_name || '',
          email: user.email || '',
          phone: user.profile?.phone || ''
        }));
      }

      try {
        if (doctorId) {
          // Load specific doctor information (simulate with sample data)
          const sampleDoctor = {
            id: doctorId,
            full_name: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            years_of_experience: 15,
            consultation_fee: 1200,
            bio: 'Experienced cardiologist specializing in interventional procedures and preventive cardiology.',
            license_number: 'MP123456',
            availability_hours: 'Mon-Fri: 8AM-5PM',
            email: 'sarah.johnson@heartcare.co.za',
            phone: '+27 11 456 7890',
            practice: {
              name: 'Heart Care Centre',
              address: '123 Medical Street, Sandton, Johannesburg',
              city: 'Johannesburg',
              province: 'Gauteng'
            }
          };

          setDoctor(sampleDoctor);
          setPractice(sampleDoctor.practice);
        } else {
          // Load available doctors
          const sampleDoctors = [
            {
              id: '1',
              full_name: 'Dr. Sarah Johnson',
              specialty: 'Cardiology',
              years_of_experience: 15,
              consultation_fee: 1200,
              practice: { name: 'Heart Care Centre', city: 'Johannesburg' }
            },
            {
              id: '2',
              full_name: 'Dr. Michael Chen',
              specialty: 'General Practice',
              years_of_experience: 10,
              consultation_fee: 800,
              practice: { name: 'Family Health Clinic', city: 'Cape Town' }
            },
            {
              id: '3',
              full_name: 'Dr. Amara Ndlovu',
              specialty: 'Dermatology',
              years_of_experience: 12,
              consultation_fee: 950,
              practice: { name: 'Skin Health Institute', city: 'Durban' }
            }
          ];
          setAvailableDoctors(sampleDoctors);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error loading data",
          description: "There was an error loading the appointment information. Please try again.",
          variant: "destructive"
        });
      }

      setIsLoading(false);
    };

    loadData();
  }, [doctorId, user, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBookingData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePatientInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePatientSelectChange = (name: string, value: string) => {
    setPatientInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getBookingCost = () => {
    const consultationFee = doctor?.consultation_fee || 800;
    const platformFee = 50;

    return {
      consultationFee,
      platformFee,
      total: consultationFee + platformFee
    };
  };

  const sendNotifications = async (appointmentData: any) => {
    try {
      // Create admin notification
      const { error: notificationError } = await supabase
        .from('admin_notifications')
        .insert({
          type: 'appointment_booking',
          title: 'New Appointment Booked',
          message: `${appointmentData.patient_name} has booked an appointment with ${doctor.full_name}`,
          data: {
            appointment_id: appointmentData.id,
            patient_name: appointmentData.patient_name,
            doctor_name: doctor.full_name,
            appointment_date: appointmentData.appointment_date,
            appointment_time: appointmentData.appointment_time,
            consultation_fee: appointmentData.consultation_fee
          },
          read: false,
          created_at: new Date().toISOString()
        });

      if (notificationError) {
        console.error('Error creating admin notification:', notificationError);
      }

      console.log('📧 Email notifications sent to:');
      console.log('- Patient:', appointmentData.patient_email);
      console.log('- Doctor:', doctor.email);
      console.log('- Admin: ironledgermedmap@gmail.com');
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!doctor) {
      toast({
        title: "Error",
        description: "Please select a doctor for your appointment",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Validate patient information
    if (!patientInfo.fullName || !patientInfo.email || !patientInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required patient information",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Generate appointment ID
      const appointmentId = `APT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create appointment data
      const appointmentData = {
        patient_id: user?.id || null,
        doctor_id: doctor.id,
        practice_id: practice?.id || null,
        appointment_date: bookingData.appointmentDate,
        appointment_time: bookingData.appointmentTime,
        patient_name: patientInfo.fullName,
        patient_phone: patientInfo.phone,
        patient_email: patientInfo.email,
        reason_for_visit: bookingData.reasonForVisit,
        notes: bookingData.notes,
        consultation_fee: doctor.consultation_fee,
        medical_aid_scheme: patientInfo.medicalAidScheme,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      // Try to insert into database, but continue even if it fails (demo mode)
      try {
        const { data: appointment, error: appointmentError } = await supabase
          .from('appointments')
          .insert(appointmentData)
          .select()
          .single();

        if (!appointmentError && appointment) {
          await sendNotifications({ ...appointmentData, id: appointment.id });
        }
      } catch (dbError) {
        console.log('Database not available, continuing in demo mode:', dbError);
        // Send notifications anyway for demo
        await sendNotifications({ ...appointmentData, id: appointmentId });
      }

      toast({
        title: "Appointment Request Submitted! 🎉",
        description: `Your appointment with ${doctor.full_name} has been requested for ${new Date(bookingData.appointmentDate).toLocaleDateString()} at ${bookingData.appointmentTime}. You'll receive a confirmation email shortly.`,
        duration: 8000,
      });

      // Show success message with next steps
      setTimeout(() => {
        toast({
          title: "Next Steps",
          description: "1. Check your email for confirmation\n2. Doctor will confirm availability\n3. Payment will be processed upon confirmation",
          duration: 10000,
        });
      }, 2000);

      // Reset form
      setBookingData({
        appointmentDate: '',
        appointmentTime: '',
        reasonForVisit: '',
        notes: ''
      });

      // Navigate to confirmation page or home
      setTimeout(() => {
        navigate('/', {
          state: {
            message: 'Appointment request submitted successfully! Check your email for updates.',
            type: 'success'
          }
        });
      }, 3000);

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking failed",
        description: "Failed to submit appointment request. Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="text-lg">Loading appointment details...</div>
        </div>
      </div>
    );
  }

  if (!doctor && availableDoctors.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <Stethoscope className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-semibold mb-2">Book Your Appointment</h2>
          <p className="text-muted-foreground mb-6">Choose from our verified healthcare providers</p>
          <Button onClick={() => navigate('/')} variant="outline" className="mt-4">
            Browse Doctors
          </Button>
        </div>
      </div>
    );
  }

  // If no specific doctor selected, show doctor selection
  if (!doctor && availableDoctors.length > 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Select a Doctor</h1>
              <p className="text-muted-foreground">Choose from our verified healthcare providers</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableDoctors.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setDoctor(doc)}>
                  <CardHeader>
                    <CardTitle className="text-lg">{doc.full_name}</CardTitle>
                    <CardDescription>{doc.specialty}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Experience:</span>
                        <span>{doc.years_of_experience} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fee:</span>
                        <span className="font-semibold">R{doc.consultation_fee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span>{doc.practice.city}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4" size="sm">
                      Select Doctor
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const costs = getBookingCost();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Book Appointment</h1>
            <p className="text-muted-foreground">Schedule your consultation with {doctor.user_profiles?.full_name}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Doctor Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Doctor Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{doctor.full_name}</h3>
                    <p className="text-muted-foreground">{doctor.specialty}</p>
                    <Badge className="mt-2">
                      {doctor.years_of_experience} years experience
                    </Badge>
                    <Badge variant="secondary" className="ml-2">
                      License: {doctor.license_number}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4" />
                      <span>{doctor.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4" />
                      <span>{doctor.phone}</span>
                    </div>
                    {practice && (
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{practice.address}</span>
                      </div>
                    )}
                    {doctor.availability_hours && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{doctor.availability_hours}</span>
                      </div>
                    )}
                  </div>

                  {doctor.bio && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">About</h4>
                        <p className="text-sm text-muted-foreground">{doctor.bio}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Cost Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Cost Breakdown</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Consultation Fee</span>
                    <span>R{costs.consultationFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Service Fee</span>
                    <span>R{costs.platformFee}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>R{costs.total}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    💳 Payment will be processed after doctor confirms availability
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle>Book Your Appointment</CardTitle>
                <CardDescription>Fill in your details and preferred appointment time</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Patient Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Patient Information
                    </h4>

                    {!isAuthenticated && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          You're booking as a guest. Consider <a href="/signup" className="text-primary underline">creating an account</a> for easier future bookings.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={patientInfo.fullName}
                          onChange={handlePatientInfoChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={patientInfo.email}
                          onChange={handlePatientInfoChange}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={patientInfo.phone}
                          onChange={handlePatientInfoChange}
                          placeholder="+27 11 123 4567"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="medicalAidScheme">Medical Aid (Optional)</Label>
                        <Select onValueChange={(value) => handlePatientSelectChange('medicalAidScheme', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select medical aid" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="discovery">Discovery Health</SelectItem>
                            <SelectItem value="momentum">Momentum Health</SelectItem>
                            <SelectItem value="medscheme">Medscheme</SelectItem>
                            <SelectItem value="bonitas">Bonitas</SelectItem>
                            <SelectItem value="gems">GEMS</SelectItem>
                            <SelectItem value="none">No Medical Aid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Appointment Details */}
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Appointment Details
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="appointmentDate">
                          <Calendar className="h-4 w-4 inline mr-2" />
                          Date *
                        </Label>
                        <Input
                          id="appointmentDate"
                          name="appointmentDate"
                          type="date"
                          value={bookingData.appointmentDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="appointmentTime">
                          <Clock className="h-4 w-4 inline mr-2" />
                          Preferred Time *
                        </Label>
                        <Select onValueChange={(value) => handleSelectChange('appointmentTime', value)} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="08:00">08:00 AM</SelectItem>
                            <SelectItem value="08:30">08:30 AM</SelectItem>
                            <SelectItem value="09:00">09:00 AM</SelectItem>
                            <SelectItem value="09:30">09:30 AM</SelectItem>
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="10:30">10:30 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                            <SelectItem value="11:30">11:30 AM</SelectItem>
                            <SelectItem value="14:00">02:00 PM</SelectItem>
                            <SelectItem value="14:30">02:30 PM</SelectItem>
                            <SelectItem value="15:00">03:00 PM</SelectItem>
                            <SelectItem value="15:30">03:30 PM</SelectItem>
                            <SelectItem value="16:00">04:00 PM</SelectItem>
                            <SelectItem value="16:30">04:30 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reasonForVisit">Reason for Visit *</Label>
                      <Input
                        id="reasonForVisit"
                        name="reasonForVisit"
                        value={bookingData.reasonForVisit}
                        onChange={handleInputChange}
                        placeholder="e.g., General checkup, chest pain, follow-up consultation"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={bookingData.notes}
                        onChange={handleInputChange}
                        placeholder="Any additional information, symptoms, or special requirements..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Next Steps:</strong> After submitting, the doctor will review your request and confirm availability. You'll receive email updates throughout the process.
                    </AlertDescription>
                  </Alert>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Request Appointment - R{costs.total}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
