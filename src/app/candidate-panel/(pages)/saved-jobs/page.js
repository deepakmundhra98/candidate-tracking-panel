// "use client";

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import BaseAPI from "@/app/BaseAPI/BaseAPI";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { BsPersonFill, BsTrash } from "react-icons/bs";
// import Image from "next/image";
// import Swal from "sweetalert2";

// export default function SavedJobs() {
//   const [savedJobs, setSavedJobs] = useState([]);

//   const token = Cookies.get("tokenCandidate");

//   const getSavedJobs = async () => {
//     // Fetch saved jobs from API or local storage
//     try {
//       const response = await axios.post(
//         BaseAPI + "/admin/get-save-job-data",
//         null,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + token,
//           },
//         }
//       );

//       if (response.data.status === 200) {
//         setSavedJobs(response.data.response);
//       }
//     } catch (error) {
//       console.error("Error fetching saved jobs:", error.message);
//     }
//   };

//   useEffect(() => {
//     getSavedJobs();
//   }, []);

//   const removeJob = async (id) => {
//     try {
//       const response = await axios.post(
//         BaseAPI + "/admin/delete-saved-job",
//         { id: id },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + token,
//           },
//         }
//       );
//       if (response.data.status === 200) {
//         setSavedJobs(savedJobs.filter((job) => job.id !== id));

//         Swal.fire({
//           icon: "success",
//           title: "Removed",
//           text: "Job removed from saved list.",
//         });
//       }
//     } catch (error) {
//       console.log("Error removing saved job:", error.message);
//     }
//   };

//   return (
//     <div className="relative min-h-screen px-6 py-14">
//       {/* Background gradients */}
//       <div className="min-h-screen absolute inset-0 -z-10 bg-gradient-to-br from-[#0f1124] via-[#16182e] to-[#090a14]" />
//       <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/30 blur-[120px] rounded-full" />
//       <div className="absolute bottom-10 right-10 w-80 h-80 bg-fuchsia-500/20 blur-[140px] rounded-full" />

//       <div className="max-w-6xl mx-auto">
//         {/* HEADER */}
//         <motion.div
//           initial={{ opacity: 0, y: -30 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-16"
//         >
//           <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
//             Saved Jobs
//           </h1>
//           <p className="text-gray-400 mt-4 max-w-2xl text-lg">
//             Your saved job opportunities.
//           </p>

//           <div className="mt-6 h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
//         </motion.div>

//         {/* JOB LIST */}
//         <div className="max-w-7xl mx-auto space-y-6">
//           <AnimatePresence>
//             {savedJobs.length === 0 ? (
//               <motion.div
//                 key="empty"
//                 initial={{ opacity: 0, scale: 0.85 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="text-center py-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 neon-card"
//               >
//                 <svg
//                   className="mx-auto h-12 w-12 text-gray-300"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth={1.5}
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>

//                 <h3 className="mt-4 text-xl font-semibold text-white">
//                   No saved jobs found
//                 </h3>

//                 <p className="text-gray-300 mt-2">
//                   Save jobs to revisit them anytime.
//                 </p>

//                 <motion.button
//                   whileTap={{ scale: 0.95 }}
//                   className="mt-6 px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600
//                 text-white font-medium shadow-lg hover:shadow-purple-500/40 transition"
//                 >
//                   Browse Jobs
//                 </motion.button>
//               </motion.div>
//             ) : (
//               savedJobs.map((job, index) => (
//                 <motion.div
//                   key={job.id}
//                   initial={{ opacity: 0, x: -30 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ delay: index * 0.08 }}
//                   whileHover={{ scale: 1.03 }}
//                   className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20
//                 shadow-xl hover:shadow-indigo-500/30 transition neon-card cursor-pointer"
//                 >
//                   <div className="flex justify-between items-start">
//                     {/* LEFT SECTION */}
//                     <div className="flex gap-4">
//                       {job.logo ? (
//                         <Image
//                           width={100}
//                           height={100}
//                           src={job.logo}
//                           alt="logo"
//                           className="h-16 w-16 rounded-full border border-white/20 shadow-lg object-cover"
//                         />
//                       ) : (
//                         <BsPersonFill className="text-white text-xl" />
//                       )}

//                       <div>
//                         <h3 className="text-xl font-semibold text-white">
//                           {job.job_title}
//                         </h3>

//                         <div className="flex flex-wrap text-sm text-gray-300 gap-2 mt-1">
//                           <span className="font-medium text-indigo-300">
//                             {job.company_name}
//                           </span>
//                           <span>• {job.location}</span>
//                           <span>• {job.type}</span>
//                         </div>

//                         <div className="flex gap-4 text-sm text-gray-400 mt-2">
//                           <span>{job.posted_date}</span>
//                           <span>• {job.salary}</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* ACTION BUTTONS */}
//                     <div className="flex items-center gap-3">
//                       <motion.button
//                         whileTap={{ scale: 0.95 }}
//                         className="
//       px-5 py-2 rounded-lg
//       bg-gradient-to-r from-indigo-500 to-purple-600
//       text-white shadow-md hover:shadow-purple-400/40 transition
//     "
//                       >
//                         Apply
//                       </motion.button>

//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.92 }}
//                         onClick={() => removeJob(job.id)}
//                         className="
//       p-2 rounded-lg
//       bg-red-500/20 border border-red-400/30
//       text-red-300 hover:bg-red-500/30 transition
//     "
//                       >
//                         <BsTrash />
//                       </motion.button>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))
//             )}
//           </AnimatePresence>
//         </div>
//       </div>

//       {/* Neon glow style */}
//       <style>{`
//         .neon-card {
//           box-shadow:
//             0 0 20px rgba(99, 102, 241, 0.15),
//             inset 0 0 15px rgba(255, 255, 255, 0.04),
//             0 0 35px rgba(168, 85, 247, 0.18);
//         }
//       `}</style>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import Cookies from "js-cookie";
import { BsPersonFill, BsTrash } from "react-icons/bs";
import Image from "next/image";
import Swal from "sweetalert2";
import Link from "next/link";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const token = Cookies.get("tokenCandidate");

  /* ---------------- FETCH SAVED JOBS ---------------- */
  const getSavedJobs = async () => {
    try {
      const response = await axios.post(
        BaseAPI + "/admin/get-save-job-data",
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (response.data.status === 200) {
        setSavedJobs(response.data.response);
      }
    } catch (error) {
      console.error("Error fetching saved jobs:", error.message);
    }
  };

  useEffect(() => {
    getSavedJobs();
  }, []);

  /* ---------------- REMOVE JOB ---------------- */
  const removeJob = async (id) => {
    try {
      const response = await axios.post(
        BaseAPI + "/admin/delete-saved-job",
        { id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (response.data.status === 200) {
        setSavedJobs((prev) => prev.filter((job) => job.id !== id));
        Swal.fire({
          icon: "success",
          title: "Removed",
          text: "Job removed from saved list.",
        });
      }
    } catch (error) {
      console.log("Error removing saved job:", error.message);
    }
  };

  /* ---------------- HELPERS ---------------- */
  const parseJobTypes = (types) => {
    try {
      return JSON.parse(types);
    } catch {
      return [];
    }
  };

  return (
    <div className="relative min-h-screen px-6 py-14">
      {/* BACKGROUND */}
      <div className="min-h-screen absolute inset-0 -z-10 bg-gradient-to-br from-[#0f1124] via-[#16182e] to-[#090a14]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/30 blur-[120px] rounded-full" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-fuchsia-500/20 blur-[140px] rounded-full" />

      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            Saved Jobs
          </h1>
          <p className="text-gray-400 mt-4 text-lg">
            Your saved job opportunities.
          </p>
          <div className="mt-6 h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
        </motion.div>

        {/* JOB LIST */}
        <div className="space-y-6">
          <AnimatePresence>
            {savedJobs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 rounded-2xl bg-white/10 border border-white/20"
              >
                <h3 className="text-xl font-semibold text-white">
                  No saved jobs found
                </h3>
                <p className="text-gray-300 mt-2">
                  Save jobs to revisit them anytime.
                </p>
              </motion.div>
            ) : (
              savedJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-2xl bg-white/10 border border-white/20 shadow-xl neon-card"
                >
                  <div className="flex justify-between items-start">
                    {/* LEFT */}
                    <div className="flex gap-4">
                      {job.logo ? (
                        <Image
                          src={job.logo}
                          alt="logo"
                          width={64}
                          height={64}
                          className="rounded-full border border-white/20"
                        />
                      ) : (
                        <BsPersonFill className="text-white text-xl" />
                      )}

                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {job.job_title}
                        </h3>
                        <p className="text-indigo-300 font-medium">
                          {job.company_name}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {job.location} • {job.posted_date}
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedJob(job)}
                        className="px-5 py-2 rounded-lg bg-white/10 text-white border border-white/20"
                      >
                        View
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="
      px-5 py-2 rounded-lg 
      bg-gradient-to-r from-indigo-500 to-purple-600
      text-white shadow-md hover:shadow-purple-400/40 transition
    "
                      >
                        <Link href={`${job.job_url}`} target="_blank">Apply</Link>
                        
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => removeJob(job.id)}
                        className="p-2 rounded-lg bg-red-500/20 border border-red-400/30 text-red-300"
                      >
                        <BsTrash />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f1124] border border-white/20 p-8 neon-card"
            >
              {/* CLOSE */}
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white"
              >
                ✕
              </button>

              {/* HEADER */}
              <div className="flex gap-5">
                {selectedJob.logo && (
                  <Image
                    src={selectedJob.logo}
                    alt="logo"
                    width={80}
                    height={80}
                    className="rounded-xl border border-white/20"
                  />
                )}

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedJob.job_title}
                  </h2>
                  <p className="text-indigo-300 font-medium">
                    {selectedJob.company_name}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {selectedJob.location} • {selectedJob.posted_date}
                  </p>
                </div>
              </div>

              {/* JOB TYPES */}
              <div className="flex flex-wrap gap-2 mt-6">
                {parseJobTypes(selectedJob.job_types).map((type, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm"
                  >
                    {type.split("\n")[0]}
                  </span>
                ))}
              </div>

              {/* APPLY INFO */}
              {selectedJob.apply_info && (
                <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                  <strong className="text-white">Apply:</strong>
                  <p className="text-gray-300 mt-1">{selectedJob.apply_info}</p>
                </div>
              )}

              {/* COMPANY DETAILS */}
              {selectedJob.company_details && (
                <section className="mt-8">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    About the Company
                  </h3>
                  <pre className="text-gray-300 whitespace-pre-wrap text-sm">
                    {selectedJob.company_details}
                  </pre>
                </section>
              )}

              {/* JOB DESCRIPTION */}
              {selectedJob.job_description && (
                <section className="mt-8">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Job Description
                  </h3>
                  <pre className="text-gray-300 whitespace-pre-wrap text-sm">
                    {selectedJob.job_description}
                  </pre>
                </section>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEON GLOW */}
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
