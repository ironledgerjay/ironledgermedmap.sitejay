import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Check, 
  Star, 
  Gift, 
  Clock,
  Shield,
  Users,
  Zap
} from "lucide-react";

const MembershipSection = () => {
  return (
    <section id="membership" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-primary text-white">
            <Crown className="h-3 w-3 mr-1" />
            Exclusive Membership
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Save More with 
            <span className="text-primary"> MedMap Membership</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of South Africans who save on medical appointments with our premium membership program.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Pay-per-booking */}
          <Card className="relative border-2 border-border hover:border-primary/50 transition-all duration-300">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-secondary">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Pay-Per-Booking</CardTitle>
              <div className="text-center">
                <span className="text-4xl font-bold text-foreground">R10</span>
                <span className="text-muted-foreground"> per booking</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3" />
                  <span>Instant doctor booking</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3" />
                  <span>Convenience fee per appointment</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3" />
                  <span>Basic customer support</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3" />
                  <span>Appointment reminders</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-6">
                Book Now
              </Button>
            </CardContent>
          </Card>

          {/* Premium Membership */}
          <Card className="relative border-2 border-primary shadow-glow overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute -top-1 -right-1">
              <div className="bg-gradient-primary text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
                <Star className="h-3 w-3 inline mr-1" />
                Most Popular
              </div>
            </div>

            <CardHeader className="text-center pb-8 bg-gradient-subtle">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-primary">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Premium Membership</CardTitle>
              <div className="text-center">
                <span className="text-4xl font-bold text-primary">R39</span>
                <span className="text-muted-foreground"> one-time</span>
              </div>
              <Badge variant="secondary" className="mx-auto">
                <Gift className="h-3 w-3 mr-1" />
                5 Free Bookings Included
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3" />
                  <span className="font-medium">First 5 bookings completely FREE</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3" />
                  <span>Priority appointment scheduling</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3" />
                  <span>24/7 premium support</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3" />
                  <span>Exclusive specialist access</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3" />
                  <span>Health records management</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3" />
                  <span>Family member bookings</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3" />
                  <span>Special discounts & promotions</span>
                </div>
              </div>
              <Button variant="hero" className="w-full mt-6">
                <Zap className="h-4 w-4 mr-2" />
                Become Premium Member
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Why Choose MedMap Membership?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Secure & Trusted</h4>
              <p className="text-muted-foreground">All payments are secure and your medical information is protected.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Family Coverage</h4>
              <p className="text-muted-foreground">Premium members can book for family members at no extra cost.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Instant Booking</h4>
              <p className="text-muted-foreground">Book appointments 24/7 with real-time availability.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;