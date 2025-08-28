// Basic Doctor Enrollment Page for ironledgermedmap.site
// File: src/pages/DoctorEnrollment.tsx

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function DoctorEnrollment() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    specialty: '',
    location: '',
    bio: '',
    medical_aid: 'Various Medical Aids Accepted',
    practice_name: '',
    medical_license: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const specialties = [
    'General Practice',
    'Cardiology',
    'Dermatology',
    'Emergency Medicine',
    'Internal Medicine',
    'Neurology',
    'Ophthalmology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Surgery'
  ];

  const locations = [
    'Cape Town',
    'Johannesburg',
    'Durban',
    'Pretoria',
    'Port Elizabeth',
    'Bloemfontein',
    'East London',
    'Pietermaritzburg',
    'Kimberley',
    'Polokwane'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate required fields
      if (!formData.full_name || !formData.email || !formData.phone_number || 
          !formData.specialty || !formData.location || !formData.medical_license) {
        throw new Error('Please fill in all required fields');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Check if doctor already exists
      const { data: existingDoctor } = await supabase
        .from('doctors')
        .select('id')
        .eq('email', formData.email.toLowerCase())
        .single();

      if (existingDoctor) {
        throw new Error('A doctor with this email address is already registered');
      }

      // Insert into Supabase
      const { data, error } = await supabase
        .from('doctors')
        .insert([{
          ...formData,
          email: formData.email.toLowerCase(),
          crm_synced: false
        }])
        .select();

      if (error) {
        throw error;
      }

      setMessage({
        type: 'success',
        text: 'Registration successful! Your application has been submitted and will be reviewed by our team within 24-48 hours. You will receive an email confirmation shortly.'
      });
      
      // Reset form
      setFormData({
        full_name: '',
        email: '',
        phone_number: '',
        specialty: '',
        location: '',
        bio: '',
        medical_aid: 'Various Medical Aids Accepted',
        practice_name: '',
        medical_license: ''
      });

    } catch (error) {
      console.error('Registration error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IM</span>
              </div>
              <span className="text-xl font-bold text-gray-900">IronLedger MedMap</span>
            </a>
            <div className="flex items-center space-x-4">
              <a href="/login" className="text-gray-600 hover:text-gray-900">Login</a>
              <a href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Join IronLedger MedMap
              </h1>
              <p className="text-gray-600">
                Register your practice and connect with patients across South Africa
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  ✅ Free registration • ✅ Verified patient base • ✅ Secure payments
                </p>
              </div>
            </div>

            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Dr. John Smith"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="dr.smith@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="+27 11 123 4567"
                  />
                </div>

                <div>
                  <label htmlFor="medical_license" className="block text-sm font-medium text-gray-700 mb-2">
                    Medical License Number *
                  </label>
                  <input
                    type="text"
                    id="medical_license"
                    name="medical_license"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.medical_license}
                    onChange={handleInputChange}
                    placeholder="HPCSA License Number"
                  />
                </div>

                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Specialty *
                  </label>
                  <select
                    id="specialty"
                    name="specialty"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.specialty}
                    onChange={handleInputChange}
                  >
                    <option value="">Select your specialty</option>
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Practice Location *
                  </label>
                  <select
                    id="location"
                    name="location"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.location}
                    onChange={handleInputChange}
                  >
                    <option value="">Select your city</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="practice_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Practice/Hospital Name
                  </label>
                  <input
                    type="text"
                    id="practice_name"
                    name="practice_name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.practice_name}
                    onChange={handleInputChange}
                    placeholder="Medical Centre Name"
                  />
                </div>

                <div>
                  <label htmlFor="medical_aid" className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Aid Acceptance
                  </label>
                  <input
                    type="text"
                    id="medical_aid"
                    name="medical_aid"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.medical_aid}
                    onChange={handleInputChange}
                    placeholder="Discovery, Momentum, Bonitas..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Brief description of your qualifications, experience, and areas of expertise..."
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Registration Benefits:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Access to verified patient database</li>
                  <li>• Online appointment booking system</li>
                  <li>• Secure payment processing</li>
                  <li>• Professional profile listing</li>
                  <li>• Medical aid integration</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting Registration...' : 'Submit Registration'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By registering, you agree to our Terms of Service and Privacy Policy. 
                All registrations are subject to verification and approval.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}