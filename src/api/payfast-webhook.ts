// PayFast Webhook Handler for ironledgermedmap.site
// File: netlify/functions/payfast-webhook.ts

import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const payfastPassphrase = process.env.VITE_PAYFAST_PASSPHRASE || 'Jesus1KingNoOther';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface PayFastNotification {
  m_payment_id: string;
  pf_payment_id: string;
  payment_status: string;
  item_name: string;
  item_description: string;
  amount_gross: string;
  amount_fee: string;
  amount_net: string;
  custom_str1: string; // doctor_id
  custom_str2: string; // patient_email
  custom_str3: string; // appointment_date
  custom_str4: string; // appointment_time
  custom_str5?: string;
  name_first?: string;
  name_last?: string;
  email_address?: string;
  merchant_id: string;
  signature: string;
}

const verifyPayFastSignature = (data: any, signature: string): boolean => {
  // In production, implement proper signature verification
  // This is a simplified version
  
  const crypto = require('crypto');
  
  // Remove signature from data
  const { signature: _, ...signatureData } = data;
  
  // Create parameter string
  let paramString = '';
  Object.keys(signatureData).sort().forEach(key => {
    if (signatureData[key] !== '') {
      paramString += `${key}=${encodeURIComponent(signatureData[key])}&`;
    }
  });
  
  // Remove last &
  paramString = paramString.slice(0, -1);
  
  // Add passphrase
  if (payfastPassphrase) {
    paramString += `&passphrase=${encodeURIComponent(payfastPassphrase)}`;
  }
  
  // Generate signature
  const hash = crypto.createHash('md5').update(paramString).digest('hex');
  
  return hash === signature;
};

const syncPaymentToCRM = async (paymentData: any) => {
  try {
    const response = await fetch(process.env.CRM_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Source': 'payfast-payment'
      },
      body: JSON.stringify({
        type: 'payment_confirmation',
        data: paymentData,
        timestamp: new Date().toISOString(),
        source: 'external_site'
      })
    });

    if (response.ok) {
      console.log('✅ Payment synced to CRM successfully');
    } else {
      console.warn('⚠️ Failed to sync payment to CRM');
    }
  } catch (error) {
    console.warn('⚠️ CRM payment sync failed:', error);
  }
};

export const handler: Handler = async (event, context) => {
  console.log('🔔 PayFast webhook received');

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the form data from PayFast
    const formData = new URLSearchParams(event.body || '');
    const paymentData: any = {};
    
    for (const [key, value] of formData.entries()) {
      paymentData[key] = value;
    }

    console.log('📦 PayFast notification data:', {
      payment_id: paymentData.pf_payment_id,
      status: paymentData.payment_status,
      amount: paymentData.amount_gross,
      patient_email: paymentData.custom_str2
    });

    // Verify signature (in production)
    // const isValidSignature = verifyPayFastSignature(paymentData, paymentData.signature);
    // if (!isValidSignature) {
    //   console.error('❌ Invalid PayFast signature');
    //   return { statusCode: 400, body: 'Invalid signature' };
    // }

    const {
      pf_payment_id,
      payment_status,
      amount_gross,
      custom_str1: doctor_id,
      custom_str2: patient_email,
      custom_str3: appointment_date,
      custom_str4: appointment_time,
      item_name,
      email_address
    } = paymentData;

    // Find the booking record
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('patient_email', patient_email)
      .eq('appointment_date', appointment_date)
      .eq('appointment_time', appointment_time)
      .eq('doctor_id', doctor_id)
      .single();

    if (bookingError || !booking) {
      console.error('❌ Booking not found:', bookingError);
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Booking not found' })
      };
    }

    // Update booking with payment information
    const updateData: any = {
      payfast_payment_id: pf_payment_id,
      payment_status: payment_status === 'COMPLETE' ? 'completed' : 'failed',
      status: payment_status === 'COMPLETE' ? 'confirmed' : 'cancelled'
    };

    const { error: updateError } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', booking.id);

    if (updateError) {
      console.error('❌ Failed to update booking:', updateError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to update booking' })
      };
    }

    console.log(`✅ Booking ${booking.id} updated with payment status: ${payment_status}`);

    // Sync to CRM
    await syncPaymentToCRM({
      bookingId: booking.id,
      paymentId: pf_payment_id,
      paymentStatus: payment_status,
      amount: amount_gross,
      patientEmail: patient_email,
      doctorId: doctor_id,
      appointmentDate: appointment_date,
      appointmentTime: appointment_time
    });

    // Send confirmation email if payment successful
    if (payment_status === 'COMPLETE') {
      // You can implement email sending here
      console.log(`📧 Should send confirmation email to ${patient_email}`);
    }

    return {
      statusCode: 200,
      body: 'Payment processed successfully'
    };

  } catch (error) {
    console.error('❌ PayFast webhook error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        details: (error as Error).message
      })
    };
  }
};