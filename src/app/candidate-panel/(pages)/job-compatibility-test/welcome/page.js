"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
// import { fetchCandidates } from "../../../../store/candidate/candidateSlice";
import { BsLinkedin, BsPencilSquare, BsUpload } from "react-icons/bs";
import { BsArrowRight } from "react-icons/bs";

export default function ResumeBuilderSelect() {
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  //   useEffect(() => {
  //     dispatch(fetchCandidates());
  //   }, [dispatch]);

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

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-between items-start"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
              Job Compatibility Test
            </h1>
            <p className="text-gray-400 mt-4 max-w-2xl text-lg">
              Understand how well your profile matches a job role. We analyze
              your resume against job requirements to highlight compatibility
              score, strengths, and improvement areas.{" "}
            </p>

            <div className="mt-6 h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
          </div>
        </motion.header>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="backdrop-blur-3xl bg-white/10 border border-white/20 
          shadow-xl rounded-3xl p-12 text-center neon-card"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-white">
            What You&apos;ll Get
          </h2>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: "Compatibility Score",
                desc: "See how closely your profile aligns with the job role.",
              },
              {
                title: "Strength Analysis",
                desc: "Identify skills and experiences that give you an edge.",
              },
              {
                title: "Improvement Areas",
                desc: "Get clear suggestions to improve your chances.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-2xl bg-white/10 border border-white/20
                transition-all duration-300"
              >
                <h3 className="text-lg font-medium text-white">{item.title}</h3>
                <p className="text-gray-400 mt-3 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <Link
              href="/candidate-panel/job-compatibility-test/add-resume"
              className="px-12 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 
              text-white text-lg font-medium rounded-xl shadow-lg 
              hover:shadow-purple-500/40 transition-all duration-300 
              inline-flex items-center gap-3"
            >
              Start Test
              <BsArrowRight className="text-2xl" />
            </Link>
          </motion.div>
        </motion.div>
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
