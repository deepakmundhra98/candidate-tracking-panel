"use client";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import "../../common.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useState, useEffect } from "react";
import AdminFooter from "../../admin/Components/AdminFooter/AdminFooter";
import { DataGrid } from "@mui/x-data-grid";
import Cookies from "js-cookie";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import EmployerLayout from "../EmployerLayout";

const Page = () => {
  // const navigate = useNavigate();

  const [userData, setUserData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const tokenEmployer = Cookies.get("tokenEmployer");

  // Search functionality

  const [searchKeyword, setSearchKeyword] = useState("");
  const [skills, setSkills] = useState(null);
  const [filteredSkills, setFilteredSkills] = useState([]);

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    // Filter skills based on the keyword
    const filtered = userData.filter(
      (user) =>
        user.username.toLowerCase().includes(keyword.toLowerCase()) ||
        user.email_address.toLowerCase().includes(keyword.toLowerCase())
    );

    setSkills(filtered);
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearchKeyword("");
    setSkills();
  };

  const handleMultipleDeactivate = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Deactivate?",
        text: "Do you want to deactivate these Staff?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (confirmationResult.isConfirmed) {
        const idList = selectedIds.map((id) => id.toString()); // Ensure IDs are strings

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
            title: "Staff deactivated successfully!",
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
        text: "Could not deactivate Staff",
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
        text: "Do you want to activate these Staff?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        const idList = selectedIds.map((id) => id.toString()); // Ensure IDs are strings

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
              Authorization: "Bearer" + " " + tokenEmployer,
            },
          }
        );

        setLoading(false);
        if (response.data.status === 200) {
          Swal.fire({
            title: "Staff Activated successfully!",
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
        text: "Could not activate Staff",
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
        text: "Do you want to Delete these Staffs?",
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
            title: "Staff Deleted successfully!",
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
        text: "Could not Delete Staff",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't Delete the record!", error.message);
    }
  };

  const columns = [
    {
      field: "id",
      field: "userName",
      headerName: "User Name",
      flex: 1, // takes equal space
      width: 130,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      width: 133,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      width: 130,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2,
      type: "email",
      headerClassName: "redText",
      cellClassName: "redBorder",
      width: 200,
    },
    {
      field: "created_at",
      headerName: "Created At",
      cellClassName: "redBorder",
      headerClassName: "redText",
      flex: 1,
      width: 180,
    },
    {
      field: "action",
      headerName: "Action",
      // flex: 1,
      width: 200,

      headerClassName: "redText",
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

          <Link
            href={`/employer/managestaff/edit/${params.row.slug}`}
            title="Edit"
            onClick={(e) => {
              e.stopPropagation(); // Prevents event bubbling
            }}
            className="btn btn-warning btn-Edittt"
          >
            <i className="fa-solid fa-square-pen"></i>
          </Link>

          <Button
            variant="contained"
            color="secondary"
            // onClick={() => handleDelete(params.row.slug)}
            onClick={(e) => {
              handleDelete(params.row.slug);
              e.stopPropagation(); // Prevents event bubbling
            }}
            title="Delete"
            className="btn btn-danger btn-Deleteee"
          >
            <i className="fa-solid fa-trash-can"></i>
          </Button>
          <Link
            href={`/employer/managestaff/manage-roles/${params.row.slug}`}
            title="Manage roles"
            onClick={(e) => {
              e.stopPropagation(); // Prevents event bubbling
            }}
            className="btn btn-warning btn-Edittt"
          >
            <i className="fa-solid fa-add"></i>
          </Link>
        </div>
      ),
    },
  ];

  const rows =
    skills?.length > 0
      ? skills.map((i) => ({
          id: i.staff_id,
          userName: i.username,
          firstName: i.first_name,
          lastName: i.last_name,
          email: i.email_address,
          created_at: i.created,
          status: i.status,
          slug: i.slug,
        }))
      : searchKeyword?.trim() // Check if a search is in progress
      ? [] // Show empty data when nothing matches the skills
      : userData.map((item) => ({
          id: item.staff_id,
          userName: item.username,
          firstName: item.first_name,
          lastName: item.last_name,
          email: item.email_address,
          created_at: item.created,
          status: item.status,
          slug: item.slug,
        }));

  // const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkedData, setCheckedData] = useState([]);

  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        BaseAPI + "/admin/user/staff",

        null,
        {
          headers: {
            "Content-Type": "application/json",
            // key: ApiKey,
            Authorization: "Bearer" + " " + tokenEmployer,
          },
        }
      );
      setUserData(response.data.response);
      setLoading(false);
      // console.log(response.data.response);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const handleDelete = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Delete Staff?",
        text: "Do you want to Delete this Staff?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/user/staff/delete/${slug}`,
          null, // Pass null as the request body if not required
          {
            headers: {
              "Content-Type": "application/json",
              // key: ApiKey,
              Authorization: "Bearer" + " " + tokenEmployer,
              // token: tokenKey,
              // adminid: adminID,
            },
          }
        );
        setLoading(false);
        if (response.data.status === 200) {
          Swal.fire({
            title: "Staff deleted successfully!",
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
        text: "Could not Delete Staff",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't delete the record!", error.message);
    }
  };

  const handleActivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Activate Staff?",
        text: "Do you want to Activate this Staff?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/user/staff/activate/${slug}`,
          null, // Pass null as the request body if not required
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
            title: "Staff Activated successfully!",
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
        text: "Could not Activate Staff",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't activate the record!", error.message);
    }
  };

  const handleDeactivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Deactivate Staff?",
        text: "Do you want to Deactivate this Staff?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/user/staff/deactivate/${slug}`,
          null, // Pass null as the request body if not required
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
            title: "Staff Deactivated successfully!",
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
        text: "Could not Deactivate Staff",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't deactivate the record!", error.message);
    }
  };

  useEffect(() => {
    getData();
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <EmployerLayout>
        {loading && <div className="loader-container"></div>}
        <div className="adminChangeUsername" style={{ minHeight: "80vh" }}>
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
                <i class="fa-solid fa-users"></i>
                <span> Manage Staff</span>
              </div>
            </div>
          </div>
          <div className="">
            <div className="w-full">
              {/* <div className="profilelogo inline-block">
              <h2>Staff List</h2>
            </div> */}
              {/* <div className="add--processs !float-right">
              <div className="add__interviewwww !w-fit">
                <Link
                  href="/employer/managestaff/add"
                  className="btn btn-SubAdmin-add "
                >
                  Add Staff
                </Link>
              </div>
            </div> */}
            </div>
            <div className="serachKeyItems  bg-white">
              <form action="">
                <p>Search staff by typing First Name, Last Name, Email</p>
                <div className="flex flex-col md:flex-row justify-between items-center w-full md:gap-4">
  {/* Left Section: Search + Clear */}
  <div className="w-full flex flex-col md:flex-row items-center gap-2 flex-grow">
    <input
      type="text"
      className="formm-control w-full md:flex-grow md:w-auto"
      placeholder="Search By Keyword"
      value={searchKeyword}
      onChange={handleSearch}
    />
    <button
      className="btn btn-clearFilters w-full md:w-auto"
      onClick={handleClearFilters}
    >
      Clear Filters
    </button>
  </div>

  {/* Right Section: Add Button */}
  <div className="add__interviewwww">
    <Link
      href="/employer/managestaff/add"
      className="btn btn-SubAdmin-add"
    >
      Add Staff
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
                  }}
                  rowSelectionModel={selectedIds}
                  {...userData}
                />
              </div>
              <div className="BottomButtom">
                <button
                  className="btn btn-dark btn-Activateee"
                  onClick={() => handleMultipleActivate()}
                >
                  Activate
                </button>

                <button
                  className="btn btn-dark btn-Activateee"
                  onClick={() => handleMultipleDeactivate()}
                >
                  Deactivate
                </button>
                <button
                  className="btn btn-dark btn-Activateee"
                  onClick={() => handleMultipleDelete()}
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
