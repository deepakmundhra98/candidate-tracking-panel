"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function StepTwo() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    if (!jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required.";
    }

    if (!jobDescription.trim()) {
      newErrors.jobDescription = "Job description is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (validateForm()) {
      console.log("Validation passed → Generate score");
      // Add your logic here
    }
  };

  return (
    <div className="p-6 relative">

      {/* Background */}
      <div className="min-h-screen absolute inset-0 -z-10 bg-gradient-to-br from-[#0f1124] via-[#15172e] to-[#080912]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/25 blur-[120px] rounded-full" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/25 blur-[140px] rounded-full" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="max-w-4xl mx-auto backdrop-blur-2xl bg-white/10 border border-white/20 
                   shadow-2xl rounded-2xl p-8 neon-card"
      >
        {/* Header */}
        <div className="border-b border-white/10 pb-6">
          <h2 className="text-2xl font-semibold text-white tracking-wide">
            Step 2: Job Details
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            Provide the job information to calculate your matching score.
          </p>
        </div>

        {/* FORM */}
        <div className="mt-10 space-y-7">

          {/* Job Title */}
          <div>
            <label className="text-gray-300 text-sm font-medium mb-2 block">
              Job Title
            </label>

            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Enter job title"
              className={`w-full p-3 rounded-xl bg-white/10 border 
                ${errors.jobTitle ? "border-red-400" : "border-white/20"} 
                text-gray-200 placeholder-gray-400 focus:outline-none 
                focus:border-indigo-400`}
            />

            <AnimatePresence>
              {errors.jobTitle && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.jobTitle}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Job Description */}
          <div>
            <label className="text-gray-300 text-sm font-medium mb-2 block">
              Job Description
            </label>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Enter job description"
              rows={6}
              className={`w-full p-3 rounded-xl bg-white/10 border 
                ${errors.jobDescription ? "border-red-400" : "border-white/20"} 
                text-gray-200 placeholder-gray-400 focus:outline-none 
                focus:border-indigo-400`}
            ></textarea>

            <AnimatePresence>
              {errors.jobDescription && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.jobDescription}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGenerate}
          className="mt-10 w-full py-3 rounded-xl bg-indigo-600/30 
                     border border-indigo-400/40 text-indigo-200 font-medium 
                     hover:bg-indigo-600/40 transition"
        >
          Generate Matching Score
        </motion.button>
      </motion.div>

      <style>{`
        .neon-card {
          box-shadow:
            0 0 30px rgba(99, 102, 241, 0.15),
            inset 0 0 15px rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
}
