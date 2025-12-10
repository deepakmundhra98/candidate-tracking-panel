"use client";
import React from "react";
import Link from "next/link";
// import Sidebar from "../../../component/sidebar/page";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useState } from "react";
import "../../../common.css";
import Image from "next/image";
import AdminFooter from "../../Components/AdminFooter/AdminFooter";
import { DataGrid } from "@mui/x-data-grid";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GroupIcon from "@mui/icons-material/Group";
import AdminLayout from "../../AdminLayout";
import Cookies from "js-cookie";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect } from "react";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import Swal from "sweetalert2";

const Page = () => {
  const [userData, setUserData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [checkedData, setCheckedData] = useState([]);
  const [interviewStatusData, setinterviewStatusData] = useState([]);

  const token = Cookies.get("token");
  const [mdShow, setMdShow] = useState(false);

  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
  const getData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + "/admin/candidates/listing",
        null,
        {
          headers: {
            "Content-Type": "application/json",
            // key: ApiKey,
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setUserData(response.data.response.candidatesData);
      setStatusData(response.data.response.statusList);

      // console.log(response.data.response);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const handleStatusChange = async (e, candidateId) => {
    let id = e.target.value;
    if (!id) {
      // If "Select Status" option is selected, return without making the API call
      return;
    }
    try {
      const response = await axios.post(
        BaseAPI + `/admin/candidates/statuschange/${candidateId}`,
        { status: id },
        {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer" + " " + token,
          },
        }
      );
      if (response.data.status === 200) {
        Swal.fire({
          title: "Status Changed successfully!",
          icon: "success",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const interviewFeedback = (candidateId) => {
    setFeedbackData({ candidate_id: candidateId });
    console.log(feedbackData);
    setLgShow(true);
  };

  const handleFeedback = async () => {
    console.log(feedbackData);
    // return;
    try {
      const response = await axios.post(
        BaseAPI + "/admin/candidates/feedback",
        feedbackData,
        {
          headers: {
            "Content-Type": "application/json",
            // key: ApiKey,
            Authorization: "Bearer" + " " + token,
          },
        }
      );

      if (response.data.status === 200) {
        // console.log("here")
        setLgShow(false);
        Swal.fire({
          title: "Feedback Sent successfully!",
          icon: "success",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const interviewDetails = (interviewDetails) => {
    console.log(interviewDetails);
    setMdShow(true);
    setinterviewStatusData(interviewDetails);
  };


  const columns = [
    {
      field: "fName",
      headerName: "First Name",
      width: 130,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },
    {
      field: "lName",
      headerName: "Last Name",
      width: 90,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },
    {
      field: "mail",
      headerName: "Email",
      width: 200,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },

    {
      field: "createdat",
      headerName: "Created at",
      width: 130,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },

    {
      field: "status",
      headerName: "Change Status",
      width: 180,
      headerClassName: "redText",
      cellClassName: "redBorder",
      renderCell: (params) => (
        <select
          className="form-select shadow-none"
          style={{ display: "inline-block" }}
          value={params.row.interview_status}
          onClick={(e) => handleStatusChange(e, params.row.id)}
        >
          <option value="" selected>
            Select Status
          </option>
          {statusData.map((i) => {
            return (
              <option key={i.id} value={i.id}>
                {i.status_name}
              </option>
            );
          })}
        </select>
      ),
    },

    {
      field: "action",
      headerName: "Action",
      headerClassName: "redText",
      cellClassName: "redBorder",
      width: 243,
      renderCell: (params) => (
        <strong>
          {/* <button onClick={() => console.log(params.row.jobtitle)}> */}
          <div className="process__actionnn">
            <Button
              variant="primary"
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
                handleShowModal(params.row);
              }}
              className="btn btn-info btn-xxss"
              title="view"
            >
              <i className="fa fa-eye"></i>
            </Button>
            {/* <Button
                variant="primary"
                onClick={handleShow}
                className="btn  btn-info btn-xxss"
                title="view"
              >
                <i className="fa fa-eye"></i>
              </Button> */}

            {/* <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className="bg-red-500 text-white">
                  <Modal.Title>Himesh Mane</Modal.Title>
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
                    fdsdsf
                  </div>
                  <div className="dDrt">
                    <span>Miiddle Name: </span>
                    ----
                  </div>
                  <div className="dDrt">
                    <span>Last Name: </span>
                    fdsdsf
                  </div>
                  <div className="dDrt">
                    <span>Email :</span>
                    dsf@fdgdfg.dfgd
                  </div>
                  <div className="dDrt">
                    <span>Phone : </span>
                    44465464654
                  </div>
                  <div className="dDrt">
                    <span>Date Of Birth : </span>
                    1702512000
                  </div>
                  <div className="dDrt">
                    <span>Gender : </span>
                    Male
                  </div>
                  <div className="dDrt">
                    <span>Martial Status : </span>
                    Married
                  </div>
                  <div className="dDrt">
                    <span>Physically Challenged : </span>
                    Yes
                  </div>
                  <div className="dDrt">
                    <span>Address : </span>
                    ----
                  </div>
                  <div className="dDrt">
                    ------------------------------------------
                  </div>
                  <div className="dDrt">
                    <h4>Education Qualification</h4>
                  </div>
                  <div className="dDrt">
                    <span>Qualification : </span>
                    gfdgdfg
                  </div>
                  <div className="dDrt">
                    <span>Course subjects : </span>
                    gffdg
                  </div>
                  <div className="dDrt">
                    <span>School college : </span>
                    fdgdfg
                  </div>
                  <div className="dDrt">
                    <span>University : </span>
                    fdg
                  </div>
                  <div className="dDrt">
                    <span>Year of passing : </span>
                    1963
                  </div>
                  <div className="dDrt">
                    ------------------------------------------
                  </div>
                  <div className="dDrt">
                    <h4>Experience Details</h4>
                  </div>
                  <div className="dDrt">
                    <span>Date from : </span>
                    2023-12-28
                  </div>
                  <div className="dDrt">
                    <span>Date to : </span>
                    2023-12-28
                  </div>
                  <div className="dDrt">
                    <span>Name of organization : </span>
                    fgfd
                  </div>
                  <div className="dDrt">
                    <span>Designation : </span>
                    gdfg
                  </div>
                  <div className="dDrt">
                    <span>Reason of leaving : </span>
                    fdgdfg
                  </div>
                  <div className="dDrt">
                    ------------------------------------------
                  </div>
                  <div className="dDrt">
                    <h4>Additional Details</h4>
                  </div>
                </Modal.Body>
              </Modal> */}

            <button
              className="btn  btn-success btn-smmm"
              title="interview feedback"
              onClick={() => interviewFeedback(params.row.id)}
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
                    className="form-control border-dark"
                    cols="80"
                    rows="5"
                    name="feedback"
                    value={feedbackData.feedback}
                    onChange={(e) =>
                      setFeedbackData({
                        ...feedbackData,
                        feedback: e.target.value,
                      })
                    }
                  />
                  <span>
                    <button
                      className="btn btn-primary btn-feedback"
                      onClick={handleFeedback}
                    >
                      Submit Feedback
                    </button>
                  </span>
                </div>
              </Modal.Body>
            </Modal>
            <button
              className="btn  btn-info btn-xxss"
              title="interview status"
              // onClick={() => setLgShow(true)}
              onClick={() => interviewDetails(params.row.interviewDetails)}
            >
              <FormatListBulletedIcon sx={{ fontSize: 20 }} />
            </button>
            <Modal
              size="lg"
              show={mdShow}
              // onHide={() => setLgShow(false)}
              onHide={() => setMdShow(false)}
              aria-labelledby="interview status"
            >
              <Modal.Header closeButton className="bg-red-500 text-white">
                <Modal.Title id="interview status ">
                  Interview Status
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {interviewStatusData.map((data, index) => {
                  return (
                    <>
                      <div className="dDart" style={{ marginLeft: "20px" }}>
                        ------------------
                      </div>
                      <div className="dDrt">
                        <span>Round Details : </span>
                        {index + 1}
                      </div>
                      <div className="dDrt">
                        <span>Interviewed By : </span>
                        {data.user_first_name} {data.user_last_name}
                      </div>
                      <div className="dDrt">
                        <span>Interview Status : </span>
                      </div>
                      <div className="dDrt">
                        <span>Feedback : </span>
                        {data.feedback}
                      </div>
                    </>
                  );
                })}
              </Modal.Body>
            </Modal>

            <Link
              href="/admin/jobs/scheduleinterview"
              className="btn btn-xxxxxss"
              title="schedule interview"
            >
              <i class="fas fa-users"></i>
            </Link>
          </div>
          {/* </button> */}
        </strong>
      ),
    },
  ];

  // const rows = [

  //     { id: 1, firstname: '	fdsdsf', lastname: 'fdsdsf', email: 'dsf@fdgdfg.dfgd', createat:'December 28, 2023', changestatus:'',   },

  // ];

  const rows = userData.map((item) => ({
    id: item.candidate_id,
    fName: item.first_name,
    lName: item.last_name,
    mail: item.email,
    createdat: item.created,
    status: item.status,
    slug: item.slug,
    interview_status: item.interview_status,
    interviewDetails: item.interviewDetails,
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
                <i class="fa-solid fa-sitemap"></i>
                <span> Applied Candidate List</span>
              </div>
            </div>
          </div>
          <div className="">
            <div className="profilelogo">
              <h2>Applied Candidates List</h2>
            </div>
            <div className="serachKeyItems  bg-white">
              <form action="">
                <p>Search Candidate by Name, Email, Contact</p>
                <div className="flex flex-col md:flex-row">
                  <input
                    type="text"
                    className="formm-control  w-100 mb-2 md:mb-0 md:mr-2"
                    placeholder="Search By Keyword"
                  />
                  <div className="flex flex-col md:flex-row md:h-11 items-center">
                    {/* <button className="btn btn-serach md:mb-0 md:mr-2 ">
                      SEARCH
                    </button> */}
                    <button className="btn btn-clearFilters">
                      Clear Filters
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="interviewPreviewTable">
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
              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton className="bg-red-500 text-white">
                  <Modal.Title>View Candidate Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedRecord && (
                    <div>
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
                        {selectedRecord.fName}
                      </div>
                      <div className="dDrt">
                        <span>Miiddle Name: </span>
                        ----
                      </div>
                      <div className="dDrt">
                        <span>Last Name: </span>
                        {selectedRecord.lName}
                      </div>
                      <div className="dDrt">
                        <span>Email :</span>
                        {selectedRecord.mail}
                      </div>
                      <div className="dDrt">
                        <span>Phone : </span>
                        {selectedRecord.phone}
                      </div>
                      <div className="dDrt">
                        <span>Date Of Birth : </span>
                        {selectedRecord.dob}
                      </div>
                      <div className="dDrt">
                        <span>Gender : </span>
                        {selectedRecord.gender}
                      </div>
                      <div className="dDrt">
                        <span>Martial Status : </span>
                        Married
                      </div>
                      <div className="dDrt">
                        <span>Physically Challenged : </span>
                        {selectedRecord.physicalchallenged}
                      </div>
                      <div className="dDrt">
                        <span>Address : </span>
                        {selectedRecord.address}
                      </div>
                      <div className="dDrt">
                        ------------------------------------------
                      </div>
                      <div className="dDrt">
                        <h4>Education Qualification</h4>
                      </div>
                      <div className="dDrt">
                        <span>Qualification : </span>
                        gfdgdfg
                      </div>
                      <div className="dDrt">
                        <span>Course subjects : </span>
                        gffdg
                      </div>
                      <div className="dDrt">
                        <span>School college : </span>
                        fdgdfg
                      </div>
                      <div className="dDrt">
                        <span>University : </span>
                        fdg
                      </div>
                      <div className="dDrt">
                        <span>Year of passing : </span>
                        1963
                      </div>
                      <div className="dDrt">
                        ------------------------------------------
                      </div>
                      <div className="dDrt">
                        <h4>Experience Details</h4>
                      </div>
                      <div className="dDrt">
                        <span>Date from : </span>
                        2023-12-28
                      </div>
                      <div className="dDrt">
                        <span>Date to : </span>
                        2023-12-28
                      </div>
                      <div className="dDrt">
                        <span>Name of organization : </span>
                        fgfd
                      </div>
                      <div className="dDrt">
                        <span>Designation : </span>
                        gdfg
                      </div>
                      <div className="dDrt">
                        <span>Reason of leaving : </span>
                        fdgdfg
                      </div>
                      <div className="dDrt">
                        ------------------------------------------
                      </div>
                      <div className="dDrt">
                        <h4>Additional Details</h4>
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
          </div>
        </div>
        <AdminFooter />
      </AdminLayout>
    </>
  );
};

export default Page;
