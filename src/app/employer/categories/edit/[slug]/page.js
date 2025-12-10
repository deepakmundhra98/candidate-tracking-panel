"use client";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import "../../../../common.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import AdminFooter from "../../../../admin/Components/AdminFooter/AdminFooter";
import Cookies from "js-cookie";
import EmployerLayout from "../../../EmployerLayout";

const Page = ({ params }) => {
  const token = Cookies.get("tokenEmployer");
  const router = useRouter();

  const [userData, setUserData] = useState({
    category_name: "",
  });

  const [errors, setErrors] = useState({
    category_name: "",
  });
  const [loading, setLoading] = useState(true);

  const slug = params.slug;

  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };

  const getData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + `/admin/category/edit/${slug}`,
        null, // Pass null as the request body if not required
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setLoading(false);
      if (response.data.status === 200) {
        setUserData(response.data.response);
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: "Close",
        }).then(() => {
          router.push("/employer/categories");
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
          title: "Update?",
          text: "Do you want to update Category Name?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseAPI + `/admin/category/edit/${slug}`,
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
              title: "Category name updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            }).then(() => {
              router.push("/employer/categories");
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
        text: "Could not update Category name",
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
          className=" backgroundColor adminChangeUsername editStaff"
          style={{ minHeight: "80vh" }}
        >
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
                <i class="fa-solid fa-sitemap"></i>
                <Link href="/employer/categories" className=" items-center">
                  <span>
                    Category List{" "}
                    <i class="fa-solid fa-angles-right text-xs"></i>
                  </span>
                </Link>{" "}
              </div>
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-edit"></i>
                <span>Edit Category</span>
              </div>
            </div>
          </div>

          <div className="">
            {/* <div className="profilelogo ">
              <h4 className="">Edit Category</h4>
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
                      className="form-control"
                      id="formGroupExampleInput2"
                      placeholder="Category Name"
                      value={userData.category_name}
                      name="category_name"
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
                <Link href="/employer/categories" className="btn button2">
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
