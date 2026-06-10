"use client";

import Link from "next/link";

export default function EarlyAccessSection() {
  return (
    <section className="relative py-32 px-4 bg-[#cfa052] text-white text-center overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('/images/toronto_loft.png')] bg-cover bg-center mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2c2724]/90 to-transparent" />
      
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <span className="text-[10px] text-white font-extrabold uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full inline-block border border-white/20">
          Early Access Waitlist
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
          Schedule Your Relocation Today.
        </h2>
        <p className="text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
          Get priority access to vetted rentals, automated relocation matches, and early-stage immigration support. Experience relocation built on trust.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center text-xs font-bold pt-4">
          <Link href="/signup" className="w-full sm:w-auto rounded-2xl bg-white text-[#2c2724] px-10 py-4 hover:bg-[#fdfbf7] transition-all duration-300 shadow-xl font-extrabold hover:scale-105">
            Find My Future Home
          </Link>
          <Link href="/signup?early_access=true" className="w-full sm:w-auto rounded-2xl bg-transparent text-white border border-white/30 px-10 py-4 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            Join Early Access
          </Link>
        </div>
      </div>
    </section>
  );
}
