const { prisma } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const { sendVerificationOtp } = require("../services/mail.service");
const { createOtp, hashOtp } = require("../utils/otp");
const {
  signupSchema,
  loginSchema,
  verifyOtpSchema,
  googleAuthSchema,
  resendOtpSchema,
} = require("../schemas/validation");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_COOKIE_NAME = "nestarrival_session";
const ALLOWED_SELF_ROLES = ["TENANT", "OWNER"];

function createToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

function isValidRole(role) {
  return ALLOWED_SELF_ROLES.includes(String(role).toUpperCase());
}

function normalizeRole(role) {
  return isValidRole(role) ? String(role).toUpperCase() : "TENANT";
}
function setCookie(res, token) {
  res.cookie(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

exports.signup = async (req, res) => {
  try {
    const { email, password, fullName, role } = signupSchema.parse(req.body);

    const passwordHash = await bcrypt.hash(password, 10);

    const { otp, otpHash, otpExpiry } = createOtp();

    await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        fullName,
        role: normalizeRole(role),

        otp: otpHash,
        otpExpiry,
        otpAttempts: 0,
        otpLastSentAt: new Date(),

        isVerified: false,
        verificationStatus: "UNVERIFIED",
      },
    });

    await sendVerificationOtp(email, otp);

    res.json({
      message: "Signup successful. OTP sent to email.",
      email,
    });
  } catch (err) {
    if (err.name === "ZodError") {
      const errors = err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: "Signup failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    if (user.isBanned) {
      return res.status(403).json({ error: "Account banned" });
    }
    if (user.isVerified) {
      const token = createToken(user);
      setCookie(res, token);

      return res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          isVerified: true,
        },
      });
    }
    if (
      user.otpLastSentAt &&
      Date.now() - new Date(user.otpLastSentAt).getTime() < 60_000
    ) {
      return res.status(429).json({
        error: "Wait before requesting OTP again",
      });
    }
    const { otp, otpHash, otpExpiry } = createOtp();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: otpHash,
        otpExpiry,
        otpAttempts: 0,
        otpLastSentAt: new Date(),
      },
    });
    await sendVerificationOtp(user.email, otp);
    return res.json({
      message: "OTP sent for verification",
      isVerified: false,
      email: user.email,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(400).json({ error: "Invalid credentials" });
  }
};
exports.googleLogin = async (req, res) => {
  try {
    const validated = googleAuthSchema.parse(req.body);
    const { token: credential, role } = validated;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ error: "Invalid Google token" });
    }

    const { email, name, sub: googleId } = payload;

    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId }, { email: email.toLowerCase() }] },
    });

    if (!user) {
      const normalizedRole = role ? normalizeRole(role) : "TENANT";
      if (!isValidRole(normalizedRole)) {
        return res.status(400).json({ error: "Invalid role selection" });
      }

      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          googleId,
          fullName: name,
          role: normalizedRole,
          isVerified: true,
          verificationStatus: "VERIFIED",
        },
      });
    } else {
      if (user.isBanned) {
        return res.status(403).json({ error: "Account is banned" });
      }

      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId, isVerified: true, verificationStatus: "VERIFIED" },
        });
      }
    }

    const token = createToken(user);
    setCookie(res, token);

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
      },
    });
  } catch (err) {
    // Handle Zod validation errors
    if (err.name === "ZodError") {
      const errors = err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }
    console.error("Google login error:", err);
    res.status(500).json({ error: "An error occurred during Google login" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = verifyOtpSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) return res.status(400).json({ error: "User not found" });

    if (user.isBanned) return res.status(403).json({ error: "Account banned" });

    if (!user.otp || !user.otpExpiry)
      return res.status(400).json({ error: "No OTP found" });

    if (new Date() > user.otpExpiry)
      return res.status(400).json({ error: "OTP expired" });

    if (user.otpAttempts >= 5)
      return res.status(429).json({ error: "Too many attempts" });

    const hashedInput = hashOtp(otp);

    const stored = Buffer.from(user.otp);
    const input = Buffer.from(hashedInput);

    if (stored.length !== input.length) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const isValid = crypto.timingSafeEqual(stored, input);

    if (!isValid) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          otpAttempts: user.otpAttempts + 1,
        },
      });

      return res.status(400).json({ error: "Invalid OTP" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otp: null,
        otpExpiry: null,
        otpAttempts: 0,
        verificationStatus: "VERIFIED",
      },
    });

    const token = createToken(user);
    setCookie(res, token);

    res.json({
      message: "Account verified successfully",
    });
  } catch (err) {
    res.status(400).json({ message: "Invalid OTP" });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie(JWT_COOKIE_NAME, { path: "/" });
  res.json({ message: "Logout successful" });
};

exports.me = async (req, res) => {
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
    },
  });
};
