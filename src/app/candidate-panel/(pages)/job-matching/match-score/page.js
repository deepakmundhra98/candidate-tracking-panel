"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BsCheckCircle, BsExclamationTriangle } from "react-icons/bs";

export default function MatchingScore() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // TEMP — Replace with your actual score logic
  const [score, setScore] = useState(0);

  /** LOAD PREVIOUS STEP DATA (if saved) */
  useEffect(() => {
    const saved = localStorage.getItem("rb_jobDetails");
    if (saved) {
      const parsed = JSON.parse(saved);
      setJobTitle(parsed.jobTitle);
      setJobDescription(parsed.jobDescription);

      // TEMP: Generate random score for now
      setScore(Math.floor(Math.random() * (95 - 55 + 1)) + 55);
    }
  }, []);

  return (
    <div className="p-6 relative">

      {/* BACKGROUND */}
      <div className="min-h-screen absolute inset-0 -z-10 bg-gradient-to-br from-[#0f1124] via-[#1a1c33] to-[#090c1b]" />
      <div className="absolute top-20 left-20 w-80 h-80 bg-indigo-600/25 blur-[150px] rounded-full" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/25 blur-[170px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto backdrop-blur-3xl bg-white/10 border border-white/20 
         shadow-xl rounded-3xl p-10 neon-card"
      >
        {/* HEADER */}
        <h1 className="text-3xl font-semibold text-white tracking-wide text-center">
          Resume Matching Score
        </h1>
        <p className="text-gray-300 text-sm text-center mt-2 mb-12">
          Based on your resume content and the job requirements
        </p>

        {/* SCORE CIRCLE */}
        <div className="flex justify-center mb-12">
          <motion.div
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="w-48 h-48 rounded-full border-4 border-indigo-400/50 
                       flex flex-col items-center justify-center 
                       bg-indigo-600/20 shadow-lg"
          >
            <p className="text-5xl font-bold text-indigo-300">{score}</p>
            <p className="text-gray-300 text-xs tracking-wide mt-1">MATCH SCORE</p>
          </motion.div>
        </div>

        {/* JOB INFO */}
        <div className="space-y-8">

          <div className="bg-white/10 border border-white/20 p-6 rounded-2xl backdrop-blur-xl">
            <p className="text-indigo-300 text-sm font-semibold">Job Title</p>
            <p className="text-gray-200 text-lg mt-1">{jobTitle}</p>
          </div>

          <div className="bg-white/10 border border-white/20 p-6 rounded-2xl backdrop-blur-xl">
            <p className="text-indigo-300 text-sm font-semibold">Job Description</p>
            <p className="text-gray-200 text-base mt-1 leading-7">
              {jobDescription}
            </p>
          </div>
        </div>

        {/* ANALYSIS SECTIONS */}
        <div className="grid grid-cols-2 gap-8 mt-12">

          {/* STRENGTHS */}
          <div className="p-6 rounded-2xl bg-green-600/10 border border-green-400/20 backdrop-blur-xl">
            <h3 className="text-green-300 text-lg font-semibold flex items-center gap-2">
              <BsCheckCircle className="text-xl" />
              Strengths
            </h3>
            <ul className="list-disc list-inside text-gray-200 mt-3 space-y-1">
              <li>Strong alignment with job title</li>
              <li>Relevant skills detected in resume</li>
              <li>Matching keywords found</li>
            </ul>
          </div>

          {/* WEAKNESS */}
          <div className="p-6 rounded-2xl bg-red-600/10 border border-red-400/20 backdrop-blur-xl">
            <h3 className="text-red-300 text-lg font-semibold flex items-center gap-2">
              <BsExclamationTriangle className="text-xl" />
              Improvement Areas
            </h3>
            <ul className="list-disc list-inside text-gray-200 mt-3 space-y-1">
              <li>Missing important keywords</li>
              <li>Low description alignment</li>
              <li>Optional skills not found</li>
            </ul>
          </div>

        </div>

        {/* BUTTON */}
        <div className="mt-14 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-14 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white 
                       text-lg font-medium rounded-xl shadow-lg hover:shadow-purple-500/40"
          >
            Continue →
          </motion.button>
        </div>

      </motion.div>

      <style>{`
        .neon-card {
          box-shadow: 0 0 40px rgba(139,92,246,0.25),
                      inset 0 0 20px rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
}
