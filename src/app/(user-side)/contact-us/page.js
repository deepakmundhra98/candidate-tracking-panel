"use client";

import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../../Components/Loader";
import Header from "@/app/Components/Header";
import Footer from "@/app/Components/Footer/Footer";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    captcha: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);

  const recaptchaRef = React.createRef();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = "Please enter name";
    if (!formData.email) {
      newErrors.email = "Please enter email-address";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Entered email is invalid";
    }
    if (!formData.message) newErrors.message = "Please enter a message";
    if (!captchaValue) newErrors.captcha = "Please complete the reCAPTCHA!";
    
    setErrors(newErrors);
    if(Object.keys(newErrors).length > 0) return false;
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const result = validateForm();
    console.log(result);

    if (result) {
      setLoading(true);
      try {
        const response = await axios.post(
          BaseAPI + "/blog/contact",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        if (response.data.status === 200) {
          setLoading(false);
          Swal.fire({
            icon: "success",
            title:"Your inquiry has been submitted successfully. Our team will contact you shortly. ",
            confirmButtonText:"OK",
            showConfirmButton:true,
          })
          setFormData({
            name: "",
            email: "",
            message: "",
            isRobot: false,
          });

        }
      } catch (error) {
        setLoading(false);
        console.error("Error submitting form:", error);
        Swal.fire({
          icon: "Error",
          title:"Error While Submitting!",
          confirmButtonText:"Done",
          showConfirmButton:true,
        })
      }
    }
  };

  

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: "" });
  };

  const onRecaptchaExpired = (value) => {
    setCaptchaValue(value);
    setErrors({
      ...errors,
      captcha: "reCAPTCHA expired. Please verify again.",
    });
  };
  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
    setErrors({ ...errors, captcha: "" });
  };
  
  return (
    <>
      <Header />
      {!loading ? (
        <div className="flex flex-col items-center justify-start my-16">
          {/* <div
            className="border-b border-gray-200 bg-center my-10"
            style={{ backgroundImage: "url('/Images/home/pricing.png')" }}
          >
            <div className="flex items-center justify-center h-full ">
              <h1 className="text-black text-5xl font-bold">Contact Us</h1>
            </div>
          </div> */}
          <div className="bg-white shadow-2xl rounded-lg p-8  w-full max-w-2xl ">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="name"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87e0ff] ${
                      errors.name ? "border-red-500" : ""
                    }`}
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm  mt-0">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="email"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87e0ff] ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-0">{errors.email}</p>
                  )}
                </div>
              </div>
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="message"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87e0ff] ${
                    errors.message ? "border-red-500" : ""
                  }`}
                  id="message"
                  rows="4"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleInputChange}
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-sm messagecomment">{errors.message}</p>
                )}
              </div>

              <div className="flex flex-col justify-start">
                <ReCAPTCHA
                  sitekey="6Ld_kMcqAAAAAB1nFQrF68fTbpK61mFG__bXQBe-"
                  onChange={handleCaptchaChange}
                  onExpired={onRecaptchaExpired}
                  ref={recaptchaRef}
                />
                {errors.captcha && (
                  <p className="text-red-500 text-sm mt-0">{errors.captcha}</p>
                )}
              </div>
              <div className="flex justify-start">
                <button
                  className="bg-[#27BAEE] text-white text-lg px-6 py-2 rounded hover:bg-[#209cc8] focus:outline-none focus:ring-2 focus:ring-[#27BAEE]"
                  onClick={handleSubmit}
                >
                  SUBMIT
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <Loader />
      )}
      <Footer />
    </>
  );
};

export default Page;

