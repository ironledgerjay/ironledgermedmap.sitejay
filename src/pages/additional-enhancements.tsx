// Additional External Site Enhancements for ironledgermedmap.site
// These components address remaining gaps and improve user experience

// 1. Enhanced Doctor Search/Filter Component
// File: src/components/DoctorSearch.tsx

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Doctor {
  id: string;
  full_name: string;
  specialty: string;
  location: string;
  bio?: string;
  medical_aid?: string;
  phone_number?: string;
}

interface SearchFilters {
  specialty: string;
  location: string;
  medicalAid: string;
  searchTerm: string;
}

export function DoctorSearch() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    specialty: '',
    location: '',
    medicalAid: '',
    searchTerm: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  const specialties = [
    'General Practice', 'Cardiology', 'Dermatology', 'Emergency Medicine',
    'Family Medicine', 'Internal Medicine', 'Neurology', 'Obstetrics & Gynecology',
    'Oncology', 'Ophthalmology', 'Orthopedics', 'Pediatrics', 'Psychiatry',
    'Radiology', 'Surgery', 'Urology'
  ];

  const locations = [
    'Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Port Elizabeth',
    'Bloemfontein', 'East London', 'Pietermaritzburg', 'Kimberley', 'Polokwane'
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, filters]);

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
    } finally {
      setIsLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors;

    if (filters.specialty) {
      filtered = filtered.filter(doc => 
        doc.specialty?.toLowerCase().includes(filters.specialty.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter(doc => 
        doc.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.medicalAid) {
      filtered = filtered.filter(doc => 
        doc.medical_aid?.toLowerCase().includes(filters.medicalAid.toLowerCase())
      );
    }

    if (filters.searchTerm) {
      filtered = filtered.filter(doc => 
        doc.full_name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        doc.specialty?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        doc.bio?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading doctors...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Search and Filters */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search doctors, specialties..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={filters.specialty}
            onChange={(e) => handleFilterChange('specialty', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Specialties</option>
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>

          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Medical Aid (e.g. Discovery)"
            value={filters.medicalAid}
            onChange={(e) => handleFilterChange('medicalAid', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
          </p>
          <button
            onClick={() => setFilters({ specialty: '', location: '', medicalAid: '', searchTerm: '' })}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Doctor Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">{doctor.full_name}</h3>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Verified
              </span>
            </div>
            
            <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
            <p className="text-gray-600 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {doctor.location}
            </p>
            
            {doctor.medical_aid && (
              <p className="text-sm text-gray-500 mb-3">
                Medical Aid: {doctor.medical_aid}
              </p>
            )}
            
            {doctor.bio && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{doctor.bio}</p>
            )}
            
            <button
              onClick={() => window.location.href = `/book-appointment?doctor=${doctor.id}`}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-600">Try adjusting your search filters to find more doctors.</p>
        </div>
      )}
    </div>
  );
}

// 2. Doctor Profile Page Component
// File: src/pages/DoctorProfile.tsx

import { useParams } from 'react-router-dom';

export function DoctorProfile() {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (doctorId) {
      fetchDoctorProfile(doctorId);
    }
  }, [doctorId]);

  const fetchDoctorProfile = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setDoctor(data);
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Doctor Not Found</h2>
        <p className="text-gray-600 mb-4">The doctor you're looking for doesn't exist.</p>
        <a href="/search" className="text-blue-600 hover:text-blue-700">
          Browse all doctors
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor.full_name}</h1>
            <p className="text-xl text-blue-600 font-medium">{doctor.specialty}</p>
            <p className="text-gray-600 flex items-center mt-2">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {doctor.location}
            </p>
          </div>
          <button
            onClick={() => window.location.href = `/book-appointment?doctor=${doctor.id}`}
            className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Book Appointment
          </button>
        </div>

        {doctor.bio && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About Dr. {doctor.full_name}</h2>
            <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              {doctor.phone_number && (
                <p className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {doctor.phone_number}
                </p>
              )}
              <p className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {doctor.location}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Aid</h3>
            <p className="text-gray-600">{doctor.medical_aid || 'Various Medical Aids Accepted'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Booking Success/Cancelled Pages
// File: src/pages/BookingSuccess.tsx

export function BookingSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Your appointment has been successfully booked. You will receive a confirmation email shortly.
        </p>
        <div className="space-y-3">
          <a
            href="/my-appointments"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            View My Appointments
          </a>
          <a
            href="/"
            className="block w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

// File: src/pages/BookingCancelled.tsx

export function BookingCancelled() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your appointment booking was cancelled. No payment was processed.
        </p>
        <div className="space-y-3">
          <a
            href="/book-appointment"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </a>
          <a
            href="/"
            className="block w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}