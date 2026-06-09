"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Users, Compass } from "lucide-react";

export default function CorePillars() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white p-8 rounded-2xl border border-[#eae1d3]/80 text-xs space-y-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <div className="rounded-lg bg-[#eae1d3] border border-[#f4efe6] p-2.5 text-[#cfa052] inline-flex shadow-sm">
          <BadgeCheck className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-[#2c2724]">Vetting First</h3>
        <p className="text-[#8a7d6a] leading-relaxed">
          We verify documents manually before listings appear. We choose absolute tenant safety over transaction volumes.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white p-8 rounded-2xl border border-[#eae1d3]/80 text-xs space-y-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <div className="rounded-lg bg-[#eae1d3] border border-[#f4efe6] p-2.5 text-[#cfa052] inline-flex shadow-sm">
          <Users className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-[#2c2724]">Newcomer Support</h3>
        <p className="text-[#8a7d6a] leading-relaxed">
          Newcomers lack local references or credit records. We showcase their international credentials to build trust with landlords.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white p-8 rounded-2xl border border-[#eae1d3]/80 text-xs space-y-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <div className="rounded-lg bg-[#eae1d3] border border-[#f4efe6] p-2.5 text-[#cfa052] inline-flex shadow-sm">
          <Compass className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-[#2c2724]">Zero Spam Guarantee</h3>
        <p className="text-[#8a7d6a] leading-relaxed">
          We ban deceptive accounts permanently. If listings do not map to verified titles, they are rejected during moderation.
        </p>
      </motion.div>
    </div>
  );
}
