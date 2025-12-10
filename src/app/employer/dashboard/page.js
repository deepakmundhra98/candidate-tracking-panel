"use client";
import { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DashboardChart from "@/app/admin/Components/Charts/DashboardChart";
import Link from "next/link";
import "../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
// import AdminLayout from "../../admin/AdminLayout";
import EmployerLayout from "../EmployerLayout";
import axios from "axios";
import BaseAPI from "../../BaseAPI/BaseAPI";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import AdminFooter from "../../admin/Components/AdminFooter/AdminFooter";
import Image from "next/image";
import DashboardCalender from "@/app/employer/dashboard/DashboardCalender/DashboardCalender";
import { Tooltip } from "@mui/material";
import CandidateModal from "@/app/Components/CandidateModal/CandidateModal";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Page = () => {
  const [show, setShow] = useState(false);
  const [slider, setslider] = useState(false);
  const token = Cookies.get("tokenEmployer");
  const employerId = Cookies.get("employerId");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const slide1 = () => setslider(true);
  const slideClose = () => setslider(false);
  const [lgShow, setLgShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notificationLoading, setNotificationLoading] = useState(true);

  const [userData, setUserData] = useState([]);
  const [modalData, setModalData] = useState();
  const [activeJobs, setActiveJobs] = useState([]);
  const [upcomingInterview, setUpcomingInterview] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [candidateOfferedJobData, setCandidateOfferedJobData] = useState([]);
  const [candidateAcceptedJobOffer, setCandidateAcceptedJobOffer] = useState(
    []
  );
  const [notificationData, setNotificationData] = useState([]);
  const drawerRef = useRef(null);

  let data = useRef();
  const tokenKey = Cookies.get("tokenAdmin");
  const fname = Cookies.get("fname");

  const handleOpen = (eachData) => {
    setslider(true);
    setModalData(eachData);
  };
  const handleinterview = (eachData) => {
    setLgShow(true);
    setModalData(eachData);
  };

  const handleCloseModal = () => {
    setslider(false);
    setModalData(null);
  };

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(BaseAPI + "/admin/dashboard", null, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + " " + token,
        },
      });
      setUserData(response.data.response.latestApplications);
      setChartData(response.data.response.dashboardChartData);
      setActiveJobs(response.data.response.activeJobs);
      setUpcomingInterview(response.data.response.upcomingInterview);
      setCandidateOfferedJobData(response.data.response.candidateOfferedJob);
      setCandidateAcceptedJobOffer(
        response.data.response.candidatesAcceptedJobOffer
      );

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };
  const getNotifications = async () => {
    try {
      setNotificationLoading(true);
      const response = await axios.post(
        BaseAPI + `/admin/get-employer-notification`,
        { employer_id: employerId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      setNotificationData(response.data.response);
    } catch (error) {
      console.log(error);
    } finally {
      setNotificationLoading(false);
    }
  };
  useEffect(() => {
    getData();
    getNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      setNotificationData([]); // clear after marking read
      await axios.post(BaseAPI + `/admin/mark-notification-as-read`, null, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setNotificationData([]); // clear after marking read
      getNotifications();
    } catch (error) {
      console.log("Error marking all as read:", error);
    } finally {
      setNotificationLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      setNotificationLoading(true);
      await axios.post(
        BaseAPI + `/admin/mark-notification-as-read`,
        { id: notificationId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      // Refresh notification list after marking as read
      getNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    } finally {
      setNotificationLoading(false);
    }
  };

  const groupedNotifications = notificationData.reduce((groups, notif) => {
    const date = new Date(notif.created_at).toLocaleDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(notif);
    return groups;
  }, {});

  // Close drawer on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(e.target) &&
        !e.target.closest(".icon")
      ) {
        setShowDrawer(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <EmployerLayout>
        {loading && <div className="loader-container"></div>}
        <div className=" backgroundColour" style={{ minHeight: "80vh" }}>
          <div className="dashboardBody">
            <div className="profilelogo mt-[25px] mb-[20px]">
              <h2>Welcome To Your Company Panel</h2>
            </div>
            <div className="row">
              <div className="col-md-8">
                <div className="dashboard-content">
                  <div className="charts-Heading">
                    <h3>Analytics</h3>
                  </div>
                  <div className="chart-type">
                    {" "}
                    <DashboardChart chartData={chartData} />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                {" "}
                <DashboardCalender upcomingInterview={upcomingInterview} />
              </div>
            </div>

            <div className="latestApplicationSection mt-[20px]">
              <div className="row">
                <div className="col-lg-12 col-sm-12 col-md-12">
                  <div className="interviewPreviewTable">
                    <div className=" ">
                      <div className="dashboard-content my-4">
                        <div className="charts-Heading">
                          <h3>Latest Job Applications</h3>
                          <div className="yearly-charts">
                            <Link href="/employer/candidates" className="text-decoration-none">
                              View All
                            </Link>
                          </div>
                        </div>

                        <div className="latest-applications">
                          <div class="relative overflow-x-auto ">
                            <table class=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                              <thead class="text-xs text-gray-700 uppercase border-b-2">
                                <tr>
                                  <th scope="col" className="px-6 py-3">
                                    Candidate Info
                                  </th>
                                  <th scope="col">Contact Number</th>
                                  <th scope="col">Post</th>
                                  <th scope="col">Created</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {userData.length > 0 ? (
                                  userData.slice(0, 5).map((i) => {
                                    return (
                                      <>
                                        <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50  px-6 py-3 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                          <td className="latestApplicationData-td">
                                            <div className="userInfo">
                                              {i.profile_image !== "" ? (
                                                <Image
                                                  src={i.profile_image}
                                                  alt="user-image"
                                                  width={50}
                                                  height={50}
                                                />
                                              ) : (
                                                <Image
                                                  src="/Images/adminSide/dummy-profile.png"
                                                  alt="user-image"
                                                  width={50}
                                                  height={50}
                                                />
                                              )}
                                            </div>
                                            <div className="contactInfo">
                                              <span>
                                                {i.first_name} {i.last_name}
                                              </span>
                                              <span>Gender: {i.gender}</span>
                                            </div>
                                          </td>
                                          <td className="latestApplicationData-td">
                                            <div className="socialInfo">
                                              <span>
                                                <i className="fa-regular fa-envelope"></i>
                                                {i.email_address}
                                              </span>
                                              <span>
                                                <i className="fa fa-phone"></i>
                                                {i.contact_number}
                                              </span>
                                            </div>
                                          </td>
                                          <td className="desigNation latestApplicationData-td">
                                            {i.job_name}
                                          </td>
                                          <td className="latestApplicationData-td">
                                            <div className="joinDatee">
                                              <i className="fa fa-calendar"></i>
                                              <span>{i.created_at}</span>
                                            </div>
                                          </td>
                                          <td className="latestApplicationData-td">
                                            <div className="action-btn">
                                              <Button
                                                variant="primary"
                                                onClick={() => handleOpen(i)}
                                                className="btn-View"
                                              >
                                                <i className="fa fa-eye"></i>
                                              </Button>
                                            </div>
                                          </td>
                                        </tr>
                                      </>
                                    );
                                  })
                                ) : (
                                  <tr>
                                    <td
                                      colSpan={5}
                                      className="latestApplicationNoData-td"
                                    >
                                      No data found
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
                </div>
              </div>
            </div>

            {/* Notification Section */}
            <div className="latestApplicationSection mt-[20px]">
              <div className="row">
                <div className="col-lg-12 col-sm-12 col-md-12">
                  <div className="interviewPreviewTable">
                    <div className=" ">
                      <div className="my-4">
                        <div className="charts-Heading">
                          <h3>Notifications</h3>
                          <div className="yearly-charts">
                            <Link
                              href="#"
                              className="text-decoration-none"
                              onClick={markAllAsRead}
                              aria-disabled={notificationData.length === 0}
                            >
                              Mark all as read
                            </Link>
                          </div>
                        </div>

                        <div className="bg-[#ffffff] px-[20px]">
                          <div class="">
                            <div className="min-h-[200px] w-full">
                              {notificationLoading ? (
                                <div className="flex justify-center items-center min-h-[200px]">
                                  <span className="text-sm text-gray-400 animate-pulse">
                                    Loading notifications...
                                  </span>
                                </div>
                              ) : notificationData.length > 0 ? (
                                Object.keys(groupedNotifications).map(
                                  (date) => (
                                    <div key={date}>
                                      <h5 className="text-xs text-gray-500 mb-2 mt-4">
                                        {date}
                                      </h5>
                                      <ul className="space-y-4">
                                        {groupedNotifications[date].map(
                                          (notification, idx) => (
                                            <li
                                              key={idx}
                                              className={`border-b rounded p-2 flex justify-between items-center ${
                                                notification.mark_as_read ===
                                                "0"
                                                  ? "bg-gray-100"
                                                  : ""
                                              }`}
                                            >
                                              <div className="flex-1 flex items-start">
                                                {notification.mark_as_read ===
                                                  "0" && (
                                                  <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mr-2 mt-1.5"></span>
                                                )}
                                                <div>
                                                  <h4 className="font-bold text-sm">
                                                    {
                                                      notification.notification_title
                                                    }
                                                  </h4>
                                                  <p className="text-gray-600 text-sm">
                                                    {
                                                      notification.notification_text
                                                    }
                                                  </p>
                                                  <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(
                                                      notification.created_at
                                                    ).toLocaleTimeString()}
                                                  </p>
                                                </div>
                                              </div>
                                              <button
                                                onClick={() =>
                                                  markAsRead(notification.id)
                                                }
                                                className="ml-3 text-blue-600 hover:text-blue-800 transition flex items-center justify-center"
                                                title="Mark as Read"
                                              >
                                                <VisibilityIcon fontSize="small" />
                                              </button>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )
                                )
                              ) : (
                                <div className="flex items-center justify-center min-h-[200px] text-sm text-gray-500">
                                  No notifications
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="upcomingInterview">
              <div className="row">
                <div className="col-lg-8 col-sm-12 col-md-12">
                  <div className="dashboard-content">
                    <div className="charts-Heading">
                      <h3>Upcoming Interviews</h3>
                      <div className="yearly-charts">
                        {/* <Link href="" className="text-decoration-none">
                          View All
                        </Link> */}
                      </div>
                    </div>
                    <div className="latest-applications min-h-[385px]">
                      <div class="relative overflow-x-auto ">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                          <tr>
                            <th scope="col" className="px-6 py-3">
                              Candidate{" "}
                            </th>
                            <th scope="col"> Interviewer</th>
                            <th scope="col"> Schedule</th>

                            <th scope="col">Action</th>
                          </tr>
                          {upcomingInterview.length > 0 ?
                            upcomingInterview.slice(0, 5).map((i) => {
                              return (
                                <>
                                  <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50  px-6 py-3 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td className="latestApplicationData-td">
                                      <div className="contactInfo">
                                        <span>{i.candidate_name}</span>
                                      </div>
                                    </td>
                                    <td className="latestApplicationData-td">
                                      <div className="socialInfo">
                                        <span>{i.interviewer_name}</span>
                                      </div>
                                    </td>

                                    <td className="latestApplicationData-td">
                                      <div className="joinDatee">
                                        <span>{i.interview_date}</span>
                                      </div>
                                    </td>
                                    <td className="latestApplicationData-td">
                                      <div className="action-btn">
                                        <Button
                                          className="btn btn-info btn-View"
                                          // onClick={() => setLgShow(true)}
                                          onClick={() => handleinterview(i)}
                                        >
                                          <i className="fa fa-eye"></i>
                                        </Button>
                                        <Modal
                                          size="lg"
                                          show={lgShow}
                                          onHide={() => setLgShow(false)}
                                          aria-labelledby="example-modal-sizes-title-lg"
                                        >
                                          <Modal.Header closeButton>
                                            <Modal.Title id="example-modal-sizes-title-lg">
                                              Interview Details of{" "}
                                              {modalData &&
                                                modalData.candidate_name}
                                            </Modal.Title>
                                          </Modal.Header>
                                          <Modal.Body>
                                            <div className="interview-bx-details">
                                              <label>Candidate Name :</label>
                                              <span>
                                                {modalData &&
                                                  modalData.candidate_name}
                                              </span>
                                            </div>
                                            <div className="interview-bx-details">
                                              <label>Interview Name :</label>
                                              <span>
                                                {modalData &&
                                                modalData.process_name
                                                  ? modalData.process_name
                                                  : "Not Available"}
                                              </span>
                                            </div>
                                            <div className="interview-bx-details">
                                              <label>Interview Date :</label>
                                              <span>
                                                {modalData &&
                                                modalData.interview_date
                                                  ? modalData.interview_date
                                                  : "Not Available"}
                                              </span>
                                            </div>
                                            <div className="interview-bx-details">
                                              <label>Interviewer Name :</label>
                                              <span>
                                                {modalData &&
                                                modalData.interviewer_name
                                                  ? modalData.interviewer_name
                                                  : "Not Available"}
                                              </span>
                                            </div>
                                            <div className="interview-bx-details">
                                              <label>Start Time :</label>
                                              <span>
                                                {modalData &&
                                                modalData.start_time
                                                  ? modalData.start_time
                                                  : "Not Available"}
                                              </span>
                                            </div>
                                            <div className="interview-bx-details">
                                              <label>Experience :</label>
                                              <span>
                                                {modalData &&
                                                modalData.experience &&
                                                modalData.experience.length > 0
                                                  ? modalData.experience.map(
                                                      (j, index) => {
                                                        return (
                                                          <div key={index}>
                                                            {j.organisation_name
                                                              ? j.organisation_name
                                                              : "Not Available"}{" "}
                                                            (From{" "}
                                                            {j.start_date
                                                              ? j.start_date
                                                              : "Not available"}{" "}
                                                            to{" "}
                                                            {j.end_date
                                                              ? j.end_date
                                                              : "Not Available"}
                                                            ) <br />
                                                          </div>
                                                        );
                                                      }
                                                    )
                                                  : "Not Available"}
                                              </span>
                                            </div>
                                            <div className="interview-bx-details">
                                              <label>Education :</label>
                                              <span>
                                                {modalData &&
                                                modalData.education &&
                                                modalData.education.length > 0
                                                  ? modalData.education.map(
                                                      (j, index) => {
                                                        return (
                                                          <>
                                                            {" "}
                                                            <div key={index}>
                                                              {j.qualification_id
                                                                ? j.qualification_id
                                                                : "Not Available"}{" "}
                                                              <br />
                                                            </div>
                                                          </>
                                                        );
                                                      }
                                                    )
                                                  : "Not Available"}
                                              </span>
                                            </div>
                                          </Modal.Body>
                                        </Modal>
                                      </div>
                                    </td>
                                  </tr>
                                </>
                              );
                            }) : (
                              <tr>
                                <td
                                  colSpan={5}
                                  style={{ height: "285px", border: "none" }}
                                  className="latestApplicationNoData-td"
                                >
                                  No data found
                                </td>
                              </tr>
                            )}
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="dashboard-content">
                    <div className="charts-Heading">
                      <h3>Active Jobs</h3>
                      <div className="yearly-charts">
                        <Link
                          href="/employer/jobs"
                          className="text-decoration-none"
                        >
                          View All
                        </Link>
                      </div>
                    </div>
                    <div className="openJobs">
                      {activeJobs.length > 0 ? (
                        activeJobs.slice(0, 5).map((i) => {
                          return (
                            <>
                              <div className="FirstJob">
                                <p>{i.job_name.substring(0, 20)}..</p>

                                <span>
                                  Required Experience <br />
                                  <p className="float-right">
                                    Exp: {i.min_exp} Years
                                  </p>
                                </span>
                              </div>
                            </>
                          );
                        })
                      ) : (
                        <p className="noRecords text-center">No Active Jobs</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="candidateOfferSection">
              <div className="row">
                <div className="col-lg-8 col-sm-12 col-md-12">
                  <div className="dashboard-content">
                    <div className="charts-Heading">
                      <h3>Candidates - Offered Job</h3>
                      {/* <div className="yearly-charts">
                        <Link href="" className="yearly-view">
                          Yearly View
                        </Link>
                        <Link href="" class="monthly-view">
                          Monthly View -
                        </Link>
                        <select class="FilteredMonth">
                          <option value="jan">Jan</option>
                          <option value="feb">Feb</option>
                          <option value="mar">Mar</option>
                          <option value="apr">Apr</option>
                          <option value="may">May</option>
                          <option value="june">June</option>
                          <option value="july">July</option>
                          <option value="aug">August</option>
                          <option value="sep">September</option>
                          <option value="oct">October</option>
                          <option value="nov">Nov</option>
                          <option value="dec">Dec</option>
                        </select>
                      </div> */}
                    </div>
                    <div className="latest-applications" style={{ minHeight: "340px" }}>
                      <thead class="text-xs text-gray-700 uppercase border-b-2">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Candidate Info
                          </th>
                          <th scope="col">Email Address</th>
                          <th scope="col">Phone</th>
                          <th scope="col">Created</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidateOfferedJobData.length > 0 ? (
                          candidateOfferedJobData.map((i) => {
                            return (
                              <>
                                <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50  px-6 py-3 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                  <td className="latestApplicationData-td">
                                    <div className="userInfo">
                                      {i.profile_image !== "" ? (
                                        <Image
                                          src={i.profile_image}
                                          alt="user-image"
                                          width={50}
                                          height={50}
                                        />
                                      ) : (
                                        <Image
                                          src="/Images/adminSide/dummy-profile.png"
                                          alt="user-image"
                                          width={50}
                                          height={50}
                                        />
                                      )}
                                    </div>
                                    <div className="contactInfo">
                                      <span>
                                        {i.first_name} {i.last_name}
                                      </span>
                                      <span>Gender: {i.gender}</span>
                                    </div>
                                  </td>
                                  <td className="latestApplicationData-td">
                                    <div className="socialInfo">
                                      <Tooltip title={i.email_address}>
                                        <span>
                                          <i className="fa-regular fa-envelope"></i>
                                          {i.email_address.slice(0, 15)}...
                                        </span>
                                      </Tooltip>
                                    </div>
                                  </td>
                                  <td className="latestApplicationData-td">
                                    <div className="socialInfo">
                                      <span>
                                        <i className="fa fa-phone"></i>
                                        {i.contact_number}
                                      </span>
                                    </div>
                                  </td>

                                  <td className="latestApplicationData-td">
                                    <div className="joinDatee">
                                      <i className="fa fa-calendar"></i>
                                      <span>{i.date_of_birth}</span>
                                    </div>
                                  </td>
                                  <td className="latestApplicationData-td">
                                    <div className="action-btn">
                                      <Button
                                        variant="primary"
                                        onClick={() => handleOpen(i)}
                                        className="btn-View"
                                      >
                                        <i className="fa fa-eye"></i>
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              </>
                            );
                          })
                        ) : (
                          <p className="noRecords text-center">No Records</p>
                        )}
                      </tbody>
                    </div>
                    {/* <div className="chart-type">
                      <span>Recruited Candidate Month Wise</span>
                    </div> */}
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="dashboard-content">
                    <div className="charts-Heading">
                      <h3>Candidates - Offer Accepted</h3>
                      <div className="yearly-charts">
                        <Link
                          href="/employer/selected-candidates"
                          className="text-decoration-none"
                        >
                          View All
                        </Link>
                      </div>
                    </div>
                    <div className="openJobs">
                      {candidateAcceptedJobOffer.length > 0 ? (
                        candidateAcceptedJobOffer.map((i) => {
                          return (
                            <div className="FirstJob" key={i.candidate_id}>
                              <div className="new-recruite-txt blue-dot">
                                <p>
                                  {i.first_name} {i.last_name}
                                </p>
                                <span>
                                  Position: {i.designation || "Not Available"}
                                </span>
                              </div>

                              <div className="required-txt">
                                <p>Job Name</p>
                                <span>
                                  {i.job_name ? i.job_name : "Not Available"}{" "}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="noRecords text-center">No Records</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div cassName="dashboard-content my-4">
                  <div className="dashboard-content my-4 ">
                    <div className="charts-Heading">
                      <h3>Activity Log</h3>
                      <div className="yearly-charts">
                        <select class="applyMonths">
                          <option>Any Time</option>
                          <option>Weekly</option>
                          <option>3 Days</option>
                          <option>4 Days</option>
                          <option>5 Days</option>
                        </select>
                        <Link href="" className="text-decoration-none Allview">
                          View All
                        </Link>
                      </div>
                    </div>
                    <div className="activity-log-list TableScroll">
                      <table>
                        <thead>
                          <tr>
                            <th>Created </th>
                            <th>Staff Name & Activity</th>
                            <th>Jobseeker Name</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>09:45 AM</td>
                            <td>
                              <span
                                style={{ color: "#0089C8", fontWeight: "500" }}
                              >
                                Juliya
                              </span>{" "}
                              has published the job opening Product Analyst.
                            </td>
                            <td>Jack Ronaldo</td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Yesterday - 10:20 AM</td>
                            <td>
                              <span
                                style={{ color: "#0089C8", fontWeight: "500" }}
                              >
                                Riyon{" "}
                              </span>{" "}
                              has published the job opening Product Analyst.
                            </td>
                            <td>Jack Ronaldo</td>
                            <td>
                              <div className="action-btn">
                                <button className="btn  btn-warning btn-Edittt">
                                  <i class="fa-solid fa-square-pen"></i>
                                </button>

                                <Button
                                  variant="primary"
                                  onClick={slide1}
                                  className="btn btn-info btn-View"
                                >
                                  <i className="fa fa-eye text-white"></i>
                                </Button>

                                {slider && (
                                  <CandidateModal
                                    onClose={() => setslider(false)}
                                    profileData={modalData}
                                  />
                                )}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div cassName="dashboard-content my-4">
                  <div className="dashboard-content my-4 ">
                    <div className="charts-Heading">
                      <h3>Job Applicants</h3>
                    </div>
                    <div className="latest-applications">
                      <p>
                        Showing Manufacturers from this month{" "}
                        <span className="boldCharac">(March 1 </span> to{" "}
                        <span className="boldCharac"> March 27)</span>{" "}
                      </p>
                    </div>
                    <div className="chart-type">
                      <span>Total 1 Manufacturers in last 8 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {slider && (
          <CandidateModal
            onClose={() => setslider(false)}
            profileData={modalData}
          />
        )}

        <AdminFooter />
      </EmployerLayout>
    </>
  );
};

export default Page;
