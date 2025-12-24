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
import Swal from "sweetalert2";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "/candidate-panel/dashboard", icon: BsHouse },
  { name: "My Profile", href: "/candidate-panel/profile", icon: BsPerson },
  {
    name: "My Resume",
    href: "/candidate-panel/resume",
    icon: BsFileEarmarkText,
  },
  {
    name: "Saved Jobs",
    href: "/candidate-panel/saved-jobs",
    icon: BsBriefcase,
  },
  { name: "Settings", href: "/candidate-panel/setting", icon: BsGear },
];

export default function CandidatePanelLayout({ children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  /* ===================== URL MATCH LOGIC ===================== */
  const isResumeRoute =
    pathname.startsWith("/candidate-panel/resume") ||
    pathname.startsWith("/candidate-panel/resume-listing") ||
    pathname.startsWith("/candidate-panel/build-resume") ||
    pathname.startsWith("/candidate-panel/resume-upload") ||
    pathname.startsWith("/candidate-panel/fetch-linkedin-profile");

  /* ===================== AUTO OPEN RESUME DROPDOWN ===================== */
  const [resumeOpen, setResumeOpen] = useState(isResumeRoute);

  useEffect(() => {
    if (isResumeRoute) {
      setResumeOpen(true);
    }
  }, [pathname]);

  /* ===================== SIDEBAR USER ===================== */
  const raw = Cookies.get("candidateData");
  if (!raw) return null;
  const decoded = decodeURIComponent(raw);
  let actualUserData = JSON.parse(decoded);

  /* ===================== OUTSIDE CLICK MENU CLOSE ===================== */
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ===================== LOGOUT ===================== */
  const logout = async () => {
    try {
      const confirm = Swal.fire({
        title: "Are you sure you want to logout?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, logout",
        cancelButtonText: "Cancel",
      });

      if (!(await confirm).isConfirmed) return;

      const response = await axios.post(
        BaseAPI + "/admin/candidates/logout",
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + Cookies.get("tokenCandidate"),
          },
        }
      );

      if (response.data.status === 200) {
        Cookies.remove("candidateData");
        Cookies.remove("tokenCandidate");
        window.location.href = "/candidate-panel/login";
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const isActive = (path) => pathname.startsWith(path);

  return (
    <div className="min-h-screen flex bg-[#0f1124]">
      {/* GLOW BG */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/25 blur-[160px] rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-600/20 blur-[180px] rounded-full"></div>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full backdrop-blur-2xl border-r border-white/10
          bg-white/5 shadow-2xl shadow-indigo-500/10 transition-all duration-300 z-20
          ${collapsed ? "w-16" : "w-64"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 bg-white/5 backdrop-blur-xl">
          {!collapsed &&
            (actualUserData.profile_image ? (
              <>
                {/* <Image
                  width={10}
                  height={10}
                  src={actualUserData.profile_image}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                /> */}
                <p>
                  <span className="text-white tracking-wide font-semibold text-lg">
                    Welcome {actualUserData.first_name}
                  </span>
                </p>
              </>
            ) : (
              <>
                <BsPersonFill className="text-white text-xl" />
                <p>
                  <span className="text-white tracking-wide font-semibold text-lg">
                    Welcome {actualUserData.first_name}
                  </span>
                </p>
              </>
            ))}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition"
          >
            {collapsed ? <BsChevronRight /> : <BsChevronLeft />}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-6 px-3">
          {/* Default sidebar items remain untouched */}

          <Link
            href="/candidate-panel/dashboard"
            className={`
              flex items-center px-3 py-2 rounded-lg mb-2 transition-all
              ${
                isActive("/candidate-panel/dashboard")
                  ? "bg-gradient-to-r from-indigo-500/30 to-purple-600/30 text-white border border-indigo-400/30 shadow"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <BsHouse className="w-5 h-5" />
            {!collapsed && (
              <span className="ml-3 text-sm font-medium">Dashboard</span>
            )}
          </Link>

          <Link
            href="/candidate-panel/profile"
            className={`
              flex items-center px-3 py-2 rounded-lg mb-2 transition-all
              ${
                isActive("/candidate-panel/profile")
                  ? "bg-gradient-to-r from-indigo-500/30 to-purple-600/30 text-white border border-indigo-400/30 shadow"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <BsPerson className="w-5 h-5" />
            {!collapsed && (
              <span className="ml-3 text-sm font-medium">My Profile</span>
            )}
          </Link>

          {/* RESUME DROPDOWN */}
          <div className="mb-2">
            <button
              onClick={() => setResumeOpen(!resumeOpen)}
              className={`
                flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all
                ${
                  isResumeRoute
                    ? "bg-gradient-to-r from-indigo-500/30 to-purple-600/30 text-white border border-indigo-400/30 shadow"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <div className="flex items-center">
                <BsFileEarmarkText className="w-5 h-5" />
                {!collapsed && (
                  <span className="ml-3 text-sm font-medium">Resume</span>
                )}
              </div>

              {!collapsed && (
                <BsChevronDown
                  className={`transition-transform duration-300 ${
                    resumeOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out 
              ${
                resumeOpen && !collapsed
                  ? "max-h-40 opacity-100 mt-2"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="ml-8 space-y-1">
                <Link
                  href="/candidate-panel/build-resume"
                  className={`
                    block px-3 py-2 rounded-lg text-sm
                    ${
                      pathname === "/candidate-panel/build-resume" ||
                      pathname === "/candidate-panel/fetch-linkedin-profile" ||
                      pathname === "/candidate-panel/resume-upload" ||
                      pathname === "/candidate-panel/resume-builder" ||
                      pathname ===
                        "/candidate-panel/resume-builder/personal-details" ||
                      pathname ===
                        "/candidate-panel/resume-builder/education-details" ||
                      pathname ===
                        "/candidate-panel/resume-builder/work-experience-details" ||
                      pathname ===
                        "/candidate-panel/resume-builder/add-skills" ||
                      pathname ===
                        "/candidate-panel/resume-builder/add-projects" ||
                      pathname ===
                        "/candidate-panel/resume-builder/add-achievements-and-certifications" ||
                      pathname ===
                        "/candidate-panel/resume-builder/add-professional-summary" ||
                      pathname ===
                        "/candidate-panel/resume-builder/final-resume-preview"
                        ? "bg-indigo-500/30 text-white border border-indigo-400/30"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }
                  `}
                >
                  Build Resume
                </Link>

                <Link
                  href="/candidate-panel/resume-listing"
                  className={`
                    block px-3 py-2 rounded-lg text-sm
                    ${
                      pathname === "/candidate-panel/resume" ||
                      pathname === "/candidate-panel/resume-listing"
                        ? "bg-indigo-500/30 text-white border border-indigo-400/30"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }
                  `}
                >
                  My Resume
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/candidate-panel/saved-jobs"
            className={`
              flex items-center px-3 py-2 rounded-lg mb-2 transition-all
              ${
                isActive("/candidate-panel/saved-jobs")
                  ? "bg-gradient-to-r from-indigo-500/30 to-purple-600/30 text-white border border-indigo-400/30 shadow"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <BsBriefcase className="w-5 h-5" />
            {!collapsed && (
              <span className="ml-3 text-sm font-medium">Saved Jobs</span>
            )}
          </Link>

          {/* Job Compatibility Test */}
          <Link
            href="/candidate-panel/job-compatibility-test/welcome"
            className={`
              flex items-center px-3 py-2 rounded-lg mb-2 transition-all
              ${
                pathname.startsWith("/candidate-panel/job-compatibility-test")
                  ? "bg-gradient-to-r from-indigo-500/30 to-purple-600/30 text-white border border-indigo-400/30 shadow"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <BsSearch className="w-5 h-5" />
            {!collapsed && (
              <span className="ml-3 text-sm font-medium">
                Job Compatibility Test
              </span>
            )}
          </Link>

          {/* ATS */}
          <Link
            href="/candidate-panel/ats-score/add-resume"
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

          <Link
            href="/candidate-panel/setting"
            className={`
              flex items-center px-3 py-2 rounded-lg mb-2 transition-all
              ${
                isActive("/candidate-panel/setting")
                  ? "bg-gradient-to-r from-indigo-500/30 to-purple-600/30 text-white border border-indigo-400/30 shadow"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <BsGear className="w-5 h-5" />
            {!collapsed && (
              <span className="ml-3 text-sm font-medium">Settings</span>
            )}
          </Link>
        </nav>

        {/* USER */}
        <div
          className={`absolute bottom-0 left-0 px-4 py-4 border-t border-white/10 
            bg-white/5 backdrop-blur-xl transition-all duration-300
            ${collapsed ? "w-16" : "w-64"}`}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              {actualUserData.profile_image ? (
                <Image
                  width={40}
                  height={40}
                  src={actualUserData.profile_image}
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
            <button
              onClick={logout}
              className="mt-3 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 transition text-sm"
            >
              Logout
            </button>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <div
        className={`flex-1 min-h-screen transition-all duration-300 
          ${collapsed ? "ml-16" : "ml-64"}`}
      >
        <header className="h-16 px-6 flex items-center backdrop-blur-2xl bg-white/5 border-b border-white/10 shadow-xl z-40 relative">
          {/* <h1 className="text-white text-lg font-medium">
            {navigation.find((n) => isActive(n.href))?.name ||
              (isResumeRoute && "Resume") ||
              (pathname.startsWith("/candidate-panel/job-matching") &&
                "Job Matching") ||
              (pathname.startsWith("/candidate-panel/ats-score") &&
                "ATS Score") ||
              "Dashboard"}
          </h1> */}

          <div className="ml-auto relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-2 text-white/80 hover:text-white"
            >
              <span>{actualUserData.first_name}</span>
              <BsChevronDown className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-lg shadow-xl w-44 py-2 z-50">
                <Link
                  href="/candidate-panel/profile"
                  className="block px-4 py-2 text-sm hover:bg-white/10"
                >
                  Your Profile
                </Link>

                <button
                  onClick={logout}
                  className="w-full text-left cursor-pointer block px-4 py-2 text-sm hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
