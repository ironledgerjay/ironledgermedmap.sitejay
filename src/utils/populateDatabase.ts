import { supabase } from '../superbaseClient';

interface DoctorData {
  specialty: string;
  years_of_experience: number;
  consultation_fee: number;
  bio: string;
  license_number: string;
  is_verified: boolean;
  user_profile: {
    full_name: string;
    email: string;
    phone: string;
  };
  medical_practice: {
    name: string;
    address: string;
    city: string;
    province: string;
    medical_aid_providers: string[];
  };
}

export const sampleDoctorsData: DoctorData[] = [
  // Western Cape - 2 doctors
  {
    specialty: 'Cardiology',
    years_of_experience: 15,
    consultation_fee: 1200,
    bio: '[TEST] Experienced cardiologist specializing in heart disease prevention and treatment.',
    license_number: 'MP123456',
    is_verified: true,
    user_profile: {
      full_name: 'Dr. Sarah Johnson [TEST]',
      email: 'sarah.johnson.test@gmail.com',
      phone: '021 123 4567'
    },
    medical_practice: {
      name: 'Cape Heart Centre',
      address: '123 Medical Street, Green Point',
      city: 'Cape Town',
      province: 'Western Cape',
      medical_aid_providers: ['Discovery Health', 'Momentum Health', 'Bonitas']
    }
  },
  {
    specialty: 'Family Medicine',
    years_of_experience: 8,
    consultation_fee: 800,
    bio: '[TEST] Family medicine practitioner focused on comprehensive primary care.',
    license_number: 'MP234567',
    is_verified: true,
    user_profile: {
      full_name: 'Dr. Michael Chen [TEST]',
      email: 'michael.chen.test@gmail.com',
      phone: '021 987 6543'
    },
    medical_practice: {
      name: 'Family Care Medical Centre',
      address: '456 Health Avenue, Stellenbosch',
      city: 'Stellenbosch',
      province: 'Western Cape',
      medical_aid_providers: ['Discovery Health', 'Medihelp', 'Fedhealth']
    }
  },
  
  // Gauteng - 2 doctors
  {
    specialty: 'Neurology',
    years_of_experience: 12,
    consultation_fee: 1100,
    bio: '[TEST] Neurologist specializing in brain and nervous system disorders.',
    license_number: 'MP345678',
    is_verified: true,
    user_profile: {
      full_name: 'Dr. Amina Patel [TEST]',
      email: 'amina.patel.test@gmail.com',
      phone: '011 234 5678'
    },
    medical_practice: {
      name: 'Johannesburg Neurology Centre',
      address: '789 Medical Plaza, Sandton',
      city: 'Johannesburg',
      province: 'Gauteng',
      medical_aid_providers: ['Discovery Health', 'Momentum Health', 'Gems']
    }
  },
  {
    specialty: 'Pediatrics',
    years_of_experience: 10,
    consultation_fee: 900,
    bio: '[TEST] Pediatrician dedicated to children\'s health and development.',
    license_number: 'MP456789',
    is_verified: true,
    user_profile: {
      full_name: 'Dr. James Mthembu [TEST]',
      email: 'james.mthembu.test@gmail.com',
      phone: '012 345 6789'
    },
    medical_practice: {
      name: 'Little Angels Pediatric Clinic',
      address: '321 Children\'s Way, Pretoria',
      city: 'Pretoria',
      province: 'Gauteng',
      medical_aid_providers: ['Discovery Health', 'Bonitas', 'Medihelp']
    }
  },

  // KwaZulu-Natal - 2 doctors
  {
    specialty: 'Orthopedic Surgery',
    years_of_experience: 18,
    consultation_fee: 1300,
    bio: '[TEST] Orthopedic surgeon specializing in joint replacement and sports injuries.',
    license_number: 'MP567890',
    is_verified: true,
    user_profile: {
      full_name: 'Dr. Robert Singh [TEST]',
      email: 'robert.singh.test@gmail.com',
      phone: '031 456 7890'
    },
    medical_practice: {
      name: 'Durban Orthopedic Institute',
      address: '654 Sports Medicine Road, Umhlanga',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      medical_aid_providers: ['Discovery Health', 'Momentum Health', 'Fedhealth']
    }
  },
  {
    specialty: 'Obstetrics & Gynecology',
    years_of_experience: 14,
    consultation_fee: 1050,
    bio: '[TEST] OB/GYN specialist providing comprehensive women\'s healthcare.',
    license_number: 'MP678901',
    is_verified: true,
    user_profile: {
      full_name: 'Dr. Lisa Naidoo [TEST]',
      email: 'lisa.naidoo.test@gmail.com',
      phone: '031 567 8901'
    },
    medical_practice: {
      name: 'Women\'s Health Centre KZN',
      address: '987 Wellness Boulevard, Pietermaritzburg',
      city: 'Pietermaritzburg',
      province: 'KwaZulu-Natal',
      medical_aid_providers: ['Discovery Health', 'Medihelp', 'Gems']
    }
  },

  // Eastern Cape - 2 doctors
  {
    specialty: 'Emergency Medicine',
    years_of_experience: 7,
    consultation_fee: 950,
    bio: '[TEST] Emergency medicine physician providing urgent and critical care.',
    license_number: 'MP789012',
    is_verified: true,
    user_profile: {
      full_name: 'Dr. Kevin Williams [TEST]',
      email: 'kevin.williams.test@gmail.com',
      phone: '041 678 9012'
    },
    medical_practice: {
      name: 'Port Elizabeth Emergency Centre',
      address: '147 Emergency Drive, Summerstrand',
      city: 'Gqeberha',
      province: 'Eastern Cape',
      medical_aid_providers: ['Discovery Health', 'Momentum Health', 'Bonitas']
    }
  },
  {
    specialty: 'Dermatology',
    years_of_experience: 11,
    consultation_fee: 850,
    bio: '[TEST] Dermatologist specializing in skin health and cosmetic procedures.',
    license_number: 'MP890123',
    is_verified: true,
    user_profile: {
      full_name: 'Dr. Michelle van der Merwe [TEST]',
      email: 'michelle.vandermerwe.test@gmail.com',
      phone: '043 789 0123'
    },
    medical_practice: {
      name: 'East London Dermatology Clinic',
      address: '258 Skin Care Street, Vincent',
      city: 'East London',
      province: 'Eastern Cape',
      medical_aid_providers: ['Discovery Health', 'Medihelp', 'Fedhealth']
    }
  },

  // Free State - 2 doctors
  {
    specialty: 'Internal Medicine',
    years_of_experience: 13,
    consultation_fee: 750,
    bio: '[TEST] Internal medicine specialist focusing on adult disease prevention and treatment.',
    license_number: 'MP901234',
    is_verified: true,
    user_profile: {
      full_name: 'Dr. Thabo Molefe [TEST]',
      email: 'thabo.molefe.test@gmail.com',
      phone: '051 890 1234'
    },
    medical_practice: {
      name: 'Bloemfontein Internal Medicine',
      address: '369 Medical Centre Road, Universitas',
      city: 'Bloemfontein',
      province: 'Free State',
      medical_aid_providers: ['Discovery Health', 'Bonitas', 'Gems']
    }
  },
  {
    specialty: 'Psychiatry',
    years_of_experience: 16,
    consultation_fee: 1000,
    bio: '[TEST] Psychiatrist providing mental health care and therapy services.',
    license_number: 'MP012345',
    is_verified: true,
    user_profile: {
      full_name: 'Dr. Sandra Kruger [TEST]',
      email: 'sandra.kruger.test@gmail.com',
      phone: '051 901 2345'
    },
    medical_practice: {
      name: 'Free State Mental Health Centre',
      address: '741 Wellness Way, Westdene',
      city: 'Bloemfontein',
      province: 'Free State',
      medical_aid_providers: ['Discovery Health', 'Momentum Health', 'Medihelp']
    }
  },

  // Limpopo - 2 doctors
  {
    specialty: 'Family Medicine',
    years_of_experience: 9,
    consultation_fee: 600,
    bio: '[TEST] Rural family medicine practitioner serving the Limpopo community.',
    license_number: 'MP123450',
    is_verified: true,
    user_profile: {
      full_name: 'Dr. Grace Mashaba [TEST]',
      email: 'grace.mashaba.test@gmail.com',
      phone: '015 234 5678'
    },
    medical_practice: {
      name: 'Polokwane Family Practice',
      address: '852 Community Health Street, Seshego',
      city: 'Polokwane',
      province: 'Limpopo',
      medical_aid_providers: ['Discovery Health', 'Gems', 'Polmed']
    }
  },
  {
    specialty: 'General Surgery',
    years_of_experience: 20,
    consultation_fee: 1150,
    bio: '[TEST] General surgeon with extensive experience in various surgical procedures.',
    license_number: 'MP234561',
    is_verified: true,
    user_profile: {
      full_name: 'Dr. Peter Makwakwa [TEST]',
      email: 'peter.makwakwa.test@gmail.com',
      phone: '015 345 6789'
    },
    medical_practice: {
      name: 'Limpopo Surgical Centre',
      address: '963 Surgery Plaza, Bendor',
      city: 'Polokwane',
      province: 'Limpopo',
      medical_aid_providers: ['Discovery Health', 'Momentum Health', 'Gems']
    }
  },

  // Mpumalanga - 2 doctors
  {
    specialty: 'Family Medicine',
    years_of_experience: 8,
    consultation_fee: 650,
    bio: '[TEST] Community-focused family physician serving rural and urban Mpumalanga.',
    license_number: 'MP345672',
    is_verified: true,
    user_profile: {
      full_name: 'Dr. Nomsa Sibanyoni [TEST]',
      email: 'nomsa.sibanyoni.test@gmail.com',
      phone: '013 456 7890'
    },
    medical_practice: {
      name: 'Mpumalanga Community Health Centre [TEST]',
      address: '159 Healthcare Avenue, Riverside',
      city: 'Nelspruit',
      province: 'Mpumalanga',
      medical_aid_providers: ['Discovery Health', 'Gems', 'Bonitas']
    }
  },
  {
    specialty: 'Occupational Health',
    years_of_experience: 12,
    consultation_fee: 900,
    bio: '[TEST] Occupational health specialist focusing on workplace safety and industrial medicine.',
    license_number: 'MP456783',
    is_verified: true,
    user_profile: {
      full_name: 'Dr. Johan Pretorius [TEST]',
      email: 'johan.pretorius.test@gmail.com',
      phone: '013 567 8901'
    },
    medical_practice: {
      name: 'Industrial Health Solutions [TEST]',
      address: '753 Mining Road, Witbank Extension',
      city: 'Emalahleni',
      province: 'Mpumalanga',
      medical_aid_providers: ['Discovery Health', 'Momentum Health', 'Medihelp']
    }
  },

  // North West - 2 doctors
  {
    specialty: 'General Practice',
    years_of_experience: 6,
    consultation_fee: 550,
    bio: '[TEST] General practitioner providing comprehensive primary healthcare to North West communities.',
    license_number: 'MP567894',
    is_verified: true,
    user_profile: {
      full_name: 'Dr. Kgomotso Motsepe [TEST]',
      email: 'kgomotso.motsepe.test@gmail.com',
      phone: '018 678 9012'
    },
    medical_practice: {
      name: 'Mafikeng Primary Care Clinic [TEST]',
      address: '486 Medical Street, Mafikeng Unit 5',
      city: 'Mafikeng',
      province: 'North West',
      medical_aid_providers: ['Discovery Health', 'Gems', 'Polmed']
    }
  },
  {
    specialty: 'Pediatrics',
    years_of_experience: 14,
    consultation_fee: 850,
    bio: '[TEST] Pediatric specialist dedicated to children\'s health in the North West province.',
    license_number: 'MP678905',
    is_verified: true,
    user_profile: {
      full_name: 'Dr. Lebohang Mokoena [TEST]',
      email: 'lebohang.mokoena.test@gmail.com',
      phone: '014 789 0123'
    },
    medical_practice: {
      name: 'Kids Care Centre North West [TEST]',
      address: '297 Children\'s Health Boulevard, Ikageng',
      city: 'Potchefstroom',
      province: 'North West',
      medical_aid_providers: ['Discovery Health', 'Momentum Health', 'Bonitas']
    }
  },

  // Northern Cape - 2 doctors
  {
    specialty: 'General Practice',
    years_of_experience: 10,
    consultation_fee: 600,
    bio: '[TEST] Rural medicine practitioner serving the vast Northern Cape communities.',
    license_number: 'MP789016',
    is_verified: true,
    user_profile: {
      full_name: 'Dr. Sarah Khoeshe [TEST]',
      email: 'sarah.khoeshe.test@gmail.com',
      phone: '053 890 1234'
    },
    medical_practice: {
      name: 'Northern Cape Family Practice [TEST]',
      address: '842 Desert Healthcare Road, Hadison Park',
      city: 'Kimberley',
      province: 'Northern Cape',
      medical_aid_providers: ['Discovery Health', 'Gems', 'Medihelp']
    }
  },
  {
    specialty: 'Family Medicine',
    years_of_experience: 17,
    consultation_fee: 750,
    bio: '[TEST] Experienced family medicine doctor providing care across the Northern Cape region.',
    license_number: 'MP890127',
    is_verified: true,
    user_profile: {
      full_name: 'Dr. Willem Botha [TEST]',
      email: 'willem.botha.test@gmail.com',
      phone: '027 901 2345'
    },
    medical_practice: {
      name: 'Namaqualand Medical Centre [TEST]',
      address: '635 Desert Rose Street, Central',
      city: 'Upington',
      province: 'Northern Cape',
      medical_aid_providers: ['Discovery Health', 'Momentum Health', 'Fedhealth']
    }
  }
];

export const populateDatabase = async () => {
  try {
    console.log('Starting database population...');
    
    for (const doctorData of sampleDoctorsData) {
      // First, create user profile
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email: doctorData.user_profile.email,
        password: 'TempPassword123!', // Temporary password
        options: {
          data: {
            full_name: doctorData.user_profile.full_name,
            phone: doctorData.user_profile.phone,
            role: 'doctor'
          }
        }
      });

      if (userError) {
        console.error('Error creating user:', userError);
        continue;
      }

      const userId = userData.user?.id;
      if (!userId) continue;

      // Create user profile record
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          full_name: doctorData.user_profile.full_name,
          email: doctorData.user_profile.email,
          phone: doctorData.user_profile.phone
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        continue;
      }

      // Create medical practice
      const { data: practiceData, error: practiceError } = await supabase
        .from('medical_practices')
        .insert({
          name: doctorData.medical_practice.name,
          address: doctorData.medical_practice.address,
          city: doctorData.medical_practice.city,
          province: doctorData.medical_practice.province,
          medical_aid_providers: doctorData.medical_practice.medical_aid_providers
        })
        .select()
        .single();

      if (practiceError) {
        console.error('Error creating practice:', practiceError);
        continue;
      }

      // Create doctor record
      const { error: doctorError } = await supabase
        .from('doctors')
        .insert({
          user_id: userId,
          practice_id: practiceData.id,
          specialty: doctorData.specialty,
          years_of_experience: doctorData.years_of_experience,
          consultation_fee: doctorData.consultation_fee,
          bio: doctorData.bio,
          license_number: doctorData.license_number,
          is_verified: doctorData.is_verified
        });

      if (doctorError) {
        console.error('Error creating doctor:', doctorError);
        continue;
      }

      console.log(`Created doctor: ${doctorData.user_profile.full_name}`);
    }

    console.log('Database population completed!');
    return { success: true, message: 'Database populated successfully' };
    
  } catch (error) {
    console.error('Error populating database:', error);
    return { success: false, error };
  }
};
