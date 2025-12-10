"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function StepTwo() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const router = useRouter();

  /** CLEAR ERROR ON CHANGE */
  const handleChange = (field, value) => {
    if (field === "jobTitle") setJobTitle(value);
    if (field === "jobDescription") setJobDescription(value);

    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  /** VALIDATE LIKE EDUCATION COMPONENT */
  const validate = () => {
    const temp = {};

    if (!jobTitle.trim()) temp.jobTitle = "Job title is required.";
    if (!jobDescription.trim()) temp.jobDescription = "Job description is required.";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  /** ON SUBMIT */
  const handleGenerate = () => {
    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 350);
      return;
    }

    console.log("Form valid → Generate score!");

    router.push("/candidate-panel/job-matching/match-score");
  };

  return (
    <div className="p-6 relative">

      {/* Background */}
      <div className="min-h-screen absolute inset-0 -z-10 bg-gradient-to-br from-[#0f1124] via-[#15172e] to-[#080912]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/25 blur-[120px] rounded-full" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/25 blur-[140px] rounded-full" />

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className={`max-w-4xl mx-auto backdrop-blur-2xl bg-white/10 border border-white/20 
                     shadow-2xl rounded-2xl p-8 neon-card ${shake ? "animate-shake" : ""}`}
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

        {/* FORM FIELDS */}
        <div className="mt-10 space-y-7">

          {/* JOB TITLE */}
          <div>
            <label className="text-gray-300 text-sm font-medium">Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
              className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100 
                ${errors.jobTitle ? "border-red-400" : "border-white/20"}`}
              placeholder="Software Engineer"
            />

            {errors.jobTitle && (
              <p className="text-red-400 text-sm mt-1">{errors.jobTitle}</p>
            )}
          </div>

          {/* JOB DESCRIPTION */}
          <div>
            <label className="text-gray-300 text-sm font-medium">Job Description</label>
            <textarea
              rows="6"
              value={jobDescription}
              onChange={(e) => handleChange("jobDescription", e.target.value)}
              className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100 
                ${errors.jobDescription ? "border-red-400" : "border-white/20"}`}
              placeholder="Enter job description"
            ></textarea>

            {errors.jobDescription && (
              <p className="text-red-400 text-sm mt-1">{errors.jobDescription}</p>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGenerate}
          className="mt-10 w-full py-3 rounded-xl bg-indigo-600/30 
            border border-indigo-400/40 text-indigo-200 font-medium hover:bg-indigo-600/40"
        >
          Generate Matching Score
        </motion.button>
      </motion.div>

      {/* STYLES */}
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
          box-shadow:
            0 0 30px rgba(99, 102, 241, 0.15),
            inset 0 0 15px rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
}
