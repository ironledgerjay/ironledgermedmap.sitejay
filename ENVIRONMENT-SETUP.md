# Environment Setup Guide

## Required Environment Variables

This application requires several environment variables to be configured for proper operation. Copy the `.env.example` file to `.env` and fill in the required values.

```bash
cp .env.example .env
```

## Configuration Steps

### 1. Supabase Configuration

```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**How to get these values:**
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key

### 2. Stripe Configuration (Payment Processing)

```env
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

**How to get this value:**
1. Go to your Stripe dashboard
2. Navigate to Developers > API keys
3. Copy the Publishable key (starts with `pk_`)
4. Use test keys for development (starts with `pk_test_`)

### 3. PayFast Configuration (South African Payments)

```env
VITE_PAYFAST_MERCHANT_ID=your_payfast_merchant_id_here
VITE_PAYFAST_MERCHANT_KEY=your_payfast_merchant_key_here
VITE_PAYFAST_PASSPHRASE=your_payfast_passphrase_here
VITE_PAYFAST_SANDBOX=true
```

**How to get these values:**
1. Create a PayFast account at https://www.payfast.co.za/
2. Go to Settings > Integration
3. Copy your Merchant ID, Merchant Key, and set a secure Passphrase
4. Keep `VITE_PAYFAST_SANDBOX=true` for development

### 4. Application Configuration

```env
VITE_APP_URL=http://localhost:8080
VITE_ADMIN_EMAIL=admin@ironledgermedmap.com
```

## Security Notes

⚠️ **IMPORTANT SECURITY CONSIDERATIONS:**

1. **Never commit your `.env` file to version control**
2. **Use different keys for development and production**
3. **Rotate keys regularly in production**
4. **Use environment-specific configurations**

## Database Setup (Neon)

Since Neon is connected, ensure your database has the required tables:

### Required Tables:
- `user_profiles` - User roles and profile information
- `doctors` - Doctor profiles and information
- `medical_practices` - Medical practice details
- `bookings` - Appointment bookings
- `memberships` - User membership information
- `admin_notifications` - Admin notification system

### User Roles:
- `admin` - Full administrative access
- `doctor` - Doctor portal access
- `user` - Regular user access (default)

## Development vs Production

### Development Environment:
- Use Stripe test keys (pk_test_...)
- Set `VITE_PAYFAST_SANDBOX=true`
- Use Supabase development project

### Production Environment:
- Use Stripe live keys (pk_live_...)
- Set `VITE_PAYFAST_SANDBOX=false`
- Use Supabase production project
- Implement proper SSL/HTTPS
- Set up proper domain for `VITE_APP_URL`

## Troubleshooting

### Common Issues:

1. **"Missing environment variable" errors:**
   - Ensure all required variables are set in your `.env` file
   - Restart the development server after adding new variables

2. **Supabase connection issues:**
   - Verify your project URL and anon key
   - Check if your Supabase project is active

3. **Payment processing issues:**
   - Verify your Stripe/PayFast credentials
   - Check if you're using the correct sandbox/live mode settings

### Verifying Setup:

Run this command to check if environment variables are loaded:
```bash
npm run dev
```

If the application starts without errors, your environment is configured correctly.

## Support

For additional help:
- Check the main README.md file
- Review the Supabase documentation
- Contact the development team
