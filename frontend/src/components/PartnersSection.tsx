"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap, ShieldCheck, Building, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function PartnersSection() {
  const partners = [
    {
      icon: GraduationCap,
      title: "Educational Institutions",
      desc: "Securing student relocations prior to departure by vetting local student units."
    },
    {
      icon: ShieldCheck,
      title: "Immigration Consultants",
      desc: "Vetting documentation chains to provide early relocation housing clearances."
    },
    {
      icon: Building,
      title: "Property Owners",
      desc: "Ensuring land titles map cleanly, providing zero-scam rental opportunities."
    },
    {
      icon: Briefcase,
      title: "Realtors & Housing Providers",
      desc: "Connecting vetted property managers with high-intent international professionals."
    }
  ];

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-[#fdfbf7] border-t border-[#eae1d3]/50">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] text-[#cfa052] font-extrabold uppercase tracking-widest block">Partners & Collaborations</span>
          <h2 className="font-serif text-3xl font-bold text-[#2c2724] tracking-tight">
            Building a Trusted Global Relocation Ecosystem Together.
          </h2>
          <p className="text-xs text-[#8a7d6a] max-w-xl mx-auto leading-relaxed">
            We collaborate with key organizations globally to bridge verification gaps, making housing secure and stress-free for relocators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner, idx) => {
            const Icon = partner.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl border border-[#eae1d3] shadow-sm space-y-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="inline-flex p-3 rounded-xl bg-[#f4efe6] text-[#cfa052]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xs font-black text-[#2c2724]">{partner.title}</h3>
                  <p className="text-[10px] text-[#8a7d6a] leading-relaxed">
                    {partner.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center pt-8">
          <Link href="/partner-with-us" className="text-xs font-bold bg-[#2c2724] hover:bg-[#cfa052] text-white px-8 py-3.5 rounded-full transition-all duration-300 shadow-sm flex items-center gap-2 group hover:scale-105">
            Partner With Us
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
