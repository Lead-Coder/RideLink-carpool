// backend/controllers/authController.js
const User = require("../models/User");
const Verification = require("../models/verification");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOtpEmail } = require("../utils/email");
const dotenv = require("dotenv");
dotenv.config();

const OTP_EXPIRE_MINUTES = parseInt(process.env.OTP_EXPIRE_MINUTES || "10");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 1) send OTP
exports.sendOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (!email || !phone) return res.status(400).json({ message: "Email and phone required" });

    // basic phone length check (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }

    // If user already exists, prevent registration through OTP flow (optional)
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({ message: "User with this email or phone already exists" });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000);

    // Upsert verification doc (so re-sending OTP overwrites previous)
    await Verification.findOneAndUpdate(
      { email, phone },
      { otp, expiresAt, verified: false },
      { upsert: true, new: true }
    );

    // Send OTP email
    const subject = "Your RideLink OTP";
    const text = `Your RideLink OTP is ${otp}. It will expire in ${OTP_EXPIRE_MINUTES} minutes.`;
    const html = `<p>Your RideLink OTP is <b>${otp}</b>. It will expire in ${OTP_EXPIRE_MINUTES} minutes.</p>`;

    await sendOtpEmail(email, subject, text, html);

    return res.json({ message: "OTP sent to email" });

  } catch (err) {
    console.error("sendOTP err:", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

// 2) verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    if (!email || !phone || !otp) return res.status(400).json({ message: "Missing fields" });

    const doc = await Verification.findOne({ email, phone });
    if (!doc) return res.status(400).json({ message: "No OTP request found" });

    if (doc.verified) return res.status(400).json({ message: "Already verified" });

    if (doc.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (doc.otp !== otp.toString()) {
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    doc.verified = true;
    await doc.save();

    return res.json({ message: "OTP verified" });

  } catch (err) {
    console.error("verifyOTP err:", err);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }
};

// 3) complete registration (only if OTP verified)
exports.completeRegistration = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) return res.status(400).json({ message: "Missing fields" });

    // Check verification
    const doc = await Verification.findOne({ email, phone });
    if (!doc || !doc.verified) return res.status(400).json({ message: "Phone/email not verified" });

    // Check existence again
    if (await User.findOne({ $or: [{ email }, { phone }] })) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashed });
    await user.save();

    // Optionally delete verification doc
    await Verification.deleteMany({ email, phone });

    return res.json({ message: "Registration successful" });

  } catch (err) {
    console.error("completeRegistration err:", err);
    return res.status(500).json({ message: "Registration failed" });
  }
};

// 4) login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({ message: "Login successful", token, user: { name: user.name, email: user.email, phone: user.phone } });

  } catch (err) {
    console.error("loginUser err:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};