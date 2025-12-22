"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { BsDownload } from "react-icons/bs";

export default function Resume() {
  const selectedResumeId = Cookies.get("selectedResumeId");
  const token = Cookies.get("tokenCandidate");

  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const resumeRef = useRef(null);

  /* ================= GET DATA ================= */
  const getSelectedResumeData = async (id) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${BaseAPI}/admin/candidates/profile/${id}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data.profile;

      const candidateData = response.data.candidate;

      const work = (data.work || []).map((item, idx) => ({
        id: idx + 1,
        title: item.title,
        company: item.company,
        employmentType: item.employmentType,
        location: item.jobLocation,
        startDate: item.jobStartedOn,
        endDate: item.jobStillWorking ? "Present" : item.jobEndedOn,
        duration: item.duration,
        description: item.description,
      }));

      const education = (data.education || []).map((item, idx) => ({
        id: idx + 1,
        school: item.school,
        degree: item.degree,
        field: item.field,
        year: item.year,
      }));

      setResumeData({
        id: data.id,
        name: `${candidateData.first_name} ${candidateData.last_name}`,
        email: candidateData.email,
        profile_image_url: data.profile_image_url,
        summary: data.summary,
        work,
        education,
        skills: data.skills || [],
      });

    } catch (err) {
      console.log("Error fetching resume:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedResumeId && token) {
      getSelectedResumeData(selectedResumeId);
    }
  }, [selectedResumeId, token]);

  /* ================= PDF DOWNLOAD ================= */
  const downloadPDF = async () => {
    if (!resumeRef.current) return;

    const canvas = await html2canvas(resumeRef.current, {
      scale: 2,
      backgroundColor: "#0e1125",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = pdfHeight;
    let position = 0;

    while (heightLeft > 0) {
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
      position -= pdf.internal.pageSize.getHeight();
      if (heightLeft > 0) pdf.addPage();
    }

    pdf.save("My_Resume.pdf");
  };

  return (
    <div className="relative min-h-screen px-6 py-12">

      {/* BG */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0e1125] via-[#181a2d] to-[#0e1125]" />

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            flex justify-between items-center mb-10 
            bg-white/10 p-6 rounded-2xl backdrop-blur-xl border border-white/10
          "
        >
          <h2 className="text-3xl font-semibold text-white">
            Resume Preview
          </h2>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={downloadPDF}
            className="
                flex items-center gap-2
                px-6 py-2.5 rounded-lg bg-indigo-600 text-white 
                hover:bg-indigo-500 transition shadow-md
            "
          >
            <BsDownload />
            Download PDF
          </motion.button>
        </motion.div>

        {/* BODY CONTAINER */}
        <div
          ref={resumeRef}
          className="
          bg-white/10 backdrop-blur-xl border border-white/10 
          rounded-2xl p-10
          "
        >
          {/* =================== SKELETON =================== */}
          {loading && (
            <div className="animate-pulse space-y-12">

              {/* top profile skeleton */}
              <div className="flex gap-6 items-center">
                <div className="w-20 h-20 rounded-full bg-white/10" />
                <div className="space-y-3">
                  <div className="h-5 w-48 bg-white/10 rounded" />
                  <div className="h-4 w-72 bg-white/10 rounded" />
                </div>
              </div>

              {/* 2 section skeletons */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-5 w-40 bg-white/10 rounded" />
                  <div className="h-3 w-full bg-white/10 rounded" />
                  <div className="h-3 w-2/3 bg-white/10 rounded" />
                </div>
              ))}

            </div>
          )}

          {/* =================== REAL DATA =================== */}
          {!loading && resumeData && (
            <div className="space-y-16 text-white">

              {/* PROFILE */}
              <div className="flex gap-6 items-center">
                {resumeData.profile_image_url && (
                  <img
                    src={resumeData.profile_image_url}
                    className="w-20 h-20 object-cover rounded-full border border-white/20"
                  />
                )}

                <div>
                  <h2 className="text-3xl font-semibold">
                    {resumeData.name}
                  </h2>

                  <p className="text-gray-300 mt-2 max-w-2xl">
                    {resumeData.summary}
                  </p>
                </div>
              </div>

              {/* WORK HISTORY */}
              <section>
                <h3 className="text-2xl font-semibold mb-6">Experience</h3>

                {resumeData.work.map((exp) => (
                  <div key={exp.id} className="mb-8 pl-4 border-l-2 border-indigo-500">

                    <h4 className="text-xl font-semibold text-white">
                      {exp.title}
                    </h4>

                    <p className="text-indigo-300 font-medium">
                      {exp.company}
                    </p>

                    <p className="text-gray-400 text-sm">
                      {exp.startDate} – {exp.endDate}
                    </p>

                    {exp.location && (
                      <p className="text-gray-500 text-sm">{exp.location}</p>
                    )}
                  </div>
                ))}
              </section>

              {/* EDUCATION */}
              <section>
                <h3 className="text-2xl font-semibold mb-6">Education</h3>

                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="mb-6 pl-4 border-l-2 border-purple-500">

                    <h4 className="text-xl font-semibold">
                      {edu.degree}
                    </h4>

                    <p className="text-indigo-300">{edu.school}</p>
                    <p className="text-gray-400 text-sm">{edu.field}</p>
                    <p className="text-gray-500 text-sm">{edu.year}</p>

                  </div>
                ))}
              </section>

              {/* SKILLS */}
              <section>
                <h3 className="text-2xl font-semibold mb-6">Skills</h3>

                <div className="flex flex-wrap gap-3">
                  {resumeData.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="
                        px-4 py-1.5 rounded-full 
                        bg-indigo-500/20 border border-indigo-500/30 
                        text-indigo-200 text-sm font-medium
                      "
                    >
                      {skill.skill_name ? skill.skill_name : skill}
                    </span>
                  ))}
                </div>
              </section>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
