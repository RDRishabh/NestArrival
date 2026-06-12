"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, DollarSign } from "lucide-react";

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function AboutSummarySection() {
  const cards = [
    { 
      icon: ShieldCheck, 
      title: "Vetting-First Ecosystem", 
      desc: "Both tenants and property owners submit legally verified documentations, eradicating fake listings, scams, and fraudulent accounts.", 
      label: "01 / Safety First" 
    },
    { 
      icon: Users, 
      title: "Personalized Matching", 
      desc: "Matches are facilitated based on move-in date alignment, student/worker preferences, budget constraints, and locations.", 
      label: "02 / Smart Match" 
    },
    { 
      icon: DollarSign, 
      title: "Refund Guarantee Assurance", 
      desc: "A refund is available if none of the verified owners you contacted reply to your messages within your active subscription period.", 
      label: "03 / Guaranteed Risk-Free" 
    },
  ];

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-[#fdfbf7]">
      <div className="max-w-6xl mx-auto space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[10px] text-[#cfa052] font-extrabold uppercase tracking-widest">About Us</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c2724] tracking-tight">Redefining Global Accommodation for Modern Relocation</h2>
        </div>

        <motion.div 
          variants={staggerContainer} 
          initial="hidden" 
          whileInView="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {cards.map((card) => (
            <motion.div 
              key={card.title} 
              variants={fadeUpItem}
              className="bg-white p-7 rounded-3xl border border-[#eae1d3] shadow-[0_8px_30px_rgba(44,39,36,0.04)] space-y-4 flex flex-col justify-between h-72 hover-lift group"
            >
              <div className="space-y-3">
                <div className="inline-flex p-3 rounded-2xl bg-[#f4efe6] text-[#cfa052] transition-colors group-hover:bg-[#cfa052] group-hover:text-white">
                  <card.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-black text-[#2c2724]">{card.title}</h3>
                <p className="text-[11px] text-[#5c544d] leading-relaxed">{card.desc}</p>
              </div>
              <span className="text-[9px] text-[#a89e8d] font-extrabold tracking-wider uppercase">{card.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}