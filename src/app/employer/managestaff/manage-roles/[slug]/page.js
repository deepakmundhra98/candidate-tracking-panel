"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import Swal from "sweetalert2";
import axios from "axios";
import "../../../../common.css";
import AdminFooter from "../../../../admin/Components/AdminFooter/AdminFooter";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import EmployerLayout from "../../../EmployerLayout";

const Page = ({ params }) => {
  const router = useRouter();
  const token = Cookies.get("tokenEmployer");

  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };

  const [userData, setUserData] = useState([]);
  const [pageData, setPageData] = useState([]);

  const [loading, setLoading] = useState(true);
  const tokenKey = Cookies.get("tokenEmployer");

  const slug = params.slug;

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + `/admin/user/staff/assign_roles/${slug}`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + tokenKey,
          },
        }
      );
      setLoading(false);
      setPageData(response.data.response);
      setUserData(response.data.response.accesscontrol);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get profile photo data");
    }
  };

  useEffect(() => {
    getData();
    window.scrollTo(0, 0);
  }, []);

  const update = (event, i) => {
    if (event.target.checked) {
      setUserData((prevListData) =>
        prevListData.map((item) =>
          item.name === i.name
            ? {
                ...item,
                ...Object.keys(item).reduce((acc, key) => {
                  if (key !== "name") acc[key] = 1;
                  return acc;
                }, {}),
              }
            : item
        )
      );
    } else {
      setUserData((prevListData) =>
        prevListData.map((item) =>
          item.name === i.name
            ? {
                ...item,
                ...Object.keys(item).reduce((acc, key) => {
                  if (key !== "name") acc[key] = 0;
                  return acc;
                }, {}),
              }
            : item
        )
      );
    }
  };

  const handlePermissionChange = (i, key) => {
    setUserData((prevListData) =>
      prevListData.map((item) =>
        item.name === i.name
          ? { ...item, [key]: item[key] === 1 ? 0 : 1 }
          : item
      )
    );
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    const formdata = { access: userData };
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + `/admin/user/staff/assign_roles/${slug}`,
        formdata,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + tokenKey,
          },
        }
      );
      setLoading(false);

      if (response.status === 200) {
        Swal.fire({
          title: "Roles updated successfully",
          icon: "success",
          confirmButtonText: "Close",
        }).then(() => {
          router.push("/employer/managestaff");
        });
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      Swal.fire({
        title: "An error occurred",
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
              <div className="flex gap-3 flex-wrap items-center">
                <Link
                  underline="hover"
                  color="inherit"
                  href="/employer/dashboard"
                >
                  <div className="flex gap-2 items-center">
                    <i className="fa-solid fa-gauge "></i>
                    <span>
                      Dashboard{" "}
                      <i className="fa-solid fa-angles-right text-xs"></i>
                    </span>
                  </div>
                </Link>
                <div className="flex gap-2 items-center  ">
                  <i className="fa-solid fa-briefcase"></i>{" "}
                  <Link href="/employer/managestaff">
                    <span>
                      {" "}
                      Manage Staff{" "}
                      <i className="fa-solid fa-angles-right text-xs"></i>
                    </span>
                  </Link>{" "}
                </div>
                <div className="flex gap-2 items-center  ">
                  <i className="fa-solid fa-user"></i>
                  <span>
                    {" "}
                    {pageData?.staff_name?.full_name}{" "}
                    <i className="fa-solid fa-angles-right text-xs"></i>
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <i className="fa-solid fa-plus"></i>
                  <span>Manage Roles </span>
                </div>
              </div>
            </div>
          </div>
          <div className="addInterviewProcessForm">
            <div className="row">
              <div className="row manageRoleBody">
                {userData.map((i, index) => (
                  <div key={index} className="col-md-6 mb-4">
                    <div
                      className="card"
                      style={{
                        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                        border: "none",
                        // marginBottom: "20px",
                      }}
                    >
                      <div className="card-body">
                        <div className="MainTitleChack">
                          <input
                            type="checkbox"
                            className="form-check-input !border-gray-700"
                            name={`checkbox[${index}][Module]`}
                            id={`checkbox-${index}`}
                            checked={i.Module === 1}
                            onChange={(event) => update(event, i)}
                          />
                          <label
                            htmlFor={`checkbox-${index}`}
                            className="fw-bold ml-2"
                          >
                            {i.name}
                          </label>
                        </div>

                        <div className="SubCheckBx">
                          {Object.keys(i)
                            .filter((key) => key !== "name" && key !== "Module")
                            .map((key) => (
                              <div key={key} className="SubtitleBx">
                                <input
                                  type="checkbox"
                                  className="form-check-input !border-gray-500"
                                  name={`checkbox[${index}][${key}]`}
                                  id={`inner-${key}-${index}`}
                                  checked={i[key] === 1}
                                  onChange={() =>
                                    handlePermissionChange(i, key)
                                  }
                                />
                                <label
                                  htmlFor={`inner-${key}-${index}`}
                                  className="ml-2"
                                >
                                  {key.replace(/_/g, ' ')}
                                </label>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bottomButtons">
                <button className="btn button1" onClick={handelSubmit}>
                  Save
                </button>
                <Link href="/employer/managestaff" className="btn button2">
                  Cancel
                </Link>
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
