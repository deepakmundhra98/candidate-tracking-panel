"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export default function FinalResume() {
  const router = useRouter();
  const [personal, setPersonal] = useState(null);
  const [education, setEducation] = useState([]);
  const [work, setWork] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [summary, setSummary] = useState("");
  const [downloading, setDownloading] = useState(false);
  const resumeRef = useRef(null);
  const token = Cookies.get("tokenCandidate");

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("rb_personal") || "null");
      setPersonal(p);
      const ed = JSON.parse(localStorage.getItem("rb_education") || "[]");
      setEducation(ed);
      const w = JSON.parse(localStorage.getItem("rb_work") || "[]");
      setWork(w);
      const sk = JSON.parse(localStorage.getItem("rb_skills") || "[]");
      setSkills(sk);
      const pr = JSON.parse(localStorage.getItem("rb_projects") || "[]");
      setProjects(pr);
      const ach = JSON.parse(localStorage.getItem("rb_achievements") || "[]");
      setAchievements(ach);
      const su = localStorage.getItem("rb_summary") || "";
      setSummary(su);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleBack = () => {
    router.push("/candidate-panel/resume-builder/add-professional-summary");
  };

  const buildResumePayload = () => {
    return {
      personal,
      education,
      work,
      skills,
      projects,
      achievements,
      summary,
    };
  };

  const submitToAPI = async () => {
    try {
      const payload = buildResumePayload();

      const response = await axios.post(
        BaseAPI + "/admin/candidates/save-profile",
        {
          resume: payload,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (response.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Resume Submitted",
          text: "Your resume has been submitted successfully.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: "Failed to submit resume. Please try again.",
        });
      }
    } catch (error) {
      console.error(error.message);
      alert("Something went wrong");
    }
  };

  const handleSave = async () => {
    const payload = buildResumePayload();
    console.log("Sending resume:", payload); // just to check

    await submitToAPI();

    // Clear local storage after sending
    localStorage.removeItem("rb_personal");
    localStorage.removeItem("rb_education");
    localStorage.removeItem("rb_work");
    localStorage.removeItem("rb_skills");
    localStorage.removeItem("rb_projects");
    localStorage.removeItem("rb_achievements");
    localStorage.removeItem("rb_summary");

    router.push("/candidate-panel/dashboard");
  };


  const downloadPDF = async () => {
    if (!resumeRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      // Increase scale for quality
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");

      // A4 dimension in px at 96dpi approx: 595 x 842 (but we'll compute based on canvas)
      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate image dims to fit width
      const imgProps = { width: canvas.width, height: canvas.height };
      const ratio = imgProps.width / pdfWidth;
      const imgHeight = imgProps.height / ratio;

      // If content height fits 1 page:
      if (imgHeight <= pdfHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
      } else {
        // If long, split into pages
        let heightLeft = imgHeight;
        let position = 0;
        let pageCanvasHeight = pdfHeight * ratio;
        let page = 0;

        while (heightLeft > 0) {
          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(
            pageCanvasHeight,
            canvas.height - page * pageCanvasHeight
          );
          const ctx = pageCanvas.getContext("2d");
          ctx.drawImage(
            canvas,
            0,
            page * pageCanvasHeight,
            canvas.width,
            pageCanvas.height,
            0,
            0,
            canvas.width,
            pageCanvas.height
          );
          const pageData = pageCanvas.toDataURL("image/png");
          if (page === 0) {
            pdf.addImage(
              pageData,
              "PNG",
              0,
              0,
              pdfWidth,
              pageCanvas.height / ratio
            );
          } else {
            pdf.addPage();
            pdf.addImage(
              pageData,
              "PNG",
              0,
              0,
              pdfWidth,
              pageCanvas.height / ratio
            );
          }
          heightLeft -= pageCanvasHeight;
          page++;
        }
      }

      pdf.save(`${(personal?.full_name || "resume").replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("PDF export failed", err);
      alert("Failed to generate PDF. See console for details.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-6 relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0f1124] via-[#15172e] to-[#090c1b]" />
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-4 items-center justify-between mb-6">
          <h2 className="text-white text-2xl font-semibold">
            Final Resume Preview
          </h2>
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              Back
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              Save
            </button>
            <button
              onClick={downloadPDF}
              disabled={downloading}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white"
            >
              {downloading ? "Preparing..." : "Download PDF"}
            </button>
          </div>
        </div>

        {/* Resume card to capture */}
        <div
          ref={resumeRef}
          className="p-8 rounded-2xl bg-white/5 border border-white/10 shadow-lg"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div className="flex gap-6">
            {/* Left column */}
            <div className="w-1/3 pr-6 border-r border-white/5">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">
                  {personal?.first_name} {personal?.last_name}
                </h1>
                <p className="text-sm text-gray-300 mt-2">
                  {personal?.headline}
                </p>
              </div>

              {/* Contact */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-indigo-200 mb-2">
                  Contact
                </h3>
                <p className="text-sm text-gray-300">{personal?.email}</p>
                <p className="text-sm text-gray-300">{personal?.phone}</p>
                <p className="text-sm text-gray-300">{personal?.location}</p>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-indigo-200 mb-2">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(skills) && skills.length ? (
                    skills.map((s) => (
                      <span
                        key={s.id || `${s.skill_id}-${Math.random()}`}
                        className="px-3 py-1 bg-indigo-500/10 text-indigo-200 text-xs rounded-full border border-indigo-400/10"
                      >
                        {s.skill_name || s.skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">Add skills</p>
                  )}
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-indigo-200 mb-2">
                  Achievements
                </h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  {achievements && achievements.length ? (
                    achievements.map((a) => (
                      <li key={a.id || a.title}>
                        {a.title} {a.year ? `(${a.year})` : ""}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400">None</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Right column */}
            <div className="flex-1 pl-6">
              {/* Summary */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Professional Summary
                </h3>
                <p className="text-gray-200 whitespace-pre-line">
                  {summary ||
                    "Add a professional summary to highlight your profile."}
                </p>
              </div>

              {/* Work Experience */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Experience
                </h3>
                {work && work.length ? (
                  work.map((w) => (
                    <div key={w.id || w.company} className="mb-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-md font-semibold text-white">
                          {w.job_title} —{" "}
                          <span className="text-indigo-200 font-medium">
                            {w.company}
                          </span>
                        </h4>
                        <span className="text-sm text-gray-300">
                          {w.start_date ? w.start_date : ""}
                          {w.ongoing
                            ? " — Present"
                            : w.end_date
                            ? ` — ${w.end_date}`
                            : ""}
                        </span>
                      </div>
                      <p className="text-gray-200 mt-1">{w.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No work experience added.</p>
                )}
              </div>

              {/* Education */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Education
                </h3>
                {education && education.length ? (
                  education.map((ed) => (
                    <div key={ed.id || ed.school} className="mb-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-md font-semibold text-white">
                          {ed.degree} —{" "}
                          <span className="text-indigo-200 font-medium">
                            {ed.school}
                          </span>
                        </h4>
                        <span className="text-sm text-gray-300">
                          {ed.start_year ? ed.start_year : ""}
                          {ed.ongoing
                            ? " — Present"
                            : ed.end_year
                            ? ` — ${ed.end_year}`
                            : ""}
                        </span>
                      </div>
                      <p className="text-gray-200 mt-1">{ed.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No education added.</p>
                )}
              </div>

              {/* Projects */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Projects
                </h3>
                {projects && projects.length ? (
                  projects.map((pr) => (
                    <div key={pr.id || pr.title} className="mb-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-md font-semibold text-white">
                          {pr.title}{" "}
                          <span className="text-indigo-200 font-medium">
                            — {pr.role}
                          </span>
                        </h4>
                        <span className="text-sm text-gray-300">
                          {pr.start_month}
                          {pr.ongoing
                            ? " — Present"
                            : pr.end_month
                            ? ` — ${pr.end_month}`
                            : ""}
                        </span>
                      </div>
                      <p className="text-gray-200 mt-1">
                        {pr.description}{" "}
                        {pr.link ? (
                          <a
                            href={pr.link}
                            target="_blank"
                            className="text-indigo-300 underline ml-2"
                          >
                            {pr.link}
                          </a>
                        ) : null}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No projects added.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .neon-card { box-shadow: 0 0 40px rgba(139,92,246,0.25), inset 0 0 20px rgba(255,255,255,0.05); }
      `}</style>
    </div>
  );
}
