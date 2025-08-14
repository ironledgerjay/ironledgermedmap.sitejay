# Admin Dashboard Setup Instructions

## Overview
The admin dashboard has been configured with authentication protection. To complete the setup, you need to create the admin user in your Supabase database.

## Steps to Create Admin User

### 1. Set up Database Tables
First, execute this SQL in your Supabase SQL Editor to ensure the user_profiles table exists:

```sql
-- Create user profiles table if it doesn't exist
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

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Special policy for admin users to view all profiles
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 2. Create Admin User

#### Option A: Via Supabase Auth Dashboard
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add user"
4. Enter:
   - Email: `admin@ironledgermedmap.com`
   - Password: `Medm@p2025`
   - Auto Confirm User: Yes
5. Click "Create user"
6. Copy the user ID

#### Option B: Via SQL (if you have admin access)
```sql
-- This creates a user directly (requires admin privileges)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@ironledgermedmap.com',
  crypt('Medm@p2025', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

### 3. Create Admin Profile
After creating the user, create their profile with admin role:

```sql
-- Insert admin profile (replace USER_ID with the actual user ID from step 2)
INSERT INTO public.user_profiles (
  id,
  email,
  full_name,
  role
) VALUES (
  'USER_ID_HERE', -- Replace with actual user ID
  'admin@ironledgermedmap.com',
  'System Administrator',
  'admin'
);
```

## Testing Admin Access

1. Go to `/login` or `/AdminDashboard`
2. Enter credentials:
   - Email: `admin@ironledgermedmap.com`
   - Password: `Medm@p2025`
3. You should be redirected to the admin dashboard

## Features Implemented

✅ **Routing**: Both `/AdminDashboard` and `/admin-dashboard` now work
✅ **Authentication**: Login system with Supabase
✅ **Authorization**: Role-based access control (admin only)
✅ **Protection**: Unauthorized users are redirected to login
✅ **Dashboard**: Comprehensive admin interface with:
   - User management
   - Doctor verification
   - Booking oversight
   - Platform analytics

## Troubleshooting

If you encounter issues:

1. **Can't access admin dashboard**: Ensure the user has role 'admin' in user_profiles table
2. **Login fails**: Check that the user exists in auth.users and credentials are correct
3. **Database errors**: Ensure all tables and policies are created as shown above

## Security Notes

- The admin credentials are set as requested
- Only users with 'admin' role can access the admin dashboard
- RLS policies protect user data from unauthorized access
- All authentication goes through Supabase's secure auth system
