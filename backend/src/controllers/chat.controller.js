const { prisma } = require("../config/db");

exports.getRooms = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const where =
      req.user.role === "OWNER"
        ? { ownerId: req.user.id }
        : { tenantId: req.user.id };

    const [total, rooms] = await Promise.all([
      prisma.chatRoom.count({ where }),
      prisma.chatRoom.findMany({
        where,
        include: {
          tenant: {
            select: {
              id: true,
              fullName: true,
              currentCountry: true,
              purposeOfRelocation: true,
              visaStatus: true,
              visaType: true,
              plannedMoveDate: true,
              expectedRentalDuration: true,
              isUrgentMatch: true,
            },
          },
          owner: { select: { id: true, fullName: true, isVerified: true } },
          listing: { select: { id: true, title: true, rent: true } },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    res.json({ total, page, limit, rooms });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { roomId, page = 1, limit = 50 } = req.query;
    if (!roomId) return res.status(400).json({ error: "roomId is required" });

    const pageNumber = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 50, 1), 100);
    const skip = (pageNumber - 1) * pageSize;

    const room = await prisma.chatRoom.findUnique({
      where: { id: String(roomId) },
    });
    if (
      !room ||
      (room.tenantId !== req.user.id && room.ownerId !== req.user.id)
    ) {
      return res.status(403).json({ error: "Forbidden access to room" });
    }

    const [total, messages] = await Promise.all([
      prisma.chatMessage.count({ where: { roomId: String(roomId) } }),
      prisma.chatMessage.findMany({
        where: { roomId: String(roomId) },
        include: { sender: { select: { id: true, fullName: true } } },
        orderBy: { createdAt: "asc" },
        skip,
        take: pageSize,
      }),
    ]);

    res.json({ total, page: pageNumber, limit: pageSize, messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { roomId, content } = req.body;
    if (!roomId || !content || !String(content).trim()) {
      return res
        .status(400)
        .json({ error: "Room ID and message content are required" });
    }

    const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
    if (
      !room ||
      (room.tenantId !== req.user.id && room.ownerId !== req.user.id)
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const msg = await prisma.chatMessage.create({
      data: {
        roomId,
        senderId: req.user.id,
        content: String(content).trim(),
      },
      include: {
        sender: { select: { id: true, fullName: true } },
      },
    });

    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.initiateChat = async (req, res) => {
  try {
    const { listingId, firstMessage } = req.body;
    if (!listingId || !firstMessage || !String(firstMessage).trim()) {
      return res
        .status(400)
        .json({ error: "Listing ID and intro message are required" });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { owner: true },
    });
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    if (listing.ownerId === req.user.id) {
      return res
        .status(400)
        .json({ error: "Cannot initiate chat on your own listing" });
    }
    if (listing.status !== "APPROVED") {
      return res
        .status(403)
        .json({ error: "Cannot contact owner for this listing" });
    }

    const activeSub = req.user.subscriptions[0];
    if (!activeSub) {
      return res
        .status(403)
        .json({ error: "Active plan required to contact owner" });
    }

    const updatedSub = await prisma.subscription.updateMany({
      where: {
        id: activeSub.id,
        isActive: true,
        endDate: { gte: new Date() },
        OR: [
          { approachesAllowed: -1 },
          { approachesUsed: { lt: activeSub.approachesAllowed } },
        ],
      },
      data: {
        approachesUsed: { increment: 1 },
      },
    });

    if (updatedSub.count === 0) {
      return res.status(403).json({
        error: "Subscription approaches limit reached. Upgrade required.",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const approach = await tx.approach.create({
        data: {
          tenantId: req.user.id,
          ownerId: listing.ownerId,
          listingId,
        },
      });

      const room = await tx.chatRoom.create({
        data: {
          tenantId: req.user.id,
          ownerId: listing.ownerId,
          listingId,
        },
      });

      await tx.chatMessage.create({
        data: {
          roomId: room.id,
          senderId: req.user.id,
          content: String(firstMessage).trim(),
        },
      });

      return room;
    });

    res.json({
      message: "Connection established successfully!",
      roomId: result.id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
