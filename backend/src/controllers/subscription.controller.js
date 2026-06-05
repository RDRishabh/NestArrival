const { prisma } = require("../config/db");
const {
  SUBSCRIPTION_PLANS,
  URGENT_MATCH_ADDON,
} = require("../utils/constants");

exports.createSubscription = async (req, res) => {
  try {
    const { planId, type, purchaseUrgentMatch } = req.body;
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan) {
      return res
        .status(400)
        .json({ error: "Invalid subscription package selected" });
    }

    const normalizedType = String(type || "SUBSCRIPTION").toUpperCase();
    const isSubscription = normalizedType === "SUBSCRIPTION";
    if (!["SUBSCRIPTION", "ONE_TIME"].includes(normalizedType)) {
      return res.status(400).json({ error: "Invalid subscription type" });
    }

    const purchaseUrgent =
      purchaseUrgentMatch === true || purchaseUrgentMatch === "true";
    let finalPrice = isSubscription ? plan.priceSub : plan.priceOneTime;
    if (purchaseUrgent) {
      finalPrice += URGENT_MATCH_ADDON.price;
    }

    const startDate = new Date();
    const endDate = new Date(
      Date.now() + plan.durationDays * 24 * 60 * 60 * 1000,
    );

    await prisma.$transaction(async (tx) => {
      await tx.subscription.updateMany({
        where: { userId: req.user.id, isActive: true },
        data: { isActive: false },
      });

      await tx.subscription.create({
        data: {
          userId: req.user.id,
          planId: plan.id,
          name: plan.name,
          price: finalPrice,
          durationDays: plan.durationDays,
          isSubscription,
          approachesAllowed: plan.approachesLimit,
          startDate,
          endDate,
          isActive: true,
        },
      });

      if (purchaseUrgent) {
        await tx.user.update({
          where: { id: req.user.id },
          data: { isUrgentMatch: true, urgentMatchRequestedAt: new Date() },
        });
      }
    });

    res.json({ message: `Successfully purchased ${plan.name}!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    const list = await prisma.subscription.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRefundRequest = async (req, res) => {
  try {
    const { subscriptionId, reason } = req.body;
    if (!subscriptionId || !reason) {
      return res
        .status(400)
        .json({ error: "Subscription ID and rationale are required" });
    }

    const sub = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });
    if (!sub || sub.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const duplicate = await prisma.refundRequest.findFirst({
      where: { subscriptionId },
    });
    if (duplicate) {
      return res
        .status(400)
        .json({ error: "Refund claim already filed for this subscription" });
    }

    await prisma.refundRequest.create({
      data: {
        userId: req.user.id,
        subscriptionId,
        reason,
        status: "PENDING",
      },
    });

    res.json({ message: "Refund application submitted to auditing queue." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
