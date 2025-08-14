import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Check, Star, Users, Phone, Shield } from "lucide-react";
import Header from "@/components/Header";

const membershipPlans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 0,
    period: 'Free',
    features: [
      'Access to general practitioners',
      'Basic appointment booking',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement payment processing and membership creation
    console.log('Membership signup:', { selectedPlan, formData });
  };

  const selectedPlanDetails = membershipPlans.find(plan => plan.id === selectedPlan);

  return (
    <div className="min-h-screen bg-background">
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
                      <span className="font-semibold">${selectedPlanDetails?.price}/{selectedPlanDetails?.period}</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Proceed to Payment
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
