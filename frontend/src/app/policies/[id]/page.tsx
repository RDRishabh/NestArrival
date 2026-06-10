import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

type PolicyContent = {
  title: string;
  content: string;
};

interface PolicyPageProps {
  params: Promise<{ id: string }>;
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { id } = await params;

  let page: PolicyContent | null = null;
  try {
    page = await prisma.cmsPage.findUnique({
      where: { id },
      select: {
        title: true,
        content: true,
      },
    });
  } catch (error) {
    console.error("Failed to load policy page:", error);
  }

  // Fallbacks in case database connection isn't initialized yet
  const fallbacks: Record<string, PolicyContent> = {
    terms: {
      title: "Terms & Conditions",
      content: `# Terms & Conditions
Last updated: June 1, 2026

What this means in simple terms: You pay to contact verified owners. If no owner replies, you get a refund. We verify your documents securely. We do not sell your data. You must be at least 18 years old.

## 1. Introduction
Welcome to NestArrival. By accessing our platform, you agree to comply with and be bound by these Terms & Conditions. NestArrival operates as an international platform. Users are responsible for complying with the laws of their home country and destination.

## 2. Age Requirement
You must be at least 18 years old to create an account and use NestArrival's paid services.

## 3. Verified Connection Platform
NestArrival is a verified connection platform. We connect you with property owners but are not responsible for the terms of any tenancy agreement made between you and an owner.

## 4. Refund Policy & Verification
A refund is available if none of the verified owners you contacted reply to your messages within your active subscription period.

A valid response means the verified owner replies to your message through the NestArrival chat within your active plan period. An automated reply or an out-of-office message does not count as a response.

Verification is carried out by NestArrival's internal team. All team members are trained in document handling and privacy compliance. Verification typically takes 1–3 business days.

Your passport and visa documents are used only for identity verification. They are encrypted, stored securely, and deleted after verification is complete. No documents are shared with third parties.

## 5. Cancellation
How to cancel: You can cancel your subscription at any time from your account settings. Cancellation takes effect at the end of your current billing period. You will not be charged again after cancellation.`,
    },
    privacy: {
      title: "Privacy Policy",
      content: `# Privacy Policy
Last updated: June 1, 2026

Your privacy is important to us. Your passport and visa documents are used only for identity verification. They are encrypted, stored securely, and deleted after verification is complete. No documents are shared with third parties.`,
    },
    refund: {
      title: "Refund Policy",
      content: `# Refund Policy
Last updated: June 1, 2026

A refund is available if none of the verified owners you contacted reply to your messages within your active subscription period.

A valid response means the verified owner replies to your message through the NestArrival chat within your active plan period. An automated reply or an out-of-office message does not count as a response.

All refund claims are moderated and processed within 3 business days.`,
    },
    cancellation: {
      title: "Cancellation Policy",
      content: `# Cancellation Policy
Last updated: June 1, 2026

How to cancel: You can cancel your subscription at any time from your account settings. Cancellation takes effect at the end of your current billing period. You will not be charged again after cancellation.`,
    },
    cookie: {
      title: "Cookie Policy",
      content: `# Cookie Policy
Last updated: June 1, 2026

## What Cookies We Use
We use basic and essential session cookies to manage user logins and preserve safety status. No marketing or tracking cookies are enabled for third-party platforms.

## Types of Cookies
Essential cookies are required for the platform to function correctly. They manage your login session and keep your account secure. You cannot disable essential cookies.

Analytics cookies (optional) help us understand how visitors use our site so we can improve it. These are only active if you have accepted them via our cookie consent banner.

## Managing Cookies
You can manage your cookie preferences at any time by clicking the Manage button on our cookie banner or clearing your browser cookies.`,
    },
    community: {
      title: "Community Guidelines",
      content: `# Community Guidelines
Last updated: June 1, 2026

## Our Standards
We promote safety and respect for all members of our platform. NestArrival is a trust-first community designed to help verified tenants and owners connect safely.

## Prohibited Behaviour
The following are strictly prohibited and will result in immediate platform bans without eligibility for refunds:

- Discrimination based on race, nationality, gender, religion, or any protected characteristic
- Uploading fraudulent, altered, or fake identity or visa documents
- Misrepresenting rental prices, property details, or availability
- Harassment, threats, or abuse toward other platform members

## Reporting
If you witness any violation of these guidelines, please contact our support team immediately. We review all reports within 48 hours.`,
    },
    verification: {
      title: "Verification Policy",
      content: `# Verification Policy
Last updated: June 1, 2026

Verification is carried out by NestArrival's internal team. All team members are trained in document handling and privacy compliance. Verification typically takes 1–3 business days.

Your passport and visa documents are used only for identity verification. They are encrypted, stored securely, and deleted after verification is complete. No documents are shared with third parties.`,
    },
  };

  const currentPage = page || fallbacks[id];

  if (!currentPage) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] text-[#5c544d] relative overflow-hidden">
      <Navbar />

      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(207,160,82,0.03)_0%,transparent_50%)] pointer-events-none z-0 h-[500px]" />

      <main className="flex-grow mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 w-full relative z-10">
        <article className="bg-white rounded-2xl border border-[#eae1d3] p-8 sm:p-12 shadow-lg text-xs sm:text-sm">
          <div className="flex items-center space-x-3 border-b border-[#f4efe6] pb-6 mb-8">
            <div className="rounded-xl bg-[#eae1d3] p-2.5 text-[#cfa052] border border-[#f4efe6]/50 shadow-sm">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#2c2724] font-serif italic">
                {currentPage.title}
              </h1>
              <p className="text-[9px] text-[#8a7d6a] mt-1 uppercase tracking-wider font-extrabold">
                NestArrival Official Policy Page
              </p>
            </div>
          </div>

          {id === "terms" && (
            <div className="bg-[#cfa052]/5 border border-[#cfa052]/20 rounded-2xl p-6 mb-8 text-[#5c544d] font-sans text-xs leading-relaxed shadow-sm">
              <strong className="text-[#cfa052] font-black uppercase tracking-wider block mb-1.5 text-[9px]">What this means in simple terms:</strong>
              <p className="text-[#8a7d6a] leading-normal font-medium">
                You pay to contact verified owners. If no owner replies, you get a refund. We verify your documents securely. We do not sell your data. You must be at least 18 years old.
              </p>
            </div>
          )}

          <div className="text-[#5c544d] space-y-6 leading-relaxed whitespace-pre-wrap">
            {currentPage.content.split("\n\n").map((paragraph, index) => {
              if (paragraph.startsWith("# ")) {
                return (
                  <h2 key={index} className="text-lg font-bold text-[#2c2724] mt-8 mb-4">
                    {paragraph.replace("# ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("## ")) {
                return (
                  <h3 key={index} className="text-base font-bold text-[#2c2724] mt-6 mb-2">
                    {paragraph.replace("## ", "")}
                  </h3>
                );
              }
              return (
                <p key={index} className="whitespace-pre-line text-[#5c544d]">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
