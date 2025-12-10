"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import "../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";
import BaseAPI from "@/app/BaseAPI/BaseAPI";

const Page = () => {
  const [userData, setUserData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({
    email: "",
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
      [name]: "",
    }));
  };

  const handleClick = async () => {
    try {
      if (userData.email === "") {
        setErrors((prev) => ({
          ...prev,
          email: "Email is required",
        }));
        return;
      }
      setLoading(true);
      const response = await axios.post(BaseAPI + "/staff/forgetpassword", userData, {
        headers: {
          "content-type": "application/json",
        },
      });
      setLoading(false);

      if (response.data.status === 200) {
        Swal.fire({
          title: response.data.message,
          icon: "success",
          confirmButtonText: "Close",
        });
        setUserData({ email: "" });
      } else if(response.data.status === 500){ 
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
      setLoading(false);
      console.log(error.message);
    }
  };

  return (
    <>
      {loading && <div className="loader-containerNormal"></div>}

      <div className="container">
        <div className="forgot_password">
          <h2 class="form-signin-heading">Employer Forgot Password </h2>
          <div className="login-wrap">
            <p>Enter your e-mail address below to reset your password.</p>
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              autofocus
              name="email"
              value={userData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          <div className="login__page">
            <Link
              href="/staff/login"
              className=" no-underline hover:underline color-red"
            >
              Back to login page
            </Link>
          </div>
          <button
            class="btn btn-lg btn-login btn-block text-white"
            type="submit"
            onClick={handleClick}
          >
            SUBMIT
          </button>
        </div>
      </div>

      <div class="powered_by">
        <div class="powered_tital">Powered by</div>
        <div class="powered_logo">
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
