// CRM Sync API Endpoint for ironledgermedmap.site
// File: netlify/functions/crm-sync.ts or api/crm-sync.ts

import { Handler } from '@netlify/functions';

const CRM_DATABASE_URL = process.env.CRM_DATABASE_URL;
const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL;

interface DoctorSyncData {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  specialty: string;
  hospital: string;
  address: string;
  metadata: {
    yearsExperience: number;
    bio: string;
    medicalAid: string;
    submittedAt: string;
    enrollmentMethod: string;
  };
  source: string;
}

interface PatientSyncData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  accountType: string;
  source: string;
}

interface BookingSyncData {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  paymentStatus: string;
  paymentAmount: number;
  source: string;
}

const syncToCRMDatabase = async (type: string, data: any) => {
  try {
    if (!CRM_DATABASE_URL) {
      console.warn('CRM_DATABASE_URL not configured, skipping direct database sync');
      return null;
    }

    // Import postgres client
    const { Client } = require('pg');
    
    const client = new Client({
      connectionString: CRM_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();

    let result = null;

    switch (type) {
      case 'doctor_registration':
        const doctorData: DoctorSyncData = data;
        result = await client.query(`
          INSERT INTO doctor_registrations (
            name, email, phone, license_number, specialty, hospital, address, 
            certifications, metadata, status, source, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
          RETURNING id
        `, [
          doctorData.name,
          doctorData.email,
          doctorData.phone,
          doctorData.licenseNumber,
          doctorData.specialty,
          doctorData.hospital,
          doctorData.address,
          [], // certifications array
          doctorData.metadata,
          'pending',
          doctorData.source
        ]);
        break;

      case 'patient_registration':
        const patientData: PatientSyncData = data;
        result = await client.query(`
          INSERT INTO patient_enrollments (
            patient_name, patient_email, patient_phone, program, status, source, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
          RETURNING id
        `, [
          patientData.name,
          patientData.email,
          patientData.phone,
          'general',
          'active',
          patientData.source
        ]);
        break;

      case 'booking':
        const bookingData: BookingSyncData = data;
        result = await client.query(`
          INSERT INTO bookings (
            patient_name, patient_email, patient_phone, appointment_date, 
            appointment_time, status, source, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
          RETURNING id
        `, [
          bookingData.patientName,
          bookingData.patientEmail,
          bookingData.patientPhone,
          bookingData.appointmentDate,
          bookingData.appointmentTime,
          bookingData.status,
          bookingData.source
        ]);
        break;
    }

    await client.end();
    return result;

  } catch (error) {
    console.error('Direct CRM database sync failed:', error);
    return null;
  }
};

const syncToCRMWebhook = async (type: string, data: any) => {
  try {
    if (!CRM_WEBHOOK_URL) {
      console.warn('CRM_WEBHOOK_URL not configured, skipping webhook sync');
      return null;
    }

    const response = await fetch(CRM_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Source': 'ironledger-medmap'
      },
      body: JSON.stringify({
        type,
        data,
        timestamp: new Date().toISOString(),
        source: 'external_site'
      })
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
    }

  } catch (error) {
    console.error('CRM webhook sync failed:', error);
    return null;
  }
};

export const handler: Handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: 'Method not allowed. Use POST.' 
      })
    };
  }

  try {
    const { type, data } = JSON.parse(event.body || '{}');

    if (!type || !data) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Missing type or data in request body'
        })
      };
    }

    console.log(`🔄 Syncing ${type} to CRM...`);

    // Try both sync methods
    const [dbResult, webhookResult] = await Promise.allSettled([
      syncToCRMDatabase(type, data),
      syncToCRMWebhook(type, data)
    ]);

    const success = dbResult.status === 'fulfilled' || webhookResult.status === 'fulfilled';

    if (success) {
      console.log(`✅ Successfully synced ${type} to CRM`);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: `${type} synced to CRM successfully`,
          dbSync: dbResult.status === 'fulfilled',
          webhookSync: webhookResult.status === 'fulfilled'
        })
      };
    } else {
      console.error(`❌ Failed to sync ${type} to CRM`);
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Failed to sync to CRM',
          dbError: dbResult.status === 'rejected' ? dbResult.reason : null,
          webhookError: webhookResult.status === 'rejected' ? webhookResult.reason : null
        })
      };
    }

  } catch (error) {
    console.error('CRM sync error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: (error as Error).message
      })
    };
  }
};

// For Express.js version:
/*
import express from 'express';

const router = express.Router();

router.post('/crm-sync/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const data = req.body.data;

    console.log(`🔄 Syncing ${type} to CRM...`);

    const [dbResult, webhookResult] = await Promise.allSettled([
      syncToCRMDatabase(type, data),
      syncToCRMWebhook(type, data)
    ]);

    const success = dbResult.status === 'fulfilled' || webhookResult.status === 'fulfilled';

    if (success) {
      console.log(`✅ Successfully synced ${type} to CRM`);
      res.json({
        success: true,
        message: `${type} synced to CRM successfully`,
        dbSync: dbResult.status === 'fulfilled',
        webhookSync: webhookResult.status === 'fulfilled'
      });
    } else {
      console.error(`❌ Failed to sync ${type} to CRM`);
      res.status(500).json({
        success: false,
        error: 'Failed to sync to CRM'
      });
    }

  } catch (error) {
    console.error('CRM sync error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
*/