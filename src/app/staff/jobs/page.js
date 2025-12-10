"use client";
import React from "react";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";
import "../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import AdminFooter from "../../admin/Components/AdminFooter/AdminFooter";
import StaffLayout from "../StaffLayout";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import BaseAPI from "../../BaseAPI/BaseAPI";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import HTMLReactParser from "html-react-parser";
import JobModal from "@/app/Components/JobModal/JobModal";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const token = Cookies.get("tokenStaff");
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const fname = Cookies.get("fname");
  const access = Cookies.get("access");
  const [userAccess, setUserAccess] = useState({});
  const [jobModal, setJobModal] = useState(false);
  const [JobModalData, setJobModalData] = useState({});

  useEffect(() => {
    const access = Cookies.get("access");

    if (typeof access !== null || access !== "" || access !== undefined) {
      console.log(JSON.parse(access));

      setUserAccess(JSON.parse(access));
    } else {
      setUserAccess({});
    }
  }, []);
  const getData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + `/admin/jobs/user/index`,
        null,
        {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setUserData(response.data.response);

      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleOpen = (eachData) => {
    setSelectedRecord(eachData);
    handleShowModal(eachData);
    setJobModalData(eachData);
  };

  const handleShowModal = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
    setJobModal(true);
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
        userData.job_name.toLowerCase().includes(keyword.toLowerCase()) ||
        userData.job_description.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredData(filtered);
    // console.log(filtered);
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearchKeyword("");
    setFilteredData();
  };

  const handleDeactivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Deactivate Job?",
        text: "Do you want to Deactivate this Job?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/jobs/user/deactivate/${slug}`,
          null, // Pass null as the request body if not required
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
            title: "Job Deactivated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          getData();
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
        title: "Failed. Please try after some time!",
        text: "Could not Deactivate Job",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't deactivate the record!", error.message);
    }
  };

  const handleDelete = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Delete Job?",
        text: "Do you want to Delete this Job?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/jobs/user/delete/${slug}`,
          null, // Pass null as the request body if not required
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
            title: "Job  deleted successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          getData();
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
        title: "Failed. Please try after some time!",
        text: "Could not Delete Job",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't delete the record!", error.message);
    }
  };

  const handleActivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Activate Job?",
        text: "Do you want to Activate this Job?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/jobs/user/activate/${slug}`,
          null, // Pass null as the request body if not required
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
            title: "Job Activated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          getData();
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
        title: "Failed. Please try after some time!",
        text: "Could not Activate Job",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't activate the record!", error.message);
    }
  };

  const handleMultipleDeactivate = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Deactivate?",
        text: "Do you want to deactivate these Jobs?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (confirmationResult.isConfirmed) {
        const idList = selectedIds.map((id) => id.toString()); // Ensure IDs are strings

        // console.log(idList);

        setLoading(true);

        const response = await axios.post(
          BaseAPI + "/admin/jobs/user/index",
          {
            idList: idList.join(","),
            action: "deactivate",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        setLoading(false);

        if (response.data.status === 200) {
          Swal.fire({
            title: "Jobs deactivated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });

          // Clear selected data and fetch updated data
          getData();
        } else {
          Swal.fire({
            title: "Couldn't Deactivate!",
            icon: "error",
            confirmButtonText: "Close",
          });
        }
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed. Please try after some time!",
        text: "Could not deactivate jobs",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't deactivate the record!", error.message);
    }
  };

  const handleMultipleActivate = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Activate?",
        text: "Do you want to activate these Jobs?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        const idList = selectedIds.map((id) => id.toString()); // Ensure IDs are strings

        // console.log(idList);

        setLoading(true);
        const response = await axios.post(
          BaseAPI + "/admin/jobs/user/index",
          {
            idList: idList.join(","),
            action: "activate",
          }, // Pass null as the request body if not required
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer" + " " + token,
            },
          }
        );

        setLoading(false);
        if (response.data.status === 200) {
          console.log("yaha");
          Swal.fire({
            title: "Jobs activated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          getData();
        } else {
          Swal.fire({
            title: "Couldn't Activate!",
            icon: "error",
            confirmButtonText: "Close",
          });
        }
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed. Please try after some time!",
        text: "Could not activate jobs",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't activate the record!", error.message);
    }
  };

  const handleMultipleDelete = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Delete?",
        text: "Do you want to delete these Jobs?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        const idList = selectedIds.map((id) => id.toString()); // Ensure IDs are strings

        // console.log(idList);
        setLoading(true);
        const response = await axios.post(
          BaseAPI + "/admin/jobs/user/index",
          {
            idList: idList.join(","),
            action: "delete",
          }, // Pass null as the request body if not required
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
            title: "Jobs deleted successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          getData();
        } else {
          Swal.fire({
            title: "Couldn't Delete!",
            icon: "error",
            confirmButtonText: "Close",
          });
        }
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed. Please try after some time!",
        text: "Could not Delete Jobs",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't Delete the record!", error.message);
    }
  };

  const columns = [
    { field: "job_name", headerName: "Job Title", width: 200, flex: 1 },
    {
      field: "job_description",
      headerName: "Job Description",
      width: 350,
      flex: 1,
    },
    {
      field: "posted_by_name",
      headerName: "Job Posted By",
      width: 150,
      flex: 1,
    },
    { field: "job_created_at", headerName: "Created on", width: 200, flex: 1 },
    {
      field: "action",
      headerName: "Action",
      width: 250,
      flex: 1,
      renderCell: (params) => (
        <strong>
          <div className="process__actionnn" style={{ margin: "10px 0" }}>
            {/* {params.row.status === 1 ? (
              <button
                className="btn btn-success btn-smmm"
                onClick={(e) => {
                  handleDeactivate(params.row.slug);
                  e.stopPropagation(); // Prevents event bubbling
                }}
                title="Activate Now"
              >
                <i class="fa-solid fa-check"></i>
              </button>
            ) : (
              <button
                className="btn btn-danger btn-deactivateee"
                onClick={(e) => {
                  handleActivate(params.row.slug);
                  e.stopPropagation(); // Prevents event bubbling
                }}
                title="Deactivate Now"
              >
                <i class="fa-solid fa-ban"></i>
              </button>
            )} */}
            {params.row.posted_by_employer === "0" && (
              <>
                {params.row.status === 1 ? (
                  <button
                    className="btn btn-success btn-smmm"
                    onClick={(e) => {
                      handleDeactivate(params.row.slug);
                      e.stopPropagation(); // Prevents event bubbling
                    }}
                    title="Activate Now"
                  >
                    <i className="fa-solid fa-check"></i>
                  </button>
                ) : (
                  <button
                    className="btn btn-danger btn-deactivateee"
                    onClick={(e) => {
                      handleActivate(params.row.slug);
                      e.stopPropagation(); // Prevents event bubbling
                    }}
                    title="Deactivate Now"
                  >
                    <i className="fa-solid fa-ban"></i>
                  </button>
                )}
              </>
            )}

            {userAccess[0]?.Edit === 1 && (
              <Link
                href={`/staff/jobs/edit/${params.row.slug}`}
                className="btn  btn-warning btn-smmm"
                title="edit"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <i class="fa-solid fa-square-pen"></i>
              </Link>
            )}
            {userAccess[0]?.Delete === 1 && (
              <button
                className="btn  btn-danger btn-smmm"
                title="delete"
                onClick={(e) => {
                  handleDelete(params.row.slug);
                  e.stopPropagation(); // Prevents event bubbling
                }}
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
            )}

            <button
              className="btn btn-danger btn-smmm"
              title="code"
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
              }}
            >
              <i class="fa-solid fa-code"></i>
            </button>
            <Button
              variant="primary"
              onClick={(e) => {
                handleOpen(params.row);
                e.stopPropagation();
              }}
              className="btn btn-info btn-smmm"
              title="view"
            >
              <i className="fa fa-eye"></i>
            </Button>

            {/* <button
              className="btn  btn-warning btn-smmm"
              title="candidate respone form"
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
              }}
            >
              <i class="fa-regular fa-file"></i>
            </button> */}
            <Link
              href={`/staff/jobs/applied-candidate-list/${params.row.id}`}
              className="btn  btn-danger btn-smmm"
              title="Applied candidate list"
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
              }}
            >
              <i class="fa-solid fa-users"></i>
            </Link>
          </div>
        </strong>
      ),
    },
  ];

  const rows = filteredData
    ? filteredData.map((item) => ({
        category: item.category,
        category_id: item.category_id,
        designation: item.designation,
        designation_id: item.designation_id,
        employer_id: item.employer_id,
        employer_name: item.employer_name,
        job_created_at: item.job_created_at,
        job_description: item.job_description,
        id: item.job_id,
        job_name: item.job_name,
        job_status: item.job_status,
        location: item.location,
        max_exp: item.max_exp,
        min_exp: item.min_exp,
        max_salary: item.max_salary,
        min_salary: item.min_salary,
        process_order: item.process_order,
        skill: item.skill,
        skill_id: item.skill_id,
        slug: item.slug,
        staff_id: item.staff_id,
        staff_name: item.staff_name,
        status: item.status,
        work_type: item.work_type,
        posted_by_employer: item.posted_by_employer,
        posted_by_name: item.posted_by_employer === "1" ? "Employer" : "Staff",
      }))
    : userData.map((item) => ({
        category: item.category,
        category_id: item.category_id,
        designation: item.designation,
        designation_id: item.designation_id,
        employer_id: item.employer_id,
        employer_name: item.employer_name,
        job_created_at: item.job_created_at,
        job_description: item.job_description,
        id: item.job_id,
        job_name: item.job_name,
        job_status: item.job_status,
        location: item.location,
        max_exp: item.max_exp,
        min_exp: item.min_exp,
        max_salary: item.max_salary,
        min_salary: item.min_salary,
        process_order: item.process_order,
        skill: item.skill,
        skill_id: item.skill_id,
        slug: item.slug,
        staff_id: item.staff_id,
        staff_name: item.staff_name,
        status: item.status,
        work_type: item.work_type,
        posted_by_employer: item.posted_by_employer,
        posted_by_name: item.posted_by_employer === "1" ? "Employer" : "Staff",
      }));

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <StaffLayout>
        {loading && <div className="loader-container"></div>}

        <div
          className=" backgroundColour adminChangeUsername"
          style={{ minHeight: "80vh" }}
        >
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
              <div className="flex gap-2 items-center  ">
                <i className="fa fa-list-alt"></i>
                <span> Jobs List</span>
              </div>
            </div>
          </div>
          <div className="">
            <div className="add--processs"></div>
            <div className="serachKeyItems  bg-white">
              <form action="">
                <p>Search Job by typing Title, description</p>
                <div className="flex flex-col md:flex-row justify-between items-center w-full md:gap-4">
                  <div className="w-full flex flex-col md:flex-row items-center gap-2 flex-grow">
                    <input
                      type="text"
                      className="formm-control w-100 md:mb-0"
                      placeholder="Search By Keyword"
                      value={searchKeyword}
                      onChange={handleSearch}
                    />
                    <button
                      className="btn btn-clearFilters"
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                  <div className="add__interviewwww">
                    {userAccess[0]?.Add === 1 && (
                      <Link
                        href="/staff/jobs/postjobs"
                        className="btn btn-SubAdmin-add"
                      >
                        Post Job
                      </Link>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <div className="interviewPreviewTable ">
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
                  onRowSelectionModelChange={(newRowSelectionModel) => {
                    setSelectedIds(newRowSelectionModel);
                    // console.log(selectedIds);
                  }}
                  rowSelectionModel={selectedIds}
                  {...userData}
                  isRowSelectable={(params) =>
                    params.row.posted_by_employer !== "1"
                  }
                />
              </div>

              {/* <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton className="bg-red-500 text-white">
                  <Modal.Title>
                    {selectedRecord && selectedRecord.job_name}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedRecord && (
                    <div>
                      <div className="dDrt">
                        <span>Job Title: </span>
                        {selectedRecord && selectedRecord.job_name}
                      </div>
                      <div className="dDrt">
                        <span>Category: </span>
                        {selectedRecord.category
                          ? selectedRecord.category
                          : "N/A"}
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
                        {selectedRecord.work_type
                          ? selectedRecord.work_type
                          : "N/A"}
                      </div>
                      <div className="dDrt">
                        <span>Job Posted By : </span>
                        {selectedRecord.posted_by_employer === "1" ? selectedRecord.employer_name : selectedRecord.staff_name}
                      </div>
                      <div className="dDrt">
                        <span>Interview Process Names:</span>
                        <ul>
                          {selectedRecord.process_order !== ""
                            ? selectedRecord.process_order
                                .split(",")
                                .map((processName, index) => (
                                  <li key={index}>
                                    Process {index + 1}{" "}
                                    <i className="fas fa-arrow-right"></i>{" "}
                                    {processName.trim()}
                                  </li>
                                ))
                            : "N/A"}
                        </ul>
                      </div>

                      <div className="dDrt">
                        <span>Job Description : </span>
                        {selectedRecord.job_description &&
                          HTMLReactParser(selectedRecord.job_description)}
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

              {jobModal && (
                <JobModal
                  onClose={() => setJobModal(false)}
                  jobData={JobModalData}
                />
              )}

              <div className="BottomButtom">
                <button
                  className="btn btn-dark btn-Activateee"
                  onClick={handleMultipleActivate}
                >
                  Activate
                </button>
                <button
                  className="btn btn-dark btn-Activateee"
                  onClick={handleMultipleDeactivate}
                >
                  Deactivate
                </button>
                <button
                  className="btn btn-dark btn-Activateee"
                  onClick={handleMultipleDelete}
                >
                  Delete
                </button>
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
