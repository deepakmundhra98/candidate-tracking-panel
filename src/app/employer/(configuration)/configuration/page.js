"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "../../../common.css";
import Swal from "sweetalert2";
import AdminFooter from "../../../admin/Components/AdminFooter/AdminFooter";
import AdminLayout from "../../EmployerLayout";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import BaseAPI from "../../../BaseAPI/BaseAPI";
import { useEffect } from "react";
import "../../employer.css";
import { FaUserEdit, FaKey, FaEnvelope, FaImage } from "react-icons/fa";
import { FaCog, FaGlobe, FaClipboardList, FaTasks, FaUserPlus } from "react-icons/fa";


const Page = () => {
  const token = Cookies.get("tokenEmployer");
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };



  return (
    <>
      <AdminLayout>
        {loading && <div className="loader-container"></div>}
        <div className="adminChangeUsername" style={{ minHeight: "80vh" }}>
          <div className="breadCumb1" role="">
            <div className="flex gap-3 items-center">
              <Link
                underline="hover"
                color="inherit"
                href="/employer/dashboard"
              >
                <div className="flex gap-2 items-center">
                  <i className="fa-solid fa-gauge "></i>
                  <span>
                    Dashboard <i class="fa-solid fa-angles-right text-xs"></i>
                  </span>
                </div>
              </Link>
              <div className="flex gap-2 items-center justify-center">
                <i className="fa fa-gears"></i>
                <span>Configuration </span>
              </div>
              
            </div>
          </div>
          <div
            className="generalSettings backgroundColor"
            style={{ minHeight: "60vh" }}
          >
            <div className="profilelogo">
              <h2>Configuration</h2>
            </div>
            <div className="generalSetting">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* General Setting */}
  <Link href="/employer/generalsetting" className="block">
    <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-6 text-center">
      <FaCog size={40} className="mx-auto mb-4 text-black transition-colors duration-300 group-hover:text-[#1665d8]" />
      <h5 className="text-lg font-semibold text-black mb-2">General Setting</h5>
      <p className="text-gray-500 text-sm">Update your general setting.</p>
    </div>
  </Link>

  {/* Website Setting */}
  <Link href="/employer/changepassword" className="block">
    <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-6 text-center">
      <FaGlobe size={40} className="mx-auto mb-4 text-black transition-colors duration-300 group-hover:text-[#1665d8]" />
      <h5 className="text-lg font-semibold text-black mb-2">Website Setting</h5>
      <p className="text-gray-500 text-sm">Update your website setting.</p>
    </div>
  </Link>

  {/* Interview Process */}
  <Link href="/employer/processmanagement" className="block">
    <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-6 text-center">
      <FaClipboardList size={40} className="mx-auto mb-4 text-black transition-colors duration-300 group-hover:text-[#1665d8]" />
      <h5 className="text-lg font-semibold text-black mb-2">Interview Process</h5>
      <p className="text-gray-500 text-sm">Check all the interview processes.</p>
    </div>
  </Link>

  {/* Status Management */}
  <Link href="/employer/statusmanagement" className="block">
    <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-6 text-center">
      <FaTasks size={40} className="mx-auto mb-4 text-black transition-colors duration-300 group-hover:text-[#1665d8]" />
      <h5 className="text-lg font-semibold text-black mb-2">Status Management</h5>
      <p className="text-gray-500 text-sm">Manage all the status.</p>
    </div>
  </Link>

  {/* Assign User to Interview */}
  <Link href="/employer/assignusertointerview" className="block">
    <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-6 text-center">
      <FaUserPlus size={40} className="mx-auto mb-4 text-black transition-colors duration-300 group-hover:text-[#1665d8]" />
      <h5 className="text-lg font-semibold text-black mb-2">Assign User to the Interview</h5>
      <p className="text-gray-500 text-sm">Manage all the interview assignments.</p>
    </div>
  </Link>
</div>

            </div>
          </div>
        </div>
        <AdminFooter />
      </AdminLayout>
    </>
  );
};

export default Page;
