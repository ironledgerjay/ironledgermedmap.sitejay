import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
// For development, use Stripe's test key
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef'; // Default test key

export const stripePromise = loadStripe(stripePublishableKey);

export const createPaymentIntent = async (amount: number, currency: string = 'zar', description: string) => {
  try {
    // In production, this would be a call to your backend
    // For now, we'll simulate the payment intent creation
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Stripe expects amount in cents
        currency: currency.toLowerCase(),
        description,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    // For demo purposes, return a mock payment intent
    return {
      client_secret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      id: `pi_mock_${Date.now()}`,
    };
  }
};

export const confirmPayment = async (stripe: any, clientSecret: string, paymentMethod: any) => {
  try {
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.paymentIntent;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};
