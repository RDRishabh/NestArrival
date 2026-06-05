const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const uploadDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedMimeTypes = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "application/pdf": ".pdf",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeOriginal = path.basename(file.originalname).replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueName = `${req.user ? req.user.id : "anon"}_${Date.now()}_${crypto.randomBytes(8).toString("hex")}_${safeOriginal}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname !== "file") {
      return cb(null, false);
    }

    const mimeAllowed = Object.keys(allowedMimeTypes);
    const extension = path.extname(file.originalname).toLowerCase();
    const extensionAllowed = Object.values(allowedMimeTypes).includes(extension);

    cb(null, mimeAllowed.includes(file.mimetype) && extensionAllowed);
  },
});

module.exports = { upload };
