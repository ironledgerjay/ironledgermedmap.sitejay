import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Database, 
  Users, 
  MapPin, 
  CheckCircle, 
  AlertTriangle,
  Loader2
} from "lucide-react";
import { populateDatabase, sampleDoctorsData } from '../utils/populateDatabase';
import { useToast } from "@/hooks/use-toast";

const DatabasePopulator = () => {
  const [isPopulating, setIsPopulating] = useState(false);
  const [populationResult, setPopulationResult] = useState<any>(null);
  const { toast } = useToast();

  const handlePopulateDatabase = async () => {
    setIsPopulating(true);
    setPopulationResult(null);
    
    try {
      const result = await populateDatabase();
      setPopulationResult(result);
      
      if (result.success) {
        toast({
          title: "Database Populated",
          description: `Successfully added ${sampleDoctorsData.length} doctors across all provinces.`,
        });
      } else {
        toast({
          title: "Population Failed",
          description: "Failed to populate database. Check console for details.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Population error:', error);
      setPopulationResult({ success: false, error });
      toast({
        title: "Population Error",
        description: "An unexpected error occurred during database population.",
        variant: "destructive"
      });
    } finally {
      setIsPopulating(false);
    }
  };

  const provinceData = [
    { province: 'Western Cape', doctors: 2, specialties: ['Cardiology', 'Family Medicine'] },
    { province: 'Gauteng', doctors: 2, specialties: ['Neurology', 'Pediatrics'] },
    { province: 'KwaZulu-Natal', doctors: 2, specialties: ['Orthopedic Surgery', 'Obstetrics & Gynecology'] },
    { province: 'Eastern Cape', doctors: 2, specialties: ['Emergency Medicine', 'Dermatology'] },
    { province: 'Free State', doctors: 2, specialties: ['Internal Medicine', 'Psychiatry'] },
    { province: 'Limpopo', doctors: 2, specialties: ['Family Medicine', 'General Surgery'] },
    { province: 'Mpumalanga', doctors: 0, specialties: ['(Available for expansion)'] },
    { province: 'North West', doctors: 0, specialties: ['(Available for expansion)'] },
    { province: 'Northern Cape', doctors: 0, specialties: ['(Available for expansion)'] }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Database className="h-6 w-6" />
          <CardTitle>Database Population Utility</CardTitle>
        </div>
        <CardDescription>
          Populate the database with sample doctors across all South African provinces to ensure search functionality works properly.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Status */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This utility will add {sampleDoctorsData.length} verified doctors across {provinceData.filter(p => p.doctors > 0).length} provinces. 
            Each doctor will have complete profile information, practice details, and medical aid coverage.
          </AlertDescription>
        </Alert>

        {/* Province Distribution */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Provincial Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {provinceData.map((province) => (
              <Card key={province.province} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{province.province}</h4>
                  <Badge variant={province.doctors > 0 ? "default" : "secondary"}>
                    {province.doctors} doctors
                  </Badge>
                </div>
                <div className="space-y-1">
                  {province.specialties.map((specialty, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      {specialty}
                    </p>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sample Data Overview */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Sample Data Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{sampleDoctorsData.length}</div>
              <p className="text-sm text-muted-foreground">Total Doctors</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {[...new Set(sampleDoctorsData.map(d => d.specialty))].length}
              </div>
              <p className="text-sm text-muted-foreground">Specialties</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {[...new Set(sampleDoctorsData.map(d => d.medical_practice.province))].length}
              </div>
              <p className="text-sm text-muted-foreground">Provinces Covered</p>
            </Card>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handlePopulateDatabase}
            disabled={isPopulating}
            size="lg"
            className="w-full max-w-md"
          >
            {isPopulating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Populating Database...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Populate Database with Sample Doctors
              </>
            )}
          </Button>
        </div>

        {/* Result Display */}
        {populationResult && (
          <Alert className={populationResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {populationResult.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={populationResult.success ? "text-green-800" : "text-red-800"}>
              {populationResult.success 
                ? `Successfully populated database with ${sampleDoctorsData.length} doctors!`
                : `Failed to populate database: ${populationResult.error?.message || 'Unknown error'}`
              }
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground">
          <p><strong>Note:</strong> This utility creates temporary user accounts with the password "TempPassword123!" for testing purposes. 
          In production, proper user registration flow should be used.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabasePopulator;
