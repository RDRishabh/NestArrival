"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { motion } from "framer-motion";
import TiltCard from "@/components/TiltCard";

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function TrendingHomesSection() {
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

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-[#f4efe6]">
      <div className="max-w-6xl mx-auto space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[10px] text-[#cfa052] font-extrabold uppercase tracking-widest block">Trending Homes You'll Love</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c2724] tracking-tight">Explore Spaces Designed for Your Next Chapter.</h2>
          <p className="text-sm text-[#5c544d] max-w-2xl mx-auto leading-relaxed">
            NestArrival helps international tenants discover verified living spaces that match their lifestyle, budget, comfort, and relocation goals before arriving in a new country.
          </p>
        </div>

        <motion.div 
          variants={staggerContainer} 
          initial="hidden" 
          whileInView="visible" 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
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
  );
}
