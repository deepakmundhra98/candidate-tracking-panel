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
import AdminLayout from "../../../AdminLayout";
import AdminFooter from "../../../Components/AdminFooter/AdminFooter";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import Cookies from "js-cookie";
import InterviewCardDetails from "../../../Components/InterviewCardDetails/page";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const Page = ({ params }) => {
  const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const id = params.slug;
  const job_id = Cookies.get("job_id");
  const [userData, setUserData] = useState({
    candidate_id: id,
    job_id: job_id,
    process_id: "",
    user_assigned: "",
    interview_type: "",
    interview_type_detail: "",
    start_time: "",
    duration: "",
    telephoneDetails: "",
    comment: "",
    interview_date: currentDate,
  });

  const [errors, setErrors] = useState({
    process_id: "",
    user_assigned: "",
    interview_type: "",
    start_time: "",
    duration: "",
    telephoneDetails: "",
  });

  const [processData, setProcessData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [interviewDetails, setInterviewDetails] = useState([]);
  const [candidateDetails, setCandidateDetails] = useState([]);
  const [existingInterviewDetails, setExistingInterviewDetails] = useState([]);

  const token = Cookies.get("token");




  const getData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + `/admin/job/scheduleinterview/${id}`,
        null,
        {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setProcessData(response.data.response.processData);
      setCandidateDetails(response.data.response.candidateData);
      setExistingInterviewDetails(response.data.response.existingInterview);
    } catch (error) {
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

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name == "process_id") {
      getUsersForProcess(e.target.value);
    }

    if(name == "interview_type"){
      if(value === "Telephone"){
        setShowTelephoneInput(true);
        setShowOnsiteInput(false);
        setShowWebconferenceInput(false);
        setShowOtherInput(false);
      } else if(value === "On Site"){
        setShowOnsiteInput(true);
        setShowTelephoneInput(false);
        setShowWebconferenceInput(false);
        setShowOtherInput(false);
      }
      else if(value === "Web Conference"){
        setShowWebconferenceInput(true);
        setShowTelephoneInput(false);
        setShowOnsiteInput(false);
        setShowOtherInput(false);
      } else if(value === "other"){
        setShowOtherInput(true);
        setShowTelephoneInput(false);
        setShowOnsiteInput(false);
        setShowWebconferenceInput(false);
      } else{
        setShowTelephoneInput(false);
        setShowOnsiteInput(false);
        setShowWebconferenceInput(false);
        setShowOtherInput(false);
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const getUsersForProcess = async (processId) => {
    try {
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
      setUserList(response.data.response);
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleClick = async () => {
    try {
      if (Object.keys(errors).length > 0) {
        // Display Swal alert with validation errors
        Swal.fire({
          title: "Incomplete!",
          text: "Please fill out all required fields.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return; // Exit early
      }

      const confirmationResult = await Swal.fire({
        title: "Schedule interview?",
        text: "Do you want to schedule this interview?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/job/scheduleinterview/${id}`,
          userData,
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
          });
          router.back();
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
      //   setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not add qualification name",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (userData.process_id === "") {
      newErrors.process_id = "Process name is required";
    }
    if (userData.user_assigned === "") {
      newErrors.user_assigned = "Please assign is required";
    }
    if (userData.interview_type === "") {
      newErrors.interview_type = "Please select interview type";
    }
    if (userData.start_time === "") {
      newErrors.start_time = "Please select start time";
    }
    if (userData.duration === "") {
      newErrors.duration = "Please select start time";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // setInterviewDetails([...interviewDetails, userData]); // This line should update the state to add a new interview card
      setExistingInterviewDetails([...existingInterviewDetails, userData]);
      console.log(interviewDetails, "after added");
    }
  };
  return (
    <>
      <AdminLayout>
        {loading && <div className="loader-container"></div>}
        <div className="adminChangeUsername" style={{ minHeight: "80vh" }}>
          <div className="breadCumb1" role="">
            <div className="flex gap-3 items-center">
              <Link underline="hover" color="inherit" href="/admin/dashboard">
                <div className="flex gap-2 items-center">
                  <i className="fa-solid fa-gauge "></i>
                  <span>
                    Dashboard <i class="fa-solid fa-angles-right text-xs"></i>
                  </span>
                </div>
              </Link>
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-user"></i>
                <Link href="/admin/interview/candidate">
                  Applied candidate List{" "}
                </Link>
                <i class="fa-solid fa-angles-right text-xs"></i>
                <i class="fas fa-calendar-alt"></i>

                <span>Schedule Interview</span>
              </div>
            </div>
          </div>

          <div className="profilelogo">
            <h2> Schedule Interview</h2>
          </div>
          <div className="interviewPreviewTable">
            <div className="flex justify-between items-center  ">
              <div className="users-immg ">
                <div className="user_photo">
                  <Image
                    src="/Images/adminSide/candidateInfo.jpg"
                    alt="Ls rms"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="Nameuser">
                  <h2>
                    {/* {candidateDetails.first_name} {candidateDetails.last_name} */}
                  </h2>
                  <h4>gdfg</h4>
                </div>
              </div>

              <div className="searchBtn gap-3 ">
                <button className="btn btn-primary" onClick={handleClick}>
                  SAVE AND CONTINUE
                </button>
                <button
                  className="btn btn-light ml-3"
                  onClick={() => router.back()}
                >
                  <CallReceivedIcon />
                </button>
              </div>
            </div>
          </div>
          <div className="interviewPreviewTable ">
            <div className="schedule-interview">
              <div className="schedulenow">
                <h3>Schedule Now</h3>
                <p>
                  Schedule an interview right away by finding a slot based on
                  the interviewer availability.
                </p>
              </div>
              <div className="date-interview">
                <label>Interview Date</label>
                <div className="calendar-input">
                  <input
                    type="date"
                    className="form-control"
                    name="interview_date"
                    value={userData.interview_date}
                    min={currentDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* <div className="md:flex md:justify-between sm:inline-block">
                <h3 className="text-sm mb-3">
                  
                </h3>

                <div className="">
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={userData.date}
                    min={currentDate}
                    onChange={handleChange}
                  />
                </div>
              </div> */}
            </div>
            <div className="row py-8 ">
              <div className="col-lg-8 col-md-6 col-sm-12">
                <div className=" border-2 ">
                  <div className="sechuldeFormHeader">
                    <AccessAlarmIcon sx={{ Fontsize: 50 }} />
                    <span>Schedule</span>
                  </div>
                  <div className="scheduleForm">
                    <form action="">
                      <div className="process-assign-bx">
                        <div className="processAssignBtn">
                          <label className="mb-3">
                            Employer <span>*</span>
                          </label>
                          <select
                            className="form-control"
                            name="process_id"
                            value={userData.process_id}
                            onChange={handleChange}
                            disabled
                          >
                            <option>Select Employer</option>
                            {processData != "" &&
                              processData.map((i) => {
                                return (
                                  <>
                                    <option value={i.id}>
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
                        </div>
                        <div className="processAssignBtn">
                          <label className="mb-3">
                            Process <span>*</span>
                          </label>
                          <select
                            className="form-control"
                            name="process_id"
                            value={userData.process_id}
                            onChange={handleChange}
                          >
                            <option>Select Process</option>
                            {processData != "" &&
                              processData.map((i) => {
                                return (
                                  <>
                                    <option value={i.id}>
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
                        </div>
                        <div className="processAssignBtn">
                          <label className="mb-3">
                            Assign User <span>*</span>
                          </label>
                          <select
                            className="form-control"
                            name="user_assigned"
                            value={userData.user_assigned}
                            onChange={handleChange}
                          >
                            <option>Select user</option>
                            {userList != "" &&
                              userList.map((i) => {
                                return (
                                  <>
                                    <option value={i.id}>
                                      {i.first_name} {i.last_name}
                                    </option>
                                  </>
                                );
                              })}
                          </select>
                          {errors.user_assigned && (
                            <div className="text-danger">
                              {errors.user_assigned}
                            </div>
                          )}
                        </div>
                        <div className="processAssignBtn">
                          <label className="mb-3">
                            Interview Type <span>*</span>
                          </label>
                          <select
                            className="form-control"
                            name="interview_type"
                            value={userData.interview_type}
                            onChange={handleChange}
                            
                          >
                            <option value="">
                              Select
                            </option>
                            <option value="Telephone">Telephone</option>
                            <option value="On Site">On Site</option>
                            <option value="Web Conference">
                              Web Conference
                            </option>
                            <option value="other">
                              Other
                            </option>
                          </select>
                          {errors.interview_type && (
                            <div className="text-danger">
                              {errors.interview_type}
                            </div>
                          )}
                        </div>
                        {showTelephoneInput && (
                          <div className="processAssignBtn">
                            <label className="mb-3">
                              Telephone Number <span>*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="telephoneDetails"
                              value={userData.telephoneDetails}
                              onChange={handleChange}
                            />
                            {errors.telephoneDetails && (
                              <div className="text-danger">
                                {errors.telephoneDetails}
                              </div>
                            )}
                          </div>
                        )}
                        {showOnsiteInput && (
                          <div className="processAssignBtn">
                            <label className="mb-3">
                              Onsite Address <span>*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="onsite_address"
                              value={userData.onsite_address}
                              onChange={handleChange}
                            />
                            {errors.onsite_address && (
                              <div className="text-danger">
                                {errors.onsite_address}
                              </div>
                            )}
                          </div>
                        )}
                        {showWebconferenceInput && (
                          <div className="processAssignBtn">
                            <label className="mb-3">
                              Web conference link <span>*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="conference_link"
                              value={userData.conference_link}
                              onChange={handleChange}
                            />
                            {errors.conference_link && (
                              <div className="text-danger">
                                {errors.conference_link}
                              </div>
                            )}
                          </div>
                        )}
                        {showOtherInput && (
                          <div className="processAssignBtn">
                            <label className="mb-3">
                              Other Details <span>*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="otherDetails"
                              value={userData.otherDetails}
                              onChange={handleChange}
                            />
                            {errors.otherDetails && (
                              <div className="text-danger">
                                {errors.otherDetails}
                              </div>
                            )}
                          </div>
                        )}
                        <div className=" processAssignBtn flex items-center gap-3 ">
                          <div className="w-1/2">
                            <label className="mb-3">
                              Start Time <span>*</span>
                            </label>
                            <select
                              className="form-control"
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
                          </div>
                          <div className="w-1/2">
                            <label className="mb-3">
                              Duration <span>*</span>
                            </label>
                            <select
                              className="form-control w-100"
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
                          </div>
                        </div>

                        <div className=" processAssignBtn">
                          <div>
                            <label className="mb-3">Comment</label>
                            <input
                              className="form-control w-100"
                              name="comment"
                              value={userData.comment}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className=" processAssignBtn inline-block w-100 ">
                          <button
                            className="btn btn-primary "
                            style={{ padding: "8px", width: "22%" }}
                            onClick={handleAdd}
                          >
                            Add
                          </button>

                          <Link
                            href="/admin/interview/candidate"
                            className="btn btn-danger ml-2"
                            style={{ padding: "8px", width: "22%" }}
                          >
                            Cancel
                          </Link>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-12 ">
                {existingInterviewDetails != "" &&
                  existingInterviewDetails.map((i) => (
                    <InterviewCardDetails interviewDetails={i} token={token} />
                  ))}
              </div>
            </div>
          </div>
        </div>
        <AdminFooter />
      </AdminLayout>
    </>
  );
};

export default Page;
