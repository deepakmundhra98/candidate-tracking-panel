"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../../common.css";
import "../employer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import Image from "next/image";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Tooltip } from "@mui/material";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import Recaptcha from "@/app/Components/Recaptcha/Recaptcha";

const Page = () => {
  const [captchaKey, setCaptchaKey] = useState(""); // State to hold captcha key
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    username: "",
    company_name: "",
    email: "",
    password: "",
    confirm_password: "",
    captcha: "",
  });

  const [loginData, setLoginData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    company_name: "",
    email: "",
    password: "",
    confirm_password: "",
    captcha: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    if (isCaptchaVerified) {
      setErrors((prev) => ({
        ...prev,
        captcha: "",
      }));
    }
  };

  const [loading, setLoading] = useState(false);
  const [constantsData, setConstantsData] = useState();

  const fetchConstantsData = async () => {
    try {
      const response = await axios.post(BaseAPI + "/getconstants", null, {
        headers: {
          "content-type": "Application/json",
        },
      });

      setConstantsData(response.data.response); // Store the entire response data if needed
      const captchaKey = response.data.response.site_captcha_key;
      setCaptchaKey(captchaKey); // Set the captcha key in the state
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const getData = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    console.log("Login Data:", loginData);

    try {
      const newErrors = {};
      if (loginData.first_name === "") {
        newErrors.first_name = "First name is required";
        window.scrollTo(0, 0);
      }
      if (loginData.last_name === "") {
        newErrors.last_name = "Last name is required";
        window.scrollTo(0, 0);
      }
      if (loginData.username === "") {
        newErrors.username = "Username is required";
        window.scrollTo(0, 0);
      }
      if (loginData.company_name === "") {
        newErrors.company_name = "Company Name  is required";
        window.scrollTo(0, 0);
      }

      if (loginData.email === "") {
        newErrors.email = "Email is required";
        window.scrollTo(0, 0);
      } else if (!isValidEmail(loginData.email)) {
        newErrors.email = "Email address format is not valid";
        window.scrollTo(0, 0);
      }

      if (loginData.password === "") {
        newErrors.password = "password is required";
        window.scrollTo(0, 0);
      } else if (loginData.password.length < 8) {
        newErrors.password = "Please enter atleast 8 characters";
        window.scrollTo(0, 0);
      }

      if (loginData.confirm_password === "") {
        newErrors.confirm_password = "confirm password is required";
        window.scrollTo(0, 0);
      } else if (loginData.confirm_password.length < 8) {
        newErrors.confirm_password = "Please enter atleast 8 characters";
        window.scrollTo(0, 0);
      } else if (loginData.password !== loginData.confirm_password) {
        newErrors.confirm_password =
          "Password and confirm password do not match";
        window.scrollTo(0, 0);
      }

      if (!isCaptchaVerified) {
        newErrors.captcha = "Please verify reCaptcha";
      }

      setErrors(newErrors);

      // Function to validate email format
      function isValidEmail(email) {
        // Use a regular expression to validate email format
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
      }

      if (Object.keys(newErrors).length === 0) {
        if (isCaptchaVerified) {
          setLoading(true);

          const response = await axios.post(
            BaseAPI + "/user/register",
            loginData
          );

          console.log(response.data.response.message);

          let status = response.data.status;

          setLoading(false);
          console.log("Request sent successfully", response.data.status);
          if (status == 200 && response.data.response.token !== "") {
            // let userType = response.data.response.user.user_type

            let tokenFetch = response.data.response.token;
            console.log("token fetch", tokenFetch);
            let fnameFetch = response.data.response.first_name;
            // let usertypeFetch = response.data.response.user.user_type
            // console.log("object")
            // console.log('200 hit')

            // Storing data in sessionStorage
            // sessionStorage.setItem("token", tokenFetch);
            // sessionStorage.setItem("fname", fnameFetch);
            // sessionStorage.setItem("user_type", usertypeFetch);

            Cookies.set("token", tokenFetch);
            Cookies.set("fname", fnameFetch);
            router.push("/employer/login");
            Swal.fire({
              title: "Employer registered successfully",
              icon: "success",
              confirmButtonText: "Close",
            });
          }
          if (status === 500) {
            Swal.fire({
              title: response.data.response.message,
              icon: "warning",
              timer: 3000,
              timerProgressBar: true,
            });
          } else {
            console.log("Nothing works");
          }
        }
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Server Error",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchConstantsData();
  }, []);

  return (
    <>
      <div className="container container-admin">
        <div className="admin-login">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="images-bg" style={{ height: "100%" }}></div>
            </div>
            <div className="col-lg-6 col-md-6 ">
              <div className="Signup">
                <h2 className="new-signin-heading">Employer SignUp</h2>
                <div className="login-wrap">
                  <div className="login-input">
                    <div className="input-icon">
                      <i className="fa fa-user"></i>
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        className="form-control shadow-none"
                        placeholder="First Name"
                        value={loginData.first_name}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.first_name && (
                      <div className="text-danger">{errors.first_name}</div>
                    )}
                  </div>
                  <div className="login-input">
                    <div className="input-icon">
                      <i className="fa fa-user"></i>
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        className="form-control shadow-none"
                        placeholder="Last Name"
                        value={loginData.last_name}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.last_name && (
                      <div className="text-danger">{errors.last_name}</div>
                    )}
                  </div>

                  <div className="login-input">
                    <div className="input-icon">
                      <i className="fa fa-user"></i>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        className="form-control shadow-none"
                        placeholder="UserName"
                        value={loginData.username}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.username && (
                      <div className="text-danger">{errors.username}</div>
                    )}
                  </div>

                  <div className="login-input">
                    <div className="input-icon">
                      <i className="fa fa-building"></i>
                      <input
                        type="text"
                        name="company_name"
                        id="c_name"
                        className="form-control shadow-none"
                        placeholder="Company name"
                        value={loginData.company_name}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.company_name && (
                      <div className="text-danger">{errors.company_name}</div>
                    )}
                  </div>
                  <div className="login-input">
                    <div className="input-icon">
                      <i className="fas fa-envelope"></i>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        id="staticEmail"
                        name="email"
                        placeholder="Email address"
                        value={loginData.email}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.email && (
                      <div className="text-danger">{errors.email}</div>
                    )}
                  </div>
                  <div className="login-input">
                    <div className="input-icon">
                      <i className="fas fa-lock"></i>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control shadow-none"
                        id="inputPassword"
                        placeholder="Password"
                        name="password"
                        value={loginData.password}
                        onChange={handleChange}
                      />

                      <div className="passwordVisibility">
                        <p
                          className="btn-primary"
                          type="button"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <>
                              <Tooltip title="Hide Password">
                                <VisibilityOffIcon />
                              </Tooltip>
                            </>
                          ) : (
                            <>
                              <Tooltip title="View Password">
                                <VisibilityIcon />
                              </Tooltip>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    {errors.password && (
                      <div className="text-danger">{errors.password}</div>
                    )}
                  </div>
                  <div className="login-input">
                    <div className="input-icon">
                      <i className="fas fa-lock"></i>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control shadow-none"
                        id="inputPassword"
                        placeholder="Confirm Password"
                        name="confirm_password"
                        value={loginData.confirm_password}
                        onChange={handleChange}
                      />

                      <div className="passwordVisibility">
                        <p
                          className="btn-primary"
                          type="button"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <>
                              <Tooltip title="Hide Password">
                                <VisibilityOffIcon />
                              </Tooltip>
                            </>
                          ) : (
                            <>
                              <Tooltip title="View Password">
                                <VisibilityIcon />
                              </Tooltip>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    {errors.confirm_password && (
                      <div className="text-danger">
                        {errors.confirm_password}
                      </div>
                    )}
                  </div>
                  <div className="reCaptchaLogin w-100">
                    {captchaKey && (
                      <ReCAPTCHA
                        sitekey={captchaKey}
                        onChange={(value) => setIsCaptchaVerified(value)}
                      />
                    )}
                    {errors.captcha && (
                      <div className="text-danger CaptchaVerify">
                        {errors.captcha}
                      </div>
                    )}
                  </div>
                  <button
                    className="btn btn-lg btn-block loginButton"
                    onClick={getData}
                  >
                    Register
                  </button>

                  <div className="already-login my-3">
                    <div className="text-center">
                      <p>
                        Already a Member?{" "}
                        <Link href="/employer/login" className="pull-right">
                          Login
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="powered_by">
          <div className="powered_tital">Powered by</div>
          <div className="powered_logo">
            <Link href="/" target="_blank" className="flex justify-center">
              <Image
                src="/Images/adminSide/logicspice-logo.png"
                alt="LS RMS"
                width={200}
                height={50}
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
