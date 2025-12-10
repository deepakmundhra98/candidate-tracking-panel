"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
// import "../../../newcommon.css";
import "../../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import AdminFooter from "../../Components/AdminFooter/AdminFooter";
import AdminLayout from "../../AdminLayout";
import Cookies from "js-cookie";
import BaseAPI from '@/app/BaseAPI/BaseAPI'
import axios from "axios";


const Page = () => {
  // const navigate = useNavigate();
  const userId = Cookies.get("adminId");
  const [userData, setUserData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
    userId: userId
  });
  const [loading, setLoading] = useState(false);


  const token = Cookies.get("token");


  const [errors, setErrors] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

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

      if (userData.old_password === "") {
        newErrors.old_password = "Old password is required";
      }
      if (userData.new_password === "") {
        newErrors.new_password = "New password is required";
      } else if (userData.new_password.length < 8) {
        newErrors.new_password = "Please enter atleast 8 characters";
      }
      if (userData.confirm_password === "") {
        newErrors.confirm_password = "Confirm password is required";
      } else if (userData.confirm_password.length < 8) {
        newErrors.confirm_password = "Please enter atleast 8 characters";
      } else if (userData.new_password !== userData.confirm_password) {
        newErrors.confirm_password =
          "Password and confirm password do not match";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Update?",
          text: "Do you want to update the password?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseAPI + "/admin/changepassword",
            userData,
            {
              headers: {
                "Content-Type": "application/json",
                // key: ApiKey,
                Authorization: "Bearer" + " " + token,
                // adminid: adminID,
              },
            }
          );
          setLoading(false);
          if (response.data.status === 200) {
            Swal.fire({
              title: "Password updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            setUserData({
              ...userData,
              old_password: "",
              new_password: "",
              confirm_password: "",
            });
            window.scrollTo(0, 0);
          } else if (response.data.status === 500) {
            Swal.fire({
              title: response.data.message,
              icon: "error",
              confirmButtonText: "Close",
            });
          } else {
            Swal.fire({
              title: response.data.message,
              icon: "error",
              confirmButtonText: "Close",
            });
          }
        }
      }
    } catch (error) {
      //   setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not update password. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };
  return (
    <>
      <AdminLayout>
        {loading && <div className="loader-container"></div>}
        <div className="adminChangeUsername" style={{ minHeight: '80vh' }}>
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
                <i class="fa-solid fa-lock"></i>
                <span>Change Password</span>
              </div>
            </div>
          </div>
          <div className="changeProfilePicture backgroundColor">
            <div className="">
              <div className="profilelogo">
                <h2>Change Password </h2>
              </div>
              <div className="profilelogochange">
                <div className="mb-3">
                  <label htmlFor="formGroupExampleInput" className="">
                    Current Password
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="formGroupExampleInput"
                    placeholder="Current Password"
                    value={userData.old_password}
                    name="old_password"
                    onChange={handleChange}
                  />
                  {errors.old_password && (
                    <div className="text-danger">{errors.old_password}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="formGroupExampleInput2"
                    className="form-label"
                  >
                    New Password
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="formGroupExampleInput2"
                    placeholder="New Password"
                    value={userData.new_password}
                    name="new_password"
                    onChange={handleChange}
                  />
                  {errors.new_password && (
                    <div className="text-danger">{errors.new_password}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="formGroupExampleInput2"
                    className="form-label"
                  >
                    Confirm Password
                  </label>
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
                <div className="bottomButtons">
                  <button className="btn button1" onClick={handleClick}>
                    Save
                  </button>
                  <Link href="/admin/dashboard" className="btn button2">
                    Cancel
                  </Link>
                </div>
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
