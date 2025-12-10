"use client";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DashboardChart from "@/app/staff/Components/DashboardChart";
import Link from "next/link";
import "../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import StaffLayout from "../StaffLayout";
import axios from "axios";
import BaseAPI from "../../BaseAPI/BaseAPI";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import AdminFooter from "../../admin/Components/AdminFooter/AdminFooter";
import Image from "next/image";
import CandidateModal from "@/app/Components/CandidateModal/CandidateModal";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Page = () => {
  const [slider, setslider] = useState(false);
  const token = Cookies.get("tokenStaff");

  const slide1 = () => setslider(true);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState();
  const [activeJobs, setActiveJobs] = useState([]);
  const [latestApplications, setlatestApplications] = useState([]);
  const [dashboardChartData, setDashboardChartData] = useState([]);
  const fname = Cookies.get("fname");
  const staffId = Cookies.get("staffId");

  const [notificationData, setNotificationData] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(true);

  const handleOpen = (eachData) => {
    setslider(true);
    setModalData(eachData);
  };
  const handleinterview = (eachData) => {
    setLgShow(true);
    setModalData(eachData);
  };

  const getData = async () => {
    try {
      const response = await axios.post(BaseAPI + "/admin/dashboard", null, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + " " + token,
        },
      });

      setlatestApplications(response.data.response.latestApplications);
      setDashboardChartData(response.data.response.dashboardChartData);
      setLoading(false);
      setActiveJobs(response.data.response.activeJobsData);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const getNotifications = async () => {
    try {
      setNotificationLoading(true);
      const response = await axios.post(
        BaseAPI + `/admin/get-staff-notification`,
        { staff_id: staffId },
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

  return (
    <>
      <StaffLayout>
        {loading && <div className="loader-container"></div>}
        <div className=" backgroundColour" style={{ minHeight: "80vh" }}>
          <div className="dashboardBody">
            <div className="profilelogo mt-[25px] mb-[20px]">
              <h2>Welcome To Your Staff Panel</h2>
            </div>
            <div className="dashboard-content">
              <div className="charts-Heading">
                <h3>Analytics</h3>
              </div>
              <div className="chart-type">
                <DashboardChart chartData={dashboardChartData} />
              </div>
            </div>

            <div className="interviewPreviewTable mt-3">
              <div className=" ">
                <div className="dashboard-content my-4">
                  <div className="charts-Heading">
                    <h3>Latest Interviews Assigned</h3>
                    <div className="yearly-charts">
                      <Link href="" className="text-decoration-none">
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
                          {latestApplications !== null &&
                          latestApplications.length > 0 ? (
                            latestApplications.slice(0, 5).map((i) => (
                              <tr
                                key={i.id}
                                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 px-6 py-3 even:dark:bg-gray-800 border-b dark:border-gray-700"
                              >
                                <td>
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
                                    <span>{i.candidate_name}</span>
                                    <span>Gender: {i.gender}</span>
                                  </div>
                                </td>
                                <td>
                                  <div className="socialInfo">
                                    <span>
                                      <i className="fa-regular fa-envelope"></i>
                                      {i.email_address}
                                    </span>
                                    <span>
                                      <i className="fa fa-phone"></i>
                                      {i.contact}
                                    </span>
                                  </div>
                                </td>
                                <td className="desigNation">{i.job_name}</td>
                                <td>
                                  <div className="joinDatee">
                                    <i className="fa fa-calendar"></i>
                                    <span>{i.created_at}</span>
                                  </div>
                                </td>
                                <td>
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
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center py-6">
                                <div className="flex justify-center items-center">
                                  No Data Found
                                </div>
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

            {/* <div className="row">
              <div className="col-lg-8 col-sm-12 col-md-12">
                <div className="dashboard-content my-4">
                  <div className="charts-Heading">
                    <h3>Upcoming Interviews</h3>
                    <div className="yearly-charts">
                      <Link href="" className="text-decoration-none">
                        View All
                      </Link>
                    </div>
                  </div>
                  <div className="latest-applications TableScroll">
                    <table>
                      <tr>
                        <th scope="col">Candidate </th>
                        <th scope="col"> Interviewer</th>
                        <th scope="col"> Schedule</th>

                        <th scope="col">Action</th>
                      </tr>
                      {latestApplications !== null &&
                        latestApplications.slice(0, 5).map((i) => {
                          return (
                            <>
                              <tr>
                                <td>
                                  <div className="contactInfo">
                                    <span>{i.candidate_name}</span>
                                  </div>
                                </td>
                                <td>
                                  <div className="socialInfo">
                                    <span>{i.interviewer_name}</span>
                                  </div>
                                </td>

                                <td>
                                  <div className="joinDatee">
                                    <span>{i.created_at}</span>
                                  </div>
                                </td>
                                <td>
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
                                          Interview Details
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
                                          <label>Interviewer Name :</label>
                                          <span>
                                            {modalData &&
                                            modalData.interviewer_name
                                              ? modalData.interviewer_name
                                              : "Not Available"}
                                          </span>
                                        </div>
                                        <div className="interview-bx-details">
                                          <label>Schedule :</label>
                                          <span>
                                            {modalData && modalData.start_time
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
                                                        (
                                                        {j.start_date
                                                          ? j.start_date
                                                          : "Not available"}
                                                        ) (
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
                        })}
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12 col-sm-12">
                <div className="dashboard-content my-4">
                  <div className="charts-Heading">
                    <h3>Active Jobs</h3>
                    <div className="yearly-charts">
                      <Link href="/staff/jobs" className="text-decoration-none">
                        View All
                      </Link>
                    </div>
                  </div>
                  <div className="openJobs">
                    {activeJobs.length > 0 ? (
                      activeJobs.map((i) => {
                        return (
                          <>
                            <div className="FirstJob">
                              <Link href="">
                                {i.job_name.substring(0, 20)}..
                              </Link>

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
                      <>
                        {" "}
                        <p style={{ padding: "25px" }}>No Jobs Available</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div> */}

            {/* <div className="row">
              <div className="col-lg-8 col-sm-12 col-md-12">
                <div className="dashboard-content my-4 ">
                  <div className="charts-Heading">
                    <h3>Recruited Candidates</h3>
                    <div className="yearly-charts">
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
                    </div>
                  </div>
                  <div className="latest-applications"></div>
                  <div className="chart-type">
                    <span>Recruited Candidate Month Wise</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12 col-sm-12">
                <div className="dashboard-content my-4">
                  <div className="charts-Heading">
                    <h3>New Recruited</h3>
                    <div className="yearly-charts">
                      <Link href="" className="text-decoration-none">
                        View All
                      </Link>
                    </div>
                  </div>
                  <div className="openJobs">
                    <div className="FirstJob">
                      <div className="new-recruite-txt blue-dot">
                        <p>Oliver Josh</p>
                        <span>Hire Date: 22-03-2021</span>
                      </div>

                      <div className="required-txt">
                        <p>Required Experience</p>
                        <span>Expr 2 years</span>
                      </div>
                    </div>
                    <div className="FirstJob">
                      <div className="new-recruite-txt orange-dot">
                        <p>Oliver Josh</p>
                        <span>Hire Date: 22-03-2021</span>
                      </div>

                      <div className="required-txt">
                        <p>Required Experience</p>
                        <span>Exp: 1 Years</span>
                      </div>
                    </div>
                    <div className="FirstJob">
                      <div className="new-recruite-txt green-dot">
                        <p>Oliver Josh</p>
                        <span>Hire Date: 22-03-2021</span>
                      </div>
                      <div className="required-txt">
                        <p>Required Experience</p>
                        <span>Exp: 2 Years</span>
                      </div>
                    </div>
                    <div className="FirstJob">
                      <div className="new-recruite-txt red-dot">
                        <p>Oliver Josh</p>
                        <span>Hire Date: 22-03-2021</span>
                      </div>
                      <div className="required-txt">
                        <p>Required Experience</p>
                        <span>Exp: 2 Years</span>
                      </div>
                    </div>
                    <div className="FirstJob">
                      <div className="new-recruite-txt skyblue-dot">
                        <p>Oliver Josh</p>
                        <span>Hire Date: 22-03-2021</span>
                      </div>

                      <div className="required-txt">
                        <p>Required Experience</p>
                        <span>Exp: 2 Years</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            {/* <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div cassName="dashboard-content my-3">
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
                                <Modal show={slider} onHide={slideClose}>
                                  <Modal.Header
                                    closeButton
                                    className="bg-red-500 text-white"
                                  >
                                    <Modal.Title>
                                      {modalData && modalData.first_name}{" "}
                                      {modalData && modalData.last_name}
                                    </Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body className="mb-10">
                                    <div className="dDrt flex align-items-center">
                                      <span>Profile Image :</span>
                                      {modalData &&
                                      modalData.profile_image !== "" ? (
                                        <Image
                                          src={modalData.profile_image}
                                          alt="profile-image"
                                          width={190}
                                          height={50}
                                        />
                                      ) : (
                                        <Image
                                          src="/Images/adminSide/dummy-profile.png"
                                          alt="profile-image"
                                          width={190}
                                          height={50}
                                        />
                                      )}
                                    </div>
                                    <div className="dDrt">
                                      <span>First Name: </span>
                                      {modalData && modalData.first_name}
                                    </div>
                                    <div className="dDrt">
                                      <span>Middle Name: </span>
                                      {modalData &&
                                        modalData.middle_name}
                                    </div>
                                    <div className="dDrt">
                                      <span>Last Name: </span>
                                      {modalData && modalData.last_name}
                                    </div>
                                    <div className="dDrt">
                                      <span>Email :</span>
                                      {modalData && modalData.email_address}
                                    </div>
                                    <div className="dDrt">
                                      <span>Phone : </span>
                                      {modalData && modalData.contact}
                                    </div>
                                    <div className="dDrt">
                                      <span>Date Of Birth : </span>
                                      {modalData && modalData.date_of_birth}
                                    </div>
                                    <div className="dDrt">
                                      <span>Gender : </span>
                                      {modalData && modalData.gender}
                                    </div>
                                    <div className="dDrt">
                                      <span>Martial Status : </span>
                                      {modalData && modalData.martial_status}
                                    </div>
                                    <div className="dDrt">
                                      <span>Physically Challenged : </span>
                                      {modalData &&
                                        modalData.physically_challenged}
                                    </div>
                                    <div className="dDrt">
                                      <span>Address : </span>
                                      {modalData && modalData.address !== ""
                                        ? modalData.address
                                        : "N/A"}
                                    </div>
                                    <div className="dDrt">
                                      ------------------------------------------
                                    </div>
                                    <div className="dDrt modalSubHeader">
                                      <h4>Education Qualification</h4>
                                    </div>
                                    {modalData &&
                                      modalData.education?.map((j) => {
                                        return (
                                          <>
                                            <div className="dDrt">
                                              <span>Qualification : </span>
                                              {j.qualification_id
                                                ? j.qualification_id
                                                : "Not available"}
                                            </div>
                                            <div className="dDrt">
                                              <span>Course subjects : </span>
                                              {j.course
                                                ? j.course
                                                : "Not available"}
                                            </div>
                                            <div className="dDrt">
                                              <span>School college : </span>
                                              {j.school_college
                                                ? j.school_college
                                                : "Not available"}
                                            </div>
                                            <div className="dDrt">
                                              <span>City : </span>
                                              {j.city
                                                ? j.city
                                                : "Not available"}
                                            </div>
                                            <div className="dDrt">
                                              <span>University : </span>
                                              {j.university_board
                                                ? j.university_board
                                                : "Not available"}
                                            </div>
                                            <div className="dDrt">
                                              <span>Year of passing : </span>
                                              {j.passing_year
                                                ? j.passing_year
                                                : "Not available"}
                                            </div>
                                          </>
                                        );
                                      })}
                                    <div className="dDrt">
                                      ------------------------------------------
                                    </div>

                                    <div className="dDrt modalSubHeader">
                                      <h4>Experience Details</h4>
                                    </div>
                                    {modalData &&
                                      modalData.experience?.map((j) => {
                                        return (
                                          <>
                                            <div className="dDrt">
                                              <span>Date from : </span>
                                              {j.start_date
                                                ? j.start_date
                                                    .split("-")
                                                    .reverse()
                                                    .join("-")
                                                : "Not available"}
                                            </div>
                                            <div className="dDrt">
                                              <span>Date to : </span>
                                              {j.end_date
                                                ? j.end_date
                                                    .split("-")
                                                    .reverse()
                                                    .join("-")
                                                : "Not available"}
                                            </div>
                                            <div className="dDrt">
                                              <span>
                                                Name of organization :{" "}
                                              </span>
                                              {j.organisation_name
                                                ? j.organisation_name
                                                : "Not available"}
                                            </div>
                                            <div className="dDrt">
                                              <span>Designation : </span>

                                              {j.designation
                                                ? j.designation
                                                : "Not available"}
                                            </div>
                                            <div className="dDrt">
                                              <span>Reason of leaving : </span>
                                              {j.reason_of_leaving
                                                ? j.reason_of_leaving
                                                : "Not available"}
                                            </div>
                                          </>
                                        );
                                      })}
                                    <div className="dDrt">
                                      ------------------------------------------
                                    </div>
                                    <div className="dDrt modalSubHeader">
                                      <h4>Additional Details</h4>
                                    </div>
                                    <div className="dDrt">
                                      <span>CV Document : </span>
                                      <Link
                                        href={modalData && modalData.document_cv}
                                        target="_blank"
                                        style={{ color: "blue" }}
                                      >
                                        Download
                                      </Link>
                                    </div>
                                  </Modal.Body>
                                </Modal>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* <div className="row">
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
      </StaffLayout>
    </>
  );
};

export default Page;
