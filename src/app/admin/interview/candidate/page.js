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

  const [userData, setUserData] = useState([]);

  const [formData, setFormData] = useState({
    round: "",
    process_id: "",
    
    user_id: "",
    comment: "",
  });
   const handleOpen = (eachData) => {
    console.log(eachData, "here");
    setslider(true);
    setModalData(eachData);
  };

  const [statusData, setStatusData] = useState([]);
  const [processData, setProcessData] = useState([]);
  const [user, setUser] = useState([]);

  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");
  const [mdShow, setMdShow] = useState(false);

  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);


  // Naya code

  // const [selectedPlan, setSelectedPlan] = useState(null);



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
      setProcessData(response.data.response.processList);
      setUser(response.data.response.user);
      
      // console.log(response.data.response);
    } catch (error) {
      console.log(error.message);
    }
  };

  const [searchKeyword, setSearchKeyword] = useState("");
  const [skills, setSkills] = useState(null);
  const [filteredSkills, setFilteredSkills] = useState([]);

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    // Filter skills based on the keyword
    const filtered = userData.filter((userData) =>
      userData.first_name.toLowerCase().includes(keyword.toLowerCase())
    );
    setSkills(filtered);
    // console.log(filtered);
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearchKeyword("");
    setSkills();
  };
  useEffect(() => {
    getData();
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

  const handleAssignProcess = async (e , id) => {
    e.preventDefault();

    try {

      console.log(id,"here");
      // return;

      const updatedData = {
        ...formData,
        candidate_id: id,
      }
      const response = await axios.post(
        BaseAPI + `/admin/candidate/interviewstatus/${id}`,
       updatedData ,
        {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token, // Ensure there is a space after 'Bearer'
          },
        }
      );
      if (response.data.status === 200) {
        Swal.fire({
          title: "Process Assigned successfully!",
          icon: "success",
          confirmButtonText: "Close",
        });
        setLgShow1(false); // Close the modal on success
      } else {
        Swal.fire({
          title: "Failed to assign process",
          text: response.data.message || "An error occurred",
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "An unexpected error occurred",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  const handleInterview = (candidateId, jobId) => {
    // e.stopPropagation();
    Cookies.set("job_id", jobId);
    router.push(`/admin/jobs/scheduleinterview/${candidateId}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
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
              // onClick={() => setLgShow(true)}
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
                setLgShow(true);
              }}
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
                    <button className="btn btn-primary btn-feedback">
                      Submit Feedback
                    </button>
                  </span>
                </div>
              </Modal.Body>
            </Modal>
            <button
              className="btn  btn-info btn-xxss"
              title="interview status"
              // onClick={() => setMdShow(true)}
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
                setMdShow(true);
              }}
            >
              <FormatListBulletedIcon sx={{ fontSize: 20 }} />
            </button>
            <Modal
              size="lg"
              show={mdShow}
              onHide={() => setMdShow(false)}
              aria-labelledby="interview status"
            >
              <Modal.Header closeButton className="bg-red-500 text-white">
                <Modal.Title id="interview status ">
                  Interview Status
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="dDart" style={{ marginLeft: "20px" }}>
                  ------------------
                </div>
                <div className="dDrt">
                  <span>Round Details : </span>1
                </div>
                <div className="dDrt">
                  <span>Interviewd By : </span>
                  HR
                </div>
                <div className="dDrt">
                  <span>Interview Status : </span>
                </div>
                <div className="dDrt">
                  <span>Feedback : </span>
                  Good candidate can proceed further
                </div>
              </Modal.Body>
            </Modal>

            <button
              className="btn btn-primary btn-group"
              title="Edit"
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
                setLgShow1(true);
              }}
            >
              <i class="fas fa-users"></i>
            </button>

            <Modal
              size="lg"
              show={lgShow1}
              onHide={() => setLgShow1(false)}
              aria-labelledby="example-modal-sizes-title-lg"
            >
              <Modal.Header closeButton className="Process_assigned">
                <Modal.Title id="example-modal-sizes-title-lg">
                  Assign Process
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form
                  style={{ padding: "10px 15px" }}
                >
                  <div className="mb-3">
                    <label htmlFor="">Round</label>
                    <select
                      name="round"
                      id="round"
                      className="form-control shadow-none"
                      value={params.row.round}
                      onChange={handleChange}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>
                      Assign Process <span>*</span>
                    </label>
                    <select
                      className="form-control shadow-none"
                      name="process_id"
                      id="process_id"
                      value={params.row.process_id}
                      onChange={handleChange}
                    >
                      <option value="" selected>
                        Select Process
                      </option>
                      {processData != "" &&
                        processData.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.process_name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label>
                      Assign User <span>*</span>
                    </label>
                    <select
                      className="form-control shadow-none"
                      name="user_id"
                      id="user_id"
                      value={params.row.user_id}
                      onChange={handleChange}
                    >
                      <option value="" selected>
                        Select user
                      </option>
                      {user != "" &&
                        user.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.first_name + " " + i.last_name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="">Comment</label>
                    <textarea
                      name="comment"
                      id="comment"
                      cols="3"
                      rows="3"
                      value={params.row.comment}
                      className="form-control shadow-none"
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className="Assignbtn">
                    <button className="btn btn-primary btn-nextStep" onClick={(e) => handleAssignProcess(e, params.row.id)}>
                      Proceed to the next step
                    </button>
                  </div>
                </form>
              </Modal.Body>
            </Modal>

            {/* <Link
              href={`/admin/jobs/scheduleinterview/${params.row.id}`}
              className="btn btn-xxxxxss"
              title="schedule interview"
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
              }}
            >
              <i class="fas fa-users"></i>
            </Link> */}
            <button
              // href={`/admin/jobs/scheduleinterview/${params.row.id}`}
              className="btn btn-xxxxxss"
              title="schedule interview"
              onClick={(e) => {
                handleInterview(params.row.id, params.row.job_id);
              }}
            >
              <i class="fas fa-users"></i>
            </button>
          </div>
        </strong>
      ),
    },
  ];

  const rows = skills
    ? skills.map((i) => ({
        id: i.candidate_id,
        job_id: i.job_id,
        fName: i.first_name,
        lName: i.last_name,
        mail: i.email,
        createdat: i.created,
        status: i.status,
        slug: i.slug,
        interview_status: i.interview_status,
        process_name: i.process_name,
        user: i.username,
        phone: i.phone,
        dob: i.dateofbirth,
        address: i.address,
        gender: i.gender,
      }))
    :  userData.map((item) => ({
     
        id: item.candidate_id,
        job_id: item.job_id,
        fName: item.first_name,
        lName: item.last_name,
        mail: item.email,
        createdat: item.created,
        status: item.status,
        slug: item.slug,
        interview_status: item.interview_status,
        process_name: item.process_name,
        user: item.username,
        phone: item.phone,
        dob: item.dateofbirth,
        address: item.address,
        gender: item.gender,
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
                <i class="fa-solid fa-user"></i>
                <span>Applicant List</span>
              </div>
            </div>
          </div>
          <div className="">
            <div className="profilelogo">
              <h2>Applicant List</h2>
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
                        {selectedRecord && selectedRecord.first_name}
                      </div>
                      <div className="dDrt">
                        <span>Miiddle Name: </span>
                        ----
                      </div>
                      <div className="dDrt">
                        <span>Last Name: </span>
                        {selectedRecord && selectedRecord.last_name}

                      </div>
                      <div className="dDrt">
                        <span>Email :</span>
                        {selectedRecord && selectedRecord.email_address}

                      </div>
                      <div className="dDrt">
                        <span>Phone : </span>
                        {selectedRecord && selectedRecord.phone ? selectedRecord.phone : "..."}

                      </div>
                      <div className="dDrt">
                        <span>Date Of Birth : </span>
                        {selectedRecord && selectedRecord.date_of_birth ? selectedRecord.date_of_birth : "..."}

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
