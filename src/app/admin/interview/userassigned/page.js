"use client";
import React from "react";
import Link from "next/link";
import "../../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useState, useEffect } from "react";
import AdminFooter from "../../Components/AdminFooter/AdminFooter";
import AdminLayout from "../../AdminLayout";
import Cookies from "js-cookie";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Image from "next/image";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const slideClose = () => setslider(false);

  const [slider, setslider] = useState(false);

  const [userData, setUserData] = useState([]);

  const [modalData, setModalData] = useState();

  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");
  const userId = Cookies.get("adminId");

  // console.log(userId,"userid");

  const [mdShow, setMdShow] = useState(false);

  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);
  const handleOpen = (eachData) => {
    console.log(eachData, "here");
    setslider(true);
    setModalData(eachData);
  };

  const getData = async (userId) => {
    // console.log(id);
    try {
      const response = await axios.post(
        BaseAPI + `/admin/candidate/assignedinterviewstouser/${userId}`,

        null,
        {
          headers: {
            "Content-Type": "application/json",
            // key: ApiKey,
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setUserData(response.data.response);
      // console.log(response.candidateDetails)

      console.log();
    } catch (error) {
      console.log(error.message);
    }
  };

  const [candidateFeedbackData, setCandidateFeedbackData] = useState({
    candidate_id: "",
    user_assigned: userId,
    feedback: "",
  });

  const handleFeedbackModel = (eachData) => {
    // console.log(eachData, "here");
    setLgShow(true);

    setCandidateFeedbackData((prev) => ({
      ...prev,
      candidate_id: eachData.candidate_id,
    }));
  };

  const addFeedbacktoCandidate = async () => {

    console.log(setCandidateFeedbackData.candidate_id, "candidate_id");
    try {
      const response = await axios.post(
        BaseAPI + "/admin/candidate/addcandidatefeedback",
        candidateFeedbackData,
        {
          headers: {
            "Content-Type": "application/json",

            Authorization: "Bearer" + " " + token,
          },
        }
      );
      if (response.data.status === 200) {
        Swal.fire({
          title: "Feedback added successfully",
          icon: "success",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const [searchKeyword, setSearchKeyword] = useState("");
  const [skills, setSkills] = useState(null);

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    // Filter skills based on the keyword
    const filtered = userData.filter((userData) =>
      userData.candidateDetails.first_name
        .toLowerCase()
        .includes(keyword.toLowerCase())
    );
    setSkills(filtered);
    // console.log(filtered);
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearchKeyword("");
    setSkills(null);
  };
  useEffect(() => {
    getData(userId);
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleShowModal = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  const columns = [
    {
      field: "fName",
      headerName: "Candidate First Name",
      width: 180,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },
    {
      field: "lName",
      headerName: "Candidate Last Name",
      width: 130,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },
    {
      field: "mail",
      headerName: "Candidate Email",
      width: 240,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },

    {
      field: "interviewdate",
      headerName: "Interview Date",
      width: 170,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },

    {
      field: "action",
      headerName: "Action",
      headerClassName: "redText",
      cellClassName: "redBorder",
      width: 253,
      renderCell: (params) => (
        <strong>
          <div className="process__actionnn" style={{ margin: "10px 0" }}>
            {/* <Button
              variant="primary"
              onClick={() => handleShowModal(params.row)}
              
              className="btn btn-info btn-xxss"
              title="view"
             
             
            >
              <i className="fa fa-eye"></i>
            </Button> */}
            <Button
              variant="primary"
              // onClick={(e) => {
              //   e.stopPropagation(); // Prevents event bubbling
              //   handleShowModal(params.row);
              // }}
              onClick={() => handleOpen(i)}
              className="btn btn-info btn-xxss"
              title="view"
            >
              <i className="fa fa-eye"></i>
            </Button>

            <button
              className="btn  btn-success btn-smmm"
              title="interview feedback"
              onClick={() => handleFeedbackModel(params.row.id)}
              // onClick={() => setLgShow(true)}
              // onClick={(e) => {
              //   e.stopPropagation(); // Prevents event bubbling

              // }}
            >
              <i class="fa-solid fa-square-pen"></i>
            </button>
            <Modal
              size="lg"
              show={lgShow}
              onHide={() => setLgShow(false)}
              aria-labelledby="feedback"
            >
              <Modal.Header closeButton className="bg-red-500 text-white">
                <Modal.Title id="feedback " className="provide_feedback">
                  Provide Feedback
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="dDrt">
                  <textarea
                    className="form-control border-dark "
                    cols="80"
                    rows="5"
                  ></textarea>
                  <span>
                    <button
                      className="btn btn-primary btn-feedback"
                      onClick={addFeedbacktoCandidate}
                    >
                      Submit Feedback
                    </button>
                  </span>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </strong>
      ),
    },
  ];
  //  const rows = [];
  const rows = skills
    ? skills.map((i) => ({
        id: i.candidateDetails.id,
        fName: i.candidateDetails.first_name,
        lName: i.candidateDetails.last_name,
        mail: i.candidateDetails.email_address,
        interviewdate: i.interview_date,
        action: i.candidateDetails.action,
      }))
    : userData !== "" &&
      userData.map((item) => ({
        id: item.candidateDetails.id,
        fName: item.candidateDetails.first_name,
        lName: item.candidateDetails.last_name,
        mail: item.candidateDetails.email_address,
        interviewdate: item.interview_date,
        action: item.action,
      }));

  return (
    <>
      <AdminLayout>
        {loading && <div className="loader-container"></div>}
        <div
          className=" backgroundColor adminChangeUsername"
          style={{ minHeight: "80vh" }}
        >
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
                <i class="fa-solid fa-clipboard-question"></i>
                <span>Interview Assigned</span>
              </div>
            </div>
          </div>
          <div className="">
            <div className="profilelogo">
              <h2>Interviews Assigned</h2>
            </div>
            <div className="serachKeyItems  bg-white">
              <form action="">
                <p>Search Candidate by Name, Email, Contact</p>
                <div className="flex flex-col md:flex-row">
                  <input
                    type="text"
                    className="formm-control  w-100 mb-2 md:mb-0 md:mr-2"
                    placeholder="Search By Keyword"
                    value={searchKeyword}
                    onChange={handleSearch}
                  />
                  <div className="flex flex-col md:flex-row md:h-11 items-center">
                    {/* <button
                      className="btn btn-serach md:mb-0 md:mr-2 "
               
                    >
                      SEARCH
                    </button> */}
                    <button
                      className="btn btn-clearFilters"
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="interviewPreviewTable TableScroll">
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
                  checkboxSelection
                />
              </div>
              {/* {modalData !== null &&
                modalData.map((i) => {
                  return (
                    <>
                      <Modal show={slider} onHide={slideClose}>
                        <Modal.Header
                          closeButton
                          className="bg-red-500 text-white"
                        >
                          <Modal.Title>
                            {modalData && modalData.first_name}
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="mb-10">
                          <div className="dDrt flex align-items-center">
                            <span>Profile Image :</span>
                            <Image
                              src="/Images/adminSide/candidateInfo.jpg"
                              alt="profile-image"
                              width={190}
                              height={50}
                            />
                          </div>
                          <div className="dDrt">
                            <span>First Name: </span>
                            {modalData && modalData.first_name}
                          </div>
                          <div className="dDrt">
                            <span>Miiddle Name: </span>
                            ----
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
                            {modalData && modalData.physically_challenged}
                          </div>
                          <div className="dDrt">
                            <span>Address : </span>
                          
                          </div>
                          <div className="dDrt">
                            ------------------------------------------
                          </div>
                          <div className="dDrt">
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
                                    {j.course ? j.course : "Not available"}
                                  </div>
                                  <div className="dDrt">
                                    <span>School college : </span>
                                    {j.school_college_city
                                      ? j.school_college_city
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
                                  <div className="dDrt">
                                    ------------------------------------------
                                  </div>
                                </>
                              );
                            })}

                          <div className="dDrt">
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
                                      : "Not available"}
                                  </div>
                                  <div className="dDrt">
                                    <span>Date to : </span>
                                    {j.end_date ? j.end_date : "Not available"}
                                  </div>
                                  <div className="dDrt">
                                    <span>Name of organization : </span>
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
                                  <div className="dDrt">
                                    ------------------------------------------
                                  </div>
                                </>
                              );
                            })}

                          <div className="dDrt">
                            <h4>Additional Details</h4>
                          </div>
                        </Modal.Body>
                      </Modal>
                    </>
                  );
                })} */}
            </div>
          </div>
        </div>
        <AdminFooter />
      </AdminLayout>
    </>
  );
};

export default Page;
