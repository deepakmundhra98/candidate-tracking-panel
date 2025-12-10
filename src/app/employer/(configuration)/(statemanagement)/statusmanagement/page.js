"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import "../../../../common.css";
import AdminFooter from "@/app/admin/Components/AdminFooter/AdminFooter";
import axios from "axios";
import { useEffect } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "react-bootstrap";
import EmployerLayout from "../../../EmployerLayout";

const Page = () => {
  const [userData, setUserData] = useState([]);
  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("tokenEmployer");

  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };

  const getData = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        BaseAPI + "/admin/interviewstatus/index",
        null,
        {
          headers: {
            "Content-Type": "application/json",
            // key: ApiKey,
            Authorization: "Bearer" + " " + token,
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
        title: "Delete Interview Status ?",
        text: "Do you want to Delete this Interview Status ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/interviewstatus/delete/${slug}`,
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
  useEffect(() => {
    getData();
  }, []);

  const columns = [
    { field: "Name", headerName: "Status Name", width: 600, flex: 1 },
    {
      field: "action",
      headerName: "Action",
      width: 300,
      flex: 1,
      renderCell: (params) => (
        <div
          className="process__actionnn"
          style={{ margin: "10px 0px", height: "30px" }}
        >
          <Link
            href={`statusmanagement/edit/${params.row.slug}`}
            onClick={(e) => {
              e.stopPropagation(); // Prevents event bubbling
            }}
            title="Edit"
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
        </div>
      ),
    },
  ];

  const [searchKeyword, setSearchKeyword] = useState("");
  const [skills, setSkills] = useState(null);

  const rows = skills
    ? skills.map((item) => ({
        id: item.interview_status_id,
        Name: item.interview_status_name,
        slug: item.slug,
      }))
    : userData.map((item) => ({
        id: item.interview_status_id,
        Name: item.interview_status_name,
        slug: item.slug,

        // id: item.interview_process_id,
        // Name: item.interview_process_name,
      }));

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    // Filter skills based on the keyword
    const filtered = userData.filter((userData) =>
      userData.interview_status_name
        .toLowerCase()
        .includes(keyword.toLowerCase())
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
              <div className="flex gap-2 items-center">
                <i className="fa-solid fa-info-circle"></i>
                <span>Manage Status</span>
              </div>
            </div>
          </div>
          <div className="statusManage backgroundColor">
            <div className="serachKeyItems  bg-white">
              <form action="">
                <p>Search Status by Status Name</p>
                <div className="flex flex-col md:flex-row justify-between items-center w-full md:gap-4">
                  <div className="w-full flex flex-col md:flex-row items-center gap-2 flex-grow">
                    <input
                      type="text"
                      className="formm-control w-full md:flex-grow md:w-auto"
                      placeholder="Search By Status Name"
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
                      href="/employer/statusmanagement/addstatus"
                      className="btn btn-SubAdmin-add"
                    >
                      Add Status
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            <div className="interviewPreviewTable">
              <div className="" style={{ padding: "8px 0px" }}>
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
                  />
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
