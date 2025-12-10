"use client";
import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import Cookies from "js-cookie";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../common.css";
import HTMLReactParser from "html-react-parser";
import Image from "next/image";
import Swal from "sweetalert2";
import Link from "next/link";
import JobModal from "@/app/Components/JobModal/JobModal";

const Page = () => {
  const candidateToken = Cookies.get("tokenCandidate");
  const [personalData, setPersonalData] = useState([]);
  const [appliedJobsData, setAppliedJobsData] = useState([]);
  const [JobModalData, setJobModalData] = useState({});
  const [jobModal, setJobModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleJobOpen = (eachData) => {
    setJobModal(true);
    setShowModal(true);
    setJobModalData(eachData);
  };

  const handleCloseJobModal = () => {
    setJobModal(false);
    setJobModalData(null);
  };
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [candidateProfileImage, setCandidateProfileImage] = useState("");

  useEffect(() => {
    const image = Cookies.get("candidate_profile_image");
    if (image) {
      setCandidateProfileImage(image);
    }
  }, []);
  // let candidateProfileImage = Cookies.get("candidate_profile_image");
  let employerid = Cookies.get("candidates_employer_id");
  const handleOpen = (eachData) => {
    setSelectedRecord(eachData);
    handleShowModal(eachData);
  };

  const handleShowModal = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5; // Number of jobs to display per page

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = appliedJobsData.slice(indexOfFirstJob, indexOfLastJob);
  const getDashboardData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + "/admin/candidates/dashboard",
        { employer_id: employerid },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + candidateToken,
          },
        }
      );
      setLoading(false);
      setPersonalData(response.data.response.personalDetailsData);
      setAppliedJobsData(response.data.response.appliedJobs);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Swal.fire({
        text: "Please select a file first.",
        icon: "warning",
      });
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const response = await axios.post("YOUR_UPLOAD_API_ENDPOINT", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        title: "Resume uploaded successfully!",
        icon: "success",
      });
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Failed to upload resume.");
    }
  };

  // console.log(candidateProfileImage, "dashboard");
  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <Header />
        {loading && <div className="loader-containerNormal"></div>}
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <div className="flex items-center">
                  {candidateProfileImage ? (
                    <Image
                      width={80}
                      height={80}
                      src={candidateProfileImage}
                      alt="User Profile Picture"
                      className="h-20 w-20 rounded-full"
                    />
                  ) : (
                    <Image
                      width={110}
                      height={110}
                      src="/Images/adminSide/dummy-profile.png"
                      alt="User Profile Picture"
                      className="h-20 w-20 rounded-full"
                    />
                  )}

                  <div className="ml-4">
                    <h2 className="text-xl font-semibold">
                      {personalData.first_name} {personalData.last_name}
                    </h2>
                    <p className="text-gray-600">{personalData.email}</p>
                    {/* <div className="flex items-center mt-2">
                      <span className="text-yellow-500">
                        <i className="fas fa-star"></i>
                      </span>
                      <span className="text-yellow-500">
                        <i className="fas fa-star"></i>
                      </span>
                      <span className="text-yellow-500">
                        <i className="fas fa-star"></i>
                      </span>
                      <span className="text-yellow-500">
                        <i className="fas fa-star"></i>
                      </span>
                      <span className="text-gray-300">
                        <i class="fa fa-star" aria-hidden="true"></i>
                      </span>
                      <span className="ml-2 text-gray-600">4.0</span>
                    </div> */}
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      Profile Completion (GOOD)
                    </span>
                    <span className="text-gray-600">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="w-50">
                      {/* Update Resume Button */}
                      <button
                        onClick={handleToggle}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg w-full"
                      >
                        Update Resume
                      </button>

                      {/* Smooth Accordion */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? "max-h-40 mt-4" : "max-h-0"
                        }`}
                      >
                        <div className="bg-gray-100 p-4 rounded-lg">
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full mb-2 border p-2 rounded-lg"
                          />
                          <button
                            onClick={handleUpload}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg w-full"
                          >
                            Upload
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <span className="block text-gray-600">
                          {appliedJobsData.length}
                        </span>
                        <span className="block text-gray-400 text-sm">
                          Jobs Applied
                        </span>
                      </div>

                      {/* <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input type="checkbox" className="sr-only" />
                          <div className="block bg-gray-200 w-10 h-6 rounded-full"></div>
                          <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                        </div>
                        <span className="ml-3 text-gray-600">
                          Actively applying
                        </span>
                      </label> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Talent Center</h2>
                <div className="flex space-x-4 mb-4">
                  <button className="text-purple-600 border-b-2 border-purple-600 pb-2">
                    Applied Jobs
                  </button>
                  {/* <button className="text-gray-600 pb-2">
                    Recommended Jobs
                  </button> */}
                  {/* <button className="text-gray-600 pb-2">Saved Jobs</button> */}
                </div>
                <div className="space-y-4">
                  {currentJobs.length > 0 ? (
                    currentJobs.map((i, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <h3 className="text-lg font-semibold">
                            {i.job_title}
                          </h3>
                          <p className="text-gray-600">
                            (Exp: {i.min_exp} - {i.max_exp} Years)
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {i.skill.split(",").map((skill, index) => (
                              <span
                                key={index}
                                className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-sm"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center text-gray-600 mt-2">
                            <i className="fas fa-map-marker-alt"></i>
                            <span className="ml-1">{i.location}</span>
                            <span className="mx-2">•</span>
                            <span>{i.work_type}</span>
                            <span className="mx-2">•</span>
                            <span>
                              {i.min_salary} - {i.max_salary}
                            </span>
                          </div>
                        </div>
                        <button
                          className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg"
                          onClick={() => handleJobOpen(i)}
                        >
                          View
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-600">No applied jobs</p>
                  )}
                </div>
                <div className="mt-6 text-center">
                  <button
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg mx-1"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg mx-1"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={indexOfLastJob >= appliedJobsData.length}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Profile Details</h2>
                  {/* <a href="#" className="text-purple-600">
                    See more
                  </a> */}
                </div>
                <div className="mt-4 grid">
                  <div className="">
                    <div className="flex">
                      <p className="font-semibold w-36">First Name:</p>
                      <p className="w-64">{personalData.first_name}</p>
                    </div>
                    <div className="flex">
                      <p className="font-semibold w-36">Middle Name:</p>
                      <p className="w-56">
                        {personalData.middle_name
                          ? personalData.middle_name
                          : "Not Applicable"}
                      </p>
                    </div>
                    <div className="flex">
                      <p className="font-semibold w-36">Last Name:</p>
                      <p className="w-56">{personalData.last_name}</p>
                    </div>
                    <div className="flex">
                      <p className="font-semibold w-36">Email:</p>
                      <p className="w-50 text-sm">{personalData.email}</p>
                    </div>
                    <div className="flex">
                      <p className="font-semibold w-36">Contact Number:</p>
                      <p className="w-56">{personalData.contact_number}</p>
                    </div>
                    <div className="flex">
                      <p className="font-semibold w-36">Date of Birth:</p>
                      <p className="w-56">{personalData.date_of_birth}</p>
                    </div>
                    <div className="flex">
                      <p className="font-semibold w-36">Gender:</p>
                      <p className="w-56">{personalData.gender}</p>
                    </div>
                    <div className="flex">
                      <p className="font-semibold w-36">Marital Status:</p>
                      <p className="w-56">{personalData.marital_status}</p>
                    </div>
                    <div className="flex">
                      <p className="font-semibold w-36">
                        Physically Challenged?:
                      </p>
                      <p className="w-56">
                        {personalData.physically_challenged}
                      </p>
                    </div>
                    <div className="flex">
                      <p className="font-semibold w-36">CV Document:</p>
                      {personalData.document_cv ? (
                        <Link className="w-56" href={personalData.document_cv}>
                          Download
                        </Link>
                      ) : (
                        <p className="w-56">Not Available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className="bg-red-500 text-white">
          <Modal.Title>
            {selectedRecord && selectedRecord.job_title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecord && (
            <div>
              <div className="dDrt">
                <span>Job Title: </span>
                {selectedRecord && selectedRecord.job_title}
              </div>
              <div className="dDrt">
                <span>Category: </span>
                {selectedRecord.category ? selectedRecord.category : "N/A"}
              </div>
              <div className="dDrt">
                <span>Industry: </span>
                {selectedRecord.industry ? selectedRecord.industry : "N/A"}
              </div>
              <div className="dDrt">
                <span>Designation: </span>
                {selectedRecord && selectedRecord.designation}
              </div>
              <div className="dDrt">
                <span>Location :</span>
                {selectedRecord && selectedRecord.location}
              </div>
              <div className="dDrt">
                <span>Experience required : </span>
                {selectedRecord && selectedRecord.min_exp
                  ? selectedRecord.min_exp
                  : "N/A"}{" "}
                -{" "}
                {selectedRecord && selectedRecord.max_exp
                  ? selectedRecord.max_exp
                  : "N/A"}{" "}
                Years
              </div>
              <div className="dDrt">
                <span>Annual Salary : </span>
                {selectedRecord && selectedRecord.min_salary
                  ? selectedRecord.min_salary
                  : "N/A"}{" "}
                -{" "}
                {selectedRecord && selectedRecord.max_salary
                  ? selectedRecord.max_salary
                  : "N/A"}
              </div>
              <div className="dDrt">
                <span>Skills required : </span>
                {selectedRecord.skill ? selectedRecord.skill : "N/A"}
              </div>
              <div className="dDrt">
                <span>Work Type : </span>
                {selectedRecord.work_type ? selectedRecord.work_type : "N/A"}
              </div>
              <div className="dDrt">
                <span>Job Posted By : </span>
                {selectedRecord.employer_name}
              </div>
              <div className="dDrt">
                <span>Interview Process Names:</span>
                <ul>
                  {selectedRecord.process_order_ids !== ""
                    ? selectedRecord.process_order_ids
                        .split(",")
                        .map((processName, index) => (
                          <li key={index}>
                            Process {index + 1}{" "}
                            <i className="fas fa-arrow-right"></i>{" "}
                            {processName !== "" ? processName.trim() : "N/A"}
                          </li>
                        ))
                    : "N/A"}
                </ul>
              </div>

              <div className="dDrt">
                <span>Job Description : </span>
                {selectedRecord.description &&
                  HTMLReactParser(selectedRecord.description)}
              </div>
              <div className="dDrt">
                ------------------------------------------
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}

      {showModal && (
        <JobModal
          onClose={() => {
            setShowModal(false);
            setJobModal(false);
            setJobModalData(null);
          }}
          jobData={JobModalData}
        />
      )}
    </>
  );
};

export default Page;
