"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import Cookies from "js-cookie";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([
    {
      id: 1,
      title: "Senior Product Designer",
      company: "TechCorp",
      location: "San Francisco, CA",
      type: "Full-time",
      posted: "2 days ago",
      salary: "$120,000 - $150,000",
      logo: "https://via.placeholder.com/40",
    },
    {
      id: 2,
      title: "UX/UI Designer",
      company: "DesignHub",
      location: "Remote",
      type: "Contract",
      posted: "1 week ago",
      salary: "$80 - $100/hr",
      logo: "https://via.placeholder.com/40/0000FF/FFFFFF?text=DH",
    },
    {
      id: 3,
      title: "Lead Product Designer",
      company: "InnovateX",
      location: "New York, NY",
      type: "Full-time",
      posted: "3 days ago",
      salary: "$140,000 - $180,000",
      logo: "https://via.placeholder.com/40/FF0000/FFFFFF?text=IX",
    },
  ]);

  const token = Cookies.get("tokenCandidate");

  const getSavedJobs = async () => {
    // Fetch saved jobs from API or local storage
    try {
      const response = await axios.post(BaseAPI + "/admin/get-save-job-data", null,{
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }
      })

      if(response.data.status === 200) {
        setSavedJobs(response.data.response);
      }
    } catch (error) {
      console.error("Error fetching saved jobs:", error.message);
    }
  }

  useEffect(() => {
    getSavedJobs();
  }, []);

  const removeJob = (id) => {
    setSavedJobs(savedJobs.filter((job) => job.id !== id));
  };

  return (
    <div className="p-6 relative">

      {/* Background gradients */}
      <div className="min-h-screen absolute inset-0 -z-10 bg-gradient-to-br from-[#0f1124] via-[#16182e] to-[#090a14]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/30 blur-[120px] rounded-full" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-fuchsia-500/20 blur-[140px] rounded-full" />

      {/* TITLE CARD */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-w-7xl mx-auto mb-6 p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-2xl shadow-xl neon-card"
      >
        <h2 className="text-3xl font-semibold tracking-wide text-white">Saved Jobs</h2>
        <p className="text-gray-300 mt-1">Your saved job opportunities.</p>
      </motion.div>

      {/* JOB LIST */}
      <div className="max-w-7xl mx-auto space-y-6">
        <AnimatePresence>
          {savedJobs.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 neon-card"
            >
              <svg
                className="mx-auto h-12 w-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>

              <h3 className="mt-4 text-xl font-semibold text-white">
                No saved jobs found
              </h3>

              <p className="text-gray-300 mt-2">
                Save jobs to revisit them anytime.
              </p>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="mt-6 px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 
                text-white font-medium shadow-lg hover:shadow-purple-500/40 transition"
              >
                Browse Jobs
              </motion.button>
            </motion.div>
          ) : (
            savedJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.03 }}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 
                shadow-xl hover:shadow-indigo-500/30 transition neon-card cursor-pointer"
              >
                <div className="flex justify-between items-start">

                  {/* LEFT SECTION */}
                  <div className="flex gap-4">
                    <img
                      src={job.logo}
                      alt="logo"
                      className="h-16 w-16 rounded-full border border-white/20 shadow-lg object-cover"
                    />

                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {job.job_title}
                      </h3>

                      <div className="flex flex-wrap text-sm text-gray-300 gap-2 mt-1">
                        <span className="font-medium text-indigo-300">
                          {job.company_name}
                        </span>
                        <span>• {job.location}</span>
                        <span>• {job.type}</span>
                      </div>

                      <div className="flex gap-4 text-sm text-gray-400 mt-2">
                        <span>{job.posted_date}</span>
                        <span>• {job.salary}</span>
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 
                      text-white shadow-md hover:shadow-purple-400/40 transition"
                    >
                      Apply
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => removeJob(job.id)}
                      className="p-2 rounded-full bg-white/10 border border-white/20 text-gray-300 
                      hover:bg-white/20 hover:text-white shadow-inner transition"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 
                        1.414L11.414 10l4.293 4.293a1 1 
                        0 01-1.414 1.414L10 11.414l-4.293 
                        4.293a1 1 0 01-1.414-1.414L8.586 
                        10 4.293 5.707a1 1 0 010-1.414z" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Neon glow style */}
      <style>{`
        .neon-card {
          box-shadow:
            0 0 20px rgba(99, 102, 241, 0.15),
            inset 0 0 15px rgba(255, 255, 255, 0.04),
            0 0 35px rgba(168, 85, 247, 0.18);
        }
      `}</style>
    </div>
  );
}
