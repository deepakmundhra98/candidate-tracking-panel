"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import { BsEye, BsTrash } from "react-icons/bs";
import Swal from "sweetalert2";

export default function ResumeVersions() {
  const router = useRouter();
  const [resumeList, setResumeList] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = Cookies.get("tokenCandidate");

  const getResume = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        BaseAPI + "/admin/candidates/profiles",
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const mappedResumes = response.data.response.map((item) => ({
        id: item.id,
        title:
          item.resource_type === "linkedin"
            ? "LinkedIn Resume"
            : item.resource_type === "affinda"
            ? "Uploaded Resume"
            : "Built by you",
        description: item.summary || "No summary available",
        updated: `Updated ${item.updated_at}`,
      }));

      setResumeList(mappedResumes);
    } catch (error) {
      console.log("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getResume();
  }, []);

  const handleViewResume = (resumeId) => {
    Cookies.set("selectedResumeId", resumeId);
    router.push(`/candidate-panel/resume`);
  };

  const handleDeleteResume = async (resumeId) => {
    try {
      const response = await axios.delete(
        `${BaseAPI}/admin/candidates/deleteProfile/${resumeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Resume Deleted Successfully",
          showConfirmButton: false,
          timer: 1500,
        });

        setResumeList((prev) => prev.filter((r) => r.id !== resumeId));
      }
    } catch (error) {
      console.log("Delete Error:", error.message);
    }
  };

  return (
    <div className="relative min-h-screen px-6 py-14">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0e1125] via-[#171a31] to-[#0d0f1c]" />
      <div className="absolute top-0 left-32 w-[28rem] h-[28rem] bg-indigo-600/25 blur-[180px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-20 w-[32rem] h-[32rem] bg-purple-500/20 blur-[200px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
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

        {/* CARDS */}
        <div className="space-y-6">

          {/* SKELETON LOADING */}
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-xl p-6 animate-pulse"
              >
                <div className="h-5 w-48 bg-white/10 rounded-lg" />
                <div className="h-4 w-64 bg-white/10 rounded-lg mt-3" />
                <div className="h-3 w-32 bg-white/10 rounded-lg mt-4" />

                <div className="absolute right-6 top-6 flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/10" />
                  <div className="h-10 w-10 rounded-full bg-white/10" />
                </div>
              </div>
            ))}

          {/* REAL DATA LIST */}
          {!loading &&
            resumeList.map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="relative overflow-hidden rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-xl"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-purple-600" />

                <div className="p-6 sm:p-7 flex justify-between items-center max-sm:flex-col max-sm:items-start gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white transition">
                      {resume.title}
                    </h3>
                    <p className="text-gray-400 mt-1">{resume.description}</p>
                    <span className="text-sm text-indigo-400 mt-2 block">
                      {resume.updated}
                    </span>
                  </div>

                  {/* ICON BUTTONS */}
                  <div className="flex items-center gap-3">
                    {/* VIEW BUTTON */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleViewResume(resume.id)}
                      className="
                        relative p-2 rounded-full
                        bg-indigo-500/20 border border-indigo-400/30
                        text-indigo-300 transition
                        hover:bg-indigo-500/30 hover:text-indigo-200
                        group
                      "
                    >
                      <BsEye className="text-lg" />

                      <span
                        className="
                          absolute -top-9 left-1/2 -translate-x-1/2
                          bg-black/80 text-white text-xs px-2 py-1 rounded
                          opacity-0 group-hover:opacity-100
                          pointer-events-none whitespace-nowrap
                          transition
                        "
                      >
                        View Resume
                      </span>
                    </motion.button>

                    {/* DELETE BUTTON */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteResume(resume.id)}
                      className="
                        relative p-2 rounded-full
                        bg-red-500/20 border border-red-400/30
                        text-red-300 transition
                        hover:bg-red-500/30 hover:text-red-200
                        group
                      "
                    >
                      <BsTrash className="text-lg" />

                      <span
                        className="
                          absolute -top-9 left-1/2 -translate-x-1/2
                          bg-black/80 text-white text-xs px-2 py-1 rounded
                          opacity-0 group-hover:opacity-100
                          pointer-events-none whitespace-nowrap
                          transition
                        "
                      >
                        Delete Resume
                      </span>
                    </motion.button>
                  </div>
                  {/* END ICON BUTTONS */}
                </div>
              </motion.div>
            ))}
          {/* END DATA */}
        </div>
      </div>
    </div>
  );
}
