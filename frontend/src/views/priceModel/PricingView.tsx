"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingHeader from "@/components/PricingHeader";
import PricingSwitchers from "@/components/PricingSwitchers";
import PricingGrid from "@/components/PricingGrid";
import ProfileBooster from "@/components/ProfileBooster";
import RefundDisclosure from "@/components/RefundDisclosure";

export default function PricingView() {
  const [currency, setCurrency] = useState<"CAD" | "USD" | "GBP">("CAD");
  const [paymentMode, setPaymentMode] = useState<"ONETIME" | "SUB">("ONETIME");

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] text-[#5c544d]">
      <Navbar />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(207,160,82,0.03)_0%,transparent_50%)] pointer-events-none z-0 h-[500px]" />
      <main className="flex-grow mx-auto max-w-7xl w-full px-4 py-20 sm:px-6 lg:px-8 relative z-10">
        <PricingHeader />
        <PricingSwitchers currency={currency} setCurrency={setCurrency} paymentMode={paymentMode} setPaymentMode={setPaymentMode} />
        <PricingGrid currency={currency} paymentMode={paymentMode} />
        <ProfileBooster currency={currency} />
        <RefundDisclosure />
      </main>
      <Footer />
    </div>
  );
}
