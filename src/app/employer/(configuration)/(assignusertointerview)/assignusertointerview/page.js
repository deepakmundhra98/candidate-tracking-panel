"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "../../../../common.css";
import AdminFooter from "@/app/admin/Components/AdminFooter/AdminFooter";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import EmployerLayout from "../../../EmployerLayout";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "react-bootstrap";

const Page = () => {
  const [userData, setUserData] = useState([]);
  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processData, setProcessData] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [skills, setSkills] = useState(null);
  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };
  const token = Cookies.get("tokenEmployer");

  const columns = [
    {
      id: "",
      field: "process",
      headerName: "Process Name",
      width: 260,
      flex: 1,
      headerClassName: "redText",
    },
    {
      field: "assigned",
      headerName: "Assigned User",
      width: 260,
      flex: 1,
      headerClassName: "redText",
    },
    {
      field: "created_at",
      headerName: "Created at",
      width: 155,
      flex: 1,
      headerClassName: "redText",
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "redText",
      width: 298,
      flex: 1,
      renderCell: (params) => (
        <div className="process__actionnn" style={{ margin: "10px 0px" }}>
          {params.row.status === 1 ? (
            <Button
              variant="contained"
              color="primary"
              // onClick={() => handleDeactivate(params.row.slug)}
              onClick={(e) => {
                handleDeactivate(params.row.id);
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
                handleActivate(params.row.id);
                e.stopPropagation(); // Prevents event bubbling
              }}
              title="Activate"
              className="btn btn-danger btn-deactivateee"
            >
              <i className="fa-solid fa-ban"></i>
            </Button>
          )}

          <Link
            href={`/employer/assignusertointerview/edit/${params.row.id}`}
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
              handleDelete(params.row.id);
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
    ? skills.map((item) => ({
        id: item.id,
        process: item.process_name,
        assigned: item.user_name,
        created_at: item.created_at,
        status: item.status,
        slug: item.slug,
      }))
    : userData.map((item) => ({
        id: item.id,
        process: item.process_name,
        assigned: item.user_name,
        created_at: item.created_at,
        status: item.status,
        slug: item.slug,
      }));

  const getData = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        BaseAPI + "/admin/assignusertoprocess/index",
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setUserData(response.data.response);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log(error.message);
    }
  };
  const handleDelete = async (id) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Delete Assigned Process?",
        text: "Do you want to Delete the Assigned Process?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/assignusertoprocess/delete/${id}`,
          null, // Pass null as the request body if not required
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer" + " " + token,
            },
          }
        );
        // setLoading(false);
        if (response.data.status === 200) {
          Swal.fire({
            title: "Interview Status deleted successfully!",
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
        text: "Could not Delete Interview Satus",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't delete the record!", error.message);
    }
  };

  // Multiple Activate deactivated and delete

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
          BaseAPI + "/admin/assignusertoprocess/index",
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
          BaseAPI + "/admin/assignusertoprocess/index",

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
          BaseAPI + "/admin/assignusertoprocess/index",
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

  useEffect(() => {
    getData();
  }, []);
  const handleActivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Activate User Assign?",
        text: "Do you want to Activate this User Assign?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/assignusertoprocess/activate/${slug}`,
          null, // Pass null as the request body if not required
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer" + " " + token,
            },
          }
        );
        // setLoading(false);
        if (response.data.status === 200) {
          Swal.fire({
            title: "User Assign Activated successfully!",
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
        text: "Could not Activate User Assign",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't activate the record!", error.message);
    }
  };

  const handleDeactivate = async (slug) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Deactivate User Assign?",
        text: "Do you want to Deactivate this User Assign?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/assignusertoprocess/deactivate/${slug}`,
          null, // Pass null as the request body if not required
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer" + " " + token,
            },
          }
        );
        // setLoading(false);
        if (response.data.status === 200) {
          Swal.fire({
            title: " User Assign Deactivated successfully!",
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
        text: "Could not Deactivate User Assign",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't deactivate the record!", error.message);
    }
  };

  // Search functionality



  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    // Filter skills based on the keyword
    const filtered = userData.filter((userData) =>
      userData.process_name.toLowerCase().includes(keyword.toLowerCase())
    );
    setSkills(filtered);
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearchKeyword("");
    setSkills();
  };

  return (
    <>
      <EmployerLayout>
        {loading && <div className="loader-container"></div>}
        <div className="adminChangeUsername" style={{ minHeight: "80vh" }}>
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
              <Link
                underline="hover"
                color="inherit"
                href="/employer/configuration"
              >
                <div className="flex gap-2 items-center justify-center">
                  <i className="fa fa-gears"></i>
                  <span>
                    Configuration{" "}
                    <i class="fa-solid fa-angles-right text-xs"></i>
                  </span>
                </div>
              </Link>
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-list"></i>
                <span> Assign Users to interview</span>
              </div>
            </div>
          </div>

          <div className="backgroundColor p-0">
            <div className="">
              <div className="serachKeyItems  bg-white">
                <form action="">
                  <p>Search Process by Process Name</p>
                  <div className="flex flex-col md:flex-row justify-between items-center w-full md:gap-4">
                    <div className="w-full flex flex-col md:flex-row items-center gap-2 flex-grow">
                      <input
                        type="text"
                        className="formm-control w-full md:flex-grow md:w-auto"
                        placeholder="Search By Process Name"
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
                        href="/employer/assignnewprocess"
                        className="btn btn-SubAdmin-add"
                      >
                        Assign Process
                      </Link>
                    </div>
                  </div>
                </form>
              </div>

              <div className="interviewPreviewTable TableScroll">
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
                  {/* <div className="BottomButtom">
                    <button
                      className="btn btn-dark btn-Activateee "
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
                  </div> */}
                </div>
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
