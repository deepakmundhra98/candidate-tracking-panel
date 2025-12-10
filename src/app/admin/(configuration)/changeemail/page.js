"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import "../../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import axios from "axios";
import BaseAPI from "../../../BaseAPI/BaseAPI";
import AdminFooter from "../../Components/AdminFooter/AdminFooter";
import Cookies from "js-cookie";
import AdminLayout from "../../AdminLayout";

const Page = () => {
  // const navigate = useNavigate();

  const [userData, setUserData] = useState({
    old_email: "",
    new_email: "",
    confirm_email: "",
  });

  const [errors, setErrors] = useState({
    old_email: "",
    new_email: "",
    confirm_email: "",
  });
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");

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

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(BaseAPI + "/admin/changeemail", null, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + " " + token,
          // adminid: adminID,
        },
      });
      setLoading(false);
      setUserData(response.data.response);
    } catch (error) {
      console.log("Error at chnage username at Admin panel");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleClick = async () => {
    try {
      const { new_email, confirm_email } = userData;

      // Check if email fields are empty
      if (!new_email || !confirm_email) {
        setErrors({
          new_email: new_email ? "" : "New Email is required",
          confirm_email: confirm_email ? "" : "Confirm Email is required",
        });
        return;
      }

      // Check if new email and confirm email match
      if (new_email !== confirm_email) {
        setErrors({
          confirm_email: "New Email and Confirm Email do not match",
        });
        return;
      }

      // Check for valid email format
      const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailFormat.test(new_email) || !emailFormat.test(confirm_email)) {
        setErrors({
          new_email: "Invalid Email Address",
          confirm_email: "Invalid Email Address",
        });
        return;
      }
      const confirmationResult = await Swal.fire({
        title: "Update?",
        text: "Do you want to update the email address?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + "/admin/changeemail",
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
            title: "Email updated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          setUserData({
            ...userData,
            old_email: "",
            new_email: "",
            confirm_email: "",
          });
          getData();
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
    } catch (error) {
      //   setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not update email. Please try again later!",
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
                <i class="fa-solid fa-envelope"></i>
                <span>Change Email</span>
              </div>
            </div>
          </div>
          <div className="pageDetails">
            <div className="profilelogo">
              <h2>Change Email</h2>
            </div>
            <div className="profilelogochange">
              <div className="mb-3">
                <label htmlFor="formGroupExampleInput" className="form-label">
                  Current Email
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput"
                  placeholder="Current Email"
                  value={userData.old_email}
                  name="old_email"
                  disabled
                  // onChange={handleChange}
                />
                {/* {errors.currentEmail && (
                  <div className="text-danger">{errors.currentEmail}</div>
                )} */}
              </div>
              <div className="mb-3">
                <label htmlFor="formGroupExampleInput2" className="form-label">
                  New Email
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder="New Email"
                  value={userData.new_email}
                  name="new_email"
                  onChange={handleChange}
                />
                {errors.new_email && (
                  <div className="text-danger">{errors.new_email}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="formGroupExampleInput2" className="form-label">
                  Confirm Email
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder="Confirm Password"
                  value={userData.confirm_email}
                  name="confirm_email"
                  onChange={handleChange}
                />
                {errors.confirm_email && (
                  <div className="text-danger">{errors.confirm_email}</div>
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
        <AdminFooter />
      </AdminLayout>
    </>
  );
};

export default Page;
