import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Calendar, 
  Users, 
  Phone,
  Menu
} from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">IronledgerMedMap</span>
              <span className="text-xs text-muted-foreground">Find Your Doctor</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#search" className="text-foreground hover:text-primary transition-colors">
              Find Doctors
            </a>
            <a href="#membership" className="text-foreground hover:text-primary transition-colors">
              Membership
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="hidden sm:flex">
              <Phone className="h-3 w-3 mr-1" />
              24/7 Support
            </Badge>
            <Button variant="outline" className="hidden sm:inline-flex">
              <Users className="h-4 w-4 mr-2" />
              For Doctors
            </Button>
            <Button variant="hero">
              <Calendar className="h-4 w-4 mr-2" />
              Book Now
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;