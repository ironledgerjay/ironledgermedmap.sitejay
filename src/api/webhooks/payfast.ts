// PayFast webhook handler for payment notifications
import { payfastService } from '../../lib/payfast';
import { supabase } from '../../superbaseClient';

interface PayFastNotification {
  m_payment_id: string;
  pf_payment_id: string;
  payment_status: 'COMPLETE' | 'FAILED' | 'CANCELLED';
  item_name: string;
  item_description: string;
  amount_gross: string;
  amount_fee: string;
  amount_net: string;
  name_first: string;
  name_last: string;
  email_address: string;
  merchant_id: string;
  signature: string;
}

export const handlePayFastWebhook = async (notification: PayFastNotification) => {
  try {
    console.log('PayFast webhook received:', notification);

    // Verify the notification signature
    const isValid = payfastService.verifyNotification(notification);
    
    if (!isValid) {
      console.error('Invalid PayFast notification signature');
      return { success: false, error: 'Invalid signature' };
    }

    const { m_payment_id, payment_status, amount_gross, pf_payment_id } = notification;

    // Update payment record in database
    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        status: payment_status.toLowerCase(),
        payfast_payment_id: pf_payment_id,
        amount_gross: parseFloat(amount_gross),
        updated_at: new Date().toISOString(),
        webhook_data: notification
      })
      .eq('payment_id', m_payment_id);

    if (paymentError) {
      console.error('Error updating payment record:', paymentError);
    }

    // Handle successful payments
    if (payment_status === 'COMPLETE') {
      await handleSuccessfulPayment(m_payment_id, notification);
    }
    
    // Handle failed payments
    if (payment_status === 'FAILED' || payment_status === 'CANCELLED') {
      await handleFailedPayment(m_payment_id, notification);
    }

    return { success: true };

  } catch (error) {
    console.error('PayFast webhook processing error:', error);
    return { success: false, error: error.message };
  }
};

const handleSuccessfulPayment = async (paymentId: string, notification: PayFastNotification) => {
  try {
    // Determine payment type from payment ID prefix
    if (paymentId.includes('membership')) {
      await handleMembershipPayment(paymentId, notification);
    } else if (paymentId.includes('booking')) {
      await handleBookingPayment(paymentId, notification);
    }
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
};

const handleFailedPayment = async (paymentId: string, notification: PayFastNotification) => {
  try {
    console.log(`Payment failed for ${paymentId}:`, notification.payment_status);
    
    // You could send failure notification emails here
    // Or update booking/membership status accordingly
    
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
};

const handleMembershipPayment = async (paymentId: string, notification: PayFastNotification) => {
  try {
    // Extract user ID and membership type from payment metadata
    // This would typically be stored in your payments table
    
    // Update membership status
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3); // 3 months for premium

    const { error } = await supabase
      .from('memberships')
      .update({
        status: 'active',
        payment_status: 'paid',
        payfast_payment_id: notification.pf_payment_id,
        amount_paid: parseFloat(notification.amount_gross),
        updated_at: new Date().toISOString()
      })
      .eq('payment_id', paymentId);

    if (error) {
      console.error('Error updating membership:', error);
    } else {
      console.log('Membership activated successfully for payment:', paymentId);
    }

  } catch (error) {
    console.error('Error processing membership payment:', error);
  }
};

const handleBookingPayment = async (paymentId: string, notification: PayFastNotification) => {
  try {
    // Update booking payment status
    const { error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'paid',
        payfast_payment_id: notification.pf_payment_id,
        updated_at: new Date().toISOString()
      })
      .eq('payment_id', paymentId);

    if (error) {
      console.error('Error updating booking payment:', error);
    } else {
      console.log('Booking payment confirmed for:', paymentId);
      
      // Send confirmation email to patient and doctor
      // This would integrate with your email service
    }

  } catch (error) {
    console.error('Error processing booking payment:', error);
  }
};

// For use in a serverless function or API route
export const payfastWebhookHandler = async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const notification = await req.json() as PayFastNotification;
    const result = await handlePayFastWebhook(notification);
    
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return new Response('Internal server error', { status: 500 });
  }
};
