import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Shield,
  FileText
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="space-y-4 lg:col-span-2">
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
              <a href="https://facebook.com/ironledgermedmap" target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="border-background/20 text-background hover:bg-background/10">
                  <Facebook className="h-4 w-4" />
                </Button>
              </a>
              <a href="https://twitter.com/ironledgermedmap" target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="border-background/20 text-background hover:bg-background/10">
                  <Twitter className="h-4 w-4" />
                </Button>
              </a>
              <a href="https://instagram.com/ironledgermedmap" target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="border-background/20 text-background hover:bg-background/10">
                  <Instagram className="h-4 w-4" />
                </Button>
              </a>
              <a href="https://linkedin.com/company/ironledgermedmap" target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="border-background/20 text-background hover:bg-background/10">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/search" className="opacity-80 hover:opacity-100 transition-opacity">Find Doctors</Link></li>
              <li><Link to="/book-appointment" className="opacity-80 hover:opacity-100 transition-opacity">Book Appointment</Link></li>
              <li><Link to="/membership" className="opacity-80 hover:opacity-100 transition-opacity">Membership Plans</Link></li>
              <li><Link to="/emergency-doctors" className="opacity-80 hover:opacity-100 transition-opacity">Emergency Booking</Link></li>
              <li><Link to="/about" className="opacity-80 hover:opacity-100 transition-opacity">About Us</Link></li>
            </ul>
          </div>

          {/* For Doctors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Healthcare Providers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/doctor-enrollment" className="opacity-80 hover:opacity-100 transition-opacity">Join Our Network</Link></li>
              <li><Link to="/doctor-portal" className="opacity-80 hover:opacity-100 transition-opacity">Doctor Dashboard</Link></li>
              <li><Link to="/doctor-terms" className="opacity-80 hover:opacity-100 transition-opacity">Provider Terms</Link></li>
              <li><Link to="/medical-disclaimers" className="opacity-80 hover:opacity-100 transition-opacity">Medical Guidelines</Link></li>
              <li><Link to="/contact" className="opacity-80 hover:opacity-100 transition-opacity">Support Center</Link></li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Legal & Compliance
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms-of-service" className="opacity-80 hover:opacity-100 transition-opacity">Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className="opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
              <li><Link to="/medical-disclaimers" className="opacity-80 hover:opacity-100 transition-opacity">Medical Disclaimers</Link></li>
              <li><Link to="/cookie-policy" className="opacity-80 hover:opacity-100 transition-opacity">Cookie Policy</Link></li>
              <li><Link to="/contact" className="opacity-80 hover:opacity-100 transition-opacity">POPI Act Compliance</Link></li>
            </ul>
            <div className="mt-4 p-3 bg-background/10 rounded-lg">
              <p className="text-xs opacity-80 flex items-center">
                <FileText className="h-3 w-3 mr-1" />
                POPI Act Compliant • HPCSA Approved
              </p>
            </div>
          </div>
        </div>

        {/* Contact & Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-background/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 opacity-80" />
                  <span className="opacity-80">0800 MEDMAP (633627)</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 opacity-80" />
                  <span className="opacity-80">support@ironledgermedmap.com</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 opacity-80" />
                  <span className="opacity-80">Cape Town, South Africa</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Stay Updated</h3>
              <p className="text-sm opacity-80">Subscribe to our newsletter for health tips, platform updates, and medical news</p>
              <div className="flex space-x-2">
                <Input
                  placeholder="Your email address"
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/60"
                />
                <Button variant="outline" className="border-background/20 text-background hover:bg-background/10">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs opacity-60">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from IronledgerMedMap.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-sm opacity-80 text-center lg:text-left">
              © 2025 IronledgerMedMap. All rights reserved. | Ironledger (Pty) Ltd | Registration: [Company Registration Number]
            </div>
            <div className="flex flex-wrap justify-center lg:justify-end gap-4 lg:gap-6 text-sm">
              <Link to="/privacy-policy" className="opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</Link>
              <Link to="/terms-of-service" className="opacity-80 hover:opacity-100 transition-opacity">Terms of Service</Link>
              <Link to="/cookie-policy" className="opacity-80 hover:opacity-100 transition-opacity">Cookie Policy</Link>
              <Link to="/medical-disclaimers" className="opacity-80 hover:opacity-100 transition-opacity">Medical Disclaimers</Link>
              <Link to="/doctor-terms" className="opacity-80 hover:opacity-100 transition-opacity">Provider Terms</Link>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-background/20">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
              <div className="text-xs opacity-60 text-center md:text-left">
                This platform complies with the Protection of Personal Information Act (POPI Act) and is approved by the Health Professions Council of South Africa (HPCSA).
              </div>
              <div className="flex items-center space-x-4 text-xs opacity-60">
                <span className="flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  POPI Compliant
                </span>
                <span className="flex items-center">
                  <FileText className="h-3 w-3 mr-1" />
                  HPCSA Approved
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
