"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";

import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaFacebookF, FaPinterest } from "react-icons/fa";
import { FaXTwitter, FaInstagram } from "react-icons/fa6";
import { FiLinkedin } from "react-icons/fi";
import BaseAPI from "@/app/BaseAPI/BaseAPI";

export default function Footer() {
  const pathname = usePathname();
  const [data, setData] = useState({});
  const [logoImage, setLogoImage] = useState("");

  const getData = async () => {
    try {
      const response = await axios.get(BaseAPI + "/home");
      setData(response.data.links);
      setLogoImage(response.data.logo);
    } catch (error) {
      console.error("Error fetching footer data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const isActive = (path) => {
    if (path === "/" && pathname === "/") return "text-black";

    if (path === "/blog" && pathname.startsWith("/hr-blog"))
      return "text-black";

    return pathname === path ? "text-black" : "text-gray-500";
  };

  return (
    <footer className="bg-gray-200 text-white py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 text-center sm:text-left px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link href="/">
              <Image
                src={logoImage || "/Images/logo/Pasted image.png"}
                alt="Atsway Logo"
                width={200}
                height={70}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start justify-start">
            <h3 className="text-2xl text-black font-semibold mb-4">
              Quick Links
            </h3>

            <ul className="grid grid-cols-3 gap-3">
              <li>
                <Link
                  href="/"
                  className={`flex gap-0.5 font-medium items-center text-lg hover:text-black transition-colors duration-300 ${isActive(
                    "/"
                  )}`}
                >
                  <MdOutlineKeyboardArrowRight />
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/hrms"
                  className={`flex gap-0.5 font-medium items-center text-lg hover:text-black transition-colors duration-300 ${isActive(
                    "/hrms"
                  )}`}
                >
                  <MdOutlineKeyboardArrowRight />
                  HRMS
                </Link>
              </li>

              <li>
                <Link
                  href="/contact-us"
                  className={`flex gap-0.5 font-medium items-center text-lg hover:text-black transition-colors duration-300 ${isActive(
                    "/contact-us"
                  )}`}
                >
                  <MdOutlineKeyboardArrowRight />
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/blog"
                  className={`flex gap-0.5 font-medium items-center text-lg hover:text-black transition-colors duration-300 ${isActive(
                    "/blog"
                  )}`}
                >
                  <MdOutlineKeyboardArrowRight />
                  Blog
                </Link>
              </li>

              <li>
                <Link
                  href="/pricing"
                  className={`flex gap-0.5 font-medium items-center text-lg hover:text-black transition-colors duration-300 ${isActive(
                    "/pricing"
                  )}`}
                >
                  <MdOutlineKeyboardArrowRight />
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex flex-col">
            <h3 className="text-2xl text-black font-semibold mb-4 text-left">
              Connect with us
            </h3>

            <div className="flex flex-row items-center gap-4 text-black">
              <Link
                href={data.facebook_link || "javascript:void(0);"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black cursor-pointer hover:text-[#27BAEE] transition duration-300"
              >
                <FaFacebookF className="text-[22px]" />
              </Link>

              <Link
                href={data.twitter_link || "javascript:void(0);"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black cursor-pointer hover:text-[#27BAEE] transition duration-300"
              >
                <FaXTwitter className="text-[22px]" />
              </Link>

              <Link
                href={data.instagram_link || "javascript:void(0);"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black cursor-pointer hover:text-[#27BAEE] transition duration-300"
              >
                <FaInstagram className="text-[22px]" />
              </Link>

              <Link
                href={data.linkedin_link || "javascript:void(0);"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black cursor-pointer hover:text-[#27BAEE] transition duration-300"
              >
                <FiLinkedin className="text-[22px]" />
              </Link>

              <Link
                href={data.pinterest_link || "javascript:void(0);"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black cursor-pointer hover:text-[#27BAEE] transition duration-300"
              >
                <FaPinterest className="text-[22px]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 text-center">
          <p className="text-lg text-black font-medium">
            <span className="text-gray-500 font-bold">&copy; 2025 </span>
            ATSWAY. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
