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
      // For now, we'll simulate payment processing
      // In production, you would integrate with PayFast, Stripe, or another payment provider
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate 90% success rate for demo
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // In production, you would verify the payment with your payment provider
        // before updating the database
        
        toast({
          title: "Payment Successful",
          description: `Payment of R${paymentDetails.amount} has been processed successfully.`
        });
        
        return {
          success: true,
          paymentId
        };
      } else {
        throw new Error('Payment failed. Please try again.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      
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
