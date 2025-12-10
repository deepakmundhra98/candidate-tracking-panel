"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import "../../common.css";
import "@fortawesome/fontawesome-free/css/all.css";
import Swal from "sweetalert2";
import AdminFooter from "../../admin/Components/AdminFooter/AdminFooter";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import StaffLayout from "../StaffLayout";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "react-bootstrap";

const Page = () => {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedData, setCheckedData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const token = Cookies.get("tokenStaff");
  const [userAccess, setUserAccess] = useState({});

  useEffect(() => {
    const access = Cookies.get("access");

    if (typeof access !== null || access !== "" || access !== undefined) {
      setUserAccess(JSON.parse(access));
    } else {
      setUserAccess({});
    }
  }, []);
  // Search functionality

  const [searchKeyword, setSearchKeyword] = useState("");
  const [skills, setSkills] = useState(null);
  const [filteredSkills, setFilteredSkills] = useState([]);

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    // Filter skills based on the keyword
    const filtered = listData.filter((listData) =>
      listData.category_name.toLowerCase().includes(keyword.toLowerCase())
    );
    setSkills(filtered);
    // console.log(filtered);
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearchKeyword("");
    setSkills();
  };

  const getData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + "/admin/category/index",
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
        setListData(response.data.response);
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/staff/dashboard");
        });
      }
    } catch (error) {
      setLoading(false);
      console.log("Cannot get plans data at APmanageplans");
    }
  };
  const handleActivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Activate Category?",
        text: "Do you want to Activate this category?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/category/activate/${slug}`,
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
            title: "Category Activated successfully!",
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
        text: "Could not Activate Category",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't activate the record!", error.message);
    }
  };
  const handleDeactivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Deactivate Category?",
        text: "Do you want to Deactivate this Category?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/category/deactivate/${slug}`,
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
            title: "Category Deactivated successfully!",
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
        text: "Could not Deactivate Category",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't deactivate the record!", error.message);
    }
  };

  const handleDelete = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Delete Category?",
        text: "Do you want to Delete this Category?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/category/delete/${slug}`,
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
            title: "Category deleted successfully!",
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
        text: "Could not Delete Category",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't delete the record!", error.message);
    }
  };

  const handleMultipleDeactivate = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Deactivate?",
        text: "Do you want to Deactivate these Category?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        const idList = selectedIds.map((id) => id.toString()); // Ensure IDs are strings

        setLoading(true);
        const response = await axios.post(
          BaseAPI + "/admin/category/index",
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
            title: "Category Deactivated successfully!",
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
        text: "Could not Deactivate Category",
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
        text: "Do you want to Activate these Category?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        const idList = selectedIds.map((id) => id.toString()); // Ensure IDs are strings

        setLoading(true);
        const response = await axios.post(
          BaseAPI + "/admin/category/index",
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
            title: "Category Activated successfully!",
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
        text: "Could not Activate Category",
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
        text: "Do you want to Delete these Category?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        const idList = selectedIds.map((id) => id.toString()); // Ensure IDs are strings

        setLoading(true);
        const response = await axios.post(
          BaseAPI + "/admin/category/index",
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
            title: "Category Deleted successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
        } else if (response.data.status === 500) {
          console.log("Error 500 response:", response.data);
          Swal.fire({
            title: response.data.message,
            text: response.data.system_generated_skills
              .map((i) => {
                return i.name + ", ";
              })
              .join(""),
            icon: "warning",
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
        text: "Could not Delete Category",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't Delete the record!", error.message);
    }
  };

  const columns = [
    {
      field: "Name",
      headerName: "Name",
      width: 340,
      flex: 2,
      headerClassName: "redText",
    },
    {
      field: "added_by",
      headerName: "Added By",
      width: 240,
      flex: 1,
      headerClassName: "redText",
    },

    {
      field: "createdat",
      headerName: "Created at",
      width: 240,
      flex: 1,
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
          {params.row.employer_id !== 0 && userAccess[2]?.Edit === 1 && (
            <Link
              href={`categories/edit/${params.row.slug}`}
              title="Edit"
              className="btn btn-warning btn-Edittt"
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
              }}
            >
              <i className="fa-solid fa-square-pen"></i>
            </Link>
          )}
          {userAccess[2]?.Delete === 1 && (
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
          )}
        </div>
      ),
    },
  ];

  const rows = skills
    ? skills.map((i) => ({
        employer_id: i.employer_id,
        added_by:
          i.employer_id === 0
            ? "System Generated"
            : i.user_type === "employer"
            ? "Employer"
            : "Staff",

        id: i.category_id,
        Name: i.category_name,
        createdat: i.created,
        status: i.status,
        slug: i.slug,
      }))
    : listData.map((item) => ({
        employer_id: item.employer_id,
        added_by:
          item.employer_id === 0
            ? "System Generated"
            : item.user_type === "employer"
            ? "Employer"
            : "Staff",
        id: item.category_id,
        Name: item.category_name,
        createdat: item.created,
        status: item.status,
        slug: item.slug,
      }));

  useEffect(() => {
    getData();
    window.scrollTo(0, 0);
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
                <i class="fa-solid fa-sitemap"></i>
                <span>Category List</span>
              </div>
            </div>
          </div>
          <div className="">
            
            <div className="serachKeyItems  bg-white">
              <form action="">
                <p>Search Category by Category Name</p>
                <div className="flex flex-col md:flex-row justify-between items-center w-full md:gap-4">
                  <div className="w-full flex flex-col md:flex-row items-center gap-2 flex-grow">
                    <input
                      type="text"
                      className="formm-control  w-100 md:mb-0"
                      placeholder="Search By Category Name"
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
                  {userAccess[2]?.Add === 1 && (
                    <div className="add__interviewwww">
                      <Link
                        href="/staff/categories/add"
                        className="btn btn-Category-add"
                      >
                        Add Category
                      </Link>
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="interviewPreviewTable TableScroll">
              <div style={{ height: 400, width: "100%" }}>
                {/* <DataGrid
                  rows={rows}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 }
                    }
                  }}
                  pageSizeOptions={[5, 10]}
                  checkboxSelection
                /> */}

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
                  isRowSelectable={(params) => params.row.employer_id !== 0}
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
      </StaffLayout>
    </>
  );
};

export default Page;
