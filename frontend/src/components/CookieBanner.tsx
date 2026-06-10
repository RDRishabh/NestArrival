"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, X, Cookie, ToggleLeft, ToggleRight } from "lucide-react";

export default function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [prefs, setPrefs] = useState({
    essential: true,   // always on
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("nestarrival_cookie_consent");
    if (!consent) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(
      "nestarrival_cookie_consent",
      JSON.stringify({ essential: true, analytics: true, marketing: true })
    );
    setIsOpen(false);
  };

  const handleManage = () => {
    setIsManaging(true);
  };

  const handleSavePrefs = () => {
    localStorage.setItem("nestarrival_cookie_consent", JSON.stringify(prefs));
    setIsOpen(false);
    setIsManaging(false);
  };

  const handleDecline = () => {
    localStorage.setItem(
      "nestarrival_cookie_consent",
      JSON.stringify({ essential: true, analytics: false, marketing: false })
    );
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop for manage modal */}
      {isManaging && (
        <div className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm" onClick={() => setIsManaging(false)} />
      )}

      {/* Main Banner / Manage Modal */}
      <div
        className={`fixed z-[70] transition-all duration-300 ${
          isManaging
            ? "inset-0 flex items-center justify-center p-4"
            : "bottom-6 right-6 left-6 md:left-auto md:max-w-md"
        }`}
      >
        {isManaging ? (
          /* ---- Cookie Preferences Modal ---- */
          <div className="bg-[#2c2724] text-[#fdfbf7] rounded-2xl shadow-2xl border border-[#cfa052]/20 w-full max-w-md p-6 flex flex-col gap-5 relative animate-fade-in">
            <button
              onClick={() => setIsManaging(false)}
              className="absolute top-4 right-4 text-[#aba296] hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <Cookie className="h-5 w-5 text-[#cfa052] shrink-0" />
              <h4 className="font-serif font-bold text-base text-white">Cookie Preferences</h4>
            </div>

            <p className="text-[#aba296] text-xs leading-relaxed">
              Manage your cookie preferences below. Essential cookies are always active as they are required for the platform to function.{" "}
              <Link href="/policies/cookie" className="text-[#cfa052] underline hover:text-[#b58942] transition-colors">
                Cookie Policy
              </Link>
            </p>

            <div className="space-y-4">
              {/* Essential */}
              <div className="flex items-center justify-between gap-3 bg-white/5 rounded-xl p-3">
                <div>
                  <p className="text-sm font-bold text-white">Essential Cookies</p>
                  <p className="text-[10px] text-[#aba296] mt-0.5">Required for login and security. Cannot be disabled.</p>
                </div>
                <ToggleRight className="h-6 w-6 text-[#cfa052] shrink-0" />
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between gap-3 bg-white/5 rounded-xl p-3 cursor-pointer" onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}>
                <div>
                  <p className="text-sm font-bold text-white">Analytics Cookies</p>
                  <p className="text-[10px] text-[#aba296] mt-0.5">Help us understand how visitors use our site.</p>
                </div>
                {prefs.analytics
                  ? <ToggleRight className="h-6 w-6 text-[#cfa052] shrink-0" />
                  : <ToggleLeft className="h-6 w-6 text-[#8a7d6a] shrink-0" />
                }
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between gap-3 bg-white/5 rounded-xl p-3 cursor-pointer" onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}>
                <div>
                  <p className="text-sm font-bold text-white">Marketing Cookies</p>
                  <p className="text-[10px] text-[#aba296] mt-0.5">Used to show relevant ads and track referrals.</p>
                </div>
                {prefs.marketing
                  ? <ToggleRight className="h-6 w-6 text-[#cfa052] shrink-0" />
                  : <ToggleLeft className="h-6 w-6 text-[#8a7d6a] shrink-0" />
                }
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={handleDecline}
                className="px-4 py-2 border border-[#eae1d3]/20 hover:border-[#cfa052] text-[#aba296] hover:text-white rounded-lg transition-colors font-bold text-xs cursor-pointer"
              >
                Decline All
              </button>
              <button
                onClick={handleSavePrefs}
                className="px-5 py-2 bg-[#cfa052] hover:bg-[#b58942] text-white rounded-lg transition-colors font-bold text-xs cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        ) : (
          /* ---- Default Banner ---- */
          <div className="bg-[#2c2724] text-[#fdfbf7] p-6 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.3)] border border-[#cfa052]/20 animate-fade-in flex flex-col gap-4 text-xs">
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
              <button
                onClick={handleManage}
                className="px-4 py-2 border border-[#eae1d3]/20 hover:border-[#cfa052] text-[#aba296] hover:text-white rounded-lg transition-colors font-bold cursor-pointer"
              >
                Manage
              </button>
              <button
                onClick={handleAccept}
                className="px-5 py-2 bg-[#cfa052] hover:bg-[#b58942] text-white rounded-lg transition-colors font-bold cursor-pointer"
              >
                Accept
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
