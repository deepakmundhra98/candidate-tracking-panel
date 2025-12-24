"use client";

import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { motion } from "framer-motion";

export default function CandidateDashboard() {
  const stats = [
    {
      name: "ATS Score",
      value: "78%",
      hint: "Target: 80%+",
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Job Match Avg",
      value: "72%",
      hint: "Across saved jobs",
      color: "from-indigo-500 to-purple-500",
    },
    {
      name: "Resume Versions",
      value: "4",
      hint: "Best score: 82%",
      color: "from-pink-500 to-rose-500",
    },
    {
      name: "Saved Jobs",
      value: "11",
      hint: "3 new today",
      color: "from-orange-500 to-amber-500",
    },
  ];

  const activities = [
    { id: 1, content: "ATS score improved to 78%", date: "1h ago" },
    {
      id: 2,
      content: "Checked compatibility for Frontend Engineer",
      date: "5h ago",
    },
    { id: 3, content: "Saved Backend Developer role", date: "1d ago" },
    { id: 4, content: "Updated resume version v4", date: "2d ago" },
  ];

  const nextActions = [
    "Add missing keywords to reach 80% ATS score",
    "Optimize resume for Frontend Developer role",
    "Create a resume version for Backend roles",
  ];

  const axisStyle = {
    tickLabelStyle: { fill: "#ffffff" },
    lineStyle: { stroke: "#ffffff" },
  };

  return (
    <div className="relative min-h-screen p-6 overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-[#0d1027]" />
      <div className="absolute -top-20 -left-20 w-[30rem] h-[30rem] bg-indigo-600/30 blur-[160px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-purple-600/20 blur-[180px] rounded-full -z-10" />

      <div className="space-y-12">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white">Welcome back 👋</h1>
          <p className="text-gray-400 mt-2">
            Track your resume strength and job readiness
          </p>
        </motion.div>

        {/* STATS (UNCHANGED STYLE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="p-5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 neon-card"
            >
              <div
                className={`h-12 w-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white font-bold text-lg`}
              >
                {stat.value}
              </div>

              <p className="mt-4 text-sm text-gray-300">{stat.name}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.hint}</p>
            </motion.div>
          ))}
        </div>

        {/* CHARTS (ONLY COLOR FIX APPLIED) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ATS SCORE TREND */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 neon-card"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              ATS Score Trend
            </h3>

            <LineChart
              xAxis={[
                {
                  data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                  scaleType: "point",
                  ...axisStyle,
                },
              ]}
              yAxis={[axisStyle]}
              series={[
                {
                  data: [58, 63, 68, 72, 75, 78],
                  area: true,
                  color: "#22d3ee",
                },
              ]}
              grid={{ horizontal: true }}
              slotProps={{
                axisLine: {
                  stroke: "#ffffff",
                },
                axisTick: {
                  stroke: "#ffffff",
                },
                axisTickLabel: {
                  fill: "#ffffff",
                  fontSize: 12,
                },
                grid: {
                  stroke: "rgba(255,255,255,0.15)",
                },
              }}
              width={500}
              height={300}
            />
          </motion.div>

          {/* JOB APPLICATIONS */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 neon-card"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              Job Applications
            </h3>

            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                  ...axisStyle,
                },
              ]}
              yAxis={[axisStyle]}
              series={[
                {
                  data: [4, 7, 6, 9, 11, 14],
                  color: "#a78bfa",
                },
              ]}
              grid={{ horizontal: true }}
              slotProps={{
                grid: { stroke: "rgba(255,255,255,0.15)" },
              }}
              width={500}
              height={300}
            />
          </motion.div>
        </div>

        {/* ACTIONS + ACTIVITY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* NEXT BEST ACTIONS (UNCHANGED IDEA) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-white/20 neon-card"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              Next Best Actions
            </h3>

            <ul className="space-y-4">
              {nextActions.map((action, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 6 }}
                  className="text-sm text-gray-200 flex items-start gap-3"
                >
                  <span className="mt-1 h-2 w-2 bg-indigo-400 rounded-full" />
                  {action}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* ACTIVITY FEED */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 neon-card lg:col-span-2"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              Recent Activity
            </h3>

            <ul>
              {activities.map((activity, index) => (
                <motion.li
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="relative pl-10 pb-8 border-l border-gray-600/30"
                >
                  <span className="absolute left-[-7px] top-2 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                  <p className="text-sm text-gray-200">{activity.content}</p>
                  <span className="text-xs text-gray-400">{activity.date}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* GLOW */}
      <style>{`
        .neon-card {
          box-shadow:
            0 0 25px rgba(99,102,241,0.2),
            inset 0 0 12px rgba(255,255,255,0.03),
            0 0 60px rgba(168,85,247,0.15);
        }
      `}</style>
    </div>
  );
}
