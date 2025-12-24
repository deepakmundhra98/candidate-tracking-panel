// "use client";

// import { motion } from "framer-motion";
// import { useState, useEffect, useRef } from "react";
// import Cookies from "js-cookie";
// import axios from "axios";
// import BaseAPI from "@/app/BaseAPI/BaseAPI";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { BsDownload } from "react-icons/bs";

// export default function Resume() {
//   const selectedResumeId = Cookies.get("selectedResumeId");
//   const token = Cookies.get("tokenCandidate");

//   const [resumeData, setResumeData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const resumeRef = useRef(null);

//   /* ================= GET DATA ================= */
//   const getSelectedResumeData = async (id) => {
//     try {
//       setLoading(true);

//       const response = await axios.post(
//         `${BaseAPI}/admin/candidates/profile/${id}`,
//         null,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       const data = response.data.profile;

//       const candidateData = response.data.candidate;

//       const work = (data.work || []).map((item, idx) => ({
//         id: idx + 1,
//         title: item.job_title,
//         company: item.company,
//         // employmentType: item.employmentType,
//         // location: item.jobLocation,
//         startDate: item.start_date,
//         endDate: item.ongoing ? "Present" : item.end_date,
//         duration: item.duration,
//         description: item.description,
//       }));

//       const education = (data.education || []).map((item, idx) => ({
//         id: idx + 1,
//         school: item.school,
//         degree: item.degree,
//         field: item.field,
//         year: item.year,
//       }));

//       setResumeData({
//         id: data.id,
//         name: `${candidateData.first_name} ${candidateData.last_name}`,
//         email: candidateData.email,
//         profile_image_url: data.profile_image_url,
//         summary: data.summary,
//         work,
//         education,
//         skills: data.skills || [],
//       });

//     } catch (err) {
//       console.log("Error fetching resume:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (selectedResumeId && token) {
//       getSelectedResumeData(selectedResumeId);
//     }
//   }, [selectedResumeId, token]);

//   /* ================= PDF DOWNLOAD ================= */
// const downloadPDF = async () => {
//   if (!resumeRef.current) return;

//   const canvas = await html2canvas(resumeRef.current, {
//     scale: 2,
//     backgroundColor: "#0e1125",
//     useCORS: true,
//     allowTaint: false,
//   });

//   const imgData = canvas.toDataURL("image/png");
//   const pdf = new jsPDF("p", "mm", "a4");

//   const pdfWidth = pdf.internal.pageSize.getWidth();
//   const pdfHeight = pdf.internal.pageSize.getHeight();

//   const imgHeight = (canvas.height * pdfWidth) / canvas.width;

//   let heightLeft = imgHeight;
//   let position = 0;

//   while (heightLeft > 0) {
//     // 🔥 Fill background
//     pdf.setFillColor(14, 17, 37); // #0e1125
//     pdf.rect(0, 0, pdfWidth, pdfHeight, "F");

//     pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);

//     heightLeft -= pdfHeight;
//     position -= pdfHeight;

//     if (heightLeft > 0) pdf.addPage();
//   }

//   pdf.save("My_Resume.pdf");
// };

//   return (
//     <div className="relative min-h-screen px-6 py-12">

//       {/* BG */}
//       <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0e1125] via-[#181a2d] to-[#0e1125]" />

//       <div className="max-w-6xl mx-auto">

//         {/* HEADER */}
//         <motion.div
//           initial={{ opacity: 0, y: -15 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="
//             flex justify-between items-center mb-10
//             bg-white/10 p-6 rounded-2xl backdrop-blur-xl border border-white/10
//           "
//         >
//           <h2 className="text-3xl font-semibold text-white">
//             Resume Preview
//           </h2>

//           <motion.button
//             whileTap={{ scale: 0.92 }}
//             onClick={downloadPDF}
//             className="
//                 flex items-center gap-2
//                 px-6 py-2.5 rounded-lg bg-indigo-600 text-white
//                 hover:bg-indigo-500 transition shadow-md
//             "
//           >
//             <BsDownload />
//             Download PDF
//           </motion.button>
//         </motion.div>

//         {/* BODY CONTAINER */}
//         <div
//           ref={resumeRef}
//           className="
//           bg-white/10 backdrop-blur-xl border border-white/10
//           rounded-2xl p-10
//           "
//         >
//           {/* =================== SKELETON =================== */}
//           {loading && (
//             <div className="animate-pulse space-y-12">

//               {/* top profile skeleton */}
//               <div className="flex gap-6 items-center">
//                 <div className="w-20 h-20 rounded-full bg-white/10" />
//                 <div className="space-y-3">
//                   <div className="h-5 w-48 bg-white/10 rounded" />
//                   <div className="h-4 w-72 bg-white/10 rounded" />
//                 </div>
//               </div>

//               {/* 2 section skeletons */}
//               {Array.from({ length: 3 }).map((_, i) => (
//                 <div key={i} className="space-y-3">
//                   <div className="h-5 w-40 bg-white/10 rounded" />
//                   <div className="h-3 w-full bg-white/10 rounded" />
//                   <div className="h-3 w-2/3 bg-white/10 rounded" />
//                 </div>
//               ))}

//             </div>
//           )}

//           {/* =================== REAL DATA =================== */}
//           {!loading && resumeData && (
//             <div className="space-y-16 text-white">

//               {/* PROFILE */}
//               <div className="flex gap-6 items-center">
//                 {resumeData.profile_image_url && (
//                   <img
//                     src={resumeData.profile_image_url}
//                     className="w-20 h-20 object-cover rounded-full border border-white/20"
//                   />
//                 )}

//                 <div>
//                   <h2 className="text-3xl font-semibold">
//                     {resumeData.name}
//                   </h2>

//                   <p className="text-gray-300 mt-2 max-w-2xl">
//                     {resumeData.summary}
//                   </p>
//                 </div>
//               </div>

//               {/* WORK HISTORY */}
//               <section>
//                 <h3 className="text-2xl font-semibold mb-6">Experience</h3>

//                 {resumeData.work.map((exp) => (
//                   <div key={exp.id} className="mb-8 pl-4 border-l-2 border-indigo-500">

//                     <h4 className="text-xl font-semibold text-white">
//                       {exp.title}
//                     </h4>

//                     <p className="text-indigo-300 font-medium">
//                       {exp.company}
//                     </p>

//                     <p className="text-gray-400 text-sm">
//                       {exp.startDate} – {exp.endDate}
//                     </p>

//                     {exp.location && (
//                       <p className="text-gray-500 text-sm">{exp.location}</p>
//                     )}
//                   </div>
//                 ))}
//               </section>

//               {/* EDUCATION */}
//               <section>
//                 <h3 className="text-2xl font-semibold mb-6">Education</h3>

//                 {resumeData.education.map((edu) => (
//                   <div key={edu.id} className="mb-6 pl-4 border-l-2 border-purple-500">

//                     <h4 className="text-xl font-semibold">
//                       {edu.degree}
//                     </h4>

//                     <p className="text-indigo-300">{edu.school}</p>
//                     <p className="text-gray-400 text-sm">{edu.field}</p>
//                     <p className="text-gray-500 text-sm">{edu.year}</p>

//                   </div>
//                 ))}
//               </section>

//               {/* SKILLS */}
//               <section>
//                 <h3 className="text-2xl font-semibold mb-6">Skills</h3>

//                 <div className="flex flex-wrap gap-3">
//                   {resumeData.skills.map((skill, i) => (
//                     <span
//                       key={i}
//                       className="
//                         px-4 py-1.5 rounded-full
//                         bg-indigo-500/20 border border-indigo-500/30
//                         text-indigo-200 text-sm font-medium
//                       "
//                     >
//                       {skill.skill_name ? skill.skill_name : skill}
//                     </span>
//                   ))}
//                 </div>
//               </section>

//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { BsDownload } from "react-icons/bs";

/* ================= HELPERS ================= */
const safe = (v) => (v === null || v === undefined || v === "" ? "—" : v);

const formatMonth = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d)) return value;
  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

export default function Resume() {
  const selectedResumeId = Cookies.get("selectedResumeId");
  const token = Cookies.get("tokenCandidate");

  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const resumeRef = useRef(null);

  /* ================= FETCH DATA ================= */
  const getSelectedResumeData = async (id) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${BaseAPI}/admin/candidates/profile/${id}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data.profile;
      const candidate = response.data.candidate;

      setResumeData({
        name: `${safe(candidate.first_name)} ${safe(candidate.last_name)}`,
        email: safe(candidate.email),
        summary: safe(data.summary),

        work: (data.work || []).map((w, i) => ({
          id: i,
          title: safe(w.job_title),
          company: safe(w.company),
          start: formatMonth(w.start_date),
          end: w.ongoing ? "Present" : formatMonth(w.end_date),
          description: safe(w.description),
        })),

        education: (data.education || []).map((e, i) => ({
          id: i,
          school: e.school,
          degree: e.degree,
          field: e.field,
          start: formatMonth(e.start_year),
          end: e.ongoing ? "Present" : formatMonth(e.end_year),
          grade: e.grade,
          description: e.description,
        })),

        skills: data.skills || [],

        projects: (data.projects || []).map((p, i) => ({
          id: i,
          title: safe(p.title),
          role: safe(p.role),
          start: formatMonth(p.start_month),
          end: p.ongoing ? "Present" : formatMonth(p.end_month),
          link: safe(p.link),
          description: safe(p.description),
        })),

        achievements: (data.achievements || []).map((a, i) => ({
          id: i,
          title: safe(a.title),
          year: safe(a.year),
          issuer: safe(a.issuer),
          type: safe(a.type),
          link: safe(a.link),
        })),
      });
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedResumeId && token) {
      getSelectedResumeData(selectedResumeId);
    }
  }, [selectedResumeId, token]);

  /* ================= PDF ================= */
  const downloadPDF = async () => {
    if (!resumeRef.current) return;

    const canvas = await html2canvas(resumeRef.current, {
      scale: 2,
      backgroundColor: "#0e1125",
      useCORS: true,
    });

    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();
    const imgH = (canvas.height * w) / canvas.width;

    let left = imgH;
    let pos = 0;

    while (left > 0) {
      pdf.setFillColor(14, 17, 37);
      pdf.rect(0, 0, w, h, "F");
      pdf.addImage(img, "PNG", 0, pos, w, imgH);
      left -= h;
      pos -= h;
      if (left > 0) pdf.addPage();
    }

    pdf.save("My_Resume.pdf");
  };

  /* ================= UI ================= */
  return (
    <div className="relative min-h-screen px-6 py-12">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0e1125] via-[#181a2d] to-[#0e1125]" />

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 bg-white/10 p-6 rounded-2xl backdrop-blur-xl border border-white/10">
          <h2 className="text-3xl font-semibold text-white">Resume Preview</h2>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg"
          >
            <BsDownload /> Download PDF
          </button>
        </div>

        {/* BODY */}
        <div
          ref={resumeRef}
          className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-10"
        >
          {loading && <p className="text-gray-400">Loading...</p>}

          {!loading && resumeData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-white">
              {/* LEFT */}
              <div className="lg:col-span-2 space-y-12">
                {/* SUMMARY */}
                <section>
                  <h2 className="text-3xl font-bold">{resumeData.name}</h2>
                  <p className="text-gray-400 mt-2">{resumeData.email}</p>
                  <p className="text-gray-300 mt-4">{resumeData.summary}</p>
                </section>

                {/* EXPERIENCE */}
                <section>
                  <h3 className="text-2xl font-semibold mb-4">Experience</h3>
                  {resumeData.work.length === 0 && <p>—</p>}
                  {resumeData.work.map((w) => (
                    <div
                      key={w.id}
                      className="mb-6 border-l-2 border-indigo-500 pl-4"
                    >
                      <h4 className="text-xl font-semibold">{w.title}</h4>
                      <p className="text-indigo-300">{w.company}</p>
                      <p className="text-gray-400 text-sm">
                        {w.start} – {w.end}
                      </p>
                      <p className="text-gray-300 mt-2">{w.description}</p>
                    </div>
                  ))}
                </section>

                {/* EDUCATION */}
                <section>
                  <h3 className="text-2xl font-semibold mb-4">Education</h3>
                  {resumeData.education.length === 0 && <p>—</p>}
                  {resumeData.education.map((e) => (
                    <div
                      key={e.id}
                      className="mb-6 border-l-2 border-purple-500 pl-4"
                    >
                      {e.degree && (
                        <h4 className="text-xl font-semibold">
                          {safe(e.degree)}
                        </h4>
                      )}
                      {e.school && (
                        <p className="text-indigo-300">{safe(e.school)}</p>
                      )}
                      {e.field && (
                        <p className="text-gray-400">{safe(e.field)}</p>
                      )}
                      {e.start && e.end && (
                        <p className="text-gray-400 text-sm">
                          {safe(e.start)} – {safe(e.end)}
                        </p>
                      )}
                      {e.grade && (
                        <p className="text-gray-400 text-sm">
                          Grade: {safe(e.grade)}
                        </p>
                      )}

                      {e.description && (
                        <p className="text-gray-300 mt-2">
                          {safe(e.description)}
                        </p>
                      )}
                    </div>
                  ))}
                </section>
              </div>

              {/* RIGHT */}
              <div className="space-y-10">
                {/* SKILLS */}
                <section>
                  <h3 className="text-2xl font-semibold mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-3">
                    {resumeData.skills.length === 0 && "—"}
                    {resumeData.skills.map((s, i) => (
                      <span
                        key={i}
                        className="px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30"
                      >
                        {safe(s.skill_name)}
                      </span>
                    ))}
                  </div>
                </section>

                {/* PROJECTS */}
                <section>
                  <h3 className="text-2xl font-semibold mb-4">Projects</h3>
                  {resumeData.projects.length === 0 && <p>Not Available</p>}
                  {resumeData.projects.map((p) => (
                    <div key={p.id} className="mb-4">
                      <p className="font-semibold">{p.title}</p>
                      <p className="text-gray-400 text-sm">
                        {p.role} • {p.start} – {p.end}
                      </p>
                      <p className="text-gray-300 mt-1">{p.description}</p>
                      <p className="text-gray-500 text-sm">Link: {p.link}</p>
                    </div>
                  ))}
                </section>

                {/* ACHIEVEMENTS */}
                <section>
                  <h3 className="text-2xl font-semibold mb-4">Achievements</h3>
                  {resumeData.achievements.length === 0 && <p>Not Available</p>}
                  {resumeData.achievements.map((a) => (
                    <div key={a.id} className="mb-3">
                      <p className="font-medium">{a.title}</p>
                      <p className="text-gray-400 text-sm">
                        {a.type} • {a.year}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Issuer: {a.issuer}
                      </p>
                    </div>
                  ))}
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
