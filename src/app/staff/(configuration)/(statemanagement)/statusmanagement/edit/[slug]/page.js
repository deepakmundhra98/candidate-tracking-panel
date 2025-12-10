"use client";
import React from "react";
import { useState, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import "../../../../../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import axios from "axios";
// import BaseAPI from "../../../../../BaseAPI/BaseAPI";
import Swal from "sweetalert2";
import Image from "next/image";
import AdminFooter from "@/app/admin/Components/AdminFooter/AdminFooter";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import Cookies from "js-cookie";
import StaffLayout from "../../../../../StaffLayout";

const Page = ({ params }) => {
  const router = useRouter();
  const token = Cookies.get("tokenStaff");

  const [userData, setUserData] = useState({
    status_name: "",
  });

  const [errors, setErrors] = useState({
    status_name: "",
  });
  const [loading, setLoading] = useState(true);

  const slug = params.slug;



  const getData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + `/admin/interviewstatus/edit/${slug}`,
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
      console.log("Cannot get plans data at APmanageplans");
    }
  };
  useEffect(() => {
    getData();
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const handleClick = async () => {
    try {
      const newErrors = {};

      if (userData.status_name === "") {
        newErrors.status_name = "Status  is required";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Update?",
          text: "Do you want to update Interview Staus ?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseAPI + `/admin/interviewstatus/edit/${slug}`,
            userData,
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
              title: "Interview Staus updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });

            // window.scrollTo(0, 0);
            router.push("/staff/statusmanagement");
          } else if (response.data.status === 500) {
            Swal.fire({
              title: response.data.message,
              icon: "error",
              confirmButtonText: "Close",
            });
          } else {
            Swal.fire({
              title: response.data.message,
              icon: "error",
              confirmButtonText: "Close",
            });
          }
        }
      }
    } catch (error) {
      //   setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not update Interview Staus",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  return (
    <>
      <StaffLayout>
      {loading && <div className="loader-container"></div>}

        <div
          className="addInterviewProcessAdd adminChangeUsername"
          style={{ minHeight: "80vh" }}
        >
          <div className="addInterviewProcess">
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
                  <i class="fa-solid fa-user"></i>
                  <span>
                    <Link href="/staff/statusmanagement">Manage Status </Link>
                  </span>
                  <i class="fa-solid fa-angles-right text-xs"></i>
                </div>
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-pencil"></i>
                  <span>Update Interview Status </span>
                </div>
              </div>
            </div>
          </div>
          <div className="addInterviewProcessForm">
            <div className="row">
              <div className="col-md-2 leftSide">Update Interview Status:</div>
              <div className="col-md-10 rightSide">
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder="Enter Interview Status"
                  value={userData.status_name}
                  name="status_name"
                  onChange={handleChange}
                />
                {errors.status_name && (
                  <div className="text-danger">{errors.status_name}</div>
                )}
                <div className="bottomButtons">
                  <button className="btn button1" onClick={handleClick}>
                    Save
                  </button>
                  <Link href="/staff/statusmanagement" className="btn button2">
                    Cancel
                  </Link>
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
