// Email templates for user verification and notifications

export const EMAIL_TEMPLATES = {
  verification: {
    subject: "🩺 Welcome to IronledgerMedMap - Verify Your Account",
    html: (verificationUrl: string, userName: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to IronledgerMedMap</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
        .logo { color: white; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .header-text { color: white; font-size: 16px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .welcome-title { font-size: 28px; color: #1e293b; margin-bottom: 16px; text-align: center; }
        .message { color: #64748b; line-height: 1.6; margin-bottom: 30px; text-align: center; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; transition: transform 0.2s; }
        .cta-button:hover { transform: translateY(-2px); }
        .features { background: #f1f5f9; padding: 30px; margin: 30px 0; border-radius: 12px; }
        .feature { display: flex; align-items: center; margin-bottom: 16px; }
        .feature-icon { background: #e0e7ff; color: #6366f1; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; font-size: 18px; }
        .footer { background: #1e293b; color: white; padding: 30px; text-align: center; }
        .footer-links { margin: 20px 0; }
        .footer-link { color: #94a3b8; text-decoration: none; margin: 0 15px; }
        .security-note { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🩺 IronledgerMedMap</div>
            <div class="header-text">Your Gateway to Quality Healthcare</div>
        </div>
        
        <div class="content">
            <h1 class="welcome-title">Welcome to IronledgerMedMap, ${userName}!</h1>
            
            <p class="message">
                Thank you for joining South Africa's premier medical appointment platform. 
                You're just one step away from accessing quality healthcare with our network of verified doctors.
            </p>
            
            <div style="text-align: center;">
                <a href="${verificationUrl}" class="cta-button">
                    ✨ Verify Your Account
                </a>
            </div>
            
            <div class="features">
                <h3 style="color: #1e293b; margin-bottom: 20px;">🌟 What you'll get access to:</h3>
                
                <div class="feature">
                    <div class="feature-icon">👨���⚕️</div>
                    <div>
                        <strong>Verified Doctors</strong><br>
                        <small style="color: #64748b;">Access to qualified medical professionals across South Africa</small>
                    </div>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">📅</div>
                    <div>
                        <strong>Easy Booking</strong><br>
                        <small style="color: #64748b;">Schedule appointments at your convenience with real-time availability</small>
                    </div>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">💳</div>
                    <div>
                        <strong>Secure Payments</strong><br>
                        <small style="color: #64748b;">Safe and secure payment processing with PayFast</small>
                    </div>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">⭐</div>
                    <div>
                        <strong>Premium Membership</strong><br>
                        <small style="color: #64748b;">Get 5 free bookings and save R39 quarterly with premium membership</small>
                    </div>
                </div>
            </div>
            
            <div class="security-note">
                <strong>🔒 Security Notice:</strong> This verification link will expire in 24 hours for your security. 
                If you didn't create this account, please ignore this email.
            </div>
            
            <p style="color: #64748b; text-align: center; margin-top: 30px;">
                Having trouble with the button? Copy and paste this link into your browser:<br>
                <small style="word-break: break-all; color: #6366f1;">${verificationUrl}</small>
            </p>
        </div>
        
        <div class="footer">
            <div style="font-weight: 600; margin-bottom: 10px;">IronledgerMedMap</div>
            <div style="color: #94a3b8; margin-bottom: 20px;">Connecting you to quality healthcare across South Africa</div>
            
            <div class="footer-links">
                <a href="https://ironledgermedmap.site/about" class="footer-link">About Us</a>
                <a href="https://ironledgermedmap.site/contact" class="footer-link">Contact</a>
                <a href="https://ironledgermedmap.site/privacy" class="footer-link">Privacy Policy</a>
            </div>
            
            <div style="color: #64748b; font-size: 12px; margin-top: 20px;">
                © 2024 IronledgerMedMap. All rights reserved.<br>
                This email was sent to ${userName} because you signed up for an account.
            </div>
        </div>
    </div>
</body>
</html>`,
    text: (verificationUrl: string, userName: string) => `
Welcome to IronledgerMedMap, ${userName}!

Thank you for joining South Africa's premier medical appointment platform. You're just one step away from accessing quality healthcare with our network of verified doctors.

Please verify your account by clicking the link below:
${verificationUrl}

What you'll get access to:
👨‍⚕️ Verified Doctors - Access to qualified medical professionals across South Africa
📅 Easy Booking - Schedule appointments at your convenience with real-time availability  
💳 Secure Payments - Safe and secure payment processing with PayFast
⭐ Premium Membership - Get 5 free bookings and save R39 quarterly with premium membership

🔒 Security Notice: This verification link will expire in 24 hours for your security. If you didn't create this account, please ignore this email.

---
IronledgerMedMap
Connecting you to quality healthcare across South Africa
https://ironledgermedmap.site

© 2024 IronledgerMedMap. All rights reserved.
    `
  },

  welcomeBack: {
    subject: "🎉 Welcome Back to IronledgerMedMap!",
    html: (userName: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Verified - Welcome to IronledgerMedMap</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; }
        .success-icon { font-size: 48px; margin-bottom: 20px; }
        .header-text { color: white; font-size: 18px; font-weight: 600; }
        .content { padding: 40px 30px; text-align: center; }
        .title { font-size: 28px; color: #1e293b; margin-bottom: 16px; }
        .message { color: #64748b; line-height: 1.6; margin-bottom: 30px; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
        .footer { background: #1e293b; color: white; padding: 30px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="success-icon">✅</div>
            <div class="header-text">Account Successfully Verified!</div>
        </div>
        
        <div class="content">
            <h1 class="title">You're All Set, ${userName}!</h1>
            
            <p class="message">
                Your IronledgerMedMap account has been successfully verified. 
                You can now book appointments with verified doctors across South Africa.
            </p>
            
            <a href="https://ironledgermedmap.site/login" class="cta-button">
                🚀 Start Booking Appointments
            </a>
            
            <p style="color: #64748b; margin-top: 30px;">
                Ready to experience quality healthcare? Log in to your account and book your first appointment today!
            </p>
        </div>
        
        <div class="footer">
            <div>🩺 IronledgerMedMap</div>
            <div style="color: #94a3b8; margin-top: 10px;">Connecting you to quality healthcare across South Africa</div>
        </div>
    </div>
</body>
</html>`
  }
};
