"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SummaryStep() {
  const router = useRouter();
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("rb_summary");
    if (raw) setSummary(raw);
  }, []);

  const countWords = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleNext = () => {
    const words = countWords(summary);
    if (words < 15) {
      setError(`Please enter at least 15 words. Current: ${words}`);
      setShake(true); setTimeout(()=>setShake(false),400); return;
    }
    localStorage.setItem("rb_summary", summary);
    router.push("/candidate-panel/resume-builder/final-resume-preview");
  };

  const handleBack = () => {
    localStorage.setItem("rb_summary", summary);
    router.push("/candidate-panel/resume-builder/add-achievements-and-certifications");
  };

  return (
    <div className="p-6 relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0f1124] via-[#15172e] to-[#090c1b]" />
      <div className="absolute top-20 left-20 w-80 h-80 bg-indigo-600/25 blur-[150px] rounded-full" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/25 blur-[170px] rounded-full" />

      <motion.div initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} transition={{duration:0.6}}
        className={`min-w-[900px] backdrop-blur-3xl bg-white/10 border border-white/20 shadow-xl rounded-3xl p-10 neon-card ${shake ? "animate-shake" : ""}`}>

        <h1 className="text-3xl font-semibold text-white text-center">Step 7: Professional Summary</h1>
        <p className="text-gray-300 text-sm text-center mt-2 mb-6">Write a strong professional summary (minimum 30 words).</p>

        <textarea value={summary} onChange={(e)=>{ setSummary(e.target.value); setError(""); }} rows={14}
          className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-gray-100 focus:ring-2 focus:ring-indigo-500" placeholder="Write your professional summary here..." />

        <p className="text-sm text-gray-300 mt-2">Word count: <span className="font-medium">{(summary||"").trim().split(/\s+/).filter(Boolean).length}</span></p>
        {error && <p className="text-red-400 mt-2">{error}</p>}

        <div className="mt-8 flex justify-between">
          <button onClick={handleBack} className="px-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white">Back</button>
          <button onClick={handleNext} className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl">Next →</button>
        </div>
      </motion.div>

      <style>{`
        .neon-card { box-shadow: 0 0 40px rgba(139,92,246,0.25), inset 0 0 20px rgba(255,255,255,0.05); }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        @keyframes shake { 0%{transform:translateX(0)}25%{transform:translateX(-6px)}50%{transform:translateX(6px)}75%{transform:translateX(-4px)}100%{transform:translateX(0)} }
      `}</style>
    </div>
  );
}
