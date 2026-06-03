"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TiltCard from "@/components/TiltCard";
import CustomDropdown from "@/components/CustomDropdown";
import CustomDatePicker from "@/components/CustomDatePicker";
import InteractiveSteps from "@/components/InteractiveSteps";
import {
  ShieldCheck, ArrowRight, CheckCircle2,
  ShieldAlert, Sparkles, Compass,
  Building, Users, Mail, Phone, MapPin, ChevronDown, Check,
  GraduationCap, Briefcase, Heart, Globe, DollarSign, Search, Calendar, CheckCircle
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";

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

/* ── Stagger Variants ────────────────────────────────────────────── */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/* ══════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Floating Search Bar State
  const [searchRole, setSearchRole] = useState("Tenant");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchType, setSearchType] = useState("");

  // Enquiry Form State
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "", email: "", originCountry: "India", destinationCity: "Toronto",
    visaStatus: "Yes", visaType: "Student Visa", plannedMoveDate: "1-3 months",
    purposeOfMove: "Studies", rentalDuration: "1 Year", budget: "1500",
    accommodationType: "Shared Space",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // GSAP refs
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 15]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
      if (headingRef.current) tl.fromTo(headingRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, delay: 0.1 });
      if (subheadingRef.current) tl.fromTo(subheadingRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0 }, "-=0.7");
      if (heroImageRef.current) tl.fromTo(heroImageRef.current, { opacity: 0, x: 40, scale: 0.95 }, { opacity: 1, x: 0, scale: 1, duration: 1.2 }, "-=0.7");
      if (searchBarRef.current) tl.fromTo(searchBarRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  /* ── Data ──────────────────────────────────────────────────────── */
  const floorPlanPreviews = [
    {
      title: "Charming Chelsea Apartment",
      city: "London",
      country: "United Kingdom",
      rent: "2,400",
      currency: "GBP",
      roomType: "Entire Apartment",
      bedrooms: "2 Bedrooms",
      furnishing: "Fully Furnished",
      transit: "2 min to Tube Station",
      moveIn: "Immediate",
      verificationBadge: "Vetted Owner",
      tags: ["Central", "Family-Friendly"],
      image: "/images/toronto_loft.png"
    },
    {
      title: "Luxury Marina Heights Suite",
      city: "Dubai",
      country: "United Arab Emirates",
      rent: "7,500",
      currency: "AED",
      roomType: "Studio Apartment",
      bedrooms: "1 Bedroom",
      furnishing: "Furnished",
      transit: "5 min to Metro",
      moveIn: "Jul 1, 2026",
      verificationBadge: "Title Vetted",
      tags: ["High-Rise", "Pool Access"],
      image: "/images/vancouver_townhouse.png"
    },
    {
      title: "Sunny Bondi Beach Condo",
      city: "Sydney",
      country: "Australia",
      rent: "950",
      currency: "AUD",
      roomType: "Private Room",
      bedrooms: "1 Bedroom",
      furnishing: "Semi-Furnished",
      transit: "Bus stop outside",
      moveIn: "Aug 15, 2026",
      verificationBadge: "Identity Verified",
      tags: ["Beachside", "Student Friendly"],
      image: "/images/montreal_studio.png"
    },
    {
      title: "Loft in Downtown Manhattan",
      city: "New York",
      country: "United States",
      rent: "3,200",
      currency: "USD",
      roomType: "Entire Loft",
      bedrooms: "1 Bedroom",
      furnishing: "Fully Furnished",
      transit: "Subway 1 block away",
      moveIn: "Immediate",
      verificationBadge: "Verified Listing",
      tags: ["Urban", "Fast Transit"],
      image: "/images/toronto_loft.png"
    },
    {
      title: "Modern City-Centre Townhouse",
      city: "Auckland",
      country: "New Zealand",
      rent: "850",
      currency: "NZD",
      roomType: "Entire Townhouse",
      bedrooms: "3 Bedrooms",
      furnishing: "Furnished",
      transit: "10 min walk to Ferry",
      moveIn: "Sep 1, 2026",
      verificationBadge: "Title Vetted",
      tags: ["Spacious", "Quiet"],
      image: "/images/vancouver_townhouse.png"
    }
  ];

  const faqs = [
    { q: "What is NestArrival?", a: "NestArrival is a trust-first global relocation and accommodation platform. We help verified international tenants, immigrants, workers, and students safely connect with vetted property owners abroad before boarding their flight to their destination country." },
    { q: "Who can use NestArrival?", a: "Our platform is custom-built for international students, foreign workers, relocating families, permanent residents, and temporary newcomers moving across borders—starting with incoming relocators from third-world countries to Canada." },
    { q: "Is browsing and searching properties free?", a: "Yes! Searching and exploring rental opportunities is 100% free of charge. NestArrival only charges a platform connection fee when verified tenants connect directly with verified property owners to secure their accommodation." },
    { q: "How does the refund-backed connection model work?", a: "We believe in absolute accountability. A refund is available if none of the verified owners you contacted reply to your messages within your active subscription period. A valid response means the verified owner replies to your message through the NestArrival chat within your active plan period. An automated reply or an out-of-office message does not count as a response." },
    { q: "Why is NestArrival different from other rental search platforms?", a: "Traditional platforms ignore international tenants, require local credit scores, or contain scams. NestArrival manual-vets landlord land titles and tenant visa details to guarantee zero overseas scams and responsive cross-border matches." },
    { q: "What documents do property owners need to verify?", a: "Property owners must upload passport or driver's license identification alongside verified local land title deeds or municipal property tax records to prove they legitimately own the property listed." },
  ];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFormSubmit = (e: React.FormEvent) => { e.preventDefault(); setFormSubmitted(true); };

  const partnerTypes = [
    { icon: GraduationCap, label: "Colleges & Universities" },
    { icon: ShieldCheck, label: "Immigration Consultants" },
    { icon: Building, label: "Property Landlords & Realtors" },
    { icon: Users, label: "Settlement Networks" },
    { icon: Globe, label: "Immigration Platforms" },
  ];

  /* ══════════════════════════════════════════════════════════════ */
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] text-[#2c2724] overflow-x-hidden font-sans">
      <Navbar />

      {/* ═══ 1. HERO (REDESIGNED) ══════════════════════════════════ */}
      <section ref={heroRef} className="relative pt-12 pb-32 px-4 sm:px-6 lg:px-8 z-10" style={{ perspective: "1000px" }}>
        
        {/* Background Video Wrapper */}
        <div className="absolute inset-0 overflow-hidden z-0 bg-[#fdfbf7]">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
          >
            <source src="https://videos.pexels.com/video-files/3121459/3121459-uhd_2560_1440_24fps.mp4" type="video/mp4" />
          </video>
          {/* Strong gradient on the left side for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fdfbf7] via-[#fdfbf7]/80 to-transparent pointer-events-none w-full lg:w-2/3" />
          {/* Vertical fading to blend with page */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#fdfbf7]/95 via-transparent to-[#fdfbf7]/95 pointer-events-none" />
        </div>

        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#eae1d3]/20 to-transparent pointer-events-none rounded-bl-full opacity-50 z-0" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10 gap-12">
          
          {/* Left: Typography */}
          <div className="lg:w-1/2 space-y-6 relative z-20 text-center lg:text-left mt-2">
            <h1 ref={headingRef} className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[#2c2724] tracking-tight leading-[1.1] opacity-0">
              Your Trusted <br className="hidden lg:block"/>
              Home Platform <br className="hidden lg:block"/>
              <span className="text-[#cfa052] italic font-serif">Before You Arrive.</span>
            </h1>
            
            <p ref={subheadingRef} className="text-base text-[#5c544d] max-w-xl mx-auto lg:mx-0 leading-relaxed opacity-0">
              Helping verified owners connect with verified international tenants through a secure and transparent rental experience. For Immigrants, By Immigrants.
            </p>

            {/* Main CTA */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex justify-center lg:justify-start pt-4">
              <button className="bg-[#cfa052] hover:bg-[#b58942] text-white px-8 py-4 rounded-full font-bold shadow-[0_8px_20px_rgba(207,160,82,0.3)] hover:shadow-[0_15px_30px_rgba(207,160,82,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group text-sm uppercase tracking-wide">
                Start Your Journey
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Right: Aspirational Image */}
          <div ref={heroImageRef} className="lg:w-1/2 relative opacity-0 w-full max-w-2xl mx-auto">
            <motion.div style={{ y, rotateX }} className="relative z-10">
              <div className="absolute inset-0 bg-[#cfa052]/10 rounded-[3rem] transform translate-x-4 translate-y-4" />
            <img 
              src="/images/vancouver_townhouse.png" 
              alt="Beautiful Canadian Home" 
              className="relative w-full h-[450px] lg:h-[550px] object-cover rounded-[3rem] shadow-[0_30px_60px_rgba(44,39,36,0.12)] border-[8px] border-white"
            />
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-[#eae1d3] flex items-center gap-3 animate-float-delayed">
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

        {/* Floating Relocation Matchmaker Bar */}
        <div ref={searchBarRef} className="absolute left-1/2 -translate-x-1/2 -bottom-40 md:-bottom-12 w-[90%] max-w-5xl z-30 opacity-0">
          <motion.div style={{ y, rotateX }} className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(44,39,36,0.08)] border border-[#eae1d3] p-3">
            {/* Tabs */}
            <div className="flex border-b border-[#eae1d3] px-4 pb-2 gap-6">
              <button onClick={() => setSearchRole("Tenant")} className={`text-xs font-bold pb-2 border-b-2 transition-colors ${searchRole === "Tenant" ? "border-[#cfa052] text-[#cfa052]" : "border-transparent text-[#8a7d6a] hover:text-[#2c2724]"}`}>Find a Home</button>
              <button onClick={() => setSearchRole("Owner")} className={`text-xs font-bold pb-2 border-b-2 transition-colors ${searchRole === "Owner" ? "border-[#cfa052] text-[#cfa052]" : "border-transparent text-[#8a7d6a] hover:text-[#2c2724]"}`}>List a Property</button>
            </div>
            
            {/* Fields */}
            <div className="flex flex-col md:flex-row items-center justify-between p-4 gap-4">
              <div className="flex-1 w-full md:border-r border-[#eae1d3] px-2 flex items-center gap-3">
                <MapPin className="text-[#cfa052] h-5 w-5 opacity-70" />
                <div className="w-full">
                  <p className="text-[10px] uppercase font-bold text-[#8a7d6a]">Location</p>
                  <input type="text" placeholder="Toronto, Vancouver..." value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} className="w-full text-sm font-bold text-[#2c2724] outline-none placeholder:text-[#a89e8d]" />
                </div>
              </div>
              
              <div className="flex-1 w-full md:border-r border-[#eae1d3] px-2 flex items-center gap-3 relative z-40">
                <Building className="text-[#cfa052] h-5 w-5 opacity-70" />
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

              <div className="flex-1 w-full px-2 flex items-center gap-3 relative z-40">
                <Calendar className="text-[#cfa052] h-5 w-5 opacity-70" />
                <div className="w-full">
                  <p className="text-[10px] uppercase font-bold text-[#8a7d6a] mb-0.5">Move Date</p>
                  <CustomDatePicker
                    value={searchDate}
                    onChange={setSearchDate}
                    placeholder="dd-mm-yyyy"
                  />
                </div>
              </div>
              
              <button className="relative overflow-hidden w-full md:w-auto bg-gradient-to-r from-[#cfa052] to-[#b58942] hover:to-[#a37937] text-white px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all duration-300 shadow-[0_10px_25px_rgba(207,160,82,0.4)] hover:shadow-[0_15px_35px_rgba(207,160,82,0.6)] hover:-translate-y-1 group">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <Search className="h-4 w-4 relative z-10" /> 
                <span className="relative z-10">Search</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="h-56 md:h-24 bg-[#f4efe6]"></div> {/* Spacer for the floating bar */}

      {/* ═══ 2. VISION ═════════════════════════════════════════════ */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-[#f4efe6] wavy-divider-top">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center space-x-1.5 text-[10px] text-[#cfa052] font-extrabold uppercase tracking-widest">
                <Compass className="h-3.5 w-3.5" /><span>The Story Behind Us</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c2724] tracking-tight leading-[1.1]">
                To Make Moving In Globally Hassle-Free.
              </h2>
              <p className="text-sm text-[#5c544d] leading-relaxed">
                NestArrival is pioneering a trust-driven accommodation ecosystem where landlords securely verify their titles, and incoming tenants confirm their legal permits. We bridge the distance with digital vetting, removing communication friction, unanswered inquiries, and listing stress before departure.
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs font-black pt-2">
                {["Fraud Prevention Vetting", "Smart Location Discovery", "Verified User Registry", "Refund-Backed Connection"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[#2c2724]">
                    <CheckCircle2 className="h-4 w-4 text-[#cfa052] flex-shrink-0" /><span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}
              className="lg:col-span-7">
              <div className="p-8 bg-white border border-[#eae1d3] rounded-3xl space-y-6 relative shadow-[0_20px_60px_rgba(44,39,36,0.06)]">
                <div className="bg-[#fdfbf7] rounded-2xl border border-[#eae1d3] p-4 shadow-sm flex items-center justify-between animate-float-delayed">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-[#eae1d3] border border-[#cfa052]/20 rounded-full flex items-center justify-center text-[#2c2724] font-bold text-sm">IN</div>
                    <div>
                      <p className="font-extrabold text-xs text-[#2c2724]">Arjun Sharma (Student Vetted)</p>
                      <p className="text-[10px] text-[#8a7d6a]">Delhi, India → Brampton, Canada</p>
                    </div>
                  </div>
                  <span className="text-[9px] bg-[#cfa052]/10 text-[#cfa052] font-extrabold border border-[#cfa052]/20 rounded-full px-2 py-0.5 uppercase">Verified</span>
                </div>

                <div className="flex justify-center py-2">
                  <div className="w-0.5 h-8 border-r-2 border-dashed border-[#cfa052]/40" />
                </div>

                <div className="bg-[#fdfbf7] rounded-2xl border border-[#eae1d3] p-4 shadow-sm flex items-center justify-between animate-float">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-[#eae1d3] border border-[#cfa052]/20 rounded-full flex items-center justify-center text-[#2c2724]">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-[#2c2724]">Ontario Vetted Duplex Complex</p>
                      <p className="text-[10px] text-[#8a7d6a]">Owner Title Vetted & Local Land Checked</p>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-50 text-emerald-600 font-extrabold border border-emerald-100 rounded-full px-2 py-0.5 uppercase">Verified Owner</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ 3. ABOUT ══════════════════════════════════════════════ */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-[#fdfbf7]">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] text-[#cfa052] font-extrabold uppercase tracking-widest">About Us</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c2724] tracking-tight">Redefining Global Accommodation for Modern Relocation</h2>
          </div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Vetting-First Ecosystem", desc: "Both tenants and property owners submit legally verified documentations, eradicating fake listings, scams, and fraudulent accounts.", label: "01 / Safety First" },
              { icon: Users, title: "Personalized Matching", desc: "Matches are facilitated based on move-in date alignment, student/worker preferences, budget constraints, and locations.", label: "02 / Smart Match" },
              { icon: DollarSign, title: "Refund Guarantee Assurance", desc: "A refund is available if none of the verified owners you contacted reply to your messages within your active subscription period.", label: "03 / Guaranteed Risk-Free" },
            ].map((card) => (
              <motion.div key={card.title} variants={fadeUpItem}
                className="bg-white p-7 rounded-3xl border border-[#eae1d3] shadow-[0_8px_30px_rgba(44,39,36,0.04)] space-y-4 flex flex-col justify-between h-72 hover-lift group">
                <div className="space-y-3">
                  <div className="inline-flex p-3 rounded-2xl bg-[#f4efe6] text-[#cfa052] transition-colors group-hover:bg-[#cfa052] group-hover:text-white">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-black text-[#2c2724]">{card.title}</h3>
                  <p className="text-[11px] text-[#5c544d] leading-relaxed">{card.desc}</p>
                </div>
                <span className="text-[9px] text-[#a89e8d] font-extrabold tracking-wider uppercase">{card.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ 4. PROBLEM WE SOLVE ═══════════════════════════════════ */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-[#f4efe6]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6">
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
                {[
                  "Fake listings and online rental scams demanding deposits.", 
                  "Ignored messages and unanswered landlord inquiries.", 
                  "No responses from landlords",
                  "Rejection due to no local credit history",
                  "Communication barriers across countries and time zones",
                  "Last-minute accommodation panic",
                  "Emotional stress of relocation",
                  "Expensive and unstable temporary hotel stays on arrival.", 
                  "No ability to vet property owners from across borders."
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="text-red-500/80 font-bold flex-shrink-0 mt-0.5">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
              className="lg:col-span-6 bg-white border border-[#eae1d3] rounded-3xl p-8 space-y-6 shadow-[0_15px_50px_rgba(44,39,36,0.05)]">
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

      {/* ═══ 5. HOW IT WORKS ═══════════════════════════════════════ */}
      <InteractiveSteps />

      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-[#f4efe6]">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] text-[#cfa052] font-extrabold uppercase tracking-widest block">Trending Homes You'll Love</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c2724] tracking-tight">Explore Spaces Designed for Your Next Chapter.</h2>
            <p className="text-sm text-[#5c544d] max-w-2xl mx-auto leading-relaxed">
              NestArrival helps international tenants discover verified living spaces that match their lifestyle, budget, comfort, and relocation goals before arriving in a new country.
            </p>
          </div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {floorPlanPreviews.map((listing) => (
              <motion.div key={listing.title} variants={fadeUpItem}>
                <TiltCard tiltMax={3} className="h-full w-full rounded-[2rem] overflow-hidden border border-[#eae1d3] bg-white shadow-[0_12px_30px_rgba(44,39,36,0.03)] flex flex-col group hover:shadow-[0_20px_45px_rgba(44,39,36,0.06)] transition-all duration-300">
                  {/* Image Viewport */}
                  <div className="h-48 w-full relative overflow-hidden bg-[#f4efe6]">
                    <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-4 left-4 text-[9px] font-extrabold bg-white text-[#2c2724] px-3 py-1 rounded-full uppercase shadow-sm border border-[#eae1d3]">
                      {listing.verificationBadge}
                    </span>
                  </div>
                  
                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-[#8a7d6a] font-bold">
                        <span>{listing.roomType} · {listing.bedrooms}</span>
                        <span className="text-[#cfa052] font-black">{listing.city}, {listing.country}</span>
                      </div>
                      <h3 className="font-serif font-black text-lg text-[#2c2724] leading-tight">{listing.title}</h3>
                      
                      <div className="border-t border-[#f4efe6] pt-3 grid grid-cols-2 gap-y-2 text-[10px] text-[#5c544d]">
                        <div><span className="text-[#8a7d6a]">Furnishing:</span> <strong className="text-[#2c2724] block mt-0.5">{listing.furnishing}</strong></div>
                        <div><span className="text-[#8a7d6a]">Transit:</span> <strong className="text-[#2c2724] block mt-0.5">{listing.transit}</strong></div>
                        <div className="col-span-2"><span className="text-[#8a7d6a]">Move-in Date:</span> <strong className="text-[#2c2724] block mt-0.5">{listing.moveIn}</strong></div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      {/* Lifestyle Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {listing.tags.map((tag) => (
                          <span key={tag} className="text-[9px] font-extrabold bg-[#f4efe6] text-[#8a7d6a] px-2 py-0.5 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer Details */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#f4efe6]">
                        <div>
                          <span className="text-[9px] text-[#8a7d6a] uppercase tracking-wider block">Monthly Rent</span>
                          <span className="font-black text-base text-[#2c2724]">{listing.currency === "GBP" ? "£" : listing.currency === "AED" ? "AED " : "$"}{listing.rent}</span>
                        </div>
                        <Link href="/signup" className="text-[10px] font-extrabold bg-[#cfa052] hover:bg-[#b58942] text-white px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-1">
                          Inquire <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}

            {/* CTA Card */}
            <motion.div variants={fadeUpItem} className="h-full">
              <TiltCard tiltMax={3} className="h-full min-h-[400px] w-full rounded-[2rem] border border-[#eae1d3] bg-[#fdfbf7] shadow-[0_12px_30px_rgba(44,39,36,0.03)] p-8 flex flex-col justify-center items-center text-center">
                <div className="h-14 w-14 bg-[#eae1d3] rounded-full flex items-center justify-center text-[#cfa052] mb-4 border border-[#cfa052]/20">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-black text-[#2c2724] mb-2">Looking for more?</h3>
                <p className="text-[11px] text-[#5c544d] max-w-xs mb-6">Create a verified profile to unlock hundreds of exclusive, title-vetted properties globally.</p>
                <Link href="/signup" className="text-xs font-bold text-[#cfa052] border-b border-[#cfa052] pb-0.5 hover:text-[#b58942] hover:border-[#b58942] transition-colors">
                  View All Properties
                </Link>
              </TiltCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 11. FOUNDER'S MESSAGE ═════════════════════════════════ */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c2724] tracking-tight mb-3">For Immigrants, By Immigrants.</h2>
            <p className="text-[#8a7d6a] text-lg font-medium">A Platform Built From Real Relocation Struggles.</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="bg-[#fdfbf7] rounded-3xl border border-[#eae1d3] p-8 sm:p-12 shadow-sm relative">
            <div className="absolute top-8 left-8 text-[#cfa052]/20">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M14.017 21L16.41 14.286H11.532C11.532 12.046 12.87 11.233 14.524 10.952L15.358 10.826V5.414L14.492 5.485C10.024 5.86 7.973 8.358 7.973 12.657V21H14.017ZM24 21L26.393 14.286H21.515C21.515 12.046 22.853 11.233 24.507 10.952L25.341 10.826V5.414L24.475 5.485C20.007 5.86 17.956 8.358 17.956 12.657V21H24Z" transform="translate(-7.973 -5.414)"/></svg>
            </div>
            
            <div className="space-y-6 text-[#5c544d] text-sm sm:text-base leading-relaxed relative z-10 font-serif italic">
              <p>When I first moved abroad, I experienced the reality that many immigrants silently go through. Finding accommodation in a new country was not simple. I faced unanswered messages, uncertainty, fake listings, communication barriers, and the stress of trying to secure a safe place to live while being thousands of miles away from my destination.</p>
              
              <p>Over the next 4–5 years, while moving between provinces, cities, and even countries, I realized this problem was much bigger than just my personal experience. Millions of international students, workers, immigrants, and relocating families face the same struggle every single day. Most rental platforms are not designed for people moving internationally. Newcomers are often ignored simply because they do not yet have local history, references, or connections.</p>
              
              <p>That experience inspired me to build NestArrival. NestArrival was created to make relocation safer, simpler, and more trusted for people starting a new chapter abroad. Our goal is not only to help people find accommodation. Our goal is to help people feel secure during one of the biggest transitions of their lives.</p>
              
              <div className="pl-6 border-l-2 border-[#cfa052] my-6 py-2 not-italic">
                <p className="font-bold text-[#2c2724] mb-3">We want newcomers to feel:</p>
                <ul className="space-y-2 text-sm font-medium">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-[#cfa052]"/> Supported</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-[#cfa052]"/> Understood</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-[#cfa052]"/> Safe</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-[#cfa052]"/> Confident before they arrive</li>
                </ul>
              </div>
              
              <p>This platform is being built with real immigrant experiences at its foundation. Every feature, every connection, and every step of the process is designed around trust, transparency, and creating a better relocation journey.</p>
              
              <p>This is only the beginning. Our long-term vision is to build a globally connected accommodation ecosystem that helps people move across borders with confidence and peace of mind. No matter where someone comes from or where they are moving, finding a home should never feel impossible.</p>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-[#eae1d3] pt-8 gap-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-[#eae1d3] overflow-hidden border-2 border-white shadow-md flex items-center justify-center relative">
                  <img src="/images/royal_singh.png" alt="Royal Singh" className="absolute inset-0 h-full w-full object-cover z-10" onError={(e) => e.currentTarget.style.display = 'none'} />
                  <span className="text-[#cfa052] font-bold text-xl relative z-0">RS</span>
                </div>
                <div>
                  <p className="font-extrabold text-[#2c2724] text-lg">Royal Singh</p>
                  <p className="text-[11px] text-[#8a7d6a] font-bold uppercase tracking-wider">Founder, NestArrival</p>
                </div>
              </div>
              <a href="#" className="h-10 w-10 rounded-full bg-white border border-[#eae1d3] flex items-center justify-center text-[#8a7d6a] hover:text-[#0a66c2] hover:border-[#0a66c2] transition-colors shadow-sm shrink-0">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 14. PARTNERS & COLLABORATIONS ════════════════════════ */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-[#fdfbf7] border-t border-[#eae1d3]/50">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] text-[#cfa052] font-extrabold uppercase tracking-widest block">Partners & Collaborations</span>
            <h2 className="font-serif text-3xl font-bold text-[#2c2724] tracking-tight">
              Building a Trusted Global Relocation Ecosystem Together.
            </h2>
            <p className="text-xs text-[#8a7d6a] max-w-xl mx-auto leading-relaxed">
              We collaborate with key organizations globally to bridge verification gaps, making housing secure and stress-free for relocators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: GraduationCap,
                title: "Educational Institutions",
                desc: "Securing student relocations prior to departure by vetting local student units."
              },
              {
                icon: ShieldCheck,
                title: "Immigration Consultants",
                desc: "Vetting documentation chains to provide early relocation housing clearances."
              },
              {
                icon: Building,
                title: "Property Owners",
                desc: "Ensuring land titles map cleanly, providing zero-scam rental opportunities."
              },
              {
                icon: Briefcase,
                title: "Realtors & Housing Providers",
                desc: "Connecting vetted property managers with high-intent international professionals."
              }
            ].map((partner, idx) => {
              const Icon = partner.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-2xl border border-[#eae1d3] shadow-sm space-y-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="inline-flex p-3 rounded-xl bg-[#f4efe6] text-[#cfa052]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xs font-black text-[#2c2724]">{partner.title}</h3>
                    <p className="text-[10px] text-[#8a7d6a] leading-relaxed">
                      {partner.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-center pt-8">
            <Link href="/contact?role=partner" className="text-xs font-bold bg-[#2c2724] hover:bg-[#cfa052] text-white px-8 py-3.5 rounded-full transition-all duration-300 shadow-sm flex items-center gap-2 group hover:scale-105">
              Partner With Us
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 15. EARLY ACCESS CTA ══════════════════════════════════ */}
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

      <Footer />
    </div>
  );
}
