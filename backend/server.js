require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Booking = require('./models/booking');
const DriverVerification = require('./models/verification');

const app = express();
app.use(cors());
app.use(express.json());

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("DB connection error:", err));

// simple POST endpoint for saving booking
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const saved = await booking.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Failed to save booking" });
  }
});

// POST /api/verify-driver
app.post('/api/verify-driver', async (req, res) => {
  try {
    const newRequest = new DriverVerification(req.body);
    const saved = await newRequest.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Verification save error:", err);
    res.status(500).json({ message: "Failed to save driver verification data" });
  }
});

// get all pending drivers
app.get('/api/verify-driver', async (req, res) => {
  try {
    const drivers = await DriverVerification.find().sort({ submittedAt: -1 });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch verification requests' });
  }
});

app.delete('/api/verify-driver/:id', async (req, res) => {
  try {
    await DriverVerification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Driver verification removed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete verification request' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
