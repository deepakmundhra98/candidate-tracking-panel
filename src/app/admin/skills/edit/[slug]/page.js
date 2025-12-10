"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import axios from "axios";
import BaseAPI from "../../../../BaseAPI/BaseAPI";
import "../../../../common.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";
import AdminLayout from "../../../AdminLayout";
import "@fortawesome/fontawesome-free/css/all.css";
import AdminFooter from "../../../Components/AdminFooter/AdminFooter";

const Page = ({ params }) => {
  const router = useRouter();
  const token = Cookies.get("token");

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

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/skills/edit/${slug}`,
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
        setUserData(response.data.response);
        //   console.log(paymentHistory);
      } catch (error) {
        setLoading(false);
        console.log("Cannot get plans data at APmanageplans");
      }
    };
    getData();
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, []);
  // console.log("UserData:", userData);

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

      if (userData.skill_name === "") {
        newErrors.skill_name = "skills name is required";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Update?",
          text: "Do you want to update Skill Name?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseAPI + `/admin/skills/edit/${slug}`,
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
          // console.log("Response data:", response.data);
          if (response.data.status === 200) {
            Swal.fire({
              title: "skill name updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });

            // window.scrollTo(0, 0);
            router.push("/admin/skills");
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
        text: "Could not update skill name",
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
          className="addInterviewProcessAdd adminChangeUsername "
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
                  <i class="fa-solid fa-atom"></i>

                  <span>
                    {" "}
                    <Link href="/admin/skills"> Skills List </Link>{" "}
                  </span>
                  <i class="fa-solid fa-angles-right text-xs"></i>
                </div>
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-plus"></i>

                  <span> Update Skills List </span>
                </div>
              </div>
            </div>
          </div>
          <div className="addInterviewProcessForm">
            <div className="row">
              <div className="col-md-2 leftSide">Update Skill Name:</div>
              <div className="col-md-10 rightSide">
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder="Interview Skill Name"
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
                  <Link href="/admin/skills" className="btn button2">
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
