# IronledgerMedMap Setup Instructions

## 🚀 Database Setup

### 1. Execute Database Schema
1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `database-setup.sql`
4. Execute the script

### 2. Add Comprehensive Test Data
For a fully populated database with realistic test data:

1. **Execute the comprehensive test data script:**
   - Copy and paste the contents of `test-data-complete.sql`
   - Execute in your Supabase SQL Editor

**This will create:**
- **18 Test Doctors** (2 per province across all 9 South African provinces)
- **18 Medical Practices** (covering Western Cape, Gauteng, KwaZulu-Natal, Eastern Cape, Limpopo, Mpumalanga, North West, Free State, Northern Cape)
- **5 Test Patients** with different membership types
- **1 Admin User** for testing admin functionality
- **Sample Bookings** showing completed and upcoming appointments
- **Realistic Data** with proper South African addresses, phone numbers, and medical specialties

**Test Data Includes:**

**Doctors by Province:**
- **Western Cape**: Dr. Test Williams (General Practice), Dr. Test Adams (Cardiology)
- **Gauteng**: Dr. Test Johnson (Neurology), Dr. Test Brown (Pediatrics)
- **KwaZulu-Natal**: Dr. Test Davis (General Practice), Dr. Test Wilson (Gynecology)
- **Eastern Cape**: Dr. Test Miller (Emergency Medicine), Dr. Test Moore (Psychiatry)
- **Limpopo**: Dr. Test Taylor (General Practice), Dr. Test Anderson (Family Medicine)
- **Mpumalanga**: Dr. Test Thomas (General Practice), Dr. Test Jackson (Occupational Health)
- **North West**: Dr. Test White (General Practice), Dr. Test Harris (Pediatrics)
- **Free State**: Dr. Test Martin (Cardiology), Dr. Test Clark (General Practice)
- **Northern Cape**: Dr. Test Rodriguez (General Practice), Dr. Test Lewis (Family Medicine)

**Test Patients:**
- Test Patient One (Basic membership)
- Test Patient Two (Premium membership with 5 free bookings)
- Test Patient Three (Basic membership)
- Test Patient Four (Premium membership with 3 remaining bookings)
- Test Patient Five (Basic membership)

**Admin Access:**
- Email: `admin@ironledgermedmap.com`
- Name: `Test Admin User`

## 💳 Payment Integration

### Current Status
- **Membership payments**: Integrated with mock payment processor
- **Booking payments**: Integrated with convenience fee logic
- **Free bookings**: Premium members get 5 free bookings per quarter

### For Production
You'll want to integrate with a real payment provider:

#### Recommended: PayFast (South Africa)
1. Sign up at [PayFast](https://www.payfast.co.za/)
2. Get your Merchant ID and Merchant Key
3. Update the `usePayment.ts` hook to use PayFast API
4. Add environment variables for PayFast credentials

#### Alternative: Stripe
1. Sign up at [Stripe](https://stripe.com/)
2. Install Stripe SDK: `npm install @stripe/stripe-js`
3. Update payment processing logic

### Test Payment Flow
Currently implemented with:
- 90% success rate simulation
- 2-second processing delay
- Proper database updates on success
- Error handling and rollback on failure

## 🔧 Environment Variables

Add these to your Supabase environment or `.env.local`:

```env
# Supabase (already configured)
VITE_SUPABASE_URL=https://wbikdrduhotwnklrbrlt.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Payment Provider (when ready for production)
VITE_PAYFAST_MERCHANT_ID=your-merchant-id
VITE_PAYFAST_MERCHANT_KEY=your-merchant-key
# OR for Stripe
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-key
```

## 🧪 Testing the Application

### 1. User Registration & Authentication
- ✅ Sign up with different roles (patient, doctor)
- ✅ Login with role-based navigation
- ✅ Profile creation and updates

### 2. Membership System
- ✅ Basic plan (free) activation
- ✅ Premium plan (R39 quarterly) with payment
- ✅ Free booking tracking for premium users

### 3. Booking System
- ✅ Doctor selection and appointment booking
- ✅ Convenience fee calculation (R10 for basic, free for premium first 5)
- ✅ Payment processing integration
- ✅ Booking confirmation and database storage

### 4. Admin Dashboard
- ✅ User management
- ✅ Doctor verification
- ✅ Booking oversight
- ✅ Platform analytics

### 5. Doctor Portal
- ✅ Practice enrollment
- ✅ Booking management
- ✅ Patient overview

## 🔐 Security Notes

1. **Row Level Security (RLS)** is enabled on all tables
2. **Authentication** is required for all sensitive operations
3. **Payment verification** should be added before production
4. **API keys** should be properly secured in environment variables

## 📞 Support

For technical issues:
- Check Supabase logs in the dashboard
- Review browser console for client-side errors
- Test API endpoints in Supabase API docs

The application is now fully functional with:
- Complete user authentication system
- Role-based access control
- Payment processing (mock for now)
- Database schema with proper relationships
- Real-time updates and notifications
