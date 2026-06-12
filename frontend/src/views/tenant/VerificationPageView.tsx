"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Upload, CheckCircle, ArrowRight, ArrowLeft, Loader2, FileText, Globe, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authApi } from "@/apis/Authentication/auth";
import { verificationApi } from "@/apis/Verification/verification";

export default function VerificationPageView() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Tenant state fields
  const [currentCountry, setCurrentCountry] = useState("United States");
  const [destinationCountry] = useState("Canada");
  const [currentStatus, setCurrentStatus] = useState("Work Visa Holder");
  const [visaStatus, setVisaStatus] = useState("Valid Visa Available");
  const [visaType, setVisaType] = useState("Work Visa");
  const [plannedMoveDate, setPlannedMoveDate] = useState("1–3 Months");
  const [purposeOfRelocation, setPurposeOfRelocation] = useState("Employment");
  const [expectedRentalDuration, setExpectedRentalDuration] = useState("1 Year");
  
  // Documents fields
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<{ url: string; type: string }[]>([]);
  const [selectedDocType, setSelectedDocType] = useState("Passport");

  // Declaration
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [error, setError] = useState("");

  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
    "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde",
    "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
    "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji",
    "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala",
    "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran",
    "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Korea", "Kuwait",
    "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
    "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius",
    "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal",
    "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan",
    "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Samoa", "San Marino", "Saudi Arabia", "Senegal",
    "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
    "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan",
    "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

  useEffect(() => {
    authApi.me()
      .then((res) => res.data)
      .then((data) => {
        if (!data || !data.authenticated || data.user.role !== "TENANT") {
          router.push("/login");
        } else {
          if (data.user.verificationStatus === "VERIFIED") {
            router.push("/tenant/dashboard");
          } else {
            setLoading(false);
          }
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

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
      currentCountry,
      destinationCountry,
      currentStatus,
      visaStatus,
      visaType: currentStatus.includes("Visa") || currentStatus.includes("Resident") ? visaType : "Other",
      plannedMoveDate,
      purposeOfRelocation,
      expectedRentalDuration,
      residencyStatus: currentStatus, // Backend requires this field for all verification requests
      documentUrls: uploadedDocs.map((d) => d.url),
      documentTypes: uploadedDocs.map((d) => d.type),
      declarationsAccepted: declarationAccepted,
    };

    try {
      const { data } = await verificationApi.submitTenant(payload);

      if (!data) {
        setError("Failed to submit request");
        setSubmitting(false);
        return;
      }

      setCurrentStep(11);
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

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] text-[#2c2724]">
      <Navbar />

      <main className="flex-grow mx-auto max-w-xl w-full px-4 py-12 sm:px-6 relative z-10">
        {currentStep < 11 && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-semibold text-[#8a7d6a] mb-2">
              <span className="uppercase tracking-wider font-extrabold text-[9px] text-[#cfa052]">Newcomer Relocation Wizard</span>
              <span>Step {currentStep} of 10</span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 w-full bg-[#eae1d3] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#cfa052] shadow-[0_4px_10px_rgba(207,160,82,0.4)] transition-all duration-300"
                style={{ width: `${(currentStep / 10) * 100}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-300 p-3 text-xs text-red-700 font-medium">
            <span>{error}</span>
          </div>
        )}

        <div className="glass-panel p-8 rounded-2xl border border-[#eae1d3] bg-white shadow-2xl min-h-[360px] flex flex-col justify-between overflow-hidden">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="flex-grow"
            >
              {/* STEP 1: Current Country */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold font-serif text-[#2c2724] flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-[#cfa052]" />
                    <span>Step 1: Current Country of Residence</span>
                  </h2>
                  <p className="text-xs text-[#8a7d6a] text-[#8a7d6a] leading-relaxed">Where are you currently living before your move? This helps landlords understand your relocation timeline.</p>
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-[#5c544d] mb-1.5">Select Country</label>
                    <select
                      value={currentCountry}
                      onChange={(e) => setCurrentCountry(e.target.value)}
                      className="w-full text-xs rounded-lg border border-[#eae1d3] p-3 bg-white text-[#2c2724] focus:outline-none focus:border-[#cfa052] transition-colors cursor-pointer"
                    >
                      {countries.map((c) => (
                        <option key={c} value={c} className="bg-white cursor-pointer">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 2: Destination Country */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold font-serif text-[#2c2724] flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-[#cfa052]" />
                    <span>Step 2: Relocation Destination</span>
                  </h2>
                  <p className="text-xs text-[#8a7d6a] leading-relaxed">NestArrival currently operates exclusively for newcomers moving to Canada.</p>
                  <div className="rounded-xl bg-[#cfa052]/[0.02] border border-[#cfa052]/10 p-5 mt-2">
                    <p className="text-xs text-[#cfa052] font-bold mb-1.5">Default Target Destination:</p>
                    <p className="text-base font-extrabold text-[#2c2724]">🇨🇦 Canada</p>
                    <p className="text-[10px] text-[#8a7d6a] mt-3 leading-relaxed">Future platform expansions will introduce key portals for additional target countries worldwide.</p>
                  </div>
                </div>
              )}

              {/* STEP 3: Current Status */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold font-serif text-[#2c2724]">Step 3: What is your current immigration status?</h2>
                  <p className="text-xs text-[#8a7d6a]">Choose the status that fits your upcoming relocation context.</p>
                  <div className="space-y-2.5 pt-2">
                    {["Citizen", "Permanent Resident", "Work Visa Holder", "Student Visa Holder", "Visitor", "Other"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setCurrentStatus(status)}
                        className={`w-full text-left px-4 py-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          currentStatus === status
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

              {/* STEP 4: Visa Status */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold font-serif text-[#2c2724]">Step 4: Visa Application Status</h2>
                  <p className="text-xs text-[#8a7d6a]">What is the current approval status of your travel/stay authorization?</p>
                  <div className="space-y-2.5 pt-2">
                    {["Valid Visa Available", "Visa In Process", "No Visa Yet"].map((vStatus) => (
                      <button
                        key={vStatus}
                        onClick={() => setVisaStatus(vStatus)}
                        className={`w-full text-left px-4 py-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          visaStatus === vStatus
                            ? "border-[#cfa052] bg-[#cfa052]/5 text-[#cfa052] shadow-sm"
                            : "border-[#eae1d3] bg-white text-[#5c544d] hover:bg-[#f4efe6]"
                        }`}
                      >
                        {vStatus}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: Visa Type */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold font-serif text-[#2c2724]">Step 5: Visa Classification</h2>
                  <p className="text-xs text-[#8a7d6a]">Select the specific visa class issued or requested for Canada.</p>
                  <div className="space-y-2.5 pt-2">
                    {["Work Visa", "Student Visa", "Permanent Residence", "Dependent Visa", "Tourist Visa", "Other"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setVisaType(type)}
                        className={`w-full text-left px-4 py-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          visaType === type
                            ? "border-[#cfa052] bg-[#cfa052]/5 text-[#cfa052] shadow-sm"
                            : "border-[#eae1d3] bg-white text-[#5c544d] hover:bg-[#f4efe6]"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: Planned Move Date */}
              {currentStep === 6 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold font-serif text-[#2c2724]">Step 6: Planned Move Date</h2>
                  <p className="text-xs text-[#8a7d6a]">When do you expect to land in Canada?</p>
                  <div className="space-y-2.5 pt-2">
                    {["Within 14 Days", "1–3 Months", "3–6 Months", "More Than 6 Months"].map((date) => (
                      <button
                        key={date}
                        onClick={() => setPlannedMoveDate(date)}
                        className={`w-full text-left px-4 py-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          plannedMoveDate === date
                            ? "border-[#cfa052] bg-[#cfa052]/5 text-[#cfa052] shadow-sm"
                            : "border-[#eae1d3] bg-white text-[#5c544d] hover:bg-[#f4efe6]"
                        }`}
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7: Purpose of Relocation */}
              {currentStep === 7 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold font-serif text-[#2c2724]">Step 7: Primary Purpose of Relocation</h2>
                  <p className="text-xs text-[#8a7d6a]">Why are you moving to Canada?</p>
                  <div className="space-y-2.5 pt-2">
                    {["Employment", "Studies", "Family Relocation", "Tourism", "Permanent Relocation", "Temporary Relocation"].map((purpose) => (
                      <button
                        key={purpose}
                        onClick={() => setPurposeOfRelocation(purpose)}
                        className={`w-full text-left px-4 py-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          purposeOfRelocation === purpose
                            ? "border-[#cfa052] bg-[#cfa052]/5 text-[#cfa052] shadow-sm"
                            : "border-[#eae1d3] bg-white text-[#5c544d] hover:bg-[#f4efe6]"
                        }`}
                      >
                        {purpose}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 8: Expected Rental Duration */}
              {currentStep === 8 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold font-serif text-[#2c2724]">Step 8: Expected Rental Duration</h2>
                  <p className="text-xs text-[#8a7d6a]">How long do you plan to lease a property?</p>
                  <div className="space-y-2.5 pt-2">
                    {["Short Term", "6 Months", "1 Year", "Long Term (More Than 1 Year)"].map((duration) => (
                      <button
                        key={duration}
                        onClick={() => setExpectedRentalDuration(duration)}
                        className={`w-full text-left px-4 py-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          expectedRentalDuration === duration
                            ? "border-[#cfa052] bg-[#cfa052]/5 text-[#cfa052] shadow-sm"
                            : "border-[#eae1d3] bg-white text-[#5c544d] hover:bg-[#f4efe6]"
                        }`}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 9: Upload Verification Documents */}
              {currentStep === 9 && (
                <div className="space-y-4 text-xs">
                  <h2 className="text-lg font-bold font-serif text-[#2c2724]">Step 9: Upload Supporting Identity Documents</h2>
                  <p className="text-xs text-zinc-550 text-[#8a7d6a] leading-relaxed">Upload documents to verify your identity. Landlords only see your verified badge, never raw document details.</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-2 pt-2">
                    <div>
                      <label className="block text-[#5c544d] font-bold mb-1.5">Document Category</label>
                      <select
                        value={selectedDocType}
                        onChange={(e) => setSelectedDocType(e.target.value)}
                        className="w-full text-xs rounded-lg border border-[#eae1d3] p-2.5 bg-white text-[#2c2724] focus:outline-none focus:border-[#cfa052] cursor-pointer"
                      >
                        {["Passport", "Government ID", "Visa", "Work Permit", "Study Permit", "Admission Letter", "Employment Letter"].map((t) => (
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

                  {/* List of uploaded files */}
                  <div className="space-y-2 pt-2 max-h-40 overflow-y-auto">
                    <span className="font-bold text-[#5c544d]">Uploaded Attachments: {uploadedDocs.length}</span>
                    {uploadedDocs.length === 0 ? (
                      <p className="text-[10px] text-[#8a7d6a] italic">No files attached yet. At least one required.</p>
                    ) : (
                      uploadedDocs.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#eae1d3]">
                          <div className="flex items-center space-x-2 text-[#5c544d]">
                            <FileText className="h-4 w-4 text-[#8a7d6a]" />
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

              {/* STEP 10: Legal Declaration */}
              {currentStep === 10 && (
                <div className="space-y-4 text-xs">
                  <h2 className="text-lg font-bold font-serif text-[#2c2724]">Step 10: Final Review & Acceptance</h2>
                  <p className="text-xs text-[#8a7d6a]">Please read the binding safety declarations before final submission.</p>
                  
                  <div className="bg-white border border-[#eae1d3] rounded-xl p-4 max-h-48 overflow-y-auto leading-relaxed text-[#5c544d]">
                    <p className="font-bold text-[#cfa052] mb-1">Tenant Truth Declaration:</p>
                    <p className="mb-3">
                      I hereby declare that all information, relocation details, visa documents, and letters of admission/employment provided are true and accurate. I understand that submitting fake documents will lead to legal action, forfeiture of subscriptions, and a permanent platform ban.
                    </p>
                    <p className="font-bold text-[#cfa052] mb-1">Platform Disclaimer:</p>
                    <p>
                      NestArrival acts exclusively as a connection layer. We do not manage properties, hold rental escrow funds, or guarantee tenancy. Users are advised to exercise diligence.
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
                      I accept the Tenant Declaration and verify that all uploaded files are valid.
                    </span>
                  </label>
                </div>
              )}

              {/* STEP 11: Success Screen */}
              {currentStep === 11 && (
                <div className="space-y-6 text-center py-6 flex flex-col items-center justify-center">
                  <div className="rounded-full bg-[#cfa052]/10 p-4 text-[#cfa052] border border-[#cfa052]/20 mb-2">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h2 className="text-2xl font-bold font-serif text-[#2c2724]">Verification Under Review</h2>
                  <p className="text-xs text-[#8a7d6a] max-w-xs mx-auto leading-relaxed">
                    Thank you for completing onboarding! Our administrator team is manually reviewing your documents. You will receive an status update in your dashboard shortly.
                  </p>
                  <button
                    onClick={() => router.push("/tenant/dashboard")}
                    className="inline-flex rounded-lg bg-[#cfa052] hover:bg-[#b58942] text-white font-bold shadow-[0_4px_10px_rgba(207,160,82,0.3)] px-6 py-3 text-xs cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Actions Navigator (Only before success screen) */}
          {currentStep < 11 && (
            <div className="mt-8 flex items-center justify-between border-t border-[#eae1d3] pt-4">
              <button
                onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                disabled={currentStep === 1}
                className="inline-flex items-center space-x-1 border border-[#eae1d3] bg-white px-4 py-2 rounded-lg text-xs font-bold text-[#5c544d] hover:text-[#2c2724] disabled:opacity-40 cursor-pointer disabled:cursor-default"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>

              {currentStep < 10 ? (
                <button
                  onClick={() => {
                    if (currentStep === 9 && uploadedDocs.length === 0) {
                      setError("You must upload at least one document to proceed.");
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
