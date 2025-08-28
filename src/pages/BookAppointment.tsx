// Enhanced Booking Flow for ironledgermedmap.site
// File: src/pages/BookAppointment.tsx (enhance existing)

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// PayFast Configuration
const PAYFAST_MERCHANT_ID = import.meta.env.VITE_PAYFAST_MERCHANT_ID || '31415521';
const PAYFAST_MERCHANT_KEY = import.meta.env.VITE_PAYFAST_MERCHANT_KEY || 'vzun2kvtqwrem';
const PAYFAST_PASSPHRASE = import.meta.env.VITE_PAYFAST_PASSPHRASE || 'Jesus1KingNoOther';

interface Doctor {
  id: string;
  full_name: string;
  specialty: string;
  location: string;
  bio?: string;
  phone_number?: string;
  email?: string;
}

interface BookingData {
  doctor_id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  appointment_date: string;
  appointment_time: string;
  payment_type: 'standard' | 'membership';
  payment_amount: number;
}

// Enhanced Navigation Component with Home Button
const NavigationHeader = () => (
  <nav className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">IM</span>
          </div>
          <span className="text-xl font-bold text-gray-900">IronLedger MedMap</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
          <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

export default function BookAppointment() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [step, setStep] = useState<'select-doctor' | 'patient-details' | 'payment' | 'confirmation'>('select-doctor');
  const [bookingData, setBookingData] = useState<BookingData>({
    doctor_id: '',
    patient_name: '',
    patient_email: '',
    patient_phone: '',
    appointment_date: '',
    appointment_time: '',
    payment_type: 'standard',
    payment_amount: 10
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('full_name');

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load doctors. Please refresh the page.'
      });
    }
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setBookingData(prev => ({ ...prev, doctor_id: doctor.id }));
    setStep('patient-details');
  };

  const handlePatientDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData.patient_name || !bookingData.patient_email || 
        !bookingData.appointment_date || !bookingData.appointment_time) {
      setMessage({
        type: 'error',
        text: 'Please fill in all required fields'
      });
      return;
    }

    setStep('payment');
  };

  const generatePayFastForm = () => {
    const merchantId = PAYFAST_MERCHANT_ID;
    const merchantKey = PAYFAST_MERCHANT_KEY;
    const returnUrl = `${window.location.origin}/booking-success`;
    const cancelUrl = `${window.location.origin}/booking-cancelled`;
    const notifyUrl = `${window.location.origin}/.netlify/functions/payfast-webhook`;
    
    const amount = bookingData.payment_amount.toFixed(2);
    const itemName = `Medical Consultation - Dr. ${selectedDoctor?.full_name}`;
    const itemDescription = `Appointment booking fee`;
    
    // Generate signature (simplified - you should use proper hash generation)
    const signatureString = `merchant_id=${merchantId}&merchant_key=${merchantKey}&return_url=${returnUrl}&cancel_url=${cancelUrl}&notify_url=${notifyUrl}&amount=${amount}&item_name=${itemName}`;
    
    return {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      amount: amount,
      item_name: itemName,
      item_description: itemDescription,
      custom_str1: selectedDoctor?.id,
      custom_str2: bookingData.patient_email,
      custom_str3: bookingData.appointment_date,
      custom_str4: bookingData.appointment_time
    };
  };

  const handlePaymentSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Create booking record first
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          doctor_id: bookingData.doctor_id,
          patient_name: bookingData.patient_name,
          patient_email: bookingData.patient_email,
          patient_phone: bookingData.patient_phone,
          appointment_date: bookingData.appointment_date,
          appointment_time: bookingData.appointment_time,
          status: 'pending',
          payment_status: 'pending',
          payment_amount: bookingData.payment_amount,
          crm_synced: false
        }])
        .select();

      if (bookingError) throw bookingError;

      // Sync to CRM
      if (booking && booking[0]) {
        await fetch('/api/crm-sync/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'booking',
            data: {
              patientName: bookingData.patient_name,
              patientEmail: bookingData.patient_email,
              patientPhone: bookingData.patient_phone,
              doctorId: bookingData.doctor_id,
              appointmentDate: bookingData.appointment_date,
              appointmentTime: bookingData.appointment_time,
              status: 'pending',
              paymentStatus: 'pending',
              paymentAmount: bookingData.payment_amount,
              source: 'ironledger_medmap'
            }
          })
        });

        // Update sync status
        await supabase
          .from('bookings')
          .update({ crm_synced: true })
          .eq('id', booking[0].id);
      }

      // Redirect to PayFast
      const payFastData = generatePayFastForm();
      
      // Create form and submit to PayFast
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://www.payfast.co.za/eng/process';
      
      Object.entries(payFastData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
      
      document.body.appendChild(form);
      form.submit();

    } catch (error: any) {
      console.error('Booking error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to create booking. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {['select-doctor', 'patient-details', 'payment', 'confirmation'].map((stepName, index) => (
          <div key={stepName} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === stepName ? 'bg-blue-600 text-white' : 
              ['select-doctor', 'patient-details', 'payment'].indexOf(step) > index ? 'bg-green-600 text-white' : 
              'bg-gray-300 text-gray-600'
            }`}>
              {index + 1}
            </div>
            {index < 3 && (
              <div className={`w-12 h-1 ${
                ['select-doctor', 'patient-details', 'payment'].indexOf(step) > index ? 'bg-green-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
            <p className="text-gray-600">Choose your doctor and schedule your consultation</p>
          </div>

          {renderStepIndicator()}

          {message && (
            <div className={`mb-6 p-4 rounded-md ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 
              message.type === 'error' ? 'bg-red-50 text-red-700' : 
              'bg-blue-50 text-blue-700'
            }`}>
              {message.text}
            </div>
          )}

          {step === 'select-doctor' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Select a Doctor</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-lg mb-2">{doctor.full_name}</h3>
                    <p className="text-blue-600 mb-2">{doctor.specialty}</p>
                    <p className="text-gray-600 mb-2">📍 {doctor.location}</p>
                    {doctor.bio && (
                      <p className="text-sm text-gray-500 mb-4 line-clamp-3">{doctor.bio}</p>
                    )}
                    <button
                      onClick={() => handleDoctorSelect(doctor)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Select Doctor
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'patient-details' && selectedDoctor && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Appointment Details</h2>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-medium">Selected Doctor: {selectedDoctor.full_name}</p>
                  <p className="text-blue-600">{selectedDoctor.specialty} • {selectedDoctor.location}</p>
                </div>
              </div>

              <form onSubmit={handlePatientDetailsSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={bookingData.patient_name}
                      onChange={(e) => setBookingData(prev => ({ ...prev, patient_name: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={bookingData.patient_email}
                      onChange={(e) => setBookingData(prev => ({ ...prev, patient_email: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={bookingData.patient_phone}
                    onChange={(e) => setBookingData(prev => ({ ...prev, patient_phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+27 12 345 6789"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Date *
                    </label>
                    <input
                      type="date"
                      value={bookingData.appointment_date}
                      onChange={(e) => setBookingData(prev => ({ ...prev, appointment_date: e.target.value }))}
                      min={getMinDate()}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Time *
                    </label>
                    <select
                      value={bookingData.appointment_time}
                      onChange={(e) => setBookingData(prev => ({ ...prev, appointment_time: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select time</option>
                      {getAvailableTimeSlots().map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep('select-doctor')}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Payment Options</h2>
              
              <div className="space-y-4 mb-6">
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer ${
                    bookingData.payment_type === 'standard' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setBookingData(prev => ({ ...prev, payment_type: 'standard', payment_amount: 10 }))}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Pay-Per-Booking</h3>
                      <p className="text-sm text-gray-600">R10 per booking</p>
                    </div>
                    <div className="text-xl font-bold text-blue-600">R10</div>
                  </div>
                </div>

                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer ${
                    bookingData.payment_type === 'membership' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setBookingData(prev => ({ ...prev, payment_type: 'membership', payment_amount: 39 }))}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Premium Membership</h3>
                      <p className="text-sm text-gray-600">R39 quarterly (5 free bookings included)</p>
                      <div className="text-xs text-green-600 mt-1">✅ Best Value</div>
                    </div>
                    <div className="text-xl font-bold text-blue-600">R39</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium mb-2">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Doctor:</span>
                    <span>{selectedDoctor?.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{bookingData.appointment_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{bookingData.appointment_time}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-medium">
                    <span>Total:</span>
                    <span>R{bookingData.payment_amount}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep('patient-details')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  disabled={isLoading}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Pay with PayFast'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}