// API endpoint for doctor registration on ironledgermedmap.site
// Save this as: pages/api/doctors/register.ts (Next.js) or api/doctors/register.js (Express)

// For Next.js API Route:
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface DoctorRegistrationData {
  full_name: string;
  email: string;
  phone_number: string;
  specialty: string;
  location: string;
  bio?: string;
  medical_aid?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const {
      full_name,
      email,
      phone_number,
      specialty,
      location,
      bio,
      medical_aid = 'Various Medical Aids Accepted'
    }: DoctorRegistrationData = req.body;

    // Validate required fields
    if (!full_name || !email || !phone_number || !specialty || !location) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: full_name, email, phone_number, specialty, location'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Check if doctor already exists
    const { data: existingDoctor } = await supabase
      .from('doctors')
      .select('id')
      .eq('email', email)
      .single();

    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        error: 'A doctor with this email already exists'
      });
    }

    // Insert new doctor registration
    const { data, error } = await supabase
      .from('doctors')
      .insert([{
        full_name,
        email: email.toLowerCase(),
        phone_number,
        specialty,
        location,
        bio: bio || null,
        medical_aid
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to register doctor. Please try again.'
      });
    }

    // Log successful registration
    console.log(`✅ New doctor registered: ${full_name} (${email})`);

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Doctor registration successful',
      data: data[0]
    });

  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// For Express.js version:
/*
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

router.post('/doctors/register', async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone_number,
      specialty,
      location,
      bio,
      medical_aid = 'Various Medical Aids Accepted'
    } = req.body;

    // Validation
    if (!full_name || !email || !phone_number || !specialty || !location) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Check existing doctor
    const { data: existingDoctor } = await supabase
      .from('doctors')
      .select('id')
      .eq('email', email)
      .single();

    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        error: 'Doctor already exists'
      });
    }

    // Insert new doctor
    const { data, error } = await supabase
      .from('doctors')
      .insert([{
        full_name,
        email: email.toLowerCase(),
        phone_number,
        specialty,
        location,
        bio: bio || null,
        medical_aid
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: 'Registration failed'
      });
    }

    console.log(`✅ New doctor registered: ${full_name} (${email})`);

    res.status(201).json({
      success: true,
      message: 'Doctor registration successful',
      data: data[0]
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
*/