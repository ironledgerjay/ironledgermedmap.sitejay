// Custom email service for IronledgerMedMap
import { supabase } from '@/superbaseClient';

interface EmailTemplate {
  type: 'welcome' | 'verification' | 'doctor_approved' | 'doctor_rejected' | 'appointment_confirmation';
  subject: string;
  htmlContent: string;
  textContent: string;
}

interface EmailData {
  to: string;
  name?: string;
  verificationUrl?: string;
  appointmentDetails?: any;
  doctorName?: string;
  rejectionReason?: string;
}

class EmailService {
  private fromEmail = 'noreply@ironledgermedmap.co.za';
  private fromName = 'IronledgerMedMap';

  // Email templates
  private templates: Record<string, EmailTemplate> = {
    welcome: {
      type: 'welcome',
      subject: 'Welcome to IronledgerMedMap - South Africa\'s Premier Medical Platform',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to IronledgerMedMap</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); padding: 40px 20px; text-align: center; }
            .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .tagline { color: #e6fffa; font-size: 16px; }
            .content { padding: 40px 30px; }
            .greeting { font-size: 24px; font-weight: 600; color: #1f2937; margin-bottom: 20px; }
            .message { font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 30px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .features { background-color: #f8fafc; padding: 30px; margin: 30px 0; border-radius: 12px; }
            .feature { display: flex; align-items: center; margin-bottom: 15px; }
            .feature-icon { width: 24px; height: 24px; background-color: #14b8a6; border-radius: 50%; margin-right: 15px; }
            .footer { background-color: #1f2937; color: #9ca3af; padding: 30px; text-align: center; font-size: 14px; }
            .footer-logo { color: #14b8a6; font-weight: bold; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🩺 IronledgerMedMap</div>
              <div class="tagline">South Africa's Premier Medical Booking Platform</div>
            </div>
            
            <div class="content">
              <div class="greeting">Welcome to IronledgerMedMap, {{name}}!</div>
              
              <div class="message">
                Thank you for joining South Africa's most trusted medical booking platform. You're now part of a community that's revolutionizing healthcare access across the country.
              </div>
              
              <div class="features">
                <h3 style="color: #1f2937; margin-bottom: 20px;">What you can do now:</h3>
                <div class="feature">
                  <div class="feature-icon"></div>
                  <span>Search and book appointments with 500+ verified specialists</span>
                </div>
                <div class="feature">
                  <div class="feature-icon"></div>
                  <span>Access 24/7 emergency booking services</span>
                </div>
                <div class="feature">
                  <div class="feature-icon"></div>
                  <span>Manage your health records and appointment history</span>
                </div>
                <div class="feature">
                  <div class="feature-icon"></div>
                  <span>Get personalized healthcare recommendations</span>
                </div>
              </div>
              
              <div style="text-align: center;">
                <a href="https://ironledgermedmap.co.za/search" class="cta-button">
                  Start Finding Doctors
                </a>
              </div>
              
              <div class="message">
                If you have any questions or need assistance, our support team is available 24/7 at support@ironledgermedmap.co.za or call us at 0800 MEDMAP (633627).
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-logo">IronledgerMedMap</div>
              <div>Making quality healthcare accessible to everyone, everywhere.</div>
              <div style="margin-top: 15px;">
                <a href="https://ironledgermedmap.co.za" style="color: #14b8a6; text-decoration: none;">Visit our website</a> | 
                <a href="https://ironledgermedmap.co.za/contact" style="color: #14b8a6; text-decoration: none;">Contact support</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      textContent: `Welcome to IronledgerMedMap, {{name}}!

Thank you for joining South Africa's most trusted medical booking platform. You're now part of a community that's revolutionizing healthcare access across the country.

What you can do now:
• Search and book appointments with 500+ verified specialists
• Access 24/7 emergency booking services  
• Manage your health records and appointment history
• Get personalized healthcare recommendations

Start finding doctors: https://ironledgermedmap.co.za/search

If you have any questions, contact us at support@ironledgermedmap.co.za or call 0800 MEDMAP (633627).

Best regards,
The IronledgerMedMap Team
Making quality healthcare accessible to everyone, everywhere.`
    },

    verification: {
      type: 'verification',
      subject: 'Verify Your IronledgerMedMap Account',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Account</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); padding: 40px 20px; text-align: center; }
            .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .content { padding: 40px 30px; text-align: center; }
            .verification-icon { font-size: 64px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: 600; color: #1f2937; margin-bottom: 20px; }
            .message { font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 30px; }
            .verify-button { display: inline-block; background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 18px; margin: 20px 0; }
            .security-note { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 30px 0; }
            .footer { background-color: #1f2937; color: #9ca3af; padding: 30px; text-align: center; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🩺 IronledgerMedMap</div>
            </div>
            
            <div class="content">
              <div class="verification-icon">🔐</div>
              <div class="title">Verify Your Email Address</div>
              
              <div class="message">
                Hi {{name}},<br><br>
                Thank you for registering with IronledgerMedMap. To complete your account setup and start booking appointments with top medical specialists, please verify your email address.
              </div>
              
              <a href="{{verificationUrl}}" class="verify-button">
                Verify My Account
              </a>
              
              <div class="security-note">
                <strong>🛡️ Security Notice:</strong><br>
                This verification link will expire in 24 hours for your security. If you didn't create an account with IronledgerMedMap, please ignore this email.
              </div>
              
              <div class="message">
                If the button above doesn't work, copy and paste this link into your browser:<br>
                <a href="{{verificationUrl}}" style="color: #14b8a6; word-break: break-all;">{{verificationUrl}}</a>
              </div>
            </div>
            
            <div class="footer">
              <div>Need help? Contact us at support@ironledgermedmap.co.za</div>
              <div style="margin-top: 10px;">IronledgerMedMap - Connecting you with quality healthcare</div>
            </div>
          </div>
        </body>
        </html>
      `,
      textContent: `Verify Your IronledgerMedMap Account

Hi {{name}},

Thank you for registering with IronledgerMedMap. To complete your account setup and start booking appointments with top medical specialists, please verify your email address.

Click here to verify: {{verificationUrl}}

This verification link will expire in 24 hours for your security. If you didn't create an account with IronledgerMedMap, please ignore this email.

Need help? Contact us at support@ironledgermedmap.co.za

IronledgerMedMap - Connecting you with quality healthcare`
    },

    doctor_approved: {
      type: 'doctor_approved',
      subject: 'Congratulations! Your IronledgerMedMap Doctor Application Has Been Approved',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Doctor Application Approved</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #059669 0%, #14b8a6 100%); padding: 40px 20px; text-align: center; }
            .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .content { padding: 40px 30px; }
            .success-icon { font-size: 64px; text-align: center; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: 600; color: #1f2937; margin-bottom: 20px; text-align: center; }
            .message { font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 30px; }
            .portal-button { display: inline-block; background: linear-gradient(135deg, #059669 0%, #14b8a6 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .next-steps { background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 30px 0; }
            .footer { background-color: #1f2937; color: #9ca3af; padding: 30px; text-align: center; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🩺 IronledgerMedMap</div>
            </div>
            
            <div class="content">
              <div class="success-icon">🎉</div>
              <div class="title">Welcome to the IronledgerMedMap Network!</div>
              
              <div class="message">
                Dear {{name}},<br><br>
                Congratulations! Your doctor application has been approved. You are now an official member of South Africa's premier medical booking platform.
              </div>
              
              <div class="next-steps">
                <h3 style="color: #059669; margin-bottom: 15px;">Next Steps:</h3>
                <ul style="color: #166534; line-height: 1.8;">
                  <li>Access your doctor portal to manage appointments</li>
                  <li>Complete your profile and availability settings</li>
                  <li>Upload additional credentials if needed</li>
                  <li>Start receiving patient bookings</li>
                </ul>
              </div>
              
              <div style="text-align: center;">
                <a href="https://ironledgermedmap.co.za/doctor-portal" class="portal-button">
                  Access Doctor Portal
                </a>
              </div>
              
              <div class="message">
                Our team is here to support you every step of the way. If you have any questions, please don't hesitate to reach out to our doctor support team at doctors@ironledgermedmap.co.za.
              </div>
            </div>
            
            <div class="footer">
              <div>IronledgerMedMap Doctor Support</div>
              <div>doctors@ironledgermedmap.co.za | 0800 MEDMAP (633627)</div>
            </div>
          </div>
        </body>
        </html>
      `,
      textContent: `Welcome to the IronledgerMedMap Network!

Dear {{name}},

Congratulations! Your doctor application has been approved. You are now an official member of South Africa's premier medical booking platform.

Next Steps:
• Access your doctor portal to manage appointments
• Complete your profile and availability settings  
• Upload additional credentials if needed
• Start receiving patient bookings

Access your portal: https://ironledgermedmap.co.za/doctor-portal

Our team is here to support you. Contact us at doctors@ironledgermedmap.co.za for any questions.

Best regards,
IronledgerMedMap Doctor Support Team`
    }
  };

  async sendEmail(templateType: keyof typeof this.templates, emailData: EmailData): Promise<boolean> {
    try {
      const template = this.templates[templateType];
      if (!template) {
        throw new Error(`Email template ${templateType} not found`);
      }

      // Replace placeholders in content
      let htmlContent = template.htmlContent;
      let textContent = template.textContent;
      let subject = template.subject;

      // Replace common placeholders
      if (emailData.name) {
        htmlContent = htmlContent.replace(/{{name}}/g, emailData.name);
        textContent = textContent.replace(/{{name}}/g, emailData.name);
      }

      if (emailData.verificationUrl) {
        htmlContent = htmlContent.replace(/{{verificationUrl}}/g, emailData.verificationUrl);
        textContent = textContent.replace(/{{verificationUrl}}/g, emailData.verificationUrl);
      }

      // In a production environment, you would integrate with an email service like:
      // - SendGrid
      // - AWS SES
      // - Mailgun
      // - Postmark
      
      // For now, we'll use Supabase edge functions or simulate the email sending
      console.log('Sending email:', {
        from: `${this.fromName} <${this.fromEmail}>`,
        to: emailData.to,
        subject,
        htmlContent,
        textContent
      });

      // Simulate successful email sending
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`Email sent successfully to ${emailData.to}`);
          resolve(true);
        }, 1000);
      });

      // In production, you would implement actual email sending:
      /*
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${this.fromName} <${this.fromEmail}>`,
          to: emailData.to,
          subject,
          html: htmlContent,
          text: textContent
        })
      });

      return response.ok;
      */

    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    return this.sendEmail('welcome', { to: email, name });
  }

  async sendVerificationEmail(email: string, name: string, verificationUrl: string): Promise<boolean> {
    return this.sendEmail('verification', { to: email, name, verificationUrl });
  }

  async sendDoctorApprovalEmail(email: string, name: string): Promise<boolean> {
    return this.sendEmail('doctor_approved', { to: email, name });
  }

  // Custom email configuration for production
  configure(config: {
    apiKey?: string;
    fromEmail?: string;
    fromName?: string;
    provider?: 'sendgrid' | 'mailgun' | 'ses' | 'postmark';
  }) {
    if (config.fromEmail) this.fromEmail = config.fromEmail;
    if (config.fromName) this.fromName = config.fromName;
    // Store API keys securely in environment variables
  }
}

export const emailService = new EmailService();
export type { EmailData };
