import { supabase } from '@/superbaseClient';

export interface Booking {
  id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  doctor_id: string;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  consultation_fee: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
}

export interface BookingNotification {
  id: string;
  booking_id: string;
  type: 'new_booking' | 'booking_confirmed' | 'booking_cancelled' | 'payment_received';
  message: string;
  created_at: string;
  read: boolean;
  doctor_id: string;
}

class RealTimeBookingService {
  private subscriptions: any[] = [];

  // Subscribe to real-time booking updates for a doctor
  subscribeToBookings(doctorId: string, onBookingUpdate: (booking: Booking) => void) {
    const channel = supabase
      .channel(`bookings_${doctorId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `doctor_id=eq.${doctorId}`
      }, (payload) => {
        console.log('Booking update received:', payload);
        
        if (payload.new) {
          onBookingUpdate(payload.new as Booking);
        }
      })
      .subscribe();

    this.subscriptions.push(channel);
    return channel;
  }

  // Subscribe to booking notifications
  subscribeToNotifications(doctorId: string, onNotification: (notification: BookingNotification) => void) {
    const channel = supabase
      .channel(`notifications_${doctorId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'booking_notifications',
        filter: `doctor_id=eq.${doctorId}`
      }, (payload) => {
        console.log('Notification received:', payload);
        
        if (payload.new) {
          onNotification(payload.new as BookingNotification);
        }
      })
      .subscribe();

    this.subscriptions.push(channel);
    return channel;
  }

  // Create a new booking
  async createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking | null> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        return null;
      }

      // Create notification for doctor
      await this.createNotification(bookingData.doctor_id, {
        booking_id: data.id,
        type: 'new_booking',
        message: `New appointment request from ${bookingData.patient_name} for ${bookingData.appointment_date} at ${bookingData.appointment_time}`
      });

      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      return null;
    }
  }

  // Update booking status
  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) {
        console.error('Error updating booking:', error);
        return false;
      }

      // Create notification based on status change
      let notificationType: BookingNotification['type'] = 'booking_confirmed';
      let message = '';

      switch (status) {
        case 'confirmed':
          notificationType = 'booking_confirmed';
          message = `Appointment with ${data.patient_name} has been confirmed`;
          break;
        case 'cancelled':
          notificationType = 'booking_cancelled';
          message = `Appointment with ${data.patient_name} has been cancelled`;
          break;
        case 'completed':
          message = `Appointment with ${data.patient_name} has been completed`;
          break;
      }

      if (message) {
        await this.createNotification(data.doctor_id, {
          booking_id: bookingId,
          type: notificationType,
          message
        });
      }

      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      return false;
    }
  }

  // Create a notification
  async createNotification(doctorId: string, notificationData: Omit<BookingNotification, 'id' | 'created_at' | 'read' | 'doctor_id'>): Promise<void> {
    try {
      await supabase
        .from('booking_notifications')
        .insert({
          ...notificationData,
          doctor_id: doctorId,
          created_at: new Date().toISOString(),
          read: false
        });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  // Get bookings for a doctor
  async getDoctorBookings(doctorId: string, limit: number = 50): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('doctor_id', doctorId)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching bookings:', error);
        return this.getMockBookings(doctorId);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return this.getMockBookings(doctorId);
    }
  }

  // Mock bookings for demo purposes
  private getMockBookings(doctorId: string): Booking[] {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return [
      {
        id: '1',
        patient_name: 'John Doe',
        patient_email: 'john.doe@email.com',
        patient_phone: '+27 11 111 1111',
        doctor_id: doctorId,
        doctor_name: 'Dr. Sarah Johnson (test)',
        appointment_date: today.toISOString().split('T')[0],
        appointment_time: '09:00',
        duration_minutes: 30,
        status: 'confirmed',
        notes: 'Follow-up consultation for hypertension',
        consultation_fee: 1200,
        payment_status: 'paid',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '2',
        patient_name: 'Jane Smith',
        patient_email: 'jane.smith@email.com',
        patient_phone: '+27 21 222 2222',
        doctor_id: doctorId,
        doctor_name: 'Dr. Sarah Johnson (test)',
        appointment_date: today.toISOString().split('T')[0],
        appointment_time: '10:30',
        duration_minutes: 45,
        status: 'pending',
        notes: 'Initial consultation - chest pain',
        consultation_fee: 1200,
        payment_status: 'pending',
        created_at: new Date(Date.now() - 1800000).toISOString(),
        updated_at: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: '3',
        patient_name: 'Mike Johnson',
        patient_email: 'mike.johnson@email.com',
        patient_phone: '+27 31 333 3333',
        doctor_id: doctorId,
        doctor_name: 'Dr. Sarah Johnson (test)',
        appointment_date: tomorrow.toISOString().split('T')[0],
        appointment_time: '14:00',
        duration_minutes: 30,
        status: 'confirmed',
        notes: 'Annual check-up',
        consultation_fee: 1200,
        payment_status: 'paid',
        created_at: new Date(Date.now() - 7200000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  }

  // Simulate new booking for demo
  async simulateNewBooking(doctorId: string): Promise<void> {
    const mockPatients = [
      { name: 'Sarah Wilson', email: 'sarah.wilson@email.com', phone: '+27 41 444 4444' },
      { name: 'David Brown', email: 'david.brown@email.com', phone: '+27 51 555 5555' },
      { name: 'Lisa Van Der Merwe', email: 'lisa.vandermerwe@email.com', phone: '+27 18 666 6666' }
    ];

    const patient = mockPatients[Math.floor(Math.random() * mockPatients.length)];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'> = {
      patient_name: patient.name,
      patient_email: patient.email,
      patient_phone: patient.phone,
      doctor_id: doctorId,
      doctor_name: 'Dr. Sarah Johnson (test)',
      appointment_date: tomorrow.toISOString().split('T')[0],
      appointment_time: '15:30',
      duration_minutes: 30,
      status: 'pending',
      notes: 'New patient consultation',
      consultation_fee: 1200,
      payment_status: 'pending'
    };

    await this.createBooking(booking);
  }

  // Clean up subscriptions
  unsubscribeAll() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }
}

export const realTimeBookingService = new RealTimeBookingService();
