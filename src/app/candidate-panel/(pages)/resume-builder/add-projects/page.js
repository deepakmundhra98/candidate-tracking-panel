"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsTrash } from "react-icons/bs";
import { useRouter } from "next/navigation";

export default function ProjectsStep() {
  const router = useRouter();

  const [projects, setProjects] = useState([
    {
      id: Date.now(),
      title: "",
      role: "",
      start_month: "",
      end_month: "",
      ongoing: false,
      link: "",
      description: "",
    },
  ]);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  useEffect(() => {
    // load saved projects if any
    const raw = localStorage.getItem("rb_projects");
    if (raw) {
      try {
        setProjects(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const handleChange = (id, field, value) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
    setErrors((prev) => ({ ...prev, [`${id}-${field}`]: "" }));
  };

  const toggleOngoing = (id, checked) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ongoing: checked, end_month: checked ? "" : p.end_month }
          : p
      )
    );
  };

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        role: "",
        start_month: "",
        end_month: "",
        ongoing: false,
        link: "",
        description: "",
      },
    ]);
  };

  const removeProject = (id) => {
    if (projects.length === 1) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const validate = () => {
    const temp = {};
    projects.forEach((p) => {
      if (!p.title.trim()) temp[`${p.id}-title`] = "Project title required.";
      if (!p.role.trim()) temp[`${p.id}-role`] = "Your role required.";
      if (!p.start_month.trim())
        temp[`${p.id}-start_month`] = "Start date required.";
      if (!p.ongoing && !p.end_month.trim())
        temp[`${p.id}-end_month`] = "End date required unless ongoing.";
      if (!p.description.trim())
        temp[`${p.id}-description`] = "Description required.";
    });
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleNext = () => {
    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    localStorage.setItem("rb_projects", JSON.stringify(projects));
    router.push(
      "/candidate-panel/resume-builder/add-achievements-and-certifications"
    );
  };

  const handleBack = () => {
    localStorage.setItem("rb_projects", JSON.stringify(projects));
    router.push("/candidate-panel/resume-builder/add-skills");
  };

  return (
    <div className="p-6 relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0f1124] via-[#15172e] to-[#090c1b]" />
      <div className="absolute top-20 left-20 w-80 h-80 bg-indigo-600/25 blur-[150px] rounded-full" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/25 blur-[170px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className={`min-w-[900px] backdrop-blur-3xl bg-white/10 border border-white/20 shadow-xl rounded-3xl p-10 neon-card ${
          shake ? "animate-shake" : ""
        }`}
      >
        <h1 className="text-3xl font-semibold text-white text-center">
          Step 5: Projects
        </h1>
        <p className="text-gray-300 text-sm text-center mt-2 mb-8">
          Add notable projects — what you built and your role.
        </p>

        <div className="space-y-8">
          <AnimatePresence>
            {projects.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl relative"
              >
                {projects.length > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => removeProject(p.id)}
                    className="absolute top-4 right-4 p-2 bg-red-500/20 border border-red-400/30 rounded-full text-red-300"
                  >
                    <BsTrash />
                  </motion.button>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-gray-300 text-sm">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={p.title}
                      onChange={(e) =>
                        handleChange(p.id, "title", e.target.value)
                      }
                      className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100 ${
                        errors[`${p.id}-title`]
                          ? "border-red-400"
                          : "border-white/20"
                      }`}
                      placeholder="Project X"
                    />
                    {errors[`${p.id}-title`] && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors[`${p.id}-title`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm">Your Role</label>
                    <input
                      type="text"
                      value={p.role}
                      onChange={(e) =>
                        handleChange(p.id, "role", e.target.value)
                      }
                      className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100 ${
                        errors[`${p.id}-role`]
                          ? "border-red-400"
                          : "border-white/20"
                      }`}
                      placeholder="Lead Developer"
                    />
                    {errors[`${p.id}-role`] && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors[`${p.id}-role`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm">Start Month</label>
                    <input
                      type="month"
                      value={p.start_month}
                      onChange={(e) =>
                        handleChange(p.id, "start_month", e.target.value)
                      }
                      className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100 ${
                        errors[`${p.id}-start_month`]
                          ? "border-red-400"
                          : "border-white/20"
                      }`}
                    />
                    {errors[`${p.id}-start_month`] && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors[`${p.id}-start_month`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300 text-sm">End Month</label>
                      <label className="flex items-center space-x-2 text-gray-300 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={p.ongoing}
                          onChange={(e) =>
                            toggleOngoing(p.id, e.target.checked)
                          }
                          className="w-4 h-4"
                        />
                        <span>Ongoing</span>
                      </label>
                    </div>
                    <input
                      type="month"
                      value={p.end_month}
                      disabled={p.ongoing}
                      onChange={(e) =>
                        handleChange(p.id, "end_month", e.target.value)
                      }
                      className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100 ${
                        p.ongoing
                          ? "opacity-30 cursor-not-allowed border-white/10"
                          : errors[`${p.id}-end_month`]
                          ? "border-red-400"
                          : "border-white/20"
                      }`}
                    />
                    {!p.ongoing && errors[`${p.id}-end_month`] && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors[`${p.id}-end_month`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm">
                      Project Link (optional)
                    </label>
                    <input
                      type="url"
                      value={p.link}
                      onChange={(e) =>
                        handleChange(p.id, "link", e.target.value)
                      }
                      className="w-full mt-2 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-gray-100"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-gray-300 text-sm">Description</label>
                    <textarea
                      rows="4"
                      value={p.description}
                      onChange={(e) =>
                        handleChange(p.id, "description", e.target.value)
                      }
                      className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100 ${
                        errors[`${p.id}-description`]
                          ? "border-red-400"
                          : "border-white/20"
                      }`}
                      placeholder="What you built, tech used, impact..."
                    />
                    {errors[`${p.id}-description`] && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors[`${p.id}-description`]}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={addProject}
            className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
          >
            + Add Project
          </button>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            className="px-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl"
          >
            Next →
          </button>
        </div>
      </motion.div>

      <style>{`
        .neon-card { box-shadow: 0 0 40px rgba(139,92,246,0.25), inset 0 0 20px rgba(255,255,255,0.05); }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        @keyframes shake { 0%{transform:translateX(0)}25%{transform:translateX(-6px)}50%{transform:translateX(6px)}75%{transform:translateX(-4px)}100%{transform:translateX(0)} }
        /* React Select dropdown fix for dark theme */
.react-select__menu {
  background-color: #ffffff !important;   /* white menu */
  color: #000000 !important;              /* black text */
  z-index: 9999 !important;
}

.react-select__menu-list {
  background-color: #ffffff !important;
}

.react-select__option {
  color: #000000 !important;
}

.react-select__option--is-focused {
  background-color: #f0f0f0 !important; /* highlight on hover */
}

.react-select__option--is-selected {
  background-color: #e0e0e0 !important; /* selected item */
  color: #000000 !important;
}

      `}</style>
    </div>
  );
}
