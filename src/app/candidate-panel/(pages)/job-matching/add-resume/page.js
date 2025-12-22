"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Link from "next/link";

export default function StepOne() {
  const [resumeFile, setResumeFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const removeFile = () => {
    setResumeFile(null);
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
        className="max-w-3xl mx-auto backdrop-blur-2xl bg-white/10 
                   border border-white/20 shadow-2xl rounded-2xl p-8 neon-card"
      >
        {/* Header */}
        <div className="border-b border-white/10 pb-6">
          <h2 className="text-2xl font-semibold text-white tracking-wide">
            Step 1: Upload Resume
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            Upload your resume to calculate the matching score.
          </p>
        </div>

        {/* Upload Section */}
        <div className="mt-10">
          <label className="text-gray-300 text-sm font-medium mb-3 block">
            Resume
          </label>

          {!resumeFile ? (
            <label className="flex flex-col items-center justify-center 
                              border border-dashed border-white/30 
                              rounded-xl p-10 cursor-pointer 
                              hover:border-indigo-400 transition
                              bg-white/5">
              <UploadFileIcon className="text-indigo-300 mb-2" />
              <p className="text-gray-300 text-sm">
                Click to upload (PDF, DOC, DOCX)
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center justify-between 
                           bg-white/10 border border-white/20 
                           rounded-xl p-4"
              >
                <div className="text-gray-200 text-sm truncate">
                  {resumeFile.name}
                </div>

                <button
                  onClick={removeFile}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <DeleteOutlineIcon />
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={!resumeFile}
          className={`mt-10 w-full py-3 rounded-xl 
            border font-medium transition
            ${
              resumeFile
                ? "bg-indigo-600/30 border-indigo-400/40 text-indigo-200 hover:bg-indigo-600/40"
                : "bg-gray-600/20 border-gray-400/20 text-gray-400 cursor-not-allowed"
            }`}
        >
          <Link href="/candidate-panel/job-matching/add-job-description">
          Continue to Job Details
          </Link>
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
