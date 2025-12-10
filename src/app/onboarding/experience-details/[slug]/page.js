"use client";
import React, { useEffect, useState } from "react";
import "@/app/onboarding/onboarding.css";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Image from "next/image";
const Page = ({ params }) => {
  const router = useRouter();
  const [experienceDetails, setExperienceDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [designationData, setDesignationData] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + `/candidates/getexperience/${params.slug}`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      if (response.data.status === 200) {
        const experienceData =
          response.data.response.candidate_experience || [];
        const formattedDetails = experienceData.map((detail) => ({
          start_date: detail.start_date || "",
          end_date: detail.end_date || "",
          organisation_name: detail.organisation_name || "",
          designation: detail.designation || "",
          reason_of_leaving: detail.reason_of_leaving || "",
          documents: null,
          errors: {},
          id: detail.id,
        }));
        setExperienceDetails(formattedDetails);
        setDesignationData(response.data.response.designationData);
      } else if (response.data.status === 500) {
        Swal.fire({
          icon: "warning",
          title: "Error",
          text: response.data.response,
        });
      } else if (response.data.status === 405) {
        Swal.fire({
          icon: "warning",
          title: "Error",
          text: response.data.message,
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Error",
          text: response.data.message,
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

  const handleInputChange = (index, field, value) => {
    const updatedDetails = [...experienceDetails];
    updatedDetails[index][field] = value;
    updatedDetails[index].errors[field] = ""; // Clear error on change
    setExperienceDetails(updatedDetails);
  };

  const handleFileChange = (index, file) => {
    const updatedDetails = [...experienceDetails];
    updatedDetails[index].documents = file;
    updatedDetails[index].errors.documents = ""; // Clear error on file change
    setExperienceDetails(updatedDetails);
  };

  const addMoreFields = () => {
    setExperienceDetails([
      ...experienceDetails,
      {
        start_date: "",
        end_date: "",
        organisation_name: "",
        designation: "",
        reason_of_leaving: "",
        documents: null,
        errors: {},
      },
    ]);
  };

  const validateForm = () => {
    const updatedDetails = [...experienceDetails];
    let isValid = true;

    updatedDetails.forEach((detail, index) => {
      const errors = {};
      if (!detail.start_date) errors.start_date = "Start date is required.";
      if (!detail.end_date) errors.end_date = "End date is required.";
      if (!detail.organisation_name)
        errors.organisation_name = "Organisation Name is required.";
      if (!detail.designation) errors.designation = "Designation is required.";
      if (!detail.reason_of_leaving)
        errors.reason_of_leaving = "Please enter the reason of leaving.";

      if (!detail.documents || detail.documents === null)
        errors.documents = "Supporting document is required.";

      if (Object.keys(errors).length > 0) isValid = false;
      updatedDetails[index].errors = errors;
    });

    setExperienceDetails(updatedDetails);
    return isValid;
  };

  const saveExperienceDetails = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    experienceDetails.forEach((detail, index) => {
      formData.append(
        `experienceDetails[${index}][start_date]`,
        detail.start_date
      );
      formData.append(`experienceDetails[${index}][end_date]`, detail.end_date);
      formData.append(
        `experienceDetails[${index}][organisation_name]`,
        detail.organisation_name
      );
      formData.append(
        `experienceDetails[${index}][designation]`,
        detail.designation
      );
      formData.append(
        `experienceDetails[${index}][reason_of_leaving]`,
        detail.reason_of_leaving
      );

      formData.append(`experienceDetails[${index}][id]`, detail.id);

      if (detail.documents) {
        formData.append(
          `experienceDetails[${index}][documents]`,
          detail.documents
        );
      }
    });

    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + `/candidates/saveexperience/${params.slug}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      if (response.data.status === 200) {
        router.push("/onboarding/upload-documents/" + params.slug);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
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
      {experienceDetails.length > 0 && (
        <>
          <div class="academic-section-container">
            <h1 class="section-title">Experience Section {params.slug}</h1>
            <div className="content">
              <div className="left-side">
                <form class="academic-form" onSubmit={saveExperienceDetails}>
                  {experienceDetails.map((detail, index) => (
                    <div key={index} className="academic-detail-card">
                      <h3 class="detail-title">
                        Experience Detail {index + 1}
                      </h3>
                      <div class="form-group">
                        <label class="form-label">
                          Organisation Name <span class="required">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            detail.errors.organisation_name ? "is-invalid" : ""
                          }`}
                          value={detail.organisation_name}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "organisation_name",
                              e.target.value
                            )
                          }
                        />
                        <div className="error-text">
                          {detail.errors.organisation_name}
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="form-label">
                          Designation <span class="required">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="designation"
                          value={detail.designation}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "designation",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Select Designation</option>
                          {designationData.map((i) => {
                            return (
                              <>
                                <option value={i.id}>{i.skill_name}</option>
                              </>
                            );
                          })}
                        </select>
                        <div className="error-text">
                          {detail.errors.designation_id}
                        </div>
                      </div>
                      <div className="martial-status">
                        <div className="row">
                          <div className="col-md-6">
                            <div class="form-group">
                              <label class="form-label">
                                Start Date <span class="required">*</span>
                              </label>
                              <input
                                type="date"
                                className={`form-control ${
                                  detail.errors.start_date ? "is-invalid" : ""
                                }`}
                                value={detail.start_date}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "start_date",
                                    e.target.value
                                  )
                                }
                              />
                              <div className="error-text">
                                {detail.errors.start_date}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div class="form-group">
                              <label class="form-label">
                                End Date <span class="required">*</span>
                              </label>
                              <input
                                type="date"
                                className={`form-control ${
                                  detail.errors.end_date ? "is-invalid" : ""
                                }`}
                                value={detail.end_date}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "end_date",
                                    e.target.value
                                  )
                                }
                              />
                              <div className="error-text">
                                {detail.errors.end_date}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <label class="form-label">
                          Reason of leaving <span class="required">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            detail.errors.reason_of_leaving ? "is-invalid" : ""
                          }`}
                          value={detail.reason_of_leaving}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "reason_of_leaving",
                              e.target.value
                            )
                          }
                        />
                        <div className="error-text">
                          {detail.errors.reason_of_leaving}
                        </div>
                      </div>

                      <div class="form-group">
                        <label class="form-label">
                          Supporting Documents <span class="required">*</span>
                        </label>
                        <input
                          type="file"
                          className={`form-control ${
                            detail.errors.documents ? "is-invalid" : ""
                          }`}
                          onChange={(e) =>
                            handleFileChange(index, e.target.files[0])
                          }
                        />
                        <small className="form-text text-muted">
                          Supported file types: PDF, JPG, PNG, DOCX
                        </small>
                        <div className="error-text">
                          {detail.errors.documents}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div class="form-actions">
                    <button
                      type="button"
                      class="btn add-more-btn"
                      onClick={addMoreFields}
                    >
                      Add More
                    </button>
                  </div>
                  <div className="btn-next">
                    <button
                      type="submit"
                      className="next-button"
                      onClick={saveExperienceDetails}
                    >
                      Next
                    </button>
                  </div>
                </form>
              </div>
              <div class="right-side">
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
