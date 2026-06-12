"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, AlertCircle, ArrowRight, ArrowLeft, Eye, EyeOff, KeyRound, RefreshCw, CheckCircle } from "lucide-react";
import Logo from "@/components/Logo";
import { authApi } from "@/apis/Authentication/auth";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

// Validation helpers
const nameRegex = /^[a-zA-Z\s'-]{2,60}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter (A–Z)", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter (a–z)", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number (0–9)", test: (p: string) => /\d/.test(p) },
  { label: "One special character (!@#$…)", test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
];

export default function SignupView() {
  const router = useRouter();

  useEffect(() => {
    const cached = localStorage.getItem("nestarrival_user");
    if (cached) {
      try {
        const user = JSON.parse(cached);
        if (user.role === "ADMIN") router.push("/admin/dashboard");
        else if (user.role === "OWNER") router.push("/owner/dashboard");
        else if (user.role === "TENANT") router.push("/tenant/dashboard");
      } catch (err) {
        console.error("Failed to parse cached user in SignupView", err);
      }
    }
  }, [router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"TENANT" | "OWNER">("TENANT");
  const [step, setStep] = useState<"STEP_1" | "STEP_2" | "OTP">("STEP_1");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const validateStep1 = () => {
    setError("");
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return false;
    }
    if (!nameRegex.test(fullName.trim())) {
      setError("Name can only contain letters, spaces, hyphens, or apostrophes.");
      return false;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return false;
    }
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address (e.g. name@example.com).");
      return false;
    }
    return true;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep("STEP_2");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateStep1()) {
      setStep("STEP_1");
      return;
    }

    // Password strength check
    const failedRule = passwordRules.find((r) => !r.test(password));
    if (failedRule) {
      setError(`Password must meet all requirements: ${failedRule.label.toLowerCase()}.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.signup({ email, password, fullName, role });
      if (!data) {
        setError("Failed to register");
        setLoading(false);
        return;
      }
      console.log("OTP sent to:", email);
      setStep("OTP");
      setLoading(false);
    } catch {
      setError("Failed to connect to server");
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError("");
    setLoading(true);
    try {
      const { data } = await authApi.google({ credential: credentialResponse.credential, role });
      if (!data) {
        setError("Google signup failed");
        setLoading(false);
        return;
      }
      const userRole = data.user.role;
      localStorage.setItem("nestarrival_user", JSON.stringify(data.user));
      if (userRole === "ADMIN") router.push("/admin/dashboard");
      else if (userRole === "OWNER") router.push("/owner/dashboard");
      else router.push("/tenant/dashboard");
    } catch {
      setError("Failed to authenticate with Google");
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authApi.verifyOtp({ email, otp });
      if (!data) {
        setError("Invalid OTP code");
        setLoading(false);
        return;
      }
      const userRole = data.user.role;
      localStorage.setItem("nestarrival_user", JSON.stringify(data.user));
      if (userRole === "ADMIN") router.push("/admin/dashboard");
      else if (userRole === "OWNER") router.push("/owner/dashboard");
      else router.push("/tenant/dashboard");
    } catch {
      setError("Failed to connect to server");
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    setError("");
    try {
      await authApi.resendOtp({ email });
      console.log("OTP resent to:", email);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const allPasswordRulesPassed = passwordRules.every((r) => r.test(password));

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <div className="flex min-h-screen bg-white font-sans overflow-hidden">
        <div className="hidden lg:flex lg:w-3/5 relative bg-[#fdfbf7] items-center justify-center overflow-hidden">
          <img src="/signup_bg.jpg" alt="Relocation Housing" className="absolute inset-0 w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fdfbf7] via-[#fdfbf7]/80 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fdfbf7]/60 pointer-events-none" />
          <div className="relative z-10 w-full max-w-2xl px-12 text-[#2c2724]">
            <Link href="/" className="flex items-center space-x-2 group mb-12"><Logo className="h-12 w-12 text-[#cfa052]" /><span className="text-3xl font-black tracking-tight font-serif text-[#2c2724]">Nest<span className="text-[#cfa052]">Arrival</span></span></Link>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl font-serif font-bold leading-tight mb-6">Start your <br /><span className="text-[#cfa052] italic">journey abroad</span><br />with absolute trust.</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg font-medium text-[#5c544d] max-w-lg leading-relaxed">Whether you are an incoming tenant or a verified property owner, join the network that guarantees safety, compliance, and refund-backed confidence.</motion.p>
          </div>
        </div>
        <div className="w-full lg:w-2/5 flex flex-col justify-center px-8 sm:px-16 xl:px-24 py-12 relative z-20 bg-white shadow-[-20px_0_40px_rgba(44,39,36,0.05)] h-screen overflow-y-auto custom-scrollbar">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm mx-auto my-auto">
            <div className="lg:hidden flex items-center justify-center space-x-2 mb-10"><Logo className="h-10 w-10 text-[#cfa052]" /><span className="text-2xl font-black font-serif text-[#2c2724]">Nest<span className="text-[#cfa052]">Arrival</span></span></div>
            
            {/* Step Progress Stepper */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`h-1.5 rounded-full transition-all duration-300 ${step === "STEP_1" ? "w-8 bg-[#cfa052]" : "w-2 bg-[#eae1d3]"}`}></div>
              <div className={`h-1.5 rounded-full transition-all duration-300 ${step === "STEP_2" ? "w-8 bg-[#cfa052]" : "w-2 bg-[#eae1d3]"}`}></div>
              <div className={`h-1.5 rounded-full transition-all duration-300 ${step === "OTP" ? "w-8 bg-[#cfa052]" : "w-2 bg-[#eae1d3]"}`}></div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-serif font-bold text-[#2c2724] mb-2">
                {step === "OTP" ? "Verify Email" : step === "STEP_2" ? "Set Password" : "Create Account"}
              </h2>
              <p className="text-sm font-medium text-[#8a7d6a]">
                {step === "OTP" ? `Enter the OTP sent to ${email}` : step === "STEP_2" ? "Secure your new NestArrival account." : "Join our verified housing network today."}
              </p>
            </div>
            {error && <div className="mb-6 rounded-xl bg-red-50 border border-red-100 p-4 text-sm font-semibold text-red-600 flex items-center space-x-3"><AlertCircle className="h-5 w-5 text-red-500 shrink-0" /><span>{error}</span></div>}
            {resendSuccess && (
              <div className="mb-6 rounded-xl bg-green-50 border border-green-100 p-4 text-sm font-semibold text-green-700 flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" /><span>A new OTP has been sent to your email.</span>
              </div>
            )}
            <AnimatePresence mode="wait">
              {step === "STEP_1" && (
                <motion.div key="step-1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.25 }}>
                  <div className="flex bg-[#f4efe6] p-1 rounded-2xl mb-8">
                    <button type="button" onClick={() => setRole("TENANT")} className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${role === "TENANT" ? "bg-white text-[#2c2724] shadow-sm" : "text-[#8a7d6a] hover:text-[#2c2724]"}`}>Tenant</button>
                    <button type="button" onClick={() => setRole("OWNER")} className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${role === "OWNER" ? "bg-white text-[#2c2724] shadow-sm" : "text-[#8a7d6a] hover:text-[#2c2724]"}`}>Owner</button>
                  </div>
                  <div className="mb-6 flex justify-center"><GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google signup failed.")} theme="outline" size="large" width="384" text="signup_with" shape="pill" /></div>
                  <div className="flex items-center gap-4 mb-6"><div className="h-px bg-[#eae1d3] flex-1"></div><span className="text-xs font-bold text-[#a89e8d] uppercase tracking-wider">Or email</span><div className="h-px bg-[#eae1d3] flex-1"></div></div>
                  <form onSubmit={handleNext} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#8a7d6a] mb-1.5">Full Name</label>
                      <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#a89e8d]"><User className="h-4 w-4" /></span>
                        <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="w-full rounded-2xl pl-11 pr-4 py-3 bg-[#fdfbf7] border border-[#eae1d3] text-[#2c2724] text-sm font-semibold outline-none focus:border-[#cfa052] focus:ring-1 focus:ring-[#cfa052] transition-all" />
                      </div>
                      <p className="text-[10px] text-[#aba296] mt-1 ml-1">Only letters, spaces, hyphens, or apostrophes allowed.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#8a7d6a] mb-1.5">Email</label>
                      <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#a89e8d]"><Mail className="h-4 w-4" /></span>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full rounded-2xl pl-11 pr-4 py-3 bg-[#fdfbf7] border border-[#eae1d3] text-[#2c2724] text-sm font-semibold outline-none focus:border-[#cfa052] focus:ring-1 focus:ring-[#cfa052] transition-all" />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-[#cfa052] hover:bg-[#b58942] text-white py-3.5 rounded-2xl font-bold text-sm shadow-[0_8px_20px_rgba(207,160,82,0.3)] transition-all flex justify-center items-center gap-2 group mt-6 cursor-pointer">
                      Next Step
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                  <div className="mt-8 text-center text-sm font-medium text-[#5c544d]">Already have an account? <Link href="/login" className="text-[#cfa052] font-bold hover:underline">Sign in</Link></div>
                </motion.div>
              )}

              {step === "STEP_2" && (
                <motion.div key="step-2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.25 }}>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#8a7d6a] mb-1.5">Password</label>
                      <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#a89e8d]"><Lock className="h-4 w-4" /></span>
                        <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-2xl pl-11 pr-12 py-3 bg-[#fdfbf7] border border-[#eae1d3] text-[#2c2724] text-sm font-semibold outline-none focus:border-[#cfa052] focus:ring-1 focus:ring-[#cfa052] transition-all" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#a89e8d] hover:text-[#2c2724] transition-colors cursor-pointer">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                      </div>
                      {password.length > 0 && (
                        <ul className="mt-3 space-y-1.5 bg-[#fdfbf7] border border-[#eae1d3] rounded-xl p-3">
                          {passwordRules.map((rule) => (
                            <li key={rule.label} className={`flex items-center gap-2 text-[11px] font-medium transition-colors ${rule.test(password) ? "text-green-600" : "text-[#aba296]"}`}>
                              <CheckCircle className={`h-3.5 w-3.5 shrink-0 ${rule.test(password) ? "text-green-500" : "text-[#d4c9bc]"}`} />
                              {rule.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#8a7d6a] mb-1.5">Confirm Password</label>
                      <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#a89e8d]"><Lock className="h-4 w-4" /></span>
                        <input type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-2xl pl-11 pr-12 py-3 bg-[#fdfbf7] border border-[#eae1d3] text-[#2c2724] text-sm font-semibold outline-none focus:border-[#cfa052] focus:ring-1 focus:ring-[#cfa052] transition-all" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#a89e8d] hover:text-[#2c2724] transition-colors cursor-pointer">{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                      </div>
                      {confirmPassword.length > 0 && password !== confirmPassword && (
                        <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">Passwords do not match.</p>
                      )}
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setStep("STEP_1")} className="w-1/3 border border-[#eae1d3] hover:bg-[#fdfbf7] text-[#5c544d] py-3.5 rounded-2xl font-bold text-sm transition-all flex justify-center items-center gap-1.5 cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </button>
                      <button type="submit" disabled={loading || !allPasswordRulesPassed} className="w-2/3 bg-[#cfa052] hover:bg-[#b58942] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-2xl font-bold text-sm shadow-[0_8px_20px_rgba(207,160,82,0.3)] transition-all flex justify-center items-center gap-2 group cursor-pointer">{loading ? "Creating Account..." : "Create Account"} {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}</button>
                    </div>
                  </form>
                  <div className="mt-8 text-center text-sm font-medium text-[#5c544d]">Already have an account? <Link href="/login" className="text-[#cfa052] font-bold hover:underline">Sign in</Link></div>
                </motion.div>
              )}

              {step === "OTP" && (
                <motion.div key="otp" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.25 }}>
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#8a7d6a] mb-2">6-Digit Code</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#a89e8d]"><KeyRound className="h-4 w-4" /></span>
                        <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" className="w-full rounded-2xl pl-11 pr-4 py-3.5 bg-[#fdfbf7] border border-[#eae1d3] text-[#2c2724] text-lg font-bold tracking-[0.5em] outline-none text-center focus:border-[#cfa052] focus:ring-1 focus:ring-[#cfa052] transition-all" />
                      </div>
                      <p className="text-[11px] text-[#8a7d6a] mt-2 text-center">Check your inbox at <span className="font-bold text-[#2c2724]">{email}</span></p>
                    </div>
                    <button type="submit" disabled={loading || otp.length < 6} className="w-full bg-[#2c2724] hover:bg-[#1a1715] text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">{loading ? "Verifying..." : "Verify & Continue"}</button>
                    {/* Resend OTP */}
                    <div className="text-center pt-2">
                      <p className="text-xs text-[#8a7d6a] mb-2">Didn&apos;t receive the code?</p>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendLoading}
                        className="inline-flex items-center gap-1.5 text-[#cfa052] hover:text-[#b58942] font-bold text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${resendLoading ? "animate-spin" : ""}`} />
                        {resendLoading ? "Sending..." : "Resend OTP"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
