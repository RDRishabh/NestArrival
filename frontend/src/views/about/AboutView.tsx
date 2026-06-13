"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutHeader from "@/components/AboutHeader";
import FoundersMessageSection from "@/components/FoundersMessageSection";
import ScamProtection from "@/components/ScamProtection";
import CorePillars from "@/components/CorePillars";
import FaqSection from "@/components/FaqSection";

export default function AboutView() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] text-[#5c544d]">
      <Navbar />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(207,160,82,0.03)_0%,transparent_50%)] pointer-events-none z-0 h-[500px]" />
      <main className="flex-grow mx-auto max-w-5xl w-full px-4 py-20 sm:px-6 lg:px-8 relative z-10">
        <AboutHeader />
        
        <ScamProtection />
        <FoundersMessageSection />
        <CorePillars />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
