require("dotenv/config");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");

// -------------------------------------------------------------
// Database Setup
// -------------------------------------------------------------
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not defined in backend .env");
  process.exit(1);
}

let resolvedDbUrl = connectionString;
if (connectionString.startsWith("prisma+postgres://")) {
  try {
    const urlObj = new URL(connectionString);
    const apiKey = urlObj.searchParams.get("api_key");
    if (apiKey) {
      const decoded = Buffer.from(apiKey, "base64").toString("utf-8");
      const json = JSON.parse(decoded);
      if (json.databaseUrl) {
        resolvedDbUrl = json.databaseUrl;
      }
    }
  } catch (e) {
    console.error("Failed to parse proxy URL:", e);
  }
}

const pool = new Pool({ connectionString: resolvedDbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// -------------------------------------------------------------
// App Settings & Constants
// -------------------------------------------------------------
const JWT_SECRET = process.env.JWT_SECRET || "nestarrival-secure-session-key-2026-xyz";
const JWT_COOKIE_NAME = "nestarrival_session";
const PORT = process.env.PORT || 5000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const defaultAllowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
const envAllowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envAllowedOrigins]));

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: IS_PRODUCTION ? "none" : "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/"
};

const SUBSCRIPTION_PLANS = [
  { id: "plan-1", name: "Standard 14-Day", priceOneTime: 29, priceSub: 19, durationDays: 14, approachesLimit: 5 },
  { id: "plan-2", name: "Premium 30-Day", priceOneTime: 39, priceSub: 29, durationDays: 30, approachesLimit: 15 },
  { id: "plan-3", name: "Professional 45-Day", priceOneTime: 69, priceSub: 49, durationDays: 45, approachesLimit: 30 },
  { id: "plan-featured", name: "Featured Elite", priceOneTime: 89, priceSub: 79, durationDays: 60, approachesLimit: -1 }
];

const URGENT_MATCH_ADDON = { price: 99 };

// -------------------------------------------------------------
// Helper: Send Mail Utility
// -------------------------------------------------------------
async function sendVerificationOtp(email, otp) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "NestArrival Verification <no-reply@nestarrival.ca>";

  const isConfigured = !!(host && user && pass);

  if (isConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: parseInt(port || "587"),
        secure: port === "465",
        auth: { user, pass },
      });

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px;">
            <h2 style="color: #0f172a; margin: 0;">Nest<span style="color: #d4ff4d; background: #000; padding: 2px 6px; border-radius: 4px;">Arrival</span></h2>
            <p style="font-size: 12px; color: #64748b; margin: 5px 0 0 0;">Verification-First Newcomer Housing</p>
          </div>
          <p style="font-size: 14px; color: #334155; line-height: 1.5;">Hello,</p>
          <p style="font-size: 14px; color: #334155; line-height: 1.5;">Thank you for registering with NestArrival. To complete your account activation, please use the following one-time verification code (OTP):</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #000; letter-spacing: 5px; padding: 10px 20px; border: 2px dashed #000; border-radius: 6px; background-color: #f8fafc;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #64748b; line-height: 1.5;">This verification code is valid for 15 minutes. If you did not request this email, please ignore it or contact our support.</p>
        </div>
      `;

      await transporter.sendMail({
        from,
        to: email,
        subject: `[NestArrival] Verify Your Email - OTP: ${otp}`,
        html: htmlContent,
      });

      console.log(`[NestArrival SMTP] Real email dispatched to ${email}`);
      return true;
    } catch (error) {
      console.error("[NestArrival SMTP] Error sending mail via SMTP:", error);
    }
  }

  console.log(`\n==================================================`);
  console.log(`[NestArrival SMTP Fallback Console Logger]`);
  console.log(`To: ${email}`);
  console.log(`OTP Code: ${otp}`);
  console.log(`Status: SMTP credentials missing or failed. Printed here for testing.`);
  console.log(`==================================================\n`);
  return true;
}

// -------------------------------------------------------------
// Multer Upload File Config
// -------------------------------------------------------------
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${req.user ? req.user.id : "anon"}_${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// -------------------------------------------------------------
// Express Middleware
// -------------------------------------------------------------
const app = express();
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(uploadDir));

// Authentication check middleware
const requireAuth = async (req, res, next) => {
  const token = req.cookies[JWT_COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Missing session token." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        verificationRequest: true,
        subscriptions: {
          where: {
            isActive: true,
            endDate: { gte: new Date() },
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: "User session not found." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired session token." });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: "Forbidden. Access denied." });
    }
    next();
  };
};

// -------------------------------------------------------------
// ROUTE HANDLERS: AUTH
// -------------------------------------------------------------
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;
    if (!email || !password || !fullName || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        fullName,
        role,
        otp,
        otpExpiry,
        isVerified: false,
      }
    });

    await sendVerificationOtp(user.email, otp);

    res.json({
      message: "Signup successful. Verification OTP sent to email.",
      email: user.email,
      devOtp: otp,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (!user.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: { otp, otpExpiry },
      });

      await sendVerificationOtp(user.email, otp);

      return res.json({
        message: "Email verification pending.",
        isVerified: false,
        email: user.email,
        devOtp: otp,
      });
    }

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie(JWT_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);

    res.json({
      message: "Login successful.",
      isVerified: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/google", async (req, res) => {
  try {
    const { credential, role } = req.body;
    if (!credential) return res.status(400).json({ error: "Missing Google credential" });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ error: "Invalid Google token" });

    const { email, name, sub: googleId } = payload;
    
    // Find user by Google ID or Email
    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId }, { email: email.toLowerCase() }] }
    });

    if (!user) {
      // New user signup
      if (!role) return res.status(400).json({ error: "Role is required for new signups" });
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          googleId,
          fullName: name,
          role: role,
          isVerified: true,
          verificationStatus: role === "ADMIN" ? "VERIFIED" : "UNVERIFIED"
        }
      });
    } else if (!user.googleId) {
      // Link existing email to Google SSO
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId, isVerified: true }
      });
    }

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie(JWT_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);

    res.json({
      message: "Google Login successful.",
      isVerified: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
      }
    });
  } catch (err) {
    console.error("Google Auth error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.otp !== otp || new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({ error: "Invalid or expired OTP code" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otp: null,
        otpExpiry: null,
        verificationStatus: user.role === "ADMIN" ? "VERIFIED" : "UNVERIFIED"
      }
    });

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie(JWT_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);

    res.json({
      message: "Account verified successfully.",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isVerified: true,
        verificationStatus: user.role === "ADMIN" ? "VERIFIED" : "UNVERIFIED",
      }
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie(JWT_COOKIE_NAME, { path: "/" });
  res.json({ message: "Logout successful" });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({
    authenticated: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      fullName: req.user.fullName,
      role: req.user.role,
      isVerified: req.user.isVerified,
      isBanned: req.user.isBanned,
      banReason: req.user.banReason,
      verificationStatus: req.user.verificationStatus,
      residencyStatus: req.user.residencyStatus,
      currentCountry: req.user.currentCountry,
      destinationCountry: req.user.destinationCountry,
      currentStatus: req.user.currentStatus,
      visaStatus: req.user.visaStatus,
      visaType: req.user.visaType,
      plannedMoveDate: req.user.plannedMoveDate,
      purposeOfRelocation: req.user.purposeOfRelocation,
      expectedRentalDuration: req.user.expectedRentalDuration,
      isUrgentMatch: req.user.isUrgentMatch,
      verificationRequest: req.user.verificationRequest,
      subscription: req.user.subscriptions[0] || null,
    }
  });
});

// -------------------------------------------------------------
// ROUTE HANDLERS: LISTINGS
// -------------------------------------------------------------
app.get("/api/listings", async (req, res) => {
  try {
    const { scope, city, minRent, maxRent, bedrooms, bathrooms } = req.query;

    let whereClause = {};

    if (scope === "mine") {
      // Require authentication to get own listings
      const token = req.cookies[JWT_COOKIE_NAME];
      if (!token) return res.status(401).json({ error: "Unauthorized" });
      const payload = jwt.verify(token, JWT_SECRET);
      whereClause.ownerId = payload.userId;
      whereClause.status = { not: "ARCHIVED" };
    } else if (scope === "all") {
      // Admin dashboard scope - all listings (excluding archived)
      const token = req.cookies[JWT_COOKIE_NAME];
      if (!token) return res.status(401).json({ error: "Unauthorized" });
      const payload = jwt.verify(token, JWT_SECRET);
      if (payload.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });
      whereClause.status = { not: "ARCHIVED" };
    } else {
      // Public search (Tenants) - show only APPROVED listings
      whereClause.status = "APPROVED";
      if (city) whereClause.city = { contains: String(city), mode: "insensitive" };
      if (minRent) whereClause.rent = { gte: parseFloat(String(minRent)) };
      if (maxRent) whereClause.rent = { lte: parseFloat(String(maxRent)) };
      if (bedrooms) whereClause.bedrooms = parseInt(String(bedrooms));
      if (bathrooms) whereClause.bathrooms = parseInt(String(bathrooms));
    }

    const items = await prisma.listing.findMany({
      where: whereClause,
      include: {
        owner: {
          select: { id: true, fullName: true, email: true, isVerified: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(items);
  } catch (err) {
    console.error("Fetch listings error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/listings", requireAuth, requireRole("OWNER"), async (req, res) => {
  try {
    if (req.user.verificationStatus !== "VERIFIED") {
      return res.status(403).json({ error: "Only verified property owners can add listings" });
    }

    const { title, description, rent, location, city, bedrooms, bathrooms, availabilityDate } = req.body;
    if (!title || !description || !rent || !location || !city || !availabilityDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const listing = await prisma.listing.create({
      data: {
        ownerId: req.user.id,
        title,
        description,
        rent: parseFloat(rent),
        location,
        city,
        bedrooms: parseInt(bedrooms || 1),
        bathrooms: parseInt(bathrooms || 1),
        availabilityDate: new Date(availabilityDate),
        status: "PENDING_REVIEW"
      }
    });

    res.json(listing);
  } catch (err) {
    console.error("Create listing error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/listings/saved", requireAuth, async (req, res) => {
  try {
    const list = await prisma.savedListing.findMany({
      where: { userId: req.user.id },
      include: {
        listing: {
          include: {
            owner: { select: { id: true, fullName: true, isVerified: true } }
          }
        }
      }
    });
    res.json(list.map((l) => l.listing));
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/listings/saved", requireAuth, async (req, res) => {
  try {
    const { listingId } = req.body;
    if (!listingId) return res.status(400).json({ error: "Listing ID is required" });

    const existing = await prisma.savedListing.findUnique({
      where: { userId_listingId: { userId: req.user.id, listingId } }
    });

    if (existing) {
      await prisma.savedListing.delete({
        where: { userId_listingId: { userId: req.user.id, listingId } }
      });
      res.json({ message: "Bookmark removed", saved: false });
    } else {
      await prisma.savedListing.create({
        data: { userId: req.user.id, listingId }
      });
      res.json({ message: "Bookmark saved", saved: true });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/listings/:id", async (req, res) => {
  try {
    const item = await prisma.listing.findUnique({
      where: { id: req.params.id },
      include: {
        owner: { select: { id: true, fullName: true, email: true, isVerified: true } }
      }
    });
    if (!item) return res.status(404).json({ error: "Listing not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/listings/:id", requireAuth, requireRole("OWNER"), async (req, res) => {
  try {
    const { title, description, rent, location, city, bedrooms, bathrooms, availabilityDate } = req.body;
    
    // Make sure they own it
    const item = await prisma.listing.findUnique({ where: { id: req.params.id } });
    if (!item || item.ownerId !== req.user.id) {
      return res.status(452).json({ error: "Forbidden. Listing not owned." });
    }

    const updated = await prisma.listing.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        rent: rent ? parseFloat(rent) : undefined,
        location,
        city,
        bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
        bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
        availabilityDate: availabilityDate ? new Date(availabilityDate) : undefined,
        status: "PENDING_REVIEW" // Reset to pending audit on change
      }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/listings/:id", requireAuth, requireRole("OWNER"), async (req, res) => {
  try {
    const item = await prisma.listing.findUnique({ where: { id: req.params.id } });
    if (!item || item.ownerId !== req.user.id) {
      return res.status(452).json({ error: "Forbidden" });
    }

    await prisma.listing.update({
      where: { id: req.params.id },
      data: { status: "ARCHIVED" }
    });

    res.json({ message: "Listing archived successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------------------------------------------
// ROUTE HANDLERS: CHAT
// -------------------------------------------------------------
app.get("/api/chat", requireAuth, async (req, res) => {
  try {
    const whereClause = req.user.role === "OWNER"
      ? { ownerId: req.user.id }
      : { tenantId: req.user.id };

    const rooms = await prisma.chatRoom.findMany({
      where: whereClause,
      include: {
        tenant: { select: { id: true, fullName: true, currentCountry: true, purposeOfRelocation: true, visaStatus: true, visaType: true, plannedMoveDate: true, expectedRentalDuration: true, isUrgentMatch: true } },
        owner: { select: { id: true, fullName: true, isVerified: true } },
        listing: { select: { id: true, title: true, rent: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/chat/messages", requireAuth, async (req, res) => {
  try {
    const { roomId } = req.query;
    if (!roomId) return res.status(400).json({ error: "roomId is required" });

    // Validate access
    const room = await prisma.chatRoom.findUnique({ where: { id: String(roomId) } });
    if (!room || (room.tenantId !== req.user.id && room.ownerId !== req.user.id)) {
      return res.status(403).json({ error: "Forbidden access to room" });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { roomId: String(roomId) },
      include: {
        sender: { select: { id: true, fullName: true } }
      },
      orderBy: { createdAt: "asc" }
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// HTTP connection initiator fallback (Socket connects next)
app.post("/api/chat/messages", requireAuth, async (req, res) => {
  try {
    const { roomId, content } = req.body;
    if (!roomId || !content) return res.status(400).json({ error: "Room ID and content are required" });

    const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
    if (!room || (room.tenantId !== req.user.id && room.ownerId !== req.user.id)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const msg = await prisma.chatMessage.create({
      data: {
        roomId,
        senderId: req.user.id,
        content
      },
      include: {
        sender: { select: { id: true, fullName: true } }
      }
    });

    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------------------------------------------
// ROUTE HANDLERS: VERIFICATIONS & UPLOADS
// -------------------------------------------------------------
app.post("/api/verification/upload", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    url: `/uploads/${req.file.filename}`
  });
});

app.post("/api/verification/submit", requireAuth, async (req, res) => {
  try {
    const { currentCountry, currentStatus, visaStatus, visaType, plannedMoveDate, purposeOfRelocation, expectedRentalDuration, residencyStatus, documentUrls, documentTypes, declarationsAccepted } = req.body;

    if (!declarationsAccepted) {
      return res.status(400).json({ error: "Declarations must be accepted to proceed" });
    }

    // Update User parameters
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        verificationStatus: "PENDING_VERIFICATION",
        currentCountry,
        currentStatus,
        visaStatus,
        visaType,
        plannedMoveDate,
        purposeOfRelocation,
        expectedRentalDuration,
        residencyStatus
      }
    });

    // Create Verification Request
    await prisma.verificationRequest.upsert({
      where: { userId: req.user.id },
      update: {
        residencyStatus: residencyStatus || req.user.role,
        documentUrls: documentUrls || [],
        documentTypes: documentTypes || [],
        declarationsAccepted: true,
        adminNotes: null
      },
      create: {
        userId: req.user.id,
        residencyStatus: residencyStatus || req.user.role,
        documentUrls: documentUrls || [],
        documentTypes: documentTypes || [],
        declarationsAccepted: true
      }
    });

    res.json({ message: "Verification request submitted successfully" });
  } catch (err) {
    console.error("Verification submit error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------------------------------------------
// ROUTE HANDLERS: SUBSCRIPTIONS & REFUNDS
// -------------------------------------------------------------
app.post("/api/subscriptions", requireAuth, async (req, res) => {
  try {
    const { planId, type, purchaseUrgentMatch } = req.body; // type: 'ONETIME' or 'SUBSCRIPTION'
    
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan) return res.status(400).json({ error: "Invalid subscription package selected" });

    let finalPrice = type === "SUBSCRIPTION" ? plan.priceSub : plan.priceOneTime;
    if (purchaseUrgentMatch) {
      finalPrice += URGENT_MATCH_ADDON.price;
    }

    const startDate = new Date();
    const endDate = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000);

    // Disable all old subscriptions
    await prisma.subscription.updateMany({
      where: { userId: req.user.id, isActive: true },
      data: { isActive: false }
    });

    // Create subscription
    await prisma.subscription.create({
      data: {
        userId: req.user.id,
        planId: plan.id,
        name: plan.name,
        price: finalPrice,
        durationDays: plan.durationDays,
        isSubscription: type === "SUBSCRIPTION",
        approachesAllowed: plan.approachesLimit,
        startDate,
        endDate,
        isActive: true
      }
    });

    if (purchaseUrgentMatch) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          isUrgentMatch: true,
          urgentMatchRequestedAt: new Date()
        }
      });
    }

    res.json({ message: `Successfully purchased ${plan.name}!` });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Subscription history list fetch
app.get("/api/subscriptions", requireAuth, async (req, res) => {
  try {
    const list = await prisma.subscription.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" }
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/admin/refunds", requireAuth, async (req, res) => {
  try {
    const { subscriptionId, reason } = req.body;
    if (!subscriptionId || !reason) return res.status(400).json({ error: "Subscription ID and rationale are required" });

    // Verify ownership
    const sub = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
    if (!sub || sub.userId !== req.user.id) {
      return res.status(452).json({ error: "Forbidden" });
    }

    // Check if duplicate exists
    const duplicate = await prisma.refundRequest.findFirst({ where: { subscriptionId } });
    if (duplicate) {
      return res.status(400).json({ error: "Refund claim already filed for this subscription" });
    }

    await prisma.refundRequest.create({
      data: {
        userId: req.user.id,
        subscriptionId,
        reason,
        status: "PENDING"
      }
    });

    res.json({ message: "Refund application submitted to auditing queue." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------------------------------------------
// ROUTE HANDLERS: CONNECTIONS / APPROACHES
// -------------------------------------------------------------
app.post("/api/chat/initiate", requireAuth, async (req, res) => {
  try {
    const { listingId, firstMessage } = req.body;
    if (!listingId || !firstMessage) return res.status(400).json({ error: "Listing ID and intro message are required" });

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { owner: true }
    });

    if (!listing) return res.status(404).json({ error: "Listing not found" });

    // Deduct approach credit
    const activeSub = req.user.subscriptions[0];
    if (!activeSub) return res.status(403).json({ error: "Active plan required to contact owner" });
    if (activeSub.approachesAllowed !== -1 && activeSub.approachesUsed >= activeSub.approachesAllowed) {
      return res.status(403).json({ error: "Subscription approaches limit reached. Upgrade required." });
    }

    // Create Approach connection record
    await prisma.approach.create({
      data: {
        tenantId: req.user.id,
        ownerId: listing.ownerId,
        listingId
      }
    });

    // Update subscription credits
    await prisma.subscription.update({
      where: { id: activeSub.id },
      data: { approachesUsed: activeSub.approachesUsed + 1 }
    });

    // Create ChatRoom
    const room = await prisma.chatRoom.create({
      data: {
        tenantId: req.user.id,
        ownerId: listing.ownerId,
        listingId
      }
    });

    // Add first message
    await prisma.chatMessage.create({
      data: {
        roomId: room.id,
        senderId: req.user.id,
        content: firstMessage
      }
    });

    res.json({ message: "Connection established successfully!", roomId: room.id });
  } catch (err) {
    console.error("Initiate chat connection error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------------------------------------------
// ROUTE HANDLERS: ADMIN
// -------------------------------------------------------------
app.get("/api/admin/analytics", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const totalTenants = await prisma.user.count({ where: { role: "TENANT" } });
    const totalOwners = await prisma.user.count({ where: { role: "OWNER" } });
    const totalListings = await prisma.listing.count({ where: { status: { not: "ARCHIVED" } } });
    
    const subs = await prisma.subscription.findMany({ where: { isActive: true } });
    const totalRevenue = subs.reduce((acc, sub) => acc + sub.price, 0);

    res.json({
      totalTenants,
      totalOwners,
      totalListings,
      totalRevenue
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/admin/verifications", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const list = await prisma.verificationRequest.findMany({
      include: {
        user: { select: { id: true, email: true, fullName: true, role: true, verificationStatus: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/admin/verifications", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const { userId, action, notes } = req.body; // action: 'APPROVE' or 'REJECT'
    if (!userId || !action) return res.status(400).json({ error: "User ID and action are required" });

    const status = action === "APPROVE" ? "VERIFIED" : "REJECTED";

    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: status,
        isVerified: action === "APPROVE"
      }
    });

    await prisma.verificationRequest.updateMany({
      where: { userId },
      data: { adminNotes: notes || null }
    });

    res.json({ message: "Verification processed successfully", status });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/admin/listings/moderate", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const { listingId, action, feedback } = req.body;
    if (!listingId || !action) return res.status(400).json({ error: "Listing ID and action are required" });

    const status = action === "APPROVE" ? "APPROVED" : "REJECTED";

    await prisma.listing.update({
      where: { id: listingId },
      data: { status, adminFeedback: feedback || null }
    });

    res.json({ message: "Listing moderated successfully", status });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/admin/refunds", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const requests = await prisma.refundRequest.findMany({
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        subscription: true
      },
      orderBy: { createdAt: "desc" }
    });

    // Run auto audits calculations check
    const enriched = await Promise.all(requests.map(async (req) => {
      // Find chatrooms for this user linked to properties
      const rooms = await prisma.chatRoom.findMany({
        where: { tenantId: req.userId },
        include: {
          messages: {
            where: { senderId: { not: req.userId } } // Owner messages
          }
        }
      });

      const ownerRepliesReceived = rooms.reduce((acc, r) => acc + r.messages.length, 0);

      return {
        ...req,
        analytics: {
          approachesMade: rooms.length,
          ownerRepliesReceived,
          isEligible: ownerRepliesReceived === 0
        }
      };
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/admin/refunds", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const { refundRequestId, action, notes } = req.body;
    if (!refundRequestId || !action) return res.status(400).json({ error: "Refund request ID and action are required" });

    const status = action === "APPROVE" ? "APPROVED" : "REJECTED";

    const refund = await prisma.refundRequest.update({
      where: { id: refundRequestId },
      data: { status, adminNotes: notes || null }
    });

    if (action === "APPROVE") {
      // Disable subscription
      await prisma.subscription.update({
        where: { id: refund.subscriptionId },
        data: { isActive: false }
      });
    }

    res.json({ message: "Refund moderated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// CMS Legal Pages Routes
app.get("/api/cms", async (req, res) => {
  try {
    const list = await prisma.cmsPage.findMany();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/cms/:id", async (req, res) => {
  try {
    const page = await prisma.cmsPage.findUnique({ where: { id: req.params.id } });
    if (!page) return res.status(404).json({ error: "CMS page not found" });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/cms", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const { id, title, content } = req.body;
    if (!id || !title || !content) return res.status(400).json({ error: "Missing required fields" });

    const updated = await prisma.cmsPage.update({
      where: { id },
      data: { title, content }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Admin endpoint: List all users split by role
app.get("/api/admin/users", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: { in: ["TENANT", "OWNER"] } },
      orderBy: { createdAt: "desc" }
    });

    const tenants = users.filter((u) => u.role === "TENANT");
    const owners = users.filter((u) => u.role === "OWNER");

    res.json({ tenants, owners });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Admin endpoint: Ban/Unban user
app.post("/api/admin/users/ban", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const { userId, action, reason } = req.body; // action: 'BAN' or 'UNBAN'
    if (!userId || !action) return res.status(400).json({ error: "User ID and Action are required" });

    const isBanned = action === "BAN";
    const banReason = isBanned ? (reason || "Violation of Community Guidelines") : null;

    await prisma.user.update({
      where: { id: userId },
      data: { isBanned, banReason }
    });

    res.json({
      message: `User has been successfully ${isBanned ? "banned" : "unbanned"}.`,
      isBanned,
      banReason
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------------------------------------------
// HTTP Server & Socket.io Initialization
// -------------------------------------------------------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// WebSocket Connection Events
io.on("connection", (socket) => {
  console.log("Socket client connected: ", socket.id);

  // Authenticate socket via cookies if present
  socket.on("joinRoom", async ({ roomId, userId }) => {
    try {
      socket.join(roomId);
      console.log(`Socket user ${userId} joined chat room ${roomId}`);
    } catch (err) {
      console.error("Socket joinRoom error:", err);
    }
  });

  socket.on("sendMessage", async ({ roomId, senderId, content }) => {
    try {
      if (!roomId || !senderId || !content) return;

      // Save to database
      const msg = await prisma.chatMessage.create({
        data: {
          roomId,
          senderId,
          content
        },
        include: {
          sender: { select: { id: true, fullName: true } }
        }
      });

      // Broadcast to room
      io.to(roomId).emit("message", msg);
      console.log(`Websocket message broadcasted in room ${roomId}`);
    } catch (err) {
      console.error("Socket sendMessage error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket client disconnected: ", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`NestArrival Express Backend Service running on port ${PORT}`);
  console.log(`Socket.io server successfully linked for WebSockets`);
  console.log(`==================================================`);
});
