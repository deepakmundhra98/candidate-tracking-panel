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
        BaseAPI + "/admin/qualifications/index",
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
      console.log(response.data.response);
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
              // key: ApiKey,
              Authorization: "Bearer" + " " + token,
              // adminid: adminID,
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

  // const handleSelectionChange = selectionModel => {
  //   setSelectIds(selectionModel)
  //   console.log(selectionModel);
  // }

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
      field: "Name",
      headerName: "Name",
      width: 340,
      headerClassName: "redText",
    },
    {
      field: "employer_name",
      headerName: "Employer Name",
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
            href={`qualificationlist/edit/${params.row.slug}`}
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
        </div>
      ),
    },
  ];

  const rows = skills
    ? skills.map((i) => ({
        id: i.qualification_id,
        Name: i.qualification_name,
        employer_name: i.employer_name,
        created: i.created,
        status: i.status,
        slug: i.slug,
      }))
    : listData.map((item) => ({
        id: item.qualification_id,
        Name: item.qualification_name,
        employer_name: item.employer_name,
        created: item.created,
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
                  <span>Qualification List</span>
                </div>
              </div>
            </div>
          </div>

          <div className=" backgroundColor ">
            <div className="">
              <div className="profilelogo">
                <h2>Qualification List</h2>
              </div>
              <div className="add--processs">
                <div className="add__interviewwww">
                  <Link
                    href="/admin/qualificationlist/add"
                    className="btn btn-qualification-add "
                  >
                    Add Qualification
                  </Link>
                </div>
              </div>
              <div className="serachKeyItems  bg-white">
                <form action="">
                  <p>Search Qualification by typing</p>
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

              {listData.length !== "" ? (
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
              ) : (
                <>No Data</>
              )}
            </div>
          </div>
        </div>
        <AdminFooter />
      </AdminLayout>
    </>
  );
};

export default Page;
