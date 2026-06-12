"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { authApi } from "@/apis/Authentication/auth";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    authApi.me()
      .then((res) => res.data)
      .then((data) => {
        if (data && data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    const res = await authApi.logout();
    if (res.status >= 200 && res.status < 300) {
      setUser(null);
      router.push("/");
    }
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "ADMIN") return "/admin/dashboard";
    if (user.role === "OWNER") return "/owner/dashboard";
    return "/tenant/dashboard";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#eae1d3]/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 text-[#2c2724] group">
          <Logo className="h-8 w-8 text-[#2c2724] transition-transform duration-300 group-hover:scale-110" />
          <span className="text-xl font-bold tracking-tight">
            Nest<span className="text-[#2c2724] transition-all duration-300">Arrival</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-[#8a7d6a]">
          <Link href="/about" className="hover:text-[#cfa052] transition-colors">About Us</Link>
          <Link href="/pricing" className="hover:text-[#cfa052] transition-colors">Pricing</Link>
          <Link href="/contact" className="hover:text-[#cfa052] transition-colors">Contact US</Link>
          
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded bg-[#eae1d3]/60" />
          ) : user ? (
            <div className="flex items-center space-x-4">
              <Link
                href={getDashboardLink()}
                className="inline-flex items-center space-x-1.5 rounded-lg bg-[#cfa052] px-4 h-9 text-[11px] font-bold text-white hover:bg-[#2c2724] transition-all shadow-[0_4px_12px_rgba(207,160,82,0.15)] hover:shadow-[0_4px_20px_rgba(207,160,82,0.25)]"
              >
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center space-x-1 rounded-lg border border-[#eae1d3] bg-transparent px-3 h-9 text-[11px] font-bold text-[#5c544d] hover:text-[#cfa052] hover:border-slate-300 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="px-3 py-1.5 text-[#5c544d] hover:text-[#cfa052] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-[#cfa052] px-4 py-2 text-xs font-bold text-white hover:bg-[#2c2724] transition-all hover:shadow-[0_4px_15px_rgba(207,160,82,0.2)]"
              >
                Join NestArrival
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#8a7d6a] hover:text-[#cfa052] focus:outline-none"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#eae1d3] bg-white/95 backdrop-blur-xl px-4 py-6 space-y-4 text-xs font-semibold">
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#5c544d] hover:text-[#cfa052] py-1 transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#5c544d] hover:text-[#cfa052] py-1 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#5c544d] hover:text-[#cfa052] py-1 transition-colors"
          >
            Contact US
          </Link>
          
          <hr className="border-[#f4efe6]" />
          
          {loading ? (
            <div className="h-8 w-full animate-pulse rounded bg-[#eae1d3]/50" />
          ) : user ? (
            <div className="space-y-2">
              <Link
                href={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center rounded-lg bg-[#cfa052] py-2.5 text-white font-bold hover:bg-[#2c2724]"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-center rounded-lg border border-[#eae1d3] bg-transparent py-2.5 text-[#5c544d] font-bold hover:border-slate-300 flex items-center justify-center space-x-1.5"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center rounded-lg border border-[#eae1d3] py-2.5 text-[#5c544d] font-bold hover:bg-[#fdfbf7]"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center rounded-lg bg-[#cfa052] py-2.5 text-white font-bold hover:bg-[#2c2724]"
              >
                Join NestArrival
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
