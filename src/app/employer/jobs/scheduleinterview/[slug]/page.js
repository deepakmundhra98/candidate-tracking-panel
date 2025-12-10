"use client";
import React from "react";
import Link from "next/link";
import "../../../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useState, useEffect } from "react";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import Image from "next/image";
import EmployerLayout from "../../../EmployerLayout";
import AdminFooter from "../../../../admin/Components/AdminFooter/AdminFooter";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import Cookies from "js-cookie";
import InterviewCardDetails from "../../../../admin/Components/InterviewCardDetails/page";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import HTMLReactParser from "html-react-parser";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import Tooltip from "@mui/material/Tooltip";
import AssignUserToInterviewPopup from "@/app/employer/Components/AssignUserToInterviewPopup";

const Page = ({ params }) => {
  const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loadingSmall, setLoadingSmall] = useState(false);

  const id = params.slug;
  const job_id = Cookies.get("job_id");
  const [userData, setUserData] = useState({
    candidate_id: id,
    job_id: job_id,
    process_id: "",

    interview_type: "",
    interview_date: "",
    interview_type_detail: "",
    start_time: "",
    duration: "",
    comment: "",
    interview_date: "",
  });

  const [errors, setErrors] = useState({
    process_id: "",
    user_assigned: "",
    interview_type: "",
    interview_date: "",
    start_time: "",
    duration: "",
  });

  const [processData, setProcessData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [interviewDetails, setInterviewDetails] = useState([]);
  const [candidateDetails, setCandidateDetails] = useState([]);
  const [existingInterviewDetails, setExistingInterviewDetails] = useState([]);
  const [showPreviewButton, setShowPreviewButton] = useState(false);
  const [emailTemplateId, setEmailTemplateId] = useState();
  const [userOptionList, setUserOptionList] = useState([]);

  const token = Cookies.get("tokenEmployer");

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState([]);

  const [skillValidationError, setSkillValidationError] = useState("");

  const [showPopup, setShowPopup] = useState(false);

  // const handleUserChange = (selectedOptions) => {
  //   setSelectedUsers(selectedOptions); // Update selected skills
  //   if (selectedUsers) {
  //     setErrors({ ...errors, user_assigned: "" });
  //   }
  //   console.log(selectedUsers, "check selected users");
  // };

  const handleUserChange = (selectedOptions) => {
    const lastSelected = selectedOptions?.[selectedOptions.length - 1];
  
    if (lastSelected?.value === "__add_other_user__") {
      setLoadingSmall(true);
      setTimeout(() => {
        setLoadingSmall(false);
      },2000)
      setShowPopup(true); // open popup
      return; // don't set this option in selectedUsers
    }
  
    setSelectedUsers(selectedOptions); // update state
  
    if (selectedOptions) {
      setErrors({ ...errors, user_assigned: "" });
    }
  
    console.log(selectedOptions, "check selected users");
  };
  
  

  const getData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + `/admin/job/scheduleinterview/${id}/${job_id}`,
        null,
        {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setLoading(false);
      setProcessData(response.data.response.processData);
      setCandidateDetails(response.data.response.candidateData);
      setExistingInterviewDetails(response.data.response.existingInterview);
      setEmailTemplateId(response.data.response.email_template_id);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const [showTelephoneInput, setShowTelephoneInput] = useState(false);
  const [showWebconferenceInput, setShowWebconferenceInput] = useState(false);
  const [showOnsiteInput, setShowOnsiteInput] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    setUserData((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
      };

      // Call getUsersForProcess if process_id changes
      if (name === "process_id") {
        getUsersForProcess(value);
      }

      // Toggle input fields based on interview_type
      if (name === "interview_type") {
        setShowTelephoneInput(value === "Telephone");
        setShowOnsiteInput(value === "On Site");
        setShowWebconferenceInput(value === "Web Conference");
        setShowOtherInput(value === "other");
      }

      // Check if all fields are filled
      const allFieldsFilled = Object.values(updatedData).every(
        (field) => field !== "" && field !== null && field !== undefined
      );

      setShowPreviewButton(allFieldsFilled);

      return updatedData;
    });

    // Reset errors for the field being changed
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const triggerUsersFetchingFunctionAfterPopupClose = () => {
    getUsersForProcess(userData.process_id);
  }

  const getUsersForProcess = async (processId) => {
    try {
      setLoadingSmall(true);
      const response = await axios.post(
        BaseAPI + `/admin/getusersforprocess/${processId}`,
        null,
        {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setLoadingSmall(false);
      // setUserList(response.data.response);
      const users = response.data.response;

      setUserList(users); // save original list

      // Add custom option to select list
      const optionsWithCustom = [
        ...users.map((i) => ({
          value: i.id,
          label: i.first_name + " " + i.last_name,
        })),
        { value: "__add_other_user__", label: "➕ Add other user to this process" },
      ];

      setUserOptionList(optionsWithCustom);
    } catch (error) {
      setLoadingSmall(false);
      console.log(error.message);
    }
  };
  const handleClick = async () => {
    try {
      const updatedUserData = {
        ...userData,
        user_assigned:
          userData.user_assigned ||
          selectedUsers.map((user) => user.value).join(","),
      };
      // console.log(updatedUserData, "check user data");
      const confirmationResult = await Swal.fire({
        title:
          "Schedule interview for" +
          " " +
          candidateDetails.first_name +
          " " +
          candidateDetails.middle_name +
          " " +
          candidateDetails.last_name +
          "?",
        text:
          "Do you want to schedule this interview? This will send an Email to " +
          candidateDetails.first_name +
          " " + 
          candidateDetails.middle_name +
          " " +
          candidateDetails.last_name +
          " with the interview details.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/job/scheduleinterview/${id}/${job_id}`,
          updatedUserData,
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
            title: "Interview scheduled successfully!",
            icon: "success",
            confirmButtonText: "Close",
          }).then(() => {
            router.push("/employer/candidates");
          });
          // router.back();
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
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not schedule interview",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (userData.process_id === "") {
      newErrors.process_id = "Please select a process name";
    }
    if (selectedUsers.length === 0) {
      newErrors.user_assigned = "Please select an interviewer";
    }
    if (userData.interview_type === "") {
      newErrors.interview_type = "Please select interview type";
    }
    if (userData.interview_date === "" || userData.interview_date === null) {
      newErrors.interview_date = "Please select interview date";
    }
    if (userData.start_time === "") {
      newErrors.start_time = "Please select start time";
    }
    if (userData.duration === "") {
      newErrors.duration = "Please select duration";
    }
    if (userData.interview_type_detail === "") {
      newErrors.interview_type_detail =
        "Please add the details of interview type selected.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      let userId = selectedUsers.map((user) => user.value).join(",");

      const updatedUserData = {
        ...userData,
        user_assigned: userId,
      };

      setUserData(updatedUserData);

      try {
        // **Wait for staff availability data**
        let staffData = await getStaffAvailability(updatedUserData.start_time);
        // console.log(staffData, "staff data"); // Now it will log the actual data

        if (staffData !== 200) {
          Swal.fire({
            title: "Staff Not available at the selected time",
            text: staffData,
            icon: "warning",
            confirmButtonText: "Ok",
          });

          setUserData((prev) => ({
            ...prev,
            start_time: "",
          }));

          return;
        }

        // setExistingInterviewDetails((prevDetails) => [
        //   ...prevDetails,
        //   updatedUserData,
        // ]);

        handleClick();
      } catch (error) {
        console.error("Error fetching staff availability:", error);
      }
    }

    if (
      userData.duration !== "" &&
      userData.interview_type !== "" &&
      userData.interview_type_detail !== "" &&
      userData.process_id !== "" &&
      userData.start_time !== "" &&
      selectedUsers.length > 0
    ) {
      setShowPreviewButton(true);
    } else {
      setShowPreviewButton(false);
    }
  };

  const [emailPreviewData, setEmailPreviewData] = useState();
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handlePreview = async (e) => {
    e.preventDefault();
    // Logic for previewing the interview details
    // console.log("Previewing interview details:", userData);
    // You can implement your preview logic here, e.g., showing a modal with the details
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI +
          "/admin/emailtemplate/interview-schedule/getEmailTemplatePreview/" +
          emailTemplateId,
        {
          candidate_id: id,
          job_id: job_id,
          process_id: userData.process_id,
          user_assigned: userData.user_assigned || selectedUsers.map((user) => user.value).join(","),
          interview_type: userData.interview_type,
          interview_date: userData.interview_date,
          start_time: userData.start_time,
          duration: userData.duration,
          comment: userData.comment,
          interview_type_detail: userData.interview_type_detail,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      if (response.data.status === 200) {
        setShowPreviewModal(true);

        setEmailPreviewData(response.data.response);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const getStaffAvailability = async (start_time) => {
    try {
      // setLoading(true);
      const response = await axios.post(
        BaseAPI + `/admin/get-staff-availbility`,
        {
          ids: selectedUsers.map((user) => user.value).join(","),
          interview_date: userData.interview_date,
          start_time: start_time,
        },
        {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      // setLoading(false);
      if (response.data.response.length > 0) {
        return response.data.response;
        // Swal.fire({
        //   title: "Staff not available at the selected time",
        //   text: response.data.response,
        //   icon: "warning",
        //   confirmButtonText: "OK",
        // });
        // setUserData((prev) => ({
        //   ...prev,
        //   start_time: "",
        // }))
      } else {
        return 200;
      }
    } catch (error) {
      // setLoading(false);
      console.log(error.message);
    }
  };

  return (
    <>
      <EmployerLayout>
        {loading && <div className="loader-container"></div>}
        <div
          className="adminChangeUsername scheduleInterview"
          style={{ minHeight: "80vh" }}
        >
          <div className="breadCumb1" role="">
            <div className="flex gap-3 items-center">
              <Link
                underline="hover"
                color="inherit"
                href="/employer/dashboard"
              >
                <div className="flex gap-2 items-center">
                  <i className="fa-solid fa-gauge "></i>
                  <span>
                    Dashboard <i class="fa-solid fa-angles-right text-xs"></i>
                  </span>
                </div>
              </Link>
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-users"></i>
                <Link href="/employer/candidates">Candidates List </Link>
                <i class="fa-solid fa-angles-right text-xs"></i>
                <i class="fas fa-calendar-alt"></i>

                <span>Schedule Interview</span>
              </div>
            </div>
          </div>

          <div className="profilelogo">
            <div className="pageHeader mt-[35px]">
              <h2 className="text-[26px] font-light text-gray-600">
                Schedule{" "}
                <span className="font-semibold text-gray-700"> Interviews</span>
              </h2>
              {/* <p className="text-muted">
                Schedule an interview right away by finding a slot based on the
                interviewer availability.
              </p> */}
            </div>
          </div>
          <div className="profileHeader bg-white p-[20px] mb-[20px] rounded">
            <div className="flex justify-between items-center  ">
              <div className="users-immg ">
                <div className="user_photo">
                  {candidateDetails.profile_image ? (
                    <>
                      <Image
                        src={candidateDetails.profile_image}
                        alt="Ls rms"
                        width={100}
                        height={100}
                      />
                    </>
                  ) : (
                    <>
                      <Image
                        src="/Images/adminSide/dummy-profile.png"
                        alt="Ls rms"
                        width={100}
                        height={100}
                      />
                    </>
                  )}
                </div>
                <div className="inline-block pl-[15px] align-middle">
                  <h2 className="font-semibold text-gray-700 text-xl">
                    {candidateDetails.first_name} {candidateDetails.last_name}
                  </h2>
                  <h4 className="!text-gray-500 !text-sm">Candidate</h4>
                </div>
              </div>

              <div className="searchBtn gap-3">
                <Tooltip title="Go Back">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => router.back()}
                  >
                    <CallReceivedIcon sx={{ fontSize: 15 }} />
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="bg-white rounded">
            <div className="w-full">
              <div className="">
                <div className="">
                  <div className="p-[20px] border-b">
                    <AccessAlarmIcon
                      sx={{ Fontsize: 50, marginRight: "5px" }}
                    />
                    <span>Schedule</span>
                  </div>
                  <div className="px-[20px] py-[10px]">
                    <form action="">
                      <div className="process-assign-bx">
                        <div className="processAssignBtn">
                          <label className="font-semibold mb-2">
                            Interview Process <span>*</span>
                          </label>
                          <select
                            className="form-control form-select !h-[50px] !text-gray-500 !rounded-none"
                            name="process_id"
                            value={userData.process_id}
                            onChange={handleChange}
                          >
                            <option value="">Select process</option>
                            {processData != "" &&
                              processData.map((i) => {
                                return (
                                  <>
                                    <option
                                      value={i.process_id}
                                      disabled={i.completion_status === 1}
                                    >
                                      {i.process_name}
                                    </option>
                                  </>
                                );
                              })}
                          </select>
                          {errors.process_id && (
                            <div className="text-danger">
                              {errors.process_id}
                            </div>
                          )}
                          <span
                            className="text-muted"
                            style={{ fontSize: "12px" }}
                          >
                            Select an Interview Process for the Candidate
                          </span>
                        </div>
                        <div className="processAssignBtn flex gap-3">
                          <div className="flex-1">
                            <label className="font-semibold mb-2">
                              Interview Date <span>*</span>
                            </label>
                            <input
                              type="date"
                              className="form-control !h-[50px] !text-gray-500 !rounded-none"
                              name="interview_date"
                              value={userData.interview_date}
                              min={currentDate}
                              onChange={handleChange}
                            />
                            {errors.interview_date && (
                              <div className="text-danger">
                                {errors.interview_date}
                              </div>
                            )}
                            <span
                              className="text-muted"
                              style={{ fontSize: "12px" }}
                            >
                              Select an Interview Date
                            </span>
                          </div>
                          <div className="flex-1">
                            <label className="!font-semibold mb-2">
                              Start Time <span>*</span>
                            </label>
                            <select
                              className="form-control form-select !h-[50px] !text-gray-500 !rounded-none"
                              name="start_time"
                              value={userData.start_time}
                              onChange={handleChange}
                            >
                              <option value="" selected>
                                Select start time
                              </option>
                              <option value="1">01:00 AM</option>
                              <option value="2">02:00 AM</option>
                              <option value="3">03:00 AM</option>
                              <option value="4">04:00 AM</option>
                              <option value="5">05:00 AM</option>
                              <option value="6">06:00 AM</option>
                              <option value="7">07:00 AM</option>
                              <option value="8">08:00 AM</option>
                              <option value="9">09:00 AM</option>
                              <option value="10">10:00 AM</option>
                              <option value="11">11:00 AM</option>
                              <option value="12">12:00 PM</option>
                              <option value="13">01:00 PM</option>
                              <option value="14">02:00 PM</option>
                              <option value="15">03:00 PM</option>
                              <option value="16">04:00 PM</option>
                              <option value="17">05:00 PM</option>
                              <option value="18">06:00 PM</option>
                              <option value="19">07:00 PM</option>
                              <option value="20">08:00 PM</option>
                              <option value="21">09:00 PM</option>
                              <option value="22">10:00 PM</option>
                              <option value="23">11:00 PM</option>
                              <option value="24">12:00 PM</option>
                            </select>
                            {errors.start_time && (
                              <div className="text-danger">
                                {errors.start_time}
                              </div>
                            )}
                            <span
                              className="text-muted"
                              style={{ fontSize: "12px" }}
                            >
                              Select the Interview Start Time
                            </span>
                          </div>
                          <div className="flex-1">
                            <label className="font-semibold mb-2">
                              Duration <span>*</span>
                            </label>
                            <select
                              className="form-control form-select !h-[50px] !text-gray-500 !rounded-none"
                              name="duration"
                              value={userData.duration}
                              onChange={handleChange}
                            >
                              <option>Select</option>
                              <option value="30">30 Minutes</option>
                              <option value="45">45 Minutes</option>
                              <option value="1">1 Hour</option>
                            </select>
                            {errors.duration && (
                              <div className="text-danger">
                                {errors.duration}
                              </div>
                            )}
                            <span
                              className="text-muted"
                              style={{ fontSize: "12px" }}
                            >
                              Select the Interview Duration
                            </span>
                          </div>
                        </div>

                        <div className="processAssignBtn">
                          <label className="font-semibold mb-2 flex items-center gap-1">
                            Select Interviewer{" "}
                            <span className="flex items-center">*</span>
                            {loadingSmall && (
                              <Image
                                src="/Images/loaderSmall.gif"
                                width="30"
                                height="30"
                                alt="loader"
                              />
                            )}
                          </label>

                          {/* <Select
                            isMulti
                            isSearchable
                            name="user_assigned"
                            options={userList.map((i) => ({
                              value: i.id,
                              label: i.first_name + " " + i.last_name,
                            }))}
                            className="basic-multi-select "
                            value={selectedUsers}
                            classNamePrefix="Select Skills"
                            onChange={handleUserChange}
                            isDisabled={loadingSmall} // Use isDisabled instead of disabled
                          /> */}
                          <Select
                            isMulti
                            isSearchable
                            name="user_assigned"
                            options={userOptionList}
                            className="basic-multi-select"
                            value={selectedUsers}
                            classNamePrefix="Select Skills"
                            onChange={handleUserChange}
                            isDisabled={loadingSmall}
                          />

                          {errors.user_assigned && (
                            <div className="text-danger">
                              {errors.user_assigned}
                            </div>
                          )}
                          <span
                            className="text-muted"
                            style={{ fontSize: "12px" }}
                          >
                            Select one or more interviewers who will be responsible for conducting the interview
                          </span>
                          {showPopup && (
                            <AssignUserToInterviewPopup
                              onClose={() => setShowPopup(false)}
                              process_id={userData.process_id}
                              userListRefresh={
                                triggerUsersFetchingFunctionAfterPopupClose
                              }
                            />
                          )}
                        </div>
                        <div className="processAssignBtn">
                          <label className="font-semibold mb-2">
                            Interview Type <span>*</span>
                          </label>
                          <select
                            className="form-control form-select !h-[50px] !text-gray-500 !rounded-none"
                            name="interview_type"
                            value={userData.interview_type}
                            onChange={handleChange}
                          >
                            <option value="">Select</option>
                            <option value="Telephone">Telephone</option>
                            <option value="On Site">On Site</option>
                            <option value="Web Conference">
                              Web Conference
                            </option>
                            <option value="other">Other</option>
                          </select>
                          {errors.interview_type && (
                            <div className="text-danger">
                              {errors.interview_type}
                            </div>
                          )}
                          <span
                            className="text-muted"
                            style={{ fontSize: "12px" }}
                          >
                            Select the type of the Interview
                          </span>
                        </div>
                        {showTelephoneInput && (
                          <div className="processAssignBtn">
                            <label className="font-semibold mb-2">
                              Telephone Number <span>*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control !h-[50px] !text-gray-500 !rounded-none"
                              name="interview_type_detail"
                              value={userData.interview_type_detail}
                              onChange={handleChange}
                            />
                            {errors.interview_type_detail && (
                              <div className="text-danger">
                                {errors.interview_type_detail}
                              </div>
                            )}
                          </div>
                        )}
                        {showOnsiteInput && (
                          <div className="processAssignBtn">
                            <label className="font-semibold mb-2">
                              Onsite Address <span>*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control !h-[50px] !text-gray-500 !rounded-none"
                              name="interview_type_detail"
                              value={userData.interview_type_detail}
                              onChange={handleChange}
                            />
                            {errors.interview_type_detail && (
                              <div className="text-danger">
                                {errors.interview_type_detail}
                              </div>
                            )}
                          </div>
                        )}
                        {showWebconferenceInput && (
                          <div className="processAssignBtn">
                            <label className="font-semibold mb-2">
                              Web conference link <span>*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control !h-[50px] !text-gray-500 !rounded-none"
                              name="interview_type_detail"
                              value={userData.interview_type_detail}
                              onChange={handleChange}
                            />
                            {errors.interview_type_detail && (
                              <div className="text-danger">
                                {errors.interview_type_detail}
                              </div>
                            )}
                          </div>
                        )}
                        {showOtherInput && (
                          <div className="processAssignBtn">
                            <label className="font-semibold mb-2">
                              Other Details <span>*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control !h-[50px] !text-gray-500 !rounded-none"
                              name="interview_type_detail"
                              value={userData.interview_type_detail}
                              onChange={handleChange}
                            />
                            {errors.interview_type_detail && (
                              <div className="text-danger">
                                {errors.interview_type_detail}
                              </div>
                            )}
                          </div>
                        )}

                        <div className=" processAssignBtn">
                          <div>
                            <label className="font-semibold mb-2">
                              Comment
                            </label>
                            <input
                              className="form-control !w-100 !h-[100px] !text-gray-500 !rounded-none"
                              name="comment"
                              value={userData.comment}
                              onChange={handleChange}
                            />
                            <span
                              className="text-muted"
                              style={{ fontSize: "12px" }}
                            >
                              Add a comment for the Candidate
                            </span>
                          </div>
                        </div>
                        <div className="processAssignBtn flex flex-wrap gap-[10px] w-100 ">
                          {/* <div className="searchBtn gap-3 "> */}
                          {showPreviewButton ? (
                            <button
                              className="btn btn-primary text-white px-3 py-2 !rounded border-none w-fit"
                              onClick={handlePreview}
                            >
                              EMAIL PREVIEW
                            </button>
                          ) : (
                            ""
                          )}
                          {/* </div> */}
                          <button
                            className="bg-[#0096ff] text-white px-3 py-2 !rounded border-none w-fit"
                            onClick={handleAdd}
                          >
                            SAVE AND CONTINUE
                          </button>

                          <Link
                            href="/employer/candidates"
                            className="bg-[red] text-white px-3 py-2 !rounded border-none !w-fit !underline-none"
                            style={{
                              padding: "8px",
                              width: "22%",
                              textDecoration: "none !important",
                            }}
                          >
                            CANCEL
                          </Link>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* {existingInterviewDetails.length > 0 ? (
                <div className="col-lg-4 col-md-6 col-sm-12 ">
                  {existingInterviewDetails != "" &&
                    existingInterviewDetails.map((i) => (
                      <InterviewCardDetails
                        interviewDetails={i}
                        token={token}
                      />
                    ))}
                </div>
              ) : (
                <></>
              )} */}
            </div>
            <Modal
              size="lg"
              show={showPreviewModal}
              onHide={() => setShowPreviewModal(false)}
              aria-labelledby="example-modal-sizes-title-lg"
            >
              <Modal.Header closeButton className="Process_assigned">
                <Modal.Title id="example-modal-sizes-title-lg">
                  Email Preview
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {emailPreviewData && HTMLReactParser(emailPreviewData)}
              </Modal.Body>
            </Modal>
          </div>
          <div className="existingInterviews mt-[55px]">
            <h3 className="text-[26px] font-light text-gray-600">
              Previous{" "}
              <span className="font-semibold text-gray-700">
                {" "}
                Scheduled Interviews
              </span>
            </h3>
            <div className="existingInterviewsTable mt-[20px] bg-white">
              <div className="w-full bg-white rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border-y border-gray-200 border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-4 px-4 text-left text-gray-600 font-semibold border-0 !border-none">
                          Date
                        </th>
                        <th className="py-4 px-4 text-left text-gray-600 font-semibold border-0 !border-none">
                          Round
                        </th>
                        <th className="py-4 px-4 text-left text-gray-600 font-semibold border-0 !border-none">
                          Interview Type
                        </th>
                        <th className="py-4 px-4 text-left text-gray-600 font-semibold border-0 !border-none">
                          Interview Details
                        </th>
                        <th className="py-4 px-4 text-left text-gray-600 font-semibold border-0 !border-none">
                          Interviewer
                        </th>
                        <th className="py-4 px-4 text-left text-gray-600 font-semibold border-0 !border-none">
                          Comment
                        </th>
                        <th className="py-4 px-4 text-left text-gray-600 font-semibold border-0 !border-none">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {existingInterviewDetails.length > 0 ? (
                        existingInterviewDetails.map((i, index) => (
                          <tr key={index} className="border-b border-gray-200">
                            <td className="py-2 px-4 text-gray-500 border-0">
                              {i.formatted_date}
                            </td>
                            <td className="py-2 px-4 text-gray-700 border-0">
                              <div className="font-semibold">
                                {i.process_name}
                              </div>
                              <div className="text-gray-500">
                                {i.formatted_time}
                              </div>
                            </td>
                            <td className="py-2 px-4 text-gray-500 border-0">
                              {i.interview_type} - {i.duration}
                            </td>
                            <td className="py-2 px-4 text-blue-500 border-0">
                              <a
                                href={i.interview_type_detail}
                                className="hover:underline text-decoration-none-important"
                              >
                                {i.interview_type_detail}
                              </a>
                            </td>
                            <td className="py-2 px-4 text-gray-500 border-0">
                              {i.staff_names.join(", ")}
                            </td>
                            <td className="py-2 px-4 text-gray-500 border-0">
                              {i.comment}
                            </td>
                            <td className="py-2 px-4 border-0">
                              {i.interview_completion_status === 1 && (
                                <span
                                  data-bs-toggle="tooltip"
                                  data-bs-title="Interview Completed"
                                  className="inline-block"
                                >
                                  <i className="fas fa-check-circle text-green-500"></i>
                                </span>
                              )}
                              {i.interview_completion_status === null && (
                                <div className="relative group">
                                  <Tooltip title="Interview Not Completed">
                                    <span>
                                      <i className="fa-solid fa-clock text-yellow-500"></i>
                                    </span>
                                  </Tooltip>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="py-4 text-center text-gray-600 border-0"
                          >
                            No interview scheduled
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AdminFooter />
      </EmployerLayout>
    </>
  );
};

export default Page;
