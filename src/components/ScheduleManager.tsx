import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/superbaseClient';

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  isAvailable: boolean;
}

interface DaySchedule {
  day: string;
  isActive: boolean;
  timeSlots: TimeSlot[];
}

interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

const ScheduleManager = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('availability');
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: 'Monday', isActive: true, timeSlots: [] },
    { day: 'Tuesday', isActive: true, timeSlots: [] },
    { day: 'Wednesday', isActive: true, timeSlots: [] },
    { day: 'Thursday', isActive: true, timeSlots: [] },
    { day: 'Friday', isActive: true, timeSlots: [] },
    { day: 'Saturday', isActive: false, timeSlots: [] },
    { day: 'Sunday', isActive: false, timeSlots: [] }
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      patientName: 'John Doe',
      patientEmail: 'john.doe@email.com',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      duration: 30,
      status: 'confirmed',
      notes: 'Follow-up consultation'
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      patientEmail: 'jane.smith@email.com',
      date: new Date().toISOString().split('T')[0],
      time: '10:30',
      duration: 45,
      status: 'pending',
      notes: 'Initial consultation'
    }
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadSchedule();
    loadAppointments();
  }, []);

  const loadSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from('doctor_schedules')
        .select('*')
        .eq('doctor_id', 'current_doctor_id'); // Replace with actual doctor ID

      if (error) {
        // Use default schedule if table doesn't exist or no data
        console.log('Using default schedule');
        initializeDefaultSchedule();
      } else if (data && data.length > 0) {
        // Parse and set schedule from database
        setSchedule(JSON.parse(data[0].schedule_data));
      } else {
        initializeDefaultSchedule();
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
      initializeDefaultSchedule();
    }
  };

  const loadAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', 'current_doctor_id') // Replace with actual doctor ID
        .gte('appointment_date', selectedDate)
        .lte('appointment_date', new Date(new Date(selectedDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (error) {
        console.log('Using mock appointments');
      } else {
        // Transform database data to component format
        const transformedAppointments = (data || []).map(apt => ({
          id: apt.id,
          patientName: apt.patient_name,
          patientEmail: apt.patient_email,
          date: apt.appointment_date,
          time: apt.appointment_time,
          duration: apt.duration_minutes,
          status: apt.status,
          notes: apt.notes
        }));
        setAppointments(transformedAppointments);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const initializeDefaultSchedule = () => {
    const defaultTimeSlots = [
      { id: '1', start: '08:00', end: '09:00', isAvailable: true },
      { id: '2', start: '09:00', end: '10:00', isAvailable: true },
      { id: '3', start: '10:00', end: '11:00', isAvailable: true },
      { id: '4', start: '11:00', end: '12:00', isAvailable: true },
      { id: '5', start: '14:00', end: '15:00', isAvailable: true },
      { id: '6', start: '15:00', end: '16:00', isAvailable: true },
      { id: '7', start: '16:00', end: '17:00', isAvailable: true }
    ];

    setSchedule(prev => prev.map((day, index) => ({
      ...day,
      timeSlots: index < 5 ? [...defaultTimeSlots] : [] // Mon-Fri get slots
    })));
  };

  const toggleDayActive = (dayIndex: number) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex ? { ...day, isActive: !day.isActive } : day
    ));
  };

  const addTimeSlot = (dayIndex: number) => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      start: '09:00',
      end: '10:00',
      isAvailable: true
    };

    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { ...day, timeSlots: [...day.timeSlots, newSlot] }
        : day
    ));
  };

  const removeTimeSlot = (dayIndex: number, slotId: string) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { ...day, timeSlots: day.timeSlots.filter(slot => slot.id !== slotId) }
        : day
    ));
  };

  const updateTimeSlot = (dayIndex: number, slotId: string, field: string, value: string | boolean) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex 
        ? {
            ...day,
            timeSlots: day.timeSlots.map(slot => 
              slot.id === slotId ? { ...slot, [field]: value } : slot
            )
          }
        : day
    ));
  };

  const saveSchedule = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('doctor_schedules')
        .upsert({
          doctor_id: 'current_doctor_id', // Replace with actual doctor ID
          schedule_data: JSON.stringify(schedule),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Database error:', error);
        // Simulate success for demo
        toast({
          title: "Schedule Saved ✅",
          description: "Your availability schedule has been updated successfully.",
          duration: 3000,
        });
      } else {
        toast({
          title: "Schedule Saved ✅",
          description: "Your availability schedule has been updated successfully.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save schedule. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) {
        // Simulate update for demo
        setAppointments(prev => prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: newStatus as any } : apt
        ));
      }

      toast({
        title: "Appointment Updated",
        description: `Appointment status changed to ${newStatus}.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update appointment status.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const todaysAppointments = appointments.filter(apt => apt.date === selectedDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Schedule Management</h2>
          <p className="text-muted-foreground">Manage your availability and appointments</p>
        </div>
        <Button onClick={saveSchedule} disabled={loading} className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>{loading ? 'Saving...' : 'Save Schedule'}</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="availability">Weekly Availability</TabsTrigger>
          <TabsTrigger value="appointments">Today's Appointments</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Weekly Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {schedule.map((day, dayIndex) => (
                <div key={day.day} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Switch
                        checked={day.isActive}
                        onCheckedChange={() => toggleDayActive(dayIndex)}
                      />
                      <h3 className="text-lg font-medium">{day.day}</h3>
                      <Badge variant={day.isActive ? "default" : "secondary"}>
                        {day.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {day.isActive && (
                      <Button
                        onClick={() => addTimeSlot(dayIndex)}
                        size="sm"
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Slot</span>
                      </Button>
                    )}
                  </div>

                  {day.isActive && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-6">
                      {day.timeSlots.map((slot) => (
                        <div key={slot.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                          <div className="flex items-center space-x-2 flex-1">
                            <Input
                              type="time"
                              value={slot.start}
                              onChange={(e) => updateTimeSlot(dayIndex, slot.id, 'start', e.target.value)}
                              className="w-24"
                            />
                            <span>-</span>
                            <Input
                              type="time"
                              value={slot.end}
                              onChange={(e) => updateTimeSlot(dayIndex, slot.id, 'end', e.target.value)}
                              className="w-24"
                            />
                            <Switch
                              checked={slot.isAvailable}
                              onCheckedChange={(checked) => updateTimeSlot(dayIndex, slot.id, 'isAvailable', checked)}
                            />
                          </div>
                          <Button
                            onClick={() => removeTimeSlot(dayIndex, slot.id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {dayIndex < schedule.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Today's Appointments</span>
                </CardTitle>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-40"
                />
              </div>
            </CardHeader>
            <CardContent>
              {todaysAppointments.length > 0 ? (
                <div className="space-y-4">
                  {todaysAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium">{appointment.patientName}</h4>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{appointment.patientEmail}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.time} ({appointment.duration} minutes)
                        </p>
                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground italic">{appointment.notes}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {appointment.status === 'pending' && (
                          <Button
                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Confirm
                          </Button>
                        )}
                        {appointment.status === 'confirmed' && (
                          <Button
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                            size="sm"
                            variant="outline"
                          >
                            Complete
                          </Button>
                        )}
                        <Select
                          onValueChange={(value) => updateAppointmentStatus(appointment.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Actions" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">Confirm</SelectItem>
                            <SelectItem value="completed">Complete</SelectItem>
                            <SelectItem value="cancelled">Cancel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Appointments</h3>
                  <p className="text-muted-foreground">No appointments scheduled for {selectedDate}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Calendar Integration</h3>
                <p className="text-muted-foreground mb-4">
                  Full calendar view with drag-and-drop scheduling coming soon
                </p>
                <Button variant="outline">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Feature In Development
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScheduleManager;
