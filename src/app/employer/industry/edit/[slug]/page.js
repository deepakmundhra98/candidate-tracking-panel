"use client";
import React from "react";
import { useState } from "react";

import Link from "next/link";

import Swal from "sweetalert2";

import { useEffect } from "react";
import "../../../../common.css";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import Dropdown from "react-bootstrap/Dropdown";
import AdminFooter from "../../../../admin/Components/AdminFooter/AdminFooter";
import { useRouter } from "next/navigation";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import Cookies from "js-cookie";
import EmployerLayout from "../../../EmployerLayout";

const Page = ({ params }) => {
  // const navigate = useNavigate();
  const router = useRouter();
  const token = Cookies.get("tokenEmployer");

  const [userData, setUserData] = useState({
    industry_name: "",
    user_type: "employer"
  });

  const [errors, setErrors] = useState({
    industry_name: "",
  });

  const [loading, setLoading] = useState(false);

  const slug = params.slug;

  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + `/admin/industry/edit/${slug}`,
        null, // Pass null as the request body if not required
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
          icon: "error",
          confirmButtonText: "Close",
        }).then(() => {
          router.push("/employer/industry");
        });
      }
    } catch (error) {
      setLoading(false);
      console.log("Cannot get plans data at APmanageplans");
    }
  };
  useEffect(() => {
    getData();
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // console.log("UserData after change:", userData);
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const handleClick = async () => {
    try {
      const newErrors = {};

      if (userData.industry_name === "") {
        newErrors.industry_name = "Industry name is required";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Update?",
          text: "Do you want to update Industry Name?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseAPI + `/admin/industry/edit/${slug}`,
            userData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer" + " " + token,
              },
            }
          );
          setLoading(false);
          // console.log("Response data:", response.data);
          if (response.data.status === 200) {
            Swal.fire({
              title: "Industry name updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            }).then(() => {
              router.push("/employer/industry");
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
        text: "Could not update Industry name",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };
  return (
    <>
      <EmployerLayout>
        {loading && <div className="loader-container"></div>}
        <div
          className="addInterviewProcessAdd adminChangeUsername"
          style={{ minHeight: "80vh" }}
        >
          <div className="addInterviewProcess">
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
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-industry"></i>
                  <Link href="/employer/industry">
                    {" "}
                    <span>
                      Industry List{" "}
                      <i class="fa-solid fa-angles-right text-xs"></i>
                    </span>
                  </Link>{" "}
                </div>
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-edit"></i>
                  <span>Edit Industry List</span>
                </div>
              </div>
            </div>
          </div>
          <div className="addInterviewProcessForm">
            <div className="row">
              <div className="col-md-2 leftSide">Industry Name:</div>
              <div className="col-md-10 rightSide">
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder="Industry Name"
                  value={userData.industry_name}
                  name="industry_name"
                  onChange={handleChange}
                />
                {errors.industry_name && (
                  <div className="text-danger">{errors.industry_name}</div>
                )}
                <div className="bottomButtons">
                  <button className="btn button1" onClick={handleClick}>
                    Save
                  </button>
                  <Link href="/employer/industry" className="btn button2">
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
