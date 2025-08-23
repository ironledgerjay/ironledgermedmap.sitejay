// API endpoints for payment processing
// Note: In production, these would be actual backend endpoints

interface PaymentRequest {
  paymentId: string;
  provider: 'payfast';
  amount: number;
  currency: string;
  description: string;
  type: 'membership' | 'booking';
  metadata?: Record<string, any>;
  status: string;
}

interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, any>;
}

interface MembershipRequest {
  userId: string;
  membershipType: 'basic' | 'premium';
  amount: number;
}

interface BookingConfirmRequest {
  bookingId: string;
}

// Simulated API responses for development
export const paymentsAPI = {

  // Store payment record
  createPayment: async (data: PaymentRequest) => {
    // In production, this would store to Neon database
    console.log('Creating payment record:', data);
    
    // Simulate database operation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // For demo, store in localStorage as backup
    const payments = JSON.parse(localStorage.getItem('demo_payments') || '[]');
    payments.push({
      ...data,
      id: data.paymentId,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem('demo_payments', JSON.stringify(payments));

    return {
      success: true,
      paymentId: data.paymentId,
    };
  },

  // Create or update membership
  createMembership: async (data: MembershipRequest) => {
    console.log('Creating membership:', data);
    
    // Simulate database operation
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (Math.random() > 0.98) {
      throw new Error('Failed to create membership');
    }

    // For demo, store in localStorage
    const memberships = JSON.parse(localStorage.getItem('demo_memberships') || '[]');
    const newMembership = {
      id: `mem_${Date.now()}`,
      user_id: data.userId,
      membership_type: data.membershipType,
      status: 'active',
      start_date: new Date().toISOString().split('T')[0],
      end_date: data.membershipType === 'premium' 
        ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 3 months
        : null,
      amount_paid: data.amount,
      bookings_remaining: data.membershipType === 'premium' ? 5 : 0,
      created_at: new Date().toISOString(),
    };
    
    memberships.push(newMembership);
    localStorage.setItem('demo_memberships', JSON.stringify(memberships));

    return {
      success: true,
      membership: newMembership,
    };
  },

  // Confirm free booking
  confirmFreeBooking: async (bookingId: string) => {
    console.log('Confirming free booking:', bookingId);
    
    // Simulate database operations
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (Math.random() > 0.98) {
      throw new Error('Failed to confirm free booking');
    }

    // For demo, update localStorage
    const bookings = JSON.parse(localStorage.getItem('demo_bookings') || '[]');
    const bookingIndex = bookings.findIndex((b: any) => b.id === bookingId);
    
    if (bookingIndex !== -1) {
      bookings[bookingIndex] = {
        ...bookings[bookingIndex],
        payment_status: 'paid',
        convenience_fee: 0,
        used_free_booking: true,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem('demo_bookings', JSON.stringify(bookings));
    }

    // Decrease free bookings count
    const memberships = JSON.parse(localStorage.getItem('demo_memberships') || '[]');
    const activePremium = memberships.find((m: any) => 
      m.status === 'active' && 
      m.membership_type === 'premium' && 
      m.bookings_remaining > 0
    );
    
    if (activePremium) {
      activePremium.bookings_remaining--;
      activePremium.updated_at = new Date().toISOString();
      localStorage.setItem('demo_memberships', JSON.stringify(memberships));
    }

    return {
      success: true,
      bookingId,
    };
  },

  // Get payment status
  getPaymentStatus: async (paymentId: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const payments = JSON.parse(localStorage.getItem('demo_payments') || '[]');
    const payment = payments.find((p: any) => p.id === paymentId);
    
    return payment || null;
  },

  // Update payment status (for webhook simulation)
  updatePaymentStatus: async (paymentId: string, status: string, metadata?: Record<string, any>) => {
    console.log('Updating payment status:', paymentId, status);
    
    const payments = JSON.parse(localStorage.getItem('demo_payments') || '[]');
    const paymentIndex = payments.findIndex((p: any) => p.id === paymentId);
    
    if (paymentIndex !== -1) {
      payments[paymentIndex] = {
        ...payments[paymentIndex],
        status,
        ...(metadata && { metadata: { ...payments[paymentIndex].metadata, ...metadata } }),
        updated_at: new Date().toISOString(),
        ...(status === 'completed' && { completed_at: new Date().toISOString() }),
        ...(status === 'failed' && { failed_at: new Date().toISOString() }),
      };
      localStorage.setItem('demo_payments', JSON.stringify(payments));
      
      return { success: true, payment: payments[paymentIndex] };
    }
    
    return { success: false, error: 'Payment not found' };
  },
};

// Mock fetch implementation for development
export const setupMockAPI = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async (url: string | URL, options?: RequestInit) => {
    const urlString = url.toString();
    
    // Handle payment API routes
    if (urlString.includes('/api/payments') && options?.method === 'POST') {
      const body = JSON.parse(options?.body as string || '{}');
      const result = await paymentsAPI.createPayment(body);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (urlString.includes('/api/memberships') && options?.method === 'POST') {
      const body = JSON.parse(options?.body as string || '{}');
      const result = await paymentsAPI.createMembership(body);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (urlString.includes('/confirm-free') && options?.method === 'POST') {
      const bookingId = urlString.split('/')[3]; // Extract booking ID from URL
      const result = await paymentsAPI.confirmFreeBooking(bookingId);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Fall back to original fetch for other requests
    return originalFetch(url, options);
  };
};

// Development mode setup
if (import.meta.env.DEV) {
  setupMockAPI();
}
