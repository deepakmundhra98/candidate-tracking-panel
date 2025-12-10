"use client";
import React from "react";
import Link from "next/link";
import { useState } from "react";
import "../../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import AdminFooter from "../../Components/AdminFooter/AdminFooter";
import axios from "axios";
import BaseAPI from "../../../BaseAPI/BaseAPI";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import Swal from "sweetalert2";
import AdminLayout from "../../AdminLayout";

const Page = () => {
  // const navigate = useNavigate();
  const router = useRouter();
  const token = Cookies.get("token");
  const [profileImage, setProfileImage] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email_address: "",
    password: "",
    confirm_password: "",
    company_name: "",
    profile_image: "",
    company_logo: "",
  });

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email_address: "",
    password: "",
    confirm_password: "",
    company_name: "",
    profile_image: "",
    company_logo: "",
  });

  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const handleClick = async () => {
    try {
      const newErrors = {};

      // Field Validations
      if (!userData.first_name.trim()) {
        newErrors.first_name = "First name is required";
      }
      if (!userData.last_name.trim()) {
        newErrors.last_name = "Last name is required";
      }
      if (!userData.username.trim()) {
        newErrors.username = "Username is required";
      }
      if (
        !userData.email_address.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email_address)
      ) {
        newErrors.email_address = "Valid email address is required";
      }
      if (!userData.password.trim()) {
        newErrors.password = "Password is required";
      }
      if (!userData.confirm_password.trim()) {
        newErrors.confirm_password = "Confirm Password is required";
      }
      if (userData.password) {
        if (userData.password.length < 8) {
          newErrors.password = "Password must be at least 8 characters long";
        }
      }
      if (userData.confirm_password) {
        if (userData.confirm_password.length < 8) {
          newErrors.confirm_password =
            "Confirm Password must be at least 8 characters long";
        }
      }
      if (
        userData.password.trim() !== "" &&
        userData.confirm_password.trim() !== ""
      ) {
        if (userData.password !== userData.confirm_password) {
          newErrors.confirm_password = "Passwords do not match";
        }
      }

      if (userData.company_name.trim() === "") {
        newErrors.company_name = "Company name is required";
      }
      // if (!userData.profile_image) {
      //   newErrors.profile_image = "Profile image is required";
      // }
      // if (!userData.company_logo) {
      //   newErrors.company_logo = "Company logo is required";
      // }

      setErrors(newErrors);
      console.log(newErrors,"error");

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Add?",
          text: "Do you want to add this Employer?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (confirmationResult.isConfirmed) {
          setLoading(true);

          // Create FormData
          const formData = new FormData();
          formData.append("first_name", userData.first_name);
          formData.append("last_name", userData.last_name);
          formData.append("username", userData.username);
          formData.append("email_address", userData.email_address);
          formData.append("password", userData.password);
          formData.append("confirm_password", userData.confirm_password);
          formData.append("company_name", userData.company_name);
          formData.append("profile_image", profileImage);
          formData.append("company_logo", companyLogo);

          try {
            const response = await axios.post(
              `${BaseAPI}/admin/employer/add`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setLoading(false);

            if (response.data.status === 200) {
              Swal.fire({
                title: "Employer added successfully!",
                icon: "success",
                confirmButtonText: "Close",
              });
              setUserData({
                first_name: "",
                last_name: "",
                username: "",
                email_address: "",
                password: "",
                confirm_password: "",
                company_name: "",
                profile_image: "",
                company_logo: "",
              });
              window.scrollTo(0, 0);
              router.push("/admin/manageemployer");
            } else {
              Swal.fire({
                title: response.data.message,
                icon: "error",
                confirmButtonText: "Close",
              });
            }
          } catch (error) {
            setLoading(false);
            Swal.fire({
              title: "Failed",
              text: "Could not add the Employer",
              icon: "error",
              confirmButtonText: "Close",
            });
          }
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message)
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const maxFileSize = 2 * 1024 * 1024; // 2 MB in bytes
    const file = files[0];

    if (file) {
      // Check file size
      if (file.size > maxFileSize) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "File size must be less than 2 MB.",
        }));
        return;
      }

      // Validate image dimensions
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const { width, height } = img;

        // Example dimensions validation (adjust as needed)
        if (width < 10 || height < 10 || width > 2000 || height > 2000) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]:
              "Image dimensions must be between 10x10 and 2000x2000 pixels.",
          }));
          return;
        }

        // If all validations pass, update state
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "", // Clear error if any
        }));

        if (name === "profile_image") {
          setProfileImage(file);
        } else if (name === "company_logo") {
          setCompanyLogo(file);
        }
      };

      img.onerror = () => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Invalid image file.",
        }));
      };
    }
  };

  return (
    <>
      <AdminLayout>
        {loading && <div className="loader-container"></div>}

        <div
          className="addInterviewProcessAdd adminChangeUsername"
          style={{ minHeight: "80vh" }}
        >
          <div className="addInterviewProcess">
            <div className="breadCumb1" role="">
              <div className="flex gap-3 items-center">
                <Link underline="hover" color="inherit" href="/admin/dashboard">
                  <div className="flex gap-2 items-center">
                    <i className="fa-solid fa-gauge "></i>
                    <span>
                      Dashboard <i class="fa-solid fa-angles-right text-xs"></i>
                    </span>
                  </div>
                </Link>
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-graduation-cap"></i>
                  <span>
                    <Link href="/admin/manageemployer"> Employer List </Link>
                  </span>
                  <i class="fa-solid fa-angles-right text-xs"></i>
                </div>
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-plus"></i>
                  <span>Add Employer </span>
                </div>
              </div>
            </div>
          </div>
          <div className="addInterviewProcessForm addEmployerForm">
            <div className="row">
              <div className="col-md-3 leftSide">Employer First Name :</div>
              <div className="col-md-9 rightSide">
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder="Employer First Name"
                  value={userData.first_name}
                  name="first_name"
                  onChange={handleChange}
                />
                {errors.first_name && (
                  <div className="text-danger">{errors.first_name}</div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 leftSide">Employer Last Name :</div>
              <div className="col-md-9 rightSide">
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder="Employer Last Name"
                  value={userData.last_name}
                  name="last_name"
                  onChange={handleChange}
                />
                {errors.last_name && (
                  <div className="text-danger">{errors.last_name}</div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 leftSide">Employer Username :</div>
              <div className="col-md-9 rightSide">
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder="Employer username Name"
                  value={userData.username}
                  name="username"
                  onChange={handleChange}
                />
                {errors.username && (
                  <div className="text-danger">{errors.username}</div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 leftSide">Employer Email Address :</div>
              <div className="col-md-9 rightSide">
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder="Employer Email Address"
                  value={userData.email_address}
                  name="email_address"
                  onChange={handleChange}
                />
                {errors.email_address && (
                  <div className="text-danger">{errors.email_address}</div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 leftSide">Employer Password :</div>
              <div className="col-md-9 rightSide">
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder="Employer Password"
                  value={userData.password}
                  name="password"
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="text-danger">{errors.password}</div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 leftSide">Confirm Password :</div>
              <div className="col-md-9 rightSide">
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder="Confirm Password"
                  value={userData.confirm_password}
                  name="confirm_password"
                  onChange={handleChange}
                />
                {errors.confirm_password && (
                  <div className="text-danger">{errors.confirm_password}</div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 leftSide">Company Name :</div>
              <div className="col-md-9 rightSide">
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder="Company Name"
                  value={userData.company_name}
                  name="company_name"
                  onChange={handleChange}
                />
                {errors.company_name && (
                  <div className="text-danger">{errors.company_name}</div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 leftSide">Profile Image :</div>
              <div className="col-md-9 rightSide">
                <input
                  type="file"
                  className="form-control"
                  id="formGroupExampleInput3"
                  placeholder="Upload Profile Image"
                  name="profile_image"
                  onChange={handleFileChange}
                />
                {errors.profile_image && (
                  <div className="text-danger">{errors.profile_image}</div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 leftSide">Company Logo :</div>
              <div className="col-md-9 rightSide">
                <input
                  type="file"
                  className="form-control"
                  id="formGroupExampleInput4"
                  placeholder="Upload Company Logo"
                  name="company_logo"
                  onChange={handleFileChange}
                />
                {errors.company_logo && (
                  <div className="text-danger">{errors.company_logo}</div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 leftSide"></div>
              <div className="col-md-9 rightSide">
                <div className="bottomButtons">
                  <button className="btn button1" onClick={handleClick}>
                    Save
                  </button>
                  <Link href="/admin/manageemployer" className="btn button2">
                    Cancel
                  </Link>
                </div>
              </div>
            </div>

            {/* </div> */}
          </div>
        </div>
        <AdminFooter />
      </AdminLayout>
    </>
  );
};

export default Page;
