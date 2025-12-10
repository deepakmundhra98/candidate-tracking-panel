"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ResumeBuilderWelcome() {
  return (
    <div className="p-6 relative min-h-screen flex items-center justify-center">

      {/* Background Layers */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0f1124] via-[#1a1c33] to-[#090c1b]" />

      <div className="absolute top-20 left-20 w-80 h-80 bg-indigo-600/30 blur-[160px] rounded-full" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/30 blur-[180px] rounded-full" />

      {/* WELCOME CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl mx-auto backdrop-blur-3xl bg-white/10 border border-white/20 
        shadow-xl rounded-3xl p-12 text-center neon-card"
      >
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-semibold text-white tracking-wide"
        >
          Welcome to Your Resume Builder
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-gray-300 text-lg mt-4 leading-relaxed"
        >
          Create a professional, ATS-optimized resume in just a few steps.  
          We’ll guide you through everything — your personal info, experience, skills, and more!
        </motion.p>

        {/* Icon / Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 120 }}
          className="mt-10 flex justify-center"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135692.png"
            className="w-36 h-36 opacity-90 drop-shadow-2xl"
            alt="Resume Icon"
          />
        </motion.div>

        {/* CTA BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-12"
        >
          <Link
            href="/candidate-panel/resume-builder/personal-details"
            className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white 
            text-lg font-medium rounded-xl shadow-lg hover:shadow-purple-500/40 
            transition-all duration-300 inline-block"
          >
            Let&apos;s Start →
          </Link>
        </motion.div>
      </motion.div>

      {/* Custom Neon Glow CSS */}
      <style>{`
        .neon-card {
          box-shadow: 0 0 40px rgba(139, 92, 246, 0.25),
                      inset 0 0 20px rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
}
