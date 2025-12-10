"use client";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import "../../../common.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useState } from "react";
import AdminFooter from "../../../admin/Components/AdminFooter/AdminFooter";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import EmployerLayout from "../../EmployerLayout";

const Page = () => {
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email_address: "",
    password: "",
    c_password: "",
    roles: "",
    permission: "",
    allowed_to_post_job: "",
    allowed_to_schedule_interview: "",
  });
  const tokenEmployer = Cookies.get("tokenEmployer");

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email_address: "",
    password: "",
    c_password: "",
    role: "",
    permission: "",
  });

  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value, // Handle checkbox correctly
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleClick = async () => {
    try {
      const newErrors = {};

      if (userData.first_name === "") {
        newErrors.first_name = "First name is required";
      }
      if (userData.last_name === "") {
        newErrors.last_name = "Last name is required";
      }
      if (userData.username === "") {
        newErrors.username = "Username is required";
      }
      if (userData.email_address === "") {
        newErrors.email_address = "Email is required";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email_address)) {
          newErrors.email_address = "Invalid email address";
        }
      }
      if (userData.password === "") {
        newErrors.password = "Password is required";
      } else if (userData.password.length < 8) {
        newErrors.password = "Please enter atleast 8 characters";
      }
      if (userData.c_password === "") {
        newErrors.c_password = "Confirm password is required";
      } else if (userData.c_password.length < 8) {
        newErrors.c_password = "Please enter atleast 8 characters";
      } else if (userData.password !== userData.c_password) {
        newErrors.c_password = "Password and confirm password do not match";
      }
      // if (userData.roles == "" && userData.roles !== "admin") {
      //   newErrors.roles = "role is required";
      // }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Add?",
          text: "Do you want to add Staff?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          // console.log("userData:", userData);
          const response = await axios.post(
            BaseAPI + "/admin/user/staff/add",
            userData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + tokenEmployer,
              },
            }
          );

          // console.log("API Response:", response);
          setLoading(false);

          if (response.data.status === 200) {
            setUserData({
              ...userData,
              first_name: "",
              last_name: "",
              username: "",
              email_address: "",
              password: "",
              confirm_password: "",
              role: "",
              permission: "",
            });
            Swal.fire({
              title: "Staff added successfully!",
              icon: "success",
              confirmButtonText: "Close",
            }).then(() => {
              router.push("/employer/managestaff");
            });
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
      setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not add Staff ",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  return (
    <>
      <EmployerLayout>
        {loading && <div className="loader-container"></div>}
        <div
          className=" backgroundColor adminChangeUsername editStaff"
          style={{ minHeight: "80vh" }}
        >
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
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-users"></i>
                <Link href="/employer/managestaff">
                  <span>
                    {" "}
                    Manage Staff{" "}
                    <i class="fa-solid fa-angles-right text-xs"></i>
                  </span>{" "}
                </Link>{" "}
              </div>
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-plus"></i>
                <span> Add Staff</span>
              </div>
            </div>
          </div>

          {/* <div className="userProcesss">
            <h4>Add Staff</h4>
          </div> */}
          <div className="profilelogochange">
            {/* <div className="processHeading">
              <h5>Staff Details:</h5>
            </div> */}
            <form action="" method="post">
              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  First Name <span>*</span>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <input
                    type="text"
                    className="form-control"
                    value={userData.first_name}
                    name="first_name"
                    onChange={handleChange}
                  ></input>
                  {errors.first_name && (
                    <div className="text-danger">{errors.first_name}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  Last Name <span>*</span>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <input
                    type="text"
                    className="form-control"
                    value={userData.last_name}
                    name="last_name"
                    onChange={handleChange}
                  ></input>
                  {errors.last_name && (
                    <div className="text-danger">{errors.last_name}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  Username <span>*</span>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <input
                    type="text"
                    className="form-control"
                    value={userData.username}
                    name="username"
                    onChange={handleChange}
                  ></input>
                  {errors.username && (
                    <div className="text-danger">{errors.username}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  Email Address<span>*</span>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <input
                    type="email"
                    className="form-control"
                    value={userData.email_address}
                    name="email_address"
                    onChange={handleChange}
                  ></input>
                  {errors.email_address && (
                    <div className="text-danger">{errors.email_address}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  Password<span>*</span>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <input
                    type="password"
                    className="form-control"
                    value={userData.password}
                    name="password"
                    onChange={handleChange}
                  ></input>
                  {errors.password && (
                    <div className="text-danger">{errors.password}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  Confirm Password<span>*</span>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <input
                    type="password"
                    className="form-control"
                    value={userData.c_password}
                    name="c_password"
                    onChange={handleChange}
                  ></input>
                  {errors.c_password && (
                    <div className="text-danger">{errors.c_password}</div>
                  )}
                </div>
              </div>
              
              {/* <div className="row bg-blue">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  Permissions
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <div className="check--1">
                    <input
                      type="checkbox"
                      name="allowed_to_schedule_interview"
                      value={userData.allowed_to_schedule_interview}
                      checked={userData.allowed_to_schedule_interview === 1}
                      onChange={handleChange}
                    ></input>
                    Allowed to schedule interview?
                  </div>

                  <div className="check--1">
                    <input
                      type="checkbox"
                      name="allowed_to_post_job"
                      value={userData.allowed_to_post_job}
                      checked={userData.allowed_to_post_job === 1}
                      onChange={handleChange}
                    ></input>
                    Allowed to post jobs?
                  </div>
                </div>
              </div> */}
            </form>
            <div className="buttonBottom">
              <button className="btn button1" onClick={handleClick}>
                Save
              </button>
              <Link href="/employer/managestaff" className="btn button2">
                Cancel
              </Link>
            </div>
          </div>
        </div>
        <AdminFooter />
      </EmployerLayout>
    </>
  );
};

export default Page;
