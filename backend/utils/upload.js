// backend/utils/upload.js
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const uploadsRoot = path.join(__dirname, "..", "public", "uploads", "drivers");

// ensure folder exists
if (!fs.existsSync(uploadsRoot)) {
  fs.mkdirSync(uploadsRoot, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsRoot);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${uuidv4()}${ext}`;
    cb(null, name);
  }
});

function fileFilter(req, file, cb) {
  // allow images and pdfs
  const allowed = /jpeg|jpg|png|pdf/;
  const ext = file.mimetype;
  if (allowed.test(ext)) cb(null, true);
  else cb(null, false, new Error("Only images and pdfs allowed"));
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

module.exports = upload;