"use client";

import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function Footer() {
  const platformLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Explore Locations", href: "/#explore" },
    { name: "Verified Listings", href: "/#explore" },
    { name: "Join Early Access", href: "/signup" },
    { name: "Contact", href: "/contact" },
  ];

  const relocationLinks = [
    { name: "Student Housing", href: "/signup?type=student" },
    { name: "Worker Accommodation", href: "/signup?type=worker" },
    { name: "Shared Living", href: "/signup?type=shared" },
    { name: "Family Homes", href: "/signup?type=family" },
  ];

  const legalLinks = [
    { name: "Terms & Conditions", href: "/policies/terms" },
    { name: "Privacy Policy", href: "/policies/privacy" },
    { name: "Refund Policy", href: "/policies/refund" },
    { name: "Cancellation Policy", href: "/policies/cancellation" },
    { name: "Verification Policy", href: "/policies/verification" },
    { name: "Cookie Policy", href: "/policies/cookie" },
    { name: "Community Guidelines", href: "/policies/community" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      href: "#",
      svg: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "#",
      svg: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "#",
      svg: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      name: "X (Twitter)",
      href: "#",
      svg: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "#",
      svg: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      href: "#",
      svg: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="border-t border-[#eae1d3]/80 bg-[#fdfbf7] py-16 text-xs text-[#5c544d]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Logo & Brand Details */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-[#2c2724]" />
              <span className="text-lg font-bold tracking-tight text-[#2c2724]">
                Nest<span className="text-[#2c2724]">Arrival</span>
              </span>
            </div>
            <p className="text-[11px] text-[#8a7d6a] leading-relaxed">
              Helping verified international tenants connect with verified property owners before moving abroad. NestArrival is building a safer and more trusted relocation experience.
            </p>
            {/* Social Media Links */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="h-8 w-8 rounded-xl bg-white border border-[#eae1d3] flex items-center justify-center text-[#8a7d6a] hover:text-[#cfa052] hover:border-[#cfa052] hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-[#2c2724]">Platform</h4>
            <ul className="space-y-2 font-medium text-[#8a7d6a]">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[#cfa052] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Relocation Support */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-[#2c2724]">Relocation</h4>
            <ul className="space-y-2 font-medium text-[#8a7d6a]">
              {relocationLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[#cfa052] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Countries & Destinations */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-[#2c2724]">Destinations</h4>
            <div className="space-y-3 text-[11px] text-[#8a7d6a]">
              <div>
                <span className="font-bold text-[#2c2724] block mb-1">Current Focus:</span>
                <span className="block">Canada</span>
                <span className="text-[9px] text-[#aba296] block mt-0.5">Toronto, Vancouver, Montreal, Mississauga</span>
              </div>
              <div>
                <span className="font-bold text-[#2c2724] block mb-1">Upcoming Destinations:</span>
                <span className="block">USA, UK, Australia, New Zealand</span>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-[#2c2724]">Newsletter</h4>
            <div className="space-y-3">
              <p className="text-[11px] text-[#8a7d6a] leading-relaxed">
                Join the Future of Global Relocation. Get early access updates, relocation insights, new city launches, and accommodation opportunities.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
                <input
                  type="email"
                  placeholder="Enter email..."
                  required
                  className="w-full text-[11px] bg-white border border-[#eae1d3] rounded-xl py-2.5 pl-3 pr-10 text-[#2c2724] outline-none focus:border-[#cfa052] shadow-sm"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg bg-[#cfa052] text-white flex items-center justify-center hover:bg-[#b58942] transition-colors"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>

        </div>

        <hr className="border-[#eae1d3]" />

        {/* Footer Bottom Bar */}
        <div className="flex flex-col gap-6">
          {/* Policy Links */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 font-medium text-[#8a7d6a]">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#cfa052] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Copyright Section */}
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row text-[#aba296] text-[10px] pt-2">
            <p>© {new Date().getFullYear()} NestArrival Inc. All rights reserved.</p>
            <p className="text-center md:text-right max-w-lg leading-relaxed">
              NestArrival connects verified tenants with verified property owners through a trust-first ecosystem focused on transparency, safety, and international accessibility. Helping relocators secure trusted housing before moving abroad.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
