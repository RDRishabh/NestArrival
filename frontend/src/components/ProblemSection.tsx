"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

/* ── Animated Counter ────────────────────────────────────────────── */
function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof window !== "undefined" && !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      setCount(start);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

export default function ProblemSection() {
  const painPoints = [
    "Fake listings and online rental scams demanding deposits.", 
    "Ignored messages and unanswered landlord inquiries.", 
    "No responses from landlords",
    "Rejection due to no local credit history",
    "Communication barriers across countries and time zones",
    "Last-minute accommodation panic",
    "Emotional stress of relocation",
    "Expensive and unstable temporary hotel stays on arrival.", 
    "No ability to vet property owners from across borders."
  ];

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-[#f4efe6]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center space-x-1.5 text-[10px] text-[#cfa052] font-extrabold uppercase tracking-widest">
              <ShieldAlert className="h-3.5 w-3.5" /><span>The Global Housing Problem</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c2724] tracking-tight leading-[1.1]">
              Moving Abroad Shouldn&apos;t Start With Housing Stress.
            </h2>
            <p className="text-sm text-[#5c544d] leading-relaxed">
              Relocating is emotionally overwhelming. Traditional rental portals ignore international applicants because they lack local references or credit scores, resulting in:
            </p>
            <ul className="space-y-3 text-xs text-[#2c2724] font-medium">
              {painPoints.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="text-red-500/80 font-bold flex-shrink-0 mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 bg-white border border-[#eae1d3] rounded-3xl p-8 space-y-6 shadow-[0_15px_50px_rgba(44,39,36,0.05)]"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#f4efe6] flex items-center justify-center text-[#cfa052]">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-sm text-[#2c2724]">Why Traditional Sites Ignore You</h3>
            </div>
            <p className="text-[11px] text-[#5c544d] leading-relaxed">
              Traditional rental platforms mainly focus on local renters. They fail to understand: no local references, no local income history, different documentation systems, visa-related uncertainty, cross-border communication barriers.
            </p>
            <div className="border-t border-[#eae1d3] pt-6 grid grid-cols-3 gap-4 text-center items-start">
              <div className="space-y-1">
                <span className="text-[#cfa052] block text-2xl sm:text-3xl font-bold font-serif leading-none">
                  <AnimatedCounter target={90} suffix="%+" />
                </span>
                <span className="uppercase text-[8px] sm:text-[9px] tracking-wider font-extrabold text-[#8a7d6a] block">
                  Scam Reduction
                </span>
              </div>
              <div className="border-l border-[#eae1d3] px-2 space-y-1">
                <span className="text-[#cfa052] block text-2xl sm:text-3xl font-bold font-serif leading-none">
                  <AnimatedCounter target={100} suffix="%" />
                </span>
                <span className="uppercase text-[8px] sm:text-[9px] tracking-wider font-extrabold text-[#8a7d6a] block">
                  Refund Backed
                </span>
              </div>
              <div className="border-l border-[#eae1d3] pl-2 space-y-1">
                <span className="text-[#cfa052] block text-2xl sm:text-3xl font-bold font-serif leading-none">
                  2026
                </span>
                <span className="uppercase text-[8px] sm:text-[9px] tracking-wider font-extrabold text-[#8a7d6a] block">
                  Global Launch
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
