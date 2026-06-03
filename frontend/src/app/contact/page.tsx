"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, CheckCircle, Loader2, ArrowRight, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";

function ContactFormContent() {
  const searchParams = useSearchParams();
  
  // States
  const [role, setRole] = useState("Tenant");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  // Dynamic fields states
  const [destinationCity, setDestinationCity] = useState("");
  const [visaStatus, setVisaStatus] = useState("Approved");
  const [propertyCity, setPropertyCity] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [organizationName, setOrganizationName] = useState("");
  const [partnershipType, setPartnershipType] = useState("Student Support");

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  // Pre-fill role based on query param
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam) {
      if (roleParam === "partner") {
        setRole("Corporate Partner");
      } else if (roleParam === "owner") {
        setRole("Property Owner");
      } else if (roleParam === "tenant") {
        setRole("Tenant");
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setStatus("submitting");

    setTimeout(() => {
      console.log(`\n==================================================`);
      console.log(`[NestArrival Support Ticket]`);
      console.log(`Role: ${role}`);
      console.log(`From: ${name} (${email})`);
      console.log(`Subject: ${subject}`);
      
      if (role === "Tenant") {
        console.log(`Destination: ${destinationCity}`);
        console.log(`Visa Status: ${visaStatus}`);
      } else if (role === "Property Owner") {
        console.log(`Property Location: ${propertyCity}`);
        console.log(`Property Type: ${propertyType}`);
      } else {
        console.log(`Organization Name: ${organizationName}`);
        console.log(`Partnership Type: ${partnershipType}`);
      }

      console.log(`Message: ${message}`);
      console.log(`==================================================\n`);
      
      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setDestinationCity("");
      setPropertyCity("");
      setOrganizationName("");
    }, 1000);
  };

  return (
    <main className="flex-grow mx-auto max-w-5xl w-full px-4 py-20 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center mb-16 space-y-4">
        <motion.span 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[10px] text-[#cfa052] font-extrabold uppercase tracking-widest bg-[#eae1d3] px-3 py-1.5 rounded-full border border-[#eae1d3]/50 inline-block shadow-sm"
        >
          Support Portal
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl font-extrabold tracking-tight text-[#2c2724] sm:text-5xl font-serif italic"
        >
          Help Center & Support
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-xs sm:text-sm text-[#8a7d6a] max-w-xl mx-auto leading-relaxed"
        >
          Have questions regarding document uploads, residency verification, or partner collaborations? Select your role below and submit a support ticket.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Support Info Side Cards */}
        <div className="md:col-span-1 space-y-4 text-xs">
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-6 rounded-2xl border border-[#eae1d3] shadow-md space-y-3"
          >
            <div className="flex items-center space-x-2 text-[#cfa052] font-bold">
              <Mail className="h-4 w-4" />
              <span>General Support</span>
            </div>
            <p className="text-[11px] text-[#8a7d6a] leading-relaxed">
              For general platform queries, feedback, or early access assistance.
            </p>
            <a href="mailto:hello@nestarrival.com" className="text-[#2c2724] font-semibold font-mono text-[11px] hover:text-[#cfa052] transition-colors block">
              hello@nestarrival.com
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-6 rounded-2xl border border-[#eae1d3] shadow-md space-y-3"
          >
            <div className="flex items-center space-x-2 text-[#cfa052] font-bold">
              <ShieldCheck className="h-4 w-4" />
              <span>Relocation & Vetting</span>
            </div>
            <p className="text-[11px] text-[#8a7d6a] leading-relaxed">
              For inquiries regarding study/work permit validation, title auditing, and matching criteria.
            </p>
            <a href="mailto:support@nestarrival.com" className="text-[#2c2724] font-semibold font-mono text-[11px] hover:text-[#cfa052] transition-colors block">
              support@nestarrival.com
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white p-6 rounded-2xl border border-[#eae1d3] shadow-md space-y-3"
          >
            <div className="flex items-center space-x-2 text-[#cfa052] font-bold">
              <Users className="h-4 w-4" />
              <span>Partnerships</span>
            </div>
            <p className="text-[11px] text-[#8a7d6a] leading-relaxed">
              For institutional settlement partners, colleges, and landlord associations.
            </p>
            <a href="mailto:partners@nestarrival.com" className="text-[#2c2724] font-semibold font-mono text-[11px] hover:text-[#cfa052] transition-colors block">
              partners@nestarrival.com
            </a>
          </motion.div>
        </div>

        {/* Ticket Form */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="md:col-span-2"
        >
          <div className="bg-white p-8 rounded-2xl border border-[#eae1d3] shadow-xl">
            <h2 className="text-sm font-bold text-[#2c2724] mb-6">File a Support Ticket</h2>

            {status === "success" && (
              <div className="mb-6 rounded-lg bg-emerald-50 border border-emerald-250 p-4 text-emerald-600 text-xs flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>Your ticket has been logged successfully. We will follow up soon!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              
              {/* Role Selection Dropdown */}
              <div>
                <label className="block font-bold text-[#8a7d6a] mb-1.5">Who Are You?</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg px-3 py-2.5 bg-white border border-[#eae1d3] text-slate-950 text-xs outline-none focus:border-[#cfa052]"
                >
                  <option value="Tenant">I am an Incoming Tenant</option>
                  <option value="Property Owner">I am a Property Owner</option>
                  <option value="Educational Institution">I represent an Educational Institution</option>
                  <option value="Immigration Consultant">I am an Immigration Consultant</option>
                  <option value="Realtor">I am a Realtor / Housing Agent</option>
                  <option value="Corporate Partner">I represent a Corporate Partner / Platform</option>
                </select>
              </div>

              {/* Shared Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#8a7d6a] mb-1.5">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full rounded-lg px-3 py-2.5 bg-white border border-[#eae1d3] text-slate-950 text-xs outline-none focus:border-[#cfa052]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#8a7d6a] mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    className="w-full rounded-lg px-3 py-2.5 bg-white border border-[#eae1d3] text-slate-950 text-xs outline-none focus:border-[#cfa052]"
                  />
                </div>
              </div>

              {/* Dynamic Form Fields Based on Role */}
              
              {/* Tenant Dynamic Fields */}
              {role === "Tenant" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#fdfbf7] border border-[#eae1d3] space-y-3 sm:space-y-0">
                  <div>
                    <label className="block font-bold text-[#8a7d6a] mb-1.5">Destination City</label>
                    <input
                      type="text"
                      required
                      value={destinationCity}
                      onChange={(e) => setDestinationCity(e.target.value)}
                      placeholder="e.g. Toronto, Vancouver"
                      className="w-full rounded-lg px-3 py-2 bg-white border border-[#eae1d3] text-slate-950 text-xs outline-none focus:border-[#cfa052]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#8a7d6a] mb-1.5">Visa / Study Permit Status</label>
                    <select
                      value={visaStatus}
                      onChange={(e) => setVisaStatus(e.target.value)}
                      className="w-full rounded-lg px-3 py-2 bg-white border border-[#eae1d3] text-slate-950 text-xs outline-none focus:border-[#cfa052]"
                    >
                      <option value="Approved">Approved / Issued</option>
                      <option value="Pending">Pending / In Progress</option>
                      <option value="Not Applied">Not Applied Yet</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Owner Dynamic Fields */}
              {role === "Property Owner" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#fdfbf7] border border-[#eae1d3] space-y-3 sm:space-y-0">
                  <div>
                    <label className="block font-bold text-[#8a7d6a] mb-1.5">Property Location (City)</label>
                    <input
                      type="text"
                      required
                      value={propertyCity}
                      onChange={(e) => setPropertyCity(e.target.value)}
                      placeholder="e.g. Montreal, Calgary"
                      className="w-full rounded-lg px-3 py-2 bg-white border border-[#eae1d3] text-slate-950 text-xs outline-none focus:border-[#cfa052]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#8a7d6a] mb-1.5">Property Type</label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full rounded-lg px-3 py-2 bg-white border border-[#eae1d3] text-slate-950 text-xs outline-none focus:border-[#cfa052]"
                    >
                      <option value="Apartment">Apartment / Condo</option>
                      <option value="House">Single Family House</option>
                      <option value="Shared Room">Shared Space / Bedroom</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Partner Dynamic Fields */}
              {["Educational Institution", "Immigration Consultant", "Realtor", "Corporate Partner"].includes(role) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#fdfbf7] border border-[#eae1d3] space-y-3 sm:space-y-0">
                  <div>
                    <label className="block font-bold text-[#8a7d6a] mb-1.5">Organization / Company Name</label>
                    <input
                      type="text"
                      required
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="e.g. Global College, Relocate Ltd"
                      className="w-full rounded-lg px-3 py-2 bg-white border border-[#eae1d3] text-slate-950 text-xs outline-none focus:border-[#cfa052]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#8a7d6a] mb-1.5">Partnership Interest</label>
                    <select
                      value={partnershipType}
                      onChange={(e) => setPartnershipType(e.target.value)}
                      className="w-full rounded-lg px-3 py-2 bg-white border border-[#eae1d3] text-slate-950 text-xs outline-none focus:border-[#cfa052]"
                    >
                      <option value="Student Support">International Student Support</option>
                      <option value="Immigration Integration">Immigration Program Integration</option>
                      <option value="Vetting & Safety">Verification & Vetting Alignment</option>
                      <option value="Realty Services">Realtor / Housing Listings Collaboration</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block font-bold text-[#8a7d6a] mb-1.5">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Document upload verification question"
                  className="w-full rounded-lg px-3 py-2.5 bg-white border border-[#eae1d3] text-slate-950 text-xs outline-none focus:border-[#cfa052]"
                />
              </div>

              {/* Message Details */}
              <div>
                <label className="block font-bold text-[#8a7d6a] mb-1.5">Message Detail</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry here..."
                  className="w-full rounded-lg px-3 py-2.5 bg-white border border-[#eae1d3] text-slate-950 text-xs outline-none focus:border-[#cfa052] resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-lg bg-[#cfa052] text-white hover:bg-[#2c2724] py-3 text-center text-xs font-bold transition-all shadow-[0_4px_12px_rgba(207,160,82,0.15)] hover:shadow-[0_4px_20px_rgba(207,160,82,0.25)] cursor-pointer"
              >
                {status === "submitting" ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    <span>Filing Ticket...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <span>Submit Support Ticket</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] text-[#5c544d]">
      <Navbar />
      
      {/* Decorative radial background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(207,160,82,0.03)_0%,transparent_50%)] pointer-events-none z-0 h-[500px]" />

      <Suspense fallback={<div className="text-center py-20 text-xs text-[#8a7d6a]">Loading Support Portal...</div>}>
        <ContactFormContent />
      </Suspense>

      <Footer />
    </div>
  );
}
