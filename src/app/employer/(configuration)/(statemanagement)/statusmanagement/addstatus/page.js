"use client";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import "../../../../../common.css";
import AdminFooter from "@/app/admin/Components/AdminFooter/AdminFooter";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import { useRouter } from "next/navigation";
import EmployerLayout from "../../../../EmployerLayout";
import Cookies from "js-cookie";

const Page = () => {
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = Cookies.get("tokenEmployer");

  const [userData, setUserData] = useState({
    status_name: "",
  });

  const [errors, setErrors] = useState({
    status_name: "",
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

      if (userData.status_name === "") {
        newErrors.status_name = "Interview Status is required";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Add?",
          text: "Do you want to add Interview Status?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseAPI + "/admin/interviewstatus/add",
            userData,
            {
              headers: {
                "Content-Type": "application/json",
                // key: ApiKey,
                // token: tokenKey,
                // adminid: adminID,
                Authorization: "Bearer" + " " + token,
              },
            }
          );
          setLoading(false);
          if (response.data.status === 200) {
            Swal.fire({
              title: "Interview Status Added successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            setUserData({
              ...userData,
              status_name: "",
            });
            window.scrollTo(0, 0);
            router.push("/employer/statusmanagement");
          } else if (response.data.status === 500) {
            Swal.fire({
              title: "The Status Name has already been taken.",
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
        text: "Could not add Interview Status",
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
                href="/employer/statusmanagement"
                className="flex gap-2 items-center  "
              >
                <i class="fa-solid fa-user"></i>
                <span>
                  {" "}
                  Manage Status <i class="fa-solid fa-angles-right text-xs"></i>
                </span>
              </Link>
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-plus"></i>
                <span>Add Interview Status</span>
              </div>
            </div>
          </div>

          <div
            className="addInterviewProcessForm"
            style={{ minHeight: "60vh" }}
          >
            <div className="row">
              <div className="col-md-2 leftSide">Add Interview Status:</div>
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
                  {/* <button className="btn button2" onClick={() => navigate(-1)}>
                    Cancel
                  </button> */}
                  <Link
                    href="/employer/statusmanagement"
                    className="btn button2"
                  >
                    Cancel
                  </Link>
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
