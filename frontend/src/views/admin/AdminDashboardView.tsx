"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart3, ShieldCheck, Home, FileText, DollarSign,
  AlertTriangle, Check, X, Loader2, RefreshCw, Eye, Edit3, TrendingUp, Users, LogOut, Menu, Ban
} from "lucide-react";
import {
  ResponsiveContainer, LabelList, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell
} from "recharts";

import { motion, AnimatePresence } from "framer-motion";
import { authApi } from "@/apis/Authentication/auth";
import { adminApi } from "@/apis/Admin/admin";
import Logo from "@/components/Logo";

export default function AdminDashboardView() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [activeTab, setActiveTab] = useState<"analytics" | "verifications" | "listings" | "refunds" | "cms" | "users" | "subscriptions">("analytics");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [verificationsShowHistory, setVerificationsShowHistory] = useState(false);
  const [subscriptionsQueue, setSubscriptionsQueue] = useState<any[]>([]);
  const [loadingSubscriptionsQueue, setLoadingSubscriptionsQueue] = useState(false);
  const [subscriptionsShowHistory, setSubscriptionsShowHistory] = useState(false);
  const [listingsShowHistory, setListingsShowHistory] = useState(false);
  const [usersData, setUsersData] = useState<{ tenants: any[]; owners: any[] }>({ tenants: [], owners: [] });
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersSearch, setUsersSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [banReasonInput, setBanReasonInput] = useState("");
  const [processingBan, setProcessingBan] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loadingVerifications, setLoadingVerifications] = useState(false);
  const [listingsQueue, setListingsQueue] = useState<any[]>([]);
  const [loadingListingsQueue, setLoadingListingsQueue] = useState(false);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loadingRefunds, setLoadingRefunds] = useState(false);
  const [cmsPages, setCmsPages] = useState<any[]>([]);
  const [loadingCms, setLoadingCms] = useState(false);
  const [selectedCmsPage, setSelectedCmsPage] = useState<any>(null);
  const [cmsTitle, setCmsTitle] = useState("");
  const [cmsContent, setCmsContent] = useState("");
  const [actionNotes, setActionNotes] = useState<Record<string, string>>({});
  const [actionFeedback, setActionFeedback] = useState<Record<string, string>>({});
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const cached = localStorage.getItem("nestarrival_user");
    if (cached) {
      try {
        const userObj = JSON.parse(cached);
        if (userObj.role === "ADMIN") {
          setCurrentUser(userObj);
          setLoadingUser(false);
        }
      } catch (err) {
        console.error("Failed to parse cached user", err);
      }
    }
    fetchSession();
  }, []);

  // Auto-load data when user is authenticated and tab changes
  useEffect(() => {
    if (currentUser) {
      loadTabData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentUser]);

  useEffect(() => {
    if (selectedUser) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [selectedUser]);

  const fetchSession = async () => {
    try {
      const { data } = await authApi.me();
      if (!data || !data.authenticated || data.user.role !== "ADMIN") {
        localStorage.removeItem("nestarrival_user");
        router.push("/login");
      } else {
        setCurrentUser(data.user);
        localStorage.setItem("nestarrival_user", JSON.stringify(data.user));
      }
    } catch (e) {
      localStorage.removeItem("nestarrival_user");
      router.push("/login");
    } finally {
      setLoadingUser(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("nestarrival_user");
    const res = await authApi.logout();
    if (res.status >= 200 && res.status < 300) {
      router.push("/");
    }
  };

  const loadTabData = () => {
    if (activeTab === "analytics") fetchAnalytics();
    if (activeTab === "verifications") fetchVerifications();
    if (activeTab === "listings") fetchListingsQueue();
    if (activeTab === "refunds") fetchRefunds();
    if (activeTab === "cms") fetchCmsPages();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "subscriptions") fetchSubscriptionsQueue();
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const { data } = await adminApi.analytics();
      setAnalytics(data);
    } catch (e) {
      console.error("Analytics fetch error:", e);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchVerifications = async () => {
    setLoadingVerifications(true);
    try {
      const { data } = await adminApi.verifications();
      // Backend returns { total, page, limit, verifications: [...] }
      setVerifications(Array.isArray(data?.verifications) ? data.verifications : []);
    } catch (e) {
      console.error("Verifications fetch error:", e);
    } finally {
      setLoadingVerifications(false);
    }
  };

  const fetchListingsQueue = async () => {
    setLoadingListingsQueue(true);
    try {
      const { data } = await adminApi.listings();
      // Backend returns { total, page, limit, listings: [...] }
      setListingsQueue(Array.isArray(data?.listings) ? data.listings : []);
    } catch (e) {
      console.error("Listings fetch error:", e);
    } finally {
      setLoadingListingsQueue(false);
    }
  };

  const fetchRefunds = async () => {
    setLoadingRefunds(true);
    try {
      const { data } = await adminApi.refundList();
      // Backend returns { total, page, limit, refundRequests: [...] }
      setRefunds(Array.isArray(data?.refundRequests) ? data.refundRequests : []);
    } catch (e) {
      console.error("Refunds fetch error:", e);
    } finally {
      setLoadingRefunds(false);
    }
    setListingsQueue(listingsData);
  } catch (e) {
    console.error(e);
    setListingsQueue([]); 
  } finally {
    setLoadingListingsQueue(false);
  }
};

 
  const fetchCmsPages = async () => {
    setLoadingCms(true);
    try {
      const { data } = await adminApi.cmsList();
      setCmsPages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("CMS fetch error:", e);
    } finally {
      setLoadingCms(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await adminApi.users();
      // Backend returns { total, page, limit, tenants: [...], owners: [...] }
      setUsersData({
        tenants: Array.isArray(data?.tenants) ? data.tenants : [],
        owners: Array.isArray(data?.owners) ? data.owners : [],
      });
    } catch (e) {
      console.error("Users fetch error:", e);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleToggleBan = async (userId: string, currentBanState: boolean) => {
    setProcessingBan(userId);
    try {
      const { data: result } = await adminApi.banUser({
        userId,
        action: currentBanState ? "UNBAN" : "BAN",
        reason: currentBanState ? "" : banReasonInput || "Violation of Community Guidelines",
      });

      if (result) {
        await fetchUsers();
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser((prev: any) => ({
            ...prev,
            isBanned: result.isBanned,
            banReason: result.banReason,
          }));
        }
        setBanReasonInput("");
      }
    } catch (e) {
      console.error("Ban toggle error:", e);
    } finally {
      setProcessingBan(null);
    }
  };

  const handleActionVerification = async (userId: string, action: "APPROVE" | "REJECT") => {
    setProcessingAction(userId);
    try {
      const { data } = await adminApi.verificationAction({
        userId,
        action,
        notes: actionNotes[userId] || "",
      });

      if (data) {
        setActionNotes((prev) => {
          const next = { ...prev };
          delete next[userId];
          return next;
        });
        fetchVerifications();
      }
    } catch (e) {
      console.error("Verification action error:", e);
    } finally {
      setProcessingAction(null);
    }
  };

  const handleModerateListing = async (listingId: string, action: "APPROVE" | "REJECT") => {
    setProcessingAction(listingId);
    try {
      const { data } = await adminApi.moderateListing({
        listingId,
        action,
        feedback: actionFeedback[listingId] || "",
      });

      if (data) {
        setActionFeedback((prev) => {
          const next = { ...prev };
          delete next[listingId];
          return next;
        });
        fetchListingsQueue();
      }
    } catch (e) {
      console.error("Listing moderation error:", e);
    } finally {
      setProcessingAction(null);
    }
  };

  const handleModerateRefund = async (refundRequestId: string, action: "APPROVE" | "REJECT") => {
    setProcessingAction(refundRequestId);
    try {
      const { data } = await adminApi.refundModerate({
        refundRequestId,
        action,
        notes: "Refund processed via Admin Console.",
      });

      if (data) {
        fetchRefunds();
      }
    } catch (e) {
      console.error("Refund moderation error:", e);
    }
  };

  const fetchSubscriptionsQueue = async () => {
    setLoadingSubscriptionsQueue(true);
    try {
      const { data } = await adminApi.subscriptions();
      setSubscriptionsQueue(Array.isArray(data?.subscriptions) ? data.subscriptions : []);
    } catch (e) {
      console.error("Subscriptions fetch error:", e);
    } finally {
      setLoadingSubscriptionsQueue(false);
    }
  };

  const handleModerateSubscription = async (subscriptionId: string, action: "APPROVE" | "REJECT") => {
    setProcessingAction(subscriptionId);
    try {
      const { data } = await adminApi.moderateSubscription({
        subscriptionId,
        action,
      });

      if (data) {
        fetchSubscriptionsQueue();
      }
    } catch (e) {
      console.error("Subscription moderation error:", e);
    } finally {
      setProcessingAction(null);
    }
  };

  const handleSelectCmsPage = (page: any) => {
    setSelectedCmsPage(page);
    setCmsTitle(page.title);
    setCmsContent(page.content);
  };

  const handleUpdateCmsPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCmsPage) return;

    setLoadingCms(true);
    try {
      const { data } = await adminApi.cmsUpdate({
        id: selectedCmsPage.id,
        title: cmsTitle,
        content: cmsContent,
      });

      if (data) {
        setSelectedCmsPage(null);
        fetchCmsPages();
      }
    } catch (e) {
      console.error("CMS update error:", e);
    } finally {
      setLoadingCms(false);
    }
  };

  if (loadingUser || !currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-8 w-8 animate-spin text-[#cfa052]" />
      </div>
    );
  }

  // Derived timeline datasets for Recharts graphs
  const getRevenueData = () => {
    if (!analytics) return [];
    const total = analytics.totalRevenue || 0;
    return [
      { name: "Jan", amount: Math.round(total * 0.15) },
      { name: "Feb", amount: Math.round(total * 0.35) },
      { name: "Mar", amount: Math.round(total * 0.50) },
      { name: "Apr", amount: Math.round(total * 0.65) },
      { name: "May", amount: Math.round(total * 0.80) },
      { name: "Jun", amount: total },
    ];
  };

  const getRegistrationsData = () => {
    if (!analytics) return [];
    return [
      { name: "Tenants", count: analytics.totalTenants || 0, color: "#cfa052" },
      { name: "Owners", count: analytics.totalOwners || 0, color: "#2c2724" },
    ];
  };

  // ── Sidebar nav item helper ──────────────────────────────────────────────
  const navItem = (
    tab: typeof activeTab,
    Icon: any,
    label: string,
  ) => (
    <button
      onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); }}
      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === tab
        ? "bg-[#cfa052]/10 text-[#cfa052] border-l-2 border-[#cfa052]"
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-[#1e293b]">

      {/* ── Desktop Sidebar ──────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-white border-r border-slate-200 z-30 p-6 justify-between shadow-sm">
        <div className="space-y-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <Logo className="h-6 w-6 text-[#cfa052] transition-transform duration-300 group-hover:scale-110" />
            <span className="text-lg font-bold tracking-tight text-[#2c2724] font-serif">
              Nest<span className="text-[#cfa052]">Arrival</span>
            </span>
          </Link>

          <div className="space-y-1">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block px-2.5 mb-2">ADMIN CONSOLE</span>
            {navItem("analytics", BarChart3, "Analytics Dashboard")}
            {navItem("verifications", ShieldCheck, "Verification Queue")}
            {navItem("listings", Home, "Listing Moderation")}
            {navItem("subscriptions", DollarSign, "Subscription Queue")}
            {navItem("refunds", DollarSign, "Refund Claims")}
            {navItem("cms", FileText, "CMS Editor")}
            {navItem("users", Users, "Users Directory")}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="px-2">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">System Profile</span>
            <p className="text-xs font-bold text-slate-800 truncate">{currentUser?.fullName || "Admin"}</p>
            <p className="text-[10px] text-slate-500 truncate">{currentUser?.email || "admin@nestarrival.ca"}</p>
            <p className="text-[9px] text-[#cfa052] font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>System Administrator</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Header ────────────────────────────────────────────────── */}
      <header className="md:hidden flex items-center justify-between w-full h-16 fixed top-0 left-0 bg-white border-b border-slate-200 z-30 px-4 shadow-sm">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="h-5 w-5 text-[#cfa052]" />
          <span className="text-base font-bold tracking-tight text-[#2c2724] font-serif">
            Nest<span className="text-[#cfa052]">Arrival</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 md:hidden bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="w-64 h-full bg-white border-r border-slate-200 p-6 flex flex-col justify-between shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-8 pt-16">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block px-2.5 mb-2">ADMIN CONSOLE</span>
                <div className="space-y-1">
                  {navItem("analytics", BarChart3, "Analytics")}
                  {navItem("verifications", ShieldCheck, "Verifications")}
                  {navItem("listings", Home, "Moderation")}
                  {navItem("subscriptions", DollarSign, "Subscriptions")}
                  {navItem("refunds", DollarSign, "Refund Claims")}
                  {navItem("cms", FileText, "CMS Editor")}
                  {navItem("users", Users, "Users Directory")}
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="px-2">
                  <p className="text-xs font-bold text-slate-800 truncate">{currentUser?.fullName || "Admin"}</p>
                  <p className="text-[10px] text-slate-500 truncate">{currentUser?.email}</p>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center space-x-2 px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="flex-grow md:pl-64 flex flex-col min-h-screen pt-16 md:pt-0">
        <main className="flex-grow p-6 md:p-10">

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Administration Console</h1>
            <button
              onClick={loadTabData}
              className="p-2.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <RefreshCw className="h-4 w-4 text-[#cfa052]" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >

              {/* ── TAB: Analytics ──────────────────────────────────────── */}
              {activeTab === "analytics" && (
                <div className="space-y-8 text-xs">
                  {loadingAnalytics ? (
                    <div className="flex justify-center py-16">
                      <Loader2 className="h-8 w-8 animate-spin text-[#cfa052]" />
                    </div>
                  ) : analytics ? (
                    <>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Simulated Revenue</span>
                            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">CAD ${analytics.totalRevenue}</p>
                          </div>
                          <div className="bg-[#cfa052]/10 text-[#cfa052] border border-[#cfa052]/20 rounded-xl p-3">
                            <DollarSign className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Registered Tenants</span>
                            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{analytics.totalTenants}</p>
                          </div>
                          <div className="bg-slate-100 border border-slate-200 text-slate-600 rounded-xl p-3">
                            <Users className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Registered Owners</span>
                            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{analytics.totalOwners}</p>
                          </div>
                          <div className="bg-slate-100 border border-slate-200 text-slate-600 rounded-xl p-3">
                            <ShieldCheck className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Verification Backlog</span>
                            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{analytics.totalVerificationsPending ?? 0}</p>
                          </div>
                          <div className="bg-amber-50 text-amber-600 border border-amber-200 rounded-xl p-3">
                            <AlertTriangle className="h-5 w-5" />
                          </div>
                        </div>
                      </div>

                      {mounted && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                              <div>
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                  <TrendingUp className="h-4 w-4 text-[#cfa052]" />
                                  <span>Revenue Accumulation (Simulated)</span>
                                </h3>
                                <p className="text-[10px] text-slate-400 mt-0.5">Timeline performance trend over calendar period</p>
                              </div>
                              <span className="text-[10px] font-bold text-[#cfa052] font-mono">TOTAL: CAD ${analytics.totalRevenue}</span>
                            </div>
                            <div className="h-[250px] w-full text-[10px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={getRevenueData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                  <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#cfa052" stopOpacity={0.2} />
                                      <stop offset="95%" stopColor="#cfa052" stopOpacity={0} />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                  <XAxis dataKey="name" stroke="#94a3b8" />
                                  <YAxis stroke="#94a3b8" />
                                  <Tooltip
                                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#1e293b", fontSize: "11px" }}
                                    labelStyle={{ color: "#cfa052", fontWeight: "bold", marginBottom: "4px" }}
                                    itemStyle={{ color: "#1e293b" }}
                                  />
                                  <Area type="monotone" dataKey="amount" stroke="#cfa052" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                              <div>
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                  <Users className="h-4 w-4 text-[#cfa052]" />
                                  <span>Platform Registrants</span>
                                </h3>
                                <p className="text-[10px] text-slate-400 mt-0.5">Tenants vs Owners registered</p>
                              </div>
                              <span className="text-[10px] font-bold text-slate-700 font-mono">TOTAL: {(analytics.totalTenants || 0) + (analytics.totalOwners || 0)}</span>
                            </div>
                            <div className="h-[250px] w-full text-[10px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={getRegistrationsData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                  <XAxis dataKey="name" stroke="#94a3b8" />
                                  <YAxis stroke="#94a3b8" />
                                  <Tooltip
                                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#1e293b", fontSize: "11px" }}
                                    labelStyle={{ color: "#cfa052", fontWeight: "bold", marginBottom: "4px" }}
                                    itemStyle={{ color: "#1e293b" }}
                                  />
                                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={50}>
                                    <LabelList dataKey="count" position="top" fill="#475569" fontSize={10} />
                                    {getRegistrationsData().map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-16 bg-white border border-slate-200 rounded-xl text-slate-400 italic">
                      No analytics data available.
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB: Verification Queue ──────────────────────────────── */}
              {activeTab === "verifications" && (
                <div className="space-y-6 text-xs text-slate-600">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <h2 className="text-base font-bold text-slate-900">Identity Auditing Queue</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setVerificationsShowHistory(false)}
                        className={`px-3 py-1.5 font-bold transition-all text-xs rounded-lg cursor-pointer ${!verificationsShowHistory ? "bg-[#cfa052] text-white" : "bg-white text-slate-500 hover:text-slate-900 border border-slate-200"}`}
                      >
                        Pending Audit
                      </button>
                      <button
                        onClick={() => setVerificationsShowHistory(true)}
                        className={`px-3 py-1.5 font-bold transition-all text-xs rounded-lg cursor-pointer ${verificationsShowHistory ? "bg-[#cfa052] text-white" : "bg-white text-slate-500 hover:text-slate-900 border border-slate-200"}`}
                      >
                        Vetting History
                      </button>
                    </div>
                  </div>

                  {loadingVerifications ? (
                    <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#cfa052]" /></div>
                  ) : verifications.filter(req =>
                    verificationsShowHistory
                      ? (req.user?.verificationStatus === "VERIFIED" || req.user?.verificationStatus === "REJECTED")
                      : req.user?.verificationStatus === "PENDING_VERIFICATION"
                  ).length === 0 ? (
                    <div className="text-center py-16 bg-white border border-slate-200 rounded-xl italic text-slate-400">
                      No matching verification applications found in queue.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {verifications
                        .filter(req =>
                          verificationsShowHistory
                            ? (req.user?.verificationStatus === "VERIFIED" || req.user?.verificationStatus === "REJECTED")
                            : req.user?.verificationStatus === "PENDING_VERIFICATION"
                        )
                        .map((req) => (
                          <div key={req.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div>
                                <span className="font-bold text-sm text-slate-900">{req.user?.fullName}</span>
                                <span className="text-slate-400 ml-2">({req.user?.email ?? "—"})</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded-lg font-bold uppercase text-[10px] ${req.user?.role === "TENANT"
                                ? "bg-[#cfa052]/10 border border-[#cfa052]/20 text-[#cfa052]"
                                : "bg-slate-100 border border-slate-200 text-slate-700"
                                }`}>
                                {req.user?.role}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="space-y-2.5">
                                <p><strong className="text-slate-400 uppercase text-[9px] tracking-wider">Residency status:</strong> {req.residencyStatus}</p>
                                <p><strong className="text-slate-400 uppercase text-[9px] tracking-wider">Declarations accepted:</strong> {req.declarationsAccepted ? "Yes" : "No"}</p>
                                <div className="space-y-1.5 pt-1">
                                  <span className="font-bold text-slate-600">Uploaded Documents:</span>
                                  <div className="space-y-1">
                                    {req.documentUrls?.map((url: string, index: number) => (
                                      <a
                                        key={index}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-[#cfa052] font-bold hover:underline"
                                      >
                                        📄 Open Document {index + 1} ({req.documentTypes?.[index] || "Attachment"})
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {req.user?.verificationStatus === "PENDING_VERIFICATION" ? (
                                <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                                  <div>
                                    <label className="block text-slate-500 font-bold mb-1.5">Auditor Notes</label>
                                    <input
                                      type="text"
                                      placeholder="Add rejection reason or approval comment..."
                                      value={actionNotes[req.userId] || ""}
                                      onChange={(e) => setActionNotes({ ...actionNotes, [req.userId]: e.target.value })}
                                      className="w-full rounded-lg px-3 py-2.5 border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-[#cfa052]"
                                    />
                                  </div>
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => handleActionVerification(req.userId, "REJECT")}
                                      disabled={processingAction === req.userId}
                                      className="rounded-lg border border-red-200 bg-red-50 text-red-600 px-4 py-2 font-bold hover:bg-red-100 transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                      <span>Reject</span>
                                    </button>
                                    <button
                                      onClick={() => handleActionVerification(req.userId, "APPROVE")}
                                      disabled={processingAction === req.userId}
                                      className="rounded-lg bg-[#cfa052] text-white px-4 py-2 font-bold hover:bg-[#b8903f] transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                      <span>Approve</span>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 p-6 rounded-xl space-y-2 text-center">
                                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${req.user?.verificationStatus === "VERIFIED"
                                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                                    : "bg-red-50 border border-red-200 text-red-600"
                                    }`}>
                                    Status: {req.user?.verificationStatus}
                                  </span>
                                  {req.adminNotes && (
                                    <p className="text-slate-400 italic mt-1 max-w-xs text-[10px]">Notes: {req.adminNotes}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB: Listing Moderation ──────────────────────────────── */}
              {activeTab === "listings" && (
                <div className="space-y-6 text-xs text-slate-600">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <h2 className="text-base font-bold text-slate-900">Listings Moderation Queue</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setListingsShowHistory(false)}
                        className={`px-3 py-1.5 font-bold transition-all text-xs rounded-lg cursor-pointer ${!listingsShowHistory ? "bg-[#cfa052] text-white" : "bg-white text-slate-500 hover:text-slate-900 border border-slate-200"}`}
                      >
                        Pending Reviews
                      </button>
                      <button
                        onClick={() => setListingsShowHistory(true)}
                        className={`px-3 py-1.5 font-bold transition-all text-xs rounded-lg cursor-pointer ${listingsShowHistory ? "bg-[#cfa052] text-white" : "bg-white text-slate-500 hover:text-slate-900 border border-slate-200"}`}
                      >
                        Moderation History
                      </button>
                    </div>
                  </div>

                  {loadingListingsQueue ? (
                    <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#cfa052]" /></div>
                  ) : listingsQueue.filter(item =>
                    listingsShowHistory
                      ? (item.status === "APPROVED" || item.status === "REJECTED")
                      : item.status === "PENDING_REVIEW"
                  ).length === 0 ? (
                    <div className="text-center py-16 bg-white border border-slate-200 rounded-xl italic text-slate-400">
                      No listings found in this category.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {listingsQueue
                        .filter(item =>
                          listingsShowHistory
                            ? (item.status === "APPROVED" || item.status === "REJECTED")
                            : item.status === "PENDING_REVIEW"
                        )
                        .map((item) => (
                          <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div>
                                <span className="font-bold text-sm text-slate-900">{item.title}</span>
                                <span className="text-slate-400 ml-2">(City: {item.city})</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded-lg font-bold uppercase text-[10px] ${item.status === "APPROVED"
                                ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                                : item.status === "PENDING_REVIEW"
                                  ? "bg-amber-50 border border-amber-200 text-amber-700"
                                  : "bg-red-50 border border-red-200 text-red-600"
                                }`}>
                                {item.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="space-y-2.5">
                                <p><strong className="text-slate-400 uppercase text-[9px] tracking-wider">Owner:</strong> {item.owner?.fullName || "Owner"}</p>
                                <p><strong className="text-slate-400 uppercase text-[9px] tracking-wider">Rent:</strong> CAD ${item.rent} / month</p>
                                <p><strong className="text-slate-400 uppercase text-[9px] tracking-wider">Address:</strong> {item.location}</p>
                                <p><strong className="text-slate-400 uppercase text-[9px] tracking-wider">Specs:</strong> {item.bedrooms} Bed, {item.bathrooms} Bath</p>
                                {item.description && <p className="text-slate-500 text-[10px] leading-relaxed">{item.description}</p>}
                              </div>

                              {item.status === "PENDING_REVIEW" && (
                                <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between">
                                  <div>
                                    <label className="block text-slate-500 font-bold mb-1.5">Feedback Comments</label>
                                    <input
                                      type="text"
                                      placeholder="Reason for rejection or special notice..."
                                      value={actionFeedback[item.id] || ""}
                                      onChange={(e) => setActionFeedback({ ...actionFeedback, [item.id]: e.target.value })}
                                      className="w-full rounded-lg px-3 py-2.5 border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-[#cfa052]"
                                    />
                                  </div>
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => handleModerateListing(item.id, "REJECT")}
                                      disabled={processingAction === item.id}
                                      className="rounded-lg border border-red-200 bg-red-50 text-red-600 px-4 py-2.5 font-bold hover:bg-red-100 transition-colors cursor-pointer"
                                    >
                                      Reject Listing
                                    </button>
                                    <button
                                      onClick={() => handleModerateListing(item.id, "APPROVE")}
                                      disabled={processingAction === item.id}
                                      className="rounded-lg bg-[#cfa052] text-white px-4 py-2.5 font-bold hover:bg-[#b8903f] transition-colors cursor-pointer"
                                    >
                                      Approve Listing
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB: Refund Claims ───────────────────────────────────── */}
              {activeTab === "refunds" && (
                <div className="space-y-6 text-xs text-slate-600">
                  <h2 className="text-base font-bold text-slate-900">Refund Claims Queue</h2>

                  {loadingRefunds ? (
                    <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#cfa052]" /></div>
                  ) : refunds.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-slate-200 rounded-xl italic text-slate-400">
                      No active refund claims in queue.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {refunds.map((req) => (
                        <div key={req.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                              <span className="font-bold text-sm text-slate-900">{req.user?.fullName}</span>
                              <span className="text-slate-400 ml-2">({req.user?.email ?? "—"})</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-lg font-bold uppercase text-[10px] ${req.status === "APPROVED"
                              ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                              : req.status === "PENDING"
                                ? "bg-amber-50 border border-amber-200 text-amber-700"
                                : "bg-red-50 border border-red-200 text-red-600"
                              }`}>
                              {req.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <p><strong className="text-slate-400 uppercase text-[9px] tracking-wider">Plan:</strong> {req.subscription?.name} (CAD ${req.subscription?.price})</p>
                              <p><strong className="text-slate-400 uppercase text-[9px] tracking-wider">Reason:</strong> "{req.reason}"</p>

                              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                                <span className="font-bold text-slate-700 block text-[10px] uppercase tracking-wider">System Auto-Audit:</span>
                                <div className="space-y-1.5 text-[11px] text-slate-500">
                                  <p>- Landlord contacts made: <strong>{req.analytics?.approachesMade}</strong></p>
                                  <p>- Owner replies received: <strong>{req.analytics?.ownerRepliesReceived}</strong></p>
                                  <div className="mt-2 flex items-center space-x-2">
                                    <span>Auto Eligibility:</span>
                                    <span className={`font-bold uppercase px-2 py-0.5 rounded text-[10px] ${req.analytics?.isEligible
                                      ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                                      : "text-red-600 bg-red-50 border border-red-200"
                                      }`}>
                                      {req.analytics?.isEligible ? "ELIGIBLE" : "INELIGIBLE"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {req.status === "PENDING" && (
                              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-center gap-3">
                                <p className="text-[11px] text-slate-400 italic text-center leading-relaxed">
                                  Approving will deactivate subscription and flag as refunded.
                                </p>
                                <div className="flex gap-2 justify-end mt-2">
                                  <button
                                    onClick={() => handleModerateRefund(req.id, "REJECT")}
                                    disabled={processingAction === req.id}
                                    className="rounded-lg border border-red-200 bg-red-50 text-red-600 px-4 py-2 font-bold hover:bg-red-100 transition-colors cursor-pointer text-xs"
                                  >
                                    Deny Refund
                                  </button>
                                  <button
                                    onClick={() => handleModerateRefund(req.id, "APPROVE")}
                                    disabled={processingAction === req.id}
                                    className="rounded-lg bg-[#cfa052] text-white px-4 py-2 font-bold hover:bg-[#b8903f] transition-colors cursor-pointer text-xs"
                                  >
                                    Approve Refund
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB: CMS Editor ──────────────────────────────────────── */}
              {activeTab === "cms" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs h-[500px]">
                  <div className="md:col-span-1 border border-slate-200 bg-white rounded-xl overflow-y-auto shadow-sm">
                    <div className="p-4 border-b border-slate-200 font-bold text-slate-900 text-sm">Legal Documents</div>
                    <div className="divide-y divide-slate-100">
                      {cmsPages.map((page) => (
                        <button
                          key={page.id}
                          onClick={() => handleSelectCmsPage(page)}
                          className={`w-full text-left p-4 flex flex-col gap-1 transition-all cursor-pointer ${selectedCmsPage?.id === page.id
                            ? "bg-[#cfa052]/5 border-l-2 border-[#cfa052] text-[#cfa052]"
                            : "hover:bg-slate-50 text-slate-600"
                            }`}
                        >
                          <span className="font-bold text-slate-800">{page.title}</span>
                          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">ID: {page.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2 border border-slate-200 bg-white rounded-xl flex flex-col justify-between overflow-hidden shadow-sm">
                    {selectedCmsPage ? (
                      <form onSubmit={handleUpdateCmsPage} className="flex flex-col justify-between h-full">
                        <div className="p-4 border-b border-slate-200 bg-slate-50">
                          <span className="font-bold text-slate-900 text-sm">Edit CMS Page</span>
                        </div>
                        <div className="flex-grow p-4 space-y-4 flex flex-col justify-between">
                          <div>
                            <label className="block text-slate-500 font-bold mb-1.5">Document Title</label>
                            <input
                              type="text"
                              required
                              value={cmsTitle}
                              onChange={(e) => setCmsTitle(e.target.value)}
                              className="w-full rounded-lg px-3 py-2.5 border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-[#cfa052]"
                            />
                          </div>
                          <div className="flex-grow flex flex-col pt-2">
                            <label className="block text-slate-500 font-bold mb-1.5">Content (Markdown / Text)</label>
                            <textarea
                              required
                              rows={12}
                              value={cmsContent}
                              onChange={(e) => setCmsContent(e.target.value)}
                              className="flex-grow w-full rounded-lg px-3 py-2.5 border border-slate-200 bg-white text-slate-900 resize-none font-mono text-[11px] leading-relaxed focus:outline-none focus:border-[#cfa052]"
                            />
                          </div>
                        </div>
                        <div className="p-3 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
                          <button
                            type="button"
                            onClick={() => setSelectedCmsPage(null)}
                            className="rounded-lg border border-slate-200 px-4 py-2 font-bold hover:bg-slate-100 cursor-pointer text-slate-500 hover:text-slate-900"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={loadingCms}
                            className="rounded-lg bg-[#cfa052] text-white px-5 py-2 text-xs font-bold hover:bg-[#b8903f] cursor-pointer"
                          >
                            {loadingCms ? "Saving..." : "Save Legal Page"}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex-grow flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                        <Edit3 className="h-8 w-8 mb-2 text-slate-300" />
                        <p>Select a legal document from the sidebar to edit its content.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── TAB: Users Directory ─────────────────────────────────── */}
              {activeTab === "users" && (
                <div className="space-y-6 text-xs text-slate-600">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <h2 className="text-base font-bold text-slate-900">Users Directory</h2>
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={usersSearch}
                      onChange={(e) => setUsersSearch(e.target.value)}
                      className="rounded-lg px-3 py-1.5 border border-slate-200 bg-white text-slate-900 text-xs w-64 focus:outline-none focus:border-[#cfa052]"
                    />
                  </div>

                  {loadingUsers ? (
                    <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#cfa052]" /></div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Tenants */}
                      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                          <span>Tenants ({usersData.tenants.length})</span>
                          <span className="text-[10px] text-slate-400 font-normal">Registered Tenants</span>
                        </h3>
                        <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                          {usersData.tenants
                            .filter(u =>
                              u.fullName?.toLowerCase().includes(usersSearch.toLowerCase()) ||
                              u.email?.toLowerCase().includes(usersSearch.toLowerCase())
                            )
                            .map((u) => (
                              <div
                                key={u.id}
                                onClick={() => setSelectedUser(u)}
                                className="p-3 bg-slate-50 border border-slate-200 hover:border-[#cfa052]/50 hover:bg-white transition-all rounded-lg flex items-center justify-between cursor-pointer"
                              >
                                <div className="space-y-0.5">
                                  <p className="font-bold text-slate-900">{u.fullName}</p>
                                  <p className="text-[10px] text-slate-400">{u.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {u.isBanned && (
                                    <span className="bg-red-50 border border-red-200 text-red-600 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase">Banned</span>
                                  )}
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${u.verificationStatus === "VERIFIED"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : u.verificationStatus === "PENDING_VERIFICATION"
                                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                                      : "bg-slate-100 text-slate-500 border border-slate-200"
                                    }`}>
                                    {u.verificationStatus ?? "UNVERIFIED"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          {usersData.tenants.length === 0 && (
                            <p className="text-center py-6 text-slate-400 italic">No tenants registered yet.</p>
                          )}
                        </div>
                      </div>

                      {/* Owners */}
                      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                          <span>Property Owners ({usersData.owners.length})</span>
                          <span className="text-[10px] text-slate-400 font-normal">Registered Landlords</span>
                        </h3>
                        <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                          {usersData.owners
                            .filter(u =>
                              u.fullName?.toLowerCase().includes(usersSearch.toLowerCase()) ||
                              u.email?.toLowerCase().includes(usersSearch.toLowerCase())
                            )
                            .map((u) => (
                              <div
                                key={u.id}
                                onClick={() => setSelectedUser(u)}
                                className="p-3 bg-slate-50 border border-slate-200 hover:border-[#cfa052]/50 hover:bg-white transition-all rounded-lg flex items-center justify-between cursor-pointer"
                              >
                                <div className="space-y-0.5">
                                  <p className="font-bold text-slate-900">{u.fullName}</p>
                                  <p className="text-[10px] text-slate-400">{u.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {u.isBanned && (
                                    <span className="bg-red-50 border border-red-200 text-red-600 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase">Banned</span>
                                  )}
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${u.verificationStatus === "VERIFIED"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : u.verificationStatus === "PENDING_VERIFICATION"
                                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                                      : "bg-slate-100 text-slate-500 border border-slate-200"
                                    }`}>
                                    {u.verificationStatus ?? "UNVERIFIED"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          {usersData.owners.length === 0 && (
                            <p className="text-center py-6 text-slate-400 italic">No owners registered yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB: Subscription Queue ─────────────────────────────── */}
              {activeTab === "subscriptions" && (
                <div className="space-y-6 text-xs text-slate-600">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <h2 className="text-base font-bold text-slate-900">Subscription Queue</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSubscriptionsShowHistory(false)}
                        className={`px-3 py-1.5 font-bold transition-all text-xs rounded-lg cursor-pointer ${!subscriptionsShowHistory ? "bg-[#cfa052] text-white" : "bg-white text-slate-500 hover:text-slate-900 border border-slate-200"}`}
                      >
                        Pending Requests
                      </button>
                      <button
                        onClick={() => setSubscriptionsShowHistory(true)}
                        className={`px-3 py-1.5 font-bold transition-all text-xs rounded-lg cursor-pointer ${subscriptionsShowHistory ? "bg-[#cfa052] text-white" : "bg-white text-slate-500 hover:text-slate-900 border border-slate-200"}`}
                      >
                        Vetting History
                      </button>
                    </div>
                  </div>

                  {loadingSubscriptionsQueue ? (
                    <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#cfa052]" /></div>
                  ) : subscriptionsQueue.filter(sub =>
                    subscriptionsShowHistory
                      ? (sub.status === "APPROVED" || sub.status === "REJECTED")
                      : sub.status === "PENDING"
                  ).length === 0 ? (
                    <div className="text-center py-16 bg-white border border-slate-200 rounded-xl italic text-slate-400">
                      No subscriptions found in this category.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {subscriptionsQueue
                        .filter(sub =>
                          subscriptionsShowHistory
                            ? (sub.status === "APPROVED" || sub.status === "REJECTED")
                            : sub.status === "PENDING"
                        )
                        .map((sub) => (
                          <div key={sub.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div>
                                <span className="font-bold text-sm text-slate-900">{sub.user?.fullName}</span>
                                <span className="text-slate-400 ml-2">({sub.user?.email ?? "—"})</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded-lg font-bold uppercase text-[10px] ${sub.status === "APPROVED"
                                ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                                : sub.status === "PENDING"
                                  ? "bg-amber-50 border border-amber-200 text-amber-700"
                                  : "bg-red-50 border border-red-200 text-red-600"
                                }`}>
                                {sub.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="space-y-2.5">
                                <p><strong className="text-slate-400 uppercase text-[9px] tracking-wider">Plan Name:</strong> {sub.name}</p>
                                <p><strong className="text-slate-400 uppercase text-[9px] tracking-wider">Price Charged:</strong> CAD ${sub.price}</p>
                                <p><strong className="text-slate-400 uppercase text-[9px] tracking-wider">Plan Duration:</strong> {sub.durationDays} days</p>
                                <p><strong className="text-slate-400 uppercase text-[9px] tracking-wider">Approaches Allowed:</strong> {sub.approachesAllowed === -1 ? "Unlimited" : sub.approachesAllowed}</p>
                                <p><strong className="text-slate-400 uppercase text-[9px] tracking-wider">Requested At:</strong> {new Date(sub.createdAt).toLocaleDateString()}</p>
                              </div>

                              {sub.status === "PENDING" ? (
                                <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between">
                                  <div>
                                    <p className="font-semibold text-slate-700">Billing Action Required</p>
                                    <p className="text-slate-400 text-[10px] leading-relaxed mt-1">Please confirm that you have received payment from this user before approving their subscription.</p>
                                  </div>
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => handleModerateSubscription(sub.id, "REJECT")}
                                      disabled={processingAction === sub.id}
                                      className="rounded-lg border border-red-200 bg-red-50 text-red-600 px-4 py-2 font-bold hover:bg-red-100 transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                      <span>Reject</span>
                                    </button>
                                    <button
                                      onClick={() => handleModerateSubscription(sub.id, "APPROVE")}
                                      disabled={processingAction === sub.id}
                                      className="rounded-lg bg-[#cfa052] text-white px-4 py-2 font-bold hover:bg-[#b8903f] transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                      <span>Approve</span>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 p-6 rounded-xl space-y-2 text-center">
                                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${sub.status === "APPROVED"
                                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                                    : "bg-red-50 border border-red-200 text-red-600"
                                    }`}>
                                    Result: {sub.status}
                                  </span>
                                  <p className="text-slate-400 text-[10px] max-w-xs">Processed subscription request.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* ── User Admin Modal ──────────────────────────────────────────── */}
          {selectedUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm text-xs">
              <div className="w-full max-w-lg rounded-2xl border border-slate-200 p-6 bg-white shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">User Administration Card</h2>
                    <p className="text-[10px] text-slate-400">Managing profile: {selectedUser.fullName}</p>
                  </div>
                  <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-900 cursor-pointer">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">FULL NAME</span>
                    <p className="font-bold text-slate-800">{selectedUser.fullName}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">EMAIL</span>
                    <p className="font-bold text-slate-800">{selectedUser.email}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">ROLE</span>
                    <p className="font-bold text-[#cfa052]">{selectedUser.role}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">VETTING STATUS</span>
                    <p className="font-bold text-slate-800">{selectedUser.verificationStatus ?? "—"}</p>
                  </div>
                </div>

                {selectedUser.role === "TENANT" && (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                    <span className="font-bold text-slate-700 block border-b border-slate-200 pb-1 text-[10px] uppercase tracking-wider">Immigration & Housing Preferences</span>
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block">Current Country</span>
                        <span className="text-slate-700">{selectedUser.currentCountry || "Not Provided"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block">Planned Move Date</span>
                        <span className="text-slate-700">{selectedUser.plannedMoveDate || "Not Provided"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block">Visa / Permit Status</span>
                        <span className="text-slate-700">{selectedUser.visaStatus || "Not Provided"} ({selectedUser.visaType || "N/A"})</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block">Rental Expectation</span>
                        <span className="text-slate-700">{selectedUser.expectedRentalDuration || "Not Provided"}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-4">
                  <span className="font-bold text-red-600 block text-[10px] uppercase tracking-wider">Emergency Suspension Control</span>

                  {selectedUser.isBanned ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-white border border-red-200 rounded-lg text-slate-600 italic text-[11px]">
                        <strong>Suspension Notice:</strong> "{selectedUser.banReason || "Violation of safety standards."}"
                      </div>
                      <button
                        onClick={() => handleToggleBan(selectedUser.id, true)}
                        disabled={processingBan === selectedUser.id}
                        className="w-full rounded-lg bg-emerald-600 text-white font-bold py-2.5 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                      >
                        {processingBan === selectedUser.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            <span>Restore Profile (Unban)</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-slate-600 font-bold mb-1.5">Suspension Reason</label>
                        <input
                          type="text"
                          placeholder="Reason for suspension (visible to user)..."
                          value={banReasonInput}
                          onChange={(e) => setBanReasonInput(e.target.value)}
                          className="w-full rounded-lg px-3 py-2.5 border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-red-400"
                        />
                        {(!banReasonInput || banReasonInput.trim().length < 4) && (
                          <p className="text-[10px] text-red-500 mt-1">Please enter a reason (min 4 characters).</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleToggleBan(selectedUser.id, false)}
                        disabled={processingBan === selectedUser.id || banReasonInput.trim().length < 4}
                        className="w-full rounded-lg bg-red-600 text-white font-bold py-2.5 hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingBan === selectedUser.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Ban className="h-4 w-4" />
                            <span>Suspend Access (Ban Account)</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="rounded-lg border border-slate-200 px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 cursor-pointer hover:text-slate-900"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
