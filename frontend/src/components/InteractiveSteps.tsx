"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus, ShieldCheck, Search, MessageSquare, 
  Home, FileText, Users, CheckCircle2, Lock, ShieldAlert 
} from "lucide-react";

const tenantSteps = [
  { 
    id: "t1", 
    title: "Create Your Profile", 
    desc: "Share your destination city, budget, relocation timeline, visa/study status, and accommodation preferences." 
  },
  { 
    id: "t2", 
    title: "Verification Process", 
    desc: "Upload your passport/ID, visa, and student or employment letter. NestArrival vets and verifies all files." 
  },
  { 
    id: "t3", 
    title: "Explore Verified Listings", 
    desc: "Browse vetted rental listings with confirmed landlord ownership titles and zero scam risk." 
  },
  { 
    id: "t4", 
    title: "Secure Connection", 
    desc: "Connect directly with verified owners in our protected messaging portal to arrange lease agreements." 
  },
  { 
    id: "t5", 
    title: "Refund-Backed Confidence", 
    desc: "If you don't receive active replies from verified landlords within your target criteria, your fee is refunded." 
  },
];

const ownerSteps = [
  { 
    id: "o1", 
    title: "Submit Property", 
    desc: "List your property details, upload photos, and attach ownership verification like a tax bill or deed." 
  },
  { 
    id: "o2", 
    title: "Verification Process", 
    desc: "NestArrival matches property registries with owner ID to ensure listing legitimacy and security." 
  },
  { 
    id: "o3", 
    title: "Review Matches", 
    desc: "Browse verified incoming tenant profiles, check study/work permits, and select ideal candidates." 
  },
  { 
    id: "o4", 
    title: "Secure Connection", 
    desc: "Communicate securely with vetted international tenants and coordinate move-in details." 
  },
];

export default function InteractiveSteps() {
  const [activeTenant, setActiveTenant] = useState(0);
  const [activeOwner, setActiveOwner] = useState(0);

  return (
    <section className="py-16 lg:py-0 lg:h-screen lg:min-h-[850px] lg:max-h-[920px] flex flex-col justify-center bg-[#fdfbf7] overflow-hidden border-b border-[#eae1d3]/30">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col h-full justify-center gap-6 lg:gap-8">
        
        {/* Header */}
        <div className="text-center space-y-2 flex-shrink-0">
          <span className="text-[10px] text-[#cfa052] font-extrabold uppercase tracking-widest block">How The Platform Works</span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2c2724] tracking-tight">
            The Seamless Journey: Tenants & Owners
          </h2>
        </div>

        {/* Dashboards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch flex-shrink min-h-0">
          
          {/* Tenant Dashboard Panel */}
          <div className="bg-white rounded-3xl border border-[#eae1d3] shadow-[0_15px_40px_rgba(44,39,36,0.03)] flex flex-col h-[520px] lg:h-[600px] overflow-hidden">
            {/* Panel Header */}
            <div className="bg-[#fdfbf7] border-b border-[#eae1d3] p-5 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="font-extrabold text-base text-[#2c2724] flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#cfa052] animate-pulse"></span>
                  Tenant Journey
                </h3>
                <p className="text-[10px] text-[#8a7d6a] mt-0.5 font-medium">Securing your home before arrival</p>
              </div>
              <div className="h-9 w-9 bg-white shadow-sm rounded-xl flex items-center justify-center border border-[#eae1d3] text-[#cfa052]">
                <UserPlus className="h-4 w-4" />
              </div>
            </div>

            {/* Steps Horizontal Navigation / Timeline */}
            <div className="relative flex items-center justify-between px-6 py-4 bg-[#fdfbf7]/50 border-b border-[#eae1d3] flex-shrink-0">
              <div className="absolute left-8 right-8 top-1/2 h-[1px] bg-[#eae1d3] -translate-y-1/2 z-0" />
              {tenantSteps.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => setActiveTenant(idx)}
                  className={`relative z-10 h-7 w-7 rounded-full border flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    activeTenant === idx
                      ? "bg-[#cfa052] border-[#cfa052] text-white scale-110 shadow-md"
                      : "bg-white border-[#eae1d3] text-[#8a7d6a] hover:border-[#cfa052]/40 hover:text-[#cfa052]"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {/* Panel Body */}
            <div className="p-6 flex flex-col flex-1 min-h-0">
              {/* Step Info */}
              <div className="min-h-[76px] flex-shrink-0">
                <span className="text-[9px] text-[#cfa052] font-black uppercase tracking-wider block mb-0.5">
                  Step {activeTenant + 1} of 5
                </span>
                <h4 className="font-bold text-[#2c2724] text-sm">{tenantSteps[activeTenant].title}</h4>
                <p className="text-[11px] text-[#5c544d] leading-relaxed mt-1">
                  {tenantSteps[activeTenant].desc}
                </p>
              </div>

              {/* Dynamic Interactive Mock UI Screen */}
              <div className="flex-1 mt-4 rounded-2xl border border-[#eae1d3] bg-[#fbf9f5] p-4 flex flex-col justify-center items-center relative overflow-hidden min-h-0 shadow-inner">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTenant}
                    initial={{ opacity: 0, scale: 0.96, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -5 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full flex flex-col justify-center"
                  >
                    {activeTenant === 0 && (
                      <div className="max-w-[280px] mx-auto bg-white rounded-xl border border-[#eae1d3] p-4 shadow-sm space-y-3 w-full">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-[#eae1d3] flex items-center justify-center font-bold text-xs text-[#2c2724]">AM</div>
                          <div>
                            <p className="text-xs font-bold text-[#2c2724]">Aarav Mehta</p>
                            <p className="text-[9px] text-[#8a7d6a]">Delhi → Vancouver</p>
                          </div>
                        </div>
                        <div className="border-t border-[#f4efe6] pt-2 space-y-1.5 text-[10px]">
                          <div className="flex justify-between"><span className="text-[#8a7d6a]">Monthly Budget:</span><span className="font-bold text-[#2c2724]">$1,400 CAD</span></div>
                          <div className="flex justify-between"><span className="text-[#8a7d6a]">Move-in Date:</span><span className="font-bold text-[#2c2724]">Sept 1, 2026</span></div>
                          <div className="flex justify-between"><span className="text-[#8a7d6a]">Visa Status:</span><span className="font-bold text-emerald-600">Approved Student</span></div>
                        </div>
                      </div>
                    )}

                    {activeTenant === 1 && (
                      <div className="max-w-[280px] mx-auto bg-white rounded-xl border border-[#eae1d3] p-4 shadow-sm space-y-3 w-full">
                        <p className="text-[10px] font-bold text-[#2c2724] border-b border-[#f4efe6] pb-2">Verification Checklist</p>
                        <div className="space-y-2 text-[10px]">
                          <div className="flex items-center justify-between p-1.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
                            <span className="text-[#2c2724] font-medium">Passport / Government ID</span>
                            <span className="text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full uppercase">Verified</span>
                          </div>
                          <div className="flex items-center justify-between p-1.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
                            <span className="text-[#2c2724] font-medium">Visa Study Permit</span>
                            <span className="text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full uppercase">Verified</span>
                          </div>
                          <div className="flex items-center justify-between p-1.5 bg-amber-50/50 rounded-lg border border-amber-100">
                            <span className="text-[#2c2724] font-medium">University Acceptance Letter</span>
                            <span className="text-[8px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full uppercase">Reviewing</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTenant === 2 && (
                      <div className="max-w-[290px] mx-auto bg-white rounded-xl border border-[#eae1d3] p-3 shadow-sm flex flex-col gap-2.5 w-full">
                        <div className="h-24 w-full bg-[#f4efe6]/50 rounded-lg flex items-center justify-center text-[#8a7d6a] relative overflow-hidden">
                          <img src="/images/toronto_loft.png" alt="Property Loft" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                          <span className="absolute top-2 left-2 text-[8px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-md uppercase">Vetted Owner Title</span>
                        </div>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] font-bold text-[#2c2724]">Modern Downtown Loft</p>
                            <p className="text-[9px] text-[#8a7d6a]">Toronto, Canada</p>
                          </div>
                          <span className="text-xs font-black text-[#cfa052]">$1,850/mo</span>
                        </div>
                      </div>
                    )}

                    {activeTenant === 3 && (
                      <div className="max-w-[280px] mx-auto bg-white rounded-xl border border-[#eae1d3] overflow-hidden shadow-sm flex flex-col h-[140px] w-full">
                        <div className="bg-[#eae1d3]/30 p-2 text-[10px] font-bold text-[#2c2724] border-b border-[#eae1d3] flex items-center justify-between">
                          <span>Secure Portal Chat</span>
                          <Lock className="h-3 w-3 text-[#cfa052]" />
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-end gap-2 text-[9px] overflow-y-auto">
                          <div className="bg-[#f4efe6]/50 p-2 rounded-lg max-w-[85%] self-start text-[#5c544d]">
                            Hi Aarav! Your visa checks out perfectly. We can proceed with the digital lease signing.
                          </div>
                          <div className="bg-[#cfa052] text-white p-2 rounded-lg max-w-[85%] self-end">
                            Thank you David! That is a huge relief. Looking forward.
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTenant === 4 && (
                      <div className="max-w-[260px] mx-auto text-center space-y-3 p-4 bg-white rounded-xl border border-[#eae1d3] shadow-sm w-full">
                        <div className="mx-auto h-11 w-11 bg-amber-50 rounded-full flex items-center justify-center text-[#cfa052] border border-amber-100">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[11px] font-extrabold text-[#2c2724]">100% Refund Guarantee</p>
                          <p className="text-[9px] text-[#8a7d6a] mt-1">
                            If NestArrival cannot connect you with active verified owners, your platform fee is immediately refunded in full.
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Owner Dashboard Panel */}
          <div className="bg-white rounded-3xl border border-[#eae1d3] shadow-[0_15px_40px_rgba(44,39,36,0.03)] flex flex-col h-[520px] lg:h-[600px] overflow-hidden">
            {/* Panel Header */}
            <div className="bg-[#fdfbf7] border-b border-[#eae1d3] p-5 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="font-extrabold text-base text-[#2c2724] flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#cfa052] animate-pulse"></span>
                  Owner Journey
                </h3>
                <p className="text-[10px] text-[#8a7d6a] mt-0.5 font-medium">Listing and vetting matching tenants</p>
              </div>
              <div className="h-9 w-9 bg-white shadow-sm rounded-xl flex items-center justify-center border border-[#eae1d3] text-[#cfa052]">
                <Home className="h-4 w-4" />
              </div>
            </div>

            {/* Steps Horizontal Navigation / Timeline */}
            <div className="relative flex items-center justify-between px-6 py-4 bg-[#fdfbf7]/50 border-b border-[#eae1d3] flex-shrink-0">
              <div className="absolute left-8 right-8 top-1/2 h-[1px] bg-[#eae1d3] -translate-y-1/2 z-0" />
              {ownerSteps.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => setActiveOwner(idx)}
                  className={`relative z-10 h-7 w-7 rounded-full border flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    activeOwner === idx
                      ? "bg-[#cfa052] border-[#cfa052] text-white scale-110 shadow-md"
                      : "bg-white border-[#eae1d3] text-[#8a7d6a] hover:border-[#cfa052]/40 hover:text-[#cfa052]"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {/* Panel Body */}
            <div className="p-6 flex flex-col flex-1 min-h-0">
              {/* Step Info */}
              <div className="min-h-[76px] flex-shrink-0">
                <span className="text-[9px] text-[#cfa052] font-black uppercase tracking-wider block mb-0.5">
                  Step {activeOwner + 1} of 4
                </span>
                <h4 className="font-bold text-[#2c2724] text-sm">{ownerSteps[activeOwner].title}</h4>
                <p className="text-[11px] text-[#5c544d] leading-relaxed mt-1">
                  {ownerSteps[activeOwner].desc}
                </p>
              </div>

              {/* Dynamic Interactive Mock UI Screen */}
              <div className="flex-1 mt-4 rounded-2xl border border-[#eae1d3] bg-[#fbf9f5] p-4 flex flex-col justify-center items-center relative overflow-hidden min-h-0 shadow-inner">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeOwner}
                    initial={{ opacity: 0, scale: 0.96, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -5 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full flex flex-col justify-center"
                  >
                    {activeOwner === 0 && (
                      <div className="max-w-[280px] mx-auto bg-white rounded-xl border border-[#eae1d3] p-4 shadow-sm space-y-2 w-full text-[10px]">
                        <p className="font-bold text-[#2c2724] border-b border-[#f4efe6] pb-1">Create Listing Submission</p>
                        <div className="space-y-1.5">
                          <div><span className="text-[#8a7d6a] block text-[8px] uppercase">Property Title</span><div className="border border-[#eae1d3] p-1 rounded font-medium text-[#2c2724]">Vancouver Garden Suite</div></div>
                          <div className="grid grid-cols-2 gap-2">
                            <div><span className="text-[#8a7d6a] block text-[8px] uppercase">Rent (CAD)</span><div className="border border-[#eae1d3] p-1 rounded font-medium text-[#2c2724]">$2,100</div></div>
                            <div><span className="text-[#8a7d6a] block text-[8px] uppercase">Land Title Deed</span><div className="border border-emerald-200 bg-emerald-50/30 text-emerald-800 p-1 rounded font-bold text-[8px] truncate">✓ Attached.pdf</div></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeOwner === 1 && (
                      <div className="max-w-[280px] mx-auto bg-white rounded-xl border border-[#eae1d3] p-4 shadow-sm space-y-3.5 w-full text-[10px]">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold border-b border-[#f4efe6] pb-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>Ownership Vetting Checks</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between"><span className="text-[#8a7d6a]">Government Registry Check:</span><span className="font-extrabold text-emerald-600">MATCHED</span></div>
                          <div className="flex justify-between"><span className="text-[#8a7d6a]">Land Title Deed Vetting:</span><span className="font-extrabold text-emerald-600">VERIFIED</span></div>
                          <div className="flex justify-between"><span className="text-[#8a7d6a]">Landlord Identity Check:</span><span className="font-extrabold text-emerald-600">PASSED</span></div>
                        </div>
                      </div>
                    )}

                    {activeOwner === 2 && (
                      <div className="max-w-[290px] mx-auto bg-white rounded-xl border border-[#eae1d3] p-3 shadow-sm space-y-2 w-full text-[10px]">
                        <p className="font-bold text-[#2c2724] border-b border-[#f4efe6] pb-1">Recommended Verified Matches</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between p-1.5 border border-[#eae1d3] rounded-lg bg-[#fdfbf7]">
                            <div>
                              <p className="font-bold text-[#2c2724]">Elena R. (Worker)</p>
                              <p className="text-[8px] text-[#8a7d6a]">Visa: Vetted & Verified</p>
                            </div>
                            <span className="bg-[#cfa052]/10 text-[#cfa052] font-black text-[9px] px-2 py-0.5 rounded">98% Match</span>
                          </div>
                          <div className="flex items-center justify-between p-1.5 border border-[#eae1d3] rounded-lg">
                            <div>
                              <p className="font-bold text-[#2c2724]">Aarav M. (Student)</p>
                              <p className="text-[8px] text-[#8a7d6a]">Visa: Vetted & Verified</p>
                            </div>
                            <span className="bg-[#8a7d6a]/10 text-[#8a7d6a] font-black text-[9px] px-2 py-0.5 rounded">94% Match</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeOwner === 3 && (
                      <div className="max-w-[280px] mx-auto bg-white rounded-xl border border-[#eae1d3] overflow-hidden shadow-sm flex flex-col h-[140px] w-full">
                        <div className="bg-[#eae1d3]/30 p-2 text-[10px] font-bold text-[#2c2724] border-b border-[#eae1d3] flex items-center justify-between">
                          <span>Secure Portal Chat</span>
                          <Lock className="h-3 w-3 text-[#cfa052]" />
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-end gap-2 text-[9px] overflow-y-auto">
                          <div className="bg-[#cfa052] text-white p-2 rounded-lg max-w-[85%] self-end">
                            Hi Elena, I reviewed your verified profile. The move-in timeline is perfect.
                          </div>
                          <div className="bg-[#f4efe6]/50 p-2 rounded-lg max-w-[85%] self-start text-[#5c544d]">
                            Wonderful! Thank you. I am ready to review the digital lease.
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
