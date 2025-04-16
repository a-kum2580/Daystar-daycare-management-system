const nodemailer = require('nodemailer');
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = require('../config/env.config');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

/**
 * Send login credentials to a babysitter
 * @param {Object} babysitter - The babysitter object containing email and other details
 * @param {string} password - The generated password
 * @returns {Promise} - Resolves when email is sent
 */
const sendBabysitterCredentials = async (babysitter, password) => {
  const mailOptions = {
    from: EMAIL_FROM,
    to: babysitter.email,
    subject: 'Your Daystar Babysitter Account Credentials',
    html: `
      <h2>Welcome to Daystar!</h2>
      <p>Dear ${babysitter.firstName},</p>
      <p>Your babysitter account has been created successfully. Here are your login credentials:</p>
      <p><strong>Email:</strong> ${babysitter.email}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p>Please login to your account and change your password immediately for security purposes.</p>
      <p>You can access your account at: <a href="${process.env.FRONTEND_URL}/login">Login Page</a></p>
      <br>
      <p>Best regards,</p>
      <p>Daystar Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email with credentials');
  }
};

module.exports = {
  sendBabysitterCredentials,
}; 