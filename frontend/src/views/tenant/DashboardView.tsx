"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { io } from "socket.io-client";
import {
  Search, MessageSquare, Bookmark, CreditCard, ShieldCheck,
  MapPin, Bed, Bath, Calendar, ArrowRight, UserCheck, AlertTriangle,
  Send, RefreshCw, Sparkles, CheckCircle, Ban, Loader2, Home, X, LogOut, Menu
} from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";

const socketServerUrl = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || "http://localhost:5000";

export default function DashboardView() {
  const router = useRouter();

  // App states
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [activeTab, setActiveTab] = useState<"search" | "chat" | "saved" | "billing">("search");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search & Filter listings states
  const [listings, setListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [selectedListing, setSelectedListing] = useState<any>(null);

  // Saved listings state
  const [savedListings, setSavedListings] = useState<any[]>([]);
  const [savingListingId, setSavingListingId] = useState<string | null>(null);

  // Chat states
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [activeRoom, setActiveRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [firstMessageContent, setFirstMessageContent] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Billing states
  const [selectedPlan, setSelectedPlan] = useState(SUBSCRIPTION_PLANS[0].id);
  const [purchaseType, setPurchaseType] = useState<"ONETIME" | "SUBSCRIPTION">("ONETIME");
  const [purchaseUrgent, setPurchaseUrgent] = useState(false);
  const [processingPurchase, setProcessingPurchase] = useState(false);
  const [purchaseSuccessMsg, setPurchaseSuccessMsg] = useState("");
  const [billingError, setBillingError] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [submittingRefund, setSubmittingRefund] = useState(false);
  const [refundSuccessMsg, setRefundSuccessMsg] = useState("");

  // Billing history & Socket refs
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [loadingBillingHistory, setLoadingBillingHistory] = useState(false);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const cached = localStorage.getItem("nestarrival_user");
    if (cached) {
      try {
        const userObj = JSON.parse(cached);
        if (userObj.role === "TENANT") {
          setCurrentUser(userObj);
          setLoadingUser(false);
        }
      } catch (err) {
        console.error("Failed to parse cached user", err);
      }
    }
    fetchSession();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchListings();
      fetchSavedListings();
      fetchChatRooms();
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (activeRoom) {
      fetchMessages(activeRoom.id);
    }
  }, [activeRoom]);

  // WebSocket lifecycle connection effect
  useEffect(() => {
    if (activeRoom && currentUser) {
      socketRef.current = io(socketServerUrl, {
        withCredentials: true
      });

      socketRef.current.emit("joinRoom", { roomId: activeRoom.id, userId: currentUser.id });

      socketRef.current.on("message", (msg: any) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [activeRoom, currentUser]);

  // Billing history fetch hook triggers
  useEffect(() => {
    if (activeTab === "billing" && currentUser) {
      fetchBillingHistory();
    }
  }, [activeTab]);

  const fetchBillingHistory = async () => {
    setLoadingBillingHistory(true);
    try {
      const res = await fetch("/api/subscriptions");
      if (res.ok) {
        const data = await res.json();
        setBillingHistory(Array.isArray(data) ? data : (data?.subscriptions ?? []));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBillingHistory(false);
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!res.ok || !data.authenticated || data.user.role !== "TENANT") {
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
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });
    if (res.ok) {
      router.push("/");
    }
  };

  const fetchListings = async () => {
    setLoadingListings(true);
    try {
      const query = new URLSearchParams();
      if (searchCity) query.append("city", searchCity);
      if (minRent) query.append("minRent", minRent);
      if (maxRent) query.append("maxRent", maxRent);
      if (bedrooms) query.append("bedrooms", bedrooms);

      const res = await fetch(`/api/listings?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setListings(Array.isArray(data) ? data : (data.listings ?? []));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingListings(false);
    }
  };

  const fetchSavedListings = async () => {
    try {
      const res = await fetch("/api/listings/saved");
      if (res.ok) {
        const data = await res.json();
        setSavedListings(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSaveListing = async (listingId: string) => {
    setSavingListingId(listingId);
    try {
      const res = await fetch("/api/listings/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      if (res.ok) {
        fetchSavedListings();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingListingId(null);
    }
  };

  const fetchChatRooms = async () => {
    try {
      const res = await fetch(`/api/chat`);
      if (res.ok) {
        const data = await res.json();
        const rooms = Array.isArray(data) ? data : (data?.rooms ?? []);
        setChatRooms(rooms);
        return rooms;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  };

  const fetchMessages = async (roomId: string) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/chat/messages?roomId=${roomId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : (data?.messages ?? []));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeRoom || !currentUser) return;

    if (socketRef.current) {
      socketRef.current.emit("sendMessage", {
        roomId: activeRoom.id,
        senderId: currentUser.id,
        content: newMessageText
      });
      setNewMessageText("");
    } else {
      setSendingMsg(true);
      try {
        const res = await fetch("/api/chat/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomId: activeRoom.id,
            content: newMessageText,
          }),
        });

        if (res.ok) {
          const msg = await res.json();
          setMessages((prev) => [...prev, msg]);
          setNewMessageText("");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setSendingMsg(false);
      }
    }
  };

  const handleInitiateApproach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstMessageContent.trim() || !selectedListing) return;

    try {
      const res = await fetch("/api/chat/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: selectedListing.id,
          firstMessage: firstMessageContent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to contact landlord.");
        return;
      }

      setSelectedListing(null);
      setFirstMessageContent("");
      await fetchChatRooms();
      await fetchSession();

      const createdRoomId = data.roomId;
      const targetRoom = chatRooms.find((r) => r.id === createdRoomId);
      if (targetRoom) {
        setActiveRoom(targetRoom);
      } else {
        fetchChatRooms().then((updatedRooms) => {
          const freshRoom = updatedRooms?.find((r: any) => r.id === createdRoomId);
          if (freshRoom) setActiveRoom(freshRoom);
        });
      }

      setActiveTab("chat");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePurchaseSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setBillingError("");
    setPurchaseSuccessMsg("");
    setProcessingPurchase(true);

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan,
          type: purchaseType,
          purchaseUrgentMatch: purchaseUrgent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setBillingError(data.error || "Failed to process payment");
        setProcessingPurchase(false);
        return;
      }

      setPurchaseSuccessMsg(data.message);
      setPurchaseUrgent(false);
      await fetchSession();
      setProcessingPurchase(false);
    } catch (e) {
      setBillingError("Connection failed");
      setProcessingPurchase(false);
    }
  };

  const handleSubmitRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.subscription) return;

    setSubmittingRefund(true);
    setRefundSuccessMsg("");
    setBillingError("");

    try {
      const res = await fetch("/api/subscriptions/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: currentUser.subscription.id,
          reason: refundReason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setBillingError(data.error || "Failed to file refund request");
        setSubmittingRefund(false);
        return;
      }

      setRefundSuccessMsg(data.message);
      setRefundReason("");
      setSubmittingRefund(false);
    } catch (e) {
      setBillingError("Connection failed");
      setSubmittingRefund(false);
    }
  };

  if (loadingUser || !currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc] text-[#0f172a]">
        <Loader2 className="h-8 w-8 animate-spin text-[#cfa052]" />
      </div>
    );
  }

  const isVerified = currentUser.verificationStatus === "VERIFIED";
  const hasPendingVerification = currentUser.verificationStatus === "PENDING_VERIFICATION";
  const isRejected = currentUser.verificationStatus === "REJECTED";

  if (currentUser?.isBanned) {
    return (
      <div className="light-theme-dashboard fixed inset-0 z-50 flex items-center justify-center bg-[#f8fafc]/95 backdrop-blur-md p-6 text-center text-xs">
        <div className="bg-card-dark border border-red-200 p-8 rounded-2xl max-w-md w-full shadow-2xl space-y-6">
          <div className="flex flex-col items-center">
            <div className="h-14 w-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-500 mb-4 animate-bounce">
              <Ban className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-bold text-[#0f172a] uppercase tracking-tight">Access Prohibited</h2>
            <p className="text-[10px] text-red-500 uppercase tracking-widest font-extrabold mt-1">Banned Account</p>
          </div>

          <div className="bg-[#fdfbf7] border border-[#f4efe6] p-4 rounded-xl text-left leading-relaxed text-slate-650 space-y-1.5">
            <strong className="text-[#352f2a]">Suspicion Notice:</strong>
            <p className="italic">"{currentUser.banReason || "Violation of Community Safety Guidelines."}"</p>
          </div>

          <p className="text-[#8a7d6a] leading-normal">
            NestArrival enforces a zero-tolerance policy against fraudulent documentation, scam listings, or threat behaviors. For appeals or data claims, contact administration at:
          </p>

          <div className="pt-2">
            <a href="mailto:support@nestarrival.ca" className="inline-block text-[#cfa052] border border-[#cfa052]/20 bg-[#cfa052]/5 px-5 py-2.5 rounded-lg font-bold hover:bg-[#cfa052]/10 transition-colors">
              support@nestarrival.ca
            </a>
          </div>

          <div className="pt-4 border-t border-[#f4efe6]">
            <button onClick={handleLogout} className="text-slate-400 hover:text-slate-700 font-bold flex items-center justify-center gap-1.5 w-full">
              <LogOut className="h-4 w-4" />
              <span>Log out of Session</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="light-theme-dashboard flex min-h-screen bg-content-dark text-[#f5f5f7]">

      {/* 1. Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-sidebar-dark border-r border-contrast-dark z-30 p-6 justify-between">
        <div className="space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Logo className="h-6 w-6 text-[#cfa052] transition-transform duration-300 group-hover:scale-110" />
            <span className="text-lg font-bold tracking-tight text-white font-serif">
              Nest<span className="text-[#cfa052]">Arrival</span>
            </span>
          </Link>

          {/* Navigation Tab Menu */}
          <div className="space-y-1">
            <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-wider block px-2.5 mb-2">TENANT PORTAL</span>

            <button
              onClick={() => setActiveTab("search")}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "search"
                ? "bg-[#d4ff4d]/5 text-[#d4ff4d] border-l-2 border-[#d4ff4d]"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
                }`}
            >
              <Search className="h-4 w-4" />
              <span>Search Properties</span>
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "chat"
                ? "bg-[#d4ff4d]/5 text-[#d4ff4d] border-l-2 border-[#d4ff4d]"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
                }`}
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-4 w-4" />
                <span>My Inbox</span>
              </div>
              {chatRooms.length > 0 && (
                <span className="bg-[#d4ff4d] text-black rounded-full px-1.5 py-0.5 text-[9px] font-extrabold">
                  {chatRooms.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "saved"
                ? "bg-[#d4ff4d]/5 text-[#d4ff4d] border-l-2 border-[#d4ff4d]"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
                }`}
            >
              <div className="flex items-center space-x-3">
                <Bookmark className="h-4 w-4" />
                <span>Saved Listings</span>
              </div>
              {savedListings.length > 0 && (
                <span className="bg-zinc-800 text-zinc-350 rounded-full px-1.5 py-0.5 text-[9px] font-bold">
                  {savedListings.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("billing")}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "billing"
                ? "bg-[#d4ff4d]/5 text-[#d4ff4d] border-l-2 border-[#d4ff4d]"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
                }`}
            >
              <CreditCard className="h-4 w-4" />
              <span>Billing & Refunds</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer Profile */}
        <div className="space-y-4 pt-4 border-t border-zinc-900/80">
          <div className="px-2">
            <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block mb-1">Tenant Profile</span>
            <p className="text-xs font-bold text-white truncate">{currentUser.fullName}</p>
            <p className="text-[10px] text-zinc-500 truncate">{currentUser.email}</p>
            {currentUser.subscription && (
              <p className="text-[9px] text-[#d4ff4d] font-bold uppercase tracking-wider mt-1.5">
                {currentUser.subscription.name} Active
              </p>
            )}
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
          <Logo className="h-5 w-5 text-[#cfa052]" />
          <span className="text-base font-bold tracking-tight text-white font-serif">
            Nest<span className="text-[#cfa052]">Arrival</span>
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
                <span className="text-[9px] font-extrabold text-[#d4ff4d] uppercase tracking-wider block px-2.5 mb-2">TENANT PORTAL</span>
                <div className="space-y-1">
                  <button
                    onClick={() => { setActiveTab("search"); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold ${activeTab === "search" ? "bg-[#d4ff4d]/5 text-[#d4ff4d]" : "text-zinc-400"
                      }`}
                  >
                    <Search className="h-4 w-4" />
                    <span>Search Properties</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("chat"); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold ${activeTab === "chat" ? "bg-[#d4ff4d]/5 text-[#d4ff4d]" : "text-zinc-400"
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-4 w-4" />
                      <span>My Inbox</span>
                    </div>
                    {chatRooms.length > 0 && <span className="bg-[#d4ff4d] text-black rounded-full px-1.5 py-0.5 text-[9px] font-extrabold">{chatRooms.length}</span>}
                  </button>
                  <button
                    onClick={() => { setActiveTab("saved"); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold ${activeTab === "saved" ? "bg-[#d4ff4d]/5 text-[#d4ff4d]" : "text-zinc-400"
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Bookmark className="h-4 w-4" />
                      <span>Saved Listings</span>
                    </div>
                    {savedListings.length > 0 && <span className="bg-zinc-800 text-zinc-350 rounded-full px-1.5 py-0.5 text-[9px] font-bold">{savedListings.length}</span>}
                  </button>
                  <button
                    onClick={() => { setActiveTab("billing"); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold ${activeTab === "billing" ? "bg-[#d4ff4d]/5 text-[#d4ff4d]" : "text-zinc-400"
                      }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Billing & Refunds</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-900">
                <div className="px-2">
                  <p className="text-xs font-bold text-white truncate">{currentUser.fullName}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{currentUser.email}</p>
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
        <div className="flex-grow p-6 md:p-10 relative z-10">

          {/* Verification Alert Banners */}
          {!isVerified && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 rounded-xl border p-4 text-xs shadow-sm flex items-start space-x-3 bg-card-dark border-contrast-dark`}
            >
              <AlertTriangle className="h-5 w-5 text-[#d4ff4d] flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-bold text-white">
                  {hasPendingVerification
                    ? "Verification Application Pending Audit"
                    : isRejected
                      ? "Verification Application Rejected"
                      : "Verification & Onboarding Incomplete"}
                </p>
                <p className="text-zinc-400">
                  {hasPendingVerification
                    ? "Our administrator team is auditing your residency details and visa permits. Listing searches are active, but messaging property owners requires verification approval."
                    : isRejected
                      ? "Your document uploads did not pass our checks. Please verify your details or submit legal proofs at our Help Center."
                      : "NestArrival enforces a verification-first safety model. You must complete the guided verification checklist to approach property owners."}
                </p>
                {!hasPendingVerification && (
                  <button
                    onClick={() => router.push("/tenant/verification")}
                    className="mt-2 inline-flex font-bold text-[#d4ff4d] underline hover:text-[#e2ff80] cursor-pointer"
                  >
                    Complete Verification Steps
                  </button>
                )}
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {/* TAB 1: Search & Browse Listings */}
              {activeTab === "search" && (
                <div className="space-y-6">
                  {/* Filter Hub - High Contrast */}
                  <div className="bg-card-dark p-5 rounded-xl border border-contrast-dark shadow-xl grid grid-cols-1 sm:grid-cols-5 gap-4 items-end text-xs">
                    <div>
                      <label className="block font-bold mb-1.5 text-zinc-400">City in Canada</label>
                      <input
                        type="text"
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        placeholder="e.g. Toronto"
                        className="w-full rounded-lg px-3 py-2.5 glass-input text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5 text-zinc-400">Min Rent (CAD)</label>
                      <input
                        type="number"
                        value={minRent}
                        onChange={(e) => setMinRent(e.target.value)}
                        placeholder="e.g. 1000"
                        className="w-full rounded-lg px-3 py-2.5 glass-input text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5 text-zinc-400">Max Rent (CAD)</label>
                      <input
                        type="number"
                        value={maxRent}
                        onChange={(e) => setMaxRent(e.target.value)}
                        placeholder="e.g. 2500"
                        className="w-full rounded-lg px-3 py-2.5 glass-input text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5 text-zinc-400">Bedrooms</label>
                      <select
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        className="w-full rounded-lg border border-contrast-dark p-2.5 bg-zinc-950 text-white focus:outline-none focus:border-[#d4ff4d]"
                      >
                        <option value="" className="bg-zinc-950">Any</option>
                        <option value="1" className="bg-zinc-950">1 Bedroom</option>
                        <option value="2" className="bg-zinc-950">2 Bedrooms</option>
                        <option value="3" className="bg-zinc-950">3+ Bedrooms</option>
                      </select>
                    </div>
                    <button
                      onClick={fetchListings}
                      className="rounded-lg neon-btn-primary py-2.5 text-center font-bold text-black flex items-center justify-center space-x-1.5 cursor-pointer h-[37px]"
                    >
                      <Search className="h-4 w-4" />
                      <span>Search</span>
                    </button>
                  </div>

                  {/* Listings Results Grid */}
                  {currentUser?.verificationStatus !== "VERIFIED" ? (
                    <div className="text-center py-20 bg-card-dark rounded-xl border border-contrast-dark flex flex-col items-center">
                      <ShieldCheck className="h-12 w-12 text-[#cfa052] mb-4 opacity-80" />
                      <h3 className="text-xl font-bold text-white mb-2 font-serif">Verification Required</h3>
                      <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
                        Get verified to view the listings. We maintain a 100% scam-free network by ensuring all tenants and owners are authenticated before browsing properties.
                      </p>
                      <Link href="/tenant/verification" className="mt-6 bg-[#cfa052] hover:bg-[#b58942] text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-[0_4px_10px_rgba(207,160,82,0.3)] hover:-translate-y-0.5">
                        Complete Verification
                      </Link>
                    </div>
                  ) : loadingListings ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-[#cfa052]" />
                    </div>
                  ) : listings.length === 0 ? (
                    <div className="text-center py-16 bg-card-dark rounded-xl border border-contrast-dark">
                      <p className="text-zinc-500 text-sm">No approved property listings matching your filters.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {listings.map((item) => {
                        const isSaved = savedListings.some((s) => s.id === item.id);
                        return (
                          <div key={item.id} className="bg-card-dark border border-contrast-dark hover:border-[#cfa052]/30 hover:shadow-[0_0_15px_rgba(207,160,82,0.05)] transition-all flex flex-col justify-between overflow-hidden rounded-xl h-full">
                            {/* Placeholder image representation */}
                            <div className="h-44 bg-zinc-950 flex items-center justify-center relative border-b border-contrast-dark text-xs">
                              {item.photos && item.photos.length > 0 ? (
                                <img
                                  src={item.photos[0]}
                                  alt={item.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="text-zinc-500 font-bold italic flex flex-col items-center">
                                  <Home className="h-8 w-8 mb-1 text-zinc-800" />
                                  <span>Property Snapshot</span>
                                </div>
                              )}

                              {/* Price badge */}
                              <span className="absolute bottom-3 left-3 bg-[#cfa052] text-white border border-[#b58942] rounded-lg px-2.5 py-1 text-xs font-bold shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                                CAD ${item.rent}/mo
                              </span>
                            </div>

                            <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="inline-flex items-center space-x-1 text-[9px] text-zinc-500 font-extrabold uppercase tracking-wider">
                                    <MapPin className="h-3 w-3 text-[#cfa052]" />
                                    <span>{item.city}, Canada</span>
                                  </span>

                                  {item.owner?.isVerified && (
                                    <div className="flex items-center space-x-1 text-[#cfa052] bg-[#cfa052]/5 border border-[#cfa052]/10 rounded px-1.5 py-0.5 text-[9px] font-bold">
                                      <ShieldCheck className="h-3.5 w-3.5 text-[#cfa052]" />
                                      <span>Vetted Owner</span>
                                    </div>
                                  )}
                                </div>

                                <h3 className="font-bold text-sm text-white line-clamp-1">{item.title}</h3>
                                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{item.description}</p>
                              </div>

                              <div className="flex items-center space-x-4 border-t border-contrast-dark pt-3 text-[10px] text-zinc-500 font-bold">
                                <span className="flex items-center space-x-1">
                                  <Bed className="h-3.5 w-3.5 text-[#cfa052]" />
                                  <span>{item.bedrooms} Bed</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Bath className="h-3.5 w-3.5 text-[#cfa052]" />
                                  <span>{item.bathrooms} Bath</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Calendar className="h-3.5 w-3.5 text-[#cfa052]" />
                                  <span>Avail: {new Date(item.availabilityDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                                </span>
                              </div>
                            </div>

                            <div className="px-4 pb-4 flex items-center justify-between gap-2 pt-2">
                              <button
                                onClick={() => setSelectedListing(item)}
                                className="flex-grow rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white py-2 text-center text-xs font-bold transition-colors cursor-pointer"
                              >
                                View Details
                              </button>
                              <motion.button
                                whileTap={{ scale: 0.8 }}
                                onClick={() => toggleSaveListing(item.id)}
                                disabled={savingListingId === item.id}
                                className={`rounded-lg border p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer ${isSaved
                                  ? "bg-[#cfa052]/10 border-[#cfa052]/30 text-[#cfa052] hover:bg-[#cfa052]/20"
                                  : "border-contrast-dark bg-zinc-950 hover:bg-zinc-900"
                                  }`}
                              >
                                <motion.div animate={{ scale: isSaved ? [1, 1.3, 1] : 1 }}>
                                  <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                                </motion.div>
                              </motion.button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Chat Rooms / Inbox */}
              {activeTab === "chat" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs h-[550px]">
                  {/* Sidebar list */}
                  <div className="lg:col-span-1 border border-contrast-dark bg-card-dark rounded-xl overflow-y-auto flex flex-col">
                    <div className="p-4 border-b border-contrast-dark font-bold text-white text-sm">
                      Active Connections
                    </div>
                    <div className="flex-grow divide-y divide-zinc-950">
                      {chatRooms.length === 0 ? (
                        <p className="p-6 text-center text-zinc-500 italic">No chat connections established.</p>
                      ) : (
                        chatRooms.map((room) => (
                          <button
                            key={room.id}
                            onClick={() => setActiveRoom(room)}
                            className={`w-full text-left p-4 flex flex-col gap-1 transition-all cursor-pointer ${activeRoom?.id === room.id ? "bg-[#d4ff4d]/[0.02] border-l-2 border-[#d4ff4d]" : "hover:bg-zinc-900/20"
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-zinc-200">{room.owner.fullName}</span>
                              {room.owner.isVerified && (
                                <ShieldCheck className="h-4 w-4 text-[#d4ff4d]" />
                              )}
                            </div>
                            <span className="text-[10px] text-zinc-400 truncate font-medium">{room.listing.title}</span>
                            {room.messages[0] && (
                              <p className="text-[10px] text-zinc-500 line-clamp-1 italic mt-1">{room.messages[0].content}</p>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Chat conversation area */}
                  <div className="lg:col-span-2 border border-contrast-dark bg-card-dark rounded-xl flex flex-col justify-between overflow-hidden">
                    {activeRoom ? (
                      <>
                        {/* Header */}
                        <div className="p-4 border-b border-contrast-dark bg-zinc-950/40 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-white text-sm">{activeRoom.owner.fullName}</span>
                            <p className="text-[10px] text-zinc-550 mt-0.5">Regarding: {activeRoom.listing.title}</p>
                          </div>
                          {activeRoom.owner.isVerified && (
                            <div className="flex items-center space-x-1 text-[#d4ff4d] bg-[#d4ff4d]/5 border border-[#d4ff4d]/10 rounded px-1.5 py-0.5 text-[9px] font-bold">
                              <ShieldCheck className="h-3.5 w-3.5 text-[#d4ff4d]" />
                              <span>Vetted Owner</span>
                            </div>
                          )}
                        </div>

                        {/* Messages logs */}
                        <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-black/30">
                          {loadingMessages ? (
                            <div className="flex justify-center py-6">
                              <Loader2 className="h-6 w-6 animate-spin text-[#d4ff4d]" />
                            </div>
                          ) : (
                            messages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex flex-col max-w-[75%] rounded-xl p-3 ${msg.senderId === currentUser.id
                                  ? "bg-[#d4ff4d]/5 border border-[#d4ff4d]/15 text-white ml-auto rounded-tr-none"
                                  : "bg-zinc-950 border border-contrast-dark text-zinc-150 mr-auto rounded-tl-none"
                                  }`}
                              >
                                <span className="text-[9px] opacity-60 font-semibold mb-1">
                                  {msg.senderId === currentUser.id ? "You" : msg.sender.fullName}
                                </span>
                                <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                              </div>
                            ))
                          )}
                          <div ref={messageEndRef} />
                        </div>

                        {/* Footer Input */}
                        <form onSubmit={handleSendMessage} className="p-3 border-t border-contrast-dark flex gap-2 bg-zinc-950">
                          <input
                            type="text"
                            required
                            value={newMessageText}
                            onChange={(e) => setNewMessageText(e.target.value)}
                            placeholder="Write message here..."
                            className="flex-grow rounded-lg px-3 py-2.5 glass-input text-white text-xs"
                          />
                          <button
                            type="submit"
                            disabled={sendingMsg}
                            className="rounded-lg bg-[#d4ff4d] text-black px-4 hover:bg-[#e2ff80] transition-all flex items-center justify-center disabled:bg-zinc-900 disabled:text-zinc-550 cursor-pointer"
                          >
                            {sendingMsg ? <Loader2 className="h-4 w-4 animate-spin text-black" /> : <Send className="h-4 w-4" />}
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="flex-grow flex flex-col items-center justify-center text-zinc-550 p-8 text-center bg-black/10">
                        <MessageSquare className="h-8 w-8 mb-2 text-zinc-800" />
                        <p>Select a chat connection from the sidebar or approach an owner on a property listing card to start messaging.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: Saved Listings */}
              {activeTab === "saved" && (
                <div>
                  {currentUser?.verificationStatus !== "VERIFIED" ? (
                    <div className="text-center py-20 bg-card-dark rounded-xl border border-contrast-dark flex flex-col items-center">
                      <ShieldCheck className="h-12 w-12 text-[#cfa052] mb-4 opacity-80" />
                      <h3 className="text-xl font-bold text-white mb-2 font-serif">Verification Required</h3>
                      <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
                        Get verified to view the listings. We maintain a 100% scam-free network by ensuring all tenants and owners are authenticated before browsing properties.
                      </p>
                      <Link href="/tenant/verification" className="mt-6 bg-[#cfa052] hover:bg-[#b58942] text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-[0_4px_10px_rgba(207,160,82,0.3)] hover:-translate-y-0.5">
                        Complete Verification
                      </Link>
                    </div>
                  ) : savedListings.length === 0 ? (
                    <div className="text-center py-16 bg-card-dark rounded-xl border border-contrast-dark text-xs text-zinc-555 italic">
                      You haven't bookmarked any listings yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedListings.map((item) => (
                        <div key={item.id} className="bg-card-dark border border-contrast-dark hover:border-[#cfa052]/30 transition-all flex flex-col justify-between overflow-hidden text-xs rounded-xl">
                          <div className="h-40 bg-zinc-950 flex items-center justify-center relative text-zinc-500">
                            {item.photos && item.photos.length > 0 ? (
                              <img src={item.photos[0]} alt={item.title} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex flex-col items-center italic">
                                <Home className="h-6 w-6 mb-1 text-zinc-700" />
                                <span>Property Snapshot</span>
                              </div>
                            )}
                            <span className="absolute bottom-3 left-3 bg-[#cfa052] text-white border border-[#b58942] rounded-lg px-2.5 py-1 text-xs font-bold shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                              CAD ${item.rent}/mo
                            </span>
                          </div>
                          <div className="p-4 space-y-2">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase">{item.city}</span>
                            <h3 className="font-bold text-white line-clamp-1">{item.title}</h3>
                            <p className="text-zinc-400 line-clamp-2 leading-relaxed">{item.description}</p>
                          </div>
                          <div className="px-4 pb-4 flex items-center justify-between gap-2">
                            <button
                              onClick={() => setSelectedListing(item)}
                              className="flex-grow rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-805 border-zinc-800 text-white py-1.5 text-center text-xs font-bold transition-colors cursor-pointer"
                            >
                              View Details
                            </button>
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              onClick={() => toggleSaveListing(item.id)}
                              disabled={savingListingId === item.id}
                              className="rounded-lg border p-1.5 border-[#cfa052]/30 text-[#cfa052] bg-[#cfa052]/10 hover:bg-[#cfa052]/20 cursor-pointer"
                            >
                              <motion.div animate={{ scale: [1, 1.3, 1] }}>
                                <Bookmark className="h-4 w-4 fill-[#cfa052]" />
                              </motion.div>
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Billing, Subscriptions, & Refund Logic */}
              {activeTab === "billing" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs">
                  {/* Column 1 & 2: Sub management & buy */}
                  <div className="lg:col-span-2 space-y-6">

                    {/* Active Plan info */}
                    <div className="bg-card-dark p-6 rounded-xl border border-contrast-dark shadow-xl space-y-4">
                      <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                        <CreditCard className="h-5 w-5 text-[#d4ff4d]" />
                        <span>My Active Plan</span>
                      </h3>

                      {currentUser.subscription ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="rounded-lg bg-zinc-950 border border-contrast-dark p-4 space-y-1">
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">PLAN TIER</span>
                            <p className="text-sm font-bold text-white">{currentUser.subscription.name}</p>
                            <p className="text-[10px] text-zinc-450">
                              Purchased for CAD ${currentUser.subscription.price} on {new Date(currentUser.subscription.startDate).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="rounded-lg bg-zinc-950 border border-contrast-dark p-4 space-y-1">
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">APPROACH LIMITS</span>
                            <p className="text-sm font-bold text-white">
                              {currentUser.subscription.approachesAllowed === -1 ? (
                                "Unlimited"
                              ) : (
                                <span>
                                  {currentUser.subscription.approachesAllowed - currentUser.subscription.approachesUsed} / {currentUser.subscription.approachesAllowed} Remaining
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-zinc-450 font-medium text-zinc-500">
                              Expires: {new Date(currentUser.subscription.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl bg-zinc-950 border border-contrast-dark p-6 text-center text-zinc-400">
                          <p>No active subscription plan found. Purchase a plan below to unlock messaging with property owners.</p>
                        </div>
                      )}
                    </div>

                    {/* Purchase form - Admin approved billing */}
                    <div className="bg-card-dark p-6 rounded-xl border border-contrast-dark shadow-xl space-y-4">
                      <h3 className="text-sm font-bold text-white">Request a Subscription Plan</h3>

                      <div className="rounded-lg bg-[#d4ff4d]/5 border border-[#d4ff4d]/15 p-3.5 text-[10px] text-zinc-300 leading-relaxed">
                        <p className="font-bold text-[#d4ff4d] mb-1">📋 Admin-Approved Billing</p>
                        <p>Submit your plan request and our team will review and manually activate your subscription within 1–2 business hours. You will receive an email confirmation once your plan is active.</p>
                      </div>

                      {purchaseSuccessMsg && (
                        <div className="rounded-lg bg-emerald-950/20 border border-emerald-900/40 p-3 text-[#d4ff4d] text-xs">
                          <span>{purchaseSuccessMsg}</span>
                        </div>
                      )}

                      {billingError && (
                        <div className="rounded-lg bg-red-950/20 border border-red-900/40 p-3 text-red-400 text-xs">
                          <span>{billingError}</span>
                        </div>
                      )}

                      <form onSubmit={handlePurchaseSubscription} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-zinc-400 font-bold mb-1.5">Choose Package</label>
                            <select
                              value={selectedPlan}
                              onChange={(e) => setSelectedPlan(e.target.value)}
                              className="w-full text-xs rounded-lg border border-contrast-dark p-2.5 bg-zinc-950 text-white focus:outline-none focus:border-[#d4ff4d]"
                            >
                              {SUBSCRIPTION_PLANS.map((p) => (
                                <option key={p.id} value={p.id} className="bg-zinc-950">
                                  {p.name} (Limits: {p.approachesLimit === -1 ? "Unlimited" : `${p.approachesLimit} approaches`})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-zinc-400 font-bold mb-1.5">Payment Type</label>
                            <div className="rounded-lg border border-[#d4ff4d]/20 bg-[#d4ff4d]/5 p-2.5 text-[10px] text-[#d4ff4d] font-bold text-center">
                              One-Time Payment
                            </div>
                          </div>
                        </div>

                        {/* Add-on */}
                        <label className="flex items-start space-x-2 bg-zinc-950 border border-contrast-dark p-3.5 rounded-xl cursor-pointer">
                          <input
                            type="checkbox"
                            checked={purchaseUrgent}
                            onChange={(e) => setPurchaseUrgent(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-contrast-dark bg-zinc-950 text-[#d4ff4d] focus:ring-[#d4ff4d] focus:ring-offset-black"
                          />
                          <div>
                            <p className="font-bold text-white flex items-center gap-1 text-[11px]">
                              <Sparkles className="h-3.5 w-3.5 text-[#d4ff4d]" />
                              <span>Premium Upgrade: Urgent Housing Match (+CAD $99)</span>
                            </p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">
                              Priority profile display inside owner list hubs, boosting matching odds within 72 hours.
                            </p>
                          </div>
                        </label>

                        <div className="bg-zinc-950 border border-contrast-dark p-4 rounded-xl text-[10px] text-zinc-400 space-y-2">
                          <p className="font-bold text-zinc-200">Total Purchase Summary:</p>
                          <p>
                            - Plan Price:{" "}
                            <strong>
                              CAD $
                              {purchaseType === "SUBSCRIPTION"
                                ? SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan)?.priceSub
                                : SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan)?.priceOneTime}
                            </strong>
                          </p>
                          {purchaseUrgent && <p>- Urgent Relocation Boost: <strong>CAD $99</strong></p>}
                          <hr className="border-contrast-dark" />
                          <p className="font-bold text-white text-xs">
                            Total Checkout Value: CAD $
                            {(purchaseType === "SUBSCRIPTION"
                              ? SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan)?.priceSub || 0
                              : SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan)?.priceOneTime || 0) +
                              (purchaseUrgent ? 99 : 0)}
                          </p>
                        </div>

                        <button
                          type="submit"
                          disabled={processingPurchase}
                          className="w-full rounded-lg neon-btn-primary py-3 font-bold text-black disabled:bg-zinc-800 disabled:text-zinc-550 cursor-pointer"
                        >
                          {processingPurchase ? "Submitting Request..." : "Submit Subscription Request"}
                        </button>
                      </form>
                    </div>

                    {/* Billing History Card */}
                    <div className="bg-card-dark p-6 rounded-xl border border-contrast-dark shadow-xl space-y-4">
                      <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                        <RefreshCw className="h-4.5 w-4.5 text-[#d4ff4d]" />
                        <span>My Billing & Transactions History</span>
                      </h3>

                      {loadingBillingHistory ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin text-[#d4ff4d]" />
                        </div>
                      ) : billingHistory.length === 0 ? (
                        <p className="text-zinc-500 italic text-center py-4">No transactions found.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-[11px] text-zinc-400">
                            <thead>
                              <tr className="border-b border-contrast-dark text-zinc-500 font-bold uppercase tracking-wider text-[9px]">
                                <th className="pb-3 pr-2">Plan</th>
                                <th className="pb-3 pr-2">Amount</th>
                                <th className="pb-3 pr-2">Date Purchased</th>
                                <th className="pb-3 pr-2">Expiry Date</th>
                                <th className="pb-3">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900/60">
                              {billingHistory.map((sub: any) => (
                                <tr key={sub.id} className="hover:bg-zinc-950/20">
                                  <td className="py-3 pr-2 font-bold text-white">{sub.name}</td>
                                  <td className="py-3 pr-2 font-mono">CAD ${sub.price}</td>
                                  <td className="py-3 pr-2">{new Date(sub.startDate).toLocaleDateString()}</td>
                                  <td className="py-3 pr-2">{new Date(sub.endDate).toLocaleDateString()}</td>
                                  <td className="py-3">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${sub.isActive
                                      ? "bg-emerald-950/30 border border-emerald-900/40 text-emerald-450"
                                      : "bg-zinc-900 border border-zinc-800 text-zinc-500"
                                      }`}>
                                      {sub.isActive ? "Active" : "Expired"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Column 3: Refund Panel */}
                  <div className="lg:col-span-1">
                    <div className="bg-card-dark p-6 rounded-xl border border-contrast-dark shadow-xl space-y-4">
                      <h3 className="text-sm font-bold text-white flex items-center space-x-1">
                        <AlertTriangle className="h-4.5 w-4.5 text-[#d4ff4d]" />
                        <span>Request Refund</span>
                      </h3>

                      {refundSuccessMsg && (
                        <div className="rounded-lg bg-[#d4ff4d]/10 border border-[#d4ff4d]/20 p-3 text-[#d4ff4d] text-xs">
                          <span>{refundSuccessMsg}</span>
                        </div>
                      )}

                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Under NestArrival safety policy, if you purchase a plan and receive zero (0) responses from property owners during your active period, you can apply for a full refund of that billing cycle.
                      </p>

                      {currentUser.subscription ? (
                        <form onSubmit={handleSubmitRefund} className="space-y-4 pt-2">
                          <div>
                            <label className="block text-zinc-400 font-bold mb-1.5">Reason for Claim</label>
                            <textarea
                              required
                              value={refundReason}
                              onChange={(e) => setRefundReason(e.target.value)}
                              placeholder="e.g. Sent 3 messages to owners, but received zero responses."
                              rows={3}
                              className="w-full rounded-lg px-3 py-2.5 glass-input text-white text-xs resize-none"
                            ></textarea>
                          </div>
                          <button
                            type="submit"
                            disabled={submittingRefund}
                            className="w-full rounded-lg border border-red-900 bg-red-950/5 py-2.5 text-center font-bold text-red-400 hover:bg-red-950/10 transition-colors disabled:bg-zinc-850 cursor-pointer"
                          >
                            {submittingRefund ? "Submitting Request..." : "Apply for 100% Refund"}
                          </button>
                        </form>
                      ) : (
                        <div className="rounded-xl bg-zinc-950 border border-contrast-dark p-5 text-zinc-500 italic text-center">
                          You must have an active subscription package to submit a refund claim.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* Dynamic Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm text-xs text-white">
          <div className="bg-card-dark w-full max-w-lg rounded-2xl border border-contrast-dark p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto flex flex-col justify-between">
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mt-2">
              <h2 className="text-lg font-bold text-white mb-2">{selectedListing.title}</h2>
              <div className="flex items-center space-x-2 mb-4">
                <span className="inline-flex items-center space-x-1 text-zinc-400 font-bold uppercase">
                  <MapPin className="h-3 w-3 text-[#d4ff4d]" />
                  <span>{selectedListing.location}, {selectedListing.city}</span>
                </span>

                {selectedListing.owner?.isVerified && (
                  <div className="flex items-center space-x-1 text-[#d4ff4d] bg-[#d4ff4d]/5 border border-[#d4ff4d]/10 rounded px-1.5 py-0.5 text-[9px] font-bold">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#d4ff4d]" />
                    <span>Vetted Owner</span>
                  </div>
                )}
              </div>

              {/* Photo placeholder inside details */}
              <div className="h-48 bg-zinc-950 rounded-xl overflow-hidden border border-contrast-dark mb-4 flex items-center justify-center text-zinc-500 italic font-bold">
                {selectedListing.photos && selectedListing.photos.length > 0 ? (
                  <img src={selectedListing.photos[0]} alt={selectedListing.title} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-zinc-700">Property Showcase Snapshot</span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 border-y border-contrast-dark py-3 mb-4 text-zinc-400 font-bold">
                <span className="flex items-center justify-center gap-1.5">
                  <Bed className="h-4 w-4 text-[#d4ff4d]" />
                  <span>{selectedListing.bedrooms} Bed</span>
                </span>
                <span className="flex items-center justify-center gap-1.5">
                  <Bath className="h-4 w-4 text-[#d4ff4d]" />
                  <span>{selectedListing.bathrooms} Bath</span>
                </span>
                <span className="flex items-center justify-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#d4ff4d]" />
                  <span>Avail: {new Date(selectedListing.availabilityDate).toLocaleDateString()}</span>
                </span>
              </div>

              <div className="space-y-1 mb-6 text-zinc-400 leading-relaxed">
                <span className="text-zinc-200 font-bold">Listing Description:</span>
                <p className="text-zinc-350 leading-relaxed whitespace-pre-wrap">{selectedListing.description}</p>
              </div>
            </div>

            {/* Approach landlord interaction panel */}
            <div className="border-t border-contrast-dark pt-4">
              {isVerified ? (
                currentUser.subscription ? (
                  <form onSubmit={handleInitiateApproach} className="space-y-3.5">
                    <div className="rounded-lg bg-[#d4ff4d]/5 border border-[#d4ff4d]/10 p-3.5 text-[#d4ff4d] font-bold text-[11px] leading-relaxed">
                      Contact Vetted Landlord. This initial connection will deduct <strong>1 approach credit</strong> from your subscription.
                    </div>
                    <div>
                      <label className="block text-zinc-400 font-bold mb-1.5">Write your introduction message:</label>
                      <textarea
                        required
                        rows={3}
                        value={firstMessageContent}
                        onChange={(e) => setFirstMessageContent(e.target.value)}
                        placeholder="Introduce yourself, your arrival date, visa permit status, and relocation parameters..."
                        className="w-full rounded-lg px-3 py-2.5 glass-input text-white text-xs resize-none"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-lg neon-btn-primary py-2.5 text-center font-bold text-black flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Deduct Credit & Start Chat</span>
                    </button>
                  </form>
                ) : (
                  <div className="rounded-xl bg-zinc-950 p-4 border border-contrast-dark text-zinc-400 text-center font-bold">
                    <p className="mb-2">You need an active subscription package to approach property owners.</p>
                    <button
                      onClick={() => {
                        setSelectedListing(null);
                        setActiveTab("billing");
                      }}
                      className="inline-flex text-[#d4ff4d] font-bold underline hover:text-[#e2ff80] cursor-pointer"
                    >
                      Buy Subscription Package
                    </button>
                  </div>
                )
              ) : (
                <div className="rounded-xl bg-zinc-950 p-4 border border-contrast-dark text-zinc-500 text-center italic font-bold">
                  <p>Only verified tenants can contact property owners. Please submit your relocation documents in the dashboard verification checklist.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}