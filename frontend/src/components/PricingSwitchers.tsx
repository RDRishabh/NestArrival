"use client";

interface PricingSwitchersProps {
  currency: "CAD" | "USD" | "GBP";
  setCurrency: (c: "CAD" | "USD" | "GBP") => void;
  paymentMode: "ONETIME" | "SUB";
  setPaymentMode: (m: "ONETIME" | "SUB") => void;
}

export default function PricingSwitchers({
  currency,
  setCurrency,
  paymentMode,
  setPaymentMode,
}: PricingSwitchersProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16">
      {/* Currency Switcher */}
      <div className="bg-[#eae1d3]/30 p-1.5 rounded-2xl border border-[#eae1d3] flex items-center gap-1 shadow-sm">
        {[
          { id: "CAD", label: "CAD ($)" },
          { id: "USD", label: "USD ($)" },
          { id: "GBP", label: "GBP (£)" },
        ].map((curr) => (
          <button
            key={curr.id}
            onClick={() => setCurrency(curr.id as any)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all duration-300 ${
              currency === curr.id
                ? "bg-[#cfa052] text-white shadow-sm"
                : "text-[#8a7d6a] hover:text-[#2c2724]"
            }`}
          >
            {curr.label}
          </button>
        ))}
      </div>

      {/* 
        === SUBSCRIBE & SAVE — COMING SOON ===
        Payment mode selector is temporarily disabled.
        We will re-enable this once Stripe subscription billing is configured.
        
      <div className="bg-[#eae1d3]/30 p-1.5 rounded-2xl border border-[#eae1d3] flex items-center gap-1 shadow-sm">
        {[
          { id: "ONETIME", label: "One-Time Payment", badge: "Best Value" },
          { id: "SUB", label: "Subscribe & Save", badge: "Save 30%" },
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setPaymentMode(mode.id as any)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all duration-300 relative ${
              paymentMode === mode.id
                ? "bg-[#cfa052] text-white shadow-sm"
                : "text-[#8a7d6a] hover:text-[#2c2724]"
            }`}
          >
            <span>{mode.label}</span>
            {mode.badge && (
              <span className={`absolute -top-2.5 -right-2 text-[7px] font-extrabold uppercase px-1.5 py-0.5 rounded-full border shadow-sm transition-all duration-300 ${
                paymentMode === mode.id
                  ? "bg-[#2c2724] text-white border-[#2c2724]"
                  : "bg-[#eae1d3] text-[#cfa052] border-[#eae1d3]"
              }`}>
                {mode.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      ===  END SUBSCRIBE & SAVE  === 
      */}
    </div>
  );
}
