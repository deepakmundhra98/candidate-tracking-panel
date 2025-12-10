"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  BsSearch,
  BsPersonFill,
  BsLink45Deg,
  BsGeoAlt,
  BsCalendar,
} from "react-icons/bs";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export default function LinkedInSearchA() {
  const [profileUrl, setProfileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const token = Cookies.get("tokenCandidate");

  const extractDescription = (descArray) => {
    if (!Array.isArray(descArray)) return "";
    return descArray
      .map((d) => {
        if (typeof d === "string") return d;
        if (d && typeof d === "object" && d.text) return d.text;
        return "";
      })
      .filter(Boolean)
      .join("\n");
  };

  const fetchProfile = async (e) => {
    e && e.preventDefault();
    setError("");
    if (!profileUrl) {
      setError("Please enter a LinkedIn profile URL");
      return;
    }
    setIsLoading(true);
    setProfile(null);

    try {
      const token = process.env.NEXT_PUBLIC_APIFY_TOKEN;
      // NOTE: set NEXT_PUBLIC_APIFY_TOKEN in your env. Do NOT hardcode keys.
      const resp = await axios.post(
        "https://api.apify.com/v2/acts/dev_fusion~linkedin-profile-scraper/run-sync-get-dataset-items?format=json",
        { profileUrls: [profileUrl] },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = resp.data && resp.data[0] ? resp.data[0] : resp.data;

      // map experiences
      
      const experiences = [];
      (data.experiences || []).forEach((exp) => {
        const base = {
          title: exp.title || "",
          company: exp.subtitle || exp.companyName || "",
          employmentType: exp.employmentType || "",
          jobLocation: exp.jobLocation || exp.location || "",
          logo: exp.logo || "",
          jobStartedOn: exp.jobStartedOn || exp.dateStarted || "",
          jobEndedOn: exp.jobEndedOn || exp.dateEnded || "",
          jobStillWorking: exp.jobStillWorking || false,
          duration: "",
          description: extractDescription(
            exp.subComponents?.[0]?.description || exp.description || []
          ),
        };

        // Calculate duration text
        if (base.jobStillWorking) {
          base.duration = `${base.jobStartedOn} — Present`;
        } else if (base.jobStartedOn && base.jobEndedOn) {
          base.duration = `${base.jobStartedOn} — ${base.jobEndedOn}`;
        } else {
          base.duration = exp.caption || "";
        }

        experiences.push(base);
      });

      const mapped = {
        name:
          data.fullName ||
          `${data.firstName || ""} ${data.lastName || ""}`.trim(),
        profilePic: data.profilePic || "",
        headline: data.headline || "",
        location: data.addressWithCountry || data.location || "",
        about: data.about || "",
        experience: experiences,
        education: (data.educations || []).map((edu) => ({
          school: edu.title || "",
          degree: edu.subtitle || "",
          field: "",
          year: edu.caption || "",
          link: edu.companyLink1 || "",
          description: extractDescription(
            edu.subComponents?.[0]?.description || []
          ),
        })),
        skills: (data.skills || []).map((s) => s.title || s).filter(Boolean),
        profileUrl: data.linkedinUrl || profileUrl,
      };

      setProfile(mapped);
    } catch (err) {
      console.error(
        "fetchProfile error:",
        err?.response?.data || err.message || err
      );
      setError(
        "Failed to fetch profile. Check your API key, CORS and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // console.log("Saving profile:", profile);
    // return;
    try {
      const response = await axios.post(
        BaseAPI + "/admin/candidates/save-linkedin-profile",
        profile,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
        setProfile(null);
        setProfileUrl("");
        Swal.fire({
          icon: "success",
          title: "Profile Saved",
          text: "The LinkedIn profile has been saved successfully.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Save Failed",
          text:
            response.data.message ||
            "An error occurred while saving the profile.",
        })
      }
    } catch (err) {
      console.error("handleSave error:", err);
    }
  };

  return (
    <div className="relative p-6 min-h-screen">
      {/* Background blobs */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#0f1124] via-[#15172e] to-[#080912]" />
      <div className="absolute top-16 left-12 w-72 h-72 bg-indigo-600/25 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-8 right-12 w-80 h-80 bg-purple-600/20 blur-[140px] rounded-full -z-10" />

      <motion.div
        className="max-w-5xl mx-auto bg-white/6 backdrop-blur-2xl border border-white/8 neon-card rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Search area */}
        <div className="p-6 border-b border-white/8">
          <h2 className="text-white text-2xl font-semibold">
            LinkedIn Profile Search
          </h2>
          <p className="text-gray-300 mt-1">
            Paste a public LinkedIn profile URL to fetch details.
          </p>

          <form onSubmit={fetchProfile} className="mt-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <BsLink45Deg />
                </div>
                <input
                  type="url"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/in/username"
                  className="text-black w-full pl-10 pr-4 py-2 rounded-l-lg  border border-white/12 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-r-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:brightness-105 transition"
              >
                <BsSearch />
                <span>{isLoading ? "Searching..." : "Search"}</span>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Enter a public LinkedIn profile URL to fetch details.
            </p>

            {error && (
              <div className="mt-3 bg-red-600/10 border-l-4 border-red-500 text-red-200 p-3 rounded">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Profile */}
        <div className="">
          {isLoading && (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 border-4 border-white/10 border-t-white/60 rounded-full animate-spin" />
            </div>
          )}

          {!isLoading && profile && (
            <div className="space-y-6">
              {/* Header */}
              <div className="px-6 py-4 flex justify-between border-b border-white/6 mb-4">
                <p className="inline-flex text-2xl items-center gap-2 px-0 py-2 rounded-lg text-white font-bold hover:brightness-105 transition">
                  Information Fetched
                </p>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex  items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:brightness-105 transition"
                  onClick={handleSave}
                >
                  <BsSearch />
                  <span>{isLoading ? "Saving..." : "Save"}</span>
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-6">
                  <div className="rounded-full p-1 bg-white/10">
                    {profile.profilePic ? (
                      <img
                        src={profile.profilePic}
                        alt={profile.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-white/6 flex items-center justify-center text-white">
                        <BsPersonFill size={36} />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-white">
                      {profile.name}
                    </h3>
                    <p className="text-indigo-200 mt-1">{profile.headline}</p>
                    <div className="flex items-center text-indigo-200 mt-2 gap-2 text-sm">
                      <BsGeoAlt />
                      <span>{profile.location}</span>
                    </div>
                  </div>
                </div>

                {/* About */}
                {profile.about && (
                  <section>
                    <h4 className="text-white font-semibold mb-2">About</h4>
                    <p className="text-gray-300 whitespace-pre-line">
                      {profile.about}
                    </p>
                  </section>
                )}

                {/* Experience */}
                <section>
                  <h4 className="text-white font-semibold mb-4">Experience</h4>

                  <div className="space-y-6">
                    {profile.experience.map((exp, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        className="relative pl-4 pb-4"
                      >
                        {/* Left vertical line */}
                        <div className="absolute left-0 top-1 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-500 rounded"></div>

                        {/* HEADER ROW - TITLE + COMPANY (LEFT) & TYPE + DURATION (RIGHT) */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          {/* LEFT SIDE */}
                          <div className="flex items-center gap-4">
                            {/* Logo */}
                            {exp.logo ? (
                              <img
                                src={exp.logo}
                                alt={exp.company}
                                className="w-12 h-12 rounded-md object-cover bg-white/10"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-md bg-white/10" />
                            )}

                            <div>
                              <h5 className="text-white font-semibold text-lg">
                                {exp.title}
                              </h5>
                              <div className="text-indigo-200 text-sm">
                                {exp.company}
                              </div>
                              {exp.jobLocation && (
                                <div className="flex items-center gap-1 text-indigo-300 text-sm">
                                  <BsGeoAlt /> {exp.jobLocation}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* RIGHT SIDE — EMPLOYMENT TYPE + DURATION */}
                          <div className="text-right md:min-w-[180px]">
                            {/* Employment Type */}
                            {exp.employmentType && (
                              <p className="text-purple-300 text-sm font-medium">
                                {exp.employmentType}
                              </p>
                            )}

                            {/* Duration */}
                            <p className="text-gray-300 text-sm mt-1 flex items-center justify-end gap-1">
                              <BsCalendar className="text-gray-400" />
                              {exp.duration}
                            </p>
                          </div>
                        </div>

                        {/* DESCRIPTION */}
                        {exp.description && (
                          <p className="text-gray-300 mt-3 whitespace-pre-line leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Education */}
                <section>
                  <h4 className="text-white font-semibold mb-4">Education</h4>
                  <div className="space-y-4">
                    {profile.education.map((edu, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="pl-4 relative"
                      >
                        <div className="absolute left-0 top-1 w-2 h-full bg-gradient-to-b from-purple-500 to-indigo-500 rounded" />
                        <h5 className="text-white font-semibold">
                          {edu.school}
                        </h5>
                        {edu.degree && (
                          <div className="text-indigo-200 text-sm">
                            {edu.degree}
                          </div>
                        )}
                        {edu.year && (
                          <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                            <BsCalendar /> <span>{edu.year}</span>
                          </div>
                        )}
                        {edu.description && (
                          <p className="text-gray-300 mt-2 whitespace-pre-line">
                            {edu.description}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Skills */}
                <section>
                  <h4 className="text-white font-semibold mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-sm bg-indigo-500/20 text-indigo-200 border border-indigo-400/10"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              {/* Footer */}
              <div className="p-6 pt-4 border-t border-white/6">
                <a
                  href={profile.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-100"
                >
                  View full profile on LinkedIn <BsLink45Deg />
                </a>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <style>{`.neon-card { box-shadow: 0 0 30px rgba(99,102,241,0.12), inset 0 0 12px rgba(255,255,255,0.02); }`}</style>
    </div>
  );
}
