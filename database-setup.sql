-- =====================================================
-- IronledgerMedMap Database Setup Script
-- Execute this in your Supabase SQL Editor
-- =====================================================

-- Create user profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  role TEXT CHECK (role IN ('patient', 'doctor', 'admin')) DEFAULT 'patient',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create memberships table
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  membership_type TEXT CHECK (membership_type IN ('basic', 'premium')) NOT NULL DEFAULT 'basic',
  status TEXT CHECK (status IN ('active', 'inactive', 'cancelled')) DEFAULT 'active',
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  payment_method TEXT,
  bookings_remaining INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create medical practices table
CREATE TABLE IF NOT EXISTS public.medical_practices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  specialties TEXT[],
  operating_hours JSONB DEFAULT '{"monday": "08:00-17:00", "tuesday": "08:00-17:00", "wednesday": "08:00-17:00", "thursday": "08:00-17:00", "friday": "08:00-17:00", "saturday": "08:00-12:00", "sunday": "closed"}',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  practice_id UUID REFERENCES public.medical_practices(id) ON DELETE SET NULL,
  license_number TEXT UNIQUE NOT NULL,
  specialty TEXT NOT NULL,
  sub_specialties TEXT[],
  years_of_experience INTEGER,
  education TEXT[],
  certifications TEXT[],
  bio TEXT,
  consultation_fee DECIMAL(10,2) DEFAULT 300.00,
  is_verified BOOLEAN DEFAULT FALSE,
  is_accepting_patients BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  practice_id UUID REFERENCES public.medical_practices(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show')) DEFAULT 'scheduled',
  reason_for_visit TEXT,
  notes TEXT,
  consultation_fee DECIMAL(10,2) DEFAULT 300.00,
  convenience_fee DECIMAL(10,2) DEFAULT 10.00,
  total_amount DECIMAL(10,2) GENERATED ALWAYS AS (consultation_fee + convenience_fee) STORED,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view verified doctors" ON public.doctors
  FOR SELECT USING (is_verified = TRUE);

CREATE POLICY "Doctors can update own profile" ON public.doctors
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Doctors can insert own profile" ON public.doctors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view verified practices" ON public.medical_practices
  FOR SELECT USING (is_verified = TRUE);

CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (
    auth.uid() = patient_id OR 
    auth.uid() IN (SELECT user_id FROM public.doctors WHERE id = doctor_id)
  );

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (
    auth.uid() = patient_id OR 
    auth.uid() IN (SELECT user_id FROM public.doctors WHERE id = doctor_id)
  );

CREATE POLICY "Users can view own memberships" ON public.memberships
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own memberships" ON public.memberships
  FOR ALL USING (auth.uid() = user_id);

-- Create functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function to decrease free bookings
CREATE OR REPLACE FUNCTION decrease_free_bookings()
RETURNS void AS $$
BEGIN
    UPDATE public.memberships 
    SET bookings_remaining = GREATEST(bookings_remaining - 1, 0)
    WHERE user_id = auth.uid() 
    AND membership_type = 'premium' 
    AND status = 'active';
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON public.user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memberships_updated_at 
  BEFORE UPDATE ON public.memberships 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practices_updated_at 
  BEFORE UPDATE ON public.medical_practices 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at 
  BEFORE UPDATE ON public.doctors 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
  BEFORE UPDATE ON public.bookings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Insert Test Data
-- =====================================================

-- IMPORTANT: For comprehensive test data including:
-- - 18 test doctors (2 per province across all 9 SA provinces)
-- - 5 test patients with different membership types
-- - 1 admin user
-- - Sample bookings and realistic data
--
-- Please execute the separate file: test-data-complete.sql
--
-- This provides a fully populated database for testing and demonstration

-- Basic test practices (minimal - use test-data-complete.sql for full data)
INSERT INTO public.medical_practices (name, description, address, phone, email, specialties, is_verified) VALUES
('Test Family Medical Center', 'Comprehensive family healthcare services', '123 Test Street, Cape Town, 8001', '+27 21 123 4567', 'info@testfamilymed.co.za', ARRAY['General Practice', 'Family Medicine'], true),
('Test Specialist Clinic', 'Specialized medical consultations', '456 Test Avenue, Johannesburg, 2000', '+27 11 987 6543', 'contact@testspecialist.co.za', ARRAY['Cardiology', 'Neurology'], true),
('Test Pediatric Care', 'Dedicated children healthcare', '789 Test Road, Durban, 4000', '+27 31 555 0123', 'hello@testpediatric.co.za', ARRAY['Pediatrics', 'Child Development'], true);

-- =====================================================
-- Final Notes
-- =====================================================
-- 1. Execute this script in your Supabase SQL Editor
-- 2. Create test users through your app's signup process
-- 3. Update the user_profiles and related tables with actual UUIDs
-- 4. Enable authentication in Supabase dashboard
-- 5. Configure your payment provider (PayFast recommended for South Africa)
