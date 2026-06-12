"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Upload, CheckCircle, ArrowLeft, Loader2, FileText, Image as ImageIcon, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { authApi } from "@/apis/Authentication/auth";
import { listingsApi } from "@/apis/Listings/listings";
import { verificationApi } from "@/apis/Verification/verification";

export default function NewListingView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Listing Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rent, setRent] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [bedrooms, setBedrooms] = useState("1");
  const [bathrooms, setBathrooms] = useState("1");
  const [availabilityDate, setAvailabilityDate] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    authApi.me()
      .then((res) => res.data)
      .then((data) => {
        if (!data || !data.authenticated || data.user.role !== "OWNER") {
          router.push("/login");
        } else if (data.user.verificationStatus !== "VERIFIED") {
          router.push("/owner/dashboard");
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingFile(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await verificationApi.upload(formData);

      if (!data || !data.url) {
        setError("Image upload failed. Please try again.");
        setUploadingFile(false);
        return;
      }

      setPhotos((prev) => [...prev, data.url]);
      setUploadingFile(false);
    } catch (err) {
      setError("Server connection failed during image upload.");
      setUploadingFile(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!title || !description || !rent || !location || !city || !availabilityDate) {
      setError("Please fill out all required fields.");
      setSubmitting(false);
      return;
    }

    if (photos.length === 0) {
      setError("Please upload at least one photo of the property.");
      setSubmitting(false);
      return;
    }

    const payload = {
      title,
      description,
      rent: parseFloat(rent),
      location,
      city,
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      availabilityDate: new Date(availabilityDate).toISOString(),
      photos,
    };

    try {
      const { data } = await listingsApi.create(payload);

      if (!data) {
        setError("Failed to create property listing. Please verify inputs.");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setSubmitting(false);
      setTimeout(() => {
        router.push("/owner/dashboard");
      }, 2000);
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Server connection failed.";
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

      <main className="flex-grow mx-auto max-w-2xl w-full px-4 py-12 sm:px-6 relative z-10">
        <div className="mb-6">
          <button
            onClick={() => router.push("/owner/dashboard")}
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#8a7d6a] hover:text-[#2c2724] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {success ? (
          <div className="glass-panel p-8 rounded-2xl border border-[#eae1d3] bg-white shadow-2xl text-center py-12 flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-emerald-50 border border-emerald-200 p-4 text-emerald-600 mb-2">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-bold font-serif text-[#2c2724]">Property Listing Submitted!</h2>
            <p className="text-xs text-[#8a7d6a] max-w-sm leading-relaxed">
              Your property has been successfully submitted for review. It will become visible on the marketplace once approved by the administrators.
            </p>
            <p className="text-[10px] text-zinc-400">Redirecting to dashboard...</p>
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-2xl border border-[#eae1d3] bg-white shadow-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold font-serif text-[#2c2724]">List Your Property</h1>
              <p className="text-xs text-[#8a7d6a] mt-1">
                Provide comprehensive details and photos to help newcomers secure trusted housing.
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-300 p-3.5 text-xs text-red-700 font-medium">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div>
                <label className="block text-[#5c544d] font-bold mb-1.5">Property Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Elegant 2-Bedroom Suite in Downtown Vancouver"
                  className="w-full rounded-lg border border-[#eae1d3] px-3.5 py-3 bg-white text-[#2c2724] placeholder-slate-400 focus:outline-none focus:border-[#cfa052]"
                />
              </div>

              <div>
                <label className="block text-[#5c544d] font-bold mb-1.5">Property Description *</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your property (utilities, local transit, parking, rules, ideal tenant profile)..."
                  className="w-full rounded-lg border border-[#eae1d3] px-3.5 py-3 bg-white text-[#2c2724] placeholder-slate-400 focus:outline-none focus:border-[#cfa052] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#5c544d] font-bold mb-1.5">Monthly Rent (CAD) *</label>
                  <input
                    type="number"
                    required
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    placeholder="e.g. 2100"
                    className="w-full rounded-lg border border-[#eae1d3] px-3.5 py-3 bg-white text-[#2c2724] placeholder-slate-400 focus:outline-none focus:border-[#cfa052]"
                  />
                </div>
                <div>
                  <label className="block text-[#5c544d] font-bold mb-1.5">Availability Date *</label>
                  <input
                    type="date"
                    required
                    value={availabilityDate}
                    onChange={(e) => setAvailabilityDate(e.target.value)}
                    className="w-full rounded-lg border border-[#eae1d3] px-3.5 py-3 bg-white text-[#2c2724] focus:outline-none focus:border-[#cfa052]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#5c544d] font-bold mb-1.5">Location Address *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. 456 Robson St"
                    className="w-full rounded-lg border border-[#eae1d3] px-3.5 py-3 bg-white text-[#2c2724] placeholder-slate-400 focus:outline-none focus:border-[#cfa052]"
                  />
                </div>
                <div>
                  <label className="block text-[#5c544d] font-bold mb-1.5">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Vancouver"
                    className="w-full rounded-lg border border-[#eae1d3] px-3.5 py-3 bg-white text-[#2c2724] placeholder-slate-400 focus:outline-none focus:border-[#cfa052]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#5c544d] font-bold mb-1.5">Bedrooms *</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full rounded-lg border border-[#eae1d3] p-3 bg-white text-[#2c2724] focus:outline-none focus:border-[#cfa052] cursor-pointer"
                  >
                    <option value="1">1 Bed</option>
                    <option value="2">2 Beds</option>
                    <option value="3">3 Beds</option>
                    <option value="4">4+ Beds</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#5c544d] font-bold mb-1.5">Bathrooms *</label>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full rounded-lg border border-[#eae1d3] p-3 bg-white text-[#2c2724] focus:outline-none focus:border-[#cfa052] cursor-pointer"
                  >
                    <option value="1">1 Bath</option>
                    <option value="2">2 Baths</option>
                    <option value="3">3+ Baths</option>
                  </select>
                </div>
              </div>

              {/* Photos Section */}
              <div className="space-y-3 pt-2">
                <label className="block text-[#5c544d] font-bold">Property Photos *</label>
                
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#eae1d3] border-dashed rounded-xl cursor-pointer bg-white hover:bg-[#fcfbf9] transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploadingFile ? (
                        <Loader2 className="h-6 w-6 animate-spin text-[#cfa052]" />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                          <p className="mb-1 text-[11px] text-slate-500 font-bold">Click to upload property image</p>
                          <p className="text-[10px] text-slate-400">PNG, JPG or JPEG (max 5MB)</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
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
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-[#eae1d3] h-20 bg-zinc-950">
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
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t border-[#eae1d3] pt-5 mt-6">
                <button
                  type="button"
                  onClick={() => router.push("/owner/dashboard")}
                  className="rounded-lg border border-[#eae1d3] bg-white px-5 py-2.5 font-bold text-[#5c544d] hover:bg-slate-50 hover:text-[#2c2724] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingFile}
                  className="rounded-lg bg-[#cfa052] hover:bg-[#b58942] text-white px-6 py-2.5 font-bold disabled:bg-[#eae1d3] disabled:text-[#8a7d6a] transition-all cursor-pointer shadow-[0_4px_10px_rgba(207,160,82,0.3)]"
                >
                  {submitting ? "Submitting..." : "Submit Listing"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
