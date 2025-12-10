"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsTrash } from "react-icons/bs";
import Select from "react-select";
import { useRouter } from "next/navigation";

export default function SkillsPage() {
  const router = useRouter();

  // Skills list with ID + Name
  const skillsList = [
    { id: 1, name: "JavaScript" },
    { id: 2, name: "React" },
    { id: 3, name: "Next.js" },
    { id: 4, name: "Node.js" },
    { id: 5, name: "Laravel" },
    { id: 6, name: "PHP" },
    { id: 7, name: "Python" },
    { id: 8, name: "Django" },
    { id: 9, name: "Java" },
    { id: 10, name: "SQL" },
    { id: 11, name: "MongoDB" },
    { id: 12, name: "UI/UX Design" },
    { id: 13, name: "Figma" },
    { id: 14, name: "AWS" },
    { id: 15, name: "Tailwind CSS" },
  ];

  const skillOptions = skillsList.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const levelOptions = [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Expert", label: "Expert" },
  ];

  const [skills, setSkills] = useState([
    {
      id: Date.now(),
      skill_id: "",
      skill_name: "",
      level: "",
    },
  ]);

  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  /** -------------------------------
   * Handle Skill Change
   * ------------------------------- */
  const handleSkillSelect = (id, value) => {
    const skillSelected = skillsList.find((s) => s.id == value);

    setSkills((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              skill_id: skillSelected?.id,
              skill_name: skillSelected?.name,
            }
          : s
      )
    );

    setErrors((prev) => ({ ...prev, [`${id}-skill`]: "" }));
  };

  /** -------------------------------
   * Handle Proficiency
   * ------------------------------- */
  const handleChange = (id, field, value) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );

    setErrors((prev) => ({ ...prev, [`${id}-${field}`]: "" }));
  };

  /** -------------------------------
   * Add Skill Row
   * ------------------------------- */
  const addSkill = () => {
    setSkills((prev) => [
      ...prev,
      { id: Date.now(), skill_id: "", skill_name: "", level: "" },
    ]);
  };

  /** -------------------------------
   * Remove Skill
   * ------------------------------- */
  const removeSkill = (id) => {
    if (skills.length === 1) return;
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  /** -------------------------------
   * Validation
   * ------------------------------- */
  const validate = () => {
    let temp = {};

    skills.forEach((s) => {
      if (!s.skill_id) temp[`${s.id}-skill`] = "Please select a skill.";
      if (!s.level.trim()) temp[`${s.id}-level`] = "Select proficiency.";
    });

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  /** -------------------------------
   * Next
   * ------------------------------- */
  const handleNext = () => {
    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    localStorage.setItem("rb_skills", JSON.stringify(skills));
    router.push("/candidate-panel/resume-builder/add-projects");
  };

  const handleBack = () => {
    localStorage.setItem("rb_skills", JSON.stringify(skills));
    router.push("/candidate-panel/resume-builder/work-experience-details");
  };

  useEffect(() => {
    const savedSkills = localStorage.getItem("rb_skills");
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills));
    }
  }, []);

  return (
    <div className="p-6 relative min-h-screen flex items-center justify-center">

      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0f1124] via-[#15172e] to-[#090c1b]" />
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
        <h1 className="text-3xl font-semibold text-white tracking-wide text-center">
          Step 4: Skills & Expertise
        </h1>
        <p className="text-gray-300 text-sm text-center mt-2 mb-10">
          Select your skills and proficiency level.
        </p>

        {/* SKILL ROWS */}
        <div className="space-y-10">
          <AnimatePresence>
            {skills.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl relative"
              >
                {/* Delete Button */}
                {skills.length > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeSkill(item.id)}
                    className="absolute top-4 right-4 p-2 bg-red-500/20 border border-red-400/30 
                    rounded-full text-red-300"
                  >
                    <BsTrash />
                  </motion.button>
                )}

                <div className="grid grid-cols-2 gap-8">

                  {/* Skill Dropdown */}
                  <div>
                    <label className="text-gray-300 text-sm font-medium">
                      Skill <span className="text-red-400">*</span>
                    </label>

                    <Select
                      options={skillOptions}
                      value={skillOptions.find((opt) => opt.value === item.skill_id) || null}
                      onChange={(selected) =>
                        handleSkillSelect(item.id, selected ? selected.value : "")
                      }
                      className="mt-2"
                      classNamePrefix="react-select"
                      placeholder="Select Skill"
                      styles={{
  control: (base, state) => ({
    ...base,
    background: "rgba(255, 255, 255, 0.08)",  // glass effect
    backdropFilter: "blur(8px)",
    borderRadius: "12px",
    border: state.isFocused
      ? "1px solid rgba(255, 255, 255, 0.4)"
      : `1px solid ${
          errors[`${item.id}-skill`] ? "#f87171" : "rgba(255, 255, 255, 0.25)"
        }`,
    boxShadow: "none",
    padding: "4px",
    // color: "#fff",
  }),

  menu: (base) => ({
    ...base,
    background: "rgba(255, 255, 255, 0.12)",  // glass dropdown
    backdropFilter: "blur(12px)",
    borderRadius: "12px",
    padding: "6px",
    zIndex: 9999,
  }),

  menuList: (base) => ({
    ...base,
    // background: "rgba(255, 255, 255, 0.25)",
    color: "#000",
  }),

  option: (base, state) => ({
    ...base,
    // background: state.isFocused
    //   ? "rgba(255, 255, 255, 0.25)"
    //   : "rgba(255, 255, 255, 0.15)",
    // backdropFilter: "blur(8px)",
    borderRadius: "8px",
    color: "#000",
    padding: "10px 16px",
    cursor: "pointer",
  }),

  singleValue: (base) => ({
    ...base,
    // color: "rgba(255, 255, 255, 0.25)",
  }),

  placeholder: (base) => ({
    ...base,
    color: "rgba(255, 255, 255, 0.6)",
  }),

  input: (base) => ({
    ...base,
    color: "#fff",
  }),
}}

                    />

                    {errors[`${item.id}-skill`] && (
                      <p className="text-red-400 text-sm">{errors[`${item.id}-skill`]}</p>
                    )}
                  </div>

                  {/* Level Dropdown */}
                  <div>
                    <label className="text-gray-300 text-sm font-medium">
                      Proficiency <span className="text-red-400">*</span>
                    </label>

                    <Select
                      options={levelOptions}
                      value={levelOptions.find((opt) => opt.value === item.level) || null}
                      onChange={(selected) =>
                        handleChange(item.id, "level", selected ? selected.value : "")
                      }
                      className="mt-2"
                      classNamePrefix="react-select"
                      placeholder="Select Level"
                      styles={{
  control: (base, state) => ({
    ...base,
    background: "rgba(255, 255, 255, 0.08)",  // glass effect
    backdropFilter: "blur(8px)",
    borderRadius: "12px",
    border: state.isFocused
      ? "1px solid rgba(255, 255, 255, 0.4)"
      : `1px solid ${
          errors[`${item.id}-skill`] ? "#f87171" : "rgba(255, 255, 255, 0.25)"
        }`,
    boxShadow: "none",
    padding: "4px",
    color: "#fff",
  }),

  menu: (base) => ({
    ...base,
    background: "rgba(255, 255, 255, 0.12)",  // glass dropdown
    backdropFilter: "blur(12px)",
    borderRadius: "12px",
    padding: "6px",
    zIndex: 9999,
  }),

  menuList: (base) => ({
    ...base,
    background: "transparent",
    color: "#000",
  }),

  option: (base, state) => ({
    ...base,
    background: state.isFocused
      ? "rgba(255, 255, 255, 0.25)"
      : "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(8px)",
    borderRadius: "8px",
    color: "#000",
    padding: "10px 16px",
    cursor: "pointer",
  }),

  singleValue: (base) => ({
    ...base,
    color: "#fff",
  }),

  placeholder: (base) => ({
    ...base,
    color: "rgba(255, 255, 255, 0.6)",
  }),

  input: (base) => ({
    ...base,
    color: "#fff",
  }),
}}

                    />

                    {errors[`${item.id}-level`] && (
                      <p className="text-red-400 text-sm">{errors[`${item.id}-level`]}</p>
                    )}
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ADD BUTTON */}
        <div className="mt-8 text-center">
          <button
            onClick={addSkill}
            className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-xl 
            shadow hover:bg-white/20 transition"
          >
            + Add Another Skill
          </button>
        </div>

        {/* Navigation */}
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
          box-shadow: 0 0 40px rgba(139, 92, 246, 0.25),
                      inset 0 0 20px rgba(255, 255, 255, 0.05);
        }

        /* React Select option text fix */
        .react-select__option {
          color: #000 !important;
        }
        .react-select__option--is-focused {
          background: #f0f0f0 !important;
          color: #000 !important;
        }
        .react-select__option--is-selected {
          background: #e0e0e0 !important;
          color: #000 !important;
        }

        /* Selected value visible on dark theme */
        .react-select__single-value {
          color: #fff !important;
        }

        .react-select__placeholder {
          color: #bbb !important;
        }

        .react-select__menu {
          z-index: 9999 !important;
        }
      `}</style>
    </div>
  );
}
