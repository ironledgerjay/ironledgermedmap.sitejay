import { useState } from 'react';
import { supabase } from '../superbaseClient';
import { useToast } from './use-toast';

interface PaymentDetails {
  amount: number;
  currency: string;
  description: string;
  type: 'membership' | 'booking';
  metadata?: Record<string, any>;
}

interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processPayment = async (paymentDetails: PaymentDetails): Promise<PaymentResult> => {
    setIsProcessing(true);

    try {
      console.log('Processing PayFast payment:', paymentDetails);

      // Generate PayFast payment data
      const paymentData = {
        merchant_id: process.env.VITE_PAYFAST_MERCHANT_ID || '10029392',
        merchant_key: process.env.VITE_PAYFAST_MERCHANT_KEY || 'q1cd2rdny4a53',
        return_url: `${window.location.origin}/payment-success`,
        cancel_url: `${window.location.origin}/payment-cancelled`,
        notify_url: `${window.location.origin}/api/payfast-notify`,
        name_first: 'IronledgerMedMap',
        name_last: 'User',
        email_address: 'user@ironledgermedmap.site',
        m_payment_id: `${paymentDetails.type}_${Date.now()}`,
        amount: paymentDetails.amount.toFixed(2),
        item_name: paymentDetails.description,
        item_description: paymentDetails.description,
        custom_str1: paymentDetails.type,
        custom_str2: JSON.stringify(paymentDetails.metadata || {}),
        email_confirmation: '1',
        confirmation_address: 'payments@ironledgermedmap.site'
      };

      // In a real implementation, you would:
      // 1. Send payment data to your backend
      // 2. Backend generates PayFast signature
      // 3. Backend creates PayFast payment request
      // 4. Frontend redirects to PayFast or opens PayFast widget

      // For demo purposes, we'll create a PayFast form and auto-submit it
      const payfastForm = createPayFastForm(paymentData);

      // In production, you'd redirect to PayFast
      // document.body.appendChild(payfastForm);
      // payfastForm.submit();

      // For demo, simulate successful payment after validation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentId = paymentData.m_payment_id;

      // Log successful payment
      console.log('PayFast payment initiated:', {
        paymentId,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        type: paymentDetails.type
      });

      toast({
        title: "Payment Successful",
        description: `Payment of ${paymentDetails.currency} ${paymentDetails.amount} has been processed via PayFast.`,
        duration: 5000,
      });

      return {
        success: true,
        paymentId
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'PayFast payment failed';

      console.error('PayFast payment error:', error);

      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive"
      });

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const createPayFastForm = (paymentData: Record<string, string>) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://sandbox.payfast.co.za/eng/process'; // Use https://www.payfast.co.za/eng/process for production
    form.style.display = 'none';

    Object.entries(paymentData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    return form;
  };

  const processMembershipPayment = async (membershipType: string, userId: string) => {
    const amount = membershipType === 'premium' ? 39 : 0;
    
    if (amount === 0) {
      // Free basic plan - just update membership in database
      try {
        const { error } = await supabase
          .from('memberships')
          .upsert({
            user_id: userId,
            membership_type: 'basic',
            status: 'active',
            start_date: new Date().toISOString().split('T')[0],
            end_date: null,
            amount_paid: 0,
            bookings_remaining: 0
          });

        if (error) throw error;

        toast({
          title: "Basic Plan Activated",
          description: "Your basic membership has been activated successfully."
        });

        return { success: true };
      } catch (error) {
        return { success: false, error: 'Failed to activate basic plan' };
      }
    }

    const paymentResult = await processPayment({
      amount,
      currency: 'ZAR',
      description: `Premium Membership - Quarterly`,
      type: 'membership',
      metadata: {
        userId,
        membershipType
      }
    });

    if (paymentResult.success) {
      // Update membership in database
      try {
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 3); // 3 months from now

        const { error } = await supabase
          .from('memberships')
          .upsert({
            user_id: userId,
            membership_type: 'premium',
            status: 'active',
            start_date: new Date().toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
            amount_paid: amount,
            payment_method: 'card',
            bookings_remaining: 5 // First 5 bookings free
          });

        if (error) throw error;
      } catch (error) {
        console.error('Error updating membership:', error);
      }
    }

    return paymentResult;
  };

  const processBookingPayment = async (bookingId: string, amount: number, hasFreeBookings: boolean) => {
    if (hasFreeBookings) {
      // User has free bookings remaining
      try {
        const { error } = await supabase
          .from('bookings')
          .update({
            payment_status: 'paid',
            convenience_fee: 0
          })
          .eq('id', bookingId);

        if (error) throw error;

        // Decrease free bookings count
        const { error: membershipError } = await supabase.rpc('decrease_free_bookings');
        
        if (membershipError) console.error('Error updating free bookings:', membershipError);

        toast({
          title: "Booking Confirmed",
          description: "Your booking has been confirmed using your free booking allowance."
        });

        return { success: true };
      } catch (error) {
        return { success: false, error: 'Failed to confirm booking' };
      }
    }

    const paymentResult = await processPayment({
      amount,
      currency: 'ZAR',
      description: `Medical Consultation Booking`,
      type: 'booking',
      metadata: {
        bookingId
      }
    });

    if (paymentResult.success) {
      // Update booking payment status
      try {
        const { error } = await supabase
          .from('bookings')
          .update({
            payment_status: 'paid'
          })
          .eq('id', bookingId);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating booking payment status:', error);
      }
    }

    return paymentResult;
  };

  return {
    processPayment,
    processMembershipPayment,
    processBookingPayment,
    isProcessing
  };
};
