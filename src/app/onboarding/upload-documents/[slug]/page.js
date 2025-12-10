"use client";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import "@/app/onboarding/onboarding.css";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";

const Page = ({ params }) => {
  let data = params.slug;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [documentDetails, setDocumentDetails] = useState({
    identification: "",
    portfolio: "",
    certificates: "",
  });
  const [errors, setErrors] = useState({
    identification: "",
  });

  const [isPageActive, setIsPageActive] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + "/candidates/getdocument/" + params.slug,
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
        setIsPageActive(true);
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

  const handleFileChange = (field, file) => {
    setDocumentDetails((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const validate = () => {
    let isValid = true;
    let newErrors = {};

    if (
      !documentDetails.identification ||
      documentDetails.identification === null
    ) {
      newErrors.identification = "Supporting document is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const saveDocumentDetails = async (e) => {
    e.preventDefault(); // Prevent form submission and page reload

    const isValid = validate();
    if (!isValid) {
      return; // Stop form submission if validation fails
    }

    setLoading(true); // Show loader while submitting the form

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("candidate_id", data); // Append candidate ID
      formData.append("identification", documentDetails.identification); // Append file
      //   if (documentDetails.certificate) {
      formData.append("certificates", documentDetails.certificates); // Append optional file
      //   }
      if (documentDetails.portfolio) {
        formData.append("portfolio", documentDetails.portfolio); // Append optional portfolio link
      }

      // Send data to the backend
      const response = await axios.post(
        BaseAPI + "/candidates/savedocuments/" + params.slug,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type
          },
        }
      );

      setLoading(false);
      if (response.data.status === 200) {
        router.push("/onboarding/profile-summary/" + params.slug);
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: response.data.response || "An error occurred.",
        });
      }
    } catch (error) {
      console.log(error.message); // Handle error (e.g., show error message)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save documents. Please try again.",
      });
    } finally {
      setLoading(false); // Stop loader after submission
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDocumentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear the error message on change
    }));
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
      {isPageActive && (
        <>
          <div className="personal-section">
            <div className="content">
              <div className="left-side">
                <h1 className="section-title">Upload Documents</h1>
                <form
                  className="personal-form academic-detail-card"
                  onSubmit={saveDocumentDetails}
                >
                  {/* Name Field */}
                  <div className="form-group">
                    <label className="form-label">
                      Identification proof document{" "}
                      <span class="required">*</span>
                    </label>
                    <input
                      type="file"
                      className={`form-control ${
                        errors.identification ? "is-invalid" : ""
                      }`}
                      onChange={(e) =>
                        handleFileChange("identification", e.target.files[0])
                      }
                    />
                    <small className="form-text text-muted">
                      Supported file types: PDF, JPG, PNG, DOCX
                    </small>
                    <div className="error-text">{errors.identification}</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Certificates(If any)</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) =>
                        handleFileChange("certificates", e.target.files[0])
                      }
                    />
                    <small className="form-text text-muted">
                      Supported file types: PDF, JPG, PNG, DOCX
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="portfolio">
                      Portfolio Link: <span class="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="portfolio"
                      name="portfolio"
                      value={documentDetails.portfolio}
                      onChange={handleChange}
                      placeholder="Enter your portfolio link"
                    />
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
