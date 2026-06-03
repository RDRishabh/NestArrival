"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("nestarrival_cookie_consent");
    if (!consent) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("nestarrival_cookie_consent", "accepted");
    setIsOpen(false);
  };

  const handleManage = () => {
    localStorage.setItem("nestarrival_cookie_consent", "managed");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-md bg-[#2c2724] text-[#fdfbf7] p-6 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.3)] border border-[#cfa052]/20 z-50 animate-fade-in flex flex-col gap-4 text-xs">
      <div className="flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-[#cfa052] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-serif font-bold text-sm text-white">Cookie Consent</h4>
          <p className="text-[#aba296] leading-relaxed">
            We use cookies to improve your experience. By continuing, you accept our{" "}
            <Link href="/policies/cookie" className="text-[#cfa052] underline hover:text-[#b58942] transition-colors">
              Cookie Policy
            </Link>
            .
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 justify-end">
        <Link
          href="/policies/cookie"
          onClick={handleManage}
          className="px-4 py-2 border border-[#eae1d3]/20 hover:border-[#cfa052] text-[#aba296] hover:text-white rounded-lg transition-colors font-bold"
        >
          Manage
        </Link>
        <button
          onClick={handleAccept}
          className="px-5 py-2 bg-[#cfa052] hover:bg-[#b58942] text-white rounded-lg transition-colors font-bold"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
