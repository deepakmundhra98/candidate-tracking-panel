"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";

import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import BaseAPI from "../../BaseAPI/BaseAPI";
import AdminFooter from "../Components/AdminFooter/AdminFooter";
import Cookies from "js-cookie";
import AdminLayout from "../AdminLayout";

const Page = () => {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkedData, setCheckedData] = useState([]);
  const token = Cookies.get("token");
  const [selectedIds, setSelectedIds] = useState([]);

  // Function to handle selection change
  const handleSelectionChange = (selectionModel) => {
    console.log("object");
    setSelectedIds(selectionModel);

    // Get the IDs of the selected records
    const selectedIdsArray = selectionModel.map((id) => id.toString());

    console.log("Selected IDs:", selectedIdsArray);
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + "/admin/user/staff",
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
      setListData(response.data.response);
      //   console.log(paymentHistory);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get plans data at APmanageplans");
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
              Authorization: "Bearer" + " " + token,
              // adminid: adminID,
            },
          }
        );
        setLoading(false);

        if (response.data.status === 200) {
          Swal.fire({
            title: "Staff  deleted successfully!",
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
              Authorization: "Bearer" + " " + token,
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

  // const handleSelectionChange = selectionModel => {
  //   setSelectIds(selectionModel)
  //   console.log(selectionModel);
  // }

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
              Authorization: "Bearer" + " " + token,
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

  const handleMultipleDeactivate = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Deactivate?",
        text: "Do you want to Deactivate these Qualifications?",
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
          BaseAPI + "/admin/qualifications/index",
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
            title: "Qualifications Deactivated successfully!",
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
        text: "Could not Deactivate Qualifications",
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
        text: "Do you want to Activate these Qualification?",
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
          BaseAPI + "/admin/qualifications/index",
          {
            idList: idList.join(","),
            action: "activate",
          }, // Pass null as the request body if not required
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
            title: "Qualification Activated successfully!",
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
        text: "Could not Activate Qualification",
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
          BaseAPI + "/admin/qualifications/index",
          {
            idList: idList.join(","),
            action: "delete",
          }, // Pass null as the request body if not required
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

  const [searchKeyword, setSearchKeyword] = useState("");
  const [skills, setSkills] = useState(null);
  const [filteredSkills, setFilteredSkills] = useState([]);

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    // Filter skills based on the keyword
    const filtered = listData.filter((listData) =>
      listData.qualification_name.toLowerCase().includes(keyword.toLowerCase())
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
    window.scrollTo(0, 0);
  }, []);

  // let listData = await fetch("")

  const columns = [
    {
      field:"id",
      field: "userName",
      headerName: "User Name",
      width: 130,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },
    {
      field: "firstName",
      headerName: "First name",
      width: 133,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 130,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },
    {
      field: "email",
      headerName: "Email",
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
      width: 180,
    },

    {
      field: "action",
      headerName: "Action",
      headerClassName: "redText",
      width: 200,
      renderCell: (params) => (
        <div className="process__actionnn" style={{ margin: "10px 0px" }}>
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

          <Link
            href={`managestaff/edit/${params.row.slug}`}
            className="btn  btn-warning btn-Edittt"
            onClick={(e) => {
              e.stopPropagation(); // Prevents event bubbling
            }}
          >
            <i class="fa-solid fa-square-pen"></i>
          </Link>
          <button
            className="btn  btn-danger btn-Deleteee"
            // onClick={() => handleDelete(params.row.slug)}
            onClick={(e) => {
              handleDelete(params.row.slug);
              e.stopPropagation(); // Prevents event bubbling
            }}
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>
          <button
            className="btn btn-info btn-StaffList text-white"
            onClick={(e) => {
              handleStaffList(params.row.slug);
              e.stopPropagation(); // Prevents event bubbling
            }}
            title="Staff List"
          >
            <i className="fa-solid fa-users"></i>
          </button>
        </div>
      ),
    },
  ];

  const rows = skills
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
    : listData.map((item) => ({
        id: item.staff_id,
        userName: item.username,

        firstName: item.first_name,
        lastName: item.last_name,
        email: item.email_address,
        created_at: item.created,
        status: item.status,
        slug: item.slug,
      }));

  return (
    <>
      <AdminLayout>
        {loading && <div className="loader-container"></div>}
        <div className="adminChangeUsername" style={{ minHeight: "80vh" }}>
          <div>
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
                  <i class="fa-solid fa-graduation-cap"></i>
                  <span>Staff List</span>
                </div>
              </div>
            </div>
          </div>

          <div className=" backgroundColor ">
            <div className="">
              <div className="profilelogo">
                <h2>Staff List</h2>
              </div>
              <div className="add--processs">
                <div className="add__interviewwww">
                  <Link
                    href="/admin/managestaff/add"
                    className="btn btn-qualification-add "
                  >
                    Add Staff
                  </Link>
                </div>
              </div>
              <div className="serachKeyItems  bg-white">
                <form action="">
                  <p>Search Employer by typing</p>
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

              <>
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
                      onRowSelectionModelChange={(newRowSelectionModel) => {
                        setSelectedIds(newRowSelectionModel);
                        console.log(selectedIds);
                        // console.log("object")
                      }}
                      rowSelectionModel={selectedIds}
                      {...listData}
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
              </>
            </div>
          </div>
        </div>
        <AdminFooter />
      </AdminLayout>
    </>
  );
};

export default Page;
