"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "../../newcommon.css";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import BaseAPI from "../../BaseAPI/BaseAPI";
import AdminFooter from "../../admin/Components/AdminFooter/AdminFooter";
import Cookies from "js-cookie";
import EmployerLayout from "../EmployerLayout";

const Page = () => {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkedData, setCheckedData] = useState([]);
  // const token = Cookies.get("token");
  const token = Cookies.get("tokenEmployer");

  const [selectedIds, setSelectedIds] = useState([]);

  // Function to handle selection change
  const handleSelectionChange = (selectionModel) => {
    setSelectedIds(selectionModel);

    // Get the IDs of the selected records
    const selectedIdsArray = selectionModel.map((id) => id.toString());
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + "/admin/qualifications/index",
        { user_type: "employer" }, // Pass null as the request body if not required
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
        title: "Delete Qualification?",
        text: "Do you want to Delete this Qualification?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/qualifications/delete/${slug}`,
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
            title: "Qualification Name deleted successfully!",
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
        text: "Could not Delete Qualification",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't delete the record!", error.message);
    }
  };

  const handleActivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Activate Qualification?",
        text: "Do you want to Activate this Qualification?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/qualifications/activate/${slug}`,
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
            title: "Qualification Activated successfully!",
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
        text: "Could not Activate Qualification",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't activate the record!", error.message);
    }
  };

  const handleDeactivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Deactivate Qualification?",
        text: "Do you want to Deactivate this Qualification?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/qualifications/deactivate/${slug}`,
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
            title: "Qualification Deactivated successfully!",
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
        text: "Could not Deactivate Qualification",
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

        // console.log(idList);

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
              Authorization: "Bearer" + " " + token,
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

        // console.log(idList);
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
              Authorization: "Bearer" + " " + token,
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
      field: "Name",
      headerName: "Name",
      width: 300,
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
      field: "created",
      headerName: "Created at",
      width: 340,
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
          {params.row.employer_id !== 0 && (
            <Link
              href={`qualificationlist/edit/${params.row.slug}`}
              className="btn  btn-warning btn-Edittt"
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
              }}
            >
              <i class="fa-solid fa-square-pen"></i>
            </Link>
          )}

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
        </div>
      ),
    },
  ];

  const rows = skills
    ? skills.map((i) => ({
        id: i.qualification_id,
        employer_id: i.employer_id,
        added_by:
          i.employer_id === 0
            ? "System generated"
            : i.user_type === "employer"
            ? "Employer"
            : "Staff",
        Name: i.qualification_name,
        created: i.created,
        status: i.status,
        slug: i.slug,
      }))
    : listData.map((item) => ({
        id: item.qualification_id,
        employer_id: item.employer_id,
        added_by:
          item.employer_id === 0
            ? "System generated"
            : item.user_type === "employer"
            ? "Employer"
            : "Staff",

        Name: item.qualification_name,
        created: item.created,
        status: item.status,
        slug: item.slug,
      }));

  return (
    <>
      <EmployerLayout>
        {loading && <div className="loader-container"></div>}
        <div className="adminChangeUsername" style={{ minHeight: "80vh" }}>
          <div>
            <div className="breadCumb1" role="">
              <div className="flex gap-3 items-center">
                <Link
                  underline="hover"
                  color="inherit"
                  href="/employer/dashboard"
                >
                  <div className="flex gap-2 items-center">
                    <i className="fa-solid fa-gauge "></i>
                    <span>
                      Dashboard <i class="fa-solid fa-angles-right text-xs"></i>
                    </span>
                  </div>
                </Link>
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-graduation-cap"></i>
                  <span>Qualification List</span>
                </div>
              </div>
            </div>
          </div>

          <div className=" backgroundColor ">
            <div className="">
              <div className="serachKeyItems  bg-white">
                <form action="">
                  <p>Search Qualification by Qualification Name</p>
                  <div className="flex flex-col md:flex-row justify-between items-center w-full md:gap-4">
                    <div className="w-full flex flex-col md:flex-row items-center gap-2 flex-grow">
                      <input
                        type="text"
                        className="formm-control w-full md:flex-grow md:w-auto"
                        placeholder="Search By Qualification Name"
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
                        href="/employer/qualificationlist/add"
                        className="btn btn-SubAdmin-add"
                      >
                        Add Qualification
                      </Link>
                    </div>
                  </div>
                </form>
              </div>

              {listData.length !== "" ? (
                <>
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
                          console.log(selectedIds);
                          // console.log("object")
                        }}
                        rowSelectionModel={selectedIds}
                        {...listData}
                        isRowSelectable={(params) =>
                          params.row.employer_id !== 0
                        }
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
              ) : (
                <>No Data</>
              )}
            </div>
          </div>
        </div>
        <AdminFooter />
      </EmployerLayout>
    </>
  );
};

export default Page;
