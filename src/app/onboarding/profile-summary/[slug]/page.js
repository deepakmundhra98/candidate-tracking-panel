"use client";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import "@/app/onboarding/onboarding.css";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import BadgeIcon from "@mui/icons-material/Badge";

const Page = ({ params }) => {
  const { slug } = params; // Get slug parameter from the route
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [profileSummary, setProfileSummary] = useState({});
  const [errors, setErrors] = useState({
    identification: "",
  });

  const [isPageActive, setIsPageActive] = useState(false);
  // Ensure academic_details is an array before mapping
  // const academicDetails = Array.isArray(profileSummary.academic_details)
  //   ? profileSummary.academic_details
  //   : JSON.parse(profileSummary.academic_details || "[]");

  const getProfileSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        BaseAPI + `/candidates/profilesummary/${slug}`, // Use the new API endpoint
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);

      if (response.data.status === 200) {
        setProfileSummary(response.data.response); // Set the profile summary from the API response
        setIsPageActive(true);
      } else if (response.data.status === 500) {
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
    getProfileSummary();
  }, []);

  const handleFileChange = (field, file) => {
    setProfileSummary((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const validate = () => {
    let isValid = true;
    let newErrors = {};

    if (
      !profileSummary.identification ||
      profileSummary.identification === null
    ) {
      newErrors.identification = "Supporting document is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const saveProfileSummary = async () => {
    router.push(`/onboarding/preferences/${slug}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfileSummary((prevDetails) => ({
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

  const formattedDate = (dateString) => {};

  return (
    <>
      {isPageActive && (
        <>
          <section className="profile-summary">
            <div className="container">
              <h2>Profile Summary</h2>
              <div className="summaryBody">
                <h3>Personal Details:</h3>
                <div className="first-section">
                  <p>Name:</p>
                  <p>{profileSummary.candidateData.name || "Not available"}</p>
                </div>
                <div className="second-section">
                  <p>Father's Name:</p>
                  <p>
                    {profileSummary.candidateData.fathers_name ||
                      "Not available"}
                  </p>
                </div>
                <div className="third-section">
                  <p>Mother's Name:</p>
                  <p>
                    {profileSummary.candidateData.mothers_name ||
                      "Not available"}
                  </p>
                </div>
                <div className="fourth-section">
                  <p>Email:</p>
                  <p>
                    {profileSummary.candidateData.email_address ||
                      "Not available"}
                  </p>
                </div>
                <div className="fifth-section">
                  <p>Gender:</p>
                  <p>
                    {profileSummary.candidateData.gender === "1"
                      ? "Male"
                      : "Female"}
                  </p>
                </div>
                <div className="sixth-section">
                  <p>Marital Status:</p>
                  <p>
                    {profileSummary.candidateData.marital_status === "1"
                      ? "Married"
                      : "Single"}
                  </p>
                </div>
                <div className="seventh-section">
                  <p>Phone Number:</p>
                  <p>
                    {profileSummary.candidateData.phone_number ||
                      "Not available"}
                  </p>
                </div>
                <div className="eighth-section">
                  <p>Date of Birth:</p>
                  <p>
                    {profileSummary.candidateData.date_of_birth
                      ? (() => {
                          const [year, month, day] =
                            profileSummary.candidateData.date_of_birth.split(
                              "-"
                            );
                          const monthNames = [
                            "January",
                            "February",
                            "March",
                            "April",
                            "May",
                            "June",
                            "July",
                            "August",
                            "September",
                            "October",
                            "November",
                            "December",
                          ];
                          return `${day} ${
                            monthNames[parseInt(month, 10) - 1]
                          }, ${year}`;
                        })()
                      : "Not available"}
                  </p>
                </div>
                <div className="ninth-section">
                  <p>Physically Challenged:</p>
                  <p>
                    {profileSummary.candidateData.physically_challenged === "2"
                      ? "No"
                      : "Yes"}
                  </p>
                </div>
                <div className="tenth-section">
                  <p>Father's Occupation:</p>
                  <p>
                    {profileSummary.candidateData.fathers_occupation ||
                      "Not available"}
                  </p>
                </div>
                <div className="eleventh-section">
                  <p>Mother's Occupation:</p>
                  <p>
                    {profileSummary.candidateData.mothers_occupation ||
                      "Not available"}
                  </p>
                </div>
                <div className="twelfth-section">
                  <p>Current Address:</p>
                  <p>
                    {profileSummary.candidateData.current_address ||
                      "Not available"}
                  </p>
                </div>
                <div className="thirteenth-section">
                  <p>Permanent Address:</p>
                  <p>
                    {profileSummary.candidateData.permanent_address ||
                      "Not available"}
                  </p>
                </div>
              </div>

              <div className="Academics-details">
                <div className="academics-table">
                  <h3>Academics Details</h3>

                  {profileSummary.academicDataArray !== "" ? (
                    profileSummary.academicDataArray.map((academic, index) => (
                      <div key={index} className="academic-entry">
                        <h4>Academic {index + 1}</h4>
                        {/* <div className="academic-subject"> */}
                        <div className="first-section">
                          <p>Course:</p>
                          <p>{academic.course || "Not available"}</p>
                        </div>
                        <div className="first-section">
                          <p>Year:</p>
                          <p>{academic.passing_year || "Not available"}</p>
                        </div>
                        <div className="first-section">
                          <p>School:</p>
                          <p>{academic.school_college || "Not available"}</p>
                        </div>
                        <div className="first-section">
                          <p>University:</p>
                          <p>{academic.university_board || "Not available"}</p>
                        </div>
                        <div className="first-section">
                          <p>Percentage:</p>
                          <p>{academic.percentage || "Not available"}</p>
                        </div>
                        <div className="first-section">
                          <p>Supporting Document:</p>
                          <p>
                            <Link
                              href={academic.documents}
                              style={{
                                textDecoration: "underline",
                                color: "#1976d2",
                              }}
                            >
                              <InsertDriveFileIcon
                                style={{ marginRight: "5px" }}
                              />
                              Document
                            </Link>{" "}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No academic details available.</p>
                  )}
                </div>
              </div>

              <div className="experience-details">
                <div className="academics-table">
                  <h3>Experience Details</h3>
                  {profileSummary.experienceDataArray &&
                  profileSummary.experienceDataArray.length > 0 ? (
                    profileSummary.experienceDataArray.map(
                      (experience, index) => (
                        <div key={index} className="experience-entry">
                          <h4>Experience {index + 1}</h4>
                          <div className="first-section">
                            <p>Organisation Name:</p>
                            <p>
                              {experience.organisation_name || "Not available"}
                            </p>
                          </div>
                          <div className="first-section">
                            <p>Designation:</p>
                            <p>{experience.designation || "Not available"}</p>
                          </div>
                          <div className="first-section">
                            <p>Start Date:</p>
                            <p>
                              {experience.start_date
                                ? experience.start_date
                                    .split("-")
                                    .reverse()
                                    .join("-")
                                : "Not available"}
                            </p>
                          </div>
                          <div className="first-section">
                            <p>End Date:</p>
                            <p>
                              {experience.end_date
                                ? experience.end_date
                                    .split("-")
                                    .reverse()
                                    .join("-")
                                : "Not available"}
                            </p>
                          </div>
                          <div className="first-section">
                            <p>Reason for Leaving:</p>
                            <p>
                              {experience.reason_of_leaving || "Not available"}
                            </p>
                          </div>
                          <div className="first-section">
                            <p>Supporting Document:</p>
                            <p>
                              <Link
                                href={experience.documents}
                                style={{
                                  textDecoration: "underline",
                                  color: "#1976d2",
                                }}
                              >
                                <InsertDriveFileIcon
                                  style={{ marginRight: "5px" }}
                                />
                                Document
                              </Link>{" "}
                            </p>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <p>No experience details available.</p>
                  )}
                </div>
              </div>

              {/* Other documents */}
              <div className="experience-details">
                <div className="academics-table">
                  <h3>Other uploaded documents</h3>
                  {profileSummary.data && (
                    <div className="experience-entry">
                      <h4></h4>

                      <div className="first-section">
                        <p>Identification Proof:</p>
                        <p>
                          <Link
                            href={profileSummary.data.identification}
                            style={{
                              textDecoration: "underline",
                              color: "#1976d2",
                            }}
                          >
                            <BadgeIcon
                              style={{ marginRight: "5px", color: "#1976d2" }}
                            />
                            Identification Document
                          </Link>{" "}
                        </p>
                      </div>
                      <div className="first-section">
                        <p>Other Certificates:</p>
                        <p>
                          {profileSummary.data.certificate != "" ? (
                            <Link
                              href={profileSummary.data.certificate}
                              style={{
                                textDecoration: "underline",
                                color: "#1976d2",
                              }}
                            >
                              <WorkspacePremiumIcon
                                style={{ marginRight: "5px", color: "#1976d2" }}
                              />
                              Certificate Document
                            </Link>
                          ) : (
                            "Not available"
                          )}
                        </p>
                      </div>
                      <div className="first-section">
                        <p>Portfolio Link:</p>
                        <p>
                          <Link
                            href={profileSummary.candidateData.portfolio}
                            style={{
                              textDecoration: "underline",
                              color: "#1976d2",
                            }}
                            target="_blank"
                          >
                            {profileSummary.candidateData.portfolio}
                          </Link>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="btn-next">
                <button
                  onClick={saveProfileSummary}
                  type="submit"
                  className="next-button"
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Page;
