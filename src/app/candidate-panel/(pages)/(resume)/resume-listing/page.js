"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";

// const resumes = [
//   {
//     id: "product-designer",
//     title: "Senior Product Designer",
//     description: "UI/UX, design systems, product strategy",
//     updated: "Updated Sep 2025",
//   },
//   {
//     id: "frontend-engineer",
//     title: "Frontend Engineer",
//     description: "React, Next.js, performance & accessibility",
//     updated: "Updated Aug 2025",
//   },
//   {
//     id: "fullstack",
//     title: "Full Stack Developer",
//     description: "Node.js, PostgreSQL, APIs & system design",
//     updated: "Updated Jul 2025",
//   },
// ];



export default function ResumeVersions() {
  const router = useRouter();
  const [resumeList, setResumeList] = useState([]);

const token = Cookies.get("tokenCandidate");

const getResume = async() => {
    try {
        const response = await axios.post(BaseAPI + "/admin/candidates/profiles", null, {
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${token}`
            }
        })
        // setResumeList(response.dataresponse);
        const mappedResumes = response.data.response.map((item) => ({
  id: item.id,
  title:
    item.resource_type === "linkedin"
      ? "LinkedIn Resume"
      : "Custom Resume",
  description: item.summary || "No summary available",
  updated: `Updated ${item.created_at}`,
}));

setResumeList(mappedResumes);

    } catch (error) {
        console.log("Error:", error.message);
    }
}

useEffect(() => {
    getResume();
}, []);

const handleViewResume = (resumeId) => {
    Cookies.set("selectedResumeId", resumeId);
    router.push(`/candidate-panel/resume`);
}

  return (
    <div className="relative min-h-screen px-6 py-14">

      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0e1125] via-[#171a31] to-[#0d0f1c]" />
      <div className="absolute top-0 left-32 w-[28rem] h-[28rem] bg-indigo-600/25 blur-[180px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-20 w-[32rem] h-[32rem] bg-purple-500/20 blur-[200px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto">

        {/* HERO HEADER (not a card) */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Resume Versions
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl text-lg">
            Tailored resumes designed for different roles, companies, and hiring
            workflows.
          </p>

          <div className="mt-6 h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
        </motion.div>

        {/* RESUME CARDS */}
        <div className="space-y-6">
          {resumeList.map((resume, index) => (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-xl"
            >
              {/* Accent bar */}
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-purple-600" />

              <div className="p-6 sm:p-7 flex justify-between items-center max-sm:flex-col max-sm:items-start gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-indigo-300 transition">
                    {resume.title}
                  </h3>
                  <p className="text-gray-400 mt-1">
                    {resume.description}
                  </p>
                  <span className="text-sm text-indigo-400 mt-2 block">
                    {resume.updated}
                  </span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleViewResume(resume.id)}
                  className="shrink-0 px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-purple-500/40 transition"
                >
                  View
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
