"use client";

import { motion } from "framer-motion";
import { Compass, CheckCircle2, Building } from "lucide-react";

export default function VisionSection() {
  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-[#f4efe6] wavy-divider-top">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center space-x-1.5 text-[10px] text-[#cfa052] font-extrabold uppercase tracking-widest">
              <Compass className="h-3.5 w-3.5" /><span>The Story Behind Us</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c2724] tracking-tight leading-[1.1]">
              To Make Moving In Globally Hassle-Free.
            </h2>
            <p className="text-sm text-[#5c544d] leading-relaxed">
              NestArrival is pioneering a trust-driven accommodation ecosystem where landlords securely verify their titles, and incoming tenants confirm their legal permits. We bridge the distance with digital vetting, removing communication friction, unanswered inquiries, and listing stress before departure.
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs font-black pt-2">
              {["Fraud Prevention Vetting", "Smart Location Discovery", "Verified User Registry", "Refund-Backed Connection"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-[#2c2724]">
                  <CheckCircle2 className="h-4 w-4 text-[#cfa052] flex-shrink-0" /><span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <div className="p-8 bg-white border border-[#eae1d3] rounded-3xl space-y-6 relative shadow-[0_20px_60px_rgba(44,39,36,0.06)]">
              <div className="bg-[#fdfbf7] rounded-2xl border border-[#eae1d3] p-4 shadow-sm flex items-center justify-between animate-float-delayed">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-[#eae1d3] border border-[#cfa052]/20 rounded-full flex items-center justify-center text-[#2c2724] font-bold text-sm">IN</div>
                  <div>
                    <p className="font-extrabold text-xs text-[#2c2724]">Arjun Sharma (Student Vetted)</p>
                    <p className="text-[10px] text-[#8a7d6a]">Delhi, India → Brampton, Canada</p>
                  </div>
                </div>
                <span className="text-[9px] bg-[#cfa052]/10 text-[#cfa052] font-extrabold border border-[#cfa052]/20 rounded-full px-2 py-0.5 uppercase">Verified</span>
              </div>

              <div className="flex justify-center py-2">
                <div className="w-0.5 h-8 border-r-2 border-dashed border-[#cfa052]/40" />
              </div>

              <div className="bg-[#fdfbf7] rounded-2xl border border-[#eae1d3] p-4 shadow-sm flex items-center justify-between animate-float">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-[#eae1d3] border border-[#cfa052]/20 rounded-full flex items-center justify-center text-[#2c2724]">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs text-[#2c2724]">Ontario Vetted Duplex Complex</p>
                    <p className="text-[10px] text-[#8a7d6a]">Owner Title Vetted & Local Land Checked</p>
                  </div>
                </div>
                <span className="text-[9px] bg-emerald-50 text-emerald-600 font-extrabold border border-emerald-100 rounded-full px-2 py-0.5 uppercase">Verified Owner</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
