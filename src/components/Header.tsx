import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Stethoscope,
  Calendar,
  Users,
  Phone,
  Menu,
  LogOut,
  Shield,
  Sparkles,
  Crown,
  Search,
  X,
  Home,
  Info,
  Mail,
  UserPlus
} from "lucide-react";

const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = () => {
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      const adminEmail = localStorage.getItem('userEmail');
      setIsAdmin(adminStatus && adminEmail === 'admin@ironledgermedmap.com');
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    checkAdminStatus();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', checkAdminStatus);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkAdminStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userEmail');
    setIsAdmin(false);
    navigate('/');
  };
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-primary/20'
        : 'bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl shadow-medical group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
              <Stethoscope className="h-7 w-7 text-white group-hover:animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                IronledgerMedMap
              </span>
              <span className="text-xs text-muted-foreground flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Find Your Doctor
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/#search" className="text-foreground hover:text-primary transition-colors">
              Find Doctors
            </Link>
            <Link to="/membership" className="text-foreground hover:text-primary transition-colors">
              Membership
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {isAdmin ? (
              // Admin-specific buttons
              <>
                <Badge variant="default" className="bg-red-100 text-red-800 hidden sm:flex">
                  <Shield className="h-3 w-3 mr-1" />
                  Administrator
                </Badge>
                <Link to="/admin-dashboard">
                  <Button variant="outline" className="hidden sm:inline-flex">
                    <Users className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="hidden sm:inline-flex"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              // Regular user buttons
              <>
                <Badge variant="secondary" className="hidden sm:flex">
                  <Phone className="h-3 w-3 mr-1" />
                  24/7 Support
                </Badge>
                <Link to="/doctor-portal">
                  <Button variant="outline" className="hidden sm:inline-flex">
                    <Users className="h-4 w-4 mr-2" />
                    For Doctors
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" className="hidden sm:inline-flex">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="hero">
                    <Calendar className="h-4 w-4 mr-2" />
                    Get Started
                  </Button>
                </Link>
              </>
            )}
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg">
                      <Stethoscope className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-foreground">
                        IronledgerMedMap
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Find Your Doctor
                      </span>
                    </div>
                  </div>

                  <Separator className="mb-6" />

                  {/* Navigation Links */}
                  <nav className="flex flex-col space-y-4 mb-6">
                    <Link
                      to="/"
                      className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-accent"
                    >
                      <Home className="h-5 w-5" />
                      <span>Home</span>
                    </Link>
                    <Link
                      to="/#search"
                      className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-accent"
                    >
                      <Search className="h-5 w-5" />
                      <span>Find Doctors</span>
                    </Link>
                    <Link
                      to="/membership"
                      className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-accent"
                    >
                      <Crown className="h-5 w-5" />
                      <span>Membership</span>
                    </Link>
                    <Link
                      to="/about"
                      className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-accent"
                    >
                      <Info className="h-5 w-5" />
                      <span>About</span>
                    </Link>
                    <Link
                      to="/contact"
                      className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-accent"
                    >
                      <Mail className="h-5 w-5" />
                      <span>Contact</span>
                    </Link>
                  </nav>

                  <Separator className="mb-6" />

                  {/* Mobile Action Buttons */}
                  <div className="flex flex-col space-y-3">
                    {isAdmin ? (
                      // Admin mobile menu
                      <>
                        <Badge variant="default" className="bg-red-100 text-red-800 justify-center p-2">
                          <Shield className="h-3 w-3 mr-1" />
                          Administrator
                        </Badge>
                        <Link to="/admin-dashboard" className="w-full">
                          <Button variant="outline" className="w-full justify-start">
                            <Users className="h-4 w-4 mr-2" />
                            Dashboard
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          onClick={handleLogout}
                          className="w-full justify-start"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      // Regular user mobile menu
                      <>
                        <Link to="/doctor-portal" className="w-full">
                          <Button variant="outline" className="w-full justify-start">
                            <Users className="h-4 w-4 mr-2" />
                            For Doctors
                          </Button>
                        </Link>
                        <Link to="/login" className="w-full">
                          <Button variant="ghost" className="w-full justify-start">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Sign In
                          </Button>
                        </Link>
                        <Link to="/signup" className="w-full">
                          <Button className="w-full justify-start bg-gradient-primary hover:bg-gradient-primary/90">
                            <Calendar className="h-4 w-4 mr-2" />
                            Get Started
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Support Badge */}
                  <div className="mt-auto pt-6">
                    <Badge variant="secondary" className="w-full justify-center p-2">
                      <Phone className="h-3 w-3 mr-1" />
                      24/7 Support Available
                    </Badge>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
