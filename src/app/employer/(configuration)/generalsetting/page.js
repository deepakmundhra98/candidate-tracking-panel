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

const Page = () => {
  const token = Cookies.get("tokenEmployer");
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };

  const getData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + `/admin/generalsettings`,
        null, // Pass null as the request body if not required
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setLoading(false);
      setUserData(response.data.response);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get plans data at APmanageplans");
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
              <Link
                underline="hover"
                color="inherit"
                href="/employer/configuration"
              >
                <div className="flex gap-2 items-center justify-center">
                  <i className="fa fa-gears"></i>
                  <span>
                    Configuration{" "}
                    <i class="fa-solid fa-angles-right text-xs"></i>
                  </span>
                </div>
              </Link>
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-lock"></i>
                <span>General Setting</span>
              </div>
            </div>
          </div>
          <div
            className="generalSettings backgroundColor"
            style={{ minHeight: "60vh" }}
          >
            <div className="profilelogo">
              <h2>General Setting</h2>
            </div>
            <div className="generalSetting">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Change Username */}
                <Link href="/employer/changeusername" className="block">
                  <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-6 text-center">
                    <FaUserEdit
                      size={40}
                      className="mx-auto mb-4 text-black transition-colors duration-300 group-hover:text-[#1665d8]"
                    />
                    <h5 className="text-lg font-semibold text-black mb-2">
                      Change Company Username
                    </h5>
                    <p className="text-gray-500 text-sm">
                      Update your username anytime.
                    </p>
                  </div>
                </Link>

                {/* Change Password */}
                <Link href="/employer/changepassword" className="block">
                  <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-6 text-center">
                    <FaKey
                      size={40}
                      className="mx-auto mb-4 text-black transition-colors duration-300 group-hover:text-[#1665d8]"
                    />
                    <h5 className="text-lg font-semibold text-black mb-2">
                      Change Company Password
                    </h5>
                    <p className="text-gray-500 text-sm">
                      Secure your account.
                    </p>
                  </div>
                </Link>

                {/* Change Email */}
                <Link href="/employer/changeemail" className="block">
                  <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-6 text-center">
                    <FaEnvelope
                      size={40}
                      className="mx-auto mb-4 text-black transition-colors duration-300 group-hover:text-[#1665d8]"
                    />
                    <h5 className="text-lg font-semibold text-black mb-2">
                      Change Company Email
                    </h5>
                    <p className="text-gray-500 text-sm">
                      Update your company email address.
                    </p>
                  </div>
                </Link>

                {/* Change Profile Picture */}
                <Link href="/employer/changeprofilepicture" className="block">
                  <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-6 text-center">
                    <FaImage
                      size={40}
                      className="mx-auto mb-4 text-black transition-colors duration-300 group-hover:text-[#1665d8]"
                    />
                    <h5 className="text-lg font-semibold text-black mb-2">
                      Change Profile Picture
                    </h5>
                    <p className="text-gray-500 text-sm">Upload a new photo.</p>
                  </div>
                </Link>
                <Link href="/employer/uploadlogo" className="block">
                  <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-6 text-center">
                    <FaImage
                      size={40}
                      className="mx-auto mb-4 text-black transition-colors duration-300 group-hover:text-[#1665d8]"
                    />
                    <h5 className="text-lg font-semibold text-black mb-2">
                      Change Website Logo
                    </h5>
                    <p className="text-gray-500 text-sm">Upload a new logo.</p>
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
