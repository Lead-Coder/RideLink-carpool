const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends OTP email with correct content
 */
async function sendOtpEmail(to, subject, otp) {
  const text = `Your OTP is: ${otp}\nThis OTP expires in 10 minutes.`;
  const html = `<p>Your OTP is: <strong>${otp}</strong></p><p>This OTP expires in 10 minutes.</p>`;

  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    text,
    html,
  });

  return info;
}

module.exports = { sendOtpEmail };