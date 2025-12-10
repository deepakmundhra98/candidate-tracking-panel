"use client";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import "../../../common.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useState, useEffect } from "react";
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
  const [EmployerList, setEmployerListData] = useState(false);

  const [userData, setUserData] = useState({
    employer_id:"",
    first_name: "",
    last_name: "",
    username: "",
    email_address: "",
    password: "",
    c_password: "",
  });
  const token = Cookies.get("token");

  const [errors, setErrors] = useState({
    employer_id:"",
    first_name: "",
    last_name: "",
    username: "",
    email_address: "",
    password: "",
    c_password: "",
  });

  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + "/admin/user/staff/add",
        null, // Pass null as the request body if not required
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
      setEmployerListData(response.data.response);
      console.log(response.data.response)
      //   console.log(paymentHistory);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get plans data at APmanageplans");
    }
  };

  useEffect(() => {
    getData();
    window.scrollTo(0, 0);
  }, []);

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
      if (userData.employer_id === "") {
        newErrors. employer_id = "Employer is required";
      }
      if (userData.first_name === "") {
        newErrors.first_name = "first name is required";
      }
      if (userData.last_name === "") {
        newErrors.last_name = "last name is required";
      }
      if (userData.username === "") {
        newErrors.username = "username is required";
      }
      if (userData.email_address === "") {
        newErrors.email_address = "email is required";
      }
      if (userData.password === "") {
        newErrors.password = "password is required";
      } else if (userData.password.length < 8) {
        newErrors.password = "Please enter atleast 8 characters";
      }
      if (userData.c_password === "") {
        newErrors.c_password = "confirm password is required";
      } else if (userData.c_password.length < 8) {
        newErrors.c_password = "Please enter atleast 8 characters";
      } else if (userData.password !== userData.c_password) {
        newErrors.c_password =
          "Password and confirm password do not match";
      }

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
          const response = await axios.post(
            BaseAPI + "/admin/user/staff/add",
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
              title: "Staff  Added successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            setUserData({
              ...userData,
              employer_id:"",
              first_name: "",
              last_name: "",
              username: "",
              email_address: "",
              password: "",
              c_password: "",
            });
            window.scrollTo(0, 0);
            router.push("/admin/managestaff");
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
                  <Link href="/admin/managestaff"> Manage Staff </Link>{" "}
                  <i class="fa-solid fa-angles-right text-xs"></i>
                </span>
              </div>
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-plus"></i>
                <span> Add Staff</span>
              </div>
            </div>
          </div>

          <div className="userProcesss">
            <h4>Add Staff</h4>
          </div>
          <div className="profilelogochange">
            <div className="processHeading">
              <h5>Add Staff Details:</h5>
            </div>
            <form action="" method="post">
            <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  Select Employer <span>*</span>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  {/* <input
                    type="text"
                    className="form-control"
                    value={userData.first_name}
                    name="first_name"
                    onChange={handleChange}
                  ></input> */}
                  <select
                        className='form-select shadow-none'
                        aria-label=''
                        name='employer_id'
                        value={userData.employer_id}
                        onChange={handleChange}
                      >
                        <option value='' selected>
                          Select Employer
                        </option>
                        {EmployerList &&
                          EmployerList.map(i => (
                            <option key={i.id} value={i.id}>
                               {i.first_name}
                               {''} {i.last_name}
                            </option>
                          ))}
                        </select>
                  {errors. employer_id && (
                    <div className="text-danger">{errors.employer_id}</div>
                  )}
                </div>
              </div>
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
                    value={userData.c_password}
                    name="c_password"
                    onChange={handleChange}
                  ></input>
                  {errors.c_password && (
                    <div className="text-danger">{errors.c_password}</div>
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
              href="/admin/managestaff"
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
