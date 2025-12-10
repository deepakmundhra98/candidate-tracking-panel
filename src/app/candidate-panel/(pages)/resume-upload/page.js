"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsFileEarmarkPdf, BsTrash } from "react-icons/bs";

export default function ResumeUpload() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeURL, setResumeURL] = useState(null);


  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeFile(file);
    setResumeURL(URL.createObjectURL(file)); // preview in browser
  };

  const handleDelete = () => {
    setResumeFile(null);
    setResumeURL(null);
  };

  return (
    <div className="p-6 relative">

      {/* Background Z-layers & Futuristic Blur Effects */}
      <div className="min-h-screen absolute inset-0 -z-10 bg-gradient-to-br from-[#0f1124] via-[#15172e] to-[#080912]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/25 blur-[120px] rounded-full" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/25 blur-[140px] rounded-full" />

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-4xl mx-auto backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 
        neon-card overflow-hidden"
      >

        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-white/10 pb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white tracking-wide">
              Resume Upload
            </h2>
            <p className="text-sm text-gray-300 mt-1">
              Upload your resume and manage it below.
            </p>
          </div>
        </div>

        {/* UPLOAD SECTION */}
        <div className="pt-8">
          <label className="block text-gray-300 text-sm font-medium mb-3">
            Upload Resume (PDF or DOCX)
          </label>

          <motion.label
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex flex-col items-center justify-center border border-dashed border-purple-400/40 
            bg-white/5 hover:bg-white/10 transition cursor-pointer p-8 rounded-xl text-gray-300"
          >
            <span className="text-lg">Drag & Drop or Click to Upload</span>
            <span className="text-sm opacity-70 mt-1">(Max size: 5MB)</span>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleUpload}
              className="hidden"
            />
          </motion.label>
        </div>

        {/* SHOW UPLOADED RESUME */}
        <AnimatePresence>
          {resumeFile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="mt-10 p-5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-lg"
            >
              <div className="flex items-center justify-between">
                {/* Left Side - File Info */}
                <div className="flex items-center space-x-4">
                  <BsFileEarmarkPdf className="text-red-400 text-4xl" />

                  <div>
                    <p className="text-gray-100 font-medium">{resumeFile.name}</p>
                    <p className="text-gray-400 text-xs">
                      {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                    {/* Link to open resume */}
                    {resumeURL && (
                      <a
                        href={resumeURL}
                        target="_blank"
                        className="text-indigo-300 text-xs underline mt-1 inline-block"
                      >
                        View Resume
                      </a>
                    )}
                  </div>
                </div>

                {/* Delete Button */}
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDelete}
                  className="p-3 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 hover:bg-red-500/30"
                >
                  <BsTrash className="text-lg" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* CUSTOM CYBER GLOW CSS */}
      <style>{`
        .neon-card {
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.15), 
                      inset 0 0 15px rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
}
