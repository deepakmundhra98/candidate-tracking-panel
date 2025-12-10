"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "../../../../common.css";

import Swal from "sweetalert2";

import AdminFooter from "@/app/admin/Components/AdminFooter/AdminFooter";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import { Button } from "react-bootstrap";
import Cookies from "js-cookie";
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
        BaseAPI + "/admin/interviewprocesses/index",
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setUserData(response.data.response);
      // console.log(response.data.response);
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
        title: "Delete Interview Process ?",
        text: "Do you want to Delete this Interview Process ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        // setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/interviewprocesses/delete/${slug}`,
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
            title: "Interview Process deleted successfully!",
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
        text: "Could not Delete Interview Process",
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
    { field: "Name", headerName: "Interview Process", width: 300, flex: 1 },
    { field: "process_type", headerName: "Process Type", width: 300, flex: 1 },
    {
      field: "general_process_status",
      headerName: "Interview Status",
      width: 300,
      flex: 1,
    },
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
            href={`/employer/processmanagement/edit/${params.row.slug}`}
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
        employer_id: item.employer_id,
        id: item.interview_process_id,
        Name: item.interview_process_name,
        process_type: item.employer_id === 0 ? "System Generated" : "Custom",
        status: item.status,
        slug: item.slug,
        general_process_status:
          item.general_process_status === "1"
            ? "General Interview Process"
            : "Job Interview Process",
      }))
    : userData.map((item) => ({
        employer_id: item.employer_id,
        id: item.interview_process_id,
        Name: item.interview_process_name,
        process_type: item.employer_id === 0 ? "System Generated" : "Custom",
        status: item.status,
        slug: item.slug,
        general_process_status:
          item.general_process_status === "1"
            ? "General Interview Process"
            : "Job Interview Process",
      }));

  // Search functionality



  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    // Filter skills based on the keyword
    const filtered = userData.filter((userData) =>
      userData.interview_process_name
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
              <div className="flex gap-2 items-center  ">
                <i className="fa-solid fa-clipboard-list"></i>
                <span>Interview Process</span>
              </div>
            </div>
          </div>
          <div className="changeProfilePicture backgroundColor">
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
                        href="/employer/processmanagement/add"
                        className="btn btn-SubAdmin-add"
                      >
                        Add Process
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
