"use client";

import Link from "next/link";
import { Check, Sparkles, HelpCircle } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import { motion } from "framer-motion";
import { useState } from "react";

interface PricingGridProps {
  currency: "CAD" | "USD" | "GBP";
  paymentMode: "ONETIME" | "SUB";
}

export default function PricingGrid({ currency, paymentMode }: PricingGridProps) {
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const getPriceParts = (price: number) => {
    let finalPrice = price;
    if (currency === "USD") {
      finalPrice = Math.round(price * 0.73);
    } else if (currency === "GBP") {
      finalPrice = Math.round(price * 0.58);
    }
    const code = currency;
    const symbol = currency === "GBP" ? "£" : "$";
    return { code, symbol, amount: finalPrice };
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleMouseLeave = () => {
    setTooltipPos(null);
  };

  return (
    <>
      {/* Portal Tooltip — renders outside all card stacking contexts */}
      {tooltipPos && (
        <div
          className="fixed pointer-events-none bg-[#2c2724] text-[#fdfbf7] text-[10px] rounded-lg p-2.5 shadow-2xl leading-relaxed whitespace-normal w-56"
          style={{
            zIndex: 999999,
            left: tooltipPos.x - 20,
            top: tooltipPos.y - 8,
            transform: "translateY(-100%)",
          }}
        >
          Each approach means you can message one verified property owner. If they do not reply within 7 days, that counts as an unanswered approach and is eligible for refund review.
          <div className="absolute top-full left-4 border-4 border-transparent border-t-[#2c2724]" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 text-xs">

        {/* Free Tier Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0 }}
          className="bg-white p-6 rounded-2xl border border-[#eae1d3] shadow-md flex flex-col justify-between hover:border-slate-300 hover:shadow-xl transition-all duration-300"
        >
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2c2724]">Explore Free</h3>
              <span className="text-[8px] bg-slate-100 text-slate-700 font-extrabold uppercase px-2 py-0.5 rounded-md">
                Free Tier
              </span>
            </div>

            <div className="mt-5 mb-6">
              <span className="text-3xl font-extrabold text-[#2c2724] tracking-tight">Free</span>
              <p className="text-[9px] text-[#8a7d6a] mt-1">Explore all vetted homes</p>
            </div>

            <div className="bg-[#fcfbf9] rounded-xl p-4 border border-[#eae1d3]/60 mb-6">
              <p className="text-[11px] text-[#5c544d] leading-relaxed">
                Browse and explore all verified listings for free. Pay only when you are ready to contact an owner.
              </p>
            </div>

            <ul className="space-y-3.5 text-[#5c544d] leading-normal pt-2 border-t border-[#f4efe6]">
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-[#cfa052] flex-shrink-0" />
                <span>Browse all listings</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-[#cfa052] flex-shrink-0" />
                <span>View neighborhood stats</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-[#cfa052] flex-shrink-0" />
                <span>Save favorite homes</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <Link
              href="/signup"
              className="block w-full py-2.5 rounded-lg text-center font-bold transition-all bg-[#f4efe6] text-[#352f2a] hover:bg-[#eae1d3] border border-[#eae1d3]"
            >
              Browse Listings
            </Link>
          </div>
        </motion.div>

        {/* Subscription Plans */}
        {SUBSCRIPTION_PLANS.map((plan, idx) => {
          const oneTimeParts = getPriceParts(plan.priceOneTime);
          const subParts = getPriceParts(plan.priceSub);

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (idx + 1) }}
              className={`bg-white p-6 rounded-2xl flex flex-col justify-between border relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:z-10 ${
                plan.isFeatured
                  ? "border-[#cfa052] bg-[#fdfaf2]/50 shadow-[0_10px_35px_rgba(207,160,82,0.08)]"
                  : "border-[#eae1d3] bg-white hover:border-slate-300 shadow-md"
              }`}
            >
              {plan.isFeatured && (
                <div className="absolute top-0 right-0 bg-[#cfa052] text-white text-[8px] font-extrabold uppercase py-1 px-3.5 rounded-bl-lg rounded-tr-2xl flex items-center space-x-1 shadow-sm z-10">
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>Recommended</span>
                </div>
              )}

              <div>
                <h3 className="text-sm font-bold text-[#2c2724]">{plan.name}</h3>
                <p className="text-[9px] text-[#8a7d6a] mt-0.5">{plan.durationDays} Days Active Access</p>

                <div className="mt-5 mb-6 bg-[#fcfbf9]/60 border border-[#eae1d3]/40 rounded-2xl p-4 flex flex-col justify-center min-h-[90px] relative">
                  {paymentMode === "ONETIME" ? (
                    <>
                      <div className="absolute top-2 right-3 bg-[#cfa052]/10 text-[#cfa052] text-[7px] font-extrabold uppercase px-1.5 py-0.5 rounded-full border border-[#cfa052]/20">
                        One-Time
                      </div>
                      <span className="text-[9px] text-[#8a7d6a] uppercase tracking-wider font-extrabold">One-Time Payment</span>
                      <div className="flex items-baseline gap-1 mt-1 flex-wrap">
                        <span className="text-[10px] text-[#8a7d6a] font-bold self-start mt-1 mr-0.5">{oneTimeParts.code}</span>
                        <span className="text-3xl font-black text-[#2c2724] tracking-tight leading-none">
                          {oneTimeParts.symbol}{oneTimeParts.amount}
                        </span>
                      </div>
                      <span className="text-[8px] text-[#aba296] font-medium mt-1.5 block">(No Subscription / No Renewal)</span>
                    </>
                  ) : (
                    <>
                      <div className="absolute top-2 right-3 bg-[#2c2724]/10 text-[#2c2724] text-[7px] font-extrabold uppercase px-1.5 py-0.5 rounded-full border border-[#2c2724]/20">
                        Subscribe
                      </div>
                      <span className="text-[9px] text-[#8a7d6a] uppercase tracking-wider font-extrabold">Subscribe & Save</span>
                      <div className="flex items-baseline gap-1 mt-1 flex-wrap">
                        <span className="text-[10px] text-[#8a7d6a] font-bold self-start mt-1 mr-0.5">{subParts.code}</span>
                        <span className="text-3xl font-black text-[#2c2724] tracking-tight leading-none">
                          {subParts.symbol}{subParts.amount}
                        </span>
                        <span className="text-[9px] text-[#8a7d6a] font-medium whitespace-nowrap ml-1">
                          / {plan.durationDays} Days
                        </span>
                      </div>
                      <p className="text-[8px] text-[#aba296] mt-1.5 font-medium">(Auto-renews, cancel anytime)</p>
                    </>
                  )}
                </div>

                <ul className="mt-6 space-y-3.5 text-[#5c544d] leading-normal pt-4 border-t border-[#f4efe6]">
                  <li className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-[#cfa052] flex-shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold flex items-center gap-1.5 flex-wrap">
                        {plan.approachesLimit === -1 ? (
                          "Unlimited Owner Contacts"
                        ) : (
                          <>
                            <span>Up to {plan.approachesLimit} owner approaches</span>
                            <span
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                              className="inline-flex cursor-help ml-1"
                            >
                              <HelpCircle className="h-3.5 w-3.5 text-[#aba296] hover:text-[#cfa052] transition-colors" />
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-[#cfa052] flex-shrink-0" />
                    <span>Verified tenant badge active</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-[#cfa052] flex-shrink-0" />
                    <span>Scam Protection Guarantee</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-[#cfa052] flex-shrink-0" />
                    <span>100% Refund audit eligibility</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href="/login"
                  className={`block w-full py-2.5 rounded-lg text-center font-bold transition-all duration-300 ${
                    plan.isFeatured
                      ? "bg-[#cfa052] text-white hover:bg-[#2c2724] shadow-[0_4px_12px_rgba(207,160,82,0.15)] hover:shadow-[0_4px_18px_rgba(207,160,82,0.25)]"
                      : "bg-[#f4efe6] text-[#352f2a] hover:bg-[#eae1d3] border border-[#eae1d3]"
                  }`}
                >
                  {paymentMode === "ONETIME" ? "Get One-Time Option" : "Subscribe Now"}
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}