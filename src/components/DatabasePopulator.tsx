import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { populateDatabase } from '@/utils/populateDatabase';
import { 
  Database, 
  Users, 
  Stethoscope, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  Play,
  MapPin
} from 'lucide-react';

export default function DatabasePopulator() {
  const { toast } = useToast();
  const [isPopulating, setIsPopulating] = useState(false);
  const [isPopulated, setIsPopulated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePopulateDatabase = async () => {
    setIsPopulating(true);
    setError(null);

    try {
      const result = await populateDatabase();
      
      if (result.success) {
        setIsPopulated(true);
        toast({
          title: "Database Populated Successfully! 🎉",
          description: "18 test doctors have been added across all 9 South African provinces.",
          duration: 8000,
        });
      } else {
        throw new Error(result.error?.message || 'Population failed');
      }
    } catch (error: any) {
      console.error('Population error:', error);
      setError(error.message || 'Failed to populate database');
      toast({
        title: "Population Failed",
        description: "There was an error populating the database. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsPopulating(false);
    }
  };

  const doctorsByProvince = {
    'Western Cape': ['Dr. Sarah Johnson [TEST]', 'Dr. Michael Chen [TEST]'],
    'Gauteng': ['Dr. Amina Patel [TEST]', 'Dr. James Mthembu [TEST]'],
    'KwaZulu-Natal': ['Dr. Robert Singh [TEST]', 'Dr. Lisa Naidoo [TEST]'],
    'Eastern Cape': ['Dr. Kevin Williams [TEST]', 'Dr. Michelle van der Merwe [TEST]'],
    'Free State': ['Dr. Thabo Molefe [TEST]', 'Dr. Sandra Kruger [TEST]'],
    'Limpopo': ['Dr. Grace Mashaba [TEST]', 'Dr. Peter Makwakwa [TEST]'],
    'Mpumalanga': ['Dr. Nomsa Sibanyoni [TEST]', 'Dr. Johan Pretorius [TEST]'],
    'North West': ['Dr. Kgomotso Motsepe [TEST]', 'Dr. Lebohang Mokoena [TEST]'],
    'Northern Cape': ['Dr. Sarah Khoeshe [TEST]', 'Dr. Willem Botha [TEST]']
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Database Setup - Sample Doctors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-blue-200 bg-blue-50">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            This will populate your database with 18 test doctor profiles (2 per province) across all South African provinces. 
            All profiles are clearly marked as [TEST] to distinguish them from real doctors.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Total Doctors</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">18</p>
            <p className="text-sm text-gray-600">Across 9 provinces</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">Provinces</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">9</p>
            <p className="text-sm text-gray-600">All SA provinces covered</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Stethoscope className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold">Specialties</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">10+</p>
            <p className="text-sm text-gray-600">Various medical fields</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(doctorsByProvince).map(([province, doctors]) => (
            <div key={province} className="border rounded-lg p-3">
              <h4 className="font-semibold text-sm mb-2 text-gray-900">{province}</h4>
              <div className="space-y-1">
                {doctors.map((doctor, index) => (
                  <div key={index} className="text-xs text-gray-600 flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                    {doctor}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4">
            {isPopulated && (
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <Badge className="bg-green-100 text-green-800">Database Populated</Badge>
              </div>
            )}
          </div>

          <Button
            onClick={handlePopulateDatabase}
            disabled={isPopulating || isPopulated}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {isPopulating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Populating Database...
              </>
            ) : isPopulated ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Already Populated
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Populate Database
              </>
            )}
          </Button>
        </div>

        <Alert className="border-gray-200 bg-gray-50">
          <AlertTriangle className="h-4 w-4 text-gray-600" />
          <AlertDescription className="text-gray-700">
            <strong>Note:</strong> This is a one-time setup process. The sample doctors will appear in your admin dashboard 
            for testing purposes. You can approve/reject them through the admin panel. All test profiles use the 
            temporary password "TempPassword123!" and are clearly marked as [TEST].
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
