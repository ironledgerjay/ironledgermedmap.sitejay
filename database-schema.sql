-- ============================================================================
-- IronledgerMedMap Comprehensive Database Schema
-- Run this in your Supabase SQL Editor to set up the complete database
-- ============================================================================

-- Create user profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'patient' CHECK (role IN ('admin', 'doctor', 'patient')),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medical practices table
CREATE TABLE IF NOT EXISTS medical_practices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    website TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    specialties TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    practice_id UUID REFERENCES medical_practices(id),
    license_number TEXT UNIQUE NOT NULL,
    specialty TEXT NOT NULL,
    years_of_experience INTEGER,
    consultation_fee DECIMAL(10,2),
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_accepting_patients BOOLEAN DEFAULT FALSE,
    application_status TEXT DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'rejected')),
    application_id TEXT UNIQUE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    availability_hours TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments/bookings table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES auth.users(id),
    doctor_id UUID REFERENCES doctors(id),
    practice_id UUID REFERENCES medical_practices(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
    consultation_fee DECIMAL(10,2),
    notes TEXT,
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    patient_email TEXT NOT NULL,
    reason_for_visit TEXT,
    medical_aid_scheme TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('doctor_application', 'appointment_booking', 'user_registration', 'system_alert')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT FALSE,
    admin_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Create admin accounts table
CREATE TABLE IF NOT EXISTS admin_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    permissions JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id UUID REFERENCES doctors(id),
    patient_id UUID REFERENCES auth.users(id),
    appointment_id UUID REFERENCES appointments(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATE SECURITY POLICIES
-- ============================================================================

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can insert their profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Medical practices policies
CREATE POLICY "Anyone can view verified practices" ON medical_practices FOR SELECT USING (is_verified = true);
CREATE POLICY "Doctors can view their practice" ON medical_practices FOR SELECT USING (
    EXISTS (SELECT 1 FROM doctors WHERE doctors.practice_id = medical_practices.id AND doctors.user_id = auth.uid())
);

-- Doctors policies
CREATE POLICY "Anyone can view verified doctors" ON doctors FOR SELECT USING (is_verified = true);
CREATE POLICY "Doctors can view own record" ON doctors FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Doctors can update own record" ON doctors FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Anyone can insert doctor applications" ON doctors FOR INSERT WITH CHECK (user_id = auth.uid());

-- Appointments policies
CREATE POLICY "Patients can view own appointments" ON appointments FOR SELECT USING (patient_id = auth.uid());
CREATE POLICY "Doctors can view their appointments" ON appointments FOR SELECT USING (
    EXISTS (SELECT 1 FROM doctors WHERE doctors.id = appointments.doctor_id AND doctors.user_id = auth.uid())
);
CREATE POLICY "Anyone can create appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Patients can update own appointments" ON appointments FOR UPDATE USING (patient_id = auth.uid());
CREATE POLICY "Doctors can update their appointments" ON appointments FOR UPDATE USING (
    EXISTS (SELECT 1 FROM doctors WHERE doctors.id = appointments.doctor_id AND doctors.user_id = auth.uid())
);

-- Admin notifications policies
CREATE POLICY "Only admins can view notifications" ON admin_notifications FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin')
);

-- Admin accounts policies
CREATE POLICY "Only admins can manage admin accounts" ON admin_accounts FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin')
);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Patients can create reviews" ON reviews FOR INSERT WITH CHECK (patient_id = auth.uid());

-- ============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_practice_id ON doctors(practice_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_verified ON doctors(is_verified);
CREATE INDEX IF NOT EXISTS idx_doctors_application_status ON doctors(application_status);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_type ON admin_notifications(type);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_read ON admin_notifications(read);
CREATE INDEX IF NOT EXISTS idx_reviews_doctor_id ON reviews(doctor_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- ============================================================================
-- INSERT INITIAL ADMIN ACCOUNT
-- ============================================================================

INSERT INTO admin_accounts (email, full_name, is_active, permissions, created_at)
VALUES (
    'ironledgermedmap@gmail.com',
    'Main Administrator',
    true,
    '{"full_access": true, "can_approve_doctors": true, "can_manage_admins": true, "can_view_all_data": true}',
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    is_active = EXCLUDED.is_active,
    permissions = EXCLUDED.permissions,
    updated_at = NOW();

-- ============================================================================
-- CREATE FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name, role, created_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        CASE 
            WHEN NEW.email = 'ironledgermedmap@gmail.com' THEN 'admin'
            ELSE 'patient'
        END,
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating updated_at columns
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_practices_updated_at BEFORE UPDATE ON medical_practices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_accounts_updated_at BEFORE UPDATE ON admin_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create admin notifications for new doctor applications
CREATE OR REPLACE FUNCTION notify_admin_new_application()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO admin_notifications (type, title, message, data, created_at)
    VALUES (
        'doctor_application',
        'New Doctor Application',
        'A new doctor application has been submitted and requires review',
        jsonb_build_object(
            'doctor_id', NEW.id,
            'application_id', NEW.application_id,
            'doctor_name', (SELECT full_name FROM user_profiles WHERE id = NEW.user_id),
            'specialty', NEW.specialty,
            'license_number', NEW.license_number
        ),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new doctor applications
DROP TRIGGER IF EXISTS notify_admin_doctor_application ON doctors;
CREATE TRIGGER notify_admin_doctor_application
    AFTER INSERT ON doctors
    FOR EACH ROW EXECUTE FUNCTION notify_admin_new_application();

-- Function to create admin notifications for new appointments
CREATE OR REPLACE FUNCTION notify_appointment_booked()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO admin_notifications (type, title, message, data, created_at)
    VALUES (
        'appointment_booking',
        'New Appointment Booked',
        'A new appointment has been booked and requires confirmation',
        jsonb_build_object(
            'appointment_id', NEW.id,
            'patient_name', NEW.patient_name,
            'doctor_id', NEW.doctor_id,
            'appointment_date', NEW.appointment_date,
            'appointment_time', NEW.appointment_time
        ),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new appointments
DROP TRIGGER IF EXISTS notify_admin_appointment_booked ON appointments;
CREATE TRIGGER notify_admin_appointment_booked
    AFTER INSERT ON appointments
    FOR EACH ROW EXECUTE FUNCTION notify_appointment_booked();

-- ============================================================================
-- SAMPLE DATA FOR TESTING (Optional - remove in production)
-- ============================================================================

-- Insert sample medical practices
INSERT INTO medical_practices (name, address, city, province, phone, email, is_verified, specialties) VALUES
('Heart Care Centre', '123 Medical Street, Sandton', 'Johannesburg', 'Gauteng', '+27 11 456 7890', 'info@heartcare.co.za', true, ARRAY['Cardiology']),
('Family Health Clinic', '456 Health Avenue, Green Point', 'Cape Town', 'Western Cape', '+27 21 567 8901', 'contact@familyhealth.co.za', true, ARRAY['General Practice', 'Family Medicine']),
('Skin Health Institute', '789 Dermatology Road, Morningside', 'Durban', 'KwaZulu-Natal', '+27 31 678 9012', 'info@skinhealth.co.za', true, ARRAY['Dermatology'])
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

-- Create a simple function to confirm setup completion
CREATE OR REPLACE FUNCTION check_setup_completion()
RETURNS TEXT AS $$
BEGIN
    RETURN 'IronledgerMedMap database schema setup completed successfully! ' || 
           'Tables: ' || (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('user_profiles', 'doctors', 'medical_practices', 'appointments', 'admin_notifications', 'admin_accounts', 'reviews'))::TEXT || 
           ' created with RLS enabled.';
END;
$$ LANGUAGE plpgsql;

-- Run the completion check
SELECT check_setup_completion();
