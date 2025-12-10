"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Tooltip } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios"; // Make sure axios is installed
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const Page = ({params}) => {

  const router = useRouter();
  const pathname = usePathname();

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(""); // State to hold captcha key
  const [constantsData, setConstantsData] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    employer_id: params.employerid,
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    captcha: "",
  });

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
      errors.captcha = "";
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getData = async (e) => {
    e.preventDefault();
    try {
      const newErrors = {};

      if (loginData.email === "") {
        newErrors.email = "Email address is required";
        window.scrollTo(0, 0);
      } else if (!isValidEmail(loginData.email)) {
        newErrors.email = "Email address format is not valid";
        window.scrollTo(0, 0);
      }
      if (loginData.password === "") {
        newErrors.password = "Password is required";
        window.scrollTo(0, 0);
      }
      if (!isCaptchaVerified) {
        newErrors.captcha = "Please verify reCaptcha";
      }

      setErrors(newErrors);

      // Function to validate email format
      function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
      }

      if (Object.keys(newErrors).length === 0) {
        if (isCaptchaVerified) {
          setLoading(true);
          // console.log("Sending login request...");
          const response = await axios.post(BaseAPI + "/candidate/login", loginData);

          console.log("Response received:", response.data);

          const status = response.data.status;

          if (status == 200 && response.data.token !== "") {
            const tokenFetch = response.data.token;
            const fnameFetch = response.data.user.first_name;

            Cookies.set("tokenCandidate", tokenFetch);
            Cookies.set("fnameCandidate", fnameFetch);
            Cookies.set("candidateId", response.data.user.id);
            Cookies.set("candidateUserType", response.data.userType);
            Cookies.set(
              "candidate_profile_image",
              response.data.profile_image
            );
            setLoading(false);
            router.push("/candidate-panel/dashboard");
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });

            Toast.fire({
              icon: "success",
              title: "Welcome " + fnameFetch,
            });
          } else if (status === 500) {
            setLoading(false);
            Swal.fire({
              title: response.data.response.message,
              icon: "warning",
              timer: 3000,
              timerProgressBar: true,
            });
          } else {
            setLoading(false);
            console.log("Nothing Works");
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
      console.error("Error:", error.message);
    }
  };
  const fetchConstantsData = async () => {
    try {
      const response = await axios.post(BaseAPI + "/sendcredentials", null, {
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

  useEffect(() => {
    fetchConstantsData();
  }, []);

    useEffect(() => {
    if (pathname) {
      const pathParts = pathname.split("/");
      if (pathParts.length >= 5) {
        const id1 = pathParts[3];
        const id2 = pathParts[5];
        // setIds({ id1, id2 });
        console.log(id1, id2, "id1, id2");
        // getData(id1, id2);
        Cookies.set("candidates_employer_id", id1);
      }
    }
  }, [pathname]);
  return (
    <>
      {loading && <div className="loader-containerNormal"></div>}
      <div className="bg-blue-100 flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row w-full max-w-4xl">
          <div className="p-8 md:w-1/2">
            <h2 className="text-2xl font-bold mb-2">
              Welcome To Candidate Panel
            </h2>

            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="username">
                  Email Address
                </label>
                <input
                  className="w-full px-3 py-2 border rounded-lg"
                  id="email"
                  placeholder="Enter Your Email Address"
                  type="text"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="text-red-500">{errors.email}</div>
                )}
              </div>

              <div className="mb-4">
                <div className="relative">
                  <label
                    className="block text-gray-700 mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border rounded-lg"
                    id="password"
                    placeholder="Password"
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                  />
                  <div className="passwordVisibility absolute top-[39px] right-[12px]">
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
                  {errors.password && (
                      <div className="text-red-500">{errors.password}</div>
                    )}
                </div>
              </div>
              <div className="reCaptchaLogin w-100 mt-4 scale-[0.78] origin-top-left">
                {captchaKey && (
                  <ReCAPTCHA
                    sitekey={captchaKey}
                    onChange={(value) => setIsCaptchaVerified(value)}
                  />
                )}
              </div>
              {errors.captcha && (
                <div className="text-red-500 CaptchaVerify mt-[-15px]">
                  {errors.captcha}
                </div>
              )}

              <button className="w-full bg-orange-500 text-white py-2 rounded-lg mt-3" onClick={getData}>
                Login
              </button>
            </form>
            <p className="mt-4 text-center text-gray-600">
              Forgot Password?
              <Link className="text-orange-500" href="#">
                {" "}
                Click Here{" "}
              </Link>
            </p>
          </div>
          <div className="hidden md:block md:w-1/2 bg-blue-50 rounded-r-lg p-8 flex items-center justify-center">
            <Image
              src="/Images/candidate-panel/candidate-panel-login.jpg"
              alt="Illustration of three professionals, including a doctor, a scientist, and a businesswoman, standing confidently."
              width="600"
              height="400"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
