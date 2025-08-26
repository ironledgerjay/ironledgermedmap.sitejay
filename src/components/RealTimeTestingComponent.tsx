import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  Users,
  Stethoscope,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Database,
  Zap,
  Clock,
  PlayCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { testRealTimeUpdates, getTableStats, checkTableExists } from '@/utils/databaseSchema';
import { supabase } from '@/superbaseClient';
import { emailService } from '@/utils/emailService';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  timestamp?: string;
  data?: any;
}

interface TableStat {
  exists: boolean;
  count: number;
  error?: string;
}

const RealTimeTestingComponent = () => {
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [tableStats, setTableStats] = useState<Record<string, TableStat>>({});
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [realTimeEvents, setRealTimeEvents] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    loadTableStats();
    setupRealTimeMonitoring();

    return () => {
      // Cleanup subscriptions
      subscriptions.forEach(sub => sub.unsubscribe());
    };
  }, []);

  const loadTableStats = async () => {
    try {
      const stats = await getTableStats();
      setTableStats(stats);
    } catch (error) {
      console.error('Error loading table stats:', error);
    }
  };

  const setupRealTimeMonitoring = () => {
    // Monitor profiles table
    const profilesSubscription = supabase
      .channel('admin_test_profiles')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles'
      }, (payload) => {
        addRealTimeEvent('profiles', payload);
      })
      .subscribe();

    // Monitor doctors table
    const doctorsSubscription = supabase
      .channel('admin_test_doctors')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'doctors'
      }, (payload) => {
        addRealTimeEvent('doctors', payload);
      })
      .subscribe();

    // Monitor appointments table
    const appointmentsSubscription = supabase
      .channel('admin_test_appointments')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments'
      }, (payload) => {
        addRealTimeEvent('appointments', payload);
      })
      .subscribe();

    setSubscriptions([profilesSubscription, doctorsSubscription, appointmentsSubscription]);
  };

  const addRealTimeEvent = (table: string, payload: any) => {
    const event = {
      id: Date.now(),
      table,
      event: payload.eventType,
      timestamp: new Date().toISOString(),
      payload
    };

    setRealTimeEvents(prev => [event, ...prev.slice(0, 49)]); // Keep last 50 events

    toast({
      title: `Real-time Event: ${table}`,
      description: `${payload.eventType} operation detected`,
      duration: 3000,
    });
  };

  const updateTestResult = (name: string, status: TestResult['status'], message: string, data?: any) => {
    setTestResults(prev => {
      const existing = prev.find(r => r.name === name);
      const updated = {
        name,
        status,
        message,
        timestamp: new Date().toISOString(),
        data
      };

      if (existing) {
        return prev.map(r => r.name === name ? updated : r);
      } else {
        return [...prev, updated];
      }
    });
  };

  const runSingleTest = async (testName: string, testFunction: () => Promise<boolean>) => {
    updateTestResult(testName, 'running', 'Test in progress...');
    
    try {
      const result = await testFunction();
      updateTestResult(
        testName, 
        result ? 'success' : 'error',
        result ? 'Test completed successfully' : 'Test failed - check console for details'
      );
      return result;
    } catch (error) {
      updateTestResult(testName, 'error', `Test failed: ${error}`);
      return false;
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    try {
      // Test database table access
      updateTestResult('Database Access', 'running', 'Checking table access...');
      const tableChecks = await Promise.all([
        checkTableExists('profiles'),
        checkTableExists('doctors'),
        checkTableExists('appointments')
      ]);

      const allTablesExist = tableChecks.every(exists => exists);
      updateTestResult(
        'Database Access',
        allTablesExist ? 'success' : 'error',
        allTablesExist ? 'All required tables accessible' : 'Some tables are missing or inaccessible'
      );

      // Test real-time functionality
      await runSingleTest('User Registration Real-time', testRealTimeUpdates.testUserRegistration);
      await runSingleTest('Doctor Enrollment Real-time', testRealTimeUpdates.testDoctorEnrollment);
      await runSingleTest('Appointment Creation Real-time', testRealTimeUpdates.testAppointmentCreation);

      // Test email functionality
      await runSingleTest('Welcome Email System', async () => {
        try {
          await emailService.sendEnhancedWelcomeEmail('test@ironledgermedmap.site', 'Test User');
          return true;
        } catch (error) {
          console.error('Email test failed:', error);
          return false;
        }
      });

      // Refresh table stats
      await loadTableStats();

      toast({
        title: "All Tests Completed! 🎉",
        description: "Check the results below to verify real-time functionality.",
        duration: 5000,
      });

    } catch (error) {
      console.error('Test suite error:', error);
      toast({
        title: "Test Suite Error",
        description: "An error occurred while running tests.",
        variant: "destructive"
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  const simulateUserRegistration = async () => {
    const testEmail = `test.user.${Date.now()}@ironledgermedmap.site`;
    updateTestResult('Manual User Registration', 'running', 'Creating test user...');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: crypto.randomUUID(),
          email: testEmail,
          full_name: 'Manual Test User',
          phone: '+27 11 999 0000',
          role: 'patient',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      updateTestResult('Manual User Registration', 'success', 'Test user created successfully!', data);
      
      toast({
        title: "User Created! 👤",
        description: `Test user ${testEmail} created. Check admin dashboard for real-time update.`,
        duration: 5000,
      });

    } catch (error) {
      updateTestResult('Manual User Registration', 'error', `Failed: ${error}`);
    }
  };

  const simulateDoctorEnrollment = async () => {
    const testEmail = `test.doctor.${Date.now()}@ironledgermedmap.site`;
    updateTestResult('Manual Doctor Enrollment', 'running', 'Creating test doctor...');

    try {
      const { data, error } = await supabase
        .from('doctors')
        .insert({
          full_name: 'Dr. Manual Test (test)',
          email: testEmail,
          phone: '+27 21 999 0001',
          specialty: 'General Practice',
          license_number: `MANUAL${Date.now()}`,
          years_of_experience: 5,
          consultation_fee: 900,
          bio: 'This is a manually created test doctor for real-time verification.',
          medical_practice: {
            name: 'Manual Test Clinic (test)',
            address: '123 Real-time Street',
            city: 'Test City',
            province: 'Gauteng'
          },
          availability_hours: 'Mon-Fri: 9AM-5PM',
          verified: false,
          application_status: 'pending',
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      updateTestResult('Manual Doctor Enrollment', 'success', 'Test doctor created successfully!', data);
      
      toast({
        title: "Doctor Enrolled! 👨‍⚕️",
        description: `Test doctor ${testEmail} enrolled. Check admin dashboard for real-time update.`,
        duration: 5000,
      });

    } catch (error) {
      updateTestResult('Manual Doctor Enrollment', 'error', `Failed: ${error}`);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Real-Time System Testing & Verification</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This testing suite verifies that user registration and doctor enrollment appear in real-time on the admin dashboard.
              Run tests and monitor the real-time events below.
            </AlertDescription>
          </Alert>

          <div className="flex space-x-4 mb-6">
            <Button 
              onClick={runAllTests}
              disabled={isRunningTests}
              className="flex items-center space-x-2"
            >
              <PlayCircle className="h-4 w-4" />
              <span>{isRunningTests ? 'Running Tests...' : 'Run All Tests'}</span>
            </Button>
            <Button 
              onClick={simulateUserRegistration}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Simulate User Registration</span>
            </Button>
            <Button 
              onClick={simulateDoctorEnrollment}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Stethoscope className="h-4 w-4" />
              <span>Simulate Doctor Enrollment</span>
            </Button>
            <Button 
              onClick={loadTableStats}
              variant="ghost"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Stats</span>
            </Button>
          </div>

          <Tabs defaultValue="tests" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tests">Test Results</TabsTrigger>
              <TabsTrigger value="tables">Database Tables</TabsTrigger>
              <TabsTrigger value="events">Real-time Events</TabsTrigger>
            </TabsList>

            <TabsContent value="tests" className="space-y-4">
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <p className="font-medium">{result.name}</p>
                        <p className="text-sm text-muted-foreground">{result.message}</p>
                        {result.timestamp && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(result.timestamp).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                  </div>
                ))}
                
                {testResults.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No tests run yet. Click "Run All Tests" to verify real-time functionality.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tables" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(tableStats).map(([tableName, stats]) => (
                  <Card key={tableName}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Database className="h-4 w-4" />
                          <span className="font-medium">{tableName}</span>
                        </div>
                        <Badge variant={stats.exists ? 'default' : 'destructive'}>
                          {stats.exists ? 'Active' : 'Missing'}
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold text-primary">{stats.count}</p>
                      <p className="text-sm text-muted-foreground">
                        {stats.exists ? 'Records in table' : 'Table not accessible'}
                      </p>
                      {stats.error && (
                        <p className="text-xs text-red-600 mt-1">{stats.error}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <div className="space-y-2">
                {realTimeEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="font-medium">{event.table} - {event.event}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Real-time
                    </Badge>
                  </div>
                ))}
                
                {realTimeEvents.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Zap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No real-time events detected yet. Create test data to see events appear here.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeTestingComponent;
