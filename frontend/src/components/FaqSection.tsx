"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
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
    a: "Waitlist early access is managed via the enquiry forms on the homepage. Users can join the early access waitlist by submitting their details through the platform’s registration or enquiry sections.",
    list: [
      "Priority onboarding",
      "Early platform access",
      "Future feature updates",
      "Relocation support opportunities"
    ]
  }
];

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
  );
}
