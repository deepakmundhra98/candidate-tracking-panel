"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import AdminFooter from "../../admin/Components/AdminFooter/AdminFooter";
import axios from "axios";
import BaseAPI from "../../BaseAPI/BaseAPI";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "react-bootstrap";
import EmployerLayout from "../EmployerLayout";

const Page = () => {
  const [userData, setUserData] = useState([]);
  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkedData, setCheckedData] = useState([]);
  const token = Cookies.get("tokenEmployer");
  const [selectedIds, setSelectedIds] = useState([]);

  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearchKeyword("");
    setSkills();
  };

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        BaseAPI + "/admin/designations/index",
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setLoading(false);
      setUserData(response.data.response);
      // console.log(response.data.response);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };
  const handleDelete = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Delete designation?",
        text: "Do you want to delete this designation?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/designations/delete/${slug}`,
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
            title: "Designation deleted successfully!",
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
        text: "Could not delete Designation",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't delete the record!", error.message);
    }
  };

  const handleActivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Activate Designation?",
        text: "Do you want to Activate this Designation?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/designations/activate/${slug}`,
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
            title: "Designation Activated successfully!",
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
        text: "Could not Activate Designation",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't activate the record!", error.message);
    }
  };

  const handleDeactivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Deactivate Designation?",
        text: "Do you want to Deactivate this Designation?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/designations/deactivate/${slug}`,
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
            title: "Designation Deactivated successfully!",
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
        text: "Could not Deactivate Designation",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't deactivate the record!", error.message);
    }
  };

  const handleMultipleDeactivate = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Deactivate?",
        text: "Do you want to Deactivate these designation?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        const idList = selectedIds.map((id) => id.toString()); // Ensure IDs are strings

        setLoading(true);
        const response = await axios.post(
          BaseAPI + "/admin/designations/index",
          {
            idList: idList.join(","),
            action: "deactivate",
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
            title: "Designation Deactivated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
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
        text: "Could not Deactivate Designation",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't deactivate the record!", error.message);
    }
  };
  const handleMultipleActivate = async (id) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Activate?",
        text: "Do you want to Activate these Designation?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        const idList = selectedIds.map((id) => id.toString()); // Ensure IDs are strings

        setLoading(true);
        const response = await axios.post(
          BaseAPI + "/admin/designations/index",

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
          Swal.fire({
            title: "Designation Activated successfully!",
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
        text: "Could not Activate Skills",
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
        text: "Do you want to Delete these Designation?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        const idList = selectedIds.map((id) => id.toString()); // Ensure IDs are strings
        setLoading(true);
        const response = await axios.post(
          BaseAPI + "/admin/designations/index",
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
            title: "Designation Deleted successfully!",
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
        text: "Could not Delete Skills",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't Delete the record!", error.message);
    }
  };
  // Search functionality

  const [searchKeyword, setSearchKeyword] = useState("");
  const [skills, setSkills] = useState(null);
  const [filteredSkills, setFilteredSkills] = useState([]);

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    // Filter skills based on the keyword
    const filtered = userData.filter((userData) =>
      userData.designation_name.toLowerCase().includes(keyword.toLowerCase())
    );
    setSkills(filtered);
    // console.log(filtered);
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      field: "Name",
      headerName: "Name",
      flex: 2,
      width: 300,

      headerClassName: "redText",
    },
    {
      field: "designation_type",
      headerName: "Designation Type",
      flex: 2,
      width: 240,
      headerClassName: "redText",
    },
    {
      field: "createdat",
      headerName: "Created at",
      flex: 2,
      width: 340,
      headerClassName: "redText",
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "redText",
      width: 293,
      flex: 1,
      renderCell: (params) => (
        <div className="process__actionnn" style={{ margin: "10px 0px" }}>
          {params.row.status === 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => {
                handleDeactivate(params.row.slug);
                e.stopPropagation(); // Prevents event bubbling
              }}
              title="Deactivate Now"
              className="btn btn-success btn-successss"
            >
              <i className="fa-solid fa-check"></i>
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={(e) => {
                handleActivate(params.row.slug);
                e.stopPropagation(); // Prevents event bubbling
              }}
              title="Activate Now"
              className="btn btn-danger btn-deactivateee"
            >
              <i className="fa-solid fa-ban"></i>
            </Button>
          )}
          {params.row.employer_id !== 0 && (
            <Link
              href={`designation/edit/${params.row.slug}`}
              title="Edit"
              className="btn btn-warning btn-Edittt"
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
              }}
            >
              <i className="fa-solid fa-square-pen"></i>
            </Link>
          )}

          <Button
            variant="contained"
            color="secondary"
            onClick={(e) => {
              handleDelete(params.row.slug);
              e.stopPropagation(); // Prevents event bubbling
            }}
            title="Delete"
            className="btn btn-danger btn-Deleteee"
          >
            <i className="fa-solid fa-trash-can"></i>
          </Button>
        </div>
      ),
    },
  ];

  const rows = skills
    ? skills.map((i) => ({
        id: i.designation_id,
        employer_id: i.employer_id,
        designation_type:
          item.employer_id === 0 ? "System Generated" : "Custom",
        Name: i.designation_name,
        createdat: i.created,
        status: i.status,
        slug: i.slug,
      }))
    : userData.map((item) => ({
        id: item.designation_id,
        employer_id: item.employer_id,
        designation_type:
          item.employer_id === 0 ? "System Generated" : "Custom",
        Name: item.designation_name,
        createdat: item.created,
        status: item.status,
        slug: item.slug,
      }));

  return (
    <>
      <EmployerLayout>
        {loading && <div className="loader-container"></div>}
        <div
          className=" backgroundColour adminChangeUsername "
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
                <i class="fa-solid fa-briefcase"></i>
                <span> Designation</span>
              </div>
            </div>
          </div>

          <div className="">
            <div className="serachKeyItems  bg-white">
              <form action="">
                <p>Search Designation by Designation Name</p>
                <div className="flex flex-col md:flex-row justify-between items-center w-full md:gap-4">
                  <div className="w-full flex flex-col md:flex-row items-center gap-2 flex-grow">
                    <input
                      type="text"
                      className="formm-control w-full md:flex-grow md:w-auto"
                      placeholder="Search By Designation Name"
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
                    <Link
                      href="/employer/designation/adddesignation"
                      className="btn btn-SubAdmin-add"
                    >
                      Add Designation
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            <div className="interviewPreviewTable">
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
                  onRowSelectionModelChange={(newRowSelectionModel) => {
                    setSelectedIds(newRowSelectionModel);
                    // console.log(selectedIds);
                    // console.log("object")
                  }}
                  rowSelectionModel={selectedIds}
                  {...userData}
                  isRowSelectable={(params) => params.row.employer_id !== 0}
                />
              </div>

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
      </EmployerLayout>
    </>
  );
};

export default Page;
