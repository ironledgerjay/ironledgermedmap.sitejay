import { supabase } from '@/superbaseClient';

// Database schema definitions for IronledgerMedMap
export const databaseSchema = {
  // User profiles table
  profiles: `
    CREATE TABLE IF NOT EXISTS public.profiles (
      id UUID REFERENCES auth.users(id) PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT,
      phone TEXT,
      date_of_birth DATE,
      gender TEXT,
      role TEXT DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'admin')),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `,

  // Doctors table
  doctors: `
    CREATE TABLE IF NOT EXISTS public.doctors (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id),
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      specialty TEXT NOT NULL,
      license_number TEXT UNIQUE NOT NULL,
      years_of_experience INTEGER,
      consultation_fee DECIMAL(10,2),
      bio TEXT,
      medical_practice JSONB,
      availability_hours TEXT,
      verified BOOLEAN DEFAULT FALSE,
      application_id TEXT UNIQUE,
      application_status TEXT DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'rejected')),
      submitted_at TIMESTAMPTZ DEFAULT NOW(),
      approved_at TIMESTAMPTZ,
      rejected_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `,

  // Appointments/bookings table
  appointments: `
    CREATE TABLE IF NOT EXISTS public.appointments (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      patient_id UUID REFERENCES auth.users(id),
      doctor_id UUID REFERENCES public.doctors(id),
      patient_name TEXT NOT NULL,
      patient_email TEXT NOT NULL,
      patient_phone TEXT,
      doctor_name TEXT NOT NULL,
      appointment_date DATE NOT NULL,
      appointment_time TIME NOT NULL,
      duration_minutes INTEGER DEFAULT 30,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
      notes TEXT,
      consultation_fee DECIMAL(10,2),
      payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `,

  // Notifications table
  notifications: `
    CREATE TABLE IF NOT EXISTS public.notifications (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id),
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      data JSONB,
      read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `,

  // Booking notifications table (for doctors)
  booking_notifications: `
    CREATE TABLE IF NOT EXISTS public.booking_notifications (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      doctor_id UUID REFERENCES public.doctors(id),
      booking_id UUID REFERENCES public.appointments(id),
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `,

  // Doctor schedules table
  doctor_schedules: `
    CREATE TABLE IF NOT EXISTS public.doctor_schedules (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      doctor_id UUID REFERENCES public.doctors(id),
      schedule_data JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `,

  // Admin impersonation log table
  admin_impersonation_log: `
    CREATE TABLE IF NOT EXISTS public.admin_impersonation_log (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      admin_id UUID REFERENCES auth.users(id),
      doctor_id UUID REFERENCES public.doctors(id),
      doctor_name TEXT NOT NULL,
      action TEXT NOT NULL CHECK (action IN ('start_impersonation', 'end_impersonation')),
      timestamp TIMESTAMPTZ DEFAULT NOW(),
      details TEXT
    );
  `,

  // Memberships table
  memberships: `
    CREATE TABLE IF NOT EXISTS public.memberships (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id),
      membership_type TEXT NOT NULL CHECK (membership_type IN ('basic', 'premium')),
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
      start_date DATE NOT NULL,
      end_date DATE,
      amount_paid DECIMAL(10,2),
      payment_method TEXT,
      bookings_remaining INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `
};

// Row Level Security (RLS) policies
export const rlsPolicies = {
  profiles: [
    'ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;',
    `CREATE POLICY "Users can view own profile" ON public.profiles 
     FOR SELECT USING (auth.uid() = id);`,
    `CREATE POLICY "Users can update own profile" ON public.profiles 
     FOR UPDATE USING (auth.uid() = id);`,
    `CREATE POLICY "Admins can view all profiles" ON public.profiles 
     FOR ALL USING (
       EXISTS (
         SELECT 1 FROM public.profiles 
         WHERE id = auth.uid() AND role = 'admin'
       )
     );`
  ],
  doctors: [
    'ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;',
    `CREATE POLICY "Everyone can view verified doctors" ON public.doctors 
     FOR SELECT USING (verified = true);`,
    `CREATE POLICY "Doctors can view/update own record" ON public.doctors 
     FOR ALL USING (user_id = auth.uid());`,
    `CREATE POLICY "Admins can manage all doctors" ON public.doctors 
     FOR ALL USING (
       EXISTS (
         SELECT 1 FROM public.profiles 
         WHERE id = auth.uid() AND role = 'admin'
       )
     );`
  ],
  appointments: [
    'ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;',
    `CREATE POLICY "Users can view own appointments" ON public.appointments 
     FOR SELECT USING (patient_id = auth.uid());`,
    `CREATE POLICY "Doctors can view their appointments" ON public.appointments 
     FOR SELECT USING (
       doctor_id IN (
         SELECT id FROM public.doctors WHERE user_id = auth.uid()
       )
     );`,
    `CREATE POLICY "Admins can view all appointments" ON public.appointments 
     FOR ALL USING (
       EXISTS (
         SELECT 1 FROM public.profiles 
         WHERE id = auth.uid() AND role = 'admin'
       )
     );`
  ]
};

// Database functions
export const databaseFunctions = {
  updateUpdatedAt: `
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `,
  
  decreaseFreeBookings: `
    CREATE OR REPLACE FUNCTION decrease_free_bookings()
    RETURNS VOID AS $$
    BEGIN
      UPDATE public.memberships 
      SET bookings_remaining = GREATEST(bookings_remaining - 1, 0)
      WHERE user_id = auth.uid() AND bookings_remaining > 0;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `
};

// Database triggers
export const databaseTriggers = [
  'CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
  'CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
  'CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
  'CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON public.memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();'
];

// Test data insertion functions
export const insertTestData = {
  // Insert test user
  async insertTestUser(userData: any) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert(userData)
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      console.error('Error inserting test user:', error);
      return { data: null, error };
    }
  },

  // Insert test doctor
  async insertTestDoctor(doctorData: any) {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .insert(doctorData)
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      console.error('Error inserting test doctor:', error);
      return { data: null, error };
    }
  },

  // Create test appointment
  async createTestAppointment(appointmentData: any) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      console.error('Error creating test appointment:', error);
      return { data: null, error };
    }
  }
};

// Real-time testing functions
export const testRealTimeUpdates = {
  // Test user registration real-time updates
  async testUserRegistration() {
    console.log('🧪 Testing user registration real-time updates...');
    
    const testUser = {
      id: crypto.randomUUID(),
      email: `test.user.${Date.now()}@ironledgermedmap.site`,
      full_name: 'Test User Real-Time',
      phone: '+27 11 999 8888',
      role: 'patient',
      created_at: new Date().toISOString()
    };

    const result = await insertTestData.insertTestUser(testUser);
    
    if (result.error) {
      console.error('❌ User registration test failed:', result.error);
      return false;
    } else {
      console.log('✅ User registration test successful:', result.data);
      return true;
    }
  },

  // Test doctor enrollment real-time updates
  async testDoctorEnrollment() {
    console.log('🧪 Testing doctor enrollment real-time updates...');
    
    const testDoctor = {
      full_name: 'Dr. Real-Time Test (test)',
      email: `test.doctor.${Date.now()}@ironledgermedmap.site`,
      phone: '+27 21 999 7777',
      specialty: 'General Practice',
      license_number: `TEST${Date.now()}`,
      years_of_experience: 5,
      consultation_fee: 800,
      bio: 'This is a test doctor profile for real-time testing.',
      medical_practice: {
        name: 'Real-Time Test Clinic (test)',
        address: '123 Test Street',
        city: 'Test City',
        province: 'Gauteng'
      },
      availability_hours: 'Mon-Fri: 9AM-5PM',
      verified: false,
      application_status: 'pending',
      submitted_at: new Date().toISOString()
    };

    const result = await insertTestData.insertTestDoctor(testDoctor);
    
    if (result.error) {
      console.error('❌ Doctor enrollment test failed:', result.error);
      return false;
    } else {
      console.log('✅ Doctor enrollment test successful:', result.data);
      return true;
    }
  },

  // Test appointment creation real-time updates
  async testAppointmentCreation() {
    console.log('🧪 Testing appointment creation real-time updates...');
    
    const testAppointment = {
      patient_name: 'Real-Time Test Patient',
      patient_email: `test.patient.${Date.now()}@email.com`,
      patient_phone: '+27 31 999 6666',
      doctor_name: 'Dr. Test Doctor (test)',
      appointment_date: new Date().toISOString().split('T')[0],
      appointment_time: '14:30',
      duration_minutes: 30,
      status: 'pending',
      notes: 'Real-time test appointment',
      consultation_fee: 800,
      payment_status: 'pending'
    };

    const result = await insertTestData.createTestAppointment(testAppointment);
    
    if (result.error) {
      console.error('❌ Appointment creation test failed:', result.error);
      return false;
    } else {
      console.log('✅ Appointment creation test successful:', result.data);
      return true;
    }
  },

  // Run all real-time tests
  async runAllTests() {
    console.log('🚀 Starting comprehensive real-time testing...');
    
    const results = {
      userRegistration: await this.testUserRegistration(),
      doctorEnrollment: await this.testDoctorEnrollment(),
      appointmentCreation: await this.testAppointmentCreation()
    };

    const allPassed = Object.values(results).every(result => result === true);
    
    console.log('📊 Real-time testing results:', results);
    console.log(allPassed ? '🎉 All tests passed!' : '⚠️ Some tests failed!');
    
    return { results, allPassed };
  }
};

// Check if tables exist
export const checkTableExists = async (tableName: string) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    return !error;
  } catch (error) {
    return false;
  }
};

// Get table stats
export const getTableStats = async () => {
  const tables = ['profiles', 'doctors', 'appointments', 'notifications', 'booking_notifications'];
  const stats: Record<string, any> = {};

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      stats[table] = {
        exists: !error,
        count: error ? 0 : count,
        error: error?.message
      };
    } catch (error) {
      stats[table] = {
        exists: false,
        count: 0,
        error: 'Table access failed'
      };
    }
  }

  return stats;
};
