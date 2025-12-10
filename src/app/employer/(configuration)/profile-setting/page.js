"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import "../../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { Dropdown } from "react-bootstrap";
import axios from "axios";
import BaseAPI from "../../../BaseAPI/BaseAPI";
import NextImage from "next/image";
import AdminFooter from "../../../admin/Components/AdminFooter/AdminFooter";
import Cookies from "js-cookie";
import EmployerLayout from "../../EmployerLayout";

const Page = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
    profile_picture: "",
    website_logo: "",
    user_type: "employer",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    email: "",
    profile_picture: "",
    website_logo: "",
  });

  const [loading, setLoading] = useState(true);
  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const [originalData, setOriginalData] = useState({});

  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };

  const token = Cookies.get("tokenEmployer");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];

      // ✅ Validate file size (must be under 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [name]: "File size must be under 2MB",
        }));
        return;
      }

      const img = new Image();
      img.onload = () => {
        // ✅ Validation for profile_picture
        if (name === "profile_picture") {
          if (img.width !== 100 || img.height !== 100) {
            setErrors((prev) => ({
              ...prev,
              [name]: "Image must be exactly 100x100 pixels",
            }));
            return;
          }
        }

        // ✅ Validation for website_logo
        if (name === "website_logo") {
          if (img.width > 300 || img.height > 120) {
            setErrors((prev) => ({
              ...prev,
              [name]: "Logo dimensions must be under 300x120 pixels",
            }));
            return;
          }
        }

        // ✅ Convert file to Base64 after all validations pass
        const reader = new FileReader();
        reader.onloadend = () => {
          setUserData((prev) => ({
            ...prev,
            [name]: reader.result, // Base64 string
          }));

          setErrors((prev) => ({
            ...prev,
            [name]: "",
          }));
        };
        reader.readAsDataURL(file);
      };

      img.onerror = () => {
        setErrors((prev) => ({
          ...prev,
          [name]: "Invalid image file",
        }));
      };

      img.src = URL.createObjectURL(file);
      return;
    }

    // ✅ For normal text inputs
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + "/admin/profile-setting",
        { user_type: "employer" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      setLoading(false);
      setUserData(response.data.response);

      const event = new CustomEvent("profileDataLoaded", {
        detail: {
          profile_picture: response.data.response.profile_picture,
          website_logo: response.data.response.website_logo,
        },
      });
      window.dispatchEvent(event, "profilePictureDataLoaded");

      setOriginalData(response.data.response); // Store original data
    } catch (error) {
      console.log("Error at change username at Admin panel");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleClick = async () => {
    try {
      const { username, password, email, profile_picture, website_logo } =
        userData;
      let valid = true;
      const newErrors = {
        username: "",
        password: "",
        email: "",
        profile_picture: "",
        website_logo: "",
      };

      if (username === "") {
        newErrors.username = "Username is required";
        valid = false;
      }

      if (password) {
        if (password.length < 8) {
          newErrors.password = "Please enter at least 8 characters";
          valid = false;
        } else if (password.length > 20) {
          newErrors.password = "Please enter maximum 20 characters";
          valid = false;
        } else if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
            password
          )
        ) {
          newErrors.password =
            "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character";
          valid = false;
        }
      }

      if (email === "") {
        newErrors.email = "Email is required";
        valid = false;
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
        newErrors.email = "Invalid email address";
        valid = false;
      }
      if (profile_picture === "") {
        newErrors.profile_picture = "Profile picture is required";
        valid = false;
      }
      if (website_logo === "") {
        newErrors.website_logo = "Website logo is required";
        valid = false;
      }

      setErrors(newErrors);
      if (!valid) return;

      const confirmationResult = await Swal.fire({
        title: "Update?",
        text: "Do you want to update profile settings?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (confirmationResult.isConfirmed) {
        setLoading(true);

        // ✅ Only send changed keys
        const changedFields = {};
        for (const key in userData) {
          if (userData[key] !== originalData[key]) {
            changedFields[key] = userData[key];
          }
        }

        // Always include user_type
        changedFields.user_type = "employer";

        const response = await axios.post(
          BaseAPI + "/admin/profile-setting",
          changedFields,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        setLoading(false);

        if (response.data.status === 200) {
          Swal.fire({
            title: "Profile Settings updated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          getData();
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not update profile settings. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  return (
    <>
      <EmployerLayout>
        {loading && <div className="loader-container"></div>}

        <div className="adminChangeUsername py-6" style={{ minHeight: "80vh" }}>
          {/* Breadcrumb */}
          <div className="breadCumb1 mb-6" role="">
            <div className="flex gap-3 items-center text-sm text-gray-600">
              <Link
                href="/employer/dashboard"
                className="flex gap-2 items-center"
              >
                <i className="fa-solid fa-gauge"></i>
                <span>
                  Dashboard <i className="fa-solid fa-angles-right text-xs"></i>
                </span>
              </Link>
              <Link
                href="/employer/configuration"
                className="flex gap-2 items-center"
              >
                <i className="fa fa-gears"></i>
                <span>
                  Configuration{" "}
                  <i className="fa-solid fa-angles-right text-xs"></i>
                </span>
              </Link>
              <Link
                href="/employer/generalsetting"
                className="flex gap-2 items-center"
              >
                <i className="fa-solid fa-user text-xs"></i>
                <span>Profile Setting</span>
              </Link>
            </div>
          </div>

          {/* Page Content */}
          <div className="pageDetails max-w-8xl">
            <div className="bg-white rounded p-6 shadow-md">
              {/* Username */}
              <div className="mb-4">
                <label className="form-label font-semibold">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Current Username"
                  value={userData.username}
                  name="username"
                  onChange={handleChange}
                />
                {errors.username && (
                  <div className="text-red-500">{errors.username}</div>
                )}
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="form-label font-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={userData.password}
                  name="password"
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="text-red-500">{errors.password}</div>
                )}
              </div>

              {/* Email */}
              <div className="mb-6">
                <label className="form-label font-semibold">
                  Email Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  value={userData.email}
                  name="email"
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="text-red-500">{errors.email}</div>
                )}
              </div>

              {/* Profile Picture & Website Logo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                {/* Profile Picture */}
                <div className="border rounded-xl p-4 shadow-sm flex flex-col items-center bg-gray-50">
                  <h3 className="text-lg font-semibold mb-3">
                    Profile Picture
                  </h3>
                  <div className="w-40 h-40 border-2 border-dashed rounded-full flex items-center justify-center overflow-hidden bg-white">
                    {userData.profile_picture !== "" ? (
                      <NextImage
                        width={100}
                        height={100}
                        src={userData.profile_picture}
                        alt="Profile"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <NextImage
                        width={100}
                        height={100}
                        src="/Images/adminSide/dummy-profile.png"
                        alt="Website Logo"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <label
                    htmlFor="profile_picture"
                    className="mt-4 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Upload Image
                  </label>
                  <input
                    type="file"
                    id="profile_picture"
                    accept="image/*"
                    name="profile_picture"
                    className="hidden"
                    onChange={handleChange}
                  />
                  {errors.profile_picture && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.profile_picture}
                    </p>
                  )}
                </div>

                {/* Website Logo */}
                <div className="border rounded-xl p-4 shadow-sm flex flex-col items-center bg-gray-50">
                  <h3 className="text-lg font-semibold mb-3">Website Logo</h3>
                  <div className="w-40 h-40 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden bg-white">
                    {userData.website_logo !== "" ? (
                      <NextImage
                        width={100}
                        height={100}
                        src={userData.website_logo}
                        alt="Website Logo"
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <NextImage
                        width={100}
                        height={100}
                        src="/Images/adminSide/dummy-profile.png"
                        alt="Website Logo"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <label
                    htmlFor="website_logo"
                    className="mt-4 cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Upload Logo
                  </label>
                  <input
                    type="file"
                    id="website_logo"
                    accept="image/*"
                    name="website_logo"
                    className="hidden"
                    onChange={handleChange}
                  />
                  {errors.website_logo && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.website_logo}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="bottomButtons mt-6">
                <button className="btn button1" onClick={handleClick}>
                  Save
                </button>
                <Link href="/employer/dashboard" className="btn button2">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>

        <AdminFooter />
      </EmployerLayout>
    </>
  );
};

export default Page;
