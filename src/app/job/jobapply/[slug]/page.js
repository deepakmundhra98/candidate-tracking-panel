"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Stack,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Autocomplete,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "../../../common.css";
import Footer from "@/app/Components/Footer/Footer";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Modal from "react-bootstrap/Modal";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import Typography from "@mui/material/Typography";
import HTMLReactParser from "html-react-parser";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import { format } from "date-fns";
import ReCAPTCHA from "react-google-recaptcha";

// import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
const Page = ({ params }) => {
  const router = useRouter();
  const today = dayjs();

  const minAllowedDate = today.subtract(18, "year"); // Minimum age of 18 years

  let employer_id = Cookies.get("employer_code");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    dateOfBirth: "",
    gender: "",
    martialStatus: "",
    physicalDisability: "",
    // document: "",
    // profileImage: "",
    cover_letter_title: "",
    cover_letter_description: "",

    educations: [
      {
        qualification_id: "",
        course: "",
        school_college: "",
        city: "",
        university_board: "",
        passing_year: "",
      },
    ],

    experience: [
      {
        organisation_name: "",
        designation: "",
        startDate: "",
        endDate: "",
        reason_of_leaving: "",
      },
    ],

    custom_fields: [],
  });

  const [errors, setErrors] = useState({});
  const [designationData, setDesignationData] = useState([]);
  const [qualificationData, setQualificationData] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [jobDetails, setJobDetails] = useState([]);
  const [coverLetter, setCoverLetter] = useState(true);
  const slug = params.slug;
  const [customFields, setCustomFields] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  let primaryColor = Cookies.get("primaryColor");
  let secondaryColor = Cookies.get("secondaryColor");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const [captchaKey, setCaptchaKey] = useState(""); // State to hold captcha key
  const [constantsData, setConstantsData] = useState();
  const application_form_banner = Cookies.get("application_form_banner");
  const getData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + `/jobs/jobapply/${slug}`,
        {
          employer_id: employer_id,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      setLoading(false);
      setJobDetails(response.data.response.jobDetails);
      setCustomFields(response.data.response.jobDetails.custom_fields);
      setDesignationData(response.data.response.designationList);
      setQualificationData(response.data.response.qualificationList);
      setYearList(response.data.response.yearList);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
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
    getData();
    fetchConstantsData();
  }, []);

  const handleShowModal = () => {
    setSelectedRecord(jobDetails);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  const handleAddEducation = () => {
    const newEducation = {
      qualification_id: "",
      course: "",
      school_college: "",
      city: "",
      university_board: "",
      passing_year: "",
    };

    const updatedEducations = [...formData.educations, newEducation];

    setFormData({
      ...formData,
      educations: updatedEducations,
    });

    setEducationEditingIndex(updatedEducations.length - 1); // Open the newly added form
  };

  const handleAddExperience = (e) => {
    e.preventDefault();
    const newExperience = {
      startDate: "",
      endDate: "",
      reason_of_leaving: "",
      designation: "",
      organisation_name: "",
    };

    const updatedExperience = [...formData.experience, newExperience];
    setFormData({
      ...formData,
      experience: updatedExperience,
    });

    setEditingIndex(updatedExperience.length - 1); // Open the newly added form
  };

  const handleChange = (event, index, isCustomField = false) => {
    const { name, value, type, checked, files } = event.target;

    setFormData((prevFormData) => {
      if (isCustomField) {
        const updatedCustomFields = [...prevFormData.custom_fields];
        updatedCustomFields[index] = {
          ...updatedCustomFields[index],
          label: name, // Ensure label is stored
          value:
            type === "checkbox" ? checked : type === "file" ? files[0] : value,
        };

        return {
          ...prevFormData,
          custom_fields: updatedCustomFields,
        };
      }

      return {
        ...prevFormData,
        [name]: value,
        educations:
          index !== undefined
            ? prevFormData.educations.map((education, i) =>
                i === index ? { ...education, [name]: value } : education
              )
            : prevFormData.educations,
        experience:
          index !== undefined
            ? prevFormData.experience.map((exp, i) =>
                i === index ? { ...exp, [name]: value } : exp
              )
            : prevFormData.experience,
      };
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    if (isCaptchaVerified) {
      errors.captcha = "";
    }
  };

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    setFormData({ ...formData, [type]: file });
  };

  const handleSubmit = async () => {
    try {
      const newErrors = {};
      for (const key in formData) {
        if (
          !formData[key] &&
          key !== "cv" &&
          key !== "profilePicture" &&
          key !== "custom_fields"
        ) {
          newErrors[key] = "This field is required";
        }
      }

      if (!isCaptchaVerified) {
        newErrors.captcha = "Please verify reCaptcha";
      }

      // Validate custom fields
      formData.custom_fields.forEach((field, index) => {
        if (!field.value) {
          newErrors[`custom_fields[${index}]`] = `${field.label} is required`;
        }
      });

      setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
      console.log(errors, "errors");

      if (Object.keys(newErrors).length === 0) {
        if (isCaptchaVerified) {
          const confirmationResult = await Swal.fire({
            title: "Do you want to apply to this Job?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
          });

          if (confirmationResult.isConfirmed) {
            const formDataToSend = new FormData();
            formDataToSend.append("jobId", jobDetails.id);
            formDataToSend.append("employer_id", employer_id);
            formDataToSend.append(
              "process_order_ids",
              jobDetails.process_order_ids
            );

            Object.keys(formData).forEach((key) => {
              if (key === "educations") {
                formData.educations.forEach((education, index) => {
                  Object.entries(education).forEach(([field, value]) => {
                    formDataToSend.append(
                      `educations[${index}][${field}]`,
                      value
                    );
                  });
                });
              } else if (key === "experience") {
                formData.experience.forEach((experience, index) => {
                  Object.entries(experience).forEach(([field, value]) => {
                    formDataToSend.append(
                      `experience[${index}][${field}]`,
                      value
                    );
                  });
                });
              } else if (key === "custom_fields") {
                formData.custom_fields.forEach((field, index) => {
                  formDataToSend.append(
                    `custom_fields[${index}][label]`,
                    field.label
                  );
                  formDataToSend.append(
                    `custom_fields[${index}][value]`,
                    field.value
                  );
                });
              } else {
                formDataToSend.append(key, formData[key]);
              }
            });

            // Append files if they exist
            if (formData.cv) {
              formDataToSend.append("cv", formData.cv);
            }
            if (formData.profilePicture) {
              formDataToSend.append("profilePicture", formData.profilePicture);
            }

            setLoading(true);
            const response = await axios.post(
              `${BaseAPI}/jobs/jobapply/${slug}`,
              formDataToSend
            );
            setLoading(false);

            if (response.data.status === 200) {
              Swal.fire({
                icon: "success",
                title: "Success",
                text: response.data.response,
              }).then(() => {
                router.push("/home/" + employer_id);
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: response.data.message,
              });
            }
          }
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Error submitting form:", error.message);
    }
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dateOfBirth: date });
    setErrors({ ...errors, dateOfBirth: "" }); // Clear the error when the date changes
  };

  const [editingIndex, setEditingIndex] = useState(0);

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSave = () => {
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedExperiences = formData.experience.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, experience: updatedExperiences });
    setEditingIndex(null);
  };

  // education

  const [educationEditingIndex, setEducationEditingIndex] = useState(0);

  const handleEducationEdit = (index) => {
    setEducationEditingIndex(index);
  };

  const handleEducationSave = () => {
    setEducationEditingIndex(null); // Close edit mode after saving
  };

  const handleEducationDelete = (index) => {
    const updatedExperiences = formData.educations.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, educations: updatedExperiences });
    setEducationEditingIndex(null);
  };

  // Cover letter
  const handleCoverLetterSave = () => {
    setCoverLetter(false);
  };

  const [
    coverLetterDescriptionRecommendation,
    setCoverLetterDescriptionRecommendation,
  ] = useState("");

  const [isAiTriggered, setIsAiTriggered] = useState(false);

  const getAiGeneratedCoverLetterDescription = async () => {
    try {
      setIsAiTriggered(true);
      const response = await axios.post(
        BaseAPI + `/get-cover-letter-description`,
        {
          cover_letter_title: formData.cover_letter_title,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      setIsAiTriggered(false);
      setCoverLetterDescriptionRecommendation(response.data.generated_text);
    } catch (error) {
      setIsAiTriggered(false);

      console.log(error.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault(); // Prevent default tab behavior
      setFormData({
        ...formData,
        cover_letter_description: coverLetterDescriptionRecommendation,
      });
    }
  };

  const getExperienceDuration = (start, end) => {
    if (!start || !end) return null;

    const startDate = new Date(start);
    const endDate = new Date(end);

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    let duration = [];
    if (years > 0) duration.push(`${years} Year${years > 1 ? "s" : ""}`);
    if (months > 0) duration.push(`${months} Month${months > 1 ? "s" : ""}`);

    return duration.length > 0 ? duration.join(" ") : "Less than a month";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const options = { day: "2-digit", month: "long", year: "numeric" };

    return date.toLocaleDateString("en-GB", options);
  };

  return (
    <>
      {loading && <div className="loader-container-job-apply"></div>}

      <div className="jobApplyPage">
        <div
          className="pageHead"
          // style={{
          //   textAlign: "center",
          //   padding: "70px 0",
          //   minHeight: "200px", // optional but helpful to ensure div has height
          //   backgroundImage: jobDetails.existing_application_form_banner
          //     && `url(${jobDetails.existing_application_form_banner})`
          //     ,
          //   backgroundSize: "cover",
          //   backgroundPosition: "center",
          //   backgroundRepeat: "no-repeat",
          // }}
        >
          <Image
            src={jobDetails.existing_application_form_banner}
            alt="Banner"
            width={1920}
            height={80}
          />

          <div className="jobApplyPageHeader">
            <p className="jobApplyPageHeading">APPLICATION FORM </p>
            <p className="jobApplyPageSubHeading">
              JOB TITLE : {jobDetails.title?.toUpperCase()}{" "}
            </p>
            <div className="buttons">
              <button
                className="btn btn-outline-light jobDetailButton"
                onClick={handleShowModal}
              >
                See Job Details
              </button>
              <button
                className="btn btn-outline-light backButton"
                onClick={() => router.back()}
              >
                <i className="fa-solid fa-arrow-left mr-2"></i> GO BACK
              </button>
            </div>
          </div>
        </div>
        <section className="lowerSection">
          <div className="container">
            <div className="formSection">
              <div className="formBodyPart1">
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "100%" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <h4 className="formHeading">Personal Details</h4>
                  <div className="row mb-4">
                    <div className="col-md-4 ">
                      <TextField
                        id="standard-basic"
                        label={
                          <Typography component="span">
                            First Name
                            <span style={{ color: "red" }}>*</span>
                          </Typography>
                        }
                        variant="standard"
                        fullWidth
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                      />
                    </div>
                    <div className="col-md-4 ">
                      <TextField
                        id="standard-basic"
                        label={
                          <Typography component="span">
                            Middle Name
                            <span style={{ color: "red" }}>*</span>
                          </Typography>
                        }
                        variant="standard"
                        fullWidth
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleChange}
                        error={!!errors.middleName}
                        helperText={errors.middleName}
                      />
                    </div>
                    <div className="col-md-4">
                      <TextField
                        id="standard-basic"
                        label={
                          <Typography component="span">
                            Last Name
                            <span style={{ color: "red" }}>*</span>
                          </Typography>
                        }
                        variant="standard"
                        fullWidth
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                      />
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-6 ">
                      <TextField
                        id="standard-basic"
                        label={
                          <Typography component="span">
                            Email
                            <span style={{ color: "red" }}>*</span>
                          </Typography>
                        }
                        variant="standard"
                        fullWidth
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                      />
                    </div>
                    <div className="col-md-6">
                      <TextField
                        id="standard-basic"
                        label={
                          <Typography component="span">
                            Contact Number
                            <span style={{ color: "red" }}>*</span>
                          </Typography>
                        }
                        variant="standard"
                        fullWidth
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        error={!!errors.contactNumber}
                        helperText={errors.contactNumber}
                      />
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label={
                            <Typography component="span">
                              Date of Birth
                              <span style={{ color: "red" }}>*</span>
                            </Typography>
                          }
                          value={formData.dateOfBirth}
                          onChange={handleDateChange}
                          maxDate={minAllowedDate} // Maximum allowed date (must be at least 18 years old)
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              error={!!errors.dateOfBirth}
                              helperText={errors.dateOfBirth}
                            />
                          )}
                        />
                      </LocalizationProvider> */}
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label={
                            <Typography component="span">
                              Date of Birth
                              <span style={{ color: "red" }}>*</span>
                            </Typography>
                          }
                          value={formData.dateOfBirth || null} // Set to null if no date is selected
                          onChange={handleDateChange}
                          maxDate={minAllowedDate} // Maximum allowed date (must be at least 18 years old)
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              error={!!errors.dateOfBirth}
                              helperText={errors.dateOfBirth}
                              placeholder="dd/mm/yyyy" // Add a placeholder to indicate the expected format
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </div>
                    <div className="col-md-6">
                      <FormControl
                        variant="standard"
                        sx={{ m: 0, minWidth: 120 }}
                        fullWidth
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Gender<span style={{ color: "red" }}>*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          label={
                            <Typography component="span">
                              Gender
                              <span style={{ color: "red" }}>*</span>
                            </Typography>
                          }
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          error={!!errors.gender}
                          helperText={errors.gender}
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value={1}>Male</MenuItem>
                          <MenuItem value={2}>Female</MenuItem>
                          <MenuItem value={3}>Any Other</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-6 mb-4">
                      <FormControl
                        variant="standard"
                        sx={{ m: 0, minWidth: 120 }}
                        fullWidth
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Martial Status <span style={{ color: "red" }}>*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          label={
                            <Typography component="span">
                              Marital Status
                              <span style={{ color: "red" }}>*</span>
                            </Typography>
                          }
                          name="martialStatus"
                          value={formData.martialStatus}
                          onChange={handleChange}
                          error={!!errors.martialStatus}
                          helperText={errors.martialStatus}
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value={1}>Single</MenuItem>
                          <MenuItem value={2}>Married</MenuItem>
                          <MenuItem value={3}>Divorced</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="col-md-6 mb-4">
                      <FormControl
                        variant="standard"
                        sx={{ m: 0, minWidth: 120 }}
                        fullWidth
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Physical Disability{" "}
                          <span style={{ color: "red" }}>*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          label="Physical Disablity"
                          name="physicalDisability"
                          value={formData.physicalDisability}
                          onChange={handleChange}
                          error={!!errors.physicalDisability}
                          helperText={errors.physicalDisability}
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value={1}>Yes</MenuItem>
                          <MenuItem value={2}>No</MenuItem>
                          <MenuItem value={3}>Not To Say</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-6 mb-4">
                      <input
                        accept=".pdf,.doc,.docx"
                        id="contained-button-cv"
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "cv")}
                      />
                      <label htmlFor="contained-button-cv">
                        <Button variant="contained" component="span">
                          Upload CV
                        </Button>
                      </label>
                      {formData.cv && <p>Selected CV: {formData.cv.name}</p>}
                    </div>
                    <div className="col-md-6">
                      <input
                        accept="image/*"
                        id="contained-button-profile"
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "profilePicture")}
                      />
                      <label htmlFor="contained-button-profile">
                        <Button variant="contained" component="span">
                          Upload Profile Picture
                        </Button>
                      </label>
                      {formData.profilePicture && (
                        <p>
                          Selected Profile Picture:{" "}
                          {formData.profilePicture.name}
                        </p>
                      )}
                    </div>
                  </div>
                </Box>
              </div>
              <div
                className="formBodyPart2 "
                style={{
                  borderRadius: "5px",
                  padding: "20px",
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                }}
              >
                <h4 className="formHeading">Education Details</h4>
                {formData.educations.map((education, index) => (
                  <Box
                    key={index}
                    className="experience-box "
                    p={2}
                    border={0}
                    borderRadius={2}
                    boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 4px;"
                    mb={2}
                    style={{
                      boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px; !important",
                    }}
                  >
                    {educationEditingIndex === index ? (
                      <>
                        <div style={{ marginBottom: "20px" }}>
                          <div className="row">
                            <div className="col-md-6 mb-4">
                              <FormControl
                                variant="standard"
                                sx={{ m: 0, minWidth: 120 }}
                                fullWidth
                              >
                                <InputLabel id={`qualification_id-${index}`}>
                                  Qualification
                                </InputLabel>
                                <Select
                                  labelId={`qualification_id-${index}`}
                                  label="qualifications"
                                  value={education.qualification_id}
                                  onChange={(e) => handleChange(e, index)}
                                  name="qualification_id"
                                >
                                  <MenuItem value="">
                                    <em>Select</em>
                                  </MenuItem>
                                  {qualificationData.map((i) => {
                                    return (
                                      <MenuItem key={i.id} value={i.id}>
                                        <em>{i.qualification_name}</em>
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </div>
                            <div className="col-md-6 mb-4">
                              <TextField
                                id={`course-${index}`}
                                label="Course/subjects"
                                variant="standard"
                                fullWidth
                                name="course"
                                value={education.course}
                                onChange={(e) => handleChange(e, index)}
                                error={!!errors.course}
                                helperText={errors.course}
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6 mb-4">
                              <TextField
                                id={`school_college_city-${index}`}
                                label="School/College"
                                variant="standard"
                                fullWidth
                                name="school_college"
                                value={education.school_college}
                                onChange={(e) => handleChange(e, index)}
                              />
                            </div>
                            <div className="col-md-6 mb-4">
                              <TextField
                                id={`city-${index}`}
                                label="City"
                                variant="standard"
                                fullWidth
                                name="city"
                                value={education.city}
                                onChange={(e) => handleChange(e, index)}
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <TextField
                                id={`university_board-${index}`}
                                label="University/Board"
                                variant="standard"
                                fullWidth
                                name="university_board"
                                value={education.university_board}
                                onChange={(e) => handleChange(e, index)}
                              />
                            </div>
                            <div className="col-md-6">
                              <FormControl
                                variant="standard"
                                sx={{ m: 0, minWidth: 120 }}
                                fullWidth
                              >
                                <InputLabel id={`passing_year-${index}`}>
                                  Year Of Passing
                                </InputLabel>
                                <Select
                                  labelId={`passing_year-${index}`}
                                  label="Year Of Passing"
                                  value={education.passing_year}
                                  onChange={(e) => handleChange(e, index)}
                                  name="passing_year"
                                >
                                  <MenuItem value="">
                                    <em>Select</em>
                                  </MenuItem>
                                  {Object.entries(yearList).map(
                                    ([key, value]) => {
                                      return (
                                        <MenuItem key={key} value={value}>
                                          <em>{value}</em>
                                        </MenuItem>
                                      );
                                    }
                                  )}
                                </Select>
                              </FormControl>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="contained"
                          onClick={handleEducationSave}
                          className="saveButton"
                        >
                          Save
                        </Button>
                      </>
                    ) : (
                      <div className="experience-summary lg:flex justify-content-between align-items-center gap-2">
                        {(education.qualification_id ||
                          education.course ||
                          education.school_college ||
                          education.city ||
                          education.university_board ||
                          education.passing_year) && (
                          // <div style={{ width: "-webkit-fill-available" }}>
                          //   <div className="row">
                          //     <div
                          //       className="col-md-6"
                          //       style={{
                          //         display: "grid",
                          //         gridTemplateColumns: "1fr 1fr",
                          //         gap: "20px",
                          //         padding: "10px",
                          //       }}
                          //     >
                          //       {education.qualification_id && (
                          //         <>
                          //           <strong>Qualification:</strong>{" "}
                          //           <span>
                          //             {qualificationData.find(
                          //               (i) =>
                          //                 i.id === education.qualification_id
                          //             )?.qualification_name || "N/A"}
                          //           </span>
                          //         </>
                          //       )}
                          //       {education.course && (
                          //         <>
                          //           <strong>Course:</strong>{" "}
                          //           <span>{education.course}</span>
                          //         </>
                          //       )}
                          //       {education.school_college && (
                          //         <>
                          //           <strong>School/College:</strong>{" "}
                          //           <span className="break-all">
                          //             {education.school_college}
                          //           </span>
                          //         </>
                          //       )}
                          //     </div>
                          //     <div
                          //       className="col-md-6"
                          //       style={{
                          //         display: "grid",
                          //         gridTemplateColumns: "1fr 1fr",
                          //         gap: "20px",
                          //         padding: "10px",
                          //       }}
                          //     >
                          //       {education.city && (
                          //         <>
                          //           <strong>City:</strong>{" "}
                          //           <span>{education.city}</span>
                          //         </>
                          //       )}
                          //       {education.university_board && (
                          //         <>
                          //           <strong>University/Board:</strong>{" "}
                          //           <span className="break-all">
                          //             {education.university_board}
                          //           </span>
                          //         </>
                          //       )}
                          //       {education.passing_year && (
                          //         <>
                          //           <strong>Passing Year:</strong>{" "}
                          //           <span>{education.passing_year}</span>
                          //         </>
                          //       )}
                          //     </div>
                          //   </div>
                          // </div>
                          <div
                            className="text-muted"
                            style={{ padding: "10px" }}
                          >
                            {education.qualification_id && (
                              <>
                                {/* <strong>Qualification:</strong>{" "} */}
                                {qualificationData.find(
                                  (i) => i.id === education.qualification_id
                                )?.qualification_name || "N/A"}
                                {" | "}
                              </>
                            )}
                            {education.course && (
                              <>
                                <strong>Course:</strong> {education.course}
                                {" | "}
                              </>
                            )}
                            {education.school_college && (
                              <>
                                <strong>School/College:</strong>{" "}
                                {education.school_college}
                                {" | "}
                              </>
                            )}
                            {education.city && (
                              <>
                                <strong>City:</strong> {education.city}
                                {" | "}
                              </>
                            )}
                            {education.university_board && (
                              <>
                                <strong>University/Board:</strong>{" "}
                                {education.university_board}
                                {" | "}
                              </>
                            )}
                            {education.passing_year && (
                              <>
                                {/* <strong>Passing Year:</strong>{" "} */}
                                {education.passing_year}
                              </>
                            )}
                          </div>
                        )}

                        <div className="ActionsButton">
                          <Button
                            className="float-right rounded-xl"
                            variant="outlined"
                            onClick={() => handleEducationEdit(index)}
                          >
                            <EditIcon />
                          </Button>
                          {formData.educations.length > 1 && (
                            <Button
                              className="float-right rounded-xl"
                              variant="outlined"
                              onClick={() => handleEducationDelete(index)}
                              sx={{ marginRight: "10px" }}
                            >
                              <DeleteIcon />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </Box>
                ))}
                <div className="addMore">
                  <button
                    href=""
                    className="addMoreButton"
                    onClick={handleAddEducation}
                    style={{ padding: "2px 11px" }}
                  >
                    <AddCircleOutlineIcon style={{ color: "#0096ff" }} /> Add
                    More Education Details
                  </button>
                </div>
              </div>
              <div
                className="formBodyPart3"
                style={{
                  borderRadius: "5px",
                  padding: "20px",
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                }}
              >
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "100%" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <h4 className="formHeading">Experience Details</h4>

                  {/* new code  */}
                  {formData.experience.map((experience, index) => (
                    <Box
                      key={index}
                      className="experience-box "
                      p={2}
                      border={0}
                      borderRadius={2}
                      boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 4px;"
                      mb={2}
                      style={{
                        boxShadow:
                          "rgba(0, 0, 0, 0.16) 0px 1px 4px; !important",
                      }}
                    >
                      {editingIndex === index ? (
                        <>
                          <div style={{ marginBottom: "20px" }}>
                            <div className="row">
                              <div className="col-md-6 mb-4">
                                <label>Date From</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  name="startDate"
                                  value={experience.startDate}
                                  onChange={(e) => handleChange(e, index)}
                                ></input>
                              </div>
                              <div className="col-md-6 mb-4">
                                <label>Date To</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  name="endDate"
                                  value={experience.endDate}
                                  onChange={(e) => handleChange(e, index)}
                                ></input>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6 mb-4">
                                <TextField
                                  id={`organisation_name-${index}`}
                                  label="Name of organisation"
                                  variant="standard"
                                  fullWidth
                                  name="organisation_name"
                                  value={experience.organisation_name}
                                  onChange={(e) => handleChange(e, index)}
                                  error={!!errors.organisation_name}
                                  helperText={errors.organisation_name}
                                />
                              </div>
                              <div className="col-md-6 mb-4">
                                <Autocomplete
                                  freeSolo
                                  options={designationData.map(
                                    (i) => i.skill_name
                                  )}
                                  value={experience.designation || ""}
                                  onChange={(e, newValue) => {
                                    const syntheticEvent = {
                                      target: {
                                        name: "designation",
                                        value: newValue,
                                      },
                                    };
                                    handleChange(syntheticEvent, index);
                                  }}
                                  onInputChange={(e, newValue) => {
                                    const syntheticEvent = {
                                      target: {
                                        name: "designation",
                                        value: newValue,
                                      },
                                    };
                                    handleChange(syntheticEvent, index);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="standard"
                                      label="Designation"
                                      fullWidth
                                    />
                                  )}
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-12 ">
                                <TextField
                                  id={`reason_of_leaving-${index}`}
                                  label="Reason of leaving"
                                  variant="standard"
                                  multiline
                                  fullWidth
                                  name="reason_of_leaving"
                                  value={experience.reason_of_leaving}
                                  onChange={(e) => handleChange(e, index)}
                                  error={!!errors.reason_of_leaving}
                                  helperText={errors.reason_of_leaving}
                                />
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="contained"
                            onClick={handleSave}
                            className="saveButton"
                          >
                            Save
                          </Button>
                        </>
                      ) : (
                        <div className="experience-summary lg:flex justify-content-between align-items-center gap-2">
                          {(experience.startDate ||
                            experience.endDate ||
                            experience.organisation_name ||
                            experience.designation ||
                            experience.reason_of_leaving) && (
                            <div style={{ width: "-webkit-fill-available" }}>
                              {/* <div className="row">
                                <div
                                  className="col-md-6"
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "20px",
                                    padding: "10px",
                                  }}
                                >
                                  {experience.startDate && (
                                    <>
                                      <strong>Start Date:</strong>{" "}
                                      <span>
                                        {format(
                                          new Date(experience.startDate),
                                          "dd-MM-yyyy"
                                        )}
                                      </span>
                                    </>
                                  )}
                                  {experience.endDate && (
                                    <>
                                      <strong>End Date:</strong>{" "}
                                      <span>
                                        {format(
                                          new Date(experience.endDate),
                                          "dd-MM-yyyy"
                                        )}
                                      </span>
                                    </>
                                  )}
                                  {experience.organisation_name && (
                                    <>
                                      <strong>Organisation Name:</strong>{" "}
                                      <span>
                                        {experience.organisation_name}
                                      </span>
                                    </>
                                  )}
                                </div>
                                <div
                                  className="col-md-6"
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "20px",
                                    padding: "10px",
                                  }}
                                >
                                  {experience.designation && (
                                    <>
                                      <strong>Designation:</strong>{" "}
                                      <span>{experience.designation}</span>
                                    </>
                                  )}
                                  {experience.reason_of_leaving && (
                                    <>
                                      <strong>Reason of leaving:</strong>{" "}
                                      <span>
                                        {experience.reason_of_leaving}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div> */}
                              <div
                                className="text-muted"
                                style={{ padding: "10px" }}
                              >
                                {/* {experience.startDate && (
  <>
    <strong>From:</strong> {experience.startDate} {" | "}
  </>
)}
{experience.endDate && (
  <>
    <strong>To:</strong> {experience.endDate} {" | "}
  </>
)} */}
                                {experience.designation && (
                                  <>
                                    <strong>{experience.designation}</strong>
                                    {", "}
                                    {experience.organisation_name}
                                    {experience.startDate &&
                                      experience.endDate && (
                                        <>
                                          {" "}
                                          (
                                          {getExperienceDuration(
                                            experience.startDate,
                                            experience.endDate
                                          )}
                                          )
                                        </>
                                      )}
                                    {/* {" | "} */}{" "}
                                    {formatDate(experience.startDate)} To{" "}
                                    {formatDate(experience.endDate)}
                                    {/* {" | "} */}
                                  </>
                                )}

                                {/* {experience.organisation_name && (
    <>
      <strong>Organisation:</strong> {experience.organisation_name} {" | "}
    </>
  )} */}
                                <br />

                                {experience.reason_of_leaving && (
                                  <>
                                    <strong>Reason of Leaving:</strong>{" "}
                                    {experience.reason_of_leaving}
                                  </>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="ActionsButton">
                            <Button
                              className="float-right rounded-xl"
                              variant="outlined"
                              onClick={() => handleEdit(index)}
                            >
                              <EditIcon />
                            </Button>
                            {formData.experience.length > 1 && (
                              <Button
                                className="float-right rounded-xl"
                                variant="outlined"
                                onClick={() => handleDelete(index)}
                                sx={{ marginRight: "10px" }}
                              >
                                <DeleteIcon />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </Box>
                  ))}
                  <div className="addMore">
                    {" "}
                    <button
                      href=""
                      className="addMoreButton"
                      onClick={handleAddExperience}
                      style={{ padding: "2px 11px" }}
                    >
                      <AddCircleOutlineIcon style={{ color: "#0096ff" }} /> Add
                      More Experience Details
                    </button>
                  </div>
                </Box>

                <Modal show={showModal} onHide={handleCloseModal}>
                  <Modal.Header
                    closeButton
                    className=""
                    style={{
                      backgroundColor: primaryColor,
                      color: secondaryColor,
                    }}
                  >
                    <Modal.Title>
                      Job Details of {selectedRecord?.title}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {selectedRecord && (
                      <div>
                        <div className="dDrt">
                          <span>Job Title: </span>
                          {selectedRecord && selectedRecord.title}
                        </div>
                        <div className="dDrt">
                          <span>Category: </span>
                          {selectedRecord.category_name
                            ? selectedRecord.category_name
                            : "N/A"}
                        </div>
                        <div className="dDrt">
                          <span>Industry: </span>
                          {selectedRecord && selectedRecord.industry_name}
                        </div>
                        <div className="dDrt">
                          <span>Work Type :</span>
                          {selectedRecord && selectedRecord.work_type_name}
                        </div>
                        <div className="dDrt">
                          <span>Experience : </span>
                          {selectedRecord && selectedRecord.min_exp} -{" "}
                          {selectedRecord.max_exp} Years
                        </div>
                        <div className="dDrt">
                          <span>Qualification : </span>
                          {selectedRecord && selectedRecord.qualification_name
                            ? selectedRecord.qualification_name
                            : "N/A"}
                        </div>
                        <div className="dDrt">
                          <span>Annual Salary : </span>
                          {selectedRecord.min_salary} -{" "}
                          {selectedRecord.max_salary}
                        </div>
                        <div className="dDrt">
                          <span>Skills : </span>
                          {selectedRecord.skill_name}
                        </div>
                        <div className="dDrt">
                          <span>Designation : </span>
                          {selectedRecord.designation}
                        </div>
                        <div className="dDrt">
                          <span>Location : </span>
                          {selectedRecord.location}
                        </div>
                        <div className="dDrt">
                          <span>Job Description : </span>
                          {selectedRecord.description
                            ? HTMLReactParser(selectedRecord.description)
                            : "N/A"}
                        </div>
                      </div>
                    )}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
              {/* Cover letter */}
              <div className="formBodyPart4">
                <Box
                  className="experience-box "
                  p={2}
                  border={0}
                  borderRadius={2}
                  boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
                  mb={2}
                  style={{
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px !important",
                    marginBottom: "20px",
                  }}
                >
                  <h4 className="formHeading">Cover Letter</h4>

                  {coverLetter ? (
                    <Box
                      className="experience-box "
                      p={2}
                      border={0}
                      borderRadius={2}
                      boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 4px;"
                      mb={2}
                      style={{
                        boxShadow:
                          "rgba(0, 0, 0, 0.16) 0px 1px 4px; !important",
                      }}
                    >
                      <>
                        <div style={{ marginBottom: "20px" }}>
                          <div className="row">
                            <div className="col-md-6 mb-4">
                              <TextField
                                id={`cover_letter_title`}
                                label="Cover Letter Title"
                                variant="standard"
                                fullWidth
                                name="cover_letter_title"
                                value={formData.cover_letter_title}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div
                            className="coverletterDescription"
                            style={{ position: "relative" }}
                          >
                            {isAiTriggered && (
                              <Image
                                src="/Images/adminSide/magicstick.gif"
                                alt="Cover Letter"
                                className="magicImageJobApply"
                                width={20}
                                height={20}
                                style={{
                                  position: "absolute",
                                  top: "22px",
                                  right: "6px",
                                }}
                              />
                            )}

                            <div className="row">
                              <div className="col-md-12 ">
                                <TextField
                                  id={`cover_letter_description`}
                                  label="Cover Letter Description"
                                  placeholder={
                                    coverLetterDescriptionRecommendation ||
                                    "Cover Letter Description"
                                  }
                                  variant="standard"
                                  multiline
                                  fullWidth
                                  name="cover_letter_description"
                                  value={formData.cover_letter_description}
                                  onChange={handleChange}
                                  onFocus={getAiGeneratedCoverLetterDescription} // Call function on click
                                  onKeyDown={handleKeyDown}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="contained"
                          onClick={() => handleCoverLetterSave()}
                          className="saveButton"
                        >
                          Save
                        </Button>
                      </>
                    </Box>
                  ) : (
                    <>
                      <div
                        className="experience-summary lg:flex justify-content-between align-items-center gap-2"
                        style={{
                          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                          padding: "18px",
                          borderRadius: "8px",
                          marginBottom: "20px",
                        }}
                      >
                        {(formData.cover_letter_title ||
                          formData.cover_letter_description) && (
                          <div>
                            <div className="row">
                              <div
                                className="col-md-10"
                                style={{
                                  display: "inline-grid",
                                  // gridTemplateColumns: "1fr 1fr",
                                  gap: "10px",
                                  padding: "10px",
                                }}
                              >
                                {formData.cover_letter_title && (
                                  <>
                                    <strong>Cover Letter Title:</strong>{" "}
                                    <span>{formData.cover_letter_title}</span>
                                  </>
                                )}
                                {formData.cover_letter_description && (
                                  <>
                                    <strong>Cover Letter Description:</strong>{" "}
                                    <span>
                                      {formData.cover_letter_description}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="ActionsButton">
                          <Button
                            className="float-right rounded-xl"
                            variant="outlined"
                            onClick={() => setCoverLetter(!coverLetter)}
                          >
                            <EditIcon />
                          </Button>
                          {formData.experience.length > 1 && (
                            <Button
                              className="float-right rounded-xl"
                              variant="outlined"
                              onClick={() => handleDelete(index)}
                              sx={{ marginRight: "10px" }}
                            >
                              <DeleteIcon />
                            </Button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </Box>
              </div>

              {/* Custom Section */}
              {jobDetails?.custom_fields?.length > 0 && (
                <div className="formBodyPart4">
                  <Box
                    className="experience-box "
                    p={2}
                    border={0}
                    borderRadius={2}
                    boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
                    mb={2}
                    style={{
                      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px !important",
                      marginBottom: "20px",
                    }}
                  >
                    <h4 className="formHeading">Additional Details</h4>

                    <Box
                      className="experience-box "
                      p={2}
                      border={0}
                      borderRadius={2}
                      boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 4px;"
                      mb={2}
                      style={{
                        boxShadow:
                          "rgba(0, 0, 0, 0.16) 0px 1px 4px; !important",
                      }}
                    >
                      <>
                        {customFields.map((field, index) => (
                          <div key={index} style={{ marginBottom: "20px" }}>
                            <div className="row">
                              <div className="col-md-6 mb-4">
                                {field.value_type === "input" && (
                                  <TextField
                                    id={field.label}
                                    label={field.label}
                                    variant="standard"
                                    fullWidth
                                    name={field.label}
                                    value={
                                      formData.custom_fields[index]?.value || ""
                                    }
                                    onChange={(e) =>
                                      handleChange(e, index, true)
                                    }
                                  />
                                )}

                                {field.value_type === "select-box" && (
                                  <select
                                    className="form-select"
                                    name={field.label}
                                    value={
                                      formData.custom_fields[index]?.value || ""
                                    }
                                    onChange={(e) =>
                                      handleChange(e, index, true)
                                    }
                                  >
                                    <option value="">
                                      Select {field.label}
                                    </option>
                                    {field.options?.map((option, i) => (
                                      <option key={i} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                )}

                                {field.value_type === "check-box" && (
                                  <input
                                    type="checkbox"
                                    name={field.label}
                                    checked={
                                      formData.custom_fields[index]?.value ||
                                      false
                                    }
                                    onChange={(e) =>
                                      handleChange(e, index, true)
                                    }
                                  />
                                )}

                                {field.value_type === "date" && (
                                  <input
                                    type="date"
                                    className="form-control"
                                    name={field.label}
                                    value={
                                      formData.custom_fields[index]?.value || ""
                                    }
                                    onChange={(e) =>
                                      handleChange(e, index, true)
                                    }
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    </Box>
                  </Box>
                </div>
              )}

              <Divider variant="middle" component="" />
              <div className="pt-3">
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

              <div className="applyPageActionButton">
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    className="submitButton"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                  <Button
                    onClick={() => window.history.back()}
                    variant="contained"
                    className="cancelButton"
                  >
                    Cancel
                  </Button>
                </Stack>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Page;
