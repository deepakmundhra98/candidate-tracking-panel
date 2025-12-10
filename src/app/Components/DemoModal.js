import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import Loader from "./Loader";
import { triggerGoogleAdsConversion } from "../utils/googleAds";
const DemoModal = ({ isOpen, onClose }) => {
  const[thankyou,setThankyou]= useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    isRobot: false,
  });
  const [captchaValue, setCaptchaValue] = useState(null);
  const recaptchaRef = React.createRef();
  const [errors, setErrors] = useState({}); 
  const [loading, setLoading] = useState(false);

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
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await axios.post(
          "https://www.atsway.com/ats-blog/api/requestademo",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
  
        if (response?.data?.status === 200) {
          // if (window.gtag) {
          //   await window.gtag("event", "conversion", {
          //     send_to: "AW-946594877/U5sJCLX0_9kBEL3Ir8MD",
          //     value: 1.0,
          //     currency: "USD",
          //   });
          // }
          triggerGoogleAdsConversion("946594877", "U5sJCLX0_9kBEL3Ir8MD");
          setFormData({
            name: "",
            email: "",
            phone: "",
            message: "",
            isRobot: false,
          });
          setThankyou(true);
        } else {
          setThankyou(false);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setThankyou(false);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, ""); 
      if (numericValue.length > 15) return; 
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  
    setErrors({ ...errors, [name]: "" });
  };
  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
    setErrors({ ...errors, captcha: "" });
  };
  if (!isOpen) return null;
    // MetaData
    const metaTitle = document.querySelector('meta[name="title"]');
    let totalMetaTitle =
      "Request an ATS Demo | See Atsway in Action";
    if (metaTitle) {
      metaTitle.content = totalMetaTitle;
    }
    document.title = totalMetaTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
  
    if (metaDescription) {
      metaDescription.content =
        "Request a free demo of Atsway’s applicant tracking software. Discover how our ATS can simplify hiring, improve workflows, and help you find top talent faster.";
    }
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.content =
        "applicant tracking system, ats software, applicant tracking software, applicant tracking software for recruiters";
    }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="custom-class1 p-8 sm:px-16 shadow-lg w-full h-full relative overflow-y-scroll">
        <div className="mb-6">
          <img
            src="/Images/logo/logo-white 1.png"
            alt="logo"
            className="w-36"
          />
          <button
            className="absolute top-2 right-3 text-4xl font-bold text-white hover:text-black rounded-full w-10 h-10 flex items-center justify-center"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            className="flex flex-col p-4 bg-white rounded-md h-auto bg-cover bg-center modal-order"
            style={{ backgroundImage: "url('/Images/demo/demo.png')" }}
          >
            <div>
              <h1 class="text-2xl font-bold mb-4">
                Start Your Free Trial Today!
              </h1>
              <p class="text-gray-700 mb-4">
                Discover why users recommend our platform for its flexibility
                and customization options.
              </p>
              <p class="text-gray-700 mb-4">
                {" "}
                <strong>
                  In just a 20-30 minute demo, we’ll guide you through:
                </strong>
              </p>
              <ul class="text-left text-gray-700 mb-4 list-disc list-inside">
                <li>A tour of our system’s key features and tools</li>
                <li>Customizing the platform to fit your unique needs</li>
                <li>Clear pricing details and next steps</li>
                <li>Activation of your free trial for hands-on experience!</li>
              </ul>
              <p class="text-gray-700">
                Don’t just take our word for it—experience the difference for
                yourself!
              </p>
            </div>
          </div>
          {!loading ? (
            !thankyou ? (
              <>
                <div className="flex flex-col p-4 bg-white rounded-md">
                  <h2 className="text-2xl font-bold text-black mb-6">
                    Request a Demo
                  </h2>
                  <form className="space-y-3" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 ">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          className=" block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500 mt-0">
                            {errors.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        placeholder="Enter your email"
                        className=" block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                      {errors.email && (
                        <p className=" text-sm text-red-500 mt-0">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 ">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">
                          Phone number
                        </label>
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          type="tel"
                          placeholder="Enter your phone number"
                          className=" block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className="block text-gray-700 font-bold mb-1"
                        htmlFor="message"
                      >
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className={`w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.message ? "border-red-500" : ""
                        }`}
                        id="message"
                        rows="3"
                        name="message"
                        placeholder="Enter the message"
                        value={formData.message}
                        onChange={handleChange}
                      ></textarea>
                      {errors.message && (
                        <p className=" text-red-500 text-sm messagecomment ">
                          {errors.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col justify-start items-start">
                      <ReCAPTCHA
                        sitekey="6Ld_kMcqAAAAAB1nFQrF68fTbpK61mFG__bXQBe-"
                        onChange={handleCaptchaChange}
                        ref={recaptchaRef}
                      />
                      {errors.captcha && (
                        <p className="text-red-500 text-sm mt-0">
                          {errors.captcha}
                        </p>
                      )}
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="w-1/2 md:w-1/4 bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700"
                      >
                        SUBMIT
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col p-4 bg-white rounded-md">
                  <div class="bg-white p-8 border border-2 border-gray-800 rounded-lg text-center max-w-md mx-auto">
                    <h1 class="text-green-600 text-2xl font-bold mb-4">
                      Thank you for showing your interest in Atsway.
                    </h1>
                    <p class="text-gray-700 text-base font-medium mb-6">
                      Please check your email. We sent demo access details to
                      your email address. If you can not find it, make sure to
                      check SPAM emails. Thank you!
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        setThankyou(false);
                      }}
                      class="bg-blue-600 font-medium text-white py-2 px-6 rounded-md mb-6"
                    >
                      OK
                    </button>
                    <div className="flex items-center justify-center mt-2 mb-4">
                      <img
                        src="/Images/logo/Pasted image.png"
                        alt="LinkedIn Logo"
                        className="w-44 h-12"
                      />
                    </div>
                  </div>
                </div>
              </>
            )
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoModal;
