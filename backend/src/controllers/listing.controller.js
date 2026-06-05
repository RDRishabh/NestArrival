const { prisma } = require("../config/db");
const jwt = require("jsonwebtoken");
const JWT_COOKIE_NAME = "nestarrival_session";

exports.getListings = async (req, res) => {
  try {
    const {
      scope,
      city,
      minRent,
      maxRent,
      bedrooms,
      bathrooms,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (pageNumber - 1) * pageSize;

    const whereClause = {};

    if (scope === "mine" || scope === "all") {
      const token = req.cookies[JWT_COOKIE_NAME];
      if (!token) {
        return res
          .status(401)
          .json({ error: "Unauthorized. Missing session token." });
      }

      let payload;
      try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res
          .status(401)
          .json({ error: "Invalid or expired session token." });
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });
      if (!user) {
        return res.status(401).json({ error: "Unauthorized. User not found." });
      }
      if (user.isBanned) {
        return res.status(403).json({ error: "Account is banned." });
      }

      if (scope === "mine") {
        whereClause.ownerId = user.id;
      } else {
        if (user.role !== "ADMIN") {
          return res.status(403).json({ error: "Forbidden" });
        }
      }

      whereClause.status = { not: "ARCHIVED" };
    } else {
      whereClause.status = "APPROVED";
      if (city) {
        whereClause.city = { contains: String(city), mode: "insensitive" };
      }
      const minRentValue = Number(minRent);
      if (!Number.isNaN(minRentValue)) {
        whereClause.rent = { ...whereClause.rent, gte: minRentValue };
      }
      const maxRentValue = Number(maxRent);
      if (!Number.isNaN(maxRentValue)) {
        whereClause.rent = { ...whereClause.rent, lte: maxRentValue };
      }
      const bedroomsValue = Number(bedrooms);
      if (!Number.isNaN(bedroomsValue)) {
        whereClause.bedrooms = bedroomsValue;
      }
      const bathroomsValue = Number(bathrooms);
      if (!Number.isNaN(bathroomsValue)) {
        whereClause.bathrooms = bathroomsValue;
      }
    }

    const [total, listings] = await Promise.all([
      prisma.listing.count({ where: whereClause }),
      prisma.listing.findMany({
        where: whereClause,
        include: {
          owner: {
            select: { id: true, fullName: true, email: true, isVerified: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
    ]);

    res.json({ total, page: pageNumber, limit: pageSize, listings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const item = await prisma.listing.findUnique({
      where: { id: req.params.id },
      include: {
        owner: {
          select: { id: true, fullName: true, email: true, isVerified: true },
        },
      },
    });
    if (!item) return res.status(404).json({ error: "Listing not found" });

    if (item.status !== "APPROVED") {
      const token = req.cookies[JWT_COOKIE_NAME];
      if (!token) {
        return res.status(403).json({ error: "Listing not available" });
      }

      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
        });
        if (!user || user.isBanned) {
          return res.status(403).json({ error: "Listing not available" });
        }

        if (item.ownerId !== user.id && user.role !== "ADMIN") {
          return res.status(403).json({ error: "Listing not available" });
        }
      } catch (error) {
        return res.status(403).json({ error: "Listing not available" });
      }
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createListing = async (req, res) => {
  try {
    if (req.user.verificationStatus !== "VERIFIED") {
      return res
        .status(403)
        .json({ error: "Only verified property owners can add listings" });
    }

    const {
      title,
      description,
      rent,
      location,
      city,
      bedrooms,
      bathrooms,
      availabilityDate,
    } = req.body;

    if (
      !title ||
      !description ||
      !rent ||
      !location ||
      !city ||
      !availabilityDate
    ) {
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
        status: "PENDING_REVIEW",
      },
    });

    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const {
      title,
      description,
      rent,
      location,
      city,
      bedrooms,
      bathrooms,
      availabilityDate,
    } = req.body;

    const item = await prisma.listing.findUnique({
      where: { id: req.params.id },
    });
    if (!item || item.ownerId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden. Listing not owned." });
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
        availabilityDate: availabilityDate
          ? new Date(availabilityDate)
          : undefined,
        status: "PENDING_REVIEW",
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.archiveListing = async (req, res) => {
  try {
    const item = await prisma.listing.findUnique({
      where: { id: req.params.id },
    });
    if (!item || item.ownerId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.listing.update({
      where: { id: req.params.id },
      data: { status: "ARCHIVED" },
    });

    res.json({ message: "Listing archived successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSavedListings = async (req, res) => {
  try {
    const list = await prisma.savedListing.findMany({
      where: { userId: req.user.id },
      include: {
        listing: {
          include: {
            owner: { select: { id: true, fullName: true, isVerified: true } },
          },
        },
      },
    });
    res.json(list.map((item) => item.listing));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleSaveListing = async (req, res) => {
  try {
    const { listingId } = req.body;
    if (!listingId) {
      return res.status(400).json({ error: "Listing ID is required" });
    }

    const existing = await prisma.savedListing.findUnique({
      where: { userId_listingId: { userId: req.user.id, listingId } },
    });

    if (existing) {
      await prisma.savedListing.delete({
        where: { userId_listingId: { userId: req.user.id, listingId } },
      });
      return res.json({ message: "Bookmark removed", saved: false });
    }

    await prisma.savedListing.create({
      data: { userId: req.user.id, listingId },
    });
    res.json({ message: "Bookmark saved", saved: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
