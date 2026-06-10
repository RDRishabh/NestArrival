const SUBSCRIPTION_PLANS = [
  {
    id: "plan-1",
    name: "Standard 14-Day",
    priceOneTime: 29,
    priceSub: 19,
    durationDays: 14,
    approachesLimit: 5,
  },
  {
    id: "plan-2",
    name: "Premium 30-Day",
    priceOneTime: 39,
    priceSub: 29,
    durationDays: 30,
    approachesLimit: 15,
  },
  {
    id: "plan-3",
    name: "Professional 45-Day",
    priceOneTime: 69,
    priceSub: 49,
    durationDays: 45,
    approachesLimit: 30,
  },
  {
    id: "plan-featured",
    name: "Featured Elite",
    priceOneTime: 89,
    priceSub: 79,
    durationDays: 60,
    approachesLimit: -1,
  },
];

const URGENT_MATCH_ADDON = { price: 99 };

module.exports = { SUBSCRIPTION_PLANS, URGENT_MATCH_ADDON };
