const jwt = require("jsonwebtoken");
const { prisma } = require("../config/db");

const requireAuth = async (req, res, next) => {
  const token = req.cookies.nestarrival_session;

  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized. Missing session token." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        verificationRequest: true,
        subscriptions: {
          where: { isActive: true, endDate: { gte: new Date() } },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User session not found." });
    }

    if (user.isBanned) {
      return res.status(403).json({ error: "Account is banned." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired session token." });
  }
};

module.exports = { requireAuth };
