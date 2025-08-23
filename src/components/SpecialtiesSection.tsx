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

        {/* Specialties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialties.map((specialty, index) => {
            const IconComponent = specialty.icon;
            return (
              <Card 
                key={specialty.name}
                className="group hover:shadow-medical transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-primary/50"
              >
                <CardContent className="p-6 text-center">
                  <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-secondary group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-8 w-8 ${specialty.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {specialty.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {specialty.description}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {specialty.doctorCount}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground mb-4">
            Can't find your specialty? We have 50+ medical fields covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
              View All Specialties
            </button>
            <button className="px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium">
              Request New Specialty
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialtiesSection;
