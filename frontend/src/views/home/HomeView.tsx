"use client";

import InteractiveSteps from "@/components/InteractiveSteps";
import HeroSection from "@/components/HeroSection";
import VisionSection from "@/components/VisionSection";
import AboutSummarySection from "@/components/AboutSummarySection";
import ProblemSection from "@/components/ProblemSection";
import TrendingHomesSection from "@/components/TrendingHomesSection";
import FoundersMessageSection from "@/components/FoundersMessageSection";
import PartnersSection from "@/components/PartnersSection";
import EarlyAccessSection from "@/components/EarlyAccessSection";

export default function HomeView() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] text-[#2c2724] overflow-x-hidden font-sans">
      
      <HeroSection />
      <VisionSection />
      <AboutSummarySection />
      <ProblemSection />
      <InteractiveSteps />
      <TrendingHomesSection />
      <FoundersMessageSection />
      <PartnersSection />
      <EarlyAccessSection />
     
    </div>
  );
}
