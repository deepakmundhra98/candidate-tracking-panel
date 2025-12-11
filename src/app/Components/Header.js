"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";

import { FaBars } from "react-icons/fa6";
import DemoModal from "./DemoModal";
import BaseAPI from "../BaseAPI/BaseAPI";

export default function Header() {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logoImage, setLogoImage] = useState("");

  const getData = async () => {
    try {
      const response = await axios.get(BaseAPI + "/home");
      setLogoImage(response.data.logo);
    } catch (error) {
      console.error("Error fetching header data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const isActive = (path) => {
    if (path === "/" && pathname === "/") return "text-[#27BAEE]";

    if (path === "/blog" && pathname.startsWith("/blog")) return "text-[#27BAEE]";

    return pathname === path ? "text-[#27BAEE]" : "text-gray-500";
  };

  return (
    <div className="border-b">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-12 bg-white font-bold text-black my-4 px-4 sm:px-6 lg:px-8">
          {/* LEFT SIDE */}
          <div className="flex items-center space-x-16">
            {/* LOGO */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              <Link href="/">
                <Image
                  src={logoImage || "/Images/logo/Pasted image.png"}
                  alt="Atsway Logo"
                  width={200}
                  height={60}
                  className="object-contain"
                />
              </Link>
            </div>

            {/* DESKTOP MENU */}
            <div className="hidden lg:flex items-center space-x-6 md:space-x-8">
              <Link href="/" className="text-sm">
                <div
                  className={`flex text-lg hover:text-[#27BAEE] ${isActive("/")}`}
                >
                  Home
                </div>
              </Link>

              <Link href="/hrms" className="text-sm">
                <div
                  className={`flex text-lg hover:text-[#27BAEE] ${isActive(
                    "/hrms"
                  )}`}
                >
                  HRMS
                </div>
              </Link>

              <Link href="/contact-us" className="text-sm">
                <div
                  className={`flex text-lg hover:text-[#27BAEE] ${isActive(
                    "/contact-us"
                  )}`}
                >
                  Contact Us
                </div>
              </Link>

              <Link href="/blog" className="text-sm">
                <div
                  className={`flex text-lg hover:text-[#27BAEE] ${isActive(
                    "/blog"
                  )}`}
                >
                  Blog
                </div>
              </Link>

              <Link href="/pricing" className="text-sm">
                <div
                  className={`flex text-lg hover:text-[#27BAEE] ${isActive(
                    "/pricing"
                  )}`}
                >
                  Pricing
                </div>
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-6 md:space-x-8">
            {/* REQUEST DEMO BUTTON */}
            <Link
              href="/candidate-panel/login"
              className="hidden lg:flex bg-[#27BAEE] font-medium text-white px-4 py-2 rounded"
            >
              Candidate Login
            </Link>
            {/* <button
            onClick={() => setIsModalOpen(true)}
            className="hidden lg:flex bg-blue-600 font-medium text-white px-4 py-2 rounded"
          >
            Request a Demo
          </button>// */}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="lg:hidden flex items-center">
            <button
              className="text-gray-500 hover:text-black"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FaBars
                className={`transition-transform duration-300 ${
                  isMenuOpen ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="lg:hidden flex flex-col gap-3 bg-white py-4 px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className={`text-md font-medium text-center hover:text-black ${isActive(
                "/"
              )}`}
            >
              Home
            </Link>

            <Link
              href="/hrms"
              className={`text-md font-medium text-center hover:text-black ${isActive(
                "/hrms"
              )}`}
            >
              HRMS
            </Link>

            <Link
              href="/contact-us"
              className={`text-md font-medium text-center hover:text-black ${isActive(
                "/contact-us"
              )}`}
            >
              Contact Us
            </Link>

            <Link
              href="/hr-blog"
              className={`text-md font-medium text-center hover:text-black ${isActive(
                "/hr-blog"
              )}`}
            >
              Blog
            </Link>

            <Link
              href="/pricing"
              className={`text-md font-medium text-center hover:text-black ${isActive(
                "/pricing"
              )}`}
            >
              Pricing
            </Link>

            <Link
              href="/candidate-panel/login"
              className="bg-[#27BAEE] text-center text-white px-4 py-2 rounded"
            >
              Candidate Login
            </Link>

            {/* <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Request a Demo
            </button> */}
          </div>
        )}
      </div>

      {/* DEMO MODAL */}
      <DemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
