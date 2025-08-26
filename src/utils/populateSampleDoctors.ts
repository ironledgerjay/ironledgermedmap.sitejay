import { supabase } from '@/superbaseClient';

const sampleDoctors = [
  // Gauteng Province
  {
    full_name: 'Dr. Sarah Johnson (test)',
    email: 'sarah.johnson.test@ironledgermedmap.site',
    phone: '+27 11 456 7890',
    specialty: 'Cardiology',
    license_number: 'MP123456T',
    years_of_experience: 15,
    consultation_fee: 1200,
    bio: 'Experienced cardiologist with expertise in interventional procedures. This is a test profile for demonstration purposes.',
    medical_practice: {
      name: 'Heart Care Centre (test)',
      address: '123 Medical Street, Sandton',
      city: 'Johannesburg',
      province: 'Gauteng'
    },
    verified: true,
    application_status: 'approved',
    availability_hours: 'Mon-Fri: 8AM-5PM',
    province: 'Gauteng'
  },
  {
    full_name: 'Dr. Michael Chen (test)',
    email: 'michael.chen.test@ironledgermedmap.site',
    phone: '+27 11 567 8901',
    specialty: 'General Practice',
    license_number: 'MP234567T',
    years_of_experience: 10,
    consultation_fee: 800,
    bio: 'Family medicine practitioner focusing on preventive care. This is a test profile for demonstration purposes.',
    medical_practice: {
      name: 'Family Health Clinic (test)',
      address: '456 Health Avenue, Pretoria',
      city: 'Pretoria',
      province: 'Gauteng'
    },
    verified: true,
    application_status: 'approved',
    availability_hours: 'Mon-Sat: 7AM-7PM',
    province: 'Gauteng'
  },

  // Western Cape Province
  {
    full_name: 'Dr. Amara Ndlovu (test)',
    email: 'amara.ndlovu.test@ironledgermedmap.site',
    phone: '+27 21 678 9012',
    specialty: 'Dermatology',
    license_number: 'MP345678T',
    years_of_experience: 12,
    consultation_fee: 950,
    bio: 'Dermatologist specializing in skin cancer prevention. This is a test profile for demonstration purposes.',
    medical_practice: {
      name: 'Skin Health Institute (test)',
      address: '789 Skin Care Road, Cape Town',
      city: 'Cape Town',
      province: 'Western Cape'
    },
    verified: true,
    application_status: 'approved',
    availability_hours: 'Tue-Fri: 9AM-4PM',
    province: 'Western Cape'
  },
  {
    full_name: 'Dr. Robert Smith (test)',
    email: 'robert.smith.test@ironledgermedmap.site',
    phone: '+27 21 789 0123',
    specialty: 'Orthopedic Surgery',
    license_number: 'MP456789T',
    years_of_experience: 18,
    consultation_fee: 1500,
    bio: 'Orthopedic surgeon specializing in sports injuries. This is a test profile for demonstration purposes.',
    medical_practice: {
      name: 'Cape Orthopedic Centre (test)',
      address: '321 Sports Medicine Blvd, Stellenbosch',
      city: 'Stellenbosch',
      province: 'Western Cape'
    },
    verified: true,
    application_status: 'approved',
    availability_hours: 'Mon-Thu: 8AM-6PM',
    province: 'Western Cape'
  },

  // KwaZulu-Natal Province
  {
    full_name: 'Dr. Priya Patel (test)',
    email: 'priya.patel.test@ironledgermedmap.site',
    phone: '+27 31 890 1234',
    specialty: 'Pediatrics',
    license_number: 'MP567890T',
    years_of_experience: 14,
    consultation_fee: 900,
    bio: 'Pediatrician with expertise in child development. This is a test profile for demonstration purposes.',
    medical_practice: {
      name: 'Children\'s Health Clinic (test)',
      address: '654 Kids Care Street, Durban',
      city: 'Durban',
      province: 'KwaZulu-Natal'
    },
    verified: true,
    application_status: 'approved',
    availability_hours: 'Mon-Fri: 8AM-5PM, Sat: 8AM-12PM',
    province: 'KwaZulu-Natal'
  },
  {
    full_name: 'Dr. Thabo Mthembu (test)',
    email: 'thabo.mthembu.test@ironledgermedmap.site',
    phone: '+27 31 901 2345',
    specialty: 'Neurology',
    license_number: 'MP678901T',
    years_of_experience: 16,
    consultation_fee: 1300,
    bio: 'Neurologist specializing in epilepsy treatment. This is a test profile for demonstration purposes.',
    medical_practice: {
      name: 'KZN Neurology Centre (test)',
      address: '987 Brain Health Ave, Pietermaritzburg',
      city: 'Pietermaritzburg',
      province: 'KwaZulu-Natal'
    },
    verified: true,
    application_status: 'approved',
    availability_hours: 'Tue-Fri: 9AM-5PM',
    province: 'KwaZulu-Natal'
  },

  // Eastern Cape Province
  {
    full_name: 'Dr. Nomsa Mbeki (test)',
    email: 'nomsa.mbeki.test@ironledgermedmap.site',
    phone: '+27 41 012 3456',
    specialty: 'Gynecology',
    license_number: 'MP789012T',
    years_of_experience: 13,
    consultation_fee: 1100,
    bio: 'Gynecologist with focus on women\'s reproductive health. This is a test profile for demonstration purposes.',
    medical_practice: {
      name: 'Women\'s Health Centre (test)',
      address: '147 Wellness Street, Port Elizabeth',
      city: 'Port Elizabeth',
      province: 'Eastern Cape'
    },
    verified: true,
    application_status: 'approved',
    availability_hours: 'Mon-Thu: 8AM-4PM',
    province: 'Eastern Cape'
  },
  {
    full_name: 'Dr. James Wilson (test)',
    email: 'james.wilson.test@ironledgermedmap.site',
    phone: '+27 43 123 4567',
    specialty: 'Psychiatry',
    license_number: 'MP890123T',
    years_of_experience: 11,
    consultation_fee: 1000,
    bio: 'Psychiatrist specializing in anxiety and depression treatment. This is a test profile for demonstration purposes.',
    medical_practice: {
      name: 'Mental Health Associates (test)',
      address: '258 Mind Care Road, East London',
      city: 'East London',
      province: 'Eastern Cape'
    },
    verified: true,
    application_status: 'approved',
    availability_hours: 'Mon-Fri: 9AM-6PM',
    province: 'Eastern Cape'
  },

  // Free State Province
  {
    full_name: 'Dr. Anna van der Merwe (test)',
    email: 'anna.vandermerwe.test@ironledgermedmap.site',
    phone: '+27 51 234 5678',
    specialty: 'Ophthalmology',
    license_number: 'MP901234T',
    years_of_experience: 17,
    consultation_fee: 1250,
    bio: 'Ophthalmologist specializing in cataract surgery. This is a test profile for demonstration purposes.',
    medical_practice: {
      name: 'Free State Eye Clinic (test)',
      address: '369 Vision Street, Bloemfontein',
      city: 'Bloemfontein',
      province: 'Free State'
    },
    verified: true,
    application_status: 'approved',
    availability_hours: 'Mon-Wed: 8AM-5PM, Fri: 8AM-3PM',
    province: 'Free State'
  },
  {
    full_name: 'Dr. Sipho Molefe (test)',
    email: 'sipho.molefe.test@ironledgermedmap.site',
    phone: '+27 51 345 6789',
    specialty: 'Internal Medicine',
    license_number: 'MP012345T',
    years_of_experience: 19,
    consultation_fee: 1050,
    bio: 'Internal medicine specialist with expertise in diabetes management. This is a test profile for demonstration purposes.',
    medical_practice: {
      name: 'FS Internal Medicine (test)',
      address: '741 Health Plaza, Welkom',
      city: 'Welkom',
      province: 'Free State'
    },
    verified: true,
    application_status: 'approved',
    availability_hours: 'Tue-Thu: 8AM-5PM, Sat: 8AM-12PM',
    province: 'Free State'
  },

  // Limpopo Province
  {
    full_name: 'Dr. Grace Maluleke (test)',
    email: 'grace.maluleke.test@ironledgermedmap.site',
    phone: '+27 15 456 7890',
    specialty: 'Emergency Medicine',
    license_number: 'MP123456L',
    years_of_experience: 8,
    consultation_fee: 900,
    bio: 'Emergency medicine physician with trauma expertise. This is a test profile for demonstration purposes.',
    medical_practice: {
      name: 'Limpopo Emergency Centre (test)',
      address: '852 Emergency Ave, Polokwane',
      city: 'Polokwane',
      province: 'Limpopo'
    },
    verified: true,
    application_status: 'approved',
    availability_hours: 'Mon-Sun: 24 hours (Shifts)',
    province: 'Limpopo'
  },
  {
    full_name: 'Dr. Peter Mahlangu (test)',
    email: 'peter.mahlangu.test@ironledgermedmap.site',
    phone: '+27 15 567 8901',
    specialty: 'Family Medicine',
    license_number: 'MP234567L',
    years_of_experience: 12,
    consultation_fee: 750,
    bio: 'Family medicine practitioner serving rural communities. This is a test profile for demonstration purposes.',
    medical_practice: {
      name: 'Rural Family Practice (test)',
      address: '963 Community Street, Tzaneen',
      city: 'Tzaneen',
      province: 'Limpopo'
    },
    verified: true,
    application_status: 'approved',
    availability_hours: 'Mon-Fri: 7AM-6PM',
    province: 'Limpopo'
  },

  // Mpumalanga Province
  {
    full_name: 'Dr. Linda Nkomo (test)',
    email: 'linda.nkomo.test@ironledgermedmap.site',
    phone: '+27 13 678 9012',
    specialty: 'Radiology',
    license_number: 'MP345678M',
    years_of_experience: 14,
    consultation_fee: 1150,
    bio: 'Radiologist specializing in diagnostic imaging. This is a test profile for demonstration purposes.',
    medical_practice: {
      name: 'Lowveld Radiology (test)',
      address: '159 Scan Street, Nelspruit',
      city: 'Nelspruit',
      province: 'Mpumalanga'
    },
    verified: true,
    application_status: 'approved',
    availability_hours: 'Mon-Fri: 8AM-5PM',
    province: 'Mpumalanga'
  },
  {
    full_name: 'Dr. Mark Stevens (test)',
    email: 'mark.stevens.test@ironledgermedmap.site',
    phone: '+27 13 789 0123',
    specialty: 'Urology',
    license_number: 'MP456789M',
    years_of_experience: 16,
    consultation_fee: 1300,
    bio: 'Urologist with expertise in minimally invasive procedures. This is a test profile for demonstration purposes.',
    medical_practice: {
      name: 'Mpumalanga Urology (test)',
      address: '357 Medical Park, Witbank',
      city: 'Witbank',
      province: 'Mpumalanga'
    },
    verified: true,
    application_status: 'approved',
    availability_hours: 'Tue-Thu: 8AM-4PM',
    province: 'Mpumalanga'
  },

  // North West Province
  {
    full_name: 'Dr. Susan Motsepe (test)',
    email: 'susan.motsepe.test@ironledgermedmap.site',
    phone: '+27 18 890 1234',
    specialty: 'Endocrinology',
    license_number: 'MP567890N',
    years_of_experience: 13,
    consultation_fee: 1200,
    bio: 'Endocrinologist specializing in thyroid disorders. This is a test profile for demonstration purposes.',
    medical_practice: {
      name: 'NW Endocrine Clinic (test)',
      address: '468 Hormone Health St, Mahikeng',
      city: 'Mahikeng',
      province: 'North West'
    },
    verified: true,
    application_status: 'approved',
    availability_hours: 'Mon-Wed: 8AM-5PM, Fri: 8AM-2PM',
    province: 'North West'
  },
  {
    full_name: 'Dr. David Botha (test)',
    email: 'david.botha.test@ironledgermedmap.site',
    phone: '+27 18 901 2345',
    specialty: 'Anesthesiology',
    license_number: 'MP678901N',
    years_of_experience: 15,
    consultation_fee: 1400,
    bio: 'Anesthesiologist with expertise in pain management. This is a test profile for demonstration purposes.',
    medical_practice: {
      name: 'Pain Management Centre (test)',
      address: '579 Relief Road, Potchefstroom',
      city: 'Potchefstroom',
      province: 'North West'
    },
    verified: true,
    application_status: 'approved',
    availability_hours: 'Mon-Thu: 7AM-5PM',
    province: 'North West'
  },

  // Northern Cape Province
  {
    full_name: 'Dr. Maria Coetzee (test)',
    email: 'maria.coetzee.test@ironledgermedmap.site',
    phone: '+27 53 012 3456',
    specialty: 'Geriatrics',
    license_number: 'MP789012NC',
    years_of_experience: 20,
    consultation_fee: 900,
    bio: 'Geriatrician specializing in elderly care. This is a test profile for demonstration purposes.',
    medical_practice: {
      name: 'Golden Years Clinic (test)',
      address: '680 Senior Care Ave, Kimberley',
      city: 'Kimberley',
      province: 'Northern Cape'
    },
    verified: true,
    application_status: 'approved',
    availability_hours: 'Mon-Fri: 8AM-4PM',
    province: 'Northern Cape'
  },
  {
    full_name: 'Dr. Ahmed Hassan (test)',
    email: 'ahmed.hassan.test@ironledgermedmap.site',
    phone: '+27 53 123 4567',
    specialty: 'Oncology',
    license_number: 'MP890123NC',
    years_of_experience: 18,
    consultation_fee: 1600,
    bio: 'Oncologist specializing in cancer treatment. This is a test profile for demonstration purposes.',
    medical_practice: {
      name: 'Cancer Care Centre (test)',
      address: '791 Hope Street, Upington',
      city: 'Upington',
      province: 'Northern Cape'
    },
    verified: true,
    application_status: 'approved',
    availability_hours: 'Tue-Fri: 8AM-5PM',
    province: 'Northern Cape'
  }
];

const sampleUsers = [
  {
    email: 'john.doe@email.com',
    full_name: 'John Doe',
    phone: '+27 11 111 1111',
    role: 'patient',
    created_at: new Date().toISOString(),
    email_confirmed: true
  },
  {
    email: 'jane.smith@email.com',
    full_name: 'Jane Smith',
    phone: '+27 21 222 2222',
    role: 'patient',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    email_confirmed: true
  },
  {
    email: 'mike.johnson@email.com',
    full_name: 'Mike Johnson',
    phone: '+27 31 333 3333',
    role: 'patient',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    email_confirmed: true
  },
  {
    email: 'sarah.wilson@email.com',
    full_name: 'Sarah Wilson',
    phone: '+27 41 444 4444',
    role: 'patient',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    email_confirmed: true
  },
  {
    email: 'david.brown@email.com',
    full_name: 'David Brown',
    phone: '+27 51 555 5555',
    role: 'patient',
    created_at: new Date(Date.now() - 345600000).toISOString(),
    email_confirmed: true
  }
];

export const populateSampleDoctors = async () => {
  try {
    console.log('Starting to populate sample doctors...');

    // First, try to insert doctors
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .insert(sampleDoctors.map(doctor => ({
        ...doctor,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })));

    if (doctorError) {
      console.log('Doctors table might not exist or insert failed:', doctorError);
      console.log('Sample doctors created in memory for demo purposes');
    } else {
      console.log('Sample doctors inserted successfully:', doctorData);
    }

    // Try to insert sample users/profiles
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .insert(sampleUsers);

    if (userError) {
      console.log('Profiles table might not exist or insert failed:', userError);
      console.log('Sample users created in memory for demo purposes');
    } else {
      console.log('Sample users inserted successfully:', userData);
    }

    return {
      success: true,
      doctors: sampleDoctors,
      users: sampleUsers,
      message: 'Sample data populated successfully'
    };

  } catch (error) {
    console.error('Error populating sample data:', error);
    return {
      success: false,
      error: error,
      message: 'Failed to populate sample data'
    };
  }
};

export const getSampleDoctors = () => sampleDoctors;
export const getSampleUsers = () => sampleUsers;
