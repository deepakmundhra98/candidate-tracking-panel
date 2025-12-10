"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BsHouse,
  BsPerson,
  BsGear,
  BsBriefcase,
  BsFileEarmarkText,
  BsSearch,
  BsChevronLeft,
  BsChevronRight,
  BsPersonFill,
  BsChevronDown,
} from "react-icons/bs";

import Cookies from "js-cookie";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";

const navigation = [
  { name: "Dashboard", href: "/candidate-panel/dashboard", icon: BsHouse },
  { name: "My Profile", href: "/candidate-panel/profile", icon: BsPerson },
  { name: "My Resume", href: "/candidate-panel/resume", icon: BsFileEarmarkText },
  { name: "Saved Jobs", href: "/candidate-panel/saved-jobs", icon: BsBriefcase },
  { name: "Settings", href: "/candidate-panel/setting", icon: BsGear },
];

export default function CandidatePanelLayout({ children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const isActive = (path) => pathname.startsWith(path);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [resumeOpen, setResumeOpen] = useState(false);

  const raw = Cookies.get("candidateData");
  if (!raw) return null;

  const decoded = decodeURIComponent(raw);
  let actualUserData = JSON.parse(decoded);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const logout = async () => {
    try {
      const response = await axios.post(BaseAPI + "/admin/candidates/logout",null,{
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Cookies.get("tokenCandidate"),
        }
      })
      if(response.data.status === 200){
        Cookies.remove("candidateData");
        Cookies.remove("tokenCandidate");
        window.location.href = "/candidate-panel/login";
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#0f1124]">

      {/* Glow Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/25 blur-[160px] rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-600/20 blur-[180px] rounded-full"></div>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-screen backdrop-blur-2xl border-r border-white/10
          bg-white/5 shadow-2xl shadow-indigo-500/10 transition-all duration-300
          ${collapsed ? "w-16" : "w-64"}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 bg-white/5 backdrop-blur-xl">
          {!collapsed && (
            <span className="text-white tracking-wide font-semibold text-lg">
              LinkedIn Widget
            </span>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition"
          >
            {collapsed ? <BsChevronRight /> : <BsChevronLeft />}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-6 px-3">

          {navigation.map((item) => {
            if (item.name === "My Resume") {
              const Icon = item.icon;

              return (
                <div key="resume-dropdown" className="mb-2">

                  {/* DROPDOWN TRIGGER */}
                  <button
                    onClick={() => setResumeOpen(!resumeOpen)}
                    className={`
                      flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all
                      ${
                        pathname.startsWith("/candidate-panel/resume") ||
                        pathname.startsWith("/candidate-panel/build-resume") ||
                        pathname.startsWith("/candidate-panel/resume-builder") ||
                        pathname.startsWith("/candidate-panel/resume-upload") ||
                        pathname.startsWith("/candidate-panel/fetch-linkedin-profile")
                          ? "bg-gradient-to-r from-indigo-500/30 to-purple-600/30 text-white border border-indigo-400/30 shadow"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5" />
                      {!collapsed && (
                        <span className="ml-3 text-sm font-medium">Resume</span>
                      )}
                    </div>

                    {!collapsed && (
                      <BsChevronDown
                        className={`transition-transform duration-300 ${resumeOpen ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>

                  {/* SMOOTH ANIMATED DROPDOWN */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out 
                    ${resumeOpen && !collapsed ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"}
                    `}
                  >
                    <div className="ml-8 space-y-1">

                      <Link
                        href="/candidate-panel/build-resume"
                        className="block px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 text-sm"
                      >
                        Build Resume
                      </Link>

                      

                      
                      <Link
                        href="/candidate-panel/resume"
                        className="block px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 text-sm"
                      >
                        My Resume 
                      </Link>

                    </div>
                  </div>

                </div>
              );
            }

            // DEFAULT LINKS
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2 rounded-lg mb-2 transition-all
                  ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-indigo-500/30 to-purple-600/30 text-white border border-indigo-400/30 shadow"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {!collapsed && (
                  <span className="ml-3 text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}

          {/* NEW SECTION: JOB MATCHING */}
          <Link
            href="/candidate-panel/job-matching/add-resume"
            className={`
              flex items-center px-3 py-2 rounded-lg mb-2 transition-all
              ${
                pathname.startsWith("/candidate-panel/job-matching")
                  ? "bg-gradient-to-r from-indigo-500/30 to-purple-600/30 text-white border border-indigo-400/30 shadow"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <BsSearch className="w-5 h-5" />
            {!collapsed && (
              <span className="ml-3 text-sm font-medium">Job Matching</span>
            )}
          </Link>

          {/* NEW SECTION: ATS SCORE */}
          <Link
            href="/candidate-panel/ats-score"
            className={`
              flex items-center px-3 py-2 rounded-lg mb-2 transition-all
              ${
                pathname.startsWith("/candidate-panel/ats-score")
                  ? "bg-gradient-to-r from-indigo-500/30 to-purple-600/30 text-white border border-indigo-400/30 shadow"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <BsFileEarmarkText className="w-5 h-5" />
            {!collapsed && (
              <span className="ml-3 text-sm font-medium">ATS Score</span>
            )}
          </Link>

        </nav>

        {/* USER FOOTER */}
        <div
          className={`absolute bottom-0 left-0 px-4 py-4 border-t border-white/10 
            bg-white/5 backdrop-blur-xl transition-all duration-300
            ${collapsed ? "w-16" : "w-64"}`}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              {actualUserData.profile_img ? (
                <img
                  src={actualUserData.profile_img}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <BsPersonFill className="text-white text-xl" />
              )}
            </div>

            {!collapsed && (
              <div className="ml-3">
                <p className="text-white text-sm font-medium">
                  {actualUserData.first_name + " " + actualUserData.last_name}
                </p>
                <p className="text-white/50 text-xs">{actualUserData.email}</p>
              </div>
            )}
          </div>

          {!collapsed && (
            <button onClick={logout} className="mt-3 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 transition text-sm">
              Logout
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div
        className={`flex-1 min-h-screen transition-all duration-300 
          ${collapsed ? "ml-16" : "ml-64"}`}
      >
        <header className="h-16 px-6 flex items-center backdrop-blur-2xl bg-white/5 border-b border-white/10 shadow-xl">
          <h1 className="text-white text-lg font-medium">
            {navigation.find((n) => isActive(n.href))?.name ||
              (pathname.startsWith("/candidate-panel/job-matching") && "Job Matching") ||
              (pathname.startsWith("/candidate-panel/ats-score") && "ATS Score") ||
              "Dashboard"}
          </h1>

          <div className="ml-auto relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-2 text-white/80 hover:text-white"
            >
              <span>{actualUserData.first_name}</span>
              <BsChevronDown className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-lg shadow-xl w-44 py-2 z-20">
                <Link
                  href="/candidate-panel/profile"
                  className="block px-4 py-2 text-sm hover:bg-white/10"
                >
                  Your Profile
                </Link>

                <Link
                  href="javascript:void(0)"
                  onClick={logout}
                  className="cursor-pointer block px-4 py-2 text-sm hover:bg-white/10"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </header>

        <main className="p-4">{children}</main>
      </div>

    </div>
  );
}
