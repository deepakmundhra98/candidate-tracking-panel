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
import StaffLayout from "../../../StaffLayout";
const Page = () => {
  const [userData, setUserData] = useState([]);
  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("tokenStaff");

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
      setLoading(false);
      if(response.data.status === 200) {
        setUserData(response.data.response);

      } else{
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/staff/dashboard");
        })
      }
     
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
              Authorization: "Bearer" + " " + token,
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
    { field: "Name", headerName: "Interview Process", width: 300 },
    { field: "process_type", headerName: "Process Type", width: 300 },
    { field: "general_process_status", headerName: "Interview Status", width: 300 },
    {
      field: "action",
      headerName: "Action",
      width: 300,

      renderCell: (params) => (
        <div
          className="process__actionnn"
          style={{ margin: "10px 0px", height: "30px" }}
        >
          <Link
            href={`/staff/processmanagement/edit/${params.row.slug}`}
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

  // const rows =  userData.map((item) => ({
  //   employer_id: item.employer_id,
  //   id: item.interview_process_id,
  //   Name: item.interview_process_name,
  //   status: item.status,
  //   slug: item.slug,
  // }));

 

  const rows =  userData.map(item => ({
    employer_id: item.employer_id,
    id: item.interview_process_id,
    Name: item.interview_process_name,
    process_type: item.employer_id === 0 ? "System Generated" : "Custom",
    status: item.status,
    slug: item.slug,
    general_process_status: item.general_process_status === "1" ? "General Interview Process" : "Job Interview Process"
  }));
  

  return (
    <>
      <StaffLayout>
      {loading && <div className="loader-container"></div>}
        <div className="adminChangeUsername" style={{ minHeight: '80vh' }}>
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
              <i className="fa-solid fa-clipboard-list"></i>
                <span>Interview Process</span>
              </div>
            </div>
          </div>
          <div className="changeProfilePicture backgroundColor">
            <div className="">
              <div className="profilelogo">
                <h2>Interview Process</h2>
              </div>
              <div className="add--processs">
                <div className="add__interview">
                  <Link
                    href="/staff/processmanagement/add"
                    className="btn btn-Process "
                  >
                    Add Process
                  </Link>
                </div>
              </div>

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
                  />
                </div>
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
