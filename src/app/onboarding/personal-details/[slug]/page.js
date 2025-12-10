"use client";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import "@/app/onboarding/onboarding.css";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Page = ({ params }) => {
  let data = params.slug;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // const [personalDetails, setPersonalDetails] = useState({
  //   name: "",
  //   gender: "",
  //   email_address: "",
  //   phone_number: "",
  //   date_of_birth: "",
  //   marital_status: "",
  //   physically_challenged: "",
  //   fathers_name: "",
  //   fathers_occupation: "",
  //   mothers_name: "",
  //   mothers_occupation: "",
  //   current_address: "",
  //   permanent_address: "",
  // });
  const [personalDetails, setPersonalDetails] = useState([]);
  const [errors, setErrors] = useState({
    name: "",
    gender: "",
    email_address: "",
    phone_number: "",
    date_of_birth: "",
    marital_status: "",
    physically_challenged: "",
    fathers_name: "",
    fathers_occupation: "",
    mothers_name: "",
    mothers_occupation: "",
    current_address: "",
    permanent_address: "",
  });

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + "/candidates/fetchpersonaldetails",
        {
          candidate_id: data,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      if (response.data.status === 200) {
        setPersonalDetails(response.data.response);
      } else if (response.data.status === 500) {
        Swal.fire({
          icon: "warning",
          title: "Error",
          text: response.data.response,
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPersonalDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear the error message on change
    }));
  };

  const validate = () => {
    let isValid = true;
    let newErrors = {};

    // Name validation
    if (!personalDetails.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // Gender validation
    if (!personalDetails.gender) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!personalDetails.email_address) {
      newErrors.email_address = "Email address is required";
      isValid = false;
    } else if (!emailPattern.test(personalDetails.email_address)) {
      newErrors.email_address = "Please enter a valid email address";
      isValid = false;
    }

    // Phone Number validation (optional, if provided, must be valid)
    const phonePattern = /^[0-9]{10}$/;
    if (
      personalDetails.phone_number &&
      !phonePattern.test(personalDetails.phone_number)
    ) {
      newErrors.phone_number = "Phone number must be 10 digits";
      isValid = false;
    }

    // Date of Birth validation
    if (!personalDetails.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
      isValid = false;
    } else {
      const dob = new Date(personalDetails.date_of_birth);
      if (isNaN(dob)) {
        newErrors.date_of_birth = "Please enter a valid date of birth";
        isValid = false;
      }
    }

    if (
      !personalDetails.fathers_name ||
      personalDetails.fathers_name === null
    ) {
      newErrors.fathers_name = "Father's name is required";
      isValid = false;
    }

    if (
      !personalDetails.mothers_name ||
      personalDetails.mothers_name === null
    ) {
      newErrors.mothers_name = "Mother's name is required";
      isValid = false;
    }

    if (
      !personalDetails.fathers_occupation ||
      personalDetails.fathers_occupation === null
    ) {
      newErrors.fathers_occupation = "Father's occupation is required";
      isValid = false;
    }

    if (
      !personalDetails.mothers_occupation ||
      personalDetails.mothers_occupation === null
    ) {
      newErrors.mothers_occupation = "Mother's occupation is required";
      isValid = false;
    }

    // Additional field validation (e.g., current_address, permanent_address)
    if (
      !personalDetails.current_address ||
      personalDetails.current_address === null
    ) {
      newErrors.current_address = "Current address is required";
      isValid = false;
    }

    if (
      !personalDetails.permanent_address ||
      personalDetails.permanent_address === null
    ) {
      newErrors.permanent_address = "Permanent address is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const savePersonalDetails = async (e) => {
    e.preventDefault(); // Prevent form submission and page reload

    const isValid = validate();
    if (!isValid) {
      return; // Stop form submission if validation fails
    }

    setLoading(true); // Show loader while submitting the form

    try {
      const updatedData = {
        ...personalDetails,
        candidate_id: data,
      };
      const response = await axios.post(
        BaseAPI + "/savePersonalDetails",
        updatedData
      );
      setLoading(false);
      if (response.data.status === 200) {
        router.push("/onboarding/academic-details/" + params.slug);
      }
    } catch (error) {
      console.log(error.message); // Handle error (e.g., show error message)
    } finally {
      setLoading(false); // Stop loader after submission
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%", padding: "0px" }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <>
      {personalDetails !== "" && (
        <>
          <div className="personal-section">
            <div className="content">
              <div className="left-side">
                <h1 className="section-title">Personal Details</h1>
                <form
                  className="personal-form academic-detail-card"
                  onSubmit={savePersonalDetails}
                >
                  {/* Name Field */}
                  <div className="form-group">
                    <label htmlFor="name">
                      Name: <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={personalDetails.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      disabled
                    />
                    {errors.name && (
                      <span className="error-text">{errors.name}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email_address">
                      Email Address: <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email_address"
                      name="email_address"
                      value={personalDetails.email_address}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      disabled
                    />
                    {errors.email_address && (
                      <span className="error-text">{errors.email_address}</span>
                    )}
                  </div>

                  {/* Email and Gender Fields in a Row */}
                  <div className="martial-status">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <div>
                            <label htmlFor="gender">
                              Gender: <span className="required">*</span>
                            </label>
                            <select
                              className="form-select"
                              name="gender"
                              value={personalDetails.gender}
                              onChange={handleChange}
                            >
                              <option value="">Select Gender</option>
                              <option value="1">Male</option>
                              <option value="2">Female</option>
                              <option value="3">Other</option>
                            </select>
                            {errors.gender && (
                              <span className="error-text">
                                {errors.gender}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <div>
                            <label htmlFor="marital_status">
                              Marital Status:{" "}
                              <span className="required">*</span>
                            </label>
                            <select
                              className="form-select"
                              name="marital_status"
                              value={personalDetails.marital_status}
                              onChange={handleChange}
                            >
                              <option value="">Select Marital Status</option>
                              <option value="1">Single</option>
                              <option value="2">Married</option>
                              <option value="3">Divorced</option>
                            </select>
                            {errors.marital_status && (
                              <span className="error-text">
                                {errors.marital_status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phone Number Field */}
                  <div className="form-group">
                    <label htmlFor="phone_number">
                      Phone Number: <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="phone_number"
                      name="phone_number"
                      value={personalDetails.phone_number}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone_number && (
                      <span className="error-text">{errors.phone_number}</span>
                    )}
                  </div>

                  {/* Date of Birth Field */}
                  <div className="martial-status">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="date_of_birth">
                            Date of Birth: <span className="required">*</span>
                          </label>
                          <input
                            type="date"
                            id="date_of_birth"
                            name="date_of_birth"
                            value={personalDetails.date_of_birth}
                            onChange={handleChange}
                          />
                          {errors.date_of_birth && (
                            <span className="error-text">
                              {errors.date_of_birth}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="physically_challenged">
                            Physically Challenged?:{" "}
                            <span className="required">*</span>
                          </label>
                          <select
                            className="form-select"
                            name="physically_challenged"
                            value={personalDetails.physically_challenged}
                            onChange={handleChange}
                          >
                            <option value="">Select</option>
                            <option value="1">Yes</option>
                            <option value="2">No</option>
                            <option value="3">Prefer not to say</option>
                          </select>
                          {errors.physically_challenged && (
                            <span className="error-text">
                              {errors.physically_challenged}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Fields (Marital Status, Physically Challenged, etc.) */}
                  {/* <div className="form-group">
              <label htmlFor="marital_status">Marital Status:</label>
              <select
                className="form-select"
                name="marital_status"
                value={personalDetails.marital_status}
                onChange={handleChange}
              >
                <option value="">Select Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
              </select>
              {errors.marital_status && (
                <span className="error-text">{errors.marital_status}</span>
              )}
            </div> */}

                  {/* <div className="form-group">
              <label htmlFor="physically_challenged">
                Physically Challenged?:
              </label>
              <select
                className="form-select"
                name="physically_challenged"
                value={personalDetails.physically_challenged}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="2">No</option>
                <option value="3">Prefer not to say</option>
              </select>
              {errors.physically_challenged && (
                <span className="error-text">
                  {errors.physically_challenged}
                </span>
              )}
            </div> */}

                  {/* Father's and Mother's Name and Occupation */}
                  <div className="martial-status">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="fathers_name">
                            Father's Name: <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            id="fathers_name"
                            name="fathers_name"
                            value={personalDetails.fathers_name}
                            onChange={handleChange}
                            placeholder="Enter your father's name"
                          />
                          {errors.fathers_name && (
                            <span className="error-text">
                              {errors.fathers_name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="mothers_name">
                            Mother's Name: <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            id="mothers_name"
                            name="mothers_name"
                            value={personalDetails.mothers_name}
                            onChange={handleChange}
                            placeholder="Enter your mother's name"
                          />
                          {errors.mothers_name && (
                            <span className="error-text">
                              {errors.mothers_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="form-group">
              <label htmlFor="fathers_name">Father's Name:</label>
              <input
                type="text"
                id="fathers_name"
                name="fathers_name"
                value={personalDetails.fathers_name}
                onChange={handleChange}
                placeholder="Enter your father's name"
              />
              {errors.fathers_name && (
                <span className="error-text">{errors.fathers_name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="mothers_name">Mother's Name:</label>
              <input
                type="text"
                id="mothers_name"
                name="mothers_name"
                value={personalDetails.mothers_name}
                onChange={handleChange}
                placeholder="Enter your mother's name"
              />
              {errors.mothers_name && (
                <span className="error-text">{errors.mothers_name}</span>
              )}
            </div> */}
                  <div className="martial-status">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="fathers_occupation">
                            Father's Occupation:{" "}
                            <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            id="fathers_occupation"
                            name="fathers_occupation"
                            value={personalDetails.fathers_occupation}
                            onChange={handleChange}
                            placeholder="Enter your father's occupation"
                          />
                          {errors.fathers_occupation && (
                            <span className="error-text">
                              {errors.fathers_occupation}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="mothers_occupation">
                            Mother's Occupation:{" "}
                            <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            id="mothers_occupation"
                            name="mothers_occupation"
                            value={personalDetails.mothers_occupation}
                            onChange={handleChange}
                            placeholder="Enter your mother's occupation"
                          />
                          {errors.mothers_occupation && (
                            <span className="error-text">
                              {errors.mothers_occupation}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="form-group">
              <label htmlFor="fathers_occupation">Father's Occupation:</label>
              <input
                type="text"
                id="fathers_occupation"
                name="fathers_occupation"
                value={personalDetails.fathers_occupation}
                onChange={handleChange}
                placeholder="Enter your father's occupation"
              />
              {errors.fathers_occupation && (
                <span className="error-text">{errors.fathers_occupation}</span>
              )}
            </div> */}
                  {/* <div className="form-group">
              <label htmlFor="mothers_occupation">Mother's Occupation:</label>
              <input
                type="text"
                id="mothers_occupation"
                name="mothers_occupation"
                value={personalDetails.mothers_occupation}
                onChange={handleChange}
                placeholder="Enter your mother's occupation"
              />
              {errors.mothers_occupation && (
                <span className="error-text">{errors.mothers_occupation}</span>
              )}
            </div> */}

                  {/* Addresses */}
                  <div className="form-group">
                    <label htmlFor="current_address">
                      Current Address: <span className="required">*</span>
                    </label>
                    <textarea
                      id="current_address"
                      name="current_address"
                      value={personalDetails.current_address}
                      onChange={handleChange}
                      placeholder="Enter your current address"
                    />
                    {errors.current_address && (
                      <span className="error-text">
                        {errors.current_address}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="permanent_address">
                      Permanent Address: <span className="required">*</span>
                    </label>
                    <textarea
                      id="permanent_address"
                      name="permanent_address"
                      value={personalDetails.permanent_address}
                      onChange={handleChange}
                      placeholder="Enter your permanent address"
                    />
                    {errors.permanent_address && (
                      <span className="error-text">
                        {errors.permanent_address}
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="btn-next">
                    <button type="submit" className="next-button">
                      Next
                    </button>
                  </div>
                </form>
              </div>

              <div className="right-side">
                <Image
                  width={500}
                  height={500}
                  src="/Images/onboarding/on-boarding-banner.png"
                  alt="GIF"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Page;
