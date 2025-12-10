"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import AdminFooter from "../Components/AdminFooter/AdminFooter";
import axios from "axios";
import BaseAPI from "../../BaseAPI/BaseAPI";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "react-bootstrap";
import AdminLayout from "../AdminLayout";

const Page = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkedData, setCheckedData] = useState([]);
  const token = Cookies.get("token");
  const [selectedIds, setSelectedIds] = useState([]);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(BaseAPI + "/admin/skills/index", null, {
        headers: {
          "Content-Type": "application/json",
          // key: ApiKey,
          Authorization: "Bearer" + " " + token,
        },
      });
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
        title: "Delete Skill?",
        text: "Do you want to Delete this skill?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/skills/delete/${slug}`,
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
            title: "Skill deleted successfully!",
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
        text: "Could not Delete skill",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't delete the record!", error.message);
    }
  };

  const handleActivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Activate Skill?",
        text: "Do you want to Activate this Skill?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/skills/activate/${slug}`,
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
            title: "Skill Activated successfully!",
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
        text: "Could not Activate Skill",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't activate the record!", error.message);
    }
  };

  const handleDeactivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Deactivate Skill?",
        text: "Do you want to Deactivate this Skill?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/skills/deactivate/${slug}`,
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
            title: "Skill Deactivated successfully!",
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
        text: "Could not Deactivate Skill",
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
        text: "Do you want to Deactivate these skills?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        const idList = selectedIds.map((id) => id.toString()); // Ensure IDs are strings

        console.log(idList);

        // console.log(ids)
        console.log(checkedData);

        setLoading(true);
        const response = await axios.post(
          BaseAPI + "/admin/skills/index",
          {
            idList: idList.join(","),
            action: "deactivate",
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
            title: "Skills Deactivated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
        } else {
          Swal.fire({
            title: "Couldn't Deactivate!",
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
        text: "Could not Deactivate Skills",
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
        text: "Do you want to Activate these Skills?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        const idList = selectedIds.map((id) => id.toString()); // Ensure IDs are strings

        // console.log(ids);
        setLoading(true);
        const response = await axios.post(
          BaseAPI + "/admin/skills/index",
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
            title: "Skills Activated successfully!",
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
        text: "Do you want to Delete these Skills?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        const idList = selectedIds.map((id) => id.toString()); // Ensure IDs are strings

        setLoading(true);
        const response = await axios.post(
          BaseAPI + "/admin/skills/index",
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
            title: "Skills Deleted successfully!",
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

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    // Filter skills based on the keyword
    const filtered = userData.filter((userData) =>
      userData.skill_name.toLowerCase().includes(keyword.toLowerCase())
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

  const columns = [
    {
      field: "Name",
      headerName: "Name",
      width: 340,
      headerClassName: "redText",
    },
    {
      field: "created",
      headerName: "Created at",
      width: 340,
      headerClassName: "redText",
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "redText",
      width: 293,
      renderCell: (params) => (
        <div className="process__actionnn" style={{ margin: "10px 0px" }}>
          {params.row.status === 1 ? (
            <Button
              variant="contained"
              color="primary"
              // onClick={() => handleDeactivate(params.row.slug)}
              onClick={(e) => {
                handleDeactivate(params.row.slug);
                e.stopPropagation(); // Prevents event bubbling
              }}
              title="Deactivate"
              className="btn btn-success btn-successss"
            >
              <i className="fa-solid fa-check"></i>
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              // onClick={() => handleActivate(params.row.slug)}
              onClick={(e) => {
                handleActivate(params.row.slug);
                e.stopPropagation(); // Prevents event bubbling
              }}
              title="Activate"
              className="btn btn-danger btn-deactivateee"
            >
              <i className="fa-solid fa-ban"></i>
            </Button>
          )}

          <Link
            href={`skills/edit/${params.row.slug}`}
            title="Edit"
            className="btn btn-warning btn-Edittt"
            onClick={(e) => {
              e.stopPropagation(); // Prevents event bubbling
            }}
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
        </div>
      ),
    },
  ];

  const rows = skills
    ? skills.map((i) => ({
        id: i.skill_id,
        Name: i.skill_name,
        created: i.created,
        status: i.status,
        slug: i.slug,
      }))
    : userData.map((item) => ({
        id: item.skill_id,
        Name: item.skill_name,
        created: item.created,
        status: item.status,
        slug: item.slug,
      }));

  return (
    <>
      <AdminLayout>
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
                <i class="fa-solid fa-atom"></i>
                <span> Skills List</span>
              </div>
            </div>
          </div>

          <div className="">
            <div className="profilelogo">
              <h2>Skill List</h2>
            </div>
            <div className="add--processs">
              <div className="add__interviewwww">
                <Link
                  href="/admin/skills/addskills"
                  className="btn btn-addAdmin "
                >
                  Add Skills
                </Link>
              </div>
            </div>
            <div className="serachKeyItems  bg-white">
              <form action="">
                <p>Search Skills by typing</p>
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

            <div className="interviewPreviewTable">
              <div style={{ height: 400, width: "100%" }}>
                {/* <DataGrid
                  rows={rows}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
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
      </AdminLayout>
    </>
  );
};

export default Page;
