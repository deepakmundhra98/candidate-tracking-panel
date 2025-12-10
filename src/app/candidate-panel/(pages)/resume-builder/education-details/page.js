"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsTrash } from "react-icons/bs";
import { useRouter } from "next/navigation";

export default function EducationDetails() {
  const router = useRouter();

  const [educations, setEducations] = useState([
    {
      id: Date.now(),
      school: "",
      degree: "",
      field: "",
      start_year: "",
      end_year: "",
      grade: "",
      description: "",
      ongoing: false,
    },
  ]);

  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  /** LOAD SAVED DATA */
  useEffect(() => {
    const raw = localStorage.getItem("rb_education");
    if (raw) {
      try {
        setEducations(JSON.parse(raw));
      } catch {}
    }
  }, []);

  /** ON CHANGE */
  const handleChange = (id, field, value) => {
    setEducations((prev) =>
      prev.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
    setErrors((prev) => ({ ...prev, [`${id}-${field}`]: "" }));
  };

  /** ONGOING CHECKBOX */
  const toggleOngoing = (id, checked) => {
    setEducations((prev) =>
      prev.map((edu) =>
        edu.id === id
          ? {
              ...edu,
              ongoing: checked,
              end_year: checked ? "" : edu.end_year,
            }
          : edu
      )
    );
  };

  /** ADD EDUCATION */
  const addEducation = () => {
    setEducations((prev) => [
      ...prev,
      {
        id: Date.now(),
        school: "",
        degree: "",
        field: "",
        start_year: "",
        end_year: "",
        grade: "",
        description: "",
        ongoing: false,
      },
    ]);
  };

  /** REMOVE EDUCATION */
  const removeEducation = (id) => {
    if (educations.length === 1) return;
    setEducations((prev) => prev.filter((edu) => edu.id !== id));
  };

  /** VALIDATE */
  const validate = () => {
    const temp = {};

    educations.forEach((edu) => {
      if (!edu.school.trim()) temp[`${edu.id}-school`] = "School is required.";
      if (!edu.degree.trim()) temp[`${edu.id}-degree`] = "Degree required.";
      if (!edu.field.trim())
        temp[`${edu.id}-field`] = "Field of study required.";
      if (!edu.start_year.trim())
        temp[`${edu.id}-start_year`] = "Start year required.";
      if (!edu.description.trim())
        temp[`${edu.id}-description`] = "Description required.";

      if (!edu.ongoing && !edu.end_year.trim())
        temp[`${edu.id}-end_year`] = "End year required unless ongoing.";
    });

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  /** NEXT */
  const handleNext = () => {
    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 350);
      return;
    }

    localStorage.setItem("rb_education", JSON.stringify(educations));
    router.push("/candidate-panel/resume-builder/work-experience-details");
  };

  /** BACK */
  const handleBack = () => {
    localStorage.setItem("rb_education", JSON.stringify(educations));
    router.push("/candidate-panel/resume-builder/personal-details");
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
          Step 2: Education Details
        </h1>
        <p className="text-gray-300 text-sm text-center mt-2 mb-10">
          Add your academic qualifications.
        </p>

        {/* EDUCATION CARDS */}
        <div className="space-y-10">
          <AnimatePresence>
            {educations.map((edu) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl relative"
              >
                {educations.length > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => removeEducation(edu.id)}
                    className="absolute top-4 right-4 p-2 bg-red-500/20 border border-red-400/30 rounded-full text-red-300"
                  >
                    <BsTrash />
                  </motion.button>
                )}

                <div className="grid grid-cols-2 gap-8">
                  {/* School */}
                  <div>
                    <label className="text-gray-300 text-sm font-medium">
                      School / University{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) =>
                        handleChange(edu.id, "school", e.target.value)
                      }
                      className={`w-full mt-2 px-4 py-3 bg-white/10 border 
          rounded-xl text-gray-100 ${
            errors[`${edu.id}-school`] ? "border-red-400" : "border-white/20"
          }`}
                      placeholder="Harvard University"
                    />
                    {errors[`${edu.id}-school`] && (
                      <p className="text-red-400 text-sm">
                        {errors[`${edu.id}-school`]}
                      </p>
                    )}
                  </div>

                  {/* Degree */}
                  <div>
                    <label className="text-gray-300 text-sm font-medium">
                      Degree <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) =>
                        handleChange(edu.id, "degree", e.target.value)
                      }
                      className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl 
          text-gray-100 ${
            errors[`${edu.id}-degree`] ? "border-red-400" : "border-white/20"
          }`}
                      placeholder="Bachelor of Technology"
                    />
                    {errors[`${edu.id}-degree`] && (
                      <p className="text-red-400 text-sm">
                        {errors[`${edu.id}-degree`]}
                      </p>
                    )}
                  </div>

                  {/* Field */}
                  <div>
                    <label className="text-gray-300 text-sm font-medium">
                      Field of Study <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) =>
                        handleChange(edu.id, "field", e.target.value)
                      }
                      className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100
          ${errors[`${edu.id}-field`] ? "border-red-400" : "border-white/20"}`}
                      placeholder="Computer Science"
                    />
                    {errors[`${edu.id}-field`] && (
                      <p className="text-red-400 text-sm">
                        {errors[`${edu.id}-field`]}
                      </p>
                    )}
                  </div>

                  {/* Start Year */}
                  <div>
                    <label className="text-gray-300 text-sm font-medium">
                      Start Year <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="month"
                      value={edu.start_year}
                      onChange={(e) =>
                        handleChange(edu.id, "start_year", e.target.value)
                      }
                      className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl 
          text-gray-100 ${
            errors[`${edu.id}-start_year`]
              ? "border-red-400"
              : "border-white/20"
          }`}
                    />
                    {errors[`${edu.id}-start_year`] && (
                      <p className="text-red-400 text-sm">
                        {errors[`${edu.id}-start_year`]}
                      </p>
                    )}
                  </div>

                  {/* End Year + Ongoing */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300 text-sm font-medium">
                        End Year{" "}
                        {!edu.ongoing && (
                          <span className="text-red-400">*</span>
                        )}
                      </label>

                      <label className="flex items-center space-x-2 text-gray-300 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={edu.ongoing}
                          onChange={(e) =>
                            toggleOngoing(edu.id, e.target.checked)
                          }
                          className="w-4 h-4"
                        />
                        <span>Ongoing</span>
                      </label>
                    </div>

                    <input
                      type="month"
                      value={edu.end_year}
                      disabled={edu.ongoing}
                      onChange={(e) =>
                        handleChange(edu.id, "end_year", e.target.value)
                      }
                      className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100
          ${
            edu.ongoing
              ? "opacity-30 cursor-not-allowed border-white/10"
              : errors[`${edu.id}-end_year`]
              ? "border-red-400"
              : "border-white/20"
          }`}
                    />
                    {!edu.ongoing && errors[`${edu.id}-end_year`] && (
                      <p className="text-red-400 text-sm">
                        {errors[`${edu.id}-end_year`]}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="col-span-2">
                    <label className="text-gray-300 text-sm font-medium">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows="4"
                      value={edu.description}
                      onChange={(e) =>
                        handleChange(edu.id, "description", e.target.value)
                      }
                      className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl 
          text-gray-100 ${
            errors[`${edu.id}-description`]
              ? "border-red-400"
              : "border-white/20"
          }`}
                      placeholder="Coursework, achievements, relevant projects..."
                    />
                    {errors[`${edu.id}-description`] && (
                      <p className="text-red-400 text-sm">
                        {errors[`${edu.id}-description`]}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
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
            className="px-10 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white 
              text-lg font-medium rounded-xl shadow-lg hover:shadow-purple-500/40"
          >
            Next →
          </button>
        </div>
      </motion.div>

      {/* STYLES */}
      <style>{`
        .animate-shake { animation: shake 0.3s ease-in-out; }
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
