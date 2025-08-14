# IronledgerMedMap Setup Instructions

## 🚀 Database Setup

### 1. Execute Database Schema
1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `database-setup.sql`
4. Execute the script

### 2. Create Test Users
Since the database requires actual user IDs from Supabase Auth, you need to:

1. **Create Test Doctor Account:**
   - Go to your app's signup page
   - Create account with email: `dr.test.smith@example.com`
   - Full name: `Dr. Test Smith`
   - Role: `Doctor`
   - Phone: `+27 82 123 4567`

2. **Create Test Patient Accounts:**
   - Email: `test.patient1@example.com`, Name: `Test Patient One`
   - Email: `test.patient2@example.com`, Name: `Test Patient Two`
   - Role: `Patient` for both

3. **Create Admin Account:**
   - Email: `admin@ironledgermedmap.com`, Name: `Test Admin`
   - Role: `Admin` (you'll need to manually update this in the database)

### 3. Complete Test Data Setup
After creating the users above, get their UUIDs from the `auth.users` table and run:

```sql
-- Get user IDs first
SELECT id, email FROM auth.users;

-- Insert doctor profile (replace UUID with actual doctor's UUID)
INSERT INTO public.doctors (user_id, practice_id, license_number, specialty, years_of_experience, bio, is_verified) VALUES
('YOUR-DOCTOR-UUID-HERE', 
 (SELECT id FROM public.medical_practices WHERE name = 'Test Family Medical Center' LIMIT 1), 
 'TEST123456', 
 'General Practice', 
 10, 
 'Test doctor specializing in family medicine with over 10 years of experience', 
 true);

-- Insert patient memberships (replace UUIDs with actual patient UUIDs)
INSERT INTO public.memberships (user_id, membership_type, status) VALUES
('YOUR-PATIENT-1-UUID-HERE', 'basic', 'active'),
('YOUR-PATIENT-2-UUID-HERE', 'premium', 'active');
```

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
