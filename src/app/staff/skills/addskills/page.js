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

  const [userData, setUserData] = useState({
    skill_name: "",
    user_type: "staff",
  });

  const [errors, setErrors] = useState({
    skill_name: "",
  });
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("tokenStaff");

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

  const getData = async () => {
    try {
      const response = await axios.get(BaseAPI + `/admin/skills/add`, {
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
  const handleClick = async () => {
    try {
      const newErrors = {};

      if (userData.skill_name === "") {
        newErrors.skill_name = "Skill name is required";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Add?",
          text: "Do you want to add Skill Name?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseAPI + "/admin/skills/add",
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
              skill_name: "",
            });
            Swal.fire({
              title: "Skill added successfully!",
              icon: "success",
              confirmButtonText: "Close",
            }).then(() => {
              router.push("/staff/skills");
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
        text: "Could not add skill name",
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
                  <i class="fa-solid fa-atom"></i>{" "}
                  <Link href="/staff/skills">
                    <span>
                      {" "}
                      Skill List{" "}
                      <i class="fa-solid fa-angles-right text-xs"></i>
                    </span>
                  </Link>{" "}
                </div>
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-plus"></i>

                  <span> Add Skill </span>
                </div>
              </div>
            </div>
          </div>
          <div className="addInterviewProcessForm">
            <div className="row">
              <div className="col-md-2 leftSide">Skill Name:</div>
              <div className="col-md-10 rightSide">
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder="Skill Name"
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

                  <Link href="/staff/skills" className="btn button2">
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
