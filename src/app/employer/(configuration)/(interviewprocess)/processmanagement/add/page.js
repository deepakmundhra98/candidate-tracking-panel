"use client";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import "../../../../../common.css";
import AdminFooter from "@/app/admin/Components/AdminFooter/AdminFooter";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import EmployerLayout from "../../../../EmployerLayout";
const Page = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const token = Cookies.get("tokenEmployer");

  const [userData, setUserData] = useState({
    process_name: "",
    process_type: "",
  });

  const [errors, setErrors] = useState({
    process_name: "",
    process_type: "",
  });

  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };

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

      if (userData.process_name === "") {
        newErrors.process_name = "Process is required";
      }

      if (userData.process_type === "") {
        newErrors.process_type = "Process Type is required";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Add?",
          text: "Do you want to add Interview Process?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseAPI + "/admin/interviewprocesses/add",
            userData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer" + " " + token,
              },
            }
          );
          setLoading(false);
          if (response.data.status === 200) {
            setUserData({
              ...userData,
              process_name: "",
              process_type: "",
            });
            Swal.fire({
              title: "Interview Process Added successfully!",
              icon: "success",
              confirmButtonText: "Close",
            }).then(() => {
              router.push("/employer/processmanagement");
            });
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
      setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not add Interview Process",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
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
              <Link
                href="/employer/processmanagement"
                className="flex gap-2 items-center  "
              >
                <i className="fa-solid fa-clipboard-list"></i>
                <span>
                  Interview Process{" "}
                  <i class="fa-solid fa-angles-right text-xs"></i>
                </span>
              </Link>
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-plus"></i>
                <span>Add Process</span>
              </div>
            </div>
          </div>

          <div className="interviewPreviewTable">
            <div className="row">
              <div className="col-md-2 leftSide">Interview Name:</div>
              <div className="col-md-10 rightSide">
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder="Interview Name"
                  value={userData.process_name}
                  name="process_name"
                  onChange={handleChange}
                />
                {errors.process_name && (
                  <div className="text-danger">{errors.process_name}</div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-2 leftSide">Process Type:</div>
              <div className="col-md-10 rightSide">
                <select
                  className="form-select shadow-none"
                  aria-label=""
                  name="process_type"
                  value={userData.process_type}
                  onChange={handleChange}
                >
                  <option value="" selected>
                    Select Process Type
                  </option>

                  <option value="0">Job Application Process</option>
                  <option value="1">General Application Process</option>
                </select>
                {errors.process_type && (
                  <div className="text-danger">{errors.process_type}</div>
                )}
              </div>
            </div>
            <div className="bottomButtons">
              <button className="btn button1" onClick={handleClick}>
                Save
              </button>
              <Link href="/employer/processmanagement" className="btn button2">
                Cancel
              </Link>
            </div>
          </div>
        </div>
        <AdminFooter />
      </EmployerLayout>
    </>
  );
};

export default Page;
