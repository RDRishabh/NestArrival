"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";



export default function FoundersMessageSection() {
  return (
    <section className="py-14 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, margin: "-80px" }}
        className="rounded-[24px] border border-[#eadcc6] bg-[#fdfaf4] px-5 py-6 sm:px-8 sm:py-8 shadow-[0_12px_40px_rgba(44,39,36,0.04)]"
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-[#e1c79b] flex items-center gap-2">
            <svg width="34" height="24" viewBox="0 8 24 28" fill="currentColor" aria-hidden="true">
              <path d="M9.4 3.1c-.4 0-.7.3-.7.7v5.1C6.1 9 4.6 10.6 4.6 13c0 2.5 1.5 4.2 3.9 4.2 2.1 0 3.4-1.4 3.4-3.3 0-1.7-1.1-3-2.8-3.3V3.8c0-.4-.3-.7-.7-.7Zm9 0c-.4 0-.7.3-.7.7v5.1c-2.6.1-4.1 1.7-4.1 4.1 0 2.5 1.5 4.2 3.9 4.2 2.1 0 3.4-1.4 3.4-3.3 0-1.7-1.1-3-2.8-3.3V3.8c0-.4-.3-.7-.7-.7Z" />
            </svg>
            <span className="font-bold translate-x-[-1rem] text-[#e5b76d] text-sm sm:text-base">FOUNDER STORY</span>
          </div>

          <div className="space-y-5 text-[14px] sm:text-[15px] leading-8 italic text-[#7d7364]">
            <p>
              When I first moved abroad, I thought finding a place to live would be one of the easiest parts of the journey.
            </p>
            <p>
              I was wrong.
            </p>
            <p>
              Like many newcomers, I spent countless hours scrolling through listings, sending messages that never received a reply, and trying to figure out which options were real and which were scams. Being thousands of miles from my destination made everything feel uncertain. Every unanswered message added more stress. Every fake listing made me question who I could trust.
            </p>
            <p>
              Over the next several years, I moved between cities, provinces, and even countries. With every move, I met people going through the exact same experience - international students arriving with suitcases full of dreams, workers starting new careers, families building a new future. All of them facing the same challenge: finding a safe, reliable place to call home.
            </p>
            <p>
              That’s when I realized this wasn’t just my story. It was the story of millions of people relocating around the world.
            </p>
            <p>
              NestArrival was born from that realization.
            </p>
            <p>
              We didn’t create NestArrival simply to help people find accommodation. We created it to give newcomers peace of mind during one of the most important transitions of their lives. No one should feel alone, ignored, or vulnerable when starting a new chapter in a new country.
            </p>
            <p>
              Because no matter how far you roam, everyone deserves a safe place to call home.
            </p>
          </div>

          <div className="mt-10 border-t border-[#eadcc6] pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-full bg-[#eadfce] border border-[#eadcc6] shadow-sm shrink-0">
                <Image
                  src="/images/canada_relocation_3d.png"
                  alt="Royal Singh portrait"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-[#2c2724] text-lg leading-none">Royal Singh</p>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#9b8c76] mt-1">
                  Founder &amp; CEO, NestArrival
                </p>
              </div>
            </div>

            <Link
              href="https://www.linkedin.com/in/royal-singh/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start sm:self-center text-[12px] text-[#8d7f6b] hover:text-[#2c2724] transition-colors"
            >
              <span>Connect on LinkedIn</span>
              <span className="h-9 w-9 rounded-full border border-[#eadcc6] bg-white inline-flex items-center justify-center">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 0H5a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V5a5 5 0 0 0-5-5zM8 19H5V8h3v11zM6.5 6.73a1.77 1.77 0 1 1 0-3.54 1.77 1.77 0 0 1 0 3.54zM20 19h-3v-5.6c0-3.37-4-3.12-4 0V19h-3V8h3v1.77C14.4 7.46 20 7.3 20 12.7V19z" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
