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
import AdminLayout from "../../../../AdminLayout";
const Page = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const token = Cookies.get("token");

  const [userData, setUserData] = useState({
    process_name: "",
  });

  const [errors, setErrors] = useState({
    process_name: "",
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
                // key: ApiKey,
                Authorization: "Bearer" + " " + token,

                // adminid: adminID,
              },
            }
          );
          setLoading(false);
          if (response.data.status === 200) {
            Swal.fire({
              title: "Interview Process Added successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            setUserData({
              ...userData,
              process_name: "",
            });
            window.scrollTo(0, 0);
            router.push("/admin/processmanagement");
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
      <AdminLayout>
      {loading && <div className="loader-container"></div>}

        <div className="adminChangeUsername" style={{ minHeight: '80vh' }}>
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
              <Link
                href="/admin/processmanagement"
                className="flex gap-2 items-center  "
              >
                <i class="fa-solid fa-user"></i>
                <span>Interview Process</span>
              </Link>
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-plus"></i>
                <span>Add Process</span>
              </div>
            </div>
          </div>

          <div
            className="addInterviewProcessForm"
            style={{ minHeight: "60vh" }}
          >
            <div className="row">
              <div className="col-md-2 leftSide">Add Interview:</div>
              <div className="col-md-10 rightSide">
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder="Interview  "
                  value={userData.process_name}
                  name="process_name"
                  onChange={handleChange}
                />
                {errors.process_name && (
                  <div className="text-danger">{errors.process_name}</div>
                )}
                <div className="bottomButtons">
                  <button className="btn button1" onClick={handleClick}>
                    Save
                  </button>
                  <Link href="/admin/processmanagement" className="btn button2">
                    Cancel
                  </Link>
                </div>
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
