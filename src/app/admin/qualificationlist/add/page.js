"use client";
import React from "react";
import Link from "next/link";
import { useState } from "react";
import "../../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import AdminFooter from "../../Components/AdminFooter/AdminFooter";
import axios from "axios";
import BaseAPI from "../../../BaseAPI/BaseAPI";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import Swal from "sweetalert2";
import AdminLayout from "../../AdminLayout";

const Page = () => {
  // const navigate = useNavigate();
  const router = useRouter();
  const token = Cookies.get("token");

  const [userData, setUserData] = useState({
    qualification_name: "",
  });

  const [errors, setErrors] = useState({
    qualification_name: "",
  });

  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const [loading, setLoading] = useState(false);

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

      if (userData.qualification_name === "") {
        newErrors.qualification_name = "Qualification name is required";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Add?",
          text: "Do you want to add Qualification Name?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseAPI + "/admin/qualifications/add",
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
              title: "Qualification added  successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            setUserData({
              ...userData,
              qualification_name: "",
            });
            window.scrollTo(0, 0);
            router.push("/admin/qualificationlist");
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
        text: "Could not add qualification name",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  return (
    <>
      <AdminLayout>
        {loading && <div className="loader-container"></div>}

        <div
          className="addInterviewProcessAdd adminChangeUsername"
          style={{ minHeight: "80vh" }}
        >
          <div className="addInterviewProcess">
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
                  <span>
                    <Link href="/admin/qualificationlist">
                      {" "}
                      Qualification List{" "}
                    </Link>
                  </span>
                  <i class="fa-solid fa-angles-right text-xs"></i>
                </div>
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-plus"></i>
                  <span>Add Qualification List</span>
                </div>
              </div>
            </div>
          </div>
          <div className="addInterviewProcessForm">
            <div className="row">
              <div className="col-md-2 leftSide">Add Qualification Name:</div>
              <div className="col-md-10 rightSide">
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder="Qualification Name"
                  value={userData.qualification_name}
                  name="qualification_name"
                  onChange={handleChange}
                />
                {errors.qualification_name && (
                  <div className="text-danger">{errors.qualification_name}</div>
                )}
                <div className="bottomButtons">
                  <button className="btn button1" onClick={handleClick}>
                    Save
                  </button>
                  <Link href="/admin/qualificationlist" className="btn button2">
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
