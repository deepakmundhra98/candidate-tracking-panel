"use client";
import React, { useState } from "react";
import Link from "next/link";
import "../../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import Image from "next/image";
import axios from "axios";
import BaseAPI from "../../../BaseAPI/BaseAPI";
import Swal from "sweetalert2"; // Don't forget to import SweetAlert2 if it's not already imported
import { use } from "react";
import { useRouter } from "next/navigation";

const Page = ({ params }) => {
  // console.log(params.slug);
  const router = useRouter();
  const [userData, setUserData] = useState({
    new_password: "",
    confirm_password: "",
    token: "",
  });
  const [errors, setErrors] = useState({
    new_password: "",
    confirm_password: "",
    token: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "", // Clear individual error on field change
    }));
  };

  const handlePasswordReset = async () => {
    let formErrors = {}; // To accumulate all errors

    // Validation checks
    if (userData.new_password === "") {
      formErrors.new_password = "New Password is required";
    }
    if (userData.confirm_password === "") {
      formErrors.confirm_password = "Confirm Password is required";
    }
    if (userData.new_password !== userData.confirm_password) {
      formErrors.confirm_password = "Passwords do not match";
    }

    // If there are errors, set them
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; // Stop the function if validation fails
    }

    try {
      setLoading(true);
      const updatedData = {
        ...userData,
        token: params.slug,
      }
      const response = await axios.post(
        BaseAPI + "/staff/resetpassword",
        updatedData,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      setLoading(false);

      if (response.data.status === 200) {
        Swal.fire({
          title: response.data.message,
          icon: "success",
          confirmButtonText: "Close",
        });
        router.push("/staff/login");
      } else if (response.data.status === 500) {
        Swal.fire({
          title: response.data.response,
          icon: "warning",
          confirmButtonText: "Close",
        });
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      {loading && <div className="loader-containerNormal"></div>}

      <div className="container">
        <div className="forgot_password">
          <h2 className="form-signin-heading"> Reset Password </h2>
          <div className="login-wrap">
            <p>
              Please make sure the new password and confirm password should be
              matched.
            </p>
            <div className="row m-2">
              <input
                type="password"
                className="form-control"
                id="pass"
                placeholder="New Password"
                autoFocus
                name="new_password"
                value={userData.new_password}
                onChange={handleChange}
              />
              {errors.new_password && (
                <div className="text-danger">{errors.new_password}</div>
              )}
            </div>

            <div className="row m-2">
              <input
                type="password"
                className="form-control"
                id="confirm_password"
                placeholder="Confirm Password"
                autoFocus
                name="confirm_password"
                value={userData.confirm_password}
                onChange={handleChange}
              />
              {errors.confirm_password && (
                <div className="text-danger">{errors.confirm_password}</div>
              )}
            </div>
          </div>

          <div className="login__page">
            <Link
              href="/admin/login"
              className="no-underline hover:underline color-red"
            >
              Back to login page
            </Link>
          </div>
          <input
            className="btn btn-lg btn-login btn-block text-white"
            label=""
            name="loginform"
            type="submit"
            value="Submit"
            onClick={handlePasswordReset}
          ></input>
        </div>
      </div>

      <div className="powered_by">
        <div className="powered_tital">Powered by</div>
        <div className="powered_logo">
          <Link href="/" target="_blank" className="flex justify-center">
            <Image
              src="/Images/adminSide/logicspice-logo.png"
              alt="LS RMS"
              width={250}
              height={50}
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Page;
