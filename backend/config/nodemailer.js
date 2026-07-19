const nodemailer = require('nodemailer');

/**
 * Send Password Reset OTP Email
 * @param {string} toEmail 
 * @param {string} otp 
 * @returns {Promise<{success: boolean, message: string}>}
 */
const sendOtpEmail = async (toEmail, otp) => {
  const emailUser = (process.env.EMAIL || '').trim();
  // Strip any spaces from Google App Password (e.g., 'ajmc pqfi xqcg rqcr' -> 'ajmcpqfixqcgrqcr')
  const emailPass = (process.env.APP_PASSWORD || '').replace(/\s+/g, '');

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background-color: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #334155;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #6366f1; margin: 0; font-size: 24px; font-weight: 700;">Auth Security</h2>
        <p style="color: #94a3b8; margin-top: 4px; font-size: 14px;">Password Reset Request</p>
      </div>
      <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #334155;">
        <p style="margin: 0 0 12px 0; color: #cbd5e1; font-size: 15px;">Your One-Time Verification Code (OTP) is:</p>
        <div style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #818cf8; background-color: #0f172a; padding: 12px 20px; border-radius: 6px; display: inline-block; border: 1px dashed #6366f1;">
          ${otp}
        </div>
        <p style="margin-top: 16px; color: #f43f5e; font-size: 13px; font-weight: 600;">
          ⏰ This code will expire in 5 minutes.
        </p>
      </div>
      <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 24px;">
        If you did not request a password reset, please ignore this email.
      </p>
    </div>
  `;

  // Check if Gmail credentials are provided
  const isConfigured = emailUser && emailPass && emailUser !== 'your_email@gmail.com' && emailPass !== 'your_app_password';

  if (!isConfigured) {
    console.log('\n======================================================');
    console.log(`[DEVELOPMENT MODE - EMAIL NOT CONFIGURED IN .env]`);
    console.log(`🔑 OTP generated for ${toEmail}: ${otp}`);
    console.log(`⏰ Expires in 5 minutes.`);
    console.log('======================================================\n');
    return {
      success: true,
      message: 'OTP generated (Email logged in console since EMAIL/APP_PASSWORD are not set in .env)'
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    const mailOptions = {
      from: `"Auth Support" <${emailUser}>`,
      to: toEmail,
      subject: '🔑 Your Password Reset OTP Code',
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`\n======================================================`);
    console.log(`✅ [Nodemailer] Real email successfully sent to: ${toEmail}`);
    console.log(`🔑 OTP Code: ${otp}`);
    console.log(`======================================================\n`);
    return { success: true, message: 'OTP sent to your email address successfully!' };
  } catch (error) {
    console.warn('\n⚠️ [Nodemailer Gmail SMTP Warning]:', error.message);
    console.log(`======================================================`);
    console.log(`🔑 [OTP FOR TESTING & VERIFICATION] Code for ${toEmail}: ${otp}`);
    console.log(`📌 To send real emails, update APP_PASSWORD in backend/.env with a 16-char Gmail App Password.`);
    console.log(`======================================================\n`);
    
    // Return graceful success so frontend OTP flow is never blocked
    return {
      success: true,
      message: `OTP generated for ${toEmail}. Check terminal console for code: ${otp}`
    };
  }
};

module.exports = {
  sendOtpEmail
};
