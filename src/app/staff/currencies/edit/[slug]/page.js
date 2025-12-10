"use client";
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../../../../common.css";
import "../../../../employer/employer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import axios from "axios";
import BaseAPI from "../../../../BaseAPI/BaseAPI";
import Swal from "sweetalert2";
import AdminFooter from "@/app/admin/Components/AdminFooter/AdminFooter";
import Cookies from "js-cookie";
import StaffLayout from "../../../StaffLayout";

const Page = ({ params }) => {
  const router = useRouter();
  const token = Cookies.get("tokenStaff");

  const [userData, setUserData] = useState({
    name: "",
    code: "",
    symbol: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    code: "",
    symbol: "",
  });
  const [loading, setLoading] = useState(true);

  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };

  const getData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + `/admin/currencies/currencyedit/${params.slug}`,
        null, // Pass null as the request body if not required
        {
          headers: {
            "Content-Type": "application/json",

            Authorization: "Bearer" + " " + token,

            // adminid: adminID,
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
          confirmButtonText: "Close",
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

      if (userData.name === "") {
        newErrors.name = "Currency name is required";
      }
      if (userData.code === "") {
        newErrors.code = "Currency code is required";
      }
      if (userData.symbol === "") {
        newErrors.symbol = "Currency symbol is required";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Update?",
          text: "Do you want to update this currency name?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseAPI + `/admin/currencies/currencyedit/${params.slug}`,
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
              title: "Currency name update successfully!",
              icon: "success",
              confirmButtonText: "Close",
            }).then(() => {
              router.push("/staff/currencies");
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
        text: "Could not update currency name",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <StaffLayout>
        {loading && <div className="loader-container"></div>}
        <div
          className="addInterviewProcessAdd adminChangeUsername currencyPage"
          style={{ minHeight: "80vh" }}
        >
          <div className="addInterviewProcess">
            <div className="breadCumb1" role="">
              <div className="flex gap-3 items-center flex-wrap">
                <Link underline="hover" color="inherit" href="/staff/dashboard">
                  <div className="flex gap-2 items-center ">
                    <i className="fa-solid fa-gauge "></i>
                    <span>
                      Dashboard <i class="fa-solid fa-angles-right text-xs"></i>
                    </span>
                  </div>
                </Link>
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-coins"></i>

                  <Link href="/staff/currencies">
                    <span>
                      {" "}
                      Currency List{" "}
                      <i class="fa-solid fa-angles-right text-xs"></i>
                    </span>
                  </Link>
                </div>
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-edit"></i>
                  <span>Edit Currency </span>
                </div>
              </div>
            </div>
          </div>
          <div className="addInterviewProcessForm">
            <div className="currencyDetails">
              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  Currency Name <span>*</span>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Currency Name"
                    value={userData.name}
                    name="name"
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className="text-danger">{errors.name}</div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  Currency Code <span>*</span>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Currency Code"
                    value={userData.code}
                    name="code"
                    onChange={handleChange}
                  />
                  {errors.code && (
                    <div className="text-danger">{errors.code}</div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  Currency Symbol <span>*</span>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Currency Symbol"
                    value={userData.symbol}
                    name="symbol"
                    onChange={handleChange}
                  />
                  {errors.symbol && (
                    <div className="text-danger">{errors.symbol}</div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt"></div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <div className="buttomButtons">
                    <button className="themeButton1" onClick={handleClick}>
                      Save
                    </button>
                    <Link href="/staff/currencies" className="themeButton2">
                      Cancel
                    </Link>
                  </div>
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
