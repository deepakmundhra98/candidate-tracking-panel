"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import "../../../common.css";
import "@fortawesome/fontawesome-free/css/all.css";
import Swal from "sweetalert2";
import AdminFooter from "../../Components/AdminFooter/AdminFooter";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import Cookies from "js-cookie";
import AdminLayout from "../../AdminLayout";
import { useRouter } from "next/navigation";

const Page = () => {
  const token = Cookies.get("token");
  const router = useRouter();

  const [userData, setUserData] = useState({
    category_name: "",
  });

  const [errors, setErrors] = useState({
    category_name: "",
  });
  const [loading, setLoading] = useState(false);

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
          // setLoading(true);
          const response = await axios.post(
            BaseAPI + "/admin/category/add",
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
              title: "Category updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            setUserData({
              ...userData,
              category_name: "",
            });
            window.scrollTo(0, 0);
            router.push("/admin/categories");
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
        text: "Could not add category name",
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
          className=" backgroundColor adminChangeUsername"
          style={{ minHeight: "80vh" }}
        >
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
                <i class="fa-solid fa-sitemap"></i>
                <span>
                  <Link href="/admin/categories">Category List </Link>{" "}
                  <i class="fa-solid fa-angles-right text-xs"></i>
                </span>
              </div>
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-plus"></i>
                <span>Add Category List</span>
              </div>
            </div>
          </div>
          <div className="">
            <div className="profilelogo ">
              <h4 className="">Add Category</h4>
            </div>

            <div className="serachKeyItems bg-white">
              <form action="">
                <p>Category Details :</p>
                <div className="row">
                  <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                    Name <span>*</span>
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
            </div>
            <div className="buttonBottom">
              <button
                className="btn btn-success btn-Successs"
                onClick={handleClick}
              >
                Save
              </button>
              <Link
                href="/admin/categories"
                className="btn btn-danger btn-Activateee"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
        <AdminFooter />
      </AdminLayout>
    </>
  );
};

export default Page;
