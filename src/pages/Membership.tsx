import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Check, Star, Users, Phone, Shield } from "lucide-react";
import Header from "@/components/Header";
import HomeButton from "@/components/HomeButton";
import { usePayment } from "@/hooks/usePayment";
import { supabase } from "../superbaseClient";
import { useToast } from "@/hooks/use-toast";
import { CRMService } from "@/utils/crmService";

const membershipPlans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 0,
    period: 'Free',
    features: [
      'Access to general practitioners',
      'Basic appointment booking',
      'R10 booking convenience fee per appointment',
      'Email support',
      'Health record storage',
      'Find nearby doctors'
    ],
    icon: Shield,
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 39,
    period: 'quarterly',
    features: [
      'Unlimited appointments',
      'First 5 bookings FREE after renewal',
      'Specialist consultations',
      'Priority booking',
      '24/7 phone support',
      'Advanced health analytics',
      'Prescription management',
      'Telemedicine consultations',
      'Health reports & insights'
    ],
    icon: Star,
    popular: true
  }
];

const Membership = () => {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  const [currentUser, setCurrentUser] = useState<any>(null);

  const navigate = useNavigate();
  const { processMembershipPayment, isProcessing } = usePayment();
  const { toast } = useToast();

  // Check if user is logged in
  useState(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Please sign in",
          description: "You need to be logged in to purchase a membership",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }
      setCurrentUser(user);

      // Pre-fill form with user data if available
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFormData(prev => ({
          ...prev,
          fullName: profile.full_name || '',
          email: profile.email || '',
          phone: profile.phone || ''
        }));
      }
    };
    checkUser();
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    try {
      // Update user profile with additional information
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: currentUser.id,
          email: formData.email,
          full_name: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          emergency_contact_name: formData.emergencyContact,
          emergency_contact_phone: formData.emergencyPhone
        });

      if (profileError) {
        console.error('Profile update error:', profileError);
      }

      // Process payment
      const paymentResult = await processMembershipPayment(selectedPlan, currentUser.id);

      if (paymentResult.success) {
        // Send membership data to CRM
        try {
          const selectedPlanDetails = membershipPlans.find(plan => plan.id === selectedPlan);
          await CRMService.updateUserMembership(
            formData.email,
            selectedPlan,
            selectedPlanDetails?.price || 0
          );
        } catch (crmError) {
          console.warn('CRM integration error:', crmError);
          // Don't block membership if CRM fails
        }

        toast({
          title: "Membership activated!",
          description: `Your ${selectedPlan} membership has been activated successfully.`
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Membership signup error:', error);
      toast({
        title: "Error",
        description: "Failed to process membership. Please try again.",
        variant: "destructive"
      });
    }
  };

  const selectedPlanDetails = membershipPlans.find(plan => plan.id === selectedPlan);

  return (
    <div className="min-h-screen bg-background">
      <HomeButton />
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Health Membership
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get access to quality healthcare with our comprehensive membership plans
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Membership Plans */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Select a Plan</h2>
            <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
              {membershipPlans.map((plan) => {
                const Icon = plan.icon;
                return (
                  <div key={plan.id} className="relative">
                    <Card className={`cursor-pointer transition-all ${
                      selectedPlan === plan.id ? 'ring-2 ring-primary border-primary' : ''
                    } ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                            Most Popular
                          </span>
                        </div>
                      )}
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={plan.id} id={plan.id} />
                            <Icon className="h-6 w-6 text-primary" />
                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                          </div>
                          <div className="text-right">
                            {plan.price === 0 ? (
                              <span className="text-3xl font-bold text-green-600">Free</span>
                            ) : (
                              <>
                                <span className="text-3xl font-bold">R{plan.price}</span>
                                <span className="text-muted-foreground">/{plan.period}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Membership Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Membership</CardTitle>
                <CardDescription>
                  Provide your details to activate your {selectedPlanDetails?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                      <Input
                        id="emergencyPhone"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Order Summary</h3>
                    <div className="flex justify-between items-center">
                      <span>{selectedPlanDetails?.name}</span>
                      <span className="font-semibold">
                        {selectedPlanDetails?.price === 0 ? 'Free' : `R${selectedPlanDetails?.price}/${selectedPlanDetails?.period}`}
                      </span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                    {isProcessing
                      ? 'Processing...'
                      : selectedPlanDetails?.price === 0
                        ? 'Activate Basic Plan'
                        : 'Proceed to Payment'
                    }
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

export default Membership;
