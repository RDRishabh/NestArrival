"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Check, Sparkles, HelpCircle, AlertCircle, Coins } from "lucide-react";
import { SUBSCRIPTION_PLANS, URGENT_MATCH_ADDON } from "@/lib/constants";
import { motion } from "framer-motion";

export default function PricingPage() {
  const [currency, setCurrency] = useState<"CAD" | "USD" | "GBP">("CAD");
  const [paymentMode, setPaymentMode] = useState<"ONETIME" | "SUB">("ONETIME");

  // Helper for pricing conversions
  const getPriceDisplay = (price: number) => {
    const symbol = currency === "CAD" ? "CAD $" : currency === "USD" ? "USD $" : "£";
    
    let finalPrice = price;
    if (currency === "USD") {
      finalPrice = Math.round(price * 0.73);
    } else if (currency === "GBP") {
      finalPrice = Math.round(price * 0.58);
    }
    
    return `${symbol}${finalPrice}`;
  };

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

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] text-[#5c544d]">
      <Navbar />
      
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(207,160,82,0.03)_0%,transparent_50%)] pointer-events-none z-0 h-[500px]" />

      <main className="flex-grow mx-auto max-w-7xl w-full px-4 py-20 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[10px] text-[#cfa052] font-extrabold uppercase tracking-widest bg-[#eae1d3] px-3 py-1.5 rounded-full border border-[#eae1d3]/50 inline-block shadow-sm"
          >
            Pricing Packages
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-[#2c2724] sm:text-6xl font-serif italic leading-[1.1]"
          >
            Clear, Vetted Packages
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-xs sm:text-sm text-[#8a7d6a] max-w-xl mx-auto leading-relaxed"
          >
            Choose a plan to contact property owners directly. If owners fail to reply during your active period, you are fully protected by our 100% refund policy.
          </motion.p>
        </div>

        {/* Switchers */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16">
          {/* Currency Switcher */}
          <div className="bg-[#eae1d3]/30 p-1.5 rounded-2xl border border-[#eae1d3] flex items-center gap-1 shadow-sm">
            {[
              { id: "CAD", label: "CAD ($)" },
              { id: "USD", label: "USD ($)" },
              { id: "GBP", label: "GBP (£)" },
            ].map((curr) => (
              <button
                key={curr.id}
                onClick={() => setCurrency(curr.id as any)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all duration-300 ${
                  currency === curr.id
                    ? "bg-[#cfa052] text-white shadow-sm"
                    : "text-[#8a7d6a] hover:text-[#2c2724]"
                }`}
              >
                {curr.label}
              </button>
            ))}
          </div>

          {/* Payment Mode Selector */}
          <div className="bg-[#eae1d3]/30 p-1.5 rounded-2xl border border-[#eae1d3] flex items-center gap-1 shadow-sm">
            {[
              { id: "ONETIME", label: "One-Time Payment", badge: "Best Value" },
              { id: "SUB", label: "Subscribe & Save", badge: "Save 30%" },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setPaymentMode(mode.id as any)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all duration-300 relative ${
                  paymentMode === mode.id
                    ? "bg-[#cfa052] text-white shadow-sm"
                    : "text-[#8a7d6a] hover:text-[#2c2724]"
                }`}
              >
                <span>{mode.label}</span>
                {mode.badge && (
                  <span className={`absolute -top-2.5 -right-2 text-[7px] font-extrabold uppercase px-1.5 py-0.5 rounded-full border shadow-sm transition-all duration-300 ${
                    paymentMode === mode.id
                      ? "bg-[#2c2724] text-white border-[#2c2724]"
                      : "bg-[#eae1d3] text-[#cfa052] border-[#eae1d3]"
                  }`}>
                    {mode.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-20 text-xs">
          
          {/* Free Tier Card (First) */}
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
                className={`bg-white p-6 rounded-2xl flex flex-col justify-between border relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
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
                  
                  {/* Single Clean Price Block */}
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

                  {/* Plan Features */}
                  <ul className="mt-6 space-y-3.5 text-[#5c544d] leading-normal pt-4 border-t border-[#f4efe6]">
                    <li className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-[#cfa052] flex-shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-bold flex items-center gap-1.5">
                          {plan.approachesLimit === -1 ? (
                            "Unlimited Owner Contacts"
                          ) : (
                            <>
                              <span>Up to {plan.approachesLimit} owner approaches</span>
                              <div className="group relative inline-block cursor-help ml-1">
                                <HelpCircle className="h-3.5 w-3.5 text-[#aba296] hover:text-[#cfa052] transition-colors" />
                                {/* Premium Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 bg-[#2c2724] text-[#fdfbf7] text-[10px] rounded-lg p-2.5 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none leading-relaxed font-normal normal-case">
                                  Each approach means you can message one verified property owner. If they do not reply within 7 days, that counts as an unanswered approach and is eligible for refund review.
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#2c2724]" />
                                </div>
                              </div>
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

        {/* Premium Upgrade Match panel */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl border border-[#eae1d3] p-8 flex flex-col md:flex-row items-center justify-between gap-8 mb-20 shadow-lg relative overflow-hidden"
        >
          <div className="space-y-2 md:max-w-2xl text-xs">
            <div className="inline-flex items-center space-x-1.5 bg-[#eae1d3] border border-[#eae1d3]/80 text-[#cfa052] text-[9px] font-bold uppercase rounded-full px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Premium Profile Booster</span>
            </div>
            <h2 className="text-xl font-bold text-[#2c2724]">{URGENT_MATCH_ADDON.name}</h2>
            <p className="text-[#8a7d6a] leading-relaxed text-[11px]">
              Your profile gets shown at the top of the list when verified owners log in to browse tenants. This means they see you first and are more likely to connect.
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-center md:text-right shrink-0">
            <div className="w-20 h-20 flex items-center justify-center shrink-0 bg-[#fdfbf7] rounded-xl border border-[#f4efe6] p-1.5 shadow-inner">
              <img 
                src="/images/canada_relocation_3d.png" 
                alt="3D Canadian Relocation Key Booster" 
                className="h-full w-full object-contain animate-bounce"
                style={{ animationDuration: '4s' }}
              />
            </div>
            <div className="text-xs">
              <span className="text-2xl font-extrabold text-[#2c2724]">{getPriceDisplay(URGENT_MATCH_ADDON.price)}</span>
              <p className="text-[10px] text-[#8a7d6a] mt-1 mb-4">One-time profile booster fee</p>
              <Link
                href="/signup"
                className="inline-flex rounded-lg bg-[#cfa052] text-white font-bold px-6 py-2.5 hover:bg-[#2c2724] transition-colors shadow-md"
              >
                Add to Profile
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Refund disclosure */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center max-w-2xl mx-auto border-t border-[#eae1d3] pt-12 text-xs"
        >
          <div className="inline-flex items-center justify-center rounded-full bg-[#eae1d3] border border-[#f4efe6] p-2.5 text-[#cfa052] mb-4 shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-[#2c2724] text-base">Automatic Refund Protection</h3>
          <p className="text-[#8a7d6a] mt-2 leading-relaxed">
            A refund is available if none of the verified owners you contacted reply to your messages within your active subscription period. A valid response means the verified owner replies to your message through the NestArrival chat within your active plan period. An automated reply or an out-of-office message does not count as a response. We review your message history and process it within 3 business days.
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
