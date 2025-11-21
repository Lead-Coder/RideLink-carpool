const mongoose = require("mongoose");

const docSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  url: String, // e.g. /uploads/drivers/abc.pdf
  uploadedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  role: { type: String, enum: ["rider", "driver", "admin"], default: "rider" },

  phone: { type: String },                // optional but useful
  vehicleNumber: { type: String },        // for drivers

  verificationStatus: {
    type: String,
    enum: ["not_verified", "pending", "verified", "disapproved"],
    default: "not_verified"
  },

  documents: {
    license: docSchema,
    vehiclePaper: docSchema,
    idProof: docSchema
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);