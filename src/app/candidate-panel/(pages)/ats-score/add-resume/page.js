"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsFileEarmarkPdf, BsTrash } from "react-icons/bs";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function ATSResumeUpload() {
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const router = useRouter();

  /* ------------------------------------
   * Handle file selection
   * ------------------------------------ */
  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional validation
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("File too large", "Max file size is 5MB", "warning");
      return;
    }

    setResumeFile(file);
    e.target.value = ""; // allow re-select same file
  };

  /* ------------------------------------
   * Store file + redirect
   * ------------------------------------ */
  const handleCheckATS = () => {
    if (!resumeFile) return;

    setLoading(true);

    const reader = new FileReader();

    reader.onload = () => {
      try {
        localStorage.setItem(
          "rb_ats_resume",
          JSON.stringify({
            name: resumeFile.name,
            type: resumeFile.type,
            size: resumeFile.size,
            data: reader.result,
          })
        );

        router.push("/candidate-panel/ats-score/result");
      } catch (err) {
        Swal.fire("Error", "Failed to store resume", "error");
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setLoading(false);
      Swal.fire("Error", "Failed to read resume file", "error");
    };

    reader.readAsDataURL(resumeFile);
  };

  return (
    <div className="relative min-h-screen p-6">
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-[#0d1027]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/25 blur-[120px] rounded-full" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/25 blur-[140px] rounded-full" />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            ATS Score Checker
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl text-lg">
            Upload your resume and check ATS compatibility
          </p>
          <div className="mt-6 h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
        </motion.header>

        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto p-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 neon-card"
        >
          <p className="text-gray-400 mb-8">
            Upload your resume to calculate your ATS compatibility score
          </p>

          {/* UPLOAD AREA */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-10 border border-dashed 
            border-indigo-400/40 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10"
          >
            <span className="text-lg text-gray-200">
              Upload Resume (PDF / DOCX)
            </span>
            <span className="text-xs text-gray-400 mt-1">
              Max size 5MB
            </span>
          </motion.div>

          {/* HIDDEN INPUT */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleUpload}
            className="hidden"
          />

          {/* FILE PREVIEW */}
          <AnimatePresence>
            {resumeFile && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center justify-between p-4 rounded-lg 
                bg-white/10 border border-white/20"
              >
                <div className="flex items-center gap-4">
                  <BsFileEarmarkPdf className="text-red-400 text-3xl" />
                  <div>
                    <p className="text-white">{resumeFile.name}</p>
                    <p className="text-xs text-gray-400">
                      {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setResumeFile(null)}
                  className="p-2 rounded-full bg-red-500/20 
                  border border-red-400/40 text-red-300"
                >
                  <BsTrash />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <AnimatePresence>
            {resumeFile && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                onClick={handleCheckATS}
                className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r 
                from-indigo-500 to-purple-600 text-white text-lg font-medium 
                shadow-lg disabled:opacity-50"
              >
                {loading ? "Checking ATS Score..." : "Check ATS Score"}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* GLOW */}
      <style>{`
        .neon-card {
          box-shadow:
            0 0 25px rgba(99,102,241,0.25),
            inset 0 0 10px rgba(255,255,255,0.03);
        }
      `}</style>
    </div>
  );
}
