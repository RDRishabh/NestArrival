"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import InteractiveSteps from "@/components/InteractiveSteps";
import HeroSection from "@/components/HeroSection";
import VisionSection from "@/components/VisionSection";
import AboutSummarySection from "@/components/AboutSummarySection";
import ProblemSection from "@/components/ProblemSection";
import TrendingHomesSection from "@/components/TrendingHomesSection";
import FoundersMessageSection from "@/components/FoundersMessageSection";
import PartnersSection from "@/components/PartnersSection";
import EarlyAccessSection from "@/components/EarlyAccessSection";
import { authApi } from "@/apis/Authentication/auth";

export default function HomeView() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.me()
      .then((res) => res.data)
      .then((data) => {
        if (data && data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const isOwner = user && user.role === "OWNER";

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] text-[#2c2724] overflow-x-hidden font-sans">

      <HeroSection user={user} loading={loading} />
      <VisionSection />
      <AboutSummarySection />
      <ProblemSection />
      <InteractiveSteps />

      {!isOwner && <TrendingHomesSection user={user} loading={loading} />}

      {/* <FoundersMessageSection /> */}

      <PartnersSection />
      <EarlyAccessSection />

    </div>
  );
}
