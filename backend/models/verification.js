const mongoose = require('mongoose');

const DriverVerificationSchema = new mongoose.Schema({
  driverName: String,
  driverEmail: String,
  driverPhone: String,
  licenseNumber: String,
  vehicleNumber: String,
  vehicleModel: String,
  licenseFileName: String,
  vehicleDocFileName: String,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DriverVerification', DriverVerificationSchema);
