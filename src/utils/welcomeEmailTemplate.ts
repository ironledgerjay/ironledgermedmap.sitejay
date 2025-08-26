export const createWelcomeEmailTemplate = (userName: string, userEmail: string) => {
  const currentYear = new Date().getFullYear();
  
  return {
    subject: "🎉 Welcome to IronledgerMedMap - Your Healthcare Journey Starts Here!",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to IronledgerMedMap</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
          }
          .container {
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
          }
          .content {
            padding: 40px 30px;
          }
          .welcome-message {
            text-align: center;
            margin-bottom: 30px;
          }
          .welcome-message h2 {
            color: #1e293b;
            font-size: 24px;
            margin-bottom: 10px;
          }
          .features {
            margin: 30px 0;
          }
          .feature {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
            padding: 15px;
            border-radius: 8px;
            background-color: #f1f5f9;
          }
          .feature-icon {
            background-color: #3b82f6;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            flex-shrink: 0;
            font-weight: bold;
          }
          .feature-content h3 {
            margin: 0 0 5px 0;
            color: #1e293b;
            font-size: 16px;
          }
          .feature-content p {
            margin: 0;
            color: #64748b;
            font-size: 14px;
          }
          .cta-section {
            text-align: center;
            margin: 40px 0;
            padding: 30px;
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
            border-radius: 8px;
            border: 1px solid #0ea5e9;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 10px;
            transition: transform 0.2s;
          }
          .cta-button:hover {
            transform: translateY(-2px);
          }
          .support-section {
            background-color: #fefce8;
            border: 1px solid #facc15;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
          }
          .support-section h3 {
            color: #a16207;
            margin: 0 0 10px 0;
          }
          .support-section p {
            margin: 0;
            color: #92400e;
          }
          .footer {
            background-color: #1e293b;
            color: #e2e8f0;
            padding: 30px;
            text-align: center;
          }
          .footer p {
            margin: 5px 0;
            font-size: 14px;
          }
          .compliance-badges {
            margin: 20px 0;
          }
          .badge {
            display: inline-block;
            background-color: #059669;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            margin: 0 5px;
            font-weight: 600;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            color: #60a5fa;
            text-decoration: none;
            margin: 0 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🩺 IronledgerMedMap</h1>
            <p>South Africa's Trusted Healthcare Platform</p>
          </div>
          
          <div class="content">
            <div class="welcome-message">
              <h2>Welcome, ${userName}! 🎉</h2>
              <p>We're thrilled to have you join our healthcare community. Your journey to better health starts here!</p>
            </div>
            
            <div class="features">
              <div class="feature">
                <div class="feature-icon">🔍</div>
                <div class="feature-content">
                  <h3>Find Doctors Near You</h3>
                  <p>Search and connect with verified healthcare professionals across all 9 South African provinces.</p>
                </div>
              </div>
              
              <div class="feature">
                <div class="feature-icon">📅</div>
                <div class="feature-content">
                  <h3>Easy Online Booking</h3>
                  <p>Book appointments instantly with real-time availability and automated confirmations.</p>
                </div>
              </div>
              
              <div class="feature">
                <div class="feature-icon">💳</div>
                <div class="feature-content">
                  <h3>Secure Payments</h3>
                  <p>Pay safely with PayFast integration and enjoy transparent pricing with no hidden fees.</p>
                </div>
              </div>
              
              <div class="feature">
                <div class="feature-icon">🔔</div>
                <div class="feature-content">
                  <h3>Smart Notifications</h3>
                  <p>Stay updated with appointment reminders, confirmations, and important health notifications.</p>
                </div>
              </div>
            </div>
            
            <div class="cta-section">
              <h3>Ready to Get Started?</h3>
              <p>Find your perfect healthcare provider today!</p>
              <a href="https://ironledgermedmap.site" class="cta-button">🔍 Find Doctors</a>
              <a href="https://ironledgermedmap.site/book-appointment" class="cta-button">📅 Book Now</a>
            </div>
            
            <div class="support-section">
              <h3>🤝 Need Help?</h3>
              <p>Our support team is available 24/7 to assist you. Contact us at <strong>support@ironledgermedmap.site</strong> or call <strong>+27 11 123 4567</strong>.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <h3>What Our Users Say</h3>
              <blockquote style="font-style: italic; color: #64748b; border-left: 4px solid #3b82f6; padding-left: 20px; margin: 20px 0;">
                "IronledgerMedMap made finding a specialist so easy. I booked my appointment in minutes and the doctor was excellent!"
                <br><strong>- Sarah M., Cape Town</strong>
              </blockquote>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>IronledgerMedMap</strong> - Connecting South Africa to Better Healthcare</p>
            <div class="compliance-badges">
              <span class="badge">POPI Act Compliant</span>
              <span class="badge">HPCSA Verified</span>
              <span class="badge">PayFast Secure</span>
            </div>
            <p>📧 Email: support@ironledgermedmap.site | 📞 Phone: +27 11 123 4567</p>
            <div class="social-links">
              <a href="https://ironledgermedmap.site/privacy-policy">Privacy Policy</a>
              <a href="https://ironledgermedmap.site/terms-of-service">Terms of Service</a>
              <a href="https://ironledgermedmap.site/medical-disclaimers">Medical Disclaimers</a>
            </div>
            <p style="font-size: 12px; margin-top: 20px; opacity: 0.7;">
              © ${currentYear} IronledgerMedMap. All rights reserved.<br>
              This email was sent to ${userEmail}. If you didn't sign up, please ignore this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to IronledgerMedMap, ${userName}!

We're thrilled to have you join our healthcare community. Your journey to better health starts here!

What You Can Do:
• Find Doctors Near You - Search verified healthcare professionals across all 9 South African provinces
• Easy Online Booking - Book appointments instantly with real-time availability 
• Secure Payments - Pay safely with PayFast integration
• Smart Notifications - Stay updated with appointment reminders and confirmations

Ready to Get Started?
Visit: https://ironledgermedmap.site
Book an appointment: https://ironledgermedmap.site/book-appointment

Need Help?
Our support team is available 24/7:
Email: support@ironledgermedmap.site
Phone: +27 11 123 4567

IronledgerMedMap - Connecting South Africa to Better Healthcare
POPI Act Compliant | HPCSA Verified | PayFast Secure

© ${currentYear} IronledgerMedMap. All rights reserved.
This email was sent to ${userEmail}.
    `
  };
};

export const createDoctorWelcomeEmailTemplate = (doctorName: string, doctorEmail: string) => {
  const currentYear = new Date().getFullYear();
  
  return {
    subject: "🩺 Welcome to IronledgerMedMap - Your Medical Practice Portal",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome Dr. ${doctorName}</title>
        <style>
          /* Same styles as above */
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; }
          .container { background-color: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
          .content { padding: 40px 30px; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #059669, #047857); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 10px; }
          .footer { background-color: #1e293b; color: #e2e8f0; padding: 30px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🩺 IronledgerMedMap</h1>
            <p>Doctor Portal - Professional Healthcare Platform</p>
          </div>
          
          <div class="content">
            <h2>Welcome, Dr. ${doctorName}! 🎉</h2>
            <p>Thank you for joining IronledgerMedMap. Your application has been received and is under review.</p>
            
            <h3>Next Steps:</h3>
            <ol>
              <li><strong>Application Review</strong> - Our admin team will verify your credentials</li>
              <li><strong>Approval Notification</strong> - You'll receive an email once approved</li>
              <li><strong>Portal Access</strong> - Access your doctor portal to manage patients and appointments</li>
            </ol>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="https://ironledgermedmap.site/doctor-portal" class="cta-button">🏥 Access Doctor Portal</a>
            </p>
            
            <p><strong>Need Support?</strong><br>
            Email: doctors@ironledgermedmap.site<br>
            Phone: +27 11 123 4567</p>
          </div>
          
          <div class="footer">
            <p>© ${currentYear} IronledgerMedMap. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to IronledgerMedMap, Dr. ${doctorName}!

Your application has been received and is under review.

Next Steps:
1. Application Review - Our admin team will verify your credentials
2. Approval Notification - You'll receive an email once approved  
3. Portal Access - Access your doctor portal to manage patients

Visit: https://ironledgermedmap.site/doctor-portal

Support: doctors@ironledgermedmap.site | +27 11 123 4567

© ${currentYear} IronledgerMedMap. All rights reserved.
    `
  };
};
