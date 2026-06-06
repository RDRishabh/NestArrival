require("dotenv/config");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const multer = require("multer");

const {
  generalLimiter,
  authLimiter,
  publicLimiter,
  adminLimiter,
} = require("./middleware/rateLimiter.middleware");

const authRoutes = require("./routes/auth.routes");
const listingRoutes = require("./routes/listing.routes");
const chatRoutes = require("./routes/chat.routes");
const adminRoutes = require("./routes/admin.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
const verificationRoutes = require("./routes/verification.routes");
const cmsRoutes = require("./routes/cms.routes");

const DEFAULT_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"];
const envOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(new Set([...DEFAULT_ORIGINS, ...envOrigins]));

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
app.disable("x-powered-by");

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use("/uploads", express.static(uploadDir, { dotfiles: "deny" }));
app.use("/api", generalLimiter);
app.use("/api/auth", authLimiter);
app.use("/api/listings", publicLimiter);
app.use("/api/cms", publicLimiter);
app.use("/api/admin", adminLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cms", cmsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }

  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Uploaded file must not exceed 2MB"
        : "File upload failed";
    return res.status(400).json({ error: message });
  }

  if (err.message === "Only JPG, PNG, and PDF files are allowed") {
    return res.status(400).json({ error: err.message });
  }

  console.error("Unhandled request error:", err);
  return res.status(500).json({ error: "Internal server error" });
});

module.exports = { app };
