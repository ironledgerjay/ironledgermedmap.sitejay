import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Stethoscope, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin 
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">IronledgerMedMap</span>
                <span className="text-xs opacity-80">Find Your Doctor</span>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              South Africa's premier medical booking platform. Connecting patients with qualified healthcare professionals across the country.
            </p>
            <div className="flex space-x-3">
              <Button size="sm" variant="outline" className="border-background/20 text-background hover:bg-background/10">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-background/20 text-background hover:bg-background/10">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-background/20 text-background hover:bg-background/10">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-background/20 text-background hover:bg-background/10">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Find Doctors</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Book Appointment</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Membership Plans</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Emergency Booking</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Health Records</a></li>
            </ul>
          </div>

          {/* For Doctors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Healthcare Providers</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Join Our Network</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Doctor Dashboard</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Manage Schedule</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Patient Management</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Support Center</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Connected</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 opacity-80" />
                <span className="opacity-80">0800 MEDMAP (633627)</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 opacity-80" />
                <span className="opacity-80">ironledgermedmap@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 opacity-80" />
                <span className="opacity-80">Cape Town, South Africa</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm opacity-80">Subscribe to our newsletter for health tips and updates</p>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Your email" 
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/60"
                />
                <Button variant="outline" className="border-background/20 text-background hover:bg-background/10">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm opacity-80">
              © 2024 IronledgerMedMap. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</a>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Terms of Service</a>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Cookie Policy</a>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">PAIA Manual</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
