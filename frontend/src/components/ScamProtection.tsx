"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Lock } from "lucide-react";

export default function ScamProtection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="lg:col-span-6 space-y-6 text-xs sm:text-sm text-[#5c544d] leading-relaxed"
      >
        <h2 className="text-xl font-bold text-[#2c2724] flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-[#cfa052]" />
          <span>Scam Protection Framework</span>
        </h2>
        <p>
          Traditional housing marketplaces permit anonymous listings. This lack of auditing enables overseas scammers to post fake listings and collect advance rental deposits.
        </p>
        <p>
          NestArrival resolves this. NestArrival connects verified tenants with verified property owners through a trust-first ecosystem focused on transparency, safety, and international accessibility. We act as an identity safety check. Both property owners and tenants must pass document verification before any contact channels can be established.
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#eae1d3] shadow-xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden"
      >
        <div className="flex-1 space-y-4 text-xs text-[#5c544d]">
          <h3 className="font-bold text-[#2c2724] text-sm mb-2 flex items-center gap-2">
            <Lock className="h-4 w-4 text-[#cfa052]" />
            <span>Vetting Procedures</span>
          </h3>
          <div className="space-y-3.5 leading-relaxed">
            <div className="flex flex-col gap-0.5">
              <span className="text-[#cfa052] font-bold text-[11px] uppercase tracking-wide">🏠 Landlords</span>
              <span className="text-[#8a7d6a]">Must upload municipal property tax bills or land registry titles matching government photo IDs.</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[#cfa052] font-bold text-[11px] uppercase tracking-wide">🛂 Tenants</span>
              <span className="text-[#8a7d6a]">Must upload visa permits, passports, and official study/work offers to confirm intentions.</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[#cfa052] font-bold text-[11px] uppercase tracking-wide">🔐 Encryption</span>
              <span className="text-[#8a7d6a]">All identity documents are encrypted and audited manually by verification managers.</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[#cfa052] font-bold text-[11px] uppercase tracking-wide">🛡️ Compliance</span>
              <span className="text-[#8a7d6a]">Verification is carried out by NestArrival&apos;s internal team. All team members are trained in document handling and privacy compliance. Verification typically takes 1–3 business days.</span>
            </div>
          </div>
        </div>
        
        <div className="w-32 h-32 flex items-center justify-center shrink-0 bg-[#fdfbf7] rounded-xl border border-[#f4efe6] p-2 shadow-inner">
          <img 
            src="/images/trust_shield_3d.png" 
            alt="3D Trust Verification Shield" 
            className="h-full w-full object-contain animate-pulse"
            style={{ animationDuration: '3s' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
