"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeView from "@/views/home/HomeView";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] text-[#2c2724] overflow-x-hidden font-sans">
      <Navbar />
      <HomeView />
      <Footer />
    </div>
  );
}
