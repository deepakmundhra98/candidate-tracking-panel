"use client";
import React from "react";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";
import Modal from "react-bootstrap/Modal";
import "../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import AdminFooter from "../Components/AdminFooter/AdminFooter";
import AdminLayout from "../AdminLayout";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import BaseAPI from "../../BaseAPI/BaseAPI";
import axios from "axios";
import Button from "react-bootstrap/Button";

const Page = () => {
  const [show, setShow] = useState(false);
  const [slider, setslider] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const token = Cookies.get("token");
  const slide1 = () => setslider(true);
  const slideClose = () => setslider(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [skills, setSkills] = useState(null);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [modalData, setModalData] = useState();

  const handleOpen = (eachData) => {
    console.log(eachData, "here");
    setslider(true);
    setModalData(eachData);
  };

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

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    // Filter skills based on the keyword
    const filtered = userData.filter((userData) =>
      userData.job_name.toLowerCase().includes(keyword.toLowerCase())
    );
    setSkills(filtered);
    // console.log(filtered);
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearchKeyword("");
    setSkills();
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
              // key: ApiKey,
              Authorization: "Bearer" + " " + token,
              // adminid: adminID,
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
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
        getData();
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
              // key: ApiKey,
              Authorization: "Bearer" + " " + token,
              // adminid: adminID,
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
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
        getData();
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
              // key: ApiKey,
              Authorization: "Bearer" + " " + token,
              // adminid: adminID,
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
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
        getData();
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

  const columns = [
    { field: "jobtitle", headerName: "Job Title", width: 150 },
    { field: "jobdescription", headerName: "Job Description", width: 350 },
    { field: "createdat", headerName: "Created At", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 250,
      renderCell: (params) => (
        <strong>
          <div className="process__actionnn" style={{ margin: "10px 0" }}>
            {/* <button
              className="btn btn-success btn-xsss"
              title="deactivate"
              onClick={(e) => {
                handleActivate(); // Prevents event bubbling
                e.stopPropagation();
              }}
            >
              <i class="fa-solid fa-check"></i>
            </button> */}

            {params.row.status === 1 ? (
              <button
                className="btn btn-success btn-successss"
                // onClick={() => handleDeactivate(params.row.slug)}
                onClick={(e) => {
                  handleDeactivate(params.row.slug);
                  e.stopPropagation(); // Prevents event bubbling
                }}
                title="Activate"
              >
                <i class="fa-solid fa-check"></i>
              </button>
            ) : (
              <button
                className="btn btn-danger btn-deactivateee"
                // onClick={() => handleActivate(params.row.slug)}
                onClick={(e) => {
                  handleActivate(params.row.slug);
                  e.stopPropagation(); // Prevents event bubbling
                }}
                title="Deactivate"
              >
                <i class="fa-solid fa-ban"></i>
              </button>
            )}
            {/* <button
              className="btn  btn-warning btn-smmm"
              title="edit"
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
              }}
            >
              <i class="fa-solid fa-square-pen"></i>
            </button> */}

            <Link
              href={`/admin/jobs/edit/${params.row.slug}`}
              title="Edit"
              className="btn btn-warning btn-Edittt"
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
              }}
            >
              <i className="fa-solid fa-square-pen"></i>
            </Link>

            <button
              className="btn  btn-danger btn-xxlll"
              title="delete"
              onClick={(e) => {
                handleDelete(params.row.slug);
                e.stopPropagation(); // Prevents event bubbling
              }}
            >
              <i class="fa-solid fa-trash-can"></i>
            </button>
            <button
              className="btn btn-danger btn-xxxsss"
              title="code"
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
              }}
            >
              <i class="fa-solid fa-code"></i>
            </button>
            <button
              className="btn  btn-info btn-xxss"
              title="view"
              // onClick={() => {
              //   handleOpen(params.row);
              //   i.stopPropagation(); // Prevents event bubbling
              // }}
              onClick={() => handleOpen(params.row)}

            >
             
             <i className="fa fa-eye text-white"></i>
             
            </button>

            <button
              className="btn  btn-warning btn-xss"
              title="candidate respone form"
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
              }}
            >
              <i class="fa-regular fa-file"></i>
            </button>
            <Link
              href={`/admin/jobs/candidate/${params.row.id}`}
              className="btn  btn-danger btn-xsssss"
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

  const rows = skills
    ? skills.map((i) => ({
        id: i.job_id,
        jobtitle: i.job_name,
        jobdescription: i.job_description,
        createdat: i.job_created_at,
        status: i.status,
        slug: i.slug,
      }))
    : userData.map((item) => ({
        id: item.job_id,
        jobtitle: item.job_name,
        jobdescription: item.job_description,
        createdat: item.job_created_at,
        status: item.status,
        slug: item.slug,
      }));

  const handleMultipleDeactivate = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Deactivate?",
        text: "Do you want to deactivate these Sub-admin?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (confirmationResult.isConfirmed) {
        const idList = selectedIds.map((id) => id.toString()); // Ensure IDs are strings

        console.log(idList);

        setLoading(true);

        const response = await axios.post(
          BaseAPI + "/admin/user/staff",
          {
            idList: idList.join(","),
            action: "deactivate",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + tokenEmployer,
            },
          }
        );

        setLoading(false);

        if (response.data.status === 200) {
          Swal.fire({
            title: "Sub-admin deactivated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });

          // Clear selected data and fetch updated data
          setCheckedData([]);
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
        text: "Could not deactivate Sub-admin",
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
        text: "Do you want to activate these Sub-admin?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        const idList = selectedIds.map((id) => id.toString()); // Ensure IDs are strings

        console.log(idList);

        setLoading(true);
        const response = await axios.post(
          BaseAPI + "/admin/user/staff",
          {
            idList: idList.join(","),
            action: "activate",
          }, // Pass null as the request body if not required
          {
            headers: {
              "Content-Type": "application/json",
              // key: ApiKey,
              Authorization: "Bearer" + " " + tokenEmployer,
              // adminid: adminID,
            },
          }
        );

        setLoading(false);
        if (response.data.status === 200) {
          Swal.fire({
            title: "Sub-Admin Activated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
        } else {
          Swal.fire({
            title: "Couldn't Activate!",
            icon: "error",
            confirmButtonText: "Close",
          });
        }
        getData();
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed. Please try after some time!",
        text: "Could not activate Sub-admin",
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
        text: "Do you want to Delete these Qualification?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        const idList = selectedIds.map((id) => id.toString()); // Ensure IDs are strings

        console.log(idList);
        setLoading(true);
        const response = await axios.post(
          BaseAPI + "/admin/user/staff",
          {
            idList: idList.join(","),
            action: "delete",
          }, // Pass null as the request body if not required
          {
            headers: {
              "Content-Type": "application/json",
              // key: ApiKey,
              Authorization: "Bearer" + " " + tokenEmployer,
              // adminid: adminID,
            },
          }
        );

        setLoading(false);
        if (response.data.status === 200) {
          Swal.fire({
            title: "Qualification Deleted successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
        } else {
          Swal.fire({
            title: "Couldn't Delete!",
            icon: "error",
            confirmButtonText: "Close",
          });
        }
        getData();
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed. Please try after some time!",
        text: "Could not Delete Qualification",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't Delete the record!", error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <AdminLayout>
        <div
          className=" backgroundColour adminChangeUsername"
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
                <span> Jobs List</span>
              </div>
            </div>
          </div>
          <div className="">
            <div className="profilelogo">
              <h2>Jobs List</h2>
            </div>
            <div className="add--processs">
              <div className=" flex gap-3 lg:w-1/4 md:w-72 sm:w-64   ">
                <Link href="/admin/jobs/postjobs" className="btn btn-addAdmin ">
                  Post Jobs
                </Link>
                <Link href="" className="btn btn-danger deleteAllBtn ">
                  Bulk Delete
                </Link>
              </div>
            </div>
            <div className="serachKeyItems  bg-white">
              <form action="">
                <p>Search Job by typing Title, Created date</p>
                <div className="flex flex-col md:flex-row">
                  <input
                    type="text"
                    className="formm-control  w-100 mb-2 md:mb-0 md:mr-2"
                    placeholder="Search By Keyword"
                    value={searchKeyword}
                    onChange={handleSearch}
                  />
                  <div className="flex flex-col md:flex-row md:h-11 items-center">
                    {/* <button className="btn btn-serach md:mb-0 md:mr-2 ">
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
                />
              </div>

              <div className="BottomButtom">
                <button className="btn btn-dark btn-Activateee">
                  Activate
                </button>
                <button className="btn btn-dark btn-Activateee">
                  Deactivate
                </button>
                <button className="btn btn-dark btn-Activateee">Delete</button>
              </div>
            </div>
          </div>
        </div>

        <div className="action-btn">
          <Button
            variant="primary"
            onClick={slide1}
            className="btn btn-info btn-View"
          >
            <i className="fa fa-eye text-white"></i>
          </Button>

          <Modal show={slider} onHide={slideClose}>
            <Modal.Header closeButton className="bg-red-500 text-white">
              <Modal.Title>{modalData && modalData.job_name}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="mb-10">
              
               {modalData && (
                <>
                  <div className="dDrt">
                    <span>Job Title: </span>
                    {modalData.jobtitle}
                  </div>
                  {/* <div className="dDrt">
                    <span>Employer Name: </span>
                    {modalData.employername}
                  </div> */}
                  <div className="dDrt">
                    <span>Job Description: </span>
                    {modalData.jobdescription.slice(0,100)}
                  </div>
                  {/* <div className="dDrt">
                    <span>Staff Name: </span>
                    {modalData.staff_name}
                  </div> */}
                  {/* <div className="dDrt">
                    <span>Phone: </span>
                    {modalData.contact}
                  </div> */}
                  {/* <div className="dDrt">
                    <span>Date Of Birth: </span>
                    {modalData.date_of_birth}
                  </div> */}
                  {/* <div className="dDrt">
                    <span>Gender: </span>
                    {modalData.gender}
                  </div> */}
                  {/* <div className="dDrt">
                    <span>Marital Status: </span>
                    {modalData.martial_status}
                  </div> */}
                  {/* <div className="dDrt">
                    <span>Physically Challenged: </span>
                    {modalData.physically_challenged}
                  </div> */}
                </>
              )}
            </Modal.Body>
          </Modal>
        </div>
        <AdminFooter />
      </AdminLayout>
    </>
  );
};

export default Page;
