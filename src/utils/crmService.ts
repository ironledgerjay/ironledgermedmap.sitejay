// CRM Integration Service for MedMapAdmin
const CRM_BASE_URL = 'https://replit.com/@ironledgermedma/MedMapAdmin-1';

interface UserData {
  email: string;
  fullName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  role: string;
  registrationDate: string;
  membershipType?: string;
  verified?: boolean;
}

interface DoctorData {
  email: string;
  fullName: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: string;
  consultationFee: string;
  bio: string;
  practiceName: string;
  practiceAddress: string;
  city: string;
  province: string;
  medicalAid: string[];
  verificationStatus: string;
  enrollmentDate: string;
}

interface BookingData {
  patientEmail: string;
  doctorEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  reasonForVisit: string;
  bookingDate: string;
  status: string;
  paymentAmount?: number;
  paymentStatus?: string;
}

export class CRMService {
  private static async sendToCRM(endpoint: string, data: any) {
    try {
      // Log locally for development
      console.log(`CRM Integration - ${endpoint}:`, data);
      
      // Send to CRM system
      const response = await fetch(`${CRM_BASE_URL}/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Source': 'IronledgerMedMap'
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: 'medmap-platform'
        })
      });

      if (!response.ok) {
        console.warn(`CRM API ${endpoint} responded with status ${response.status}`);
        // Don't throw error to avoid disrupting user flow
        return false;
      }

      const result = await response.json();
      console.log(`CRM ${endpoint} success:`, result);
      return true;
    } catch (error) {
      console.warn(`CRM Integration error for ${endpoint}:`, error);
      // Don't throw error to avoid disrupting user flow
      return false;
    }
  }

  static async recordUserRegistration(userData: UserData) {
    return await this.sendToCRM('users', userData);
  }

  static async recordDoctorEnrollment(doctorData: DoctorData) {
    return await this.sendToCRM('doctors', doctorData);
  }

  static async recordBooking(bookingData: BookingData) {
    return await this.sendToCRM('bookings', bookingData);
  }

  static async updateUserMembership(email: string, membershipType: string, paymentAmount: number) {
    return await this.sendToCRM('user-membership', {
      email,
      membershipType,
      paymentAmount,
      updateDate: new Date().toISOString()
    });
  }

  static async updateDoctorVerification(email: string, verificationStatus: string, verifiedBy?: string) {
    return await this.sendToCRM('doctor-verification', {
      email,
      verificationStatus,
      verifiedBy,
      verificationDate: new Date().toISOString()
    });
  }

  static async recordPayment(paymentData: {
    email: string;
    amount: number;
    type: string; // 'membership' | 'booking'
    status: string;
    transactionId?: string;
  }) {
    return await this.sendToCRM('payments', {
      ...paymentData,
      paymentDate: new Date().toISOString()
    });
  }
}

// Helper function to extract user data for CRM
export const prepareUserDataForCRM = (user: any, profile: any, membership?: any): UserData => {
  return {
    email: user.email,
    fullName: profile.full_name || '',
    phone: profile.phone || '',
    dateOfBirth: profile.date_of_birth || '',
    gender: profile.gender || '',
    role: profile.role || 'patient',
    registrationDate: user.created_at || new Date().toISOString(),
    membershipType: membership?.membership_type || 'basic',
    verified: user.email_confirmed_at ? true : false
  };
};

// Helper function to extract doctor data for CRM
export const prepareDoctorDataForCRM = (doctorData: any, userProfile: any): DoctorData => {
  return {
    email: userProfile.email,
    fullName: userProfile.full_name,
    phone: doctorData.phone,
    specialization: doctorData.specialization,
    licenseNumber: doctorData.licenseNumber,
    yearsOfExperience: doctorData.yearsOfExperience,
    consultationFee: doctorData.consultationFee,
    bio: doctorData.bio,
    practiceName: doctorData.practiceName,
    practiceAddress: doctorData.practiceAddress,
    city: doctorData.city,
    province: doctorData.province,
    medicalAid: doctorData.medicalAid || [],
    verificationStatus: doctorData.verificationStatus || 'pending',
    enrollmentDate: new Date().toISOString()
  };
};

// Helper function to extract booking data for CRM
export const prepareBookingDataForCRM = (bookingData: any, patient: any, doctor: any): BookingData => {
  return {
    patientEmail: patient.email,
    doctorEmail: doctor.email,
    appointmentDate: bookingData.appointmentDate,
    appointmentTime: bookingData.appointmentTime,
    reasonForVisit: bookingData.reasonForVisit,
    bookingDate: new Date().toISOString(),
    status: bookingData.status || 'confirmed',
    paymentAmount: bookingData.paymentAmount,
    paymentStatus: bookingData.paymentStatus || 'pending'
  };
};
