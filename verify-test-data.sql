-- =====================================================
-- DATABASE VERIFICATION SCRIPT
-- Run this to verify all test data was loaded correctly
-- =====================================================

-- Summary counts
SELECT 
  'Medical Practices' as type, 
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE is_verified = true) as verified_count
FROM public.medical_practices WHERE name LIKE '%Test%';

SELECT 
  'Doctors' as type, 
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE is_verified = true) as verified_count
FROM public.doctors;

SELECT 
  'User Profiles' as type,
  role,
  COUNT(*) as count
FROM public.user_profiles 
WHERE email LIKE '%test%' OR email LIKE '%admin%'
GROUP BY role
ORDER BY role;

SELECT 
  'Memberships' as type,
  membership_type,
  COUNT(*) as count
FROM public.memberships 
GROUP BY membership_type
ORDER BY membership_type;

SELECT 
  'Bookings' as type,
  status,
  COUNT(*) as count
FROM public.bookings 
GROUP BY status
ORDER BY status;

-- Doctors per province breakdown
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
    ELSE 'Other'
  END as province,
  COUNT(*) as doctor_count,
  STRING_AGG(up.full_name, ', ') as doctors
FROM public.doctors d
JOIN public.user_profiles up ON d.user_id = up.id
WHERE d.is_verified = true
GROUP BY province
ORDER BY province;

-- Sample doctor details with practice information
SELECT 
  up.full_name as doctor_name,
  d.specialty,
  d.consultation_fee,
  mp.name as practice_name,
  mp.address as practice_address
FROM public.doctors d
JOIN public.user_profiles up ON d.user_id = up.id
JOIN public.medical_practices mp ON d.practice_id = mp.id
WHERE d.is_verified = true
ORDER BY up.full_name
LIMIT 10;

-- Patient membership overview
SELECT 
  up.full_name as patient_name,
  m.membership_type,
  m.bookings_remaining,
  m.status
FROM public.memberships m
JOIN public.user_profiles up ON m.user_id = up.id
ORDER BY up.full_name;

-- Recent bookings with details
SELECT 
  p.full_name as patient,
  d.full_name as doctor,
  b.appointment_date,
  b.appointment_time,
  b.reason_for_visit,
  b.total_amount,
  b.status,
  b.payment_status
FROM public.bookings b
JOIN public.user_profiles p ON b.patient_id = p.id
JOIN public.doctors doc ON b.doctor_id = doc.id
JOIN public.user_profiles d ON doc.user_id = d.id
ORDER BY b.appointment_date DESC;

-- Check for any missing relationships
SELECT 'Doctors without practices' as issue, COUNT(*) as count
FROM public.doctors WHERE practice_id IS NULL;

SELECT 'Doctors without user profiles' as issue, COUNT(*) as count
FROM public.doctors d
LEFT JOIN public.user_profiles up ON d.user_id = up.id
WHERE up.id IS NULL;

SELECT 'Memberships without users' as issue, COUNT(*) as count
FROM public.memberships m
LEFT JOIN public.user_profiles up ON m.user_id = up.id
WHERE up.id IS NULL;

-- Expected results if data loaded correctly:
-- - 18 medical practices (verified)
-- - 18 doctors (verified) 
-- - 6 user profiles (5 patients + 1 admin + 18 doctors = 24 total)
-- - 5 memberships (for patients)
-- - 4 sample bookings
-- - 2 doctors per province (9 provinces = 18 total)
-- - No missing relationships (all counts should be 0)
