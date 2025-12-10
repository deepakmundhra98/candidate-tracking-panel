"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function PersonalDetails() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "",
    headline: "",
  });

  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  /** --------------------------------------
   * Load saved data (if user comes back)
   * -------------------------------------- */
  useEffect(() => {
    const raw = localStorage.getItem("rb_personal");
    if (raw) {
      try {
        setFormData(JSON.parse(raw));
      } catch {}
    }
  }, []);

  /** --------------------------------------
   * Handle change
   * -------------------------------------- */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  /** --------------------------------------
   * VALIDATION
   * -------------------------------------- */
  const validate = () => {
    let temp = {};

    if (!formData.first_name.trim()) temp.first_name = "First name is required.";
    if (!formData.last_name.trim()) temp.last_name = "Last name is required.";
    if (!formData.email.trim()) temp.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      temp.email = "Enter a valid email.";

    if (!formData.phone.trim()) temp.phone = "Phone number is required.";
    if (!formData.location.trim()) temp.location = "Location is required.";
    if (!formData.headline.trim())
      temp.headline = "Professional headline is required.";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  /** --------------------------------------
   * HANDLE NEXT BUTTON
   * -------------------------------------- */
  const handleNext = () => {
    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    // Save step 1 data
    localStorage.setItem("rb_personal", JSON.stringify(formData));

    // Go to next step
    router.push("/candidate-panel/resume-builder/education-details");
  };

  /** --------------------------------------
   * HANDLE BACK (Disabled because step 1)
   * -------------------------------------- */
  const handleBack = () => {
    // Nothing to go back to → can hide or keep disabled
  };

  return (
    <div className="p-6 relative min-h-screen flex items-center justify-center">
      {/* Background Layers */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0f1124] via-[#1a1c33] to-[#090c1b]" />
      <div className="absolute top-20 left-20 w-80 h-80 bg-indigo-600/30 blur-[160px] rounded-full" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/30 blur-[180px] rounded-full" />

      {/* FORM CARD */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`min-w-[800px] backdrop-blur-3xl bg-white/10 border border-white/20 
        shadow-xl rounded-3xl p-10 neon-card ${shake ? "animate-shake" : ""}`}
      >
        {/* Heading */}
        <h1 className="text-3xl font-semibold text-white tracking-wide text-center">
          Step 1: Personal Details
        </h1>
        <p className="text-gray-300 text-sm text-center mt-2 mb-10">
          Tell us a little about yourself to get started.
        </p>

        <div className="space-y-8">
          {/* Full Name */}
<div>
  <label className="text-gray-300 text-sm font-medium">
    First Name <span className="text-red-400">*</span>
  </label>
  <input
    type="text"
    name="first_name"
    value={formData.first_name}
    onChange={handleChange}
    className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100 
      ${
        errors.first_name
          ? "border-red-400 focus:ring-2 focus:ring-red-400"
          : "border-white/20 focus:ring-2 focus:ring-indigo-500"
      }`}
    placeholder="John Doe"
  />
  {errors.first_name && (
    <p className="text-red-400 text-sm mt-1">{errors.first_name}</p>
  )}
</div>
<div>
  <label className="text-gray-300 text-sm font-medium">
    Last Name <span className="text-red-400">*</span>
  </label>
  <input
    type="text"
    name="last_name"
    value={formData.last_name}
    onChange={handleChange}
    className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100 
      ${
        errors.last_name
          ? "border-red-400 focus:ring-2 focus:ring-red-400"
          : "border-white/20 focus:ring-2 focus:ring-indigo-500"
      }`}
    placeholder="John Doe"
  />
  {errors.last_name && (
    <p className="text-red-400 text-sm mt-1">{errors.last_name}</p>
  )}
</div>


{/* Email */}
<div>
  <label className="text-gray-300 text-sm font-medium">
    Email Address <span className="text-red-400">*</span>
  </label>
  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100 
      ${
        errors.email
          ? "border-red-400 focus:ring-2 focus:ring-red-400"
          : "border-white/20 focus:ring-2 focus:ring-indigo-500"
      }`}
    placeholder="john@example.com"
  />
  {errors.email && (
    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
  )}
</div>

{/* Phone */}
<div>
  <label className="text-gray-300 text-sm font-medium">
    Phone Number <span className="text-red-400">*</span>
  </label>
  <input
    type="text"
    name="phone"
    value={formData.phone}
    onChange={handleChange}
    className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100 
      ${
        errors.phone
          ? "border-red-400 focus:ring-2 focus:ring-red-400"
          : "border-white/20 focus:ring-2 focus:ring-purple-500"
      }`}
    placeholder="+91 9876543210"
  />
  {errors.phone && (
    <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
  )}
</div>

{/* Location */}
<div>
  <label className="text-gray-300 text-sm font-medium">
    Location <span className="text-red-400">*</span>
  </label>
  <input
    type="text"
    name="location"
    value={formData.location}
    onChange={handleChange}
    className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100 
      ${
        errors.location
          ? "border-red-400 focus:ring-2 focus:ring-red-400"
          : "border-white/20 focus:ring-2 focus:ring-purple-500"
      }`}
    placeholder="Mumbai, India"
  />
  {errors.location && (
    <p className="text-red-400 text-sm mt-1">{errors.location}</p>
  )}
</div>

{/* Headline */}
<div>
  <label className="text-gray-300 text-sm font-medium">
    Professional Headline <span className="text-red-400">*</span>
  </label>
  <input
    type="text"
    name="headline"
    value={formData.headline}
    onChange={handleChange}
    className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100 
      ${
        errors.headline
          ? "border-red-400 focus:ring-2 focus:ring-red-400"
          : "border-white/20 focus:ring-2 focus:ring-purple-500"
      }`}
    placeholder="Software Developer | React | Node.js"
  />
  {errors.headline && (
    <p className="text-red-400 text-sm mt-1">{errors.headline}</p>
  )}
</div>

        </div>

        {/* BUTTONS */}
        <div className="mt-12 flex justify-between">
          {/* Disabled Back Button (only for consistency) */}
          <button
            disabled
            className="px-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white opacity-40 cursor-not-allowed"
          >
            Back
          </button>

          {/* NEXT */}
          <button
            onClick={handleNext}
            className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 
            text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-purple-500/40 
            transition-all duration-300"
          >
            Next →
          </button>
        </div>
      </motion.div>

      {/* Shake & Neon CSS */}
      <style>{`
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }
        .neon-card {
          box-shadow: 0 0 40px rgba(139, 92, 246, 0.25),
                      inset 0 0 20px rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
}
