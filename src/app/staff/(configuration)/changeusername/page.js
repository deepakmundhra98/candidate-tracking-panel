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
import Image from "next/image";
import AdminFooter from "../../../admin/Components/AdminFooter/AdminFooter";
import Cookies from "js-cookie";
import StaffLayout from "../../StaffLayout";

const Page = () => {
  // const navigate = useNavigate();

  const [userData, setUserData] = useState({
    new_username: "",
    confirm_username: "",
  });

  const [errors, setErrors] = useState({
    new_username: "",
    confirm_username: "",
  });
  const [loading, setLoading] = useState(false);

  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };

  const token = Cookies.get("tokenStaff");



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
      const response = await axios.post(
        BaseAPI + "/admin/changeusername",
        null,
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
      const { new_username, confirm_username } = userData;

      // Check if email fields are empty
      if (!new_username || !confirm_username) {
        setErrors({
          new_username: new_username ? "" : "New Username is required",
          confirm_username: confirm_username
            ? ""
            : "Confirm Username is required",
        });
        return;
      }

      // Check if new email and confirm email match
      if (new_username !== confirm_username) {
        setErrors({
          confirm_username: "New Username and Confirm Username do not match",
        });
        return;
      }
      const confirmationResult = await Swal.fire({
        title: "Update?",
        text: "Do you want to update the username?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + "/admin/changeusername",
          userData,
          {
            headers: {
              "Content-Type": "application/json",
              // key: ApiKey,
              Authorization:
                "Bearer" + " " + token,
              // adminid: adminID,
            },
          }
        );
        // console.log("hi")
        setLoading(false);
        if (response.data.status === 200) {
          Swal.fire({
            title: "Username updated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          getData();
          setUserData({
            ...userData,
            new_username: "",
            confirm_username: "",
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
    } catch (error) {
      setLoading(false);
      // console.log(error.message)
      Swal.fire({
        title: "Failed",
        text: "Could not update username. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  return (
    <>
      <StaffLayout>
        {loading && <div className="loader-container"></div>}
       
        <div className="adminChangeUsername" style={{ minHeight: '80vh' }}>
          <div className="breadCumb1" role="">
            <div className="flex gap-3 items-center">
              <Link underline="hover" color="inherit" href="/staff/dashboard">
                <div className="flex gap-2 items-center">
                  <i className="fa-solid fa-gauge "></i>
                  <span>
                    Dashboard <i class="fa-solid fa-angles-right text-xs"></i>
                  </span>
                </div>
              </Link>
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-users"></i>
                <span>Change Staff Username</span>
              </div>
            </div>
          </div>

          <div className="pageDetails">
            <div className="profilelogo">
              <h2>Change Staff Username</h2>
            </div>

            <div className="profilelogochange">
              <div className="mb-3">
                <label htmlFor="formGroupExampleInput" className="form-label">
                  Current Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput"
                  placeholder="Current Username"
                  value={userData.username}
                  name="username"
                  disabled
                  // onChange={handleChange}
                />
                {errors.old_username && (
                  <div className="text-danger">{errors.old_username}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="formGroupExampleInput2" className="form-label">
                  New Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder="New Username"
                  value={userData.new_username}
                  name="new_username"
                  onChange={handleChange}
                />
                {errors.new_username && (
                  <div className="text-danger">{errors.new_username}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="formGroupExampleInput2" className="form-label">
                  Confirm Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder="Confirm Username"
                  value={userData.confirm_username}
                  name="confirm_username"
                  onChange={handleChange}
                />
                {errors.confirm_username && (
                  <div className="text-danger">{errors.confirm_username}</div>
                )}
              </div>
              <div className="bottomButtons">
                <button className="btn button1" onClick={handleClick}>
                  Save
                </button>
                <Link href="/staff/dashboard" className="btn button2">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
        <AdminFooter />
      </StaffLayout>
    </>
  );
};

export default Page;
