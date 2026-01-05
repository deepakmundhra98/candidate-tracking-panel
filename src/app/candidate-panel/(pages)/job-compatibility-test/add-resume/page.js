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
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result;

      // store everything needed
      localStorage.setItem(
        "rb_resume",
        JSON.stringify({
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64,
        })
      );

      setResumeFile(file);
    };

    reader.readAsDataURL(file); // converts file → base64
  };

  const removeFile = () => {
    setResumeFile(null);
    localStorage.removeItem("rb_resume");
  };

  return (
    <div className="p-6 relative">
      <div className="min-h-screen absolute inset-0 -z-10 bg-gradient-to-br from-[#0f1124] via-[#15172e] to-[#080912]" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-8"
      >
        <h2 className="text-2xl text-white font-semibold">Step 1: Upload Resume</h2>

        <div className="mt-10">
          {!resumeFile ? (
            <label className="flex flex-col items-center justify-center border border-dashed border-white/30 rounded-xl p-10 cursor-pointer">
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
            <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl">
              <span className="text-gray-200 truncate">
                {resumeFile.name}
              </span>
              <button onClick={removeFile} className="text-red-400">
                <DeleteOutlineIcon />
              </button>
            </div>
          )}
        </div>

        <Link href="/candidate-panel/job-compatibility-test/add-job-description">
          <motion.button
            disabled={!resumeFile}
            className={`mt-10 w-full py-3 rounded-xl ${
              resumeFile
                ? "bg-indigo-600/40 text-white"
                : "bg-gray-600/20 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continue to Job Details
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
