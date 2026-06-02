"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, User, AlertCircle, ArrowRight, ArrowLeft, Eye, EyeOff, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function SignupPage() {
  const router = useRouter();
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

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      setError("Please enter your name and email to continue.");
      return;
    }
    setError("");
    setStep("STEP_2");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to register");
        setLoading(false);
        return;
      }

      setStep("OTP");
      setLoading(false);
    } catch (err) {
      setError("Failed to connect to server");
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Google signup failed");
        setLoading(false);
        return;
      }
      
      const userRole = data.user.role;
      if (userRole === "ADMIN") router.push("/admin/dashboard");
      else if (userRole === "OWNER") router.push("/owner/dashboard");
      else router.push("/tenant/dashboard");
    } catch (err) {
      setError("Failed to authenticate with Google");
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid OTP code");
        setLoading(false);
        return;
      }

      const userRole = data.user.role;
      if (userRole === "ADMIN") router.push("/admin/dashboard");
      else if (userRole === "OWNER") router.push("/owner/dashboard");
      else router.push("/tenant/dashboard");
      
    } catch (err) {
      setError("Failed to connect to server");
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <div className="flex min-h-screen bg-white font-sans overflow-hidden">
        
        {/* Left Side: Visual Imagery (60%) */}
        <div className="hidden lg:flex lg:w-3/5 relative bg-[#fdfbf7] items-center justify-center overflow-hidden">
          {/* Video Background */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          >
            <source src="https://videos.pexels.com/video-files/3121459/3121459-uhd_2560_1440_24fps.mp4" type="video/mp4" />
          </video>
          {/* Cream Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fdfbf7] via-[#fdfbf7]/80 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fdfbf7]/60 pointer-events-none" />
          
          <div className="relative z-10 w-full max-w-2xl px-12 text-[#2c2724]">
            <Link href="/" className="flex items-center space-x-2 group mb-12">
              <ShieldCheck className="h-10 w-10 text-[#cfa052]" />
              <span className="text-3xl font-black tracking-tight font-serif text-[#2c2724]">
                Nest<span className="text-[#cfa052]">Arrival</span>
              </span>
            </Link>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl font-serif font-bold leading-tight mb-6"
            >
              Start your <br />
              <span className="text-[#cfa052] italic">Canadian Journey</span><br />
              with absolute trust.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg font-medium text-[#5c544d] max-w-lg leading-relaxed"
            >
              Whether you are an incoming tenant or a verified property owner, join the network that guarantees safety, compliance, and refund-backed confidence.
            </motion.p>
          </div>
        </div>

        {/* Right Side: Auth Form (40%) */}
        <div className="w-full lg:w-2/5 flex flex-col justify-center px-8 sm:px-16 xl:px-24 py-12 relative z-20 bg-white shadow-[-20px_0_40px_rgba(44,39,36,0.05)] h-screen overflow-y-auto custom-scrollbar">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm mx-auto my-auto"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-2 mb-10">
              <ShieldCheck className="h-8 w-8 text-[#cfa052]" />
              <span className="text-2xl font-black font-serif text-[#2c2724]">
                Nest<span className="text-[#cfa052]">Arrival</span>
              </span>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-serif font-bold text-[#2c2724] mb-2">
                {step === "OTP" ? "Verify Email" : "Create Account"}
              </h2>
              <p className="text-sm font-medium text-[#8a7d6a]">
                {step === "OTP" ? `Enter the OTP sent to ${email}` : "Join our verified housing network today."}
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-100 p-4 text-sm font-semibold text-red-600 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {step === "STEP_1" && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  
                  {/* Role Selection */}
                  <div className="flex bg-[#f4efe6] p-1 rounded-2xl mb-8">
                    <button
                      type="button"
                      onClick={() => setRole("TENANT")}
                      className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                        role === "TENANT" ? "bg-white text-[#2c2724] shadow-sm" : "text-[#8a7d6a] hover:text-[#2c2724]"
                      }`}
                    >
                      Tenant
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("OWNER")}
                      className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                        role === "OWNER" ? "bg-white text-[#2c2724] shadow-sm" : "text-[#8a7d6a] hover:text-[#2c2724]"
                      }`}
                    >
                      Owner
                    </button>
                  </div>

                  {/* Google SSO Button */}
                  <div className="mb-6 flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => setError("Google login failed.")}
                      theme="outline"
                      size="large"
                      width="384"
                      text="signup_with"
                      shape="pill"
                    />
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-[#eae1d3] flex-1"></div>
                    <span className="text-xs font-bold text-[#a89e8d] uppercase tracking-wider">Or email</span>
                    <div className="h-px bg-[#eae1d3] flex-1"></div>
                  </div>

                  <form onSubmit={handleContinue} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#8a7d6a] mb-1.5">Full Name</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#a89e8d]">
                          <User className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full rounded-2xl pl-11 pr-4 py-3 bg-[#fdfbf7] border border-[#eae1d3] text-[#2c2724] text-sm font-semibold outline-none focus:border-[#cfa052] focus:ring-1 focus:ring-[#cfa052] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#8a7d6a] mb-1.5">Email</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#a89e8d]">
                          <Mail className="h-4 w-4" />
                        </span>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full rounded-2xl pl-11 pr-4 py-3 bg-[#fdfbf7] border border-[#eae1d3] text-[#2c2724] text-sm font-semibold outline-none focus:border-[#cfa052] focus:ring-1 focus:ring-[#cfa052] transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#cfa052] hover:bg-[#b58942] text-white py-3.5 rounded-2xl font-bold text-sm shadow-[0_8px_20px_rgba(207,160,82,0.3)] transition-all flex justify-center items-center gap-2 group mt-4"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>

                  <div className="mt-8 text-center text-sm font-medium text-[#5c544d]">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#cfa052] font-bold hover:underline">
                      Sign in
                    </Link>
                  </div>
                </motion.div>
              )}

              {step === "STEP_2" && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <button 
                    onClick={() => setStep("STEP_1")}
                    className="flex items-center text-[#8a7d6a] hover:text-[#2c2724] text-sm font-bold mb-6 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to previous step
                  </button>

                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#8a7d6a] mb-1.5">Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#a89e8d]">
                          <Lock className="h-4 w-4" />
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-2xl pl-11 pr-12 py-3 bg-[#fdfbf7] border border-[#eae1d3] text-[#2c2724] text-sm font-semibold outline-none focus:border-[#cfa052] focus:ring-1 focus:ring-[#cfa052] transition-all"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#a89e8d] hover:text-[#2c2724] transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#8a7d6a] mb-1.5">Confirm Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#a89e8d]">
                          <Lock className="h-4 w-4" />
                        </span>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-2xl pl-11 pr-12 py-3 bg-[#fdfbf7] border border-[#eae1d3] text-[#2c2724] text-sm font-semibold outline-none focus:border-[#cfa052] focus:ring-1 focus:ring-[#cfa052] transition-all"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#a89e8d] hover:text-[#2c2724] transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button type="button" className="text-xs font-bold text-[#cfa052] hover:text-[#b58942] transition-colors">
                        Forgot Password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#cfa052] hover:bg-[#b58942] text-white py-3.5 rounded-2xl font-bold text-sm shadow-[0_8px_20px_rgba(207,160,82,0.3)] transition-all flex justify-center items-center gap-2 group mt-4"
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                      {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </form>
                </motion.div>
              )}

              {step === "OTP" && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#8a7d6a] mb-2">6-Digit Code</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#a89e8d]">
                          <KeyRound className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          required
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="000000"
                          className="w-full rounded-2xl pl-11 pr-4 py-3.5 bg-[#fdfbf7] border border-[#eae1d3] text-[#2c2724] text-lg font-bold tracking-[0.5em] outline-none text-center focus:border-[#cfa052] focus:ring-1 focus:ring-[#cfa052] transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otp.length < 6}
                      className="w-full bg-[#2c2724] hover:bg-[#1a1715] text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                      {loading ? "Verifying..." : "Verify & Continue"}
                    </button>
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
