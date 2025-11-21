require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/user");
const Verification = require("./models/verification");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const upload = require("./utils/upload");
const driverController = require("./controllers/driverController");
const { sendOtpEmail } = require("./utils/email");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// --------------------------------------------------
// ⭐ DB CONNECT
// --------------------------------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB error:", err));


// --------------------------------------------------
// ⭐ SEND OTP — Registration
// --------------------------------------------------
app.post("/api/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Verification.findOneAndUpdate(
      { email },
      { otp, verified: false, expiresAt: Date.now() + 10 * 60 * 1000 },
      { upsert: true }
    );

    await sendOtpEmail(email, "Your OTP", `Your OTP is ${otp}`);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "OTP sending failed" });
  }
});


// --------------------------------------------------
// ⭐ VERIFY OTP — Registration
// --------------------------------------------------
app.post("/api/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const rec = await Verification.findOne({ email });

    if (!rec) return res.status(400).json({ message: "OTP not found" });
    if (rec.expiresAt < Date.now()) return res.status(400).json({ message: "OTP expired" });
    if (rec.otp !== otp) return res.status(400).json({ message: "Incorrect OTP" });

    rec.verified = true;
    await rec.save();

    res.json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed" });
  }
});


// --------------------------------------------------
// ⭐ REGISTER
// --------------------------------------------------
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role, phone, vehicleNumber } = req.body;

    const verify = await Verification.findOne({ email });
    if (!verify || !verify.verified)
      return res.status(400).json({ message: "Email not verified" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone: phone || "",
      password: hashed,
      role,
      vehicleNumber: vehicleNumber || "",
      verificationStatus: role === "driver" ? "not_verified" : "verified",
    });

    await newUser.save();
    await Verification.deleteOne({ email });

    res.json({ message: "Registration successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Registration failed" });
  }
});


// --------------------------------------------------
// ⭐ LOGIN (with hardcoded admin)
// --------------------------------------------------
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // HARD CODED ADMIN LOGIN
    if (
      email === "madhukar.admin_ridelink@gmail.com" &&
      password === "admin@123#"
    ) {
      return res.json({
        message: "Admin login successful",
        token: jwt.sign({ id: "admin123", role: "admin" }, process.env.JWT_SECRET),
        user: {
          id: "admin123",
          name: "Admin",
          email,
          role: "admin",
        },
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      token: jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET),
      user,
    });

  } catch (err) {
    console.log("LOGIN ERR", err);
    res.status(500).json({ message: "Server error" });
  }
});


// --------------------------------------------------
// ⭐ FORGOT PASSWORD — Send OTP
// --------------------------------------------------
app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const usr = await User.findOne({ email });
    if (!usr) return res.status(400).json({ message: "Email not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);

    await Verification.findOneAndUpdate(
      { email },
      { otp, verified: false },
      { upsert: true }
    );

    await sendOtpEmail(email, "Password Reset OTP", `Your OTP is ${otp}`);

    res.json({ message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ message: "Error sending OTP" });
  }
});


// --------------------------------------------------
// ⭐ RESET PASSWORD — Verify OTP
// --------------------------------------------------
app.post("/api/reset-verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const rec = await Verification.findOne({ email });
    if (!rec || rec.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    rec.verified = true;
    await rec.save();

    res.json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed" });
  }
});


// --------------------------------------------------
// ⭐ RESET PASSWORD — Apply new password
// --------------------------------------------------
app.post("/api/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const rec = await Verification.findOne({ email, verified: true });
    if (!rec) return res.status(400).json({ message: "OTP not verified" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashed });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Reset error" });
  }
});


// --------------------------------------------------
// ⭐ DRIVER: Upload Documents
// --------------------------------------------------
app.post(
  "/api/driver/upload-docs",
  upload.fields([
    { name: "license", maxCount: 1 },
    { name: "vehiclePaper", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
  ]),
  driverController.uploadDocs
);

// ⭐ DRIVER: Get Profile
app.get("/api/driver/profile", driverController.driverProfile);

// ⭐ ADMIN: List drivers (pending/verified etc.)
app.get("/api/admin/drivers", driverController.listDrivers);

// ⭐ ADMIN: Review driver
app.post("/api/admin/drivers/:id/review", driverController.reviewDriver);


// --------------------------------------------------
app.listen(process.env.PORT, () =>
  console.log("Server running on PORT", process.env.PORT)
);