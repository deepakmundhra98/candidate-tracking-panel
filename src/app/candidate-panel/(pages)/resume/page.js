"use client";

import { motion } from "framer-motion";

export default function Resume() {
  const resume = {
    title: "Senior Product Designer",
    experience: [
      {
        id: 1,
        title: "Senior Product Designer",
        company: "TechCorp",
        location: "San Francisco, CA",
        startDate: "2020",
        endDate: "Present",
        description:
          "Leading the design of enterprise products and design systems.",
      },
      {
        id: 2,
        title: "Product Designer",
        company: "DesignHub",
        location: "New York, NY",
        startDate: "2018",
        endDate: "2020",
        description:
          "Designed and shipped multiple features for the core product.",
      },
    ],
    education: [
      {
        id: 1,
        degree: "Master of Design",
        school: "Stanford University",
        field: "Human-Computer Interaction",
        year: "2018",
      },
      {
        id: 2,
        degree: "Bachelor of Fine Arts",
        school: "Rhode Island School of Design",
        field: "Graphic Design",
        year: "2016",
      },
    ],
    skills: [
      "UI/UX Design",
      "User Research",
      "Prototyping",
      "Figma",
      "Sketch",
      "Adobe Creative Suite",
      "HTML/CSS",
      "Design Systems",
    ],
  };

  return (
    <div className="relative p-6">

      {/* Futuristic Background */}
      <div className="min-h-screen absolute inset-0 -z-10 bg-gradient-to-br from-[#0e1125] via-[#171a31] to-[#0d0f1c]" />
      <div className="absolute top-10 left-20 w-96 h-96 bg-indigo-600/30 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-10 right-20 w-[30rem] h-[30rem] bg-purple-500/20 blur-[160px] rounded-full -z-10" />

      <div className="max-w-5xl mx-auto">

        {/* HEADER CARD */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="p-6 mb-8 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-xl neon-card"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-semibold text-white">My Resume</h2>
              <p className="text-gray-300 mt-1">
                Your professional journey & achievements
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.92 }}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 
              text-white font-medium shadow-md hover:shadow-purple-500/40 transition"
            >
              Download PDF
            </motion.button>
          </div>
        </motion.div>

        {/* MAIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl neon-card shadow-2xl"
        >

          {/* EXPERIENCE */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-semibold text-white mb-6 tracking-wide">
              Experience
            </h3>

            {resume.experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="relative pl-6 mb-10 last:mb-0"
              >
                {/* Futuristic left line */}
                <span className="absolute left-0 top-1 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />

                <div className="flex justify-between max-sm:flex-col max-sm:gap-1">
                  <h4 className="text-xl font-semibold text-white">{exp.title}</h4>
                  <span className="text-gray-300">{exp.startDate} - {exp.endDate}</span>
                </div>

                <p className="text-indigo-300 font-medium">{exp.company}</p>
                <p className="text-gray-400 text-sm mb-2">{exp.location}</p>
                <p className="text-gray-300 leading-relaxed">{exp.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* EDUCATION */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-semibold text-white mb-6 tracking-wide">
              Education
            </h3>

            {resume.education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="relative pl-6 mb-10 last:mb-0"
              >
                {/* timeline bar */}
                <span className="absolute left-0 top-1 w-1 h-full bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full" />

                <div className="flex justify-between max-sm:flex-col max-sm:gap-1">
                  <h4 className="text-xl font-semibold text-white">{edu.degree}</h4>
                  <span className="text-gray-300">{edu.year}</span>
                </div>

                <p className="text-indigo-300 font-medium">{edu.school}</p>
                <p className="text-gray-400 text-sm">{edu.field}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* SKILLS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-2xl font-semibold text-white mb-6 tracking-wide">
              Skills
            </h3>

            <div className="flex flex-wrap gap-3">
              {resume.skills.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.08 }}
                  className="px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 
                  text-indigo-200 text-sm font-medium shadow hover:shadow-indigo-500/40 transition"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* Neon glow style */}
      <style>{`
        .neon-card {
          box-shadow:
            0 0 25px rgba(99, 102, 241, 0.20),
            inset 0 0 10px rgba(255, 255, 255, 0.03),
            0 0 50px rgba(168, 85, 247, 0.15);
        }
      `}</style>
    </div>
  );
}
