const { prisma } = require("../config/db");
const {
  SUBSCRIPTION_PLANS,
  URGENT_MATCH_ADDON,
} = require("../utils/constants");
const {
  createSubscriptionSchema,
  subscriptionQuerySchema,
  createRefundRequestSchema,
} = require("../schemas/validation");
const { isZodError, sendValidationError } = require("../utils/http");

exports.createSubscription = async (req, res) => {
  try {
    // Validate authentication
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Validate input using Zod schema
    const validated = createSubscriptionSchema.parse(req.body);
    const { planId, type, purchaseUrgentMatch } = validated;

    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan) {
      return res
        .status(400)
        .json({ error: "Invalid subscription package selected" });
    }

    // Validate subscription type
    const normalizedType = String(type || "SUBSCRIPTION").toUpperCase();
    const isSubscription = normalizedType === "SUBSCRIPTION";

    // Validate price values
    const purchaseUrgent =
      purchaseUrgentMatch === true || purchaseUrgentMatch === "true";
    let finalPrice = isSubscription ? plan.priceSub : plan.priceOneTime;
    if (!Number.isFinite(finalPrice) || finalPrice <= 0) {
      return res.status(500).json({ error: "Invalid pricing configuration" });
    }

    if (purchaseUrgent) {
      finalPrice += URGENT_MATCH_ADDON.price;
      if (!Number.isFinite(finalPrice) || finalPrice <= 0) {
        return res.status(500).json({ error: "Invalid pricing configuration" });
      }
    }

    const startDate = new Date();
    const endDate = new Date(
      Date.now() + plan.durationDays * 24 * 60 * 60 * 1000,
    );

    // CRITICAL: Payment processing must be implemented before subscription creation
    // Currently, subscriptions are created WITHOUT charging users, creating revenue leakage.
    // Required implementation:
    // 1. Integrate payment gateway (Stripe, PayPal, etc.)
    // 2. Process payment BEFORE this transaction
    // 3. Store paymentId/paymentStatus with subscription
    // 4. Handle payment failures and retry logic
    // DO NOT remove this requirement or deployments will leak revenue.
    //
    // Example integration pattern:
    // const paymentResult = await paymentGateway.charge({
    //   userId: req.user.id,
    //   amount: finalPrice,
    //   currency: "USD",
    //   planId: plan.id,
    //   idempotencyKey: `${req.user.id}-${plan.id}-${Date.now()}`,
    // });
    // if (!paymentResult.success) {
    //   return res.status(402).json({
    //     error: "Payment declined",
    //     details: paymentResult.error
    //   });
    // }
    throw new Error(
      "PAYMENT_NOT_IMPLEMENTED - Subscription creation blocked until payment gateway is integrated",
    );

    await prisma.$transaction(async (tx) => {
      // Prevent duplicate submissions within last 10 seconds (any plan)
      const recentSub = await tx.subscription.findFirst({
        where: {
          userId: req.user.id,
          createdAt: { gte: new Date(Date.now() - 10000) },
        },
      });
      if (recentSub) {
        throw new Error("DUPLICATE_REQUEST");
      }

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
    if (isZodError(err)) {
      return sendValidationError(res, err);
    }
    if (err.message?.includes("PAYMENT_NOT_IMPLEMENTED")) {
      return res.status(501).json({
        error:
          "Payment processing is not yet configured. Please contact support.",
      });
    }
    if (err.message === "DUPLICATE_REQUEST") {
      return res.status(409).json({
        error:
          "A subscription request is already pending. Please wait before submitting another.",
      });
    }
    console.error("Subscription creation failed:", err);
    res.status(500).json({
      error: "Unable to process subscription. Please try again.",
    });
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    // Validate authentication
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Validate and sanitize pagination parameters using Zod
    const validated = subscriptionQuerySchema.parse(req.query);
    const { page, limit } = validated;

    const skip = (page - 1) * limit;
    const whereClause = { userId: req.user.id };

    // Fetch subscriptions and total count in parallel
    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.subscription.count({ where: whereClause }),
    ]);

    res.json({ subscriptions, page, limit, total });
  } catch (err) {
    if (isZodError(err)) {
      return sendValidationError(res, err);
    }
    console.error("Subscriptions fetch error:", err);
    res.status(500).json({
      error: "Unable to retrieve subscriptions. Please try again.",
    });
  }
};

exports.createRefundRequest = async (req, res) => {
  try {
    // Validate authentication
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Validate input using Zod schema
    const validated = createRefundRequestSchema.parse(req.body);
    const { subscriptionId, reason } = validated;

    // Fetch subscription and duplicate check in parallel
    const [sub, duplicate] = await Promise.all([
      prisma.subscription.findUnique({
        where: { id: subscriptionId },
      }),
      prisma.refundRequest.findFirst({
        where: { subscriptionId },
      }),
    ]);

    // Validate subscription ownership
    if (!sub || sub.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Validate subscription is active
    if (!sub.isActive) {
      return res.status(400).json({
        error: "Cannot refund inactive subscription",
      });
    }

    // Validate subscription has valid startDate
    if (!sub.startDate || !(sub.startDate instanceof Date)) {
      return res.status(500).json({
        error: "Invalid subscription data. Please contact support.",
      });
    }

    // Enforce 7-day refund window from purchase
    const daysSincePurchase =
      (Date.now() - new Date(sub.startDate).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePurchase > 7) {
      return res.status(400).json({
        error: "Refund window has expired (7 days from purchase date)",
      });
    }

    // Check for duplicate refund request
    if (duplicate) {
      return res.status(400).json({
        error: "Refund claim already filed for this subscription",
      });
    }

    // Create refund request
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
    if (isZodError(err)) {
      return sendValidationError(res, err);
    }
    console.error("Refund request error:", err);
    res.status(500).json({
      error: "Unable to submit refund request. Please try again.",
    });
  }
};
