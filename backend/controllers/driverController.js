// backend/controllers/driverController.js
const path = require("path");
const User = require("../models/user");

// uploadDocs: expects authenticated user or email in body (we'll accept email in body for now)
async function uploadDocs(req, res) {
  try {
    // multer stores files in req.files
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // require at least one file uploaded if user chose to upload
    const files = req.files || {};
    // files: { license: [file], vehiclePaper: [file], idProof: [file] }
    const makeDoc = (f) => ({
      filename: f.filename,
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
      url: `/uploads/drivers/${f.filename}`
    });

    if (files.license && files.license[0]) {
      user.documents.license = makeDoc(files.license[0]);
    }
    if (files.vehiclePaper && files.vehiclePaper[0]) {
      user.documents.vehiclePaper = makeDoc(files.vehiclePaper[0]);
    }
    if (files.idProof && files.idProof[0]) {
      user.documents.idProof = makeDoc(files.idProof[0]);
    }

    // If user uploaded ALL three documents → set status to pending
    if (user.documents.license && user.documents.vehiclePaper && user.documents.idProof) {
      user.verificationStatus = "pending";
    } else {
      // if partial upload, keep not_verified (or you can set 'pending' when at least one is uploaded)
      user.verificationStatus = user.verificationStatus === "verified" ? "verified" : "not_verified";
    }

    // save vehicle number from body if provided
    if (req.body.vehicleNumber) user.vehicleNumber = req.body.vehicleNumber;

    await user.save();

    res.json({ message: "Documents uploaded", user });
  } catch (err) {
    console.error("uploadDocs error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
}

// Admin: get all driver requests (filter by status)
async function listDrivers(req, res) {
  try {
    const { status } = req.query; // optional ?status=pending
    const filter = { role: "driver" };
    if (status) filter.verificationStatus = status;
    const drivers = await User.find(filter).sort({ createdAt: -1 }).lean();
    res.json(drivers);
  } catch (err) {
    console.error("listDrivers error:", err);
    res.status(500).json({ message: "Failed to list drivers" });
  }
}

// Admin: approve/disapprove driver
async function reviewDriver(req, res) {
  try {
    const { id } = req.params;
    const { action } = req.body; // "approve" or "disapprove"
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Driver not found" });

    if (action === "approve") user.verificationStatus = "verified";
    else if (action === "disapprove") user.verificationStatus = "disapproved";
    else return res.status(400).json({ message: "Invalid action" });

    await user.save();
    res.json({ message: "Status updated", user });
  } catch (err) {
    console.error("reviewDriver error:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
}

// driver profile (self or admin)
async function driverProfile(req, res) {
  try {
    const { email, id } = req.query;
    let user;
    if (id) user = await User.findById(id).lean();
    else if (email) user = await User.findOne({ email }).lean();
    else return res.status(400).json({ message: "email or id required" });

    if (!user) return res.status(404).json({ message: "Driver not found" });
    res.json(user);
  } catch (err) {
    console.error("driverProfile error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
}

module.exports = {
  uploadDocs,
  listDrivers,
  reviewDriver,
  driverProfile
};