"use client";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import "../../../common.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useState } from "react";
import AdminFooter from "../../Components/AdminFooter/AdminFooter";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import AdminLayout from "../../AdminLayout";

const Page = () => {
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const token = Cookies.get("token");

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [sidebarDisplay, setSidebarDisplay] = useState(false);
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

      if (userData.first_name === "") {
        newErrors.first_name = "first name is required";
      }
      if (userData.last_name === "") {
        newErrors.last_name = "last name is required";
      }
      if (userData.username === "") {
        newErrors.username = "username is required";
      }
      if (userData.email === "") {
        newErrors.email = "email is required";
      }
      if (userData.password === "") {
        newErrors.password = "password is required";
      } else if (userData.password.length < 8) {
        newErrors.password = "Please enter atleast 8 characters";
      }
      if (userData.confirm_password === "") {
        newErrors.confirm_password = "confirm password is required";
      } else if (userData.confirm_password.length < 8) {
        newErrors.confirm_password = "Please enter atleast 8 characters";
      } else if (userData.password !== userData.confirm_password) {
        newErrors.confirm_password =
          "Password and confirm password do not match";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Add?",
          text: "Do you want to add Sub Admin?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseAPI + "/admin/subadmin/add",
            userData,
            {
              headers: {
                "Content-Type": "application/json",
                // key: ApiKey,
                // token: tokenKey,
                // adminid: adminID,
                Authorization: "Bearer " + token,
              },
            }
          );
          setLoading(false);
          if (response.data.status === 200) {
            Swal.fire({
              title: "Sub Admin  updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            setUserData({
              ...userData,
              first_name: "",
              last_name: "",
              username: "",
              email: "",
              password: "",
              confirm_password: "",
            });
            window.scrollTo(0, 0);
            router.push("/admin/managesubadmin");
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
        text: "Could not add qualification name",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };
  return (
    <>
      <AdminLayout>
      {loading && (
        <div className="loader-container">
          
        </div>
      )}
        <div className=" backgroundColor adminChangeUsername" style={{ minHeight: '80vh' }}>
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
                <i class="fa-solid fa-users"></i>
                <span>
                  <Link href="/admin/managesubadmin"> Manage Sub Admin </Link>{" "}
                  <i class="fa-solid fa-angles-right text-xs"></i>
                </span>
              </div>
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-plus"></i>
                <span> Add Sub Admin</span>
              </div>
            </div>
          </div>

          <div className="userProcesss">
            <h4>Add Sub Admin</h4>
          </div>
          <div className="profilelogochange">
            <div className="processHeading">
              <h5>Sub Admin Details:</h5>
            </div>
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
                    value={userData.email}
                    name="email"
                    onChange={handleChange}
                  ></input>
                  {errors.email && (
                    <div className="text-danger">{errors.email}</div>
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
                  Confirm Password
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <input
                    type="password"
                    className="form-control"
                    value={userData.confirm_password}
                    name="confirm_password"
                    onChange={handleChange}
                  ></input>
                  {errors.confirm_password && (
                    <div className="text-danger">{errors.confirm_password}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  Role <span>*</span>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <input type="text" className="form-control"></input>
                </div>
              </div>
              <div className="row bg-blue">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  Permissions
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <div className="check--1">
                    <input type="checkbox"></input>
                    Change Status
                  </div>

                  <div className="check--1">
                    <input type="checkbox"></input>
                    Change Status
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="buttonBottom">
            <button
              className="btn btn-success btn-Successs"
              onClick={handleClick}
            >
              Save
            </button>
            <Link
              href="/admin/managesubadmin"
              className="btn btn-danger btn-Activateee"
            >
              Cancel
            </Link>
          </div>
        </div>
        <AdminFooter />
      </AdminLayout>
    </>
  );
};

export default Page;
