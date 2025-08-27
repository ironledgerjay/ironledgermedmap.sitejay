import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Globe, 
  Heart, 
  Shield, 
  Users, 
  Clock, 
  Star,
  CheckCircle,
  Target,
  Eye,
  Building,
  Stethoscope,
  Calendar,
  MapPin,
  Award,
  TrendingUp
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20">
            About IronledgerMedMap
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Transforming Healthcare
            <span className="block text-primary-glow">Globally</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            A revolutionary platform connecting patients with healthcare providers worldwide, 
            making quality medical care accessible to everyone, everywhere.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-xl text-muted-foreground">
                Born from a vision to democratize healthcare access
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-bold mb-6">The IronLedger Group Legacy</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  IronledgerMedMap is a proud sub-division of the <strong>IronLedger Group</strong>, 
                  a forward-thinking technology company founded and led by <strong>Ofentse Mashau</strong>, 
                  our visionary CEO and Owner.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  Under Ofentse's leadership, the IronLedger Group has been at the forefront of 
                  technological innovation, and IronledgerMedMap represents our commitment to 
                  revolutionizing the healthcare industry through cutting-edge technology.
                </p>
                <div className="flex items-center space-x-4">
                  <Building className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-semibold">IronLedger Group</p>
                    <p className="text-sm text-muted-foreground">Parent Company</p>
                  </div>
                </div>
              </div>
              <Card className="bg-gradient-subtle border-none shadow-medical">
                <CardContent className="p-8 text-center">
                  <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-white shadow-lg">
                    <AvatarImage
                      src="/placeholder.svg"
                      alt="Ofentse Mashau - CEO & Founder of IronLedger Group"
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
                      OM
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="text-xl font-bold mb-2">Ofentse Mashau</h4>
                  <p className="text-muted-foreground mb-4">CEO & Founder</p>
                  <Badge variant="secondary" className="mb-4">Visionary Leader</Badge>
                  <p className="text-sm text-muted-foreground">
                    Leading the charge in healthcare innovation and technological advancement
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Mission & Vision</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Driving global healthcare transformation through technology and innovation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border-primary/20 shadow-medical">
              <CardHeader className="text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To create a seamless, globally accessible healthcare platform that connects 
                  patients with qualified healthcare providers, eliminating barriers to quality 
                  medical care regardless of location, economic status, or healthcare system.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-medical">
              <CardHeader className="text-center">
                <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To become the world's leading healthcare platform, where anyone, anywhere 
                  can effortlessly find, book, and receive quality medical care from verified 
                  healthcare professionals in both private and public sectors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Global Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Globe className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Global Healthcare Vision</h2>
            <p className="text-xl text-muted-foreground mb-12">
              Our ultimate mission is to create an international healthcare ecosystem where 
              people everywhere in the world—across private and public health sectors—can 
              seamlessly search, book, and access healthcare professionals based on their 
              preferences, needs, and circumstances.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Global Reach</h3>
                <p className="text-muted-foreground">
                  Connecting healthcare providers and patients across continents
                </p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Universal Access</h3>
                <p className="text-muted-foreground">
                  Making quality healthcare accessible regardless of location or status
                </p>
              </div>
              <div className="text-center">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Better Outcomes</h3>
                <p className="text-muted-foreground">
                  Improving health outcomes through better access and convenience
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points & Solutions */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Solving Real Problems</h2>
            <p className="text-xl text-muted-foreground">
              Addressing critical challenges in modern healthcare
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Patient Pain Points */}
            <Card className="shadow-medical">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Users className="h-6 w-6 mr-3 text-primary" />
                  For Patients
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-red-600">Current Pain Points:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Long waiting times for appointments</li>
                    <li>• Difficulty finding specialists</li>
                    <li>• Limited access to doctor information</li>
                    <li>• Complex booking processes</li>
                    <li>• Lack of price transparency</li>
                    <li>• Geographic limitations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">Our Solutions:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Instant online booking 24/7
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Comprehensive doctor profiles & ratings
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Transparent pricing information
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Advanced search & filtering
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Global access to healthcare
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Doctor Pain Points */}
            <Card className="shadow-medical">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Stethoscope className="h-6 w-6 mr-3 text-primary" />
                  For Healthcare Providers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-red-600">Current Pain Points:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Administrative burden</li>
                    <li>• Limited patient reach</li>
                    <li>• No-shows and cancellations</li>
                    <li>• Inefficient scheduling systems</li>
                    <li>• Marketing challenges</li>
                    <li>• Revenue gaps from empty slots</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">Our Solutions:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Automated scheduling & reminders
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Expanded patient base globally
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Professional profile management
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Analytics & practice insights
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Secure payment processing
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Advantages */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose IronledgerMedMap?</h2>
            <p className="text-xl text-muted-foreground">
              Revolutionary advantages that set us apart
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-primary/20 shadow-medical hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">24/7 Access</h3>
                <p className="text-sm text-muted-foreground">
                  Book appointments anytime, anywhere
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-primary/20 shadow-medical hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Verified Providers</h3>
                <p className="text-sm text-muted-foreground">
                  All doctors are thoroughly verified
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-primary/20 shadow-medical hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Smart Matching</h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered doctor recommendations
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-primary/20 shadow-medical hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Quality Assured</h3>
                <p className="text-sm text-muted-foreground">
                  Continuous quality monitoring
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join the Healthcare Revolution
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Be part of the global movement towards accessible, efficient, and quality healthcare for all.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              <Calendar className="h-5 w-5 mr-2" />
              Book Your First Appointment
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Stethoscope className="h-5 w-5 mr-2" />
              Join as a Provider
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
