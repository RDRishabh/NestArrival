"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Upload, CheckCircle, ArrowRight, ArrowLeft, Loader2, FileText, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authApi } from "@/apis/Authentication/auth";
import { verificationApi } from "@/apis/Verification/verification";

export default function VerificationView() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Owner state
  const [residencyStatus, setResidencyStatus] = useState("Canadian Citizen");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<{ url: string; type: string }[]>([]);
  const [selectedDocType, setSelectedDocType] = useState("Passport or Driver's Licence");
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [error, setError] = useState("");

  const docTypesMap: Record<string, string[]> = {
    "Canadian Citizen": ["Passport or Driver's Licence", "Property ownership proof (Title/Tax record)", "Other ID"],
    "Permanent Resident": ["PR Card", "Driver's Licence or Provincial ID", "Property ownership proof (Title/Tax record)", "Other"],
    "Temporary Worker": ["Work Permit", "Passport", "Driver's Licence or Provincial ID", "Lease agreement or residency proof"],
    "International Student": ["Study Permit", "Passport", "Provincial ID or Driver's Licence", "Lease agreement or residency proof"],
    "Other": ["Government-issued Photo ID", "Supporting legal or residency documents"]
  };

  useEffect(() => {
    authApi.me()
      .then((res) => res.data)
      .then((data) => {
        if (!data || !data.authenticated || data.user.role !== "OWNER") {
          router.push("/login");
        } else {
          if (data.user.verificationStatus === "VERIFIED") {
            router.push("/owner/dashboard");
          } else {
            setLoading(false);
          }
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  const handleResidencyChange = (val: string) => {
    setResidencyStatus(val);
    const types = docTypesMap[val];
    if (types && types.length > 0) {
      setSelectedDocType(types[0]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingFile(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await verificationApi.upload(formData);

      if (!data) {
        setError("File upload failed");
        setUploadingFile(false);
        return;
      }

      setUploadedDocs([...uploadedDocs, { url: data.url, type: selectedDocType }]);
      setUploadingFile(false);
    } catch (err) {
      setError("Server connection failed during file upload");
      setUploadingFile(false);
    }
  };

  const handleRemoveDoc = (index: number) => {
    setUploadedDocs(uploadedDocs.filter((_, i) => i !== index));
  };

  const handleSubmitVerification = async () => {
    setError("");
    setSubmitting(true);

    const payload = {
      residencyStatus,
      documentUrls: uploadedDocs.map((d) => d.url),
      documentTypes: uploadedDocs.map((d) => d.type),
      declarationsAccepted: declarationAccepted,
    };

    try {
      const { data } = await verificationApi.submitOwner(payload);

      if (!data) {
        setError("Failed to submit request");
        setSubmitting(false);
        return;
      }

      setCurrentStep(4);
      setSubmitting(false);
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Server connection failed";
      setError(msg);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fdfbf7]">
        <Loader2 className="h-8 w-8 animate-spin text-[#cfa052]" />
      </div>
    );
  }

  const currentDocTypes = docTypesMap[residencyStatus] || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] text-[#2c2724]">
      <Navbar />

      <main className="flex-grow mx-auto max-w-xl w-full px-4 py-12 sm:px-6 relative z-10">
        {currentStep < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-semibold text-[#8a7d6a] mb-2">
              <span className="uppercase tracking-wider font-extrabold text-[9px] text-[#cfa052]">Owner Onboarding Wizard</span>
              <span>Step {currentStep} of 3</span>
            </div>
            <div className="h-1.5 w-full bg-[#eae1d3] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#cfa052] shadow-[0_4px_10px_rgba(207,160,82,0.4)] transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-300 p-3 text-xs text-red-700 font-medium">
            <span>{error}</span>
          </div>
        )}

        <div className="glass-panel p-8 rounded-2xl border border-[#eae1d3] bg-white shadow-2xl min-h-[340px] flex flex-col justify-between overflow-hidden">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="flex-grow"
            >
              {/* STEP 1: Select Residency Status */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold font-serif text-[#2c2724]">Step 1: Canadian Residency Status</h2>
                  <p className="text-xs text-[#8a7d6a]">Please choose your current status to align required documents.</p>
                  <div className="space-y-2.5 pt-2">
                    {["Canadian Citizen", "Permanent Resident", "Temporary Worker", "International Student", "Other"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleResidencyChange(status)}
                        className={`w-full text-left px-4 py-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          residencyStatus === status
                            ? "border-[#cfa052] bg-[#cfa052]/5 text-[#cfa052] shadow-sm"
                            : "border-[#eae1d3] bg-white text-[#5c544d] hover:bg-[#f4efe6]"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Upload Documents */}
              {currentStep === 2 && (
                <div className="space-y-4 text-xs">
                  <h2 className="text-lg font-bold font-serif text-[#2c2724] flex items-center space-x-2">
                    <ShieldCheck className="h-5 w-5 text-[#cfa052]" />
                    <span>Step 2: Upload Residency & Property Deeds</span>
                  </h2>
                  <p className="text-xs text-[#8a7d6a] leading-relaxed">
                    To combat rental fraud, you must upload proof of legal property ownership (land title deeds or property tax bills) and government photo ID.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-2 pt-2">
                    <div>
                      <label className="block text-[#5c544d] font-bold mb-1.5">Document Category</label>
                      <select
                        value={selectedDocType}
                        onChange={(e) => setSelectedDocType(e.target.value)}
                        className="w-full text-xs rounded-lg border border-[#eae1d3] p-2.5 bg-white text-[#2c2724] focus:outline-none focus:border-[#cfa052] cursor-pointer"
                      >
                        {currentDocTypes.map((t) => (
                          <option key={t} value={t} className="bg-white cursor-pointer">{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center justify-center w-full bg-[#cfa052] hover:bg-[#b58942] text-white transition-all rounded-lg h-[37px] font-bold cursor-pointer shadow-[0_4px_10px_rgba(207,160,82,0.3)]">
                        {uploadingFile ? (
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-1.5" />
                            <span>Upload File</span>
                          </>
                        )}
                        <input
                          type="file"
                          disabled={uploadingFile}
                          onChange={handleFileUpload}
                          className="hidden"
                          accept=".pdf,.png,.jpg,.jpeg"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Uploads list */}
                  <div className="space-y-2 pt-2 max-h-40 overflow-y-auto">
                    <span className="font-bold text-[#5c544d]">Uploaded Attachments: {uploadedDocs.length}</span>
                    {uploadedDocs.length === 0 ? (
                      <p className="text-[10px] text-[#8a7d6a] italic">No files attached yet. At least one required.</p>
                    ) : (
                      uploadedDocs.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#eae1d3]">
                          <div className="flex items-center space-x-2 text-[#5c544d]">
                            <FileText className="h-4 w-4 text-zinc-550" />
                            <span className="font-bold text-[#5c544d]">{doc.type}</span>
                            <span className="text-[10px] text-[#8a7d6a]">({doc.url.split("/").pop()?.substring(0, 15)}...)</span>
                          </div>
                          <button
                            onClick={() => handleRemoveDoc(idx)}
                            className="text-red-400 hover:text-red-300 font-bold hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Declaration */}
              {currentStep === 3 && (
                <div className="space-y-4 text-xs">
                  <h2 className="text-lg font-bold font-serif text-[#2c2724]">Step 3: Declarations Acceptance</h2>
                  <p className="text-xs text-[#8a7d6a]">Read and agree to legal terms before final submission.</p>

                  <div className="bg-white border border-[#eae1d3] rounded-xl p-4 max-h-48 overflow-y-auto leading-relaxed text-[#5c544d]">
                    <p className="font-bold text-[#cfa052] mb-1">Owner Declaration:</p>
                    <p className="mb-3">
                      I declare that I am the legal owner or authorized property manager of the listing, and that all descriptions, pricing, and pictures match the actual state of the property. I agree to keep pricing fair, transparent, and in line with municipal codes.
                    </p>
                    <p className="font-bold text-[#cfa052] mb-1">Anti-Discrimination Compliance:</p>
                    <p>
                      I agree to fully comply with Canadian Human Rights and local tenancy guidelines. I will not discriminate based on race, origin, religion, status, or age.
                    </p>
                  </div>

                  <label className="flex items-start space-x-2 mt-4 p-2 cursor-pointer text-[#5c544d]">
                    <input
                      type="checkbox"
                      checked={declarationAccepted}
                      onChange={(e) => setDeclarationAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-[#eae1d3] bg-white text-[#cfa052] focus:ring-[#cfa052] focus:ring-offset-black"
                    />
                    <span className="font-medium text-[11px] leading-relaxed">
                      I accept the Owner Declaration and verify that all uploaded ownership documents are genuine.
                    </span>
                  </label>
                </div>
              )}

              {/* STEP 4: Success Screen */}
              {currentStep === 4 && (
                <div className="space-y-6 text-center py-6 flex flex-col items-center justify-center">
                  <div className="rounded-full bg-[#cfa052]/10 p-4 text-[#cfa052] border border-[#cfa052]/20 mb-2">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h2 className="text-2xl font-bold font-serif text-[#2c2724]">Owner Verification Request Logged</h2>
                  <p className="text-xs text-[#8a7d6a] max-w-xs mx-auto leading-relaxed">
                    Thank you! Our auditing team is verifying your land deeds and government ID. You will obtain a Verification Badge once approved, enabling you to post property listings.
                  </p>
                  <button
                    onClick={() => router.push("/owner/dashboard")}
                    className="inline-flex rounded-lg bg-[#cfa052] hover:bg-[#b58942] text-white font-bold shadow-[0_4px_10px_rgba(207,160,82,0.3)] px-6 py-3 text-xs cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Navigation Panel */}
          {currentStep < 4 && (
            <div className="mt-8 flex items-center justify-between border-t border-[#eae1d3] pt-4">
              <button
                onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                disabled={currentStep === 1}
                className="inline-flex items-center space-x-1 border border-[#eae1d3] bg-white px-4 py-2 rounded-lg text-xs font-bold text-[#5c544d] hover:text-[#2c2724] disabled:opacity-40 cursor-pointer disabled:cursor-default"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={() => {
                    if (currentStep === 2 && uploadedDocs.length === 0) {
                      setError("You must upload at least one residency/ownership proof document.");
                      return;
                    }
                    setError("");
                    setCurrentStep(currentStep + 1);
                  }}
                  className="inline-flex items-center space-x-1 bg-[#cfa052] hover:bg-[#b58942] text-white transition-all px-5 py-2 rounded-lg text-xs font-bold shadow-[0_4px_10px_rgba(207,160,82,0.3)] cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitVerification}
                  disabled={!declarationAccepted || submitting}
                  className="inline-flex items-center space-x-1.5 bg-[#cfa052] hover:bg-[#b58942] text-white transition-all px-5 py-2.5 rounded-lg text-xs font-bold disabled:bg-[#eae1d3] disabled:text-[#8a7d6a] cursor-pointer disabled:cursor-default"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                      <span>Submitting Check...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>Submit Verification</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
