import { z } from 'zod';

// Email validation
export const emailSchema = z.string()
  .email("Please enter a valid email address")
  .min(1, "Email is required");

// Password validation
export const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

// South African phone number validation
export const phoneSchema = z.string()
  .regex(/^(\+27|0)[6-8][0-9]{8}$/, "Please enter a valid South African phone number");

// Name validation
export const nameSchema = z.string()
  .min(2, "Name must be at least 2 characters long")
  .max(50, "Name must be less than 50 characters")
  .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes");

// Medical practice number validation (HPCSA format)
export const practiceNumberSchema = z.string()
  .regex(/^MP\d{6}$/, "Practice number must be in format MP123456");

// South African ID number validation
export const idNumberSchema = z.string()
  .regex(/^\d{13}$/, "South African ID number must be 13 digits")
  .refine((id) => {
    // Basic checksum validation for SA ID numbers
    const digits = id.split('').map(Number);
    const checkDigit = digits[12];
    
    let sum = 0;
    for (let i = 0; i < 12; i += 2) {
      sum += digits[i];
    }
    
    let sum2 = 0;
    for (let i = 1; i < 12; i += 2) {
      const doubled = digits[i] * 2;
      sum2 += doubled > 9 ? doubled - 9 : doubled;
    }
    
    const total = sum + sum2;
    const calculatedCheck = (10 - (total % 10)) % 10;
    
    return calculatedCheck === checkDigit;
  }, "Invalid South African ID number");

// Login form validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required")
});

// Signup form validation
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: nameSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Doctor enrollment validation
export const doctorEnrollmentSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  practiceNumber: practiceNumberSchema,
  specialty: z.string().min(1, "Specialty is required"),
  qualifications: z.string().min(10, "Please provide your qualifications (minimum 10 characters)"),
  experience: z.number().min(0, "Experience must be 0 or greater").max(50, "Experience must be less than 50 years"),
  practiceName: z.string().min(2, "Practice name must be at least 2 characters"),
  practiceAddress: z.string().min(10, "Please provide a complete practice address"),
  consultationFee: z.number().min(0, "Consultation fee must be 0 or greater").max(10000, "Consultation fee seems too high")
});

// Booking validation
export const bookingSchema = z.object({
  doctorId: z.string().uuid("Invalid doctor selection"),
  appointmentDate: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, "Appointment date must be today or in the future"),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/, "Please select a valid time"),
  reasonForVisit: z.string().min(5, "Please provide a reason for your visit (minimum 5 characters)").max(500, "Reason must be less than 500 characters"),
  patientName: nameSchema,
  patientPhone: phoneSchema,
  patientEmail: emailSchema,
  emergencyContact: phoneSchema.optional(),
  medicalAidNumber: z.string().optional(),
  allergies: z.string().max(500, "Allergies information must be less than 500 characters").optional(),
  currentMedications: z.string().max(500, "Current medications must be less than 500 characters").optional()
});

// Contact form validation
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(100, "Subject must be less than 100 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters")
});

// Helper function to format validation errors
export const formatValidationError = (error: z.ZodError) => {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));
};

// Helper function to validate form data
export const validateFormData = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: Array<{ field: string; message: string }> } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: formatValidationError(error) };
    }
    return { success: false, errors: [{ field: 'unknown', message: 'Validation failed' }] };
  }
};
