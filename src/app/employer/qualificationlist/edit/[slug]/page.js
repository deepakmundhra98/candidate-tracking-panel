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
  const tokenEmployer = Cookies.get("tokenEmployer");

  const [userData, setUserData] = useState({
    qualification_name: "",
  });

  const [errors, setErrors] = useState({
    qualification_name: "",
  });
  const [loading, setLoading] = useState(false);

  const slug = params.slug;

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + `/admin/qualifications/edit/${slug}`,
        null, // Pass null as the request body if not required
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + tokenEmployer,
          },
        }
      );
      setLoading(false);
      if (response.data.status === 200) {
        setUserData(response.data.response);
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/employer/qualificationlist");
        });
      }

      //   console.log(paymentHistory);
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

      if (userData.qualification_name === "") {
        newErrors.qualification_name = "Qualification name is required";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Update?",
          text: "Do you want to update Qualification Name?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseAPI + `/admin/qualifications/edit/${slug}`,
            userData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer" + " " + tokenEmployer,
              },
            }
          );
          setLoading(false);
          if (response.data.status === 200) {
            Swal.fire({
              title: "Qualification name updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            }).then(() => {
              router.push("/employer/qualificationlist");
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
        text: "Could not update qualification name",
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
                <Link underline="hover" color="inherit" href="/employer/dashboard">
                  <div className="flex gap-2 items-center">
                    <i className="fa-solid fa-gauge "></i>
                    <span>
                      Dashboard <i class="fa-solid fa-angles-right text-xs"></i>
                    </span>
                  </div>
                </Link>
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-graduation-cap"></i>

                  <Link href="/employer/qualificationlist">
                    <span>
                      {" "}
                      Qualification List{" "}
                      <i class="fa-solid fa-angles-right text-xs"></i>
                    </span>
                  </Link>
                </div>
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-edit"></i>
                  <span>Edit Qualification</span>
                </div>
              </div>
            </div>
          </div>
          <div className="addInterviewProcessForm">
            <div className="row">
              <div className="col-md-2 leftSide">
                Qualification Name:
              </div>
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
                  <Link
                    href="/employer/qualificationlist"
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
