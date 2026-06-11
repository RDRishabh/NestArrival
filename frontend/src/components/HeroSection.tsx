"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building, Calendar, MapPin, Search, ShieldCheck } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import CustomDropdown from "@/components/CustomDropdown";
import CustomDatePicker from "@/components/CustomDatePicker";

interface HeroSectionProps {
  user?: any;
  loading?: boolean;
}

export default function HeroSection({ user: propUser, loading: propLoading }: HeroSectionProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchRole, setSearchRole] = useState("Tenant");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchType, setSearchType] = useState("");

  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 15]);

  useEffect(() => {
    setUser(propUser ?? null);
    setLoading(!!propLoading);
  }, [propUser, propLoading]);

  useEffect(() => {
    if (user?.role === "TENANT") {
      setSearchRole("Tenant");
    }
  }, [user]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
      if (headingRef.current) tl.fromTo(headingRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, delay: 0.1 });
      if (subheadingRef.current) tl.fromTo(subheadingRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0 }, "-=0.7");
      if (heroImageRef.current) tl.fromTo(heroImageRef.current, { opacity: 0, x: 40, scale: 0.95 }, { opacity: 1, x: 0, scale: 1, duration: 1.2 }, "-=0.7");
      if (searchBarRef.current) tl.fromTo(searchBarRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5");
    }, heroRef);
    return () => ctx.revert();
  }, [loading, user]);

  return (
    <>
      <section ref={heroRef} className="relative pt-8 pb-8 md:pb-32 px-0 sm:px-6 lg:px-8 z-10"
>

        <div className="absolute inset-0 overflow-hidden z-0 bg-[#fdfbf7]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
          >
            {/* Aerial view of Piaseczno suburban neighborhood by Oleksandr Petroniuk - Pexels */}
            <source src="https://videos.pexels.com/video-files/37767355/16019361_1920_1080_60fps.mp4" type="video/mp4" />
            {/* Fallback: luxury house exterior */}
            <source src="https://videos.pexels.com/video-files/2519660/2519660-hd_1920_1080_24fps.mp4" type="video/mp4" />
          </video>
          {/* Strong gradient on the left side for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fdfbf7] via-[#fdfbf7]/80 to-transparent pointer-events-none w-full lg:w-2/3" />
          {/* Vertical fading to blend with page */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#fdfbf7]/95 via-transparent to-[#fdfbf7]/95 pointer-events-none" />
        </div>

        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#eae1d3]/20 to-transparent pointer-events-none rounded-bl-full opacity-50 z-0" />

<div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10 gap-4 lg:gap-12 pb-4 md:pb-0 overflow-visible px-4 sm:px-0">

          <div className="lg:w-1/2 space-y-6 relative z-20 text-center lg:text-left mt-2">
            <h1 ref={headingRef} className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[#2c2724] tracking-tight leading-[1.1] opacity-0">
              Your Trusted <br className="hidden lg:block" />
              Home Platform <br className="hidden lg:block" />
              <span className="text-[#cfa052] italic font-serif">Before You Arrive.</span>
            </h1>

            <p ref={subheadingRef} className="text-base text-[#5c544d] max-w-xl mx-auto lg:mx-0 leading-relaxed opacity-0">
              Helping verified owners connect with verified international tenants through a secure and transparent rental experience. For Immigrants, By Immigrants.
            </p>

            {/* Main CTA */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex justify-center lg:justify-start pt-4">
              <Link href="/signup" className="bg-[#cfa052] hover:bg-[#b58942] text-white px-8 py-4 rounded-full font-bold shadow-[0_8px_20px_rgba(207,160,82,0.3)] hover:shadow-[0_15px_30px_rgba(207,160,82,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group text-sm uppercase tracking-wide">
                Start Your Journey
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

<div ref={heroImageRef} className="lg:w-1/2 relative opacity-0 w-full max-w-2xl mx-auto mb-6 lg:mb-0">
            <motion.div style={{ y, rotateX }} className="relative z-10">
              <div className="absolute inset-0 bg-[#cfa052]/10 rounded-[3rem] transform translate-x-4 translate-y-4" />
              <img
                src="/images/vancouver_townhouse.png"
                alt="Beautiful Canadian Home"
                className="relative w-full h-[280px] sm:h-[350px] lg:h-[550px] object-cover rounded-[3rem] shadow-[0_30px_60px_rgba(44,39,36,0.12)] border-[8px] border-white"
              />
              {/* Floating badge */}
              <div className="absolute top-6 left-4 md:-left-6 bg-white p-4 rounded-2xl shadow-xl border border-[#eae1d3] flex items-center gap-3 animate-float-delayed z-20">
                <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-[#5c544d] font-bold uppercase tracking-wider">100% Verified</p>
                  <p className="text-sm font-black text-[#2c2724]">Scam-Free Homes</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {(!loading && user?.role === "OWNER") ? (
          <div ref={searchBarRef} className="opacity-0 mt-8 md:mt-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:-bottom-12 w-full md:w-[90%] md:max-w-5xl md:z-30 mx-auto px-4 md:px-0">
            <div className="relative z-30 bg-white rounded-3xl shadow-[0_20px_50px_rgba(44,39,36,0.08)] border border-[#eae1d3] p-6 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 lg:gap-8">
              {/* Heading */}
              <div className="flex flex-col space-y-1 md:max-w-[320px] lg:max-w-[400px] text-left">
                <span className="text-[9px] text-[#cfa052] font-black uppercase tracking-widest block">Owner Portal</span>
                <h3 className="font-serif text-lg lg:text-xl font-bold text-[#2c2724] leading-tight">
                  List Your Property &amp; Find Verified Tenants
                </h3>
              </div>

              {/* Vertical divider on medium+ screens */}
              <div className="hidden md:block w-px h-12 bg-[#eae1d3]" />

              {/* Description */}
              <p className="text-xs text-[#5c544d] leading-relaxed flex-1 max-w-lg text-left">
                Access your landlord dashboard to add listings, manage tenant applications, and view background verification reports.
              </p>

              {/* Action Button */}
              <Link
                href="/owner/dashboard"
                className="w-full md:w-auto bg-[#cfa052] hover:bg-[#b58942] text-white px-6 py-3 rounded-full font-bold shadow-[0_8px_20px_rgba(207,160,82,0.25)] transition-all hover:-translate-y-0.5 text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer animate-pulse-subtle"
              >
                List a Property <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div ref={searchBarRef} className="opacity-0 mt-8 md:mt-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:-bottom-12 w-full md:w-[90%] md:max-w-5xl md:z-30 mx-auto">
            <div className="relative z-30 bg-white rounded-none sm:rounded-3xl shadow-[0_20px_50px_rgba(44,39,36,0.08)] border-y sm:border m-7 border-[#eae1d3] p-4 md:p-3">              
              {user?.role !== "TENANT" && (
                <div className="flex flex-col sm:flex-row sm:items-center border-b border-[#eae1d3] px-2 sm:px-4 pb-2 gap-3 sm:gap-6">
                  <button onClick={() => setSearchRole("Tenant")} className={`text-xs font-bold pb-2 border-b-2 transition-colors cursor-pointer ${searchRole === "Tenant" ? "border-[#cfa052] text-[#cfa052]" : "border-transparent text-[#8a7d6a] hover:text-[#2c2724]"}`}>Find a Home</button>
                  <button onClick={() => setSearchRole("Owner")} className={`text-xs font-bold pb-2 border-b-2 transition-colors cursor-pointer ${searchRole === "Owner" ? "border-[#cfa052] text-[#cfa052]" : "border-transparent text-[#8a7d6a] hover:text-[#2c2724]"}`}>List a Property</button>
                </div>
              )}

              {/* Fields */}
              <div className="flex flex-col md:flex-row items-stretch justify-between p-3 sm:p-4 gap-3 sm:gap-4">
                <div className="flex-1 w-full md:border-r border-[#eae1d3] px-2 py-1 flex items-center gap-3 min-h-[48px] md:min-h-[64px]">
                  <MapPin className="text-[#cfa052] h-5 w-5 opacity-70 shrink-0" />
                  <div className="w-full">
                    <p className="text-[10px] uppercase font-bold text-[#8a7d6a]">Location</p>
                    <input type="text" placeholder="Toronto, Vancouver..." value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} className="w-full text-sm font-bold text-[#2c2724] outline-none placeholder:text-[#a89e8d]" />
                  </div>
                </div>

                <div className="flex-1 w-full md:border-r border-[#eae1d3] px-2 py-1 flex items-center gap-3 relative z-40 min-h-[64px]">
                  <Building className="text-[#cfa052] h-5 w-5 opacity-70 shrink-0" />
                  <div className="w-full">
                    <p className="text-[10px] uppercase font-bold text-[#8a7d6a] mb-0.5">Property Type</p>
                    <CustomDropdown
                      options={["Any Type", "Apartment", "Shared Room", "House"]}
                      value={searchType}
                      onChange={setSearchType}
                      placeholder="Any Type"
                    />
                  </div>
                </div>

                <div className="flex-1 w-full px-2 py-1 flex items-center gap-3 relative z-40 min-h-[64px]">
                  <Calendar className="text-[#cfa052] h-5 w-5 opacity-70 shrink-0" />
                  <div className="w-full">
                    <p className="text-[10px] uppercase font-bold text-[#8a7d6a] mb-0.5">Move Date</p>
                    <CustomDatePicker
                      value={searchDate}
                      onChange={setSearchDate}
                      placeholder="dd-mm-yyyy"
                    />
                  </div>
                </div>

                <Link href={user ? "/tenant/dashboard" : "/signup"} className="relative overflow-hidden w-full md:w-auto bg-gradient-to-r from-[#cfa052] to-[#b58942] hover:to-[#a37937] text-white px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all duration-300 shadow-[0_10px_25px_rgba(207,160,82,0.4)] hover:shadow-[0_15px_35px_rgba(207,160,82,0.6)] hover:-translate-y-1 group">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <Search className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">Search</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="h-6 md:h-24 bg-[#f4efe6]"></div>
    </>
  );
}
