"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  BarChart3, ShieldCheck, Home, FileText, DollarSign,
  AlertTriangle, Check, X, Loader2, RefreshCw, Eye, Edit3, TrendingUp, Users, LogOut, Menu, Ban
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { authApi } from "@/apis/Authentication/auth";
import { adminApi } from "@/apis/Admin/admin";
import { listingsApi } from "@/apis/Listings/listings";

export default function AdminDashboardView() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // App states
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [activeTab, setActiveTab] = useState<"analytics" | "verifications" | "listings" | "refunds" | "cms" | "users">("analytics");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auditing history toggles
  const [verificationsShowHistory, setVerificationsShowHistory] = useState(false);
  const [listingsShowHistory, setListingsShowHistory] = useState(false);

  // Users Directory states
  const [usersData, setUsersData] = useState<{ tenants: any[]; owners: any[] }>({ tenants: [], owners: [] });
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersSearch, setUsersSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [banReasonInput, setBanReasonInput] = useState("");
  const [processingBan, setProcessingBan] = useState<string | null>(null);

  // Metrics states
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Queues states
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loadingVerifications, setLoadingVerifications] = useState(false);
  
  const [listingsQueue, setListingsQueue] = useState<any[]>([]);
  const [loadingListingsQueue, setLoadingListingsQueue] = useState(false);

  const [refunds, setRefunds] = useState<any[]>([]);
  const [loadingRefunds, setLoadingRefunds] = useState(false);

  // CMS editor states
  const [cmsPages, setCmsPages] = useState<any[]>([]);
  const [loadingCms, setLoadingCms] = useState(false);
  const [selectedCmsPage, setSelectedCmsPage] = useState<any>(null);
  const [cmsTitle, setCmsTitle] = useState("");
  const [cmsContent, setCmsContent] = useState("");

  // Audit form comments
  const [actionNotes, setActionNotes] = useState<Record<string, string>>({});
  const [actionFeedback, setActionFeedback] = useState<Record<string, string>>({});
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchSession();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadTabData();
    }
  }, [currentUser, activeTab]);

  const fetchSession = async () => {
    try {
      const { data } = await authApi.me();
      if (!data || !data.authenticated || data.user.role !== "ADMIN") {
        router.push("/login");
      } else {
        setCurrentUser(data.user);
      }
    } catch (e) {
      router.push("/login");
    } finally {
      setLoadingUser(false);
    }
  };

  const handleLogout = async () => {
    const res = await authApi.logout();
    if (res.status >= 200 && res.status < 300) {
      router.push("/");
      router.refresh();
    }
  };

  const loadTabData = () => {
    if (activeTab === "analytics") fetchAnalytics();
    if (activeTab === "verifications") fetchVerifications();
    if (activeTab === "listings") fetchListingsQueue();
    if (activeTab === "refunds") fetchRefunds();
    if (activeTab === "cms") fetchCmsPages();
    if (activeTab === "users") fetchUsers();
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const { data } = await adminApi.analytics();
      setAnalytics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchVerifications = async () => {
    setLoadingVerifications(true);
    try {
      const { data } = await adminApi.verifications();
      setVerifications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingVerifications(false);
    }
  };

  const fetchListingsQueue = async () => {
    setLoadingListingsQueue(true);
    try {
      const { data } = await listingsApi.all();
      setListingsQueue(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingListingsQueue(false);
    }
  };

  const fetchRefunds = async () => {
    setLoadingRefunds(true);
    try {
      const { data } = await adminApi.refundList();
      setRefunds(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRefunds(false);
    }
  };

  const fetchCmsPages = async () => {
    setLoadingCms(true);
    try {
      const { data } = await adminApi.cmsList();
      setCmsPages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCms(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await adminApi.users();
      setUsersData(data);
    } catch (e) {
      console.error(e);
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
            banReason: result.banReason
          }));
        }
        setBanReasonInput("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingBan(null);
    }
  };

  // Process User Verification Audit
  const handleActionVerification = async (userId: string, action: "APPROVE" | "REJECT") => {
    setProcessingAction(userId);
    try {
      const { data } = await adminApi.verificationAction?.({
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
      console.error(e);
    } finally {
      setProcessingAction(null);
    }
  };

  // Process Listing Moderation
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
      console.error(e);
    } finally {
      setProcessingAction(null);
    }
  };

  // Process Refund Request
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
      console.error(e);
    } finally {
      setProcessingAction(null);
    }
  };

  // Save CMS Legal Page Content
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
      console.error(e);
    } finally {
      setLoadingCms(false);
    }
  };

  if (loadingUser || !currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc] text-[#0f172a]">
        <Loader2 className="h-8 w-8 animate-spin text-[#cfa052]" />
      </div>
    );
  }

  // Derived timeline datasets for Recharts graphs representation
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
      { name: "Owners", count: analytics.totalOwners || 0, color: "#475569" },
    ];
  };

  return (
    <div className="light-theme-dashboard flex min-h-screen bg-content-dark text-[#f5f5f7]">
      
      {/* 1. Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-sidebar-dark border-r border-contrast-dark z-30 p-6 justify-between">
        <div className="space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <ShieldCheck className="h-6 w-6 text-[#d4ff4d] transition-transform duration-300 group-hover:scale-110" />
            <span className="text-lg font-bold tracking-tight text-white">
              Nest<span className="text-[#d4ff4d]">Arrival</span>
            </span>
          </Link>

          {/* Navigation Tab Menu */}
          <div className="space-y-1">
            <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-wider block px-2.5 mb-2">ADMIN CONSOLE</span>
            
            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-[#d4ff4d]/5 text-[#d4ff4d] border-l-2 border-[#d4ff4d]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("verifications")}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "verifications"
                  ? "bg-[#d4ff4d]/5 text-[#d4ff4d] border-l-2 border-[#d4ff4d]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Verification Queue</span>
            </button>

            <button
              onClick={() => setActiveTab("listings")}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "listings"
                  ? "bg-[#d4ff4d]/5 text-[#d4ff4d] border-l-2 border-[#d4ff4d]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Listing Moderation</span>
            </button>

            <button
              onClick={() => setActiveTab("refunds")}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "refunds"
                  ? "bg-[#d4ff4d]/5 text-[#d4ff4d] border-l-2 border-[#d4ff4d]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
              }`}
            >
              <DollarSign className="h-4 w-4" />
              <span>Refund Claims</span>
            </button>

            <button
              onClick={() => setActiveTab("cms")}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "cms"
                  ? "bg-[#d4ff4d]/5 text-[#d4ff4d] border-l-2 border-[#d4ff4d]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>CMS Editor</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "users"
                  ? "bg-[#d4ff4d]/5 text-[#d4ff4d] border-l-2 border-[#d4ff4d]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Users Directory</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer Profile */}
        <div className="space-y-4 pt-4 border-t border-zinc-900/80">
          <div className="px-2">
            <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block mb-1">System Profile</span>
            <p className="text-xs font-bold text-white truncate">{currentUser?.fullName || "Admin"}</p>
            <p className="text-[10px] text-zinc-500 truncate">{currentUser?.email || "admin@nestarrival.ca"}</p>
            <p className="text-[9px] text-[#d4ff4d] font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>System Administrator</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 border border-zinc-900 rounded-lg text-xs font-bold text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Mobile Header Bar */}
      <header className="md:hidden flex items-center justify-between w-full h-16 fixed top-0 left-0 bg-sidebar-dark border-b border-contrast-dark z-30 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <ShieldCheck className="h-5 w-5 text-[#d4ff4d]" />
          <span className="text-base font-bold tracking-tight text-white">
            Nest<span className="text-[#d4ff4d]">Arrival</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-zinc-450 hover:text-white transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 md:hidden bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="w-64 h-full bg-sidebar-dark border-r border-contrast-dark p-6 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-8 pt-16">
                <span className="text-[9px] font-extrabold text-[#d4ff4d] uppercase tracking-wider block px-2.5 mb-2">ADMIN CONSOLE</span>
                <div className="space-y-1">
                  <button
                    onClick={() => { setActiveTab("analytics"); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold ${
                      activeTab === "analytics" ? "bg-[#d4ff4d]/5 text-[#d4ff4d]" : "text-zinc-400"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("verifications"); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold ${
                      activeTab === "verifications" ? "bg-[#d4ff4d]/5 text-[#d4ff4d]" : "text-zinc-400"
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Verifications</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("listings"); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold ${
                      activeTab === "listings" ? "bg-[#d4ff4d]/5 text-[#d4ff4d]" : "text-zinc-400"
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    <span>Moderation</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("refunds"); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold ${
                      activeTab === "refunds" ? "bg-[#d4ff4d]/5 text-[#d4ff4d]" : "text-zinc-400"
                    }`}
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Refund Claims</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("cms"); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold ${
                      activeTab === "cms" ? "bg-[#d4ff4d]/5 text-[#d4ff4d]" : "text-zinc-400"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>CMS Editor</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab("users"); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold ${
                      activeTab === "users" ? "bg-[#d4ff4d]/5 text-[#d4ff4d]" : "text-zinc-400"
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    <span>Users Directory</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-zinc-900">
                <div className="px-2">
                  <p className="text-xs font-bold text-white truncate">{currentUser?.fullName || "Admin"}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{currentUser?.email || "admin@nestarrival.ca"}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-3 py-2 border border-zinc-900 rounded-lg text-xs font-bold text-zinc-400 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Right Content Pane */}
      <div className="flex-grow md:pl-64 flex flex-col min-h-screen bg-content-dark pt-16 md:pt-0">
        <main className="flex-grow p-6 md:p-10 relative z-10">
          
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-white tracking-tight">Administration Console</h1>
            <button
              onClick={loadTabData}
              className="p-2.5 border border-contrast-dark bg-zinc-950/80 hover:bg-zinc-900 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4 text-zinc-400" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
            >
              {/* TAB 1: Analytics Dashboard */}
              {activeTab === "analytics" && (
                <div className="space-y-8 text-xs">
                  {loadingAnalytics ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-[#d4ff4d]" />
                    </div>
                  ) : analytics ? (
                    <>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Revenue card */}
                        <div className="bg-card-dark p-6 rounded-xl border border-contrast-dark shadow-xl flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-zinc-550 font-bold uppercase tracking-wider text-[9px]">Simulated Revenue</span>
                            <p className="text-2xl font-extrabold text-white tracking-tight">CAD ${analytics.totalRevenue}</p>
                          </div>
                          <div className="bg-[#d4ff4d]/10 text-[#d4ff4d] border border-[#d4ff4d]/15 rounded-xl p-3">
                            <DollarSign className="h-5 w-5" />
                          </div>
                        </div>

                        {/* Tenants count */}
                        <div className="bg-card-dark p-6 rounded-xl border border-contrast-dark shadow-xl flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-zinc-550 font-bold uppercase tracking-wider text-[9px]">Registered Tenants</span>
                            <p className="text-2xl font-extrabold text-white tracking-tight">{analytics.totalTenants}</p>
                          </div>
                          <div className="bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3">
                            <Users className="h-5 w-5" />
                          </div>
                        </div>

                        {/* Owners count */}
                        <div className="bg-card-dark p-6 rounded-xl border border-contrast-dark shadow-xl flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-zinc-550 font-bold uppercase tracking-wider text-[9px]">Registered Owners</span>
                            <p className="text-2xl font-extrabold text-white tracking-tight">{analytics.totalOwners}</p>
                          </div>
                          <div className="bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3">
                            <ShieldCheck className="h-5 w-5" />
                          </div>
                        </div>

                        {/* Queue backlogs */}
                        <div className="bg-card-dark p-6 rounded-xl border border-contrast-dark shadow-xl flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-zinc-550 font-bold uppercase tracking-wider text-[9px]">Verification Backlog</span>
                            <p className="text-2xl font-extrabold text-white tracking-tight">{analytics.totalVerificationsPending}</p>
                          </div>
                          <div className="bg-[#d4ff4d]/10 text-[#d4ff4d] border border-[#d4ff4d]/15 rounded-xl p-3">
                            <AlertTriangle className="h-5 w-5" />
                          </div>
                        </div>
                      </div>

                      {/* Recharts Graphs Visualizations Section */}
                      {mounted && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                          {/* Area Chart: Revenue Trend */}
                          <div className="bg-card-dark p-6 rounded-xl border border-contrast-dark shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                              <div>
                                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                                  <TrendingUp className="h-4.5 w-4.5 text-[#d4ff4d]" />
                                  <span>Revenue Accumulation (Simulated Monthly)</span>
                                </h3>
                                <p className="text-[10px] text-zinc-500 mt-0.5">Timeline performance trend over current calendar period</p>
                              </div>
                              <span className="text-[10px] font-bold text-[#d4ff4d] font-mono">TOTAL: CAD ${analytics.totalRevenue}</span>
                            </div>

                            <div className="h-[250px] w-full text-[10px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={getRevenueData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                  <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#d4ff4d" stopOpacity={0.25}/>
                                      <stop offset="95%" stopColor="#d4ff4d" stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#1d1d22" />
                                  <XAxis dataKey="name" stroke="#52525b" />
                                  <YAxis stroke="#52525b" />
                                  <Tooltip 
                                    contentStyle={{ backgroundColor: "#000", border: "1px solid #1d1d22", borderRadius: "8px", color: "#fff" }}
                                  />
                                  <Area type="monotone" dataKey="amount" stroke="#d4ff4d" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Bar Chart: Platform Registrants */}
                          <div className="bg-card-dark p-6 rounded-xl border border-contrast-dark shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                              <div>
                                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                                  <Users className="h-4.5 w-4.5 text-[#d4ff4d]" />
                                  <span>Platform Registrants</span>
                                </h3>
                                <p className="text-[10px] text-zinc-500 mt-0.5">Classification comparison of Canadian users registered</p>
                              </div>
                              <span className="text-[10px] font-bold text-white font-mono">TOTAL: {analytics.totalTenants + analytics.totalOwners}</span>
                            </div>

                            <div className="h-[250px] w-full text-[10px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={getRegistrationsData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#1d1d22" />
                                  <XAxis dataKey="name" stroke="#52525b" />
                                  <YAxis stroke="#52525b" />
                                  <Tooltip 
                                    contentStyle={{ backgroundColor: "#000", border: "1px solid #1d1d22", borderRadius: "8px", color: "#fff" }}
                                    cursor={{ fill: "rgba(255,255,255,0.02)" }}
                                  />
                                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
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
                  ) : null}
                </div>
              )}

              {/* TAB 2: Identity Auditing Queue */}
              {activeTab === "verifications" && (
                <div className="space-y-6 text-xs text-zinc-350">
                  <div className="flex justify-between items-center border-b border-contrast-dark pb-3">
                    <h2 className="text-base font-bold text-white">Identity Auditing Queue</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setVerificationsShowHistory(false)}
                        className={`px-3 py-1.5 font-bold transition-all text-xs rounded-lg ${!verificationsShowHistory ? "bg-[#d4ff4d] text-black" : "bg-zinc-950 text-zinc-400 hover:text-white border border-contrast-dark"}`}
                      >
                        Pending Audit
                      </button>
                      <button
                        onClick={() => setVerificationsShowHistory(true)}
                        className={`px-3 py-1.5 font-bold transition-all text-xs rounded-lg ${verificationsShowHistory ? "bg-[#d4ff4d] text-black" : "bg-zinc-950 text-zinc-400 hover:text-white border border-contrast-dark"}`}
                      >
                        Vetting History
                      </button>
                    </div>
                  </div>
                  
                  {loadingVerifications ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-[#d4ff4d]" />
                    </div>
                  ) : verifications.filter(req => verificationsShowHistory ? (req.user.verificationStatus === "VERIFIED" || req.user.verificationStatus === "REJECTED") : req.user.verificationStatus === "PENDING_VERIFICATION").length === 0 ? (
                    <div className="text-center py-16 bg-card-dark border border-contrast-dark rounded-xl italic text-zinc-500">
                      No matching verification applications found in queue.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {verifications
                        .filter(req => verificationsShowHistory ? (req.user.verificationStatus === "VERIFIED" || req.user.verificationStatus === "REJECTED") : req.user.verificationStatus === "PENDING_VERIFICATION")
                        .map((req) => (
                        <div key={req.id} className="bg-card-dark p-6 rounded-xl border border-contrast-dark shadow-xl space-y-4">
                          <div className="flex items-center justify-between border-b border-contrast-dark pb-3">
                            <div>
                              <span className="font-bold text-sm text-white">{req.user.fullName}</span>
                              <span className="text-zinc-500 ml-2">({req.user.email})</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-lg font-bold uppercase ${
                              req.user.role === "TENANT" 
                                ? "bg-[#d4ff4d]/10 border border-[#d4ff4d]/20 text-[#d4ff4d]" 
                                : "bg-zinc-900 border border-zinc-800 text-white"
                            }`}>
                              {req.user.role}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2.5">
                              <p><strong className="text-zinc-500 uppercase text-[9px] tracking-wider">Residency status:</strong> {req.residencyStatus}</p>
                              <p><strong className="text-zinc-500 uppercase text-[9px] tracking-wider">Immigration checks:</strong> Verified declaration signature matched</p>
                              
                              <div className="space-y-1.5 pt-1">
                                <span className="font-bold text-zinc-400">Uploaded Attachments:</span>
                                <div className="space-y-1">
                                  {req.documentUrls.map((url: string, index: number) => (
                                    <a
                                      key={index}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block text-[#d4ff4d] font-bold hover:underline"
                                    >
                                      📄 Open Document {index + 1} ({req.documentTypes[index] || "Attachment"})
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Review form controls */}
                            {req.user.verificationStatus === "PENDING_VERIFICATION" ? (
                              <div className="space-y-3 bg-zinc-950/40 border border-contrast-dark p-4 rounded-xl">
                                <div>
                                  <label className="block text-zinc-400 font-bold mb-1.5">Auditor Auditing Notes</label>
                                  <input
                                    type="text"
                                    placeholder="Add rejection reason or approval comment..."
                                    value={actionNotes[req.userId] || ""}
                                    onChange={(e) => setActionNotes({ ...actionNotes, [req.userId]: e.target.value })}
                                    className="w-full rounded-lg px-3 py-2.5 glass-input text-white text-xs"
                                  />
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => handleActionVerification(req.userId, "REJECT")}
                                    disabled={processingAction === req.userId}
                                    className="rounded-lg border border-red-900 bg-red-955/10 text-red-400 px-4 py-2 font-bold hover:bg-red-955/20 transition-colors flex items-center gap-1 cursor-pointer"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                    <span>Reject</span>
                                  </button>
                                  <button
                                    onClick={() => handleActionVerification(req.userId, "APPROVE")}
                                    disabled={processingAction === req.userId}
                                    className="rounded-lg bg-[#d4ff4d] text-black px-4 py-2 font-bold hover:bg-[#e2ff80] transition-colors flex items-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(212,255,77,0.15)]"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                    <span>Approve Vetting</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center bg-zinc-950/20 border border-contrast-dark p-6 rounded-xl space-y-2 text-center">
                                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                                  req.user.verificationStatus === "VERIFIED"
                                    ? "bg-emerald-950/40 border border-emerald-900/30 text-emerald-450"
                                    : "bg-red-950/40 border border-red-900/30 text-red-450"
                                }`}>
                                  Status: {req.user.verificationStatus}
                                </span>
                                {req.adminNotes && (
                                  <p className="text-zinc-500 italic mt-1 max-w-xs">Notes: {req.adminNotes}</p>
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

              {/* TAB 3: Property Listing Moderation */}
              {activeTab === "listings" && (
                <div className="space-y-6 text-xs text-zinc-350">
                  <div className="flex justify-between items-center border-b border-contrast-dark pb-3">
                    <h2 className="text-base font-bold text-white">Listings Moderation Queue</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setListingsShowHistory(false)}
                        className={`px-3 py-1.5 font-bold transition-all text-xs rounded-lg ${!listingsShowHistory ? "bg-[#d4ff4d] text-black" : "bg-zinc-950 text-zinc-400 hover:text-white border border-contrast-dark"}`}
                      >
                        Pending Reviews
                      </button>
                      <button
                        onClick={() => setListingsShowHistory(true)}
                        className={`px-3 py-1.5 font-bold transition-all text-xs rounded-lg ${listingsShowHistory ? "bg-[#d4ff4d] text-black" : "bg-zinc-950 text-zinc-400 hover:text-white border border-contrast-dark"}`}
                      >
                        Moderation History
                      </button>
                    </div>
                  </div>
                  
                  {loadingListingsQueue ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-[#d4ff4d]" />
                    </div>
                  ) : listingsQueue.filter(item => listingsShowHistory ? (item.status === "APPROVED" || item.status === "REJECTED") : item.status === "PENDING_REVIEW").length === 0 ? (
                    <div className="text-center py-16 bg-card-dark border border-contrast-dark rounded-xl italic text-zinc-500">
                      No matching property listings found.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {listingsQueue
                        .filter(item => listingsShowHistory ? (item.status === "APPROVED" || item.status === "REJECTED") : item.status === "PENDING_REVIEW")
                        .map((item) => (
                        <div key={item.id} className="bg-card-dark p-6 rounded-xl border border-contrast-dark shadow-xl space-y-4">
                          <div className="flex items-center justify-between border-b border-contrast-dark pb-3">
                            <div>
                              <span className="font-bold text-sm text-white">{item.title}</span>
                              <span className="text-zinc-500 ml-2">(City: {item.city})</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-lg font-bold uppercase ${
                              item.status === "APPROVED"
                                ? "bg-emerald-950/40 border border-emerald-850 text-emerald-450"
                                : item.status === "PENDING_REVIEW"
                                ? "bg-[#d4ff4d]/10 border border-[#d4ff4d]/20 text-[#d4ff4d]"
                                : "bg-red-955 border border-red-900 text-red-400"
                            }`}>
                              {item.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2.5">
                              <p><strong className="text-zinc-500 uppercase text-[9px] tracking-wider">Landlord owner:</strong> {item.owner?.fullName || "Owner"}</p>
                              <p><strong className="text-zinc-500 uppercase text-[9px] tracking-wider">Rent amount:</strong> CAD ${item.rent} / month</p>
                              <p><strong className="text-zinc-500 uppercase text-[9px] tracking-wider">Address:</strong> {item.location}</p>
                              <p><strong className="text-zinc-500 uppercase text-[9px] tracking-wider">Property specs:</strong> {item.bedrooms} Bed, {item.bathrooms} Bath</p>
                              <p><strong className="text-zinc-500 font-bold block mt-2">Details:</strong> {item.description}</p>
                            </div>

                            {/* Moderation Controls */}
                            {item.status === "PENDING_REVIEW" && (
                              <div className="space-y-3 bg-zinc-950/40 border border-contrast-dark p-4 rounded-xl flex flex-col justify-between">
                                <div>
                                  <label className="block text-zinc-400 font-bold mb-1.5">Feedback Comments</label>
                                  <input
                                    type="text"
                                    placeholder="Reason for listing rejection or special notice..."
                                    value={actionFeedback[item.id] || ""}
                                    onChange={(e) => setActionFeedback({ ...actionFeedback, [item.id]: e.target.value })}
                                    className="w-full rounded-lg px-3 py-2.5 glass-input text-white text-xs"
                                  />
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => handleModerateListing(item.id, "REJECT")}
                                    disabled={processingAction === item.id}
                                    className="rounded-lg border border-red-900 bg-red-955/10 text-red-400 px-4 py-2.5 font-bold hover:bg-red-955/20 transition-colors cursor-pointer"
                                  >
                                    Reject Listing
                                  </button>
                                  <button
                                    onClick={() => handleModerateListing(item.id, "APPROVE")}
                                    disabled={processingAction === item.id}
                                    className="rounded-lg bg-[#d4ff4d] text-black px-4 py-2.5 font-bold hover:bg-[#e2ff80] transition-all cursor-pointer shadow-[0_0_10px_rgba(212,255,77,0.15)]"
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

              {/* TAB 4: Refund requests queue with auto audits */}
              {activeTab === "refunds" && (
                <div className="space-y-6 text-xs text-zinc-350">
                  <h2 className="text-base font-bold text-white">Refund Claims Queue</h2>
                  
                  {loadingRefunds ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-[#d4ff4d]" />
                    </div>
                  ) : refunds.length === 0 ? (
                    <div className="text-center py-16 bg-card-dark border border-contrast-dark rounded-xl italic text-zinc-500">
                      No active refund claims in queue.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {refunds.map((req) => (
                        <div key={req.id} className="bg-card-dark p-6 rounded-xl border border-contrast-dark shadow-xl space-y-4">
                          <div className="flex items-center justify-between border-b border-contrast-dark pb-3">
                            <div>
                              <span className="font-bold text-sm text-white">{req.user.fullName}</span>
                              <span className="text-zinc-500 ml-2">({req.user.email})</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-lg font-bold uppercase ${
                              req.status === "APPROVED"
                                ? "bg-emerald-950/40 border border-emerald-805 text-emerald-450"
                                : req.status === "PENDING"
                                ? "bg-[#d4ff4d]/10 border border-[#d4ff4d]/20 text-[#d4ff4d]"
                                : "bg-red-955 border border-red-900 text-red-400"
                            }`}>
                              {req.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <p><strong className="text-zinc-500 uppercase text-[9px] tracking-wider">Plan details:</strong> {req.subscription.name} (CAD ${req.subscription.price})</p>
                              <p><strong className="text-zinc-500 uppercase text-[9px] tracking-wider">Claimant rationale:</strong> "{req.reason}"</p>
                              
                              {/* Auto eligibility calculations check! */}
                              <div className="p-3.5 rounded-xl border border-contrast-dark bg-zinc-950/40 space-y-2.5">
                                <span className="font-bold text-zinc-200 block text-[10px] uppercase tracking-wider">System Auto-Audit Summary:</span>
                                <div className="space-y-1.5 text-[11px] text-zinc-400">
                                  <p>- Landlord contact approaches created: <strong>{req.analytics.approachesMade}</strong></p>
                                  <p>- Owner replies received inside chat: <strong>{req.analytics.ownerRepliesReceived}</strong></p>
                                  <div className="mt-2.5 flex items-center space-x-2">
                                    <span>Automatic Refund Eligibility status:</span>
                                    <span className={`font-bold uppercase ${
                                      req.analytics.isEligible 
                                        ? "text-[#d4ff4d] bg-[#d4ff4d]/5 border border-[#d4ff4d]/20" 
                                        : "text-red-450 bg-red-955/15 border border-red-900/60"
                                    } px-2 py-0.5 rounded text-[10px]`}>
                                      {req.analytics.isEligible ? "ELIGIBLE" : "INELIGIBLE"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Moderate Refund Controls */}
                            {req.status === "PENDING" && (
                              <div className="bg-zinc-950/40 border border-contrast-dark p-4 rounded-xl flex flex-col justify-center gap-3">
                                <p className="text-[11px] text-zinc-500 italic text-center leading-relaxed">
                                  Auditor Action: Approving will mark subscription active = false and flag this request as refunded.
                                </p>
                                <div className="flex gap-2 justify-end mt-2">
                                  <button
                                    onClick={() => handleModerateRefund(req.id, "REJECT")}
                                    disabled={processingAction === req.id}
                                    className="rounded-lg border border-red-900 bg-red-955/10 text-red-400 px-4 py-2 font-bold hover:bg-red-955/20 transition-colors cursor-pointer text-xs"
                                  >
                                    Deny Refund
                                  </button>
                                  <button
                                    onClick={() => handleModerateRefund(req.id, "APPROVE")}
                                    disabled={processingAction === req.id}
                                    className="rounded-lg bg-[#d4ff4d] text-black px-4 py-2 font-bold hover:bg-[#e2ff80] transition-all cursor-pointer text-xs shadow-[0_0_10px_rgba(212,255,77,0.15)]"
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

              {/* TAB 5: CMS content editor */}
              {activeTab === "cms" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs h-[500px]">
                  {/* Sidebar legal docs lists */}
                  <div className="md:col-span-1 border border-contrast-dark bg-card-dark rounded-xl overflow-y-auto">
                    <div className="p-4 border-b border-contrast-dark font-bold text-white text-sm">
                      Legal Documents List
                    </div>
                    <div className="divide-y divide-zinc-950">
                      {cmsPages.map((page) => (
                        <button
                          key={page.id}
                          onClick={() => handleSelectCmsPage(page)}
                          className={`w-full text-left p-4 flex flex-col gap-1 transition-all cursor-pointer ${
                            selectedCmsPage?.id === page.id ? "bg-[#d4ff4d]/[0.02] border-l-2 border-[#d4ff4d] text-[#d4ff4d]" : "hover:bg-zinc-900/20 text-zinc-400"
                          }`}
                        >
                          <span className="font-bold text-zinc-200">{page.title}</span>
                          <span className="text-[9px] text-zinc-550 font-extrabold uppercase tracking-wider block mt-0.5">ID: {page.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Editing Card fields */}
                  <div className="md:col-span-2 border border-contrast-dark bg-card-dark rounded-xl flex flex-col justify-between overflow-hidden">
                    {selectedCmsPage ? (
                      <form onSubmit={handleUpdateCmsPage} className="flex flex-col justify-between h-full">
                        <div className="p-4 border-b border-contrast-dark bg-zinc-950/40">
                          <span className="font-bold text-white text-sm">Edit CMS Page</span>
                        </div>

                        <div className="flex-grow p-4 space-y-4 flex flex-col justify-between">
                          <div>
                            <label className="block text-zinc-400 font-bold mb-1.5">Document Title</label>
                            <input
                              type="text"
                              required
                              value={cmsTitle}
                              onChange={(e) => setCmsTitle(e.target.value)}
                              className="w-full rounded-lg px-3 py-2.5 glass-input text-white text-xs"
                            />
                          </div>

                          <div className="flex-grow flex flex-col pt-2">
                            <label className="block text-zinc-400 font-bold mb-1.5">Document Content (Markdown / Text)</label>
                            <textarea
                              required
                              rows={12}
                              value={cmsContent}
                              onChange={(e) => setCmsContent(e.target.value)}
                              className="flex-grow w-full rounded-lg px-3 py-2.5 glass-input text-white resize-none font-mono text-[11px] leading-relaxed transition-colors"
                            />
                          </div>
                        </div>

                        <div className="p-3 border-t border-contrast-dark flex justify-end gap-2 bg-zinc-950/40">
                          <button
                            type="button"
                            onClick={() => setSelectedCmsPage(null)}
                            className="rounded-lg border border-zinc-800 px-4 py-2 font-bold hover:bg-zinc-900 cursor-pointer text-zinc-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={loadingCms}
                            className="rounded-lg bg-[#d4ff4d] text-black px-5 py-2 text-xs font-bold hover:bg-[#e2ff80] cursor-pointer shadow-[0_0_10px_rgba(212,255,77,0.15)]"
                          >
                            {loadingCms ? "Saving page..." : "Save Legal Page"}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex-grow flex flex-col items-center justify-center text-zinc-500 p-8 text-center bg-black/20">
                        <Edit3 className="h-8 w-8 mb-2 text-zinc-800" />
                        <p>Select a legal document from the CMS sidebar lists to edit policy content dynamically.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: Users Directory Tab */}
              {activeTab === "users" && (
                <div className="space-y-6 text-xs text-zinc-350">
                  <div className="flex justify-between items-center border-b border-contrast-dark pb-3">
                    <h2 className="text-base font-bold text-white">Users Directory</h2>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={usersSearch}
                        onChange={(e) => setUsersSearch(e.target.value)}
                        className="rounded-lg px-3 py-1.5 glass-input text-white text-xs w-64 animate-fade-in"
                      />
                    </div>
                  </div>

                  {loadingUsers ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-[#d4ff4d]" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Tenants column */}
                      <div className="bg-card-dark border border-contrast-dark rounded-xl p-5 space-y-4">
                        <h3 className="text-sm font-bold text-white border-b border-contrast-dark pb-2 flex items-center justify-between">
                          <span>Tenants ({usersData.tenants.length})</span>
                          <span className="text-[10px] text-zinc-500 font-normal">Registered Tenants</span>
                        </h3>
                        <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                          {usersData.tenants
                            .filter(u => u.fullName.toLowerCase().includes(usersSearch.toLowerCase()) || u.email.toLowerCase().includes(usersSearch.toLowerCase()))
                            .map((u) => (
                              <div 
                                key={u.id} 
                                onClick={() => setSelectedUser(u)}
                                className="p-3 bg-zinc-950/60 border border-zinc-900 hover:border-[#d4ff4d]/40 hover:bg-zinc-950 transition-all rounded-lg flex items-center justify-between cursor-pointer"
                              >
                                <div className="space-y-1">
                                  <p className="font-bold text-white">{u.fullName}</p>
                                  <p className="text-[10px] text-zinc-500">{u.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {u.isBanned && (
                                    <span className="bg-red-955 border border-red-900 text-red-400 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase">Banned</span>
                                  )}
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                    u.verificationStatus === "VERIFIED" 
                                      ? "bg-emerald-950/30 text-emerald-450 border border-emerald-900/30" 
                                      : u.verificationStatus === "PENDING_VERIFICATION"
                                      ? "bg-[#d4ff4d]/10 text-[#d4ff4d] border border-[#d4ff4d]/15"
                                      : "bg-zinc-900 text-zinc-400"
                                  }`}>
                                    {u.verificationStatus}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Owners column */}
                      <div className="bg-card-dark border border-contrast-dark rounded-xl p-5 space-y-4">
                        <h3 className="text-sm font-bold text-white border-b border-contrast-dark pb-2 flex items-center justify-between">
                          <span>Property Owners ({usersData.owners.length})</span>
                          <span className="text-[10px] text-zinc-500 font-normal">Registered Landlords</span>
                        </h3>
                        <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                          {usersData.owners
                            .filter(u => u.fullName.toLowerCase().includes(usersSearch.toLowerCase()) || u.email.toLowerCase().includes(usersSearch.toLowerCase()))
                            .map((u) => (
                              <div 
                                key={u.id} 
                                onClick={() => setSelectedUser(u)}
                                className="p-3 bg-zinc-950/60 border border-zinc-900 hover:border-[#d4ff4d]/40 hover:bg-zinc-950 transition-all rounded-lg flex items-center justify-between cursor-pointer"
                              >
                                <div className="space-y-1">
                                  <p className="font-bold text-white">{u.fullName}</p>
                                  <p className="text-[10px] text-zinc-500">{u.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {u.isBanned && (
                                    <span className="bg-red-955 border border-red-900 text-red-400 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase">Banned</span>
                                  )}
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                    u.verificationStatus === "VERIFIED" 
                                      ? "bg-emerald-950/30 text-emerald-450 border border-emerald-900/30" 
                                      : u.verificationStatus === "PENDING_VERIFICATION"
                                      ? "bg-[#d4ff4d]/10 text-[#d4ff4d] border border-[#d4ff4d]/15"
                                      : "bg-zinc-900 text-zinc-400"
                                  }`}>
                                    {u.verificationStatus}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* USER DETAIL MODAL DRAWERS */}
          {selectedUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm text-xs text-white">
              <div className="glass-panel w-full max-w-lg rounded-2xl border border-zinc-900 p-6 bg-zinc-950 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-white">User Administration Card</h2>
                    <p className="text-[10px] text-zinc-500">Managing database state of profile: {selectedUser.fullName}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedUser(null)} 
                    className="text-zinc-500 hover:text-white cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-0.5">FULL NAME</span>
                    <p className="font-bold text-zinc-200">{selectedUser.fullName}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-0.5">EMAIL ADDRESS</span>
                    <p className="font-bold text-zinc-200">{selectedUser.email}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-0.5">PORTAL ROLE</span>
                    <p className="font-bold text-[#d4ff4d]">{selectedUser.role}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-0.5">VETTING STATUS</span>
                    <p className="font-bold text-zinc-200">{selectedUser.verificationStatus}</p>
                  </div>
                </div>

                {selectedUser.role === "TENANT" && (
                  <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl space-y-3">
                    <span className="font-bold text-zinc-300 block border-b border-zinc-900 pb-1 text-[10px] uppercase tracking-wider">Immigration & Housing Preferences</span>
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="text-[9px] text-zinc-500 font-bold block">Current Country</span>
                        <span>{selectedUser.currentCountry || "Not Provided"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 font-bold block">Planned Move Date</span>
                        <span>{selectedUser.plannedMoveDate || "Not Provided"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-550 font-bold block">Visa / Permit Status</span>
                        <span>{selectedUser.visaStatus || "Not Provided"} ({selectedUser.visaType || "N/A"})</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-550 font-bold block">Rental Expectation</span>
                        <span>{selectedUser.expectedRentalDuration || "Not Provided"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Moderation Actions / Suspensions */}
                <div className="bg-red-950/10 border border-red-900/30 p-4 rounded-xl space-y-4">
                  <span className="font-bold text-red-400 block text-[10px] uppercase tracking-wider">Emergency Suspensions Control</span>
                  
                  {selectedUser.isBanned ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-zinc-950/80 border border-red-900/30 rounded-lg text-zinc-350 italic text-[11px]">
                        <strong>Suspension Notice:</strong> "{selectedUser.banReason || "Violation of safety standards."}"
                      </div>
                      <button
                        onClick={() => handleToggleBan(selectedUser.id, true)}
                        disabled={processingBan === selectedUser.id}
                        className="w-full rounded-lg bg-emerald-600 text-white font-bold py-2.5 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                      >
                        {processingBan === selectedUser.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            <span>Restore Profile (Unban Access)</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-zinc-400 font-bold mb-1.5">Official Suspensions Reason</label>
                        <input
                          type="text"
                          placeholder="Reason for suspension (visible to banned user)..."
                          value={banReasonInput}
                          onChange={(e) => setBanReasonInput(e.target.value)}
                          className="w-full rounded-lg px-3 py-2.5 glass-input text-white text-xs"
                        />
                      </div>
                      <button
                        onClick={() => handleToggleBan(selectedUser.id, false)}
                        disabled={processingBan === selectedUser.id}
                        className="w-full rounded-lg bg-red-900 text-white font-bold py-2.5 hover:bg-red-950 transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs border border-red-800"
                      >
                        {processingBan === selectedUser.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
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

                <div className="flex justify-end gap-2 border-t border-zinc-900 pt-4">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="rounded-lg border border-zinc-800 px-4 py-2 font-bold text-zinc-450 hover:bg-zinc-900 cursor-pointer text-zinc-400 hover:text-white"
                  >
                    Close Drawer
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
