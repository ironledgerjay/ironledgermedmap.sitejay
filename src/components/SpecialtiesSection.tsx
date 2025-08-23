import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Brain,
  Eye,
  Bone,
  Baby,
  Stethoscope,
  Activity,
  Pill,
  ArrowRight,
  Star,
  TrendingUp
} from "lucide-react";

const SpecialtiesSection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const navigate = useNavigate();

  const specialties = [
    {
      icon: Heart,
      name: "Cardiology",
      description: "Heart and cardiovascular specialists",
      doctorCount: "45+ doctors",
      color: "text-red-500"
    },
    {
      icon: Brain,
      name: "Neurology",
      description: "Brain and nervous system experts",
      doctorCount: "32+ doctors",
      color: "text-purple-500"
    },
    {
      icon: Eye,
      name: "Ophthalmology",
      description: "Eye care and vision specialists",
      doctorCount: "28+ doctors",
      color: "text-blue-500"
    },
    {
      icon: Bone,
      name: "Orthopedics",
      description: "Bone and joint specialists",
      doctorCount: "41+ doctors",
      color: "text-green-500"
    },
    {
      icon: Baby,
      name: "Pediatrics",
      description: "Children's health specialists",
      doctorCount: "38+ doctors",
      color: "text-pink-500"
    },
    {
      icon: Activity,
      name: "Emergency Medicine",
      description: "Urgent care specialists",
      doctorCount: "52+ doctors",
      color: "text-orange-500"
    },
    {
      icon: Stethoscope,
      name: "General Practice",
      description: "Family medicine doctors",
      doctorCount: "89+ doctors",
      color: "text-teal-500"
    },
    {
      icon: Pill,
      name: "Dermatology",
      description: "Skin and cosmetic specialists",
      doctorCount: "25+ doctors",
      color: "text-indigo-500"
    }
  ];

  return (
    <section id="search" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-primary text-white">
            <Stethoscope className="h-3 w-3 mr-1" />
            Medical Specialties
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Find Specialists in 
            <span className="text-primary"> Every Field</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Browse our comprehensive network of medical specialists across South Africa. From general practitioners to highly specialized consultants.
          </p>
        </div>

        {/* Enhanced Interactive Specialties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialties.map((specialty, index) => {
            const IconComponent = specialty.icon;
            const isHovered = hoveredCard === index;
            return (
              <Card
                key={specialty.name}
                className={`group hover:shadow-medical transition-all duration-500 cursor-pointer border-2 relative overflow-hidden ${
                  isHovered
                    ? 'border-primary/50 -translate-y-3 shadow-xl'
                    : 'border-border hover:border-primary/30 hover:-translate-y-2'
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate(`/search?specialty=${encodeURIComponent(specialty.name)}`)}
              >
                {/* Hover Background Effect */}
                <div className={`absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                <CardContent className="p-6 text-center relative z-10">
                  <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-secondary transition-all duration-500 ${
                    isHovered ? 'scale-125 rotate-6' : 'group-hover:scale-110'
                  }`}>
                    <IconComponent className={`h-8 w-8 ${specialty.color} transition-all duration-300 ${
                      isHovered ? 'animate-pulse' : ''
                    }`} />
                  </div>

                  <h3 className={`text-lg font-semibold mb-2 transition-all duration-300 ${
                    isHovered ? 'text-primary scale-105' : 'group-hover:text-primary'
                  }`}>
                    {specialty.name}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-3 transition-colors group-hover:text-foreground/80">
                    {specialty.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className={`text-xs transition-all duration-300 ${
                      isHovered ? 'bg-primary/10 text-primary border-primary/30' : ''
                    }`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {specialty.doctorCount}
                    </Badge>

                    <div className={`transition-all duration-300 ${
                      isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                    }`}>
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  </div>

                  {/* Hover overlay with call to action */}
                  <div className={`absolute inset-0 bg-gradient-primary/90 flex items-center justify-center transition-all duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}>
                    <div className="text-center text-white">
                      <Star className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                      <p className="font-semibold">Find {specialty.name} Specialists</p>
                      <p className="text-sm opacity-90">Click to search</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center mt-16 animate-fade-in-up">
          <div className="bg-gradient-subtle rounded-2xl p-8 border border-border/50">
            <div className="mb-6">
              <Badge className="mb-4 bg-gradient-primary text-white">
                <Star className="h-3 w-3 mr-1" />
                50+ Medical Specialties
              </Badge>
              <h3 className="text-2xl font-bold mb-2">Can't Find Your Specialty?</h3>
              <p className="text-lg text-muted-foreground">
                We have comprehensive coverage across all medical fields in South Africa
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="hero"
                size="lg"
                className="group"
                onClick={() => navigate('/search')}
              >
                View All Specialties
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary/10 hover:scale-105 transition-all duration-300"
                onClick={() => navigate('/contact')}
              >
                Request New Specialty
              </Button>
            </div>

            {/* Additional stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-border/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">500+</div>
                <div className="text-sm text-muted-foreground">Active Doctors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Booking Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">9</div>
                <div className="text-sm text-muted-foreground">Provinces Covered</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialtiesSection;
