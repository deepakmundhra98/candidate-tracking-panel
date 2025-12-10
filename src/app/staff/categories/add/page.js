"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import "../../../common.css";
import "@fortawesome/fontawesome-free/css/all.css";
import Swal from "sweetalert2";
import AdminFooter from "../../../admin/Components/AdminFooter/AdminFooter";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import Cookies from "js-cookie";
import StaffLayout from "../../StaffLayout";
import { useRouter } from "next/navigation";

const Page = () => {
  const token = Cookies.get("tokenStaff");
  const router = useRouter();

  const [userData, setUserData] = useState({
    category_name: "",
    user_type: "staff",
  });

  const [errors, setErrors] = useState({
    category_name: "",
  });
  const [loading, setLoading] = useState(true);

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
      const response = await axios.get(BaseAPI + `/admin/category/add`, {
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

      if (userData.category_name === "") {
        newErrors.category_name = "Category name is required";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Add?",
          text: "Do you want to Add Category Name?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseAPI + "/admin/category/add",
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
              category_name: "",
            });
            Swal.fire({
              title: "Category Name added successfully!",
              icon: "success",
              confirmButtonText: "Close",
            }).then(() => {
              router.push("/staff/categories");
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
        text: "Could not add category name",
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
          className=" backgroundColor adminChangeUsername editStaff"
          style={{ minHeight: "80vh" }}
        >
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
                <i class="fa-solid fa-sitemap"></i>
                <Link href="/staff/categories">
                  <span>
                    Category List{" "}
                    <i class="fa-solid fa-angles-right text-xs"></i>
                  </span>
                </Link>{" "}
              </div>
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-plus"></i>
                <span>Add Category</span>
              </div>
            </div>
          </div>
          <div className="">
            {/* <div className="profilelogo ">
              <h4 className="">Add Category</h4>
            </div> */}

            <div className="serachKeyItems bg-white">
              <form action="">
                {/* <p>Category Details :</p> */}
                <div className="row">
                  <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                    Category Name <span>*</span>
                  </div>
                  <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                    <input
                      type="text"
                      className="form-control "
                      name="category_name"
                      value={userData.category_name}
                      onChange={handleChange}
                    />
                    {errors.category_name && (
                      <div className="text-danger">{errors.category_name}</div>
                    )}
                  </div>
                </div>
              </form>
              <div className="buttonBottom">
                <button className="btn button1" onClick={handleClick}>
                  Save
                </button>
                <Link href="/staff/categories" className="btn button2">
                  Cancel
                </Link>
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
