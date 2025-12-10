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
  const [academicDetails, setAcademicDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qualificationData, setQualificationData] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + `/candidates/academicdetailsdata/${params.slug}`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      if (response.data.status === 200) {
        const educationData = response.data.response.candidate_education || [];
        const formattedDetails = educationData.map((detail) => ({
          course: detail.course || "",
          qualification_id: detail.qualification_id || "",
          school_college: detail.school_college || "",
          city: detail.city || "",
          university: detail.university_board || "",
          year: detail.passing_year || "",
          percentage: detail.percentage || "",
          documents: null,
          errors: {},
          id: detail.id,
        }));
        setAcademicDetails(formattedDetails);
        setQualificationData(response.data.response.qualificationData);
      } else if (response.data.status === 405) {
        Swal.fire({
          icon: "warning",
          title: "Error",
          text: response.data.message,
        });
      } else if (response.data.status === 500) {
        Swal.fire({
          icon: "warning",
          title: "Error",
          text: response.data.response,
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
    const updatedDetails = [...academicDetails];
    updatedDetails[index][field] = value;
    updatedDetails[index].errors[field] = ""; // Clear error on change
    setAcademicDetails(updatedDetails);
  };

  const handleFileChange = (index, file) => {
    // console.log(file, "file");
    const updatedDetails = [...academicDetails];
    updatedDetails[index].documents = file;
    updatedDetails[index].errors.documents = ""; // Clear error on file change
    setAcademicDetails(updatedDetails);
  };

  const addMoreFields = () => {
    setAcademicDetails([
      ...academicDetails,
      {
        course: "",
        qualification_id: "",
        school_college: "",
        city: "",
        university: "",
        year: "",
        percentage: "",
        documents: null,
        errors: {},
      },
    ]);
  };

  const validateForm = () => {
    const updatedDetails = [...academicDetails];
    let isValid = true;

    updatedDetails.forEach((detail, index) => {
      const errors = {};
      if (!detail.course) errors.course = "Course/Subjects is required.";
      if (!detail.school_college)
        errors.school_college = "School/College is required.";
      if (!detail.city) errors.city = "City is required.";
      if (!detail.university)
        errors.university = "University/Board is required.";
      if (!detail.year) errors.year = "Year of passing is required.";
      if (!detail.percentage || detail.percentage === null)
        errors.percentage = "Percentage of marks is required.";
      if (!detail.documents || detail.documents === null)
        errors.documents = "Supporting document is required.";
      if (!detail.qualification_id)
        errors.qualification_id = "Qualification is required.";

      if (Object.keys(errors).length > 0) isValid = false;
      updatedDetails[index].errors = errors;
    });

    setAcademicDetails(updatedDetails);
    return isValid;
  };

  const saveAcademicDetails = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    academicDetails.forEach((detail, index) => {
      formData.append(`academicDetails[${index}][course]`, detail.course);
      formData.append(
        `academicDetails[${index}][school_college]`,
        detail.school_college
      );
      formData.append(`academicDetails[${index}][city]`, detail.city);
      formData.append(
        `academicDetails[${index}][university]`,
        detail.university
      );
      formData.append(`academicDetails[${index}][year]`, detail.year);
      formData.append(
        `academicDetails[${index}][percentage]`,
        detail.percentage
      );

      formData.append(`academicDetails[${index}][id]`, detail.id);
      formData.append(
        `academicDetails[${index}][qualification_id]`,
        detail.qualification_id
      );

      if (detail.documents) {
        formData.append(
          `academicDetails[${index}][documents]`,
          detail.documents
        );
      }
    });

    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + `/candidates/saveacademicdetails/${params.slug}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      if (response.data.status === 200) {
        router.push("/onboarding/experience-details/" + params.slug);
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
      {academicDetails.length > 0 && (
        <>
          <div class="academic-section-container">
            <h1 class="section-title">Academic Section {params.slug}</h1>
            <div className="content">
              <div className="left-side">
                <form class="academic-form" onSubmit={saveAcademicDetails}>
                  {academicDetails.map((detail, index) => (
                    <div key={index} className="academic-detail-card">
                      <h3 class="detail-title">Academic Detail {index + 1}</h3>
                      <div class="form-group">
                        <label class="form-label">
                          Course/Subjects <span class="required">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            detail.errors.course ? "is-invalid" : ""
                          }`}
                          value={detail.course}
                          onChange={(e) =>
                            handleInputChange(index, "course", e.target.value)
                          }
                        />
                        <div className="error-text">{detail.errors.course}</div>
                      </div>
                      <div class="form-group">
                        <label class="form-label">
                          Qualification <span class="required">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="qualification_id"
                          value={detail.qualification_id}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "qualification_id",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Select Qualification</option>
                          {qualificationData.map((i) => {
                            return (
                              <>
                                <option value={i.id}>
                                  {i.qualification_name}
                                </option>
                              </>
                            );
                          })}
                        </select>
                        <div className="error-text">
                          {detail.errors.qualification_id}
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="form-label">
                          School/College <span class="required">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            detail.errors.school_college ? "is-invalid" : ""
                          }`}
                          value={detail.school_college}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "school_college",
                              e.target.value
                            )
                          }
                        />
                        <div className="error-text">
                          {detail.errors.school_college}
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="form-label">
                          City <span class="required">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            detail.errors.city ? "is-invalid" : ""
                          }`}
                          value={detail.city}
                          onChange={(e) =>
                            handleInputChange(index, "city", e.target.value)
                          }
                        />
                        <div className="error-text">{detail.errors.city}</div>
                      </div>
                      <div class="form-group">
                        <label class="form-label">
                          University/Board <span class="required">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            detail.errors.university ? "is-invalid" : ""
                          }`}
                          value={detail.university}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "university",
                              e.target.value
                            )
                          }
                        />
                        <div className="error-text">
                          {detail.errors.university}
                        </div>
                      </div>
                      <div className="martial-status">
                        <div className="row">
                          <div className="col-md-6">
                            <div class="form-group">
                              <label class="form-label">
                                Year of Passing <span class="required">*</span>
                              </label>
                              <input
                                type="number"
                                className={`form-control ${
                                  detail.errors.year ? "is-invalid" : ""
                                }`}
                                value={detail.year}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "year",
                                    e.target.value
                                  )
                                }
                              />
                              <div className="error-text">
                                {detail.errors.year}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div class="form-group">
                              <label class="form-label">
                                Percentage of Marks{" "}
                                <span class="required">*</span>
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                className={`form-control ${
                                  detail.errors.percentage ? "is-invalid" : ""
                                }`}
                                value={detail.percentage}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "percentage",
                                    e.target.value
                                  )
                                }
                              />
                              <div className="error-text">
                                {detail.errors.percentage}
                              </div>
                            </div>
                          </div>
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
                      onClick={saveAcademicDetails}
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
