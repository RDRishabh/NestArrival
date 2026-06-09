"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { URGENT_MATCH_ADDON } from "@/lib/constants";
import { motion } from "framer-motion";

interface ProfileBoosterProps {
  currency: "CAD" | "USD" | "GBP";
}

export default function ProfileBooster({ currency }: ProfileBoosterProps) {
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

  return (
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
  );
}
