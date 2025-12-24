"use client";

import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";

export default function ATSResultPage() {
  const params = useSearchParams();
  const router = useRouter();

  // Normally this will come from backend
  const score = Number(params.get("score")) || 72;

  // Mocked analysis (replace with API response later)
  const strengths = [
    "Strong keyword alignment with job titles",
    "Well-structured work experience section",
    "Clear and concise bullet points",
  ];

  const improvements = [
    "Add more role-specific technical keywords",
    "Improve resume summary impact",
    "Include measurable achievements (numbers, metrics)",
  ];

  const sectionScores = [
    { name: "Summary", value: 60 },
    { name: "Experience", value: 85 },
    { name: "Skills", value: 70 },
    { name: "Education", value: 80 },
  ];

  const keywordStats = {
    matched: 18,
    missing: 7,
    total: 25,
  };

  const scoreGradient =
    score >= 80
      ? "from-green-400 to-emerald-500"
      : score >= 60
      ? "from-yellow-400 to-orange-500"
      : "from-red-400 to-rose-500";

  return (
    <div className="relative min-h-screen p-6">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-[#0d1027]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/25 blur-[120px] rounded-full" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/25 blur-[140px] rounded-full" />

      <div className="max-w-6xl mx-auto space-y-12">

        {/* SCORE HERO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 neon-card"
        >
          <h1 className="text-4xl font-bold text-white">
            Your ATS Compatibility Score
          </h1>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`mx-auto mt-8 w-44 h-44 rounded-full 
            bg-gradient-to-br ${scoreGradient}
            flex items-center justify-center text-5xl font-bold text-white shadow-xl`}
          >
            {score}%
          </motion.div>

          <p className="mt-6 text-gray-300 text-lg max-w-xl mx-auto">
            Your resume is evaluated based on ATS readability, keyword relevance,
            formatting, and section structure.
          </p>
        </motion.div>

        {/* STRENGTHS & IMPROVEMENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* STRENGTHS */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 neon-card"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              Strengths
            </h3>

            <ul className="space-y-3">
              {strengths.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-200">
                  <span className="mt-1 h-2 w-2 bg-green-400 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* IMPROVEMENTS */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 neon-card"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              Improvement Areas
            </h3>

            <ul className="space-y-3">
              {improvements.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-200">
                  <span className="mt-1 h-2 w-2 bg-red-400 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* KEYWORD MATCH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 neon-card"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Keyword Match Overview
          </h3>

          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-green-400">
                {keywordStats.matched}
              </p>
              <p className="text-gray-400 text-sm">Matched</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-400">
                {keywordStats.missing}
              </p>
              <p className="text-gray-400 text-sm">Missing</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-400">
                {keywordStats.total}
              </p>
              <p className="text-gray-400 text-sm">Total Keywords</p>
            </div>
          </div>
        </motion.div>

        {/* SECTION SCORES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 neon-card"
        >
          <h3 className="text-xl font-semibold text-white mb-6">
            Resume Section Analysis
          </h3>

          <div className="space-y-4">
            {sectionScores.map((section, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm text-gray-300 mb-1">
                  <span>{section.name}</span>
                  <span>{section.value}%</span>
                </div>

                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${section.value}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/candidate-panel/resume-builder")}
            className="px-10 py-4 rounded-xl bg-gradient-to-r 
            from-indigo-500 to-purple-600 text-white shadow-lg"
          >
            Improve Resume
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/candidate-panel/ats-score/add-resume")}
            className="px-10 py-4 rounded-xl bg-white/10 border border-white/20 
            text-gray-200 hover:bg-white/20"
          >
            Check Another Resume
          </motion.button>
        </div>
      </div>

      {/* GLOW */}
      <style>{`
        .neon-card {
          box-shadow:
            0 0 30px rgba(99,102,241,0.25),
            inset 0 0 12px rgba(255,255,255,0.03);
        }
      `}</style>
    </div>
  );
}
