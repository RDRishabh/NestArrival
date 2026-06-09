"use client";

import { motion } from "framer-motion";

export default function PricingHeader() {
  return (
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
  );
}
