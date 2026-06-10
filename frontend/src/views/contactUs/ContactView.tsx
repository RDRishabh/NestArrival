"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import canadaStreet from "../../../public/images/canada-vancouver-seawall.png";
import {
  HelpCircle,
  FileText,
  Users,
  ArrowRight,
  LifeBuoy,
  ClipboardCheck,
  BarChart3,
  ShieldCheck,
  Clock,
  Shield,
  ChevronDown,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";

const supportCards = [
  {
    icon: HelpCircle,
    title: "General Support",
    description: "Queries regarding platform access, feedback, or early access assistance.",
    email: "hello@nestarrival.com",
  },
  {
    icon: FileText,
    title: "Relocation & Vetting",
    description: "Inquiries regarding study/work permit validation, title auditing, and matching criteria.",
    email: "support@nestarrival.com",
  },
  {
    icon: Users,
    title: "Partnerships",
    description: "For institutional settlement partners, colleges, and landlord associations.",
    email: "partners@nestarrival.com",
  },
];

const secondaryResources = [
  {
    icon: ClipboardCheck,
    title: "Document Checklist",
    description: "Pre-arrival requirements for verified tenancy.",
    actionText: "Download PDF",
  },
  {
    icon: BarChart3,
    title: "Toronto Market Reports",
    description: "Real-time data on loft pricing and availability.",
    actionText: "Explore Maps",
  },
  {
    icon: ShieldCheck,
    title: "Vetting Protocol",
    description: "How we protect international transfers.",
    actionText: "Learn More",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function ContactFormContent() {
  const [formData, setFormData] = useState({
    identity: "I am an Incoming Tenant",
    fullName: "",
    email: "",
    destinationCity: "",
    permitStatus: "Approved / Issued",
    subject: "",
    message: "",
  });
  const [submitState, setSubmitState] = useState<{
    status: "idle" | "success" | "error";
    message: string;
  }>({ status: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitState({ status: "idle", message: "" });

    const requiredFields = [
      formData.fullName,
      formData.email,
      formData.destinationCity,
      formData.subject,
      formData.message,
    ];

    if (requiredFields.some((field) => !field.trim())) {
      setSubmitState({
        status: "error",
        message: "Please complete all required fields before submitting.",
      });
      setSubmitting(false);
      return;
    }

    try {
      console.log("Submitting Support Ticket:", formData);

      await new Promise((resolve) => setTimeout(resolve, 800));

      setSubmitState({
        status: "success",
        message: "Your ticket has been logged successfully. We will follow up soon!",
      });

      setFormData({
        identity: "I am an Incoming Tenant",
        fullName: "",
        email: "",
        destinationCity: "",
        permitStatus: "Approved / Issued",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setSubmitState({ status: "idle", message: "" });
      }, 5000);
    } catch (err) {
      setSubmitState({
        status: "error",
        message: "We couldn't send your ticket right now. Please try again in a moment.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white text-[#2D2924] font-sans px-6 py-1 md:py-20 flex flex-col items-center justify-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-4xl text-center flex flex-col items-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-1.5  border border-[#E6DCD0] rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-wider text-[#A38A70] uppercase mb-6 shadow-sm"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            Support Portal
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-[#1A1816]"
          >
            How can we help you?
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base text-[#60564D] max-w-xl leading-relaxed font-normal mb-8"
          >
            Navigating international relocation is complex. Whether you&apos;re an incoming tenant or a
            property owner, we&apos;re here to ensure your journey to Canada is seamless.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
        >
          {supportCards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <motion.a
                key={idx}
                href={`mailto:${card.email}`}
                aria-label={`Email ${card.title} at ${card.email}`}
                variants={itemVariants}
                whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(163, 138, 112, 0.08)" }}
                whileTap={{ scale: 0.99 }}
                className="bg-white border border-[#EDE6DC] rounded-2xl p-6 flex flex-col justify-between items-start text-left min-h-[250px] transition-shadow duration-300 relative group cursor-pointer no-underline"
              >
                <div className="w-full">
                  <div className="inline-flex items-center justify-center p-2.5 bg-[#FAF3EA] border border-[#EADFCF] rounded-xl text-[#B39067] mb-5">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1816] mb-3">{card.title}</h3>
                  <p className="text-[13px] text-[#635A51] leading-relaxed mb-6 font-normal">
                    {card.description}
                  </p>
                </div>
                <div className="w-full flex items-center justify-between pt-4 mt-auto">
                  <span className="text-[12px] font-semibold text-[#CFA26B] group-hover:text-[#B3854E] transition-colors duration-200 break-all">
                    {card.email}
                  </span>
                  <span className="text-[#D3C7B9] group-hover:text-[#CFA26B] group-hover:translate-x-1 transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </div>

      <div className="min-h-screen bg-[#FDFBF7] text-[#2D2924] font-sans px-6 py-16 md:py-24 flex items-center justify-center">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1A1816] mb-2">
                Relocation Resources
              </h2>
              <p className="text-xs md:text-sm text-[#635A51] max-w-md leading-relaxed">
                Expertly curated guides to help you land softly in your new Canadian neighborhood.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="self-start sm:self-auto bg-transparent border border-[#DCD3C7] rounded-full px-5 py-2 text-[11px] md:text-xs font-semibold tracking-wide text-[#544B42] hover:bg-[#F3EBE1] hover:border-[#C6BBAF] transition-all duration-200"
            >
              View All Resources
            </motion.button>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-5 gap-6"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="lg:col-span-3 rounded-2xl relative min-h-[340px] md:min-h-[420px] overflow-hidden flex flex-col justify-end p-6 md:p-8 group shadow-[0_4px_25px_rgba(0,0,0,0.03)] cursor-pointer"
            >
              <Image
                src={canadaStreet}
                alt="Vancouver contemporary architecture"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 z-0"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 z-10" />
              <div className="relative z-20 flex flex-col items-start text-white">
                <span className="bg-[#CF9D53] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-3.5 shadow-sm">
                  Spotlight
                </span>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 max-w-lg leading-tight">
                  The Vancouver Relocation Guide
                </h3>
                <p className="text-xs md:text-sm text-white/80 max-w-md font-light mb-6 leading-relaxed">
                  Discover the best neighborhoods from Kitsilano to Coal Harbour, and navigate the rental
                  market with ease.
                </p>
                <div className="flex items-center gap-1.5 text-xs font-semibold group-hover:gap-3 transition-all duration-300">
                  <span>Read the Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>

            <div className="lg:col-span-2 flex flex-col gap-4">
              {secondaryResources.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ x: 4, boxShadow: "0 4px 20px rgba(163, 138, 112, 0.06)" }}
                    className="bg-[#FCFAF7] border border-[#EDE6DC] rounded-xl p-5 flex flex-col justify-between items-start text-left min-h-[115px] group cursor-pointer transition-shadow duration-300"
                  >
                    <div className="w-full flex items-start gap-4">
                      <div className="mt-0.5 flex-shrink-0 text-[#CFA26B]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-[#1A1816] mb-1">{card.title}</h4>
                        <p className="text-[12px] text-[#635A51] font-normal leading-normal mb-2.5">
                          {card.description}
                        </p>
                        <span className="text-[11px] font-bold text-[#CFA26B] group-hover:text-[#B3854E] transition-colors duration-200 block">
                          {card.actionText}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="min-h-screen bg-white text-[#2D2924] font-sans px-4 sm:px-6 py-16 md:py-24 flex items-center justify-center">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          <div className="lg:col-span-5 flex flex-col space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#1A1816] mb-4">
                File a Support Ticket
              </h2>
              <p className="text-sm text-[#635A51] leading-relaxed max-w-md font-normal">
                Our dedicated relocation concierge team monitors inquiries 24/7. Expect a response within
                4–6 business hours for high-priority vetting requests.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-[#FAF3EA] border border-[#EADFCF] rounded-xl text-[#B39067] flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A1816] mb-0.5">Global Support Hours</h4>
                  <p className="text-xs text-[#635A51] leading-relaxed font-normal">
                    Mon – Fri: 24h Coverage | Sat – Sun: 8am – 6pm EST
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2 bg-[#FAF3EA] border border-[#EADFCF] rounded-xl text-[#B39067] flex-shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A1816] mb-0.5">Secure Verification</h4>
                  <p className="text-xs text-[#635A51] leading-relaxed font-normal">
                    All uploads are encrypted and handled by authorized personnel only.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#FCFAF7]/40 border border-[#EDE6DC] rounded-2xl p-5 md:p-6 max-w-md mt-4">
              <p className="text-xs md:text-[13px] text-[#635A51] italic leading-relaxed font-normal">
                &quot;NestArrival made my move from Seoul to Toronto completely stress-free. The support team
                walked me through every document requirement.&quot;
              </p>
              <span className="block text-[10px] md:text-[11px] font-bold text-[#A69B8F] tracking-wider uppercase mt-4">
                - Park J., Senior Architect
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 bg-white border border-[#EDE6DC] rounded-3xl p-6 md:p-8 shadow-[0_18px_60px_rgba(45,41,36,0.10)] ring-1 ring-black/5"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <label className="block text-[11px] font-bold text-[#B39067] uppercase tracking-wide mb-1.5">
                  Who Are You?
                </label>
                <div className="relative">
                  <select
                    value={formData.identity}
                    onChange={(e) => setFormData({ ...formData, identity: e.target.value })}
                    className="w-full bg-[#FCFAF7] border border-[#EFE9E0] rounded-xl py-3 pl-4 pr-10 text-xs md:text-sm text-[#2D2924] appearance-none outline-none focus:border-[#CFA26B] focus:ring-1 focus:ring-[#CFA26B] transition-all"
                  >
                    <option>I am an Incoming Tenant</option>
                    <option>I am a Property Owner</option>
                    <option>I am a Partner Agent</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#A39E98] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-[#B39067] uppercase tracking-wide mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#FCFAF7] border border-[#EFE9E0] rounded-xl py-3 px-4 text-xs md:text-sm text-[#2D2924] placeholder-[#A39E98] outline-none focus:border-[#CFA26B] focus:ring-1 focus:ring-[#CFA26B] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#B39067] uppercase tracking-wide mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FCFAF7] border border-[#EFE9E0] rounded-xl py-3 px-4 text-xs md:text-sm text-[#2D2924] placeholder-[#A39E98] outline-none focus:border-[#CFA26B] focus:ring-1 focus:ring-[#CFA26B] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-[#B39067] uppercase tracking-wide mb-1.5">
                    Destination City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Toronto, Vancouver"
                    value={formData.destinationCity}
                    onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
                    className="w-full bg-[#FCFAF7] border border-[#EFE9E0] rounded-xl py-3 px-4 text-xs md:text-sm text-[#2D2924] placeholder-[#A39E98] outline-none focus:border-[#CFA26B] focus:ring-1 focus:ring-[#CFA26B] transition-all"
                  />
                </div>
                <div className="relative">
                  <label className="block text-[11px] font-bold text-[#B39067] uppercase tracking-wide mb-1.5">
                    Visa / Study Permit Status
                  </label>
                  <div className="relative">
                    <select
                      value={formData.permitStatus}
                      onChange={(e) => setFormData({ ...formData, permitStatus: e.target.value })}
                      className="w-full bg-[#FCFAF7] border border-[#EFE9E0] rounded-xl py-3 pl-4 pr-10 text-xs md:text-sm text-[#2D2924] appearance-none outline-none focus:border-[#CFA26B] focus:ring-1 focus:ring-[#CFA26B] transition-all"
                    >
                      <option>Approved / Issued</option>
                      <option>Pending Review</option>
                      <option>Not Applicable</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#A39E98] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#B39067] uppercase tracking-wide mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Document upload verification question"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#FCFAF7] border border-[#EFE9E0] rounded-xl py-3 px-4 text-xs md:text-sm text-[#2D2924] placeholder-[#A39E98] outline-none focus:border-[#CFA26B] focus:ring-1 focus:ring-[#CFA26B] transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#B39067] uppercase tracking-wide mb-1.5">
                  Message Detail
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your inquiry here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#FCFAF7] border border-[#EFE9E0] rounded-xl py-3 px-4 text-xs md:text-sm text-[#2D2924] placeholder-[#A39E98] outline-none resize-none focus:border-[#CFA26B] focus:ring-1 focus:ring-[#CFA26B] transition-all"
                />
              </div>

              {submitState.status !== "idle" && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`w-full rounded-xl px-4 py-3 text-xs md:text-sm font-medium border ${submitState.status === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-red-50 border-red-200 text-red-700"
                    }`}
                >
                  {submitState.message}
                </motion.div>
              )}

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={submitting}
                className="w-full bg-[#CFA052] hover:bg-[#221f19] text-white rounded-xl py-3.5 px-4 font-semibold text-xs md:text-sm flex items-center justify-center gap-2 tracking-wide transition-colors duration-200 mt-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>{submitting ? "Submitting…" : "Submit Support Ticket"}</span>
                <Send className="w-3.5 h-3.5 fill-white" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default function ContactView() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] text-[#5c544d] overflow-x-hidden">
      <Navbar />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(207,160,82,0.04)_0%,transparent_60%)] pointer-events-none z-0 h-[700px]" />
      <Suspense
        fallback={
          <div className="text-center py-32 text-xs text-[#8a7d6a]">
            Loading Support Environment…
          </div>
        }
      >
        <ContactFormContent />
      </Suspense>
      <Footer />
    </div>
  );
}