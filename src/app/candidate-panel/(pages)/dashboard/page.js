"use client";

import {
  BarChart,
  LineChart,
  PieChart,
} from "@mui/x-charts";
import { motion } from "framer-motion";

export default function Page() {
  const stats = [
    { name: "Total Applications", value: "128", change: "+12%", changeType: "increase" },
    { name: "Interview Rate", value: "24.3%", change: "+4%", changeType: "increase" },
    { name: "Profile Views", value: "1,234", change: "+12.5%", changeType: "increase" },
    { name: "Avg. Response Time", value: "3.2 days", change: "-0.5 days", changeType: "decrease" },
  ];

  const activities = [
    { id: 1, content: "Applied for Senior Product Designer at Google", date: "2h ago" },
    { id: 2, content: "Your profile was viewed by 12 recruiters", date: "1d ago" },
    { id: 3, content: "You have 3 new job recommendations", date: "2d ago" },
    { id: 4, content: "You have 5 new connection requests", date: "3d ago" },
  ];

  return (
    <div className="relative p-6">

      {/* ✨ FUTURISTIC BACKGROUND */}
      <div className="min-h-screen absolute inset-0 -z-10 bg-[#0d1027]" />
      <div className="absolute top-0 left-0 w-[25rem] h-[25rem] bg-indigo-600/30 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[25rem] h-[25rem] bg-purple-500/20 blur-[170px] rounded-full -z-10" />

      <div className="space-y-10">

        {/* ⭐ STATS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 neon-card shadow-lg"
            >
              <div className="flex items-center">
                <div className="h-14 w-14 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-lg">
                  {stat.value}
                </div>

                <div className="ml-5">
                  <p className="text-sm text-gray-300 truncate">{stat.name}</p>
                  <p className="text-2xl font-semibold text-white mt-1">
                    {stat.value}
                    <span
                      className={`ml-2 text-sm ${
                        stat.changeType === "increase"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 📊 CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* BAR CHART */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 neon-card shadow-xl"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Job Applications</h3>

            <BarChart
              xAxis={[{ scaleType: "band", data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] }]}
              series={[{ data: [65, 59, 80, 81, 56, 55] }]}
              width={500}
              height={300}
            />
          </motion.div>

          {/* LINE CHART */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 neon-card shadow-xl"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Profile Views</h3>

            <LineChart
              xAxis={[{ data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] }]}
              series={[
                {
                  data: [33, 53, 85, 41, 44, 65],
                  area: true,
                },
              ]}
              width={500}
              height={300}
            />
          </motion.div>
        </div>

        {/* 📌 ACTIVITY FEED + PIE CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* 🌐 ACTIVITY FEED */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 neon-card shadow-xl lg:col-span-2"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>

            <ul>
              {activities.map((activity, index) => (
                <motion.li
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative pl-10 pb-8 border-l ${
                    index === activities.length - 1
                      ? "border-transparent"
                      : "border-gray-600/30"
                  }`}
                >
                  <span className="absolute left-[-7px] top-6 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg" />

                  <p className="text-sm text-gray-200">{activity.content}</p>
                  <span className="text-xs text-gray-400 mt-1 block">{activity.date}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* 🟣 PIE CHART */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 neon-card shadow-xl"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Profile Strength</h3>

            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 85, label: "Profile Strength" },
                    { id: 1, value: 75, label: "Resume Strength" },
                    { id: 2, value: 90, label: "Skills Match" },
                  ],
                },
              ]}
              width={400}
              height={300}
            />
          </motion.div>
        </div>
      </div>

      {/* Neon Card Glow */}
      <style>{`
        .neon-card {
          box-shadow:
            0 0 25px rgba(99, 102, 241, 0.18),
            inset 0 0 10px rgba(255, 255, 255, 0.03),
            0 0 50px rgba(168, 85, 247, 0.15);
        }
      `}</style>
    </div>
  );
}
