"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, KeyRound, AlertCircle, ArrowRight, Eye, EyeOff, RefreshCw, CheckCircle } from "lucide-react";
import Logo from "@/components/Logo";
import { authApi } from "@/apis/Authentication/auth";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function LoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"LOGIN" | "OTP">("LOGIN");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authApi.login({ email, password });
      if (!data) {
        setError("Invalid credentials");
        setLoading(false);
        return;
      }

      if (data.isVerified === false) {
        setStep("OTP");
        setLoading(false);
        return;
      }

      const userRole = data.user.role;
      if (userRole === "ADMIN") router.push("/admin/dashboard");
      else if (userRole === "OWNER") router.push("/owner/dashboard");
      else router.push("/tenant/dashboard");
    } catch {
      setError("Failed to connect to server");
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError("");
    setLoading(true);
    try {
      const { data } = await authApi.google({ credential: credentialResponse.credential, role: "TENANT" });
      if (!data) {
        setError("Google login failed");
        setLoading(false);
        return;
      }

      const userRole = data.user.role;
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

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <div className="flex min-h-screen bg-white font-sans overflow-hidden">
        <div className="hidden lg:flex lg:w-3/5 relative bg-[#fdfbf7] items-center justify-center overflow-hidden">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50">
            <source src="https://videos.pexels.com/video-files/3121459/3121459-uhd_2560_1440_24fps.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[#fdfbf7] via-[#fdfbf7]/80 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fdfbf7]/60 pointer-events-none" />
          <div className="relative z-10 w-full max-w-2xl px-12 text-[#2c2724]">
            <Link href="/" className="flex items-center space-x-2 group mb-12">
              <Logo className="h-12 w-12 text-[#cfa052]" />
              <span className="text-3xl font-black tracking-tight font-serif text-[#2c2724]">
                Nest<span className="text-[#cfa052]">Arrival</span>
              </span>
            </Link>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl font-serif font-bold leading-tight mb-6">
              Secure your <br />
              <span className="text-[#cfa052] italic">journey abroad</span><br />
              before you arrive.
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg font-medium text-[#5c544d] max-w-lg leading-relaxed">
              Join thousands of newcomers who trust our verified, scam-free housing network to find their perfect home with absolute peace of mind.
            </motion.p>
          </div>
        </div>

        <div className="w-full lg:w-2/5 flex flex-col justify-center px-8 sm:px-16 xl:px-24 py-12 relative z-20 bg-white shadow-[-20px_0_40px_rgba(44,39,36,0.05)]">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm mx-auto">
            <div className="lg:hidden flex items-center justify-center space-x-2 mb-10">
              <Logo className="h-10 w-10 text-[#cfa052]" />
              <span className="text-2xl font-black font-serif text-[#2c2724]">
                Nest<span className="text-[#cfa052]">Arrival</span>
              </span>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-serif font-bold text-[#2c2724] mb-2">
                {step === "LOGIN" ? "Welcome Back" : "Activate Account"}
              </h2>
              <p className="text-sm font-medium text-[#8a7d6a]">
                {step === "LOGIN" ? "Please enter your details to sign in." : `Enter the OTP sent to ${email}`}
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-100 p-4 text-sm font-semibold text-red-600 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {resendSuccess && (
              <div className="mb-6 rounded-xl bg-green-50 border border-green-100 p-4 text-sm font-semibold text-green-700 flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" /><span>A new OTP has been sent to your email.</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {step === "LOGIN" ? (
                <motion.div key="login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="mb-6 flex justify-center">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google login failed.")} theme="outline" size="large" width="384" text="continue_with" shape="pill" />
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-[#eae1d3] flex-1"></div>
                    <span className="text-xs font-bold text-[#a89e8d] uppercase tracking-wider">Or email</span>
                    <div className="h-px bg-[#eae1d3] flex-1"></div>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#8a7d6a] mb-2">Email</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#a89e8d]"><Mail className="h-4 w-4" /></span>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full rounded-2xl pl-11 pr-4 py-3.5 bg-[#fdfbf7] border border-[#eae1d3] text-[#2c2724] text-sm font-semibold outline-none focus:border-[#cfa052] focus:ring-1 focus:ring-[#cfa052] transition-all placeholder-[#a89e8d]" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#8a7d6a] mb-2">Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#a89e8d]"><Lock className="h-4 w-4" /></span>
                        <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-2xl pl-11 pr-12 py-3.5 bg-[#fdfbf7] border border-[#eae1d3] text-[#2c2724] text-sm font-semibold outline-none focus:border-[#cfa052] focus:ring-1 focus:ring-[#cfa052] transition-all" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#a89e8d] hover:text-[#2c2724] transition-colors cursor-pointer">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <div className="flex justify-end mt-2">
                        <button type="button" className="text-xs font-bold text-[#cfa052] hover:text-[#b58942] transition-colors cursor-pointer">Forgot Password?</button>
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-[#cfa052] hover:bg-[#b58942] text-white py-3.5 rounded-2xl font-bold text-sm shadow-[0_8px_20px_rgba(207,160,82,0.3)] transition-all flex justify-center items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                      {loading ? "Signing in..." : "Sign In"}
                      {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </form>

                  <div className="mt-8 text-center text-sm font-medium text-[#5c544d]">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-[#cfa052] font-bold hover:underline">
                      Sign up
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#8a7d6a] mb-2">6-Digit Code</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#a89e8d]"><KeyRound className="h-4 w-4" /></span>
                        <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" className="w-full rounded-2xl pl-11 pr-4 py-3.5 bg-[#fdfbf7] border border-[#eae1d3] text-[#2c2724] text-lg font-bold tracking-[0.5em] outline-none text-center focus:border-[#cfa052] focus:ring-1 focus:ring-[#cfa052] transition-all" />
                      </div>
                      <p className="text-[11px] text-[#8a7d6a] mt-2 text-center">Check your inbox at <span className="font-bold text-[#2c2724]">{email}</span></p>
                    </div>

                    <button type="submit" disabled={loading || otp.length < 6} className="w-full bg-[#2c2724] hover:bg-[#1a1715] text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                      {loading ? "Verifying..." : "Verify & Continue"}
                    </button>

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
