-- =====================================================
-- COMPREHENSIVE TEST DATA FOR IRONLEDGERMEDMAP
-- Execute this after the main database-setup.sql
-- =====================================================

-- Clear existing test data (if any)
DELETE FROM public.medical_practices WHERE name LIKE '%Test%';

-- =====================================================
-- INSERT TEST MEDICAL PRACTICES (2 per province)
-- =====================================================

-- WESTERN CAPE
INSERT INTO public.medical_practices (name, description, address, phone, email, specialties, is_verified) VALUES
('Test Cape Town Family Practice', 'Comprehensive family healthcare in the Mother City', '123 Test Street, Cape Town, Western Cape, 8001', '+27 21 123 4567', 'info@testcapetownfamily.co.za', ARRAY['General Practice', 'Family Medicine'], true),
('Test Stellenbosch Medical Centre', 'Advanced medical care in the winelands', '456 Test Avenue, Stellenbosch, Western Cape, 7600', '+27 21 987 6543', 'contact@teststellenboschmed.co.za', ARRAY['Cardiology', 'Internal Medicine'], true),

-- GAUTENG  
('Test Johannesburg Specialists', 'Leading specialist consultations in Joburg', '789 Test Road, Johannesburg, Gauteng, 2000', '+27 11 555 0123', 'hello@testjhbspecialists.co.za', ARRAY['Neurology', 'Orthopedics'], true),
('Test Pretoria Health Hub', 'Modern healthcare solutions in the capital', '321 Test Boulevard, Pretoria, Gauteng, 0001', '+27 12 444 5678', 'info@testptahealth.co.za', ARRAY['Pediatrics', 'Dermatology'], true),

-- KWAZULU-NATAL
('Test Durban Coastal Clinic', 'Quality healthcare by the ocean', '654 Test Marine Drive, Durban, KwaZulu-Natal, 4000', '+27 31 777 8899', 'contact@testdurbancoastal.co.za', ARRAY['General Practice', 'Sports Medicine'], true),
('Test Pietermaritzburg Medical', 'Trusted healthcare in the Midlands', '987 Test Hill Street, Pietermaritzburg, KwaZulu-Natal, 3200', '+27 33 222 3344', 'info@testpmmedical.co.za', ARRAY['Gynecology', 'Obstetrics'], true),

-- EASTERN CAPE
('Test Port Elizabeth Practice', 'Comprehensive care in the Bay', '147 Test Bay Road, Gqeberha, Eastern Cape, 6000', '+27 41 666 7788', 'hello@testpehealth.co.za', ARRAY['General Practice', 'Emergency Medicine'], true),
('Test East London Medical Centre', 'Excellence in healthcare delivery', '258 Test Oxford Street, East London, Eastern Cape, 5200', '+27 43 999 1122', 'contact@testelmedical.co.za', ARRAY['Psychiatry', 'Psychology'], true),

-- LIMPOPO
('Test Polokwane Health Services', 'Modern healthcare in the north', '369 Test Schoeman Street, Polokwane, Limpopo, 0700', '+27 15 333 4455', 'info@testpolokwanehealth.co.za', ARRAY['General Practice', 'Infectious Diseases'], true),
('Test Tzaneen Medical Practice', 'Quality care in the lowveld', '741 Test Danie Joubert Street, Tzaneen, Limpopo, 0850', '+27 15 777 8899', 'contact@testtzaneenmed.co.za', ARRAY['Family Medicine', 'Preventive Medicine'], true),

-- MPUMALANGA
('Test Nelspruit Regional Clinic', 'Advanced healthcare solutions', '852 Test Brown Street, Nelspruit, Mpumalanga, 1200', '+27 13 555 6677', 'hello@testnelspruithealth.co.za', ARRAY['General Practice', 'Radiology'], true),
('Test Witbank Medical Centre', 'Comprehensive medical services', '963 Test Church Street, Witbank, Mpumalanga, 1035', '+27 13 888 9900', 'info@testwitbankmed.co.za', ARRAY['Occupational Health', 'Internal Medicine'], true),

-- NORTH WEST
('Test Rustenburg Health Hub', 'Quality healthcare in mining country', '159 Test Nelson Mandela Drive, Rustenburg, North West, 0300', '+27 14 222 3344', 'contact@testrustenburghealth.co.za', ARRAY['General Practice', 'Occupational Medicine'], true),
('Test Mahikeng Medical Practice', 'Trusted healthcare services', '357 Test Station Road, Mahikeng, North West, 2745', '+27 18 666 7788', 'info@testmahikengmed.co.za', ARRAY['Pediatrics', 'Family Medicine'], true),

-- FREE STATE
('Test Bloemfontein Specialists', 'Leading medical expertise', '468 Test Maitland Street, Bloemfontein, Free State, 9300', '+27 51 444 5566', 'hello@testbloemspecialists.co.za', ARRAY['Cardiology', 'Pulmonology'], true),
('Test Welkom Health Centre', 'Community-focused healthcare', '579 Test Tempest Road, Welkom, Free State, 9460', '+27 57 777 8899', 'contact@testwelkomhealth.co.za', ARRAY['General Practice', 'Diabetes Care'], true),

-- NORTHERN CAPE
('Test Kimberley Medical Practice', 'Diamond standard healthcare', '680 Test Bultfontein Road, Kimberley, Northern Cape, 8300', '+27 53 333 4455', 'info@testkimberleymed.co.za', ARRAY['General Practice', 'Geriatrics'], true),
('Test Upington Health Services', 'Quality care in the Kalahari', '791 Test Schroder Street, Upington, Northern Cape, 8800', '+27 54 666 7788', 'contact@testupingtonhealth.co.za', ARRAY['Family Medicine', 'Travel Medicine'], true);

-- =====================================================
-- CREATE SAMPLE AUTH USERS AND PROFILES
-- Note: In production, these would be created through the signup process
-- For demo purposes, we'll insert mock UUIDs that you can replace
-- =====================================================

-- Generate some mock UUIDs for demonstration
-- In real implementation, you'll replace these with actual auth.users UUIDs

-- Insert sample user profiles for doctors (18 doctors - 2 per province)
INSERT INTO public.user_profiles (id, email, full_name, phone, role, address, gender) VALUES
-- Western Cape Doctors
('11111111-1111-1111-1111-111111111111', 'dr.test.williams@example.com', 'Dr. Test Williams', '+27 82 111 1111', 'doctor', 'Cape Town, Western Cape', 'male'),
('11111111-1111-1111-1111-111111111112', 'dr.test.adams@example.com', 'Dr. Test Adams', '+27 82 111 1112', 'doctor', 'Stellenbosch, Western Cape', 'female'),

-- Gauteng Doctors  
('22222222-2222-2222-2222-222222222221', 'dr.test.johnson@example.com', 'Dr. Test Johnson', '+27 82 222 2221', 'doctor', 'Johannesburg, Gauteng', 'male'),
('22222222-2222-2222-2222-222222222222', 'dr.test.brown@example.com', 'Dr. Test Brown', '+27 82 222 2222', 'doctor', 'Pretoria, Gauteng', 'female'),

-- KwaZulu-Natal Doctors
('33333333-3333-3333-3333-333333333331', 'dr.test.davis@example.com', 'Dr. Test Davis', '+27 82 333 3331', 'doctor', 'Durban, KwaZulu-Natal', 'male'),
('33333333-3333-3333-3333-333333333332', 'dr.test.wilson@example.com', 'Dr. Test Wilson', '+27 82 333 3332', 'doctor', 'Pietermaritzburg, KwaZulu-Natal', 'female'),

-- Eastern Cape Doctors
('44444444-4444-4444-4444-444444444441', 'dr.test.miller@example.com', 'Dr. Test Miller', '+27 82 444 4441', 'doctor', 'Gqeberha, Eastern Cape', 'male'),
('44444444-4444-4444-4444-444444444442', 'dr.test.moore@example.com', 'Dr. Test Moore', '+27 82 444 4442', 'doctor', 'East London, Eastern Cape', 'female'),

-- Limpopo Doctors
('55555555-5555-5555-5555-555555555551', 'dr.test.taylor@example.com', 'Dr. Test Taylor', '+27 82 555 5551', 'doctor', 'Polokwane, Limpopo', 'male'),
('55555555-5555-5555-5555-555555555552', 'dr.test.anderson@example.com', 'Dr. Test Anderson', '+27 82 555 5552', 'doctor', 'Tzaneen, Limpopo', 'female'),

-- Mpumalanga Doctors
('66666666-6666-6666-6666-666666666661', 'dr.test.thomas@example.com', 'Dr. Test Thomas', '+27 82 666 6661', 'doctor', 'Nelspruit, Mpumalanga', 'male'),
('66666666-6666-6666-6666-666666666662', 'dr.test.jackson@example.com', 'Dr. Test Jackson', '+27 82 666 6662', 'doctor', 'Witbank, Mpumalanga', 'female'),

-- North West Doctors
('77777777-7777-7777-7777-777777777771', 'dr.test.white@example.com', 'Dr. Test White', '+27 82 777 7771', 'doctor', 'Rustenburg, North West', 'male'),
('77777777-7777-7777-7777-777777777772', 'dr.test.harris@example.com', 'Dr. Test Harris', '+27 82 777 7772', 'doctor', 'Mahikeng, North West', 'female'),

-- Free State Doctors
('88888888-8888-8888-8888-888888888881', 'dr.test.martin@example.com', 'Dr. Test Martin', '+27 82 888 8881', 'doctor', 'Bloemfontein, Free State', 'male'),
('88888888-8888-8888-8888-888888888882', 'dr.test.clark@example.com', 'Dr. Test Clark', '+27 82 888 8882', 'doctor', 'Welkom, Free State', 'female'),

-- Northern Cape Doctors
('99999999-9999-9999-9999-999999999991', 'dr.test.rodriguez@example.com', 'Dr. Test Rodriguez', '+27 82 999 9991', 'doctor', 'Kimberley, Northern Cape', 'male'),
('99999999-9999-9999-9999-999999999992', 'dr.test.lewis@example.com', 'Dr. Test Lewis', '+27 82 999 9992', 'doctor', 'Upington, Northern Cape', 'female'),

-- Sample Patient Users
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'test.patient1@example.com', 'Test Patient One', '+27 82 100 0001', 'patient', '123 Test Street, Cape Town', 'male'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'test.patient2@example.com', 'Test Patient Two', '+27 82 100 0002', 'patient', '456 Test Avenue, Johannesburg', 'female'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'test.patient3@example.com', 'Test Patient Three', '+27 82 100 0003', 'patient', '789 Test Road, Durban', 'male'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'test.patient4@example.com', 'Test Patient Four', '+27 82 100 0004', 'patient', '321 Test Boulevard, Pretoria', 'female'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'test.patient5@example.com', 'Test Patient Five', '+27 82 100 0005', 'patient', '654 Test Lane, Bloemfontein', 'male'),

-- Admin User
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'admin@ironledgermedmap.com', 'Test Admin User', '+27 82 200 0001', 'admin', 'Head Office, Cape Town', 'male');

-- =====================================================
-- INSERT DOCTOR RECORDS
-- =====================================================

INSERT INTO public.doctors (user_id, practice_id, license_number, specialty, years_of_experience, bio, consultation_fee, is_verified, is_accepting_patients) VALUES

-- Western Cape Doctors
('11111111-1111-1111-1111-111111111111', 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Cape Town Family Practice'), 
 'WC001TEST', 'General Practice', 12, 'Test doctor with extensive experience in family medicine and preventive care', 350.00, true, true),

('11111111-1111-1111-1111-111111111112', 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Stellenbosch Medical Centre'), 
 'WC002TEST', 'Cardiology', 15, 'Test cardiologist specializing in heart disease prevention and treatment', 500.00, true, true),

-- Gauteng Doctors
('22222222-2222-2222-2222-222222222221', 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Johannesburg Specialists'), 
 'GP001TEST', 'Neurology', 18, 'Test neurologist with expertise in brain and nervous system disorders', 550.00, true, true),

('22222222-2222-2222-2222-222222222222', 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Pretoria Health Hub'), 
 'GP002TEST', 'Pediatrics', 10, 'Test pediatrician dedicated to providing comprehensive child healthcare', 400.00, true, true),

-- KwaZulu-Natal Doctors
('33333333-3333-3333-3333-333333333331', 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Durban Coastal Clinic'), 
 'KZN001TEST', 'General Practice', 8, 'Test doctor focused on sports medicine and general family health', 320.00, true, true),

('33333333-3333-3333-3333-333333333332', 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Pietermaritzburg Medical'), 
 'KZN002TEST', 'Gynecology', 14, 'Test gynecologist specializing in women\'s reproductive health', 450.00, true, true),

-- Eastern Cape Doctors
('44444444-4444-4444-4444-444444444441', 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Port Elizabeth Practice'), 
 'EC001TEST', 'Emergency Medicine', 11, 'Test emergency physician with trauma and critical care expertise', 380.00, true, true),

('44444444-4444-4444-4444-444444444442', 
 (SELECT id FROM public.medical_practices WHERE name = 'Test East London Medical Centre'), 
 'EC002TEST', 'Psychiatry', 16, 'Test psychiatrist focusing on mental health and wellness', 480.00, true, true),

-- Limpopo Doctors
('55555555-5555-5555-5555-555555555551', 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Polokwane Health Services'), 
 'LIM001TEST', 'General Practice', 9, 'Test doctor with experience in rural and community healthcare', 300.00, true, true),

('55555555-5555-5555-5555-555555555552', 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Tzaneen Medical Practice'), 
 'LIM002TEST', 'Family Medicine', 13, 'Test family physician specializing in preventive medicine', 340.00, true, true),

-- Mpumalanga Doctors
('66666666-6666-6666-6666-666666666661', 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Nelspruit Regional Clinic'), 
 'MP001TEST', 'General Practice', 7, 'Test doctor with expertise in diagnostic imaging and general practice', 330.00, true, true),

('66666666-6666-6666-6666-666666666662', 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Witbank Medical Centre'), 
 'MP002TEST', 'Occupational Health', 12, 'Test occupational health specialist for workplace wellness', 370.00, true, true),

-- North West Doctors
('77777777-7777-7777-7777-777777777771', 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Rustenburg Health Hub'), 
 'NW001TEST', 'General Practice', 10, 'Test doctor experienced in mining industry health assessments', 320.00, true, true),

('77777777-7777-7777-7777-777777777772', 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Mahikeng Medical Practice'), 
 'NW002TEST', 'Pediatrics', 11, 'Test pediatrician with rural healthcare experience', 360.00, true, true),

-- Free State Doctors
('88888888-8888-8888-8888-888888888881', 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Bloemfontein Specialists'), 
 'FS001TEST', 'Cardiology', 17, 'Test cardiologist with advanced training in interventional procedures', 520.00, true, true),

('88888888-8888-8888-8888-888888888882', 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Welkom Health Centre'), 
 'FS002TEST', 'General Practice', 9, 'Test doctor specializing in diabetes care and chronic disease management', 310.00, true, true),

-- Northern Cape Doctors
('99999999-9999-9999-9999-999999999991', 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Kimberley Medical Practice'), 
 'NC001TEST', 'General Practice', 14, 'Test doctor with extensive experience in geriatric care', 340.00, true, true),

('99999999-9999-9999-9999-999999999992', 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Upington Health Services'), 
 'NC002TEST', 'Family Medicine', 8, 'Test family physician with travel medicine certification', 350.00, true, true);

-- =====================================================
-- INSERT PATIENT MEMBERSHIPS
-- =====================================================

INSERT INTO public.memberships (user_id, membership_type, status, bookings_remaining) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'basic', 'active', 0),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'premium', 'active', 5),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'basic', 'active', 0),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'premium', 'active', 3),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'basic', 'active', 0);

-- =====================================================
-- INSERT SAMPLE BOOKINGS
-- =====================================================

INSERT INTO public.bookings (patient_id, doctor_id, practice_id, appointment_date, appointment_time, reason_for_visit, consultation_fee, convenience_fee, status, payment_status) VALUES

-- Some completed bookings
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
 (SELECT id FROM public.doctors WHERE license_number = 'WC001TEST'), 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Cape Town Family Practice'),
 '2024-01-10', '09:00', 'Annual checkup', 350.00, 10.00, 'completed', 'paid'),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 
 (SELECT id FROM public.doctors WHERE license_number = 'GP001TEST'), 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Johannesburg Specialists'),
 '2024-01-12', '14:30', 'Headache consultation', 550.00, 0.00, 'completed', 'paid'),

-- Some upcoming bookings
('cccccccc-cccc-cccc-cccc-cccccccccccc', 
 (SELECT id FROM public.doctors WHERE license_number = 'KZN001TEST'), 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Durban Coastal Clinic'),
 CURRENT_DATE + INTERVAL '3 days', '10:00', 'Sports injury follow-up', 320.00, 10.00, 'confirmed', 'paid'),

('dddddddd-dddd-dddd-dddd-dddddddddddd', 
 (SELECT id FROM public.doctors WHERE license_number = 'GP002TEST'), 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Pretoria Health Hub'),
 CURRENT_DATE + INTERVAL '5 days', '15:30', 'Child vaccination', 400.00, 0.00, 'scheduled', 'paid');

-- =====================================================
-- VERIFICATION SUMMARY
-- =====================================================

-- To verify the data was inserted correctly, run these queries:
/*
SELECT 'Practices' as type, COUNT(*) as count FROM public.medical_practices WHERE is_verified = true;
SELECT 'Doctors' as type, COUNT(*) as count FROM public.doctors WHERE is_verified = true;
SELECT 'Patients' as type, COUNT(*) as count FROM public.user_profiles WHERE role = 'patient';
SELECT 'Admin Users' as type, COUNT(*) as count FROM public.user_profiles WHERE role = 'admin';
SELECT 'Bookings' as type, COUNT(*) as count FROM public.bookings;

-- Count doctors per province
SELECT 
  CASE 
    WHEN up.address LIKE '%Western Cape%' THEN 'Western Cape'
    WHEN up.address LIKE '%Gauteng%' THEN 'Gauteng'
    WHEN up.address LIKE '%KwaZulu-Natal%' THEN 'KwaZulu-Natal'
    WHEN up.address LIKE '%Eastern Cape%' THEN 'Eastern Cape'
    WHEN up.address LIKE '%Limpopo%' THEN 'Limpopo'
    WHEN up.address LIKE '%Mpumalanga%' THEN 'Mpumalanga'
    WHEN up.address LIKE '%North West%' THEN 'North West'
    WHEN up.address LIKE '%Free State%' THEN 'Free State'
    WHEN up.address LIKE '%Northern Cape%' THEN 'Northern Cape'
  END as province,
  COUNT(*) as doctor_count
FROM public.doctors d
JOIN public.user_profiles up ON d.user_id = up.id
WHERE d.is_verified = true
GROUP BY province
ORDER BY province;
*/

-- =====================================================
-- IMPORTANT NOTES
-- =====================================================
-- 1. These are mock UUIDs for demonstration
-- 2. In production, you would create users through the auth system first
-- 3. All names contain "test" as requested
-- 4. Data covers all 9 South African provinces  
-- 5. Includes 18 doctors (2 per province), 5 patients, 1 admin
-- 6. Sample bookings demonstrate the booking and payment system
-- =====================================================
