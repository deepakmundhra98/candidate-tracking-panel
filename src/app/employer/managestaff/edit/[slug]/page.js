"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import axios from "axios";
import BaseAPI from "../../../../BaseAPI/BaseAPI";
import "../../../../common.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";
import EmployerLayout from "../../../EmployerLayout";

import "@fortawesome/fontawesome-free/css/all.css";
// import AdminFooter from "../../../../Components/AdminFooter/AdminFooter";
import AdminFooter from "../../../../admin/Components/AdminFooter/AdminFooter";

const Page = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("tokenEmployer");
  const router = useRouter();

  const slug = params.slug;
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email_address: "",
    password: "",
    confirm_password: "",
    allowed_to_post_job: "",
    allowed_to_schedule_interview: "",
  });
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email_address: "",
    password: "",
    confirm_password: "",
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

  const getData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + `/admin/staff/edit/${slug}`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setLoading(false);
      if(response.data.status === 200){
        setUserData(response.data.response);

      } else{
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  useEffect(() => {
    getData();
    window.scrollTo(0, 0);
  }, []);

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
        newErrors.email_address = "Email address is required";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email_address)) {
          newErrors.email_address = "Invalid email address";
        }
      }
      // if (userData.password === "") {
      //   newErrors.password = "password is required";
      // } else if (userData.password.length < 8) {
      //   newErrors.password = "Please enter atleast 8 characters";
      // }
      // if (userData.confirm_password === "") {
      //   newErrors.confirm_password = "confirm password is required";
      // } else if (userData.confirm_password.length < 8) {
      //   newErrors.confirm_password = "Please enter atleast 8 characters";
      // } else if (userData.password !== userData.confirm_password) {
      //   newErrors.confirm_password =
      //     "Password and confirm password do not match";
      // }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Update?",
          text: "Do you want to update Staff details?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseAPI + `/staff/edit/${slug}`,
            userData,
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
              title: "Staff details updated successfully!",
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
        text: "Could not update staff details",
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
              <Link underline="hover" color="inherit" href="/employer/dashboard">
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
                  </span>
                </Link>{" "}
              </div>
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-edit"></i>
                <span> Edit Staff</span>
              </div>
            </div>
          </div>
          <div className="">
            {/* <div className="userProcesss">
              <h4>Edit Staff</h4>
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
                      name="first_name"
                      value={userData.first_name}
                      onChange={handleChange}
                    />
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
                      name="last_name"
                      value={userData.last_name}
                      onChange={handleChange}
                    />
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
                      name="username"
                      value={userData.username}
                      onChange={handleChange}
                    />
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
                      name="email_address"
                      value={userData.email_address}
                      onChange={handleChange}
                      disabled
                    />
                    {errors.email_address && (
                      <div className="text-danger">{errors.email_address}</div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                    Password
                  </div>
                  <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={userData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                    Confirm Password
                  </div>
                  <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                    <input
                      type="password"
                      className="form-control"
                      name="confirm_password"
                      value={userData.confirm_password}
                      onChange={handleChange}
                    />
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
              <div className="row">
                {/* <div className="col-lg-2 col-md-2 col-sm-2 Name--txt"></div> */}
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
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
            </div>
          </div>
        </div>
        <AdminFooter />
      </EmployerLayout>
    </>
  );
};

export default Page;
