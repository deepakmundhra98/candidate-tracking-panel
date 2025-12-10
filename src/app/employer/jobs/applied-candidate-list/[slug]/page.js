"use client";
import React from "react";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";
import "../../../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import AdminFooter from "../../../../admin/Components/AdminFooter/AdminFooter";
import EmployerLayout from "../../../EmployerLayout";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import BaseAPI from "../../../../BaseAPI/BaseAPI";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import HTMLReactParser from "html-react-parser";
import Image from "next/image";

const Page = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const token = Cookies.get("tokenEmployer");

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [jobDetails, setJobDetails] = useState([]);
  const getData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + `/admin/jobs/user/appliedcandidatelistforjob`,
        { job_id: params.slug },
        {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setUserData(response.data.response.candidateList);
      setJobDetails(response.data.response.jobName);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleOpen = (eachData) => {
    setSelectedRecord(eachData);
    handleShowModal(eachData);
    // console.log(eachData);
  };

  const handleShowModal = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    // Filter skills based on the keyword
    const filtered = userData.filter(
      (userData) =>
        userData.first_name.toLowerCase().includes(keyword.toLowerCase()) ||
        userData.last_name.toLowerCase().includes(keyword.toLowerCase()) ||
        userData.email.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredData(filtered);
    // console.log(filtered);
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearchKeyword("");
    setFilteredData();
  };

  const columns = [
    { field: "candidate_name", headerName: "Candidate Name", width: 250, flex: 1 },
    { field: "email_address", headerName: "Email", width: 350, flex: 1 },
    { field: "job_applied_date", headerName: "Applied on", width: 250, flex: 1 },
    {
      field: "action",
      headerName: "Action",
      width: 250,
      flex: 1,
      renderCell: (params) => (
        <strong>
          <div className="process__actionnn" style={{ margin: "10px 0" }}>
            <Button
              variant="primary"
              onClick={(e) => {
                handleOpen(params.row);
                e.stopPropagation();
              }}
              className="btn btn-info btn-smmm"
              title="View Candidate Details"
            >
              <i className="fa fa-eye"></i>
            </Button>
          </div>
        </strong>
      ),
    },
  ];

  const rows = filteredData
    ? filteredData?.map((item) => ({
        id: item.candidate_id,
        address: item.address,
        application_number: item.application_number,
        contact_number: item.contact_number,
        date_of_birth: item.date_of_birth,
        document_cv: item.document_cv,
        draft_status: item.draft_status,
        email_address: item.email,
        employer_id: item.employer_id,
        employer_name: item.employer_name,
        first_name: item.first_name,
        gender: item.gender,
        interview_round: item.interview_round,
        interview_status: item.interview_status,
        is_interiew_scheduled: item.is_interiew_scheduled,
        is_rejected: item.is_rejected,
        job_application_status: item.job_application_status,
        job_id: item.job_id,
        job_name: item.job_name,
        last_name: item.last_name,
        marital_status: item.marital_status,
        offer_letter_status: item.offer_letter_status,
        on_boarding_status: item.on_boarding_status,
        physically_challenged: item.physically_challenged,
        process_id: item.process_id,
        profile_img: item.profile_img,
        slug: item.slug,
        status: item.status,
        job_applied_date: item.job_applied_date,
        candidate_name: item.first_name + " " + item.last_name,
      }))
    : userData?.map((item) => ({
        id: item.candidate_id,
        address: item.address,
        application_number: item.application_number,
        contact: item.contact_number,
        date_of_birth: item.date_of_birth,
        cv_document: item.document_cv,
        draft_status: item.draft_status,
        email_address: item.email,
        employer_id: item.employer_id,
        employer_name: item.employer_name,
        firstName: item.first_name,
        gender: item.gender,
        interview_round: item.interview_round,
        interview_status: item.interview_status,
        is_interiew_scheduled: item.is_interiew_scheduled,
        is_rejected: item.is_rejected,
        job_application_status: item.job_application_status,
        job_id: item.job_id,
        job_name: item.job_name,
        lastName: item.last_name,
        marital_status: item.marital_status,
        middle_name: item.middle_name,
        offer_letter_status: item.offer_letter_status,
        on_boarding_status: item.on_boarding_status,
        physically_challenged: item.physically_challenged,
        process_id: item.process_id,
        profile_image: item.profile_img,
        slug: item.slug,
        status: item.status,
        job_applied_date: item.job_applied_date,
        candidate_name: item.first_name + " " + item.last_name,
        education: item.educationData,
        experience: item.experienceData,
      }));

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <EmployerLayout>
        {loading && <div className="loader-container"></div>}

        <div
          className=" backgroundColour adminChangeUsername"
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
              <Link underline="hover" color="inherit" href="/employer/jobs">
                <div className="flex gap-2 items-center">
                  <i className="fa fa-list-alt"></i>
                  <span>
                    Jobs <i class="fa-solid fa-angles-right text-xs"></i>
                  </span>
                </div>
              </Link>
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-briefcase"></i>
                <span> {jobDetails} <i class="fa-solid fa-angles-right text-xs"></i></span>
              </div>
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-users"></i>
                <span> Applied Candidates List</span>
              </div>
            </div>
          </div>
          <div className="">
            <div className="profilelogo">
              <h2>Applied Candidates List</h2>
            </div>

            <div className="serachKeyItems  bg-white">
              <form action="">
                <p>Search Job by typing Candidate Name, Email</p>
                <div className="flex flex-col md:flex-row">
                  <input
                    type="text"
                    className="formm-control  w-100 mb-2 md:mb-0 md:mr-2"
                    placeholder="Search By Keyword"
                    value={searchKeyword}
                    onChange={handleSearch}
                  />
                  <div className="flex flex-col md:flex-row md:h-11 items-center">
                    <button
                      className="btn btn-clearFilters"
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </form>
              <p style={{ marginTop: "10px" }}>
                Total number of candidates : {userData?.length > 0 ? userData.length : 0}
              </p>
            </div>

            <div className="interviewPreviewTable ">
              <div style={{ height: "auto", width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 20 },
                    },
                  }}
                  pageSizeOptions={[10, 20, 50, 100]}
                  checkboxSelection
                />
              </div>

              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton className="bg-red-500 text-white">
                  <Modal.Title>
                    Details of {selectedRecord?.firstName}{" "}
                    {selectedRecord?.lastName}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedRecord && (
                    <div>
                      <div className="dDrt flex align-items-center">
                        <span>Profile Image :</span>
                        {selectedRecord.profile_image !== "" ? (
                          <Image
                            src={selectedRecord.profile_image}
                            alt="profile-image"
                            width={190}
                            height={50}
                            className="modalProfileImage"
                          />
                        ) : (
                          <Image
                            src="/Images/adminSide/dummy-profile.png"
                            alt="profile-image"
                            width={130}
                            height={30}
                            className="modalProfileImage"
                            style={{ borderRadius: "50%" }}
                          />
                        )}
                      </div>
                      <div className="dDrt">
                        <span>First Name: </span>
                        {selectedRecord && selectedRecord.firstName}
                      </div>
                      <div className="dDrt">
                        <span>Miiddle Name: </span>
                        {selectedRecord.middle_name
                          ? selectedRecord.middle_name
                          : "N/A"}
                      </div>
                      <div className="dDrt">
                        <span>Last Name: </span>
                        {selectedRecord && selectedRecord.lastName}
                      </div>
                      <div className="dDrt">
                        <span>Email :</span>
                        {selectedRecord.email_address
                          ? selectedRecord.email_address
                          : "N/A"}
                      </div>
                      <div className="dDrt">
                        <span>Phone : </span>
                        {selectedRecord && selectedRecord.contact
                          ? selectedRecord.contact
                          : "N/A"}
                      </div>
                      <div className="dDrt">
                        <span>Date Of Birth : </span>
                        {selectedRecord && selectedRecord.date_of_birth
                          ? selectedRecord.date_of_birth
                          : "N/A"}
                      </div>
                      <div className="dDrt">
                        <span>Gender : </span>
                        {selectedRecord.gender}
                      </div>
                      <div className="dDrt">
                        <span>Marital Status : </span>
                        {selectedRecord.marital_status}
                      </div>
                      <div className="dDrt">
                        <span>Physically Challenged : </span>
                        {selectedRecord.physically_challenged}
                      </div>
                      <div className="dDrt">
                        <span>Address : </span>
                        {selectedRecord.address
                          ? selectedRecord.address
                          : "N/A"}
                      </div>
                      <div className="dDrt">
                        ------------------------------------------
                      </div>

                      {selectedRecord.education?.map((i, index) => {
                        return (
                          <>
                            <div className="dDrt modalSubHeader">
                              <h4>Education Qualification {index + 1}</h4>
                            </div>
                            <div className="dDrt">
                              <span>Qualification : </span>
                              {i.qualification_id}
                            </div>
                            <div className="dDrt">
                              <span>Course subjects : </span>
                              {i.course}
                            </div>
                            <div className="dDrt">
                              <span>School/college : </span>
                              {i.school_college}
                            </div>
                            <div className="dDrt">
                              <span>City : </span>
                              {i.city}
                            </div>
                            <div className="dDrt">
                              <span>University : </span>
                              {i.university_board}
                            </div>
                            <div className="dDrt">
                              <span>Year of passing : </span>
                              {i.passing_year}
                            </div>
                          </>
                        );
                      })}

                      <div className="dDrt">
                        ------------------------------------------
                      </div>

                      {selectedRecord.experience?.map((i, index) => {
                        return (
                          <>
                            <div className="dDrt modalSubHeader">
                              <h4>Experience Details {index + 1}</h4>
                            </div>
                            <div className="dDrt">
                              <span>Date from : </span>
                              {i.start_date.split("-").reverse().join("-")}
                            </div>
                            <div className="dDrt">
                              <span>Date to : </span>
                              {i.end_date.split("-").reverse().join("-")}
                            </div>
                            <div className="dDrt">
                              <span>Name of organization : </span>
                              {i.organisation_name}
                            </div>
                            <div className="dDrt">
                              <span>Designation : </span>
                              {i.designation}
                            </div>
                            <div className="dDrt">
                              <span>Reason of leaving : </span>
                              {i.reason_of_leaving}
                            </div>
                            <div className="dDrt">
                              ------------------------------------------
                            </div>
                          </>
                        );
                      })}

                      <div className="dDrt modalSubHeader">
                        <h4>Additional Details</h4>
                      </div>
                      <div className="dDrt">
                        <span>CV Document : </span>
                        <Link
                          href={selectedRecord.cv_document}
                          target="_blank"
                          style={{ color: "blue" }}
                        >
                          Download
                        </Link>
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

              {/* <div className="BottomButtom">
                <button className="btn btn-dark btn-Activateee">
                  Activate
                </button>
                <button className="btn btn-dark btn-Activateee">
                  Deactivate
                </button>
                <button className="btn btn-dark btn-Activateee">Delete</button>
              </div> */}
            </div>
          </div>
        </div>
        <AdminFooter />
      </EmployerLayout>
    </>
  );
};

export default Page;
