const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  rideId: String,
  rideInfo: {
    driver: String,
    driverID: String,
    vehicle: String,
    vehicleID: String,
    fare: Number,
  },
  pickupLocation: String,
  dropLocation: String,
  dateTime: String,
  seatCount: Number,
  status: String,
  userId: String,
  amount: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
