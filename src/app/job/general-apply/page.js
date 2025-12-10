"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";

const Page = () => {
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [captchaKey, setCaptchaKey] = useState(""); 
  const [constantsData, setConstantsData] = useState();
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  // ✅ Fetch form fields from API
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.post(
          `${BaseAPI}/get-direct-application-form-data_for_candidate`,
          { employer_id: Cookies.get("employer_code") }
        );
        setFormFields(response.data.response);

        const initialFormData = {};
        response.data.response.forEach((field) => {
          initialFormData[field.label] =
            field.value_type === "checkbox" ? false : "";
        });
        setFormData(initialFormData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching form fields:", error.message);
      }
    };

    getData();
  }, []);

  // ✅ Handle input change
  const handleChange = (e, field) => {
    const { name, value, type, checked, files } = e.target;
    const newValue = type === "checkbox" ? checked : type === "file" ? files[0] : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));

    // Remove error for this field if exists
    if (errors[name]) {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }
  };

  // ✅ Form validation function
  const validateForm = () => {
    const newErrors = {};

    formFields.forEach((field) => {
      const value = formData[field.label];

      // Required validation
      if (field.is_required && (!value || value === "" || value === false)) {
        newErrors[field.label] = `${field.label} is required`;
      }

      // Email validation
      if (field.value_type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.label] = "Invalid email address";
        }
      }

      // File validation
      if (field.value_type === "file" && field.is_required && !value) {
        newErrors[field.label] = "Please upload a file";
      }
    });

    // Captcha validation
    if (!isCaptchaVerified) {
      newErrors["captcha"] = "Please verify the captcha";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true if no errors
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please fill all the fields correctly.",
        icon: "warning",
        confirmButtonText: "Close",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      formDataToSend.append("employer_id", Cookies.get("employerId"));

      setLoading(true);
      const response = await axios.post(
        `${BaseAPI}/save_direct_application_form_data`,
        formDataToSend
      );
      setLoading(false);

      if (response.data.status === 200) {
        Swal.fire({
          title: "Job Application Form submitted successfully!",
          text: "Please check your email for confirmation.",
          icon: "success",
          confirmButtonText: "Close",
        }).then(() => setFormData({}));
      }
    } catch (error) {
      setLoading(false);
      console.error("Error submitting form:", error.message);
    }
  };

  // ✅ Fetch captcha key
  const fetchConstantsData = async () => {
    try {
      const response = await axios.post(BaseAPI + "/sendcredentials", null, {
        headers: {
          "content-type": "Application/json",
        },
      });

      setConstantsData(response.data.response);
      const captchaKey = response.data.response.site_captcha_key;
      setCaptchaKey(captchaKey);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchConstantsData();
  }, []);

  // ✅ Render dynamic fields
  const renderField = (field) => {
    switch (field.value_type) {
      case "input-box":
      case "email":
      case "password":
      case "date":
        return (
          <input
            type={field.value_type === "input-box" ? "text" : field.value_type}
            name={field.label}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData[field.label] || ""}
            onChange={(e) => handleChange(e, field)}
          />
        );

      case "text-area":
        return (
          <textarea
            name={field.label}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData[field.label] || ""}
            onChange={(e) => handleChange(e, field)}
          />
        );

      case "select-box":
        return (
          <select
            name={field.label}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData[field.label] || ""}
            onChange={(e) => handleChange(e, field)}
          >
            <option value="">Select an option</option>
            {field.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="flex gap-4">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field.label}
                  className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                  value={option}
                  checked={formData[field.label] === option}
                  onChange={(e) => handleChange(e, field)}
                />
                {option}
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name={field.label}
              className="w-5 h-5 text-blue-500 focus:ring-blue-500"
              checked={formData[field.label] || false}
              onChange={(e) => handleChange(e, field)}
            />
            {field.label}
          </label>
        );

      case "file":
        return (
          <input
            type="file"
            name={field.label}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleChange(e, field)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {loading && <div className="loader-container-job-apply"></div>}
      <div className="flex justify-center items-center min-h-screen bg-gray-100 py-[30px]">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            APPLICATION FORM
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formFields.map((field, index) => (
              <div key={index}>
                <label className="block text-gray-700 font-medium mb-2">
                  {field.label} {field.is_required && <span className="text-red-500">*</span>}
                </label>
                {renderField(field)}
                {errors[field.label] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field.label]}</p>
                )}
              </div>
            ))}

            <div className="reCaptchaLogin w-100 mt-4">
              {captchaKey && (
                <>
                  <ReCAPTCHA
                    sitekey={captchaKey}
                    onChange={(value) => setIsCaptchaVerified(!!value)}
                  />
                  {errors["captcha"] && (
                    <p className="text-red-500 text-sm mt-1">{errors["captcha"]}</p>
                  )}
                </>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 mt-10"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
