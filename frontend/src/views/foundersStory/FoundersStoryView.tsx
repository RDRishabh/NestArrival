"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const milestones = [
  {
    year: "2022",
    title: "The Problem Discovered",
    description:
      "Our founder experienced firsthand the chaos of finding housing abroad — scam listings, unverifiable landlords, and thousands of dollars lost. The pain was real and widespread.",
  },
  {
    year: "2023",
    title: "The Idea Takes Shape",
    description:
      "After connecting with hundreds of international students and workers who faced the same struggles, a clear vision emerged: a verification-first housing platform built for newcomers.",
  },
  {
    year: "2024",
    title: "Building With Trust",
    description:
      "NestArrival's core framework was designed around one principle: every person on this platform — tenant or owner — must be verified. No anonymity. No shortcuts.",
  },
  {
    year: "2025",
    title: "Community & Growth",
    description:
      "Thousands of verified matches made. From Toronto to Vancouver, newcomers from 40+ countries found their first Canadian home through NestArrival.",
  },
  {
    year: "2026",
    title: "What's Next",
    description:
      "Expanding to USA, UK, Australia and New Zealand. Building smarter matching, AI-verified documents, and the most trusted relocation ecosystem in the world.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function FoundersStoryView() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] text-[#5c544d] overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(207,160,82,0.06)_0%,transparent_60%)] pointer-events-none" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 border border-[#eae1d3] rounded-full px-5 py-2 text-[11px] font-semibold tracking-wider text-[#A38A70] uppercase mb-8 shadow-sm bg-white"
            >
              <Logo className="h-4 w-4 text-[#cfa052]" />
              Our Origin Story
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold tracking-tight text-[#1A1816] mb-6 leading-tight"
            >
              Built from a{" "}
              <span className="text-[#cfa052]">Personal Struggle</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-[#60564D] max-w-2xl leading-relaxed font-normal"
            >
              NestArrival didn&apos;t start in a boardroom. It started in a foreign country, with a fraudulent landlord, an empty apartment, and the determination to make sure this never happened to anyone else.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Founder Letter */}
      <div className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-[#fdfbf7] border border-[#eae1d3] rounded-3xl p-8 md:p-12 shadow-[0_8px_40px_rgba(45,41,36,0.06)]"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-[#FAF3EA] border border-[#EADFCF] flex items-center justify-center">
                <Logo className="h-6 w-6 text-[#cfa052]" />
              </div>
              <div>
                <p className="font-bold text-[#1A1816] text-sm">A Letter from the Founder</p>
                <p className="text-xs text-[#8a7d6a]">NestArrival Inc.</p>
              </div>
            </div>

            <div className="space-y-5 text-[#5c544d] text-sm leading-relaxed">
              <p>
                When I moved abroad for work, I did everything right. I researched neighborhoods, I budgeted carefully, I communicated with the landlord for weeks. And still — I lost thousands of dollars to a listing that didn&apos;t exist.
              </p>
              <p>
                The landlord disappeared. The apartment was never real. And I was left standing at an address in a city I didn&apos;t know, with a suitcase and no place to sleep.
              </p>
              <p>
                I was not alone. Across forums, Facebook groups, and WhatsApp chats, I found thousands of international students, workers, and families who had experienced the exact same thing. The systems weren&apos;t built for us.
              </p>
              <p>
                So we built one that was.
              </p>
              <p>
                NestArrival exists because verified housing should be a right — not a privilege. Every tenant on our platform is identity-verified. Every owner submits land deeds and government documentation. Our team manually audits every verification request before anything goes live.
              </p>
              <p>
                We&apos;re not just a listings platform. We&apos;re a safety net for the 40+ million people who relocate internationally every year.
              </p>
              <p className="font-semibold text-[#1A1816]">
                This is for them. This is for you.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#eae1d3]">
              <p className="text-[11px] font-bold text-[#A69B8F] tracking-wider uppercase">
                — The NestArrival Founding Team
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Timeline / Milestones */}
      <div className="bg-[#fdfbf7] py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1816] mb-3">Our Journey</h2>
            <p className="text-sm text-[#60564D] max-w-md mx-auto leading-relaxed">
              From a personal crisis to a platform trusted by thousands — here&apos;s how NestArrival was built.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="relative"
          >
            {/* Timeline line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-[#eae1d3] transform md:-translate-x-px" />

            <div className="space-y-10">
              {milestones.map((milestone, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.div
                    key={milestone.year}
                    variants={itemVariants}
                    className={`relative flex items-start gap-6 md:gap-0 ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Mobile / Desktop indicator */}
                    <div className="relative z-10 flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-4 h-12 w-12 flex items-center justify-center">
                      <div className="h-4.5 w-4.5 rounded-full bg-[#cfa052] border-4 border-white shadow-[0_2px_8px_rgba(207,160,82,0.3)]" />
                    </div>

                    {/* Content card */}
                    <div className={`flex-1 md:w-5/12 ml-6 md:ml-0 ${isEven ? "md:pr-14 md:text-right" : "md:pl-14 md:ml-auto"}`}>
                      <div className="bg-white border border-[#eae1d3] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#cfa052] bg-[#FAF3EA] border border-[#EADFCF] rounded-full px-3 py-1 mb-3">
                          {milestone.year}
                        </span>
                        <h3 className="text-sm font-bold text-[#1A1816] mb-2">{milestone.title}</h3>
                        <p className="text-xs text-[#60564D] leading-relaxed">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block md:w-5/12" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1816]">Our Mission</h2>
            <p className="text-base text-[#60564D] max-w-2xl mx-auto leading-relaxed">
              To make international relocation safe, transparent, and human. Every feature we build, every policy we enforce, every verification we run — it all comes back to this single belief:
            </p>
            <blockquote className="text-xl md:text-2xl font-bold text-[#1A1816] italic max-w-xl mx-auto leading-snug">
              &ldquo;No one should lose their savings or sleep on a foreign street because of a fraudulent listing.&rdquo;
            </blockquote>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-[#cfa052] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#2c2724] transition-all shadow-[0_4px_12px_rgba(207,160,82,0.2)] hover:shadow-[0_4px_20px_rgba(207,160,82,0.3)]"
              >
                Learn More About Us
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/partner-with-us"
                className="inline-flex items-center gap-2 border border-[#eae1d3] text-[#5c544d] px-6 py-3 rounded-xl font-bold text-sm hover:border-[#cfa052] hover:text-[#cfa052] transition-all"
              >
                Partner With NestArrival
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
