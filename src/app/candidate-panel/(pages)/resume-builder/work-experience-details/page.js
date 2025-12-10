"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsTrash } from "react-icons/bs";
import { useRouter } from "next/navigation";

export default function WorkExperience() {
  const router = useRouter();

  const [experiences, setExperiences] = useState([
    {
      id: Date.now(),
      job_title: "",
      company: "",
      start_date: "",
      end_date: "",
      ongoing: false,
      description: "",
    },
  ]);

  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  /** -----------------------------------
   * Load saved data if user returns
   * ----------------------------------- */
  useEffect(() => {
    const raw = localStorage.getItem("rb_work");
    if (raw) {
      try {
        setExperiences(JSON.parse(raw));
      } catch {}
    }
  }, []);

  /** -----------------------------------
   * Change handler
   * ----------------------------------- */
  const handleChange = (id, field, value) => {
    setExperiences((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );

    setErrors((prev) => ({ ...prev, [`${id}-${field}`]: "" }));
  };

  /** -----------------------------------
   * Toggle Ongoing
   * ----------------------------------- */
  const toggleOngoing = (id, checked) => {
    setExperiences((prev) =>
      prev.map((exp) =>
        exp.id === id
          ? { ...exp, ongoing: checked, end_date: checked ? "" : exp.end_date }
          : exp
      )
    );
  };

  /** -----------------------------------
   * Add Experience card
   * ----------------------------------- */
  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        id: Date.now(),
        job_title: "",
        company: "",
        start_date: "",
        end_date: "",
        ongoing: false,
        description: "",
      },
    ]);
  };

  /** -----------------------------------
   * Remove card
   * ----------------------------------- */
  const removeExperience = (id) => {
    if (experiences.length === 1) return;
    setExperiences((prev) => prev.filter((exp) => exp.id !== id));
  };

  /** -----------------------------------
   * VALIDATION
   * ----------------------------------- */
  const validate = () => {
    const temp = {};

    experiences.forEach((exp) => {
      if (!exp.job_title.trim())
        temp[`${exp.id}-job_title`] = "Job title is required.";

      if (!exp.company.trim())
        temp[`${exp.id}-company`] = "Company name is required.";

      if (!exp.start_date.trim())
        temp[`${exp.id}-start_date`] = "Start date is required.";

      if (!exp.description.trim())
        temp[`${exp.id}-description`] = "Job description is required.";

      if (!exp.ongoing && !exp.end_date.trim())
        temp[`${exp.id}-end_date`] = "End date required unless ongoing.";
    });

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  /** -----------------------------------
   * NEXT Step
   * ----------------------------------- */
  const handleNext = () => {
    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    // Save to localStorage
    localStorage.setItem("rb_work", JSON.stringify(experiences));

    // Move to Step 4 (Education)
    router.push("/candidate-panel/resume-builder/add-skills");
  };

  /** -----------------------------------
   * BACK Step
   * ----------------------------------- */
  const handleBack = () => {
    localStorage.setItem("rb_work", JSON.stringify(experiences));
    router.push("/candidate-panel/resume-builder/education-details");
  };

  return (
    <div className="p-6 relative min-h-screen flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0f1124] via-[#1a1c33] to-[#090c1b]" />
      <div className="absolute top-20 left-20 w-80 h-80 bg-indigo-600/25 blur-[150px] rounded-full" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/25 blur-[170px] rounded-full" />

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className={`min-w-[900px] backdrop-blur-3xl bg-white/10 border border-white/20 
        shadow-xl rounded-3xl p-10 neon-card ${shake ? "animate-shake" : ""}`}
      >
        {/* Header */}
        <h1 className="text-3xl font-semibold text-white tracking-wide text-center">
          Step 3: Work Experience
        </h1>
        <p className="text-gray-300 text-sm text-center mt-2 mb-10">
          Add your past roles and ongoing experience.
        </p>

        {/* EXPERIENCE CARDS */}
        <div className="space-y-10">
          <AnimatePresence>
            {experiences.map((exp) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl relative"
              >
                {/* Delete */}
                {experiences.length > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeExperience(exp.id)}
                    className="absolute top-4 right-4 p-2 bg-red-500/20 border border-red-400/30 rounded-full text-red-300"
                  >
                    <BsTrash />
                  </motion.button>
                )}

                {/* Fields */}
                <div className="grid grid-cols-2 gap-8 mt-2">

                  {/* Job Title */}
                  <div>
                    <label className="text-gray-300 text-sm">Job Title</label>
                    <input
                      type="text"
                      value={exp.job_title}
                      onChange={(e) =>
                        handleChange(exp.id, "job_title", e.target.value)
                      }
                      className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl 
                        text-gray-100 ${
                          errors[`${exp.id}-job_title`]
                            ? "border-red-400"
                            : "border-white/20"
                        }`}
                      placeholder="Software Engineer"
                    />
                    {errors[`${exp.id}-job_title`] && (
                      <p className="text-red-400 text-sm">
                        {errors[`${exp.id}-job_title`]}
                      </p>
                    )}
                  </div>

                  {/* Company */}
                  <div>
                    <label className="text-gray-300 text-sm">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        handleChange(exp.id, "company", e.target.value)
                      }
                      className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100 
                        ${
                          errors[`${exp.id}-company`]
                            ? "border-red-400"
                            : "border-white/20"
                        }`}
                      placeholder="Google"
                    />
                    {errors[`${exp.id}-company`] && (
                      <p className="text-red-400 text-sm">
                        {errors[`${exp.id}-company`]}
                      </p>
                    )}
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="text-gray-300 text-sm">Start Date</label>
                    <input
                      type="month"
                      value={exp.start_date}
                      onChange={(e) =>
                        handleChange(exp.id, "start_date", e.target.value)
                      }
                      className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100 
                        ${
                          errors[`${exp.id}-start_date`]
                            ? "border-red-400"
                            : "border-white/20"
                        }`}
                    />
                    {errors[`${exp.id}-start_date`] && (
                      <p className="text-red-400 text-sm">
                        {errors[`${exp.id}-start_date`]}
                      </p>
                    )}
                  </div>

                  {/* End Date + Ongoing */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300 text-sm">End Date</label>

                      <label className="flex items-center space-x-2 text-gray-300 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.ongoing}
                          onChange={(e) =>
                            toggleOngoing(exp.id, e.target.checked)
                          }
                          className="w-4 h-4"
                        />
                        <span>Ongoing</span>
                      </label>
                    </div>

                    <input
                      type="month"
                      value={exp.end_date}
                      disabled={exp.ongoing}
                      onChange={(e) =>
                        handleChange(exp.id, "end_date", e.target.value)
                      }
                      className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100
                        ${
                          exp.ongoing
                            ? "opacity-30 cursor-not-allowed border-white/10"
                            : errors[`${exp.id}-end_date`]
                            ? "border-red-400"
                            : "border-white/20"
                        }`}
                    />

                    {!exp.ongoing && errors[`${exp.id}-end_date`] && (
                      <p className="text-red-400 text-sm">
                        {errors[`${exp.id}-end_date`]}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="col-span-2">
                    <label className="text-gray-300 text-sm">Job Description</label>
                    <textarea
                      rows="4"
                      value={exp.description}
                      onChange={(e) =>
                        handleChange(exp.id, "description", e.target.value)
                      }
                      className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100
                        ${
                          errors[`${exp.id}-description`]
                            ? "border-red-400"
                            : "border-white/20"
                        }`}
                      placeholder="Describe responsibilities and achievements..."
                    />
                    {errors[`${exp.id}-description`] && (
                      <p className="text-red-400 text-sm">
                        {errors[`${exp.id}-description`]}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add Button */}
        <div className="mt-8 text-center">
          <button
            onClick={addExperience}
            className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-xl shadow hover:bg-white/20 transition"
          >
            + Add Another Experience
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex justify-between">
          <button
            onClick={handleBack}
            className="px-10 py-3 bg-white/10 border border-white/20 text-white rounded-xl"
          >
            ← Back
          </button>

          <button
            onClick={handleNext}
            className="px-10 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-purple-500/40"
          >
            Next →
          </button>
        </div>
      </motion.div>

      <style>{`
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }
        .neon-card {
          box-shadow: 0 0 40px rgba(139,92,246,0.25),
                      inset 0 0 20px rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
}
