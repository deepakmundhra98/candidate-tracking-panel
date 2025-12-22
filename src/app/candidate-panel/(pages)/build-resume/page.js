"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchCandidates } from "../../../../store/candidate/candidateSlice";
import { BsLinkedin, BsPencilSquare, BsUpload } from "react-icons/bs";
import { BsArrowRight } from "react-icons/bs";

export default function ResumeBuilderSelect() {
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  const { list, loading } = useSelector((state) => state.candidate);

  // console.log(list, " Candidates List");

  if (loading) return <p>Loading...</p>;

  const handleNext = () => {
    if (!selected) {
      setError("Please select an option before proceeding.");
      return;
    }
    setError("");
  };

  return (
    <div className="relative min-h-screen px-6 py-14">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0f1124] via-[#1a1c33] to-[#090c1b]" />
      <div className="absolute top-20 left-20 w-80 h-80 bg-indigo-600/30 blur-[160px] rounded-full" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/30 blur-[180px] rounded-full" />

      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Build Resume
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl text-lg">
            Choose a starting method to create your resume.
          </p>

          <div className="mt-6 h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-5xl mx-auto backdrop-blur-3xl bg-white/10 border border-white/20 
        shadow-xl rounded-3xl p-12 text-center neon-card"
        >
          

          {/* Label */}
          <p className="text-gray-300 mt-6 text-lg">
            Choose a starting method <span className="text-red-500">*</span>
          </p>

          {/* Options */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
  {[
    { id: "linkedin", label: "Pull From LinkedIn", icon: <BsLinkedin className="text-4xl mb-4" /> },
    { id: "custom", label: "Build Your Custom", icon: <BsPencilSquare className="text-4xl mb-4" /> },
    { id: "import", label: "Import From Existing", icon: <BsUpload className="text-4xl mb-4" /> },
  ].map((opt) => (
    <motion.div
      key={opt.id}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        setSelected(opt.id);
        setError("");
      }}
      className={`p-6 rounded-2xl cursor-pointer border flex flex-col items-center justify-center text-center
      transition-all duration-300 
      ${
        selected === opt.id
          ? "bg-indigo-600/40 border-indigo-400 shadow-xl"
          : "bg-white/10 border-white/20"
      }`}
    >
      <span className="text-indigo-300">
        {opt.icon}
      </span>

      <p className="text-white text-lg font-medium">
        {opt.label}
      </p>
    </motion.div>
  ))}
</div>

          {/* Error */}
          {error && <p className="text-red-400 mt-4">{error}</p>}

          {/* NEXT BUTTON */}
          <motion.div
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
  className="mt-12"
>
  {selected ? (
    <Link
      href={`/candidate-panel/${
        selected === "linkedin"
          ? "fetch-linkedin-profile"
          : selected === "custom"
          ? "resume-builder"
          : "resume-upload"
      }`}
      className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white 
      text-lg font-medium rounded-xl shadow-lg hover:shadow-purple-500/40 
      transition-all duration-300 inline-flex items-center gap-3"
    >
      Next
      <BsArrowRight className="text-2xl" />
    </Link>
  ) : (
    <button
      onClick={handleNext}
      className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white 
      text-lg font-medium rounded-xl shadow-lg hover:shadow-purple-500/40 
      transition-all duration-300 inline-flex items-center gap-3"
    >
      Next
      <BsArrowRight className="text-2xl" />
    </button>
  )}
</motion.div>
        </motion.div>

        {list?.is_resume_available === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, ease: "easeOut" }}
            className="mt-8 flex justify-center"
          >
            <Link
              href="/candidate-panel/resume-listing"
              className="group flex items-center gap-3 px-6 py-4 
      rounded-2xl bg-white/5 backdrop-blur-xl border border-white/15
      hover:bg-white/10 transition-all duration-300
      shadow-md hover:shadow-indigo-500/30"
            >
              {/* Accent Dot */}
              <span
                className="w-2.5 h-2.5 rounded-full 
        bg-gradient-to-r from-indigo-400 to-purple-500 
        animate-pulse"
              />

              <span className="text-gray-200 text-sm sm:text-base">
                You already have a resume —
                <span className="ml-1 text-indigo-300 font-medium group-hover:text-indigo-200 transition">
                  View Existing
                </span>
              </span>

              <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">
                <BsArrowRight className="text-2xl" />
              </span>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Neon style */}
      <style>{`
        .neon-card {
          box-shadow: 0 0 40px rgba(139, 92, 246, 0.25),
                      inset 0 0 20px rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
}
