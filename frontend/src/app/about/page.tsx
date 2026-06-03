"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Users, Compass, ShieldAlert, BadgeCheck, Lock, Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    q: "What is NestArrival?",
    a: "NestArrival is a global relocation and accommodation platform that helps verified international tenants connect with verified property owners before moving to a new city or country.",
    list: [
      "International students",
      "Workers moving abroad",
      "New immigrants",
      "Temporary residents",
      "Families relocating internationally"
    ]
  },
  {
    q: "Who can use NestArrival?",
    a: "NestArrival is built for anyone relocating internationally or moving between cities and provinces.",
    list: [
      "Students",
      "Skilled workers",
      "Permanent residents",
      "Temporary foreign workers",
      "International professionals",
      "Relocating families"
    ]
  },
  {
    q: "Is searching for accommodation free?",
    a: "Yes. Users can browse and search accommodation opportunities on the platform for free. NestArrival only charges a platform fee when helping connect verified tenants with verified property owners."
  },
  {
    q: "How does the verification process work?",
    a: "NestArrival focuses on creating a safer and more trusted ecosystem by verifying both tenants and property owners.",
    list: [
      "Government-issued identification",
      "Property ownership checks",
      "Visa or relocation documentation",
      "Contact verification",
      "Listing authenticity reviews"
    ],
    footer: "The goal is to reduce scams and unsafe interactions."
  },
  {
    q: "Why is NestArrival different from traditional rental platforms?",
    a: "Most rental platforms are designed primarily for local renters. NestArrival is built specifically around the needs of immigrants and international tenants.",
    list: [
      "Cross-border relocation",
      "Verified connections",
      "Personalized matching",
      "International accessibility",
      "Safer housing experiences",
      "Refund-backed confidence"
    ]
  },
  {
    q: "What countries does NestArrival support?",
    a: "NestArrival is initially focused on helping Indian tenants relocate to Canada.",
    list: [
      "United States",
      "United Kingdom",
      "Australia",
      "New Zealand"
    ],
    footer: "The long-term vision is to build a globally connected relocation ecosystem."
  },
  {
    q: "What happens if property owners do not respond?",
    a: "NestArrival operates with a trust-first approach. A refund is available if none of the verified owners you contacted reply to your messages within your active subscription period. A valid response means the verified owner replies to your message through the NestArrival chat within your active plan period. An automated reply or an out-of-office message does not count as a response."
  },
  {
    q: "Can I search for housing before arriving in the country?",
    a: "Yes. NestArrival is specifically designed to help users search for and explore accommodation opportunities before arriving in their destination country. This helps reduce relocation stress and uncertainty."
  },
  {
    q: "Does NestArrival only support students?",
    a: "No. NestArrival supports:",
    list: [
      "International students",
      "Workers",
      "Skilled professionals",
      "Families",
      "Permanent residents",
      "Temporary residents",
      "Individuals relocating between cities and countries"
    ]
  },
  {
    q: "How does NestArrival improve safety?",
    a: "The platform focuses heavily on:",
    list: [
      "Verification systems",
      "Trusted connections",
      "Reducing fake listings",
      "Safer communication experiences",
      "Transparent onboarding",
      "Human-centered support"
    ],
    footer: "The goal is to create more confidence for both tenants and property owners."
  },
  {
    q: "Can property owners join NestArrival?",
    a: "Yes. Verified property owners and housing providers can join the platform to connect with trusted international tenants searching for accommodation."
  },
  {
    q: "What type of accommodation can I find?",
    a: "Users may explore:",
    list: [
      "Student housing",
      "Shared accommodations",
      "Private rooms",
      "Apartments",
      "Family homes",
      "Furnished rentals",
      "Long-term rental options"
    ]
  },
  {
    q: "Will NestArrival expand globally?",
    a: "Yes. NestArrival’s long-term vision is to create a globally connected relocation ecosystem supporting cross-border accommodation and international movement."
  },
  {
    q: "Is NestArrival focused on long-term relocation?",
    a: "NestArrival primarily focuses on helping people relocating for:",
    list: [
      "Education",
      "Work opportunities",
      "Immigration",
      "Long-term settlement",
      "International career growth"
    ]
  },
  {
    q: "How do I join early access?",
    a: "Users can join the early access waitlist by submitting their details through the platform’s registration or enquiry sections.",
    list: [
      "Priority onboarding",
      "Early platform access",
      "Future feature updates",
      "Relocation support opportunities"
    ]
  }
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] text-[#5c544d]">
      <Navbar />
      
      {/* Decorative radial background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(207,160,82,0.03)_0%,transparent_50%)] pointer-events-none z-0 h-[500px]" />
 
      <main className="flex-grow mx-auto max-w-5xl w-full px-4 py-20 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[10px] text-[#cfa052] font-extrabold uppercase tracking-widest bg-[#eae1d3] px-3 py-1.5 rounded-full border border-[#eae1d3]/50 inline-block shadow-sm"
          >
            Our Mission
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-[#2c2724] sm:text-6xl font-serif italic leading-[1.15]"
          >
            Redefining Global Accommodation for Modern Relocation.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-xs sm:text-sm text-[#8a7d6a] max-w-2xl mx-auto leading-relaxed"
          >
            Established in 2026, NestArrival is a global relocation and accommodation platform designed to help people secure trusted housing before moving to a new city or country.
          </motion.p>
        </div>
 
        {/* Narrative columns */}
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
 
        {/* Core Pillars grid */}
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

        {/* ═══ FAQ SECTION ════════════════════════════════════════ */}
        <section className="border-t border-[#eae1d3] pt-20">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Header */}
            <div className="text-center space-y-3">
              <h2 className="font-serif text-3xl font-bold text-[#2c2724] tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-[#8a7d6a] max-w-xl mx-auto leading-relaxed">
                Everything you need to know about using NestArrival for international accommodation and relocation support.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a7d6a]" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-white border border-[#eae1d3] rounded-2xl py-3.5 pl-11 pr-4 text-[#2c2724] outline-none focus:border-[#cfa052] transition-colors shadow-sm"
              />
            </div>

            {/* Accordion List */}
            <div className="space-y-4 pt-6">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div 
                      key={idx}
                      className="bg-white rounded-2xl border border-[#eae1d3] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                      >
                        <span className="font-bold text-[#2c2724] text-xs sm:text-sm">
                          {idx + 1}. {faq.q}
                        </span>
                        <ChevronDown 
                          className={`h-4 w-4 text-[#8a7d6a] transition-transform duration-300 flex-shrink-0 ${
                            isOpen ? "rotate-180 text-[#cfa052]" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                          >
                            <div className="px-6 pb-6 text-xs text-[#5c544d] border-t border-[#f4efe6] pt-4 space-y-3 leading-relaxed">
                              <p>{faq.a}</p>
                              {faq.list && (
                                <ul className="list-disc pl-5 space-y-1 text-[#8a7d6a]">
                                  {faq.list.map((item, itemIdx) => (
                                    <li key={itemIdx}>{item}</li>
                                  ))}
                                </ul>
                              )}
                              {faq.footer && (
                                <p className="font-medium text-[#2c2724]">{faq.footer}</p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-[#8a7d6a] text-xs">
                  No matching FAQs found. Try searching for other keywords.
                </div>
              )}
            </div>

          </div>
        </section>

      </main>
 
      <Footer />
    </div>
  );
}
