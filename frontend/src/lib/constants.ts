export interface SubscriptionPlan {
  id: string;
  name: string;
  priceOneTime: number;
  priceSub: number;
  durationDays: number;
  approachesLimit: number; // -1 for unlimited
  isFeatured: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "plan-1",
    name: "Starter",
    priceOneTime: 29,
    priceSub: 19,
    durationDays: 14,
    approachesLimit: 5,
    isFeatured: false,
  },
  {
    id: "plan-2",
    name: "Mover",
    priceOneTime: 39,
    priceSub: 29,
    durationDays: 30,
    approachesLimit: 15,
    isFeatured: false,
  },
  {
    id: "plan-featured",
    name: "Priority",
    priceOneTime: 89,
    priceSub: 79,
    durationDays: 60,
    approachesLimit: -1, // Unlimited
    isFeatured: true,
  },
];

export const URGENT_MATCH_ADDON = {
  id: "urgent-match",
  name: "Urgent Housing Match",
  price: 99,
  description: "Your profile gets shown at the top of the list when verified owners log in to browse tenants. This means they see you first and are more likely to connect.",
};

export const DEFAULT_ADMIN_CREDENTIALS = {
  email: "admin@nestarrival.ca",
  password: "NestArrivalAdmin2026!",
  fullName: "NestArrival Administrator",
};

export const APP_CONFIG = {
  otpExpiryMinutes: 15,
  jwtSecret: process.env.JWT_SECRET || "nestarrival-secure-session-key-2026-xyz",
  jwtCookieName: "nestarrival_session",
  refundEligibleIfNoOwnerResponse: true,
};
