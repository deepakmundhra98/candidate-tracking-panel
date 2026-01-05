"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BsCheckCircle, BsExclamationTriangle } from "react-icons/bs";
import axios from "axios";
import Cookies from "js-cookie";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import { useRouter } from "next/navigation";

/* ----------------------------------------
   Helper: Base64 → File
---------------------------------------- */
const base64ToFile = (base64, filename, mimeType) => {
  const byteString = atob(base64.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new File([ab], filename, { type: mimeType });
};

const AnimatedDots = () => {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-3 h-3 rounded-full bg-indigo-300"
          animate={{
            opacity: [0.3, 1, 0.3],
            y: [0, -6, 0],
          }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function MatchingScore() {
  const token = Cookies.get("tokenCandidate");

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  const [score, setScore] = useState(0);
  const [improvements, setimprovements] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const raw = Cookies.get("candidateData");
  if (!raw) return null;
  const decoded = decodeURIComponent(raw);
  let actualUserData = JSON.parse(decoded);

  /* ----------------------------------------
     Load Job + Resume from localStorage
  ---------------------------------------- */
  useEffect(() => {
    const jobSaved = localStorage.getItem("rb_jobDetails");
    const resumeSaved = localStorage.getItem("rb_resume");

    if (jobSaved) {
      const parsed = JSON.parse(jobSaved);
      setJobTitle(parsed.jobTitle);
      setJobDescription(parsed.jobDescription);
    }

    if (resumeSaved) {
      const parsedResume = JSON.parse(resumeSaved);

      const file = base64ToFile(
        parsedResume.data,
        parsedResume.name,
        parsedResume.type
      );

      setResumeFile(file);
    }
  }, []);

  /* ----------------------------------------
     API Call: Get Matching Score
  ---------------------------------------- */
  const getMatchScore = async () => {
    if (!resumeFile || !jobTitle || !jobDescription) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("job_title", jobTitle);
      formData.append("job_description", jobDescription);
      formData.append("candidate_profile_id", actualUserData.id);

      const response = await axios.post(
        BaseAPI + "/admin/candidates/matchCandidateWithJob",
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Match Score Response:", response);

      if (response.data.status === true) {
        setScore(response.data.matching_percentage);
        setimprovements(response.data.improvements || []);
        setStrengths(response.data.strengths || []);
      }
    } catch (error) {
      console.error("Error calculating match score:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------
     Auto-trigger when everything is ready
  ---------------------------------------- */
  useEffect(() => {
    if (resumeFile && jobTitle && jobDescription) {
      getMatchScore();
    }
  }, [resumeFile, jobTitle, jobDescription]);

  const handleTestAgain = () => {
    // Remove stored data
    localStorage.removeItem("rb_resume");
    localStorage.removeItem("rb_jobDetails");
    localStorage.removeItem("rb_resumeFileName");

    // Optional: reset local states (clean exit)
    setResumeFile(null);
    setJobTitle("");
    setJobDescription("");
    setScore(0);

    // Redirect to first step
    router.push("/candidate-panel/job-compatibility-test/add-resume");
  };

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
        className="max-w-5xl mx-auto backdrop-blur-3xl bg-white/10 
        border border-white/20 shadow-xl rounded-3xl p-10 neon-card"
      >
        {/* HEADER */}
        <h1 className="text-3xl font-semibold text-white text-center">
          Resume Compatibility Score
        </h1>
        <p className="text-gray-300 text-sm text-center mt-2 mb-12">
          Based on your resume and job requirements
        </p>

        {/* SCORE */}
        <div className="flex justify-center mb-12">
          <motion.div
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            className="w-48 h-48 rounded-full border-4 border-indigo-400/50 
            flex flex-col items-center justify-center bg-indigo-600/20"
          >
            {/* <p className="text-5xl font-bold text-indigo-300">
              {loading ? "…" : score}
            </p> */}

            <div className="h-[48px] flex items-center justify-center">
              {loading ? (
                <AnimatedDots />
              ) : (
                <p className="text-5xl font-bold text-indigo-300">{score}</p>
              )}
            </div>

            <p className="text-gray-300 text-xs mt-1">MATCH SCORE</p>
          </motion.div>
        </div>

        {/* JOB INFO */}
        {!loading && (
          <>
            {/* JOB INFO */}
            <div className="space-y-6">
              <div className="bg-white/10 p-6 rounded-2xl">
                <p className="text-indigo-300 text-sm font-semibold">
                  Job Title
                </p>
                <p className="text-gray-200 text-lg">{jobTitle}</p>
              </div>

              <div className="bg-white/10 p-6 rounded-2xl">
                <p className="text-indigo-300 text-sm font-semibold">
                  Job Description
                </p>
                <p className="text-gray-200 leading-7">{jobDescription}</p>
              </div>

              {resumeFile && (
                <p className="text-gray-400 text-sm text-center">
                  Resume: {resumeFile.name}
                </p>
              )}
            </div>

            {/* ANALYSIS */}
            <div className="grid grid-cols-2 gap-8 mt-12">
              <div className="p-6 rounded-2xl bg-green-600/10 border border-green-400/20">
                <h3 className="text-green-300 font-semibold flex items-center gap-2">
                  <BsCheckCircle /> Strengths
                </h3>
                <ul className="list-disc list-inside text-gray-200 mt-3">
                  {Object.values(strengths).map((strength, idx) => (
                    <li key={idx}>{strength}</li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-red-600/10 border border-red-400/20">
                <h3 className="text-red-300 font-semibold flex items-center gap-2">
                  <BsExclamationTriangle /> Improvement Areas
                </h3>
                <ul className="list-disc list-inside text-gray-200 mt-3">
                  {Object.values(improvements).map((improvement, idx) => (
                    <li key={idx}>{improvement}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {!loading && (
        <div className="flex justify-center mt-14">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTestAgain}
            className="px-10 py-4 rounded-xl font-semibold text-white
        bg-gradient-to-r from-indigo-500 to-purple-600
        shadow-lg shadow-purple-500/30
        transition-all duration-300 hover:shadow-purple-500/50"
          >
            Test Again
          </motion.button>
        </div>
      )}

      <style>{`
        .neon-card {
          box-shadow: 0 0 40px rgba(139,92,246,0.25),
                      inset 0 0 20px rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
}
