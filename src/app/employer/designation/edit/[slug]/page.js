"use client";
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../../../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import axios from "axios";
import BaseAPI from "../../../../BaseAPI/BaseAPI";
import Swal from "sweetalert2";
import AdminFooter from "@/app/admin/Components/AdminFooter/AdminFooter";
import Cookies from "js-cookie";
import EmployerLayout from "../../../EmployerLayout";

const Page = ({ params }) => {
  const router = useRouter();
  const token = Cookies.get("tokenEmployer");

  const [userData, setUserData] = useState({
    skill_name: "",
  });

  const [errors, setErrors] = useState({
    skill_name: "",
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
        BaseAPI + `/admin/designations/edit/${slug}`,
        null, // Pass null as the request body if not required
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setLoading(false);
      if(response.data.response === 200) {
        setUserData(response.data.response);

      } else{
        Swal.fire({
          icon: "warning",
          title: "Cannot get designation data",
          confirmButtonText: "Close",
        });
      }
      console.log(paymentHistory);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get plans data at APmanageplans");
    }
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

      if (userData.skill_name === "") {
        newErrors.skill_name = "Designation is required";
      }

      setErrors(newErrors);
      // console.log(vedanta)

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Update?",
          text: "Do you want to update Designation?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseAPI + `/admin/designations/edit/${slug}`,
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
          // setLoading(false);
          if (response.data.status === 200) {
            Swal.fire({
              title: "Designation name updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });

            window.scrollTo(0, 0);
            router.push("/employer/designation");
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
        text: "Could not update designation name",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  useEffect(() => {
    getData();
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <EmployerLayout>
        {loading && <div className="loader-container"></div>}
        <div
          className="addInterviewProcessAdd adminChangeUsername "
          style={{ minHeight: "80vh" }}
        >
          <div className="addInterviewProcess">
            <div className="breadCumb1" role="">
              <div className="flex gap-3 items-center flex-wrap">
                <Link
                  underline="hover"
                  color="inherit"
                  href="/employer/dashboard"
                >
                  <div className="flex gap-2 items-center ">
                    <i className="fa-solid fa-gauge "></i>
                    <span>
                      Dashboard <i class="fa-solid fa-angles-right text-xs"></i>
                    </span>
                  </div>
                </Link>
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-briefcase"></i>

                  <Link href="/employer/designation">
                    <span>
                      {" "}
                      Designation{" "}
                      <i class="fa-solid fa-angles-right text-xs"></i>
                    </span>
                  </Link>
                </div>
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-edit"></i>
                  <span>Edit Designation </span>
                </div>
              </div>
            </div>
          </div>
          <div className="addInterviewProcessForm">
            <div className="row">
              <div className="col-md-2 leftSide">Designation Name<span className="text-danger">*</span></div>
              <div className="col-md-10 rightSide">
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder="Designation"
                  value={userData.skill_name}
                  name="skill_name"
                  onChange={handleChange}
                />
                {errors.skill_name && (
                  <div className="text-danger">{errors.skill_name}</div>
                )}
                <div className="bottomButtons">
                  <button className="btn button1" onClick={handleClick}>
                    Save
                  </button>
                  <Link href="/employer/designation" className="btn button2">
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
