"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import Swal from "sweetalert2";
import axios from "axios";
import "../../../common.css";
import AdminFooter from "../../../admin/Components/AdminFooter/AdminFooter";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import StaffLayout from "../../StaffLayout";

const Page = () => {
  const router = useRouter();
  const token = Cookies.get("tokenStaff");

  const [userData, setUserData] = useState({
    designation_name: "",
    user_type: "staff",

  });

  const [errors, setErrors] = useState({
    designation_name: "",
  });
  const [loading, setLoading] = useState(true);

  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };

  const getData = async () => {
    try {
      const response = await axios.get(BaseAPI + `/admin/designations/add`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + " " + token,
        },
      });
      setLoading(false);
      if (response.data.status === 500) {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/staff/dashboard");
        });
      }
    } catch (error) {
      setLoading(false);
      console.log("Cannot get plans data at APmanageplans");
    }
  };

  useEffect(() => {
    getData();
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

      if (userData.designation_name === "") {
        newErrors.designation_name = "Designation  is required";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Add?",
          text: "Do you want to add Designation?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseAPI + "/admin/designations/add",
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
            Swal.fire({
              title: "Designation added successfully!",
              icon: "success",
              confirmButtonText: "Close",
            }).then(() => {
              router.push("/staff/designation");
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
        text: "Could not add designation name",
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
              <div className="flex gap-3 flex-wrap items-center">
                <Link
                  underline="hover"
                  color="inherit"
                  href="/staff/dashboard"
                >
                  <div className="flex gap-2 items-center">
                    <i className="fa-solid fa-gauge "></i>
                    <span>
                      Dashboard <i class="fa-solid fa-angles-right text-xs"></i>
                    </span>
                  </div>
                </Link>
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-briefcase"></i>{" "}
                  <Link href="/staff/designation">
                    <span>
                      {" "}
                      Designation List{" "}
                      <i class="fa-solid fa-angles-right text-xs"></i>
                    </span>
                  </Link>{" "}
                </div>
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-plus"></i>

                  <span> Add Designation </span>
                </div>
              </div>
            </div>
          </div>
          <div className="addInterviewProcessForm">
            <div className="row">
              <div className="col-md-2 leftSide">
                Designation Name<span className="text-danger">*</span>
              </div>
              <div className="col-md-10 rightSide">
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder=" "
                  value={userData.designation_name}
                  name="designation_name"
                  onChange={handleChange}
                />
                {errors.designation_name && (
                  <div className="text-danger">{errors.designation_name}</div>
                )}
                <div className="bottomButtons">
                  <button className="btn button1" onClick={handleClick}>
                    Save
                  </button>
                  {/* <button className="btn button2" onClick={() => navigate(-1)}>
                    Cancel
                  </button> */}
                  <Link href="/staff/designation" className="btn button2">
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
