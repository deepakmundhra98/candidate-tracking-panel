"use client";
import React, { useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import "../../../../common.css";
import AdminFooter from "../../../../admin/Components/AdminFooter/AdminFooter";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import Cookies from "js-cookie";
import Select from "react-select";
import StaffLayout from "../../../StaffLayout";
import { useRouter } from "next/navigation";
import RecruitmentProcessComponent from "../../../../admin/Components/Elements/RecruitmentProcessComponent";

const Page = ({ params }) => {
  const [userData, setUserData] = useState([]);

  const [errors, setErrors] = useState({
    job_title: "",
    category: "",
    job_description: "",
    industry: "",
    work_type: "",
    location: "",
    experience: "",
    qualiofication: "",
    annual_salary: "",
    skill: "",
    designation: "",
    process: "",

  });

  const [categoryData, setCategoryData] = useState([]);
  const [industryData, setIndustryData] = useState([]);
  const [worktypeData, setWorktypeData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  const [qualificationData, setQualificationData] = useState([]);
  const [annualsalaryData, setAnnualsalaryData] = useState([]);
  const [skillData, setSkillData] = useState([]);
  const [designationData, setDesignationData] = useState([]);
  const [processData, setProcessData] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProcess, setSelectedProcess] = useState([]);

  const token = Cookies.get("tokenStaff");
  const router = useRouter();
  const jobDetailsRef = useRef(null);
  const requirementsRef = useRef(null);
  const customSectionRef = useRef(null);

  const handleJobDetailsClick = () => {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRequirementsClick = () => {
    // Scroll to the Requirements and Salary section
    requirementsRef.current.scrollIntoView({ behavior: "smooth" });
  };



  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setUserData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));

  //   setErrors((prev) => ({
  //     ...prev,
  //     [name]: "",
  //   }));
  // };

  const handleChange = (event, mainIndex = null) => {
    const { name, value } = event.target;
  
    // If changing a normal userData field (not a custom section)
    if (mainIndex === null) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        [name]: value, // Update the field dynamically
      }));
    } 
    // If changing a custom section field
    else {
      const updatedSections = [...userData.custom_section];
  
      updatedSections[mainIndex] = {
        ...updatedSections[mainIndex],
        [name]: value,
      };
  
      // Handle option-based types separately
      if (
        name === "value_type" &&
        ["select-box", "check-box", "radio"].includes(value)
      ) {
        if (!updatedSections[mainIndex].options) {
          updatedSections[mainIndex].options = [""];
        }
      } else if (name === "value_type") {
        updatedSections[mainIndex].options = [];
      }
  
      setUserData((prevUserData) => ({
        ...prevUserData,
        custom_section: updatedSections,
      }));
    }
  
    // Reset validation errors for the field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const getData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + `/admin/jobs/user/edit/${params.slug}`,
        null,
        {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setLoading(false);
      setUserData(response.data.response.jobs_details);
      setCategoryData(response.data.response.category);
      setIndustryData(response.data.response.industry);
      setWorktypeData(response.data.response.worktype);
      setExperienceData(response.data.response.experience);
      setQualificationData(response.data.response.qualification);
      setAnnualsalaryData(response.data.response.annual_salary);
      setSkillData(response.data.response.skill);
      setDesignationData(response.data.response.designation);
      setProcessData(response.data.response.process_list);

      // code to handel preselected skills
      var skillList = response.data.response.skill;
      var skillIds = response.data.response.jobs_details.skill;
      var selectedSkillsName = skillIds.split(",").map((item) => item.trim());
      var SelectSkills = [];

      skillList.forEach((element) => {
        for (let i = 0; i < selectedSkillsName.length; i++) {
          if (parseInt(selectedSkillsName[i]) == element.id) {
            let obj = {
              value: element.id,
              label: element.skill_name,
            };
            SelectSkills.push(obj);
          }
        }
      });

      setSelectedSkills(SelectSkills);

      // code to handle pre-selected process
      var processList = response.data.response.process_list;
      var processIds = response.data.response.jobs_details.process_order_ids;
      var selectedProcessId = processIds.split(",").map((item) => item.trim());
      var SelectProcess = [];

      processList.forEach((element) => {
        for (let i = 0; i < selectedProcessId.length; i++) {
          if (parseInt(selectedProcessId[i]) == element.id) {
            let obj = {
              value: element.id,
              label: element.process_name,
            };
            SelectProcess.push(obj);
          }
        }
      });

      setSelectedProcess(SelectProcess);
      setUserData({
        ...response.data.response.jobs_details,
        custom_section: response.data.response.job_details.custom_section || [],
      });
      // console.log(userData,"yha")
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const [skillValidationError, setSkillValidationError] = useState("");

  const handleSkillChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions); // Update selected skills
  };

  const [orderedProcessIds, setOrderedProcessIds] = useState([]);

  const handleProcessChange = (selectedOptions) => {
    setSelectedProcess(selectedOptions);
    setOrderedProcessIds(
      selectedOptions ? selectedOptions.map((item) => item.value) : []
    );
    fetchProcessOrderDetails();

    setErrors((prev) => ({
      ...prev,
      process: "",
    }))
  };

  const handleOrderChange = (newOrder) => {
    setOrderedProcessIds(newOrder); // Update the order of IDs in the parent state
    console.log("Updated Order of Process IDs:", newOrder);
    // Additional actions like an API call can be made here if needed
  };

  const fetchProcessOrderDetails = () => {
    console.log("Ordered Process IDs:", orderedProcessIds);
    // Implement API call or any other action here using orderedProcessIds
  };

  const handleClick = async (e) => {
    var skills = document.getElementsByName("skill");
    var skillArray = [];

    skills.forEach((element) => {
      skillData.forEach((skill) => {
        if (skill.id == element.value) {
          skillArray.push(skill.id);
        }
      });
    });

    var process = document.getElementsByName("process");
    var processArray = [];

    process.forEach((element) => {
      processData.forEach((i) => {
        if (i.id == element.value) {
          processArray.push(i.id);
        }
      });
    });
    e.preventDefault();
    try {
      const newErrors = {};

      if (userData.job_title === "") {
        newErrors.job_title = "Job Title is required";
      }
      if (userData.category === "") {
        newErrors.category = "Category is required";
      }
      if (userData.job_description === "") {
        newErrors.job_description = "Job Description is required";
      }
      if (userData.industry === "") {
        newErrors.industry = "Industry name is required";
      }
      if (userData.work_type === "") {
        newErrors.work_type = "Work type is required";
      }
      if (userData.location === "") {
        newErrors.location = "Location is required";
      }
      if (userData.experience === "") {
        newErrors.experience = "Experience is required";
      }
      if (userData.annual_salary === "") {
        newErrors.annual_salary = "Annual salary is required";
      }
      if (userData.qualification === '') {
        newErrors.qualification = 'Qualification is required'
      }
      if (userData.designation === "") {
        newErrors.designation = "Designation is required";
      }
      if(selectedProcess.length === 0){
        newErrors.process = "Process is required";
      }

      // console.log("here");
      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Update Job?",
          text: "Do you want to update this job?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);

          const updatedData = {
            ...userData,
            process_order_ids: orderedProcessIds,
            skill: skillArray.join(","),
            process_order_ids: processArray.join(","),
          };

          const response = await axios.post(
            BaseAPI + `/admin/jobs/user/edit/${params.slug}`,
            updatedData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer" + " " + token,
              },
            }
          );
          setLoading(false);
          if (response.data.status === 200) {
            Swal.fire({
              title: "Job updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            }).then(() =>{
              router.push("/staff/jobs");

            });
          } else if (response.data.status === 500) {
            Swal.fire({
              title: response.data.message,
              icon: "error",
              confirmButtonText: "Close",
            });
          } else {
            Swal.fire({
              title: response.data.message,
              icon: "error",
              confirmButtonText: "Close",
            });
          }
        }
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not update job. Please try after some time.",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };


  const handleCustomSectionClick = () => {
    // Scroll to the Requirements and Salary section
    customSectionRef.current.scrollIntoView({ behavior: "smooth" });
  
    setUserData((prev) => ({
      ...prev,
      custom_section: [
        ...(prev.custom_section || []), // ensure it's an array
        {
          label: "",
          value_type: "",
          options: [],
        },
      ],
    }));
  };
  

  const handleRemove = (index) => {
    const updatedData = [...userData.custom_section]; // Copy the array
    updatedData.splice(index, 1); // Remove the item at index
  
    setUserData({
      ...userData,
      custom_section: updatedData, // Correctly update state
    });
  };
  

  const addOption = (mainIndex) => {
    const updatedSections = [...userData.custom_section];
    updatedSections[mainIndex].options.push(""); // Add new empty option

    setUserData({
      ...userData,
      custom_section: updatedSections,
    });
  };

  const removeOption = (mainIndex) => {
    const updatedSections = [...userData.custom_section];

    if (updatedSections[mainIndex].options.length > 1) {
      updatedSections[mainIndex].options.pop(); // Remove last option
      setUserData({
        ...userData,
        custom_section: updatedSections,
      });
    }
  };

  const handleOptionChange = (event, mainIndex, optionIndex) => {
    const updatedSections = [...userData.custom_section];
    updatedSections[mainIndex].options[optionIndex] = event.target.value; // Update option value

    setUserData({
      ...userData,
      custom_section: updatedSections,
    });
  };

  return (
    <>
      <StaffLayout>
        {loading && <div className="loader-container"></div>}
        <div className="adminChangeUsername" style={{ minHeight: "80vh" }}>
          <div className="breadCumb1" role="">
            <div className="flex gap-3 items-center">
              <Link underline="hover" color="inherit" href="/staff/dashboard">
                <div className="flex gap-2 items-center">
                  <i className="fa-solid fa-gauge "></i>
                  <span>
                    Dashboard <i class="fa-solid fa-angles-right text-xs"></i>
                  </span>
                </div>
              </Link>
              <Link underline="hover" color="inherit" href="/staff/jobs">
                <div className="flex gap-2 items-center">
                <i className="fa fa-list-alt"></i>
                  <span>
                    Jobs <i class="fa-solid fa-angles-right text-xs"></i>
                  </span>
                </div>
              </Link>
              <div className="flex gap-2 items-center  ">
                <i class="fa fa-edit"></i>
                <span>Edit Job</span>
              </div>
            </div>
          </div>

          <div className="JobPost">
            <h2>Edit Job</h2>
            <div className="row addJobBodyParts">
              

              <div className="col-md-9 addJobRightSection  px-3 py-3">
                <form>
                  <div className="bg-white py-3 px-3 rounded-md ">
                    <div className="rightSectionHeading border-b-2  py-2 text-xl text-dark" ref={jobDetailsRef}>
                      Job Details
                    </div>
                    <div class="mb-3 mt-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Job Title<span className="Manadorty">*</span>
                      </label>
                      <input
                        type="email"
                        class="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder="Job Title"
                        name="job_title"
                        value={userData.job_title}
                        onChange={handleChange}
                      />
                      {errors.job_title && (
                        <div className="text-danger">{errors.job_title}</div>
                      )}
                    </div>
                    <label for="exampleInputEmail1" class="form-label">
                      Select Category<span className="Manadorty">*</span>
                    </label>
                    <select
                      class="form-select"
                      aria-label="Default select example"
                      onChange={handleChange}
                      name="category"
                      value={userData.category}
                    >
                      <option selected value="">
                        Any Category
                      </option>
                      {categoryData &&
                        categoryData.map((i) => {
                          return (
                            <option key={i.id} value={i.id}>
                              {i.category_name}
                            </option>
                          );
                        })}
                    </select>
                    {errors.category && (
                      <div className="text-danger">{errors.category}</div>
                    )}
                    <div class="mb-3 mt-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Job Description<span className="Manadorty">*</span>
                      </label>
                      <textarea
                        type="email"
                        class="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        rows="7"
                        placeholder="Job Description"
                        value={userData.job_description}
                        onChange={handleChange}
                        name="job_description"
                      />
                      {errors.job_description && (
                        <div className="text-danger">
                          {errors.job_description}
                        </div>
                      )}
                    </div>
                    <div class="mb-3 mt-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Industry
                      </label>
                      <select
                        class="form-select"
                        aria-label="Default select example"
                        name="industry"
                        value={userData.industry}
                        onChange={handleChange}
                      >
                        <option selected value="">
                          Select
                        </option>
                        {industryData &&
                          industryData.map((i) => {
                            return (
                              <option key={i.id} value={i.id}>
                                {i.industry_name}
                              </option>
                            );
                          })}
                      </select>
                      {errors.industry_name && (
                        <div className="text-danger">
                          {errors.industry_name}
                        </div>
                      )}
                    </div>
                    <div class="mb-3 mt-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Work Type<span className="Manadorty">*</span>
                      </label>
                      <select
                        class="form-select"
                        aria-label="Default select example"
                        name="work_type"
                        value={userData.work_type}
                        onChange={handleChange}
                      >
                        <option selected value="">
                          Select
                        </option>
                        {Object.entries(worktypeData).map(([key, value]) => {
                          return (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          );
                        })}
                      </select>
                      {errors.work_type && (
                        <div className="text-danger">{errors.work_type}</div>
                      )}
                    </div>
                    <div class="mb-3 mt-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Location<span className="Manadorty">*</span>
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder="Location"
                        name="location"
                        value={userData.location}
                        onChange={handleChange}
                      />
                      {errors.location && (
                        <div className="text-danger">{errors.location}</div>
                      )}
                    </div>
                  </div>
                  <div className="bg-white py-3 px-3 my-4 rounded-md ">
                    <div className="rightSectionHeading border-b-2  py-2 text-xl text-dark" ref={requirementsRef}>
                      Requirements and Salary Details
                    </div>
                    <div class="mb-3 mt-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Experience<span className="Manadorty">*</span>
                      </label>
                      <select
                        class="form-select"
                        aria-label="Default select example"
                        name="experience"
                        value={userData.experience}
                        onChange={handleChange}
                      >
                        <option selected value="">
                          Select
                        </option>
                        {Object.entries(experienceData).map(([key, value]) => {
                          return (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          );
                        })}
                      </select>
                      {errors.experience && (
                        <div className="text-danger">{errors.experience}</div>
                      )}
                    </div>
                    <label for="exampleInputEmail1" class="form-label">
                      Qualifiacation<span className="Manadorty">*</span>
                    </label>
                    <select
                      class="form-select"
                      aria-label="Default select example"
                      name="qualification"
                      value={userData.qualification}
                      onChange={handleChange}
                    >
                      <option selected value="">
                        Select
                      </option>
                      {qualificationData &&
                        qualificationData.map((i) => {
                          return (
                            <option key={i.id} value={i.id}>
                              {i.qualification_name}
                            </option>
                          );
                        })}
                    </select>
                    {errors.qualification && (
                      <div className="text-danger">{errors.qualification}</div>
                    )}

                    <div class="mb-3 mt-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Annual Salary<span className="Manadorty">*</span>
                      </label>
                      <select
                        class="form-select"
                        aria-label="Default select example"
                        name="annual_salary"
                        value={userData.annual_salary}
                        onChange={handleChange}
                      >
                        <option selected value="">
                          Select
                        </option>
                        {Object.entries(annualsalaryData).map(
                          ([key, value]) => {
                            return (
                              <option key={key} value={key}>
                                {value}
                              </option>
                            );
                          }
                        )}
                      </select>
                      {errors.annual_salary && (
                        <div className="text-danger">
                          {errors.annual_salary}
                        </div>
                      )}
                    </div>
                    <div class="mb-3 mt-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Skills
                      </label>
                      <Select
                        defaultValue={selectedSkills}
                        isMulti
                        isSearchable
                        name="skill"
                        options={skillData.map((i) => ({
                          value: i.id,
                          label: i.skill_name,
                        }))}
                        className="basic-multi-select"
                        value={selectedSkills}
                        classNamePrefix="Select Skills"
                        onChange={handleSkillChange}
                      />
                    </div>
                    <div class="mb-3 mt-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Designation<span className="Manadorty">*</span>
                      </label>
                      <select
                        class="form-select"
                        aria-label="Default select example"
                        name="designation"
                        value={userData.designation}
                        onChange={handleChange}
                      >
                        <option selected value="">
                          Select
                        </option>
                        {designationData &&
                          designationData.map((i) => {
                            return (
                              <option key={i.id} value={i.id}>
                                {i.skill_name}
                              </option>
                            );
                          })}
                      </select>
                      {errors.designation && (
                        <div className="text-danger">{errors.designation}</div>
                      )}
                    </div>
                  </div>
                  <div ref={customSectionRef}>
                    {userData.custom_section?.length > 0 && (
                      <>
                        <div className="bg-white py-3 px-3 my-4 rounded-md ">
                          <div className="rightSectionHeading border-b-2  py-2 text-xl text-dark">
                            Add Custom Section
                          </div>
                          {userData.custom_section?.map((i, index) => (
                            <div
                              key={index}
                              className="mb-3 mt-3"
                              style={{
                                boxShadow:
                                  "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                                padding: "15px",
                              }}
                            >
                              <label className="form-label">
                                Field Name {index + 1}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Field Name"
                                name="label"
                                value={i.label}
                                onChange={(e) => handleChange(e, index)}
                              />

                              <label className="form-label mt-3">
                                Value Type {index + 1}
                              </label>
                              <select
                                className="form-select"
                                name="value_type"
                                value={i.value_type || ""}
                                onChange={(e) => handleChange(e, index)}
                              >
                                <option value="">Select Value Type</option>
                                <option value="input">Input</option>
                                <option value="select-box">Select Box</option>
                                <option value="textarea">Textarea</option>
                                <option value="check-box">Checkbox</option>
                                <option value="radio">Radio</option>
                                <option value="date">Date</option>
                                <option value="file">File</option>
                              </select>

                              {(i.value_type === "select-box" ||
                                i.value_type === "check-box" ||
                                i.value_type === "radio") && (
                                <div className="mt-3">
                                  <label className="form-label">Options:</label>
                                  {i.options.map((option, optionIndex) => (
                                    <div
                                      key={optionIndex}
                                      className="d-flex mb-2"
                                    >
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder={`Option ${
                                          optionIndex + 1
                                        }`}
                                        value={option}
                                        onChange={(e) =>
                                          handleOptionChange(
                                            e,
                                            index,
                                            optionIndex
                                          )
                                        }
                                      />
                                    </div>
                                  ))}

                                  <button
                                    type="button"
                                    className="btn btn-primary mt-2 me-2"
                                    onClick={() => addOption(index)}
                                  >
                                    Add More
                                  </button>

                                  {i.options.length > 1 && (
                                    <button
                                      type="button"
                                      className="btn btn-danger mt-2"
                                      onClick={() => removeOption(index)}
                                    >
                                      Remove Last
                                    </button>
                                  )}
                                </div>
                              )}

                              <button
                                type="button"
                                className="btn btn-danger mt-2"
                                onClick={() => handleRemove(index)}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="bg-white py-3 px-3 my-4 rounded-md ">
                    <div class="mb-3 mt-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Select process
                      </label>
                      <Select
                        defaultValue={selectedProcess}
                        isMulti
                        isSearchable
                        name="process"
                        options={processData.map((i) => ({
                          value: i.id,
                          label: i.process_name,
                        }))}
                        className="basic-multi-select"
                        value={selectedProcess}
                        classNamePrefix="Select Process"
                        onChange={handleProcessChange}
                      />
                      {errors.process && (
                        <div className="text-danger">{errors.process}</div>
                      )}
                    </div>
                    

                    {selectedProcess.length > 0 && (
                      <RecruitmentProcessComponent
                        key={selectedProcess
                          .map((item) => item.value)
                          .join("-")}
                        processData={selectedProcess}
                        onOrderChange={handleOrderChange} // Pass the order change handler
                      />
                    )}
                  </div>
                  <div className="">
                    <button
                      className="btn button1"
                      onClick={handleClick}
                    >
                      Update
                    </button>

                    <button
                      className="btn button2"
                      onClick={() => router.push("/employer/jobs")}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>

              <div className="col-md-3 addJobLeftSection py-3">
                <div className="bg-white p-3 rounded-md fixed">
                  <div className="border-b-2 ">
                    <h3 className=" ml-2 text-2xl text-dark">Suggestion</h3>
                  </div>
                  <div className="row p-3">
                    <div className="col-lg-12 col-md-6">
                      <div className="my-1">
                        <button className="btn btn-info btn-Jobs w-full" onClick={handleJobDetailsClick}>
                          Job Details
                        </button>
                      </div>
                    </div>
                    <div className="col-md-12 col-md-6">
                      <div className="my-1">
                        <button className="btn btn-success btn-Salary w-full" onClick={handleRequirementsClick}>
                          Requirement and salary
                        </button>
                      </div>
                    </div>
                    <div className="col-md-12 col-md-6">
                      <div className="my-1">
                        <button
                          className="btn btn-success btn-Salary  w-full "
                          onClick={handleCustomSectionClick}
                        >
                          Add Custom Section
                        </button>
                        <p className="text-muted">Note: Clicking this button multiple times will generate multiple fields for custom sections.</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="bg-white my-10 p-3 rounded-md ">
                  <div className="border-b-2">
                    <h3 className="text-2xl ml-2 text-dark">Custom Section</h3>
                  </div>
                  <div className="py-3">
                    <div className="row p-3">
                      <div className="col-md-12">
                        <button className="btn btn-warning btn-custom md:w-52 sm:w-72 lg:w-96 md:ml-10 sm:ml-0 ">
                          Add Custom Section
                        </button>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <AdminFooter />
      </StaffLayout>
    </>
  );
};

export default Page;
