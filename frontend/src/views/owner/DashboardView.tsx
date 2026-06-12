"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { io } from "socket.io-client";
import {
  Home, MessageSquare, ShieldCheck, MapPin, Bed, Bath,
  Calendar, ArrowRight, ArrowLeft, UserCheck, AlertTriangle, Send, Loader2,
  PlusCircle, Edit3, Eye, CheckCircle, Clock, Trash2, X, Sparkles, LogOut, Menu, Ban, Upload, Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authApi } from "@/apis/Authentication/auth";
import { listingsApi } from "@/apis/Listings/listings";
import { chatApi } from "@/apis/Chats/chat";
import { verificationApi } from "@/apis/Verification/verification";
import Logo from "@/components/Logo";

const socketServerUrl = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || "http://localhost:5000";

export default function DashboardView() {
  const router = useRouter();

  // App & Session states
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [activeTab, setActiveTab] = useState<"listings" | "approaches" | "verification">("listings");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Listings states
  const [listings, setListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [isCreatingListing, setIsCreatingListing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingListing, setEditingListing] = useState<any>(null);

  // Form states for Listing (Create / Edit)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rent, setRent] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [bedrooms, setBedrooms] = useState("1");
  const [bathrooms, setBathrooms] = useState("1");
  const [availabilityDate, setAvailabilityDate] = useState("");
  const [formError, setFormError] = useState("");
  const [submittingForm, setSubmittingForm] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Chat/Connection states
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [activeRoom, setActiveRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const cached = localStorage.getItem("nestarrival_user");
    if (cached) {
      try {
        const userObj = JSON.parse(cached);
        if (userObj.role === "OWNER") {
          setCurrentUser(userObj);
          setLoadingUser(false);
        }
      } catch (err) {
        console.error("Failed to parse cached user", err);
      }
    }

    fetchSession();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("create") === "true") {
        setIsCreatingListing(true);
        router.replace("/owner/dashboard");
      }
    }
  }, []);

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

  useEffect(() => {
    if (currentUser) {
      fetchListings();
      fetchChatRooms();
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (activeRoom) {
      fetchMessages(activeRoom.id);
    }
  }, [activeRoom]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchSession = async () => {
    try {
      const { data } = await authApi.me();
      if (!data || !data.authenticated || data.user.role !== "OWNER") {
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

  const fetchListings = async () => {
    setLoadingListings(true);
    try {
      const { data } = await listingsApi.mine();
      setListings(Array.isArray(data) ? data : (data?.listings ?? []));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingListings(false);
    }
  };

  const fetchChatRooms = async () => {
    try {
      const { data } = await chatApi.listRooms();
      setChatRooms(Array.isArray(data) ? data : (data?.rooms ?? []));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMessages = async (roomId: string) => {
    setLoadingMessages(true);
    try {
      const { data } = await chatApi.listMessages(roomId);
      setMessages(Array.isArray(data) ? data : (data?.messages ?? []));
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
        const { data: msg } = await chatApi.sendMessage({
          roomId: activeRoom.id,
          content: newMessageText,
        });
        if (msg) {
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

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSubmittingForm(true);

    if (!title || !description || !rent || !location || !city || !availabilityDate) {
      setFormError("All fields are required");
      setSubmittingForm(false);
      return;
    }

    if (photos.length === 0) {
      setFormError("At least one property image is required.");
      setSubmittingForm(false);
      return;
    }

    try {
      const { data } = await listingsApi.create({
        title,
        description,
        rent: parseFloat(rent),
        location,
        city,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        availabilityDate: new Date(availabilityDate).toISOString(),
        photos,
      });

      if (!data) {
        setFormError("Failed to create listing");
        setSubmittingForm(false);
        return;
      }

      setTitle("");
      setDescription("");
      setRent("");
      setLocation("");
      setCity("");
      setAvailabilityDate("");
      setPhotos([]);
      setIsCreatingListing(false);
      fetchListings();
      setSubmittingForm(false);
    } catch (err) {
      setFormError("Server error");
      setSubmittingForm(false);
    }
  };

  const handleCreateClick = () => {
    setTitle("");
    setDescription("");
    setRent("");
    setLocation("");
    setCity("");
    setBedrooms("1");
    setBathrooms("1");
    setAvailabilityDate("");
    setPhotos([]);
    setFormError("");
    setIsCreatingListing(true);
  };

  const handleEditClick = (listing: any) => {
    setEditingListing(listing);
    setTitle(listing.title);
    setDescription(listing.description);
    setRent(listing.rent.toString());
    setLocation(listing.location);
    setCity(listing.city || "");
    setBedrooms(listing.bedrooms.toString());
    setBathrooms(listing.bathrooms.toString());
    setAvailabilityDate(new Date(listing.availabilityDate).toISOString().split("T")[0]);
    setPhotos(listing.photos || []);
    setShowEditModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    
    // Check total count (current photos + newly selected files)
    if (photos.length + files.length > 10) {
      setFormError("You can upload a maximum of 10 photos.");
      return;
    }

    // Check size limit: each under 2 MB (2 * 1024 * 1024 bytes)
    const limit = 2 * 1024 * 1024;
    const oversized = files.some((file) => file.size > limit);
    if (oversized) {
      setFormError("Each image must be under 2 MB.");
      return;
    }

    setUploadingFile(true);
    setFormError("");

    const uploadedUrls: string[] = [];
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await verificationApi.upload(formData);

        if (!data || !data.url) {
          throw new Error("Upload response missing URL");
        }
        uploadedUrls.push(data.url);
      }

      setPhotos((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      setFormError("Server connection failed during image upload.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSubmittingForm(true);

    if (photos.length === 0) {
      setFormError("At least one property image is required.");
      setSubmittingForm(false);
      return;
    }

    try {
      const { data } = await listingsApi.update(editingListing.id, {
        title,
        description,
        rent: parseFloat(rent),
        location,
        city,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        availabilityDate,
        photos,
      });

      if (!data) {
        setFormError("Failed to update listing");
        setSubmittingForm(false);
        return;
      }

      setShowEditModal(false);
      setEditingListing(null);
      fetchListings();
      setSubmittingForm(false);
    } catch (err) {
      setFormError("Server error");
      setSubmittingForm(false);
    }
  };

  const handleArchiveListing = async (id: string) => {
    if (!confirm("Are you sure you want to archive this property listing? It will no longer appear in searches.")) return;
    try {
      const res = await listingsApi.remove(id);
      if (res.status >= 200 && res.status < 300) {
        fetchListings();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loadingUser || !currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc] text-[#0f172a]">
        <Loader2 className="h-8 w-8 animate-spin text-[#cfa052]" />
      </div>
    );
  }

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

          <div className="bg-[#fdfbf7] border border-[#f4efe6] p-4 rounded-xl text-left leading-relaxed text-slate-655 space-y-1.5">
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

  const isVerified = currentUser.verificationStatus === "VERIFIED";
  const hasPendingVerification = currentUser.verificationStatus === "PENDING_VERIFICATION";
  const isRejected = currentUser.verificationStatus === "REJECTED";

  return (
    <div className="light-theme-dashboard flex min-h-screen bg-content-dark text-[#f5f5f7]">

      {/* 1. Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-sidebar-dark border-r border-contrast-dark z-30 p-6 justify-between">
        <div className="space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Logo className="h-6 w-6 text-[#d4ff4d] transition-transform duration-300 group-hover:scale-110" />
            <span className="text-lg font-bold tracking-tight text-white">
              Nest<span className="text-[#d4ff4d]">Arrival</span>
            </span>
          </Link>

          {/* Navigation Tab Menu */}
          <div className="space-y-1">
            <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-wider block px-2.5 mb-2">OWNER PORTAL</span>

            <button
              onClick={() => setActiveTab("listings")}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "listings"
                  ? "bg-[#d4ff4d]/5 text-[#d4ff4d] border-l-2 border-[#d4ff4d]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
                }`}
            >
              <Home className="h-4 w-4" />
              <span>My Properties</span>
            </button>

            <button
              onClick={() => setActiveTab("approaches")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "approaches"
                  ? "bg-[#d4ff4d]/5 text-[#d4ff4d] border-l-2 border-[#d4ff4d]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
                }`}
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-4 w-4" />
                <span>Tenant Inquiries</span>
              </div>
              {chatRooms.length > 0 && (
                <span className="bg-[#d4ff4d] text-black rounded-full px-1.5 py-0.5 text-[9px] font-extrabold">
                  {chatRooms.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("verification")}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "verification"
                  ? "bg-[#d4ff4d]/5 text-[#d4ff4d] border-l-2 border-[#d4ff4d]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
                }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Auditing Status</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer Profile */}
        <div className="space-y-4 pt-4 border-t border-zinc-900/80">
          <div className="px-2">
            <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block mb-1">Owner Profile</span>
            <p className="text-xs font-bold text-white truncate">{currentUser.fullName}</p>
            <p className="text-[10px] text-zinc-500 truncate">{currentUser.email}</p>
            <p className="text-[9px] text-[#d4ff4d] font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>{currentUser.verificationStatus}</span>
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
          <Logo className="h-5 w-5 text-[#d4ff4d]" />
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
                <span className="text-[9px] font-extrabold text-[#d4ff4d] uppercase tracking-wider block px-2.5 mb-2">OWNER PORTAL</span>
                <div className="space-y-1">
                  <button
                    onClick={() => { setActiveTab("listings"); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold ${activeTab === "listings" ? "bg-[#d4ff4d]/5 text-[#d4ff4d]" : "text-zinc-400"
                      }`}
                  >
                    <Home className="h-4 w-4" />
                    <span>My Properties</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("approaches"); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold ${activeTab === "approaches" ? "bg-[#d4ff4d]/5 text-[#d4ff4d]" : "text-zinc-400"
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-4 w-4" />
                      <span>Tenant Inquiries</span>
                    </div>
                    {chatRooms.length > 0 && <span className="bg-[#d4ff4d] text-black rounded-full px-1.5 py-0.5 text-[9px] font-extrabold">{chatRooms.length}</span>}
                  </button>
                  <button
                    onClick={() => { setActiveTab("verification"); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold ${activeTab === "verification" ? "bg-[#d4ff4d]/5 text-[#d4ff4d]" : "text-zinc-400"
                      }`}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Auditing Status</span>
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
        <main className="flex-grow p-6 md:p-10 relative z-10">

          {/* Verification Alert Banners */}
          {!isVerified && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl border p-4 text-xs shadow-sm flex items-start space-x-3 bg-card-dark border-contrast-dark"
            >
              <AlertTriangle className="h-5 w-5 text-[#d4ff4d] flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-bold text-white">
                  {hasPendingVerification
                    ? "Property Owner Audit In Progress"
                    : isRejected
                      ? "Verification Rejected"
                      : "Onboarding Incomplete"}
                </p>
                <p className="text-zinc-400">
                  {hasPendingVerification
                    ? "Our administration is manually validating your land deeds and municipal tax bills. Posting listings requires approval."
                    : isRejected
                      ? "Your ownership credentials did not pass our checks. Please contact Support to submit valid property deeds."
                      : "NestArrival enforces a verification-first safety model. You must complete the guided verification form to upload property listings."}
                </p>
                {!hasPendingVerification && (
                  <button
                    onClick={() => router.push("/owner/verification")}
                    className="mt-2 inline-flex font-bold text-[#d4ff4d] underline hover:text-[#e2ff80] cursor-pointer"
                  >
                    Start Verification Form
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
              transition={{ duration: 0.25 }}
            >
              {/* TAB 1: My Property Listings */}
              {activeTab === "listings" && (
                <div className="space-y-6">
                  {isCreatingListing ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-panel border border-contrast-dark p-8 rounded-2xl bg-card-dark max-w-2xl mx-auto shadow-2xl space-y-6 text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-contrast-dark pb-4">
                        <div>
                          <h2 className="text-lg font-bold text-white tracking-tight">List Your Property</h2>
                          <p className="text-xs text-zinc-400 mt-1">Provide comprehensive details and photos to help newcomers secure housing.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsCreatingListing(false)}
                          className="rounded-lg border border-zinc-800 px-3 py-1.5 font-bold text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                          <span>Back to Properties</span>
                        </button>
                      </div>

                      {formError && (
                        <div className="rounded-lg bg-red-955/35 border border-red-900/60 p-3 text-xs text-red-400 font-medium">
                          <span>{formError}</span>
                        </div>
                      )}

                      <form onSubmit={handleCreateListing} className="space-y-5 text-xs text-zinc-350">
                        <div>
                          <label className="block text-zinc-350 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Property Title *</label>
                          <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Elegant 2-Bedroom Suite in Downtown Vancouver"
                            className="w-full rounded-lg px-3.5 py-3 glass-input text-white focus:outline-none focus:border-[#d4ff4d] border border-contrast-dark bg-zinc-950/40"
                          />
                        </div>

                        <div>
                          <label className="block text-zinc-350 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Property Description *</label>
                          <textarea
                            required
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your property (utilities, transit, rules, ideal tenant)..."
                            className="w-full rounded-lg px-3.5 py-3 glass-input text-white focus:outline-none focus:border-[#d4ff4d] border border-contrast-dark resize-none bg-zinc-950/40"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-zinc-350 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Monthly Rent (CAD) *</label>
                            <input
                              type="number"
                              required
                              value={rent}
                              onChange={(e) => setRent(e.target.value)}
                              placeholder="e.g. 2100"
                              className="w-full rounded-lg px-3.5 py-3 glass-input text-white focus:outline-none focus:border-[#d4ff4d] border border-contrast-dark bg-zinc-950/40"
                            />
                          </div>
                          <div>
                            <label className="block text-zinc-350 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Availability Date *</label>
                            <input
                              type="date"
                              required
                              value={availabilityDate}
                              onChange={(e) => setAvailabilityDate(e.target.value)}
                              className="w-full rounded-lg px-3.5 py-3 glass-input text-white focus:outline-none focus:border-[#d4ff4d] border border-contrast-dark bg-zinc-950/40"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-zinc-350 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Location Address *</label>
                            <input
                              type="text"
                              required
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              placeholder="e.g. 456 Robson St"
                              className="w-full rounded-lg px-3.5 py-3 glass-input text-white focus:outline-none focus:border-[#d4ff4d] border border-contrast-dark bg-zinc-950/40"
                            />
                          </div>
                          <div>
                            <label className="block text-zinc-350 font-bold mb-1.5 uppercase tracking-wider text-[10px]">City *</label>
                            <input
                              type="text"
                              required
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              placeholder="e.g. Vancouver"
                              className="w-full rounded-lg px-3.5 py-3 glass-input text-white focus:outline-none focus:border-[#d4ff4d] border border-contrast-dark bg-zinc-950/40"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-zinc-350 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Bedrooms *</label>
                            <select
                              value={bedrooms}
                              onChange={(e) => setBedrooms(e.target.value)}
                              className="w-full rounded-lg border border-contrast-dark p-3 bg-zinc-950 text-white focus:outline-none focus:border-[#d4ff4d]"
                            >
                              <option value="1" className="bg-zinc-950">1 Bed</option>
                              <option value="2" className="bg-zinc-950">2 Beds</option>
                              <option value="3" className="bg-zinc-950">3 Beds</option>
                              <option value="4" className="bg-zinc-950">4+ Beds</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-zinc-350 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Bathrooms *</label>
                            <select
                              value={bathrooms}
                              onChange={(e) => setBathrooms(e.target.value)}
                              className="w-full rounded-lg border border-contrast-dark p-3 bg-zinc-950 text-white focus:outline-none focus:border-[#d4ff4d]"
                            >
                              <option value="1" className="bg-zinc-950">1 Bath</option>
                              <option value="2" className="bg-zinc-950">2 Baths</option>
                              <option value="3" className="bg-zinc-950">3+ Baths</option>
                            </select>
                          </div>
                        </div>

                        {/* Photos Section */}
                        <div className="space-y-3 pt-2">
                          <label className="block text-zinc-350 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Property Photos *</label>
                          
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-800 border-dashed rounded-xl cursor-pointer bg-zinc-950 hover:bg-zinc-900/40 transition-all">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {uploadingFile ? (
                                  <Loader2 className="h-6 w-6 animate-spin text-[#d4ff4d]" />
                                ) : (
                                  <>
                                    <Upload className="w-6 h-6 text-zinc-555 mb-1.5" />
                                    <p className="mb-0.5 text-[11px] text-zinc-300 font-bold">Upload property images</p>
                                    <p className="text-[10px] text-zinc-500 font-medium">Up to 10 photos, max 2MB each</p>
                                  </>
                                )}
                              </div>
                              <input
                                type="file"
                                multiple
                                disabled={uploadingFile}
                                onChange={handleImageUpload}
                                className="hidden"
                                accept="image/*"
                              />
                            </label>
                          </div>

                          {/* Uploaded Photos Grid */}
                          {photos.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                              {photos.map((url, idx) => (
                                <div key={idx} className="relative group rounded-lg overflow-hidden border border-contrast-dark h-20 bg-zinc-950">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={url}
                                    alt={`Upload ${idx + 1}`}
                                    className="w-full h-full object-cover opacity-85 group-hover:opacity-60 transition-opacity"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(idx)}
                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-red-400 font-bold bg-black/40"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end gap-3 border-t border-contrast-dark pt-5 mt-6">
                          <button
                            type="button"
                            onClick={() => setIsCreatingListing(false)}
                            className="rounded-lg border border-zinc-800 px-5 py-2.5 font-bold text-zinc-450 hover:bg-zinc-900 cursor-pointer text-zinc-400 hover:text-white text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submittingForm || uploadingFile}
                            className="rounded-lg neon-btn-primary px-6 py-2.5 font-bold text-black cursor-pointer text-xs"
                          >
                            {submittingForm ? "Submitting..." : "Submit Property"}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <h2 className="text-base font-bold text-white">Manage Properties</h2>
                        {isVerified && (
                          <button
                            onClick={handleCreateClick}
                            className="rounded-lg bg-[#d4ff4d] px-4 py-2.5 text-xs font-bold text-black hover:bg-[#e2ff80] transition-all flex items-center space-x-1.5 cursor-pointer shadow-[0_0_10px_rgba(212,255,77,0.15)]"
                          >
                            <PlusCircle className="h-4 w-4" />
                            <span>Add Property Listing</span>
                          </button>
                        )}
                      </div>

                      {loadingListings ? (
                        <div className="flex justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-[#d4ff4d]" />
                        </div>
                      ) : listings.length === 0 ? (
                        <div className="text-center py-16 bg-card-dark rounded-xl border border-contrast-dark text-xs text-zinc-500 italic">
                          You haven't added any listings yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {listings.map((item) => (
                            <div key={item.id} className="bg-card-dark border border-contrast-dark hover:border-[#d4ff4d]/30 hover:shadow-[0_0_15px_rgba(212,255,77,0.05)] transition-all flex flex-col justify-between overflow-hidden text-xs rounded-xl">
                              {/* Header Image */}
                              <div className="h-40 bg-zinc-950 flex items-center justify-center relative text-zinc-550 border-b border-contrast-dark overflow-hidden">
                                {item.photos && item.photos.length > 0 ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={item.photos[0]}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="flex flex-col items-center italic">
                                    <Home className="h-6 w-6 mb-1 text-zinc-700" />
                                    <span>No Photo Provided</span>
                                  </div>
                                )}

                                {/* Moderation status badge */}
                                <span className={`absolute top-3 right-3 rounded-lg px-2 py-0.5 text-[9px] font-bold shadow ${item.status === "APPROVED"
                                    ? "bg-emerald-950/40 border border-emerald-850 text-emerald-450"
                                    : item.status === "PENDING_REVIEW"
                                      ? "bg-[#d4ff4d]/10 border border-[#d4ff4d]/20 text-[#d4ff4d]"
                                      : item.status === "REJECTED"
                                        ? "bg-red-955 border border-red-900 text-red-400"
                                        : "bg-zinc-900 border border-zinc-800 text-zinc-400"
                                  }`}>
                                  {item.status}
                                </span>
                              </div>

                              <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase">
                                    <span>{item.city}</span>
                                    <span className="font-bold text-white font-mono">CAD ${item.rent}/mo</span>
                                  </div>
                                  <h3 className="font-bold text-white line-clamp-1">{item.title}</h3>
                                  <p className="text-zinc-400 line-clamp-2 leading-relaxed">{item.description}</p>

                                  {item.adminFeedback && (
                                    <div className="mt-2 p-2 rounded-lg bg-red-955/10 border border-red-900/40 text-[10px] text-red-400 italic leading-relaxed">
                                      <strong>Admin Feedback:</strong> {item.adminFeedback}
                                    </div>
                                  )}
                                </div>

                                <div className="px-4 pb-4 border-t border-contrast-dark pt-3 flex items-center justify-between gap-2">
                                  <button
                                    onClick={() => handleEditClick(item)}
                                    className="flex-grow rounded-lg border border-zinc-800 py-1.5 text-center font-bold text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                  >
                                    <Edit3 className="h-3.5 w-3.5" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleArchiveListing(item.id)}
                                    className="rounded-lg border border-red-900 bg-red-955/10 p-1.5 text-red-400 hover:bg-red-955/20 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* TAB 2: Tenant Inquiries & Inbox */}
              {activeTab === "approaches" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs h-[550px]">
                  {/* Sidebar inquiry list */}
                  <div className="lg:col-span-1 border border-contrast-dark bg-card-dark rounded-xl overflow-y-auto flex flex-col">
                    <div className="p-4 border-b border-contrast-dark font-bold text-white text-sm">
                      Incoming Tenant Matches
                    </div>
                    <div className="flex-grow divide-y divide-zinc-950">
                      {chatRooms.length === 0 ? (
                        <p className="p-6 text-center text-zinc-500 italic">No inquiry messages received.</p>
                      ) : (
                        chatRooms.map((room) => (
                          <button
                            key={room.id}
                            onClick={() => setActiveRoom(room)}
                            className={`w-full text-left p-4 flex flex-col gap-1 transition-all cursor-pointer ${activeRoom?.id === room.id ? "bg-[#d4ff4d]/[0.02] border-l-2 border-[#d4ff4d]" : "hover:bg-zinc-900/20"
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-zinc-200">{room.tenant.fullName}</span>
                              {room.tenant.isUrgentMatch && (
                                <span className="bg-[#d4ff4d]/10 border border-[#d4ff4d]/25 text-[#d4ff4d] text-[8px] font-extrabold uppercase rounded px-1.5 py-0.5 flex items-center gap-0.5 animate-pulse">
                                  <Sparkles className="h-2 w-2 text-[#d4ff4d]" />
                                  <span>Urgent Match</span>
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-zinc-450 font-bold truncate">{room.listing.title}</span>
                            {room.messages[0] && (
                              <p className="text-[10px] text-zinc-500 line-clamp-1 italic mt-1">{room.messages[0].content}</p>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Chat discussion & tenant relocation detail cards */}
                  <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 border border-contrast-dark bg-card-dark rounded-xl overflow-hidden h-full">
                    {activeRoom ? (
                      <>
                        {/* Chat logs column */}
                        <div className="sm:col-span-2 flex flex-col justify-between h-full border-r border-contrast-dark bg-black/10">
                          <div className="p-4 border-b border-contrast-dark bg-zinc-950/40">
                            <span className="font-bold text-white text-sm">{activeRoom.tenant.fullName}</span>
                          </div>

                          <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-black/30">
                            {loadingMessages ? (
                              <div className="flex justify-center py-6">
                                <Loader2 className="h-6 w-6 animate-spin text-[#d4ff4d]" />
                              </div>
                            ) : (
                              messages.map((msg) => (
                                <div
                                  key={msg.id}
                                  className={`flex flex-col max-w-[80%] rounded-xl p-3 ${msg.senderId === currentUser.id
                                      ? "bg-[#d4ff4d]/5 border border-[#d4ff4d]/15 text-white ml-auto rounded-tr-none"
                                      : "bg-zinc-950 border border-contrast-dark text-zinc-100 mr-auto rounded-tl-none"
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

                          <form onSubmit={handleSendMessage} className="p-3 border-t border-contrast-dark flex gap-2 bg-zinc-950/40">
                            <input
                              type="text"
                              required
                              value={newMessageText}
                              onChange={(e) => setNewMessageText(e.target.value)}
                              placeholder="Write reply here..."
                              className="flex-grow rounded-lg px-3 py-2.5 glass-input text-white text-xs"
                            />
                            <button
                              type="submit"
                              disabled={sendingMsg}
                              className="rounded-lg bg-[#d4ff4d] text-black px-4 hover:bg-[#e2ff80] transition-all flex items-center justify-center cursor-pointer"
                            >
                              {sendingMsg ? <Loader2 className="h-4 w-4 animate-spin text-black" /> : <Send className="h-4 w-4" />}
                            </button>
                          </form>
                        </div>

                        {/* Tenant details profile sidebar */}
                        <div className="sm:col-span-1 bg-zinc-950/40 p-4 space-y-4 overflow-y-auto border-l border-contrast-dark">
                          <span className="font-bold text-white border-b border-contrast-dark pb-2 block">
                            Relocation Card
                          </span>

                          <div className="space-y-4">
                            <div>
                              <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block mb-0.5">ORIGIN COUNTRY</span>
                              <p className="font-bold text-zinc-200">{activeRoom.tenant.currentCountry}</p>
                            </div>
                            <div>
                              <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block mb-0.5">RELOCATION PURPOSE</span>
                              <p className="font-bold text-zinc-200">{activeRoom.tenant.purposeOfRelocation}</p>
                            </div>
                            <div>
                              <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block mb-0.5">VISAS / PERMITS STATUS</span>
                              <p className="font-bold text-zinc-200 leading-normal">{activeRoom.tenant.visaStatus} <br /><span className="text-xs text-zinc-500">({activeRoom.tenant.visaType})</span></p>
                            </div>
                            <div>
                              <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block mb-0.5">PLANNED MOVE DATE</span>
                              <p className="font-bold text-zinc-200">{activeRoom.tenant.plannedMoveDate}</p>
                            </div>
                            <div>
                              <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block mb-0.5">RENTAL EXPECTATION</span>
                              <p className="font-bold text-zinc-200">{activeRoom.tenant.expectedRentalDuration}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="sm:col-span-3 flex flex-col items-center justify-center text-zinc-500 p-8 text-center bg-black/10">
                        <MessageSquare className="h-8 w-8 mb-2 text-zinc-800" />
                        <p>Select a tenant connections inquiry card to read and write replies.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: Auditing Status */}
              {activeTab === "verification" && (
                <div className="max-w-xl mx-auto glass-panel p-6 rounded-xl border border-zinc-900 bg-zinc-950/20 text-xs shadow-xl">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-1.5">
                    <ShieldCheck className="h-5 w-5 text-[#d4ff4d]" />
                    <span>Owner Audit Summary</span>
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-950 border border-zinc-900">
                      <span className="font-bold text-zinc-500">Immigration/Residency Status:</span>
                      <span className="font-bold text-zinc-200">{currentUser.residencyStatus || "Unconfigured"}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-950 border border-zinc-900">
                      <span className="font-bold text-zinc-500">Security Credentials Status:</span>
                      <span className={`font-bold uppercase ${isVerified
                          ? "text-emerald-400"
                          : hasPendingVerification
                            ? "text-[#d4ff4d]"
                            : "text-red-400"
                        }`}>
                        {currentUser.verificationStatus}
                      </span>
                    </div>

                    {currentUser.verificationRequest?.adminNotes && (
                      <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-900 space-y-1">
                        <span className="font-bold text-zinc-450">Auditor Notes:</span>
                        <p className="text-zinc-300 leading-relaxed">{currentUser.verificationRequest.adminNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

        </main>



        {/* EDIT LISTING MODAL */}
        {showEditModal && editingListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm text-xs text-white">
            <div className="glass-panel w-full max-w-md rounded-2xl border border-zinc-900 p-6 bg-zinc-950 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-900 pb-2">
                <h2 className="text-sm font-bold text-white">Edit Property Listing</h2>
                <button onClick={() => { setShowEditModal(false); setEditingListing(null); }} className="text-zinc-500 hover:text-white cursor-pointer"><X className="h-4 w-4" /></button>
              </div>

              {formError && (
                <div className="mb-4 rounded-lg bg-red-950/20 border border-red-900 p-2.5 text-red-400">
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleUpdateListing} className="space-y-4">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1.5">Property Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg px-3 py-2.5 glass-input text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold mb-1.5">Property Description</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg px-3 py-2.5 glass-input text-white text-xs resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1.5">Monthly Rent (CAD)</label>
                    <input
                      type="number"
                      required
                      value={rent}
                      onChange={(e) => setRent(e.target.value)}
                      className="w-full rounded-lg px-3 py-2.5 glass-input text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1.5">Availability Date</label>
                    <input
                      type="date"
                      required
                      value={availabilityDate}
                      onChange={(e) => setAvailabilityDate(e.target.value)}
                      className="w-full rounded-lg px-3 py-2.5 glass-input text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1.5">Location Address</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full rounded-lg px-3 py-2.5 glass-input text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1.5">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-lg px-3 py-2.5 glass-input text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1.5">Bedrooms</label>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full rounded-lg border border-zinc-900 p-2.5 bg-zinc-950 text-white focus:outline-none focus:border-[#d4ff4d]"
                    >
                      <option value="1" className="bg-zinc-950">1 Bed</option>
                      <option value="2" className="bg-zinc-950">2 Beds</option>
                      <option value="3" className="bg-zinc-950">3 Beds</option>
                      <option value="4" className="bg-zinc-950">4+ Beds</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1.5">Bathrooms</label>
                    <select
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      className="w-full rounded-lg border border-zinc-900 p-2.5 bg-zinc-950 text-white focus:outline-none focus:border-[#d4ff4d]"
                    >
                      <option value="1" className="bg-zinc-950">1 Bath</option>
                      <option value="2" className="bg-zinc-950">2 Baths</option>
                      <option value="3" className="bg-zinc-950">3+ Baths</option>
                    </select>
                  </div>
                </div>

                {/* Photos Section */}
                <div className="space-y-3 pt-2">
                  <label className="block text-zinc-400 font-bold mb-1.5">Property Photos *</label>
                  
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-zinc-800 border-dashed rounded-xl cursor-pointer bg-zinc-950 hover:bg-zinc-900/40 transition-all">
                      <div className="flex flex-col items-center justify-center pt-3 pb-3">
                        {uploadingFile ? (
                          <Loader2 className="h-5 w-5 animate-spin text-[#d4ff4d]" />
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-zinc-500 mb-1" />
                            <p className="mb-0.5 text-[10px] text-zinc-400 font-bold">Upload property images</p>
                            <p className="text-[9px] text-zinc-500">Up to 10 photos, max 2MB each</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        multiple
                        disabled={uploadingFile}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>

                  {/* Uploaded Photos Grid */}
                  {photos.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {photos.map((url, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-zinc-800 h-14 bg-zinc-950">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={`Upload ${idx + 1}`}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-red-400 font-bold bg-black/40"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 border-t border-zinc-900 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingListing(null);
                    }}
                    className="rounded-lg border border-zinc-800 px-4 py-2 font-bold text-zinc-450 hover:bg-zinc-900 cursor-pointer text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingForm}
                    className="rounded-lg neon-btn-primary px-5 py-2 font-bold text-black cursor-pointer"
                  >
                    {submittingForm ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
