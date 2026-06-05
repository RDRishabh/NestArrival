const { prisma } = require("../config/db");

exports.getAnalytics = async (req, res) => {
  try {
    const totalTenants = await prisma.user.count({ where: { role: "TENANT" } });
    const totalOwners = await prisma.user.count({ where: { role: "OWNER" } });
    const totalListings = await prisma.listing.count({
      where: { status: { not: "ARCHIVED" } },
    });

    const subs = await prisma.subscription.findMany({
      where: { isActive: true },
    });
    const totalRevenue = subs.reduce((acc, sub) => acc + sub.price, 0);

    res.json({ totalTenants, totalOwners, totalListings, totalRevenue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVerifications = async (req, res) => {
  try {
    const list = await prisma.verificationRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            verificationStatus: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.processVerification = async (req, res) => {
  try {
    const { userId, action, notes } = req.body;
    if (!userId || !action) {
      return res.status(400).json({ error: "User ID and action are required" });
    }

    const status = action === "APPROVE" ? "VERIFIED" : "REJECTED";

    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: status,
        isVerified: action === "APPROVE",
      },
    });

    await prisma.verificationRequest.updateMany({
      where: { userId },
      data: { adminNotes: notes || null },
    });

    res.json({ message: "Verification processed successfully", status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.moderateListing = async (req, res) => {
  try {
    const { listingId, action, feedback } = req.body;
    if (!listingId || !action) {
      return res
        .status(400)
        .json({ error: "Listing ID and action are required" });
    }

    const status = action === "APPROVE" ? "APPROVED" : "REJECTED";

    await prisma.listing.update({
      where: { id: listingId },
      data: { status, adminFeedback: feedback || null },
    });

    res.json({ message: "Listing moderated successfully", status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRefundRequests = async (req, res) => {
  try {
    const requests = await prisma.refundRequest.findMany({
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        subscription: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const enriched = await Promise.all(
      requests.map(async (entry) => {
        const rooms = await prisma.chatRoom.findMany({
          where: { tenantId: entry.userId },
          include: {
            messages: {
              where: { senderId: { not: entry.userId } },
            },
          },
        });

        const ownerRepliesReceived = rooms.reduce(
          (acc, room) => acc + room.messages.length,
          0,
        );

        return {
          ...entry,
          analytics: {
            approachesMade: rooms.length,
            ownerRepliesReceived,
            isEligible: ownerRepliesReceived === 0,
          },
        };
      }),
    );

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.processRefundRequest = async (req, res) => {
  try {
    const { refundRequestId, action, notes } = req.body;
    if (!refundRequestId || !action) {
      return res
        .status(400)
        .json({ error: "Refund request ID and action are required" });
    }

    const status = action === "APPROVE" ? "APPROVED" : "REJECTED";

    const refund = await prisma.refundRequest.update({
      where: { id: refundRequestId },
      data: { status, adminNotes: notes || null },
    });

    if (action === "APPROVE") {
      await prisma.subscription.update({
        where: { id: refund.subscriptionId },
        data: { isActive: false },
      });
    }

    res.json({ message: "Refund moderated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: { in: ["TENANT", "OWNER"] } },
      orderBy: { createdAt: "desc" },
    });

    const tenants = users.filter((u) => u.role === "TENANT");
    const owners = users.filter((u) => u.role === "OWNER");

    res.json({ tenants, owners });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.banUser = async (req, res) => {
  try {
    const { userId, action, reason } = req.body;
    if (!userId || !action) {
      return res.status(400).json({ error: "User ID and Action are required" });
    }

    const isBanned = action === "BAN";
    const banReason = isBanned
      ? reason || "Violation of Community Guidelines"
      : null;

    await prisma.user.update({
      where: { id: userId },
      data: { isBanned, banReason },
    });

    res.json({
      message: `User has been successfully ${isBanned ? "banned" : "unbanned"}.`,
      isBanned,
      banReason,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
