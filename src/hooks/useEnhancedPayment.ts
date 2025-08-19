import { useState } from 'react';
import { useToast } from './use-toast';
import { stripePromise } from '../lib/stripe';
import { payfastService, PayFastPaymentData } from '../lib/payfast';

export type PaymentProvider = 'stripe' | 'payfast';

interface PaymentDetails {
  amount: number;
  currency: string;
  description: string;
  type: 'membership' | 'booking';
  provider: PaymentProvider;
  metadata?: Record<string, any>;
  userEmail: string;
  userName: string;
}

interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
  redirectUrl?: string;
  requiresRedirect?: boolean;
}

interface PaymentUrls {
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
}

export const useEnhancedPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const generatePaymentUrls = (paymentId: string): PaymentUrls => {
    const baseUrl = window.location.origin;
    return {
      returnUrl: `${baseUrl}/payment/success?payment_id=${paymentId}`,
      cancelUrl: `${baseUrl}/payment/cancelled?payment_id=${paymentId}`,
      notifyUrl: `${baseUrl}/api/webhooks/payfast`,
    };
  };

  const processStripePayment = async (
    paymentDetails: PaymentDetails
  ): Promise<PaymentResult> => {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      // Create payment intent on your backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(paymentDetails.amount * 100), // Convert to cents
          currency: paymentDetails.currency.toLowerCase(),
          description: paymentDetails.description,
          metadata: {
            ...paymentDetails.metadata,
            provider: 'stripe',
            type: paymentDetails.type,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { client_secret, payment_intent_id } = await response.json();

      // For now, return success with mock data
      // In production, you'd confirm the payment with Stripe Elements
      const paymentId = payment_intent_id || `stripe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      toast({
        title: "Payment Processing",
        description: "Redirecting to Stripe checkout...",
      });

      return {
        success: true,
        paymentId,
        requiresRedirect: false, // Set to true when using Stripe Checkout
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Stripe payment failed';
      console.error('Stripe payment error:', error);
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const processPayFastPayment = async (
    paymentDetails: PaymentDetails
  ): Promise<PaymentResult> => {
    try {
      const paymentId = `payfast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const urls = generatePaymentUrls(paymentId);

      const paymentData: PayFastPaymentData = payfastService.createPaymentData({
        amount: paymentDetails.amount,
        description: paymentDetails.description,
        paymentId,
        userEmail: paymentDetails.userEmail,
        userName: paymentDetails.userName,
        returnUrl: urls.returnUrl,
        cancelUrl: urls.cancelUrl,
        notifyUrl: urls.notifyUrl,
      });

      // Store payment in database before redirect
      await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          provider: 'payfast',
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          description: paymentDetails.description,
          type: paymentDetails.type,
          metadata: paymentDetails.metadata,
          status: 'pending',
        }),
      });

      toast({
        title: "Redirecting to PayFast",
        description: "You will be redirected to complete your payment...",
      });

      // Redirect to PayFast
      await payfastService.redirectToPayment(paymentData);

      return {
        success: true,
        paymentId,
        requiresRedirect: true,
        redirectUrl: `${payfastService['baseUrl']}`,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'PayFast payment failed';
      console.error('PayFast payment error:', error);
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const processPayment = async (paymentDetails: PaymentDetails): Promise<PaymentResult> => {
    setIsProcessing(true);

    try {
      let result: PaymentResult;

      switch (paymentDetails.provider) {
        case 'stripe':
          result = await processStripePayment(paymentDetails);
          break;
        case 'payfast':
          result = await processPayFastPayment(paymentDetails);
          break;
        default:
          throw new Error(`Unsupported payment provider: ${paymentDetails.provider}`);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const processMembershipPayment = async (
    membershipType: string,
    userId: string,
    provider: PaymentProvider,
    userEmail: string,
    userName: string
  ): Promise<PaymentResult> => {
    const amount = membershipType === 'premium' ? 39 : 0;
    
    if (amount === 0) {
      // Free basic plan - no payment processing needed
      try {
        const response = await fetch('/api/memberships', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            membershipType: 'basic',
            amount: 0,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create basic membership');
        }

        toast({
          title: "Basic Plan Activated",
          description: "Your basic membership has been activated successfully.",
        });

        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          error: 'Failed to activate basic plan' 
        };
      }
    }

    return processPayment({
      amount,
      currency: 'ZAR',
      description: 'Premium Membership - Quarterly',
      type: 'membership',
      provider,
      userEmail,
      userName,
      metadata: {
        userId,
        membershipType,
      },
    });
  };

  const processBookingPayment = async (
    bookingId: string,
    amount: number,
    provider: PaymentProvider,
    userEmail: string,
    userName: string,
    hasFreeBookings: boolean = false
  ): Promise<PaymentResult> => {
    if (hasFreeBookings) {
      // Use free booking
      try {
        const response = await fetch(`/api/bookings/${bookingId}/confirm-free`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to confirm free booking');
        }

        toast({
          title: "Booking Confirmed",
          description: "Your booking has been confirmed using your free booking allowance.",
        });

        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          error: 'Failed to confirm booking' 
        };
      }
    }

    return processPayment({
      amount,
      currency: 'ZAR',
      description: 'Medical Consultation Booking',
      type: 'booking',
      provider,
      userEmail,
      userName,
      metadata: {
        bookingId,
      },
    });
  };

  return {
    processPayment,
    processMembershipPayment,
    processBookingPayment,
    isProcessing,
  };
};
