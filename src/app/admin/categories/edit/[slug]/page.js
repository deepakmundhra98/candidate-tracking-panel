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
import AdminFooter from "../../../Components/AdminFooter/AdminFooter";
import Cookies from "js-cookie";
import AdminLayout from "../../../AdminLayout";

const Page = ({ params }) => {
  const token = Cookies.get("token");
  const router = useRouter();

  const [userData, setUserData] = useState({
    category_name: "",
  });

  const [errors, setErrors] = useState({
    category_name: "",
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
        BaseAPI + `/admin/category/edit/${slug}`,
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
                // key: ApiKey,
                Authorization: "Bearer" + " " + token,

                // adminid: adminID,
              },
            }
          );
          setLoading(false);
          if (response.data.status === 200) {
            Swal.fire({
              title: "Category name updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });

            // window.scrollTo(0, 0);
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
        text: "Could not update Category name",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  return (
    <>
      <AdminLayout>
      {loading && (
        <div className="loader-container">
          
        </div>
      )}
        <div
          className=" backgroundColor adminChangeUsername "
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
                  <Link href="/admin/categories" className=" items-center">
                    Category List{" "}
                  </Link>{" "}
                  <i class="fa-solid fa-angles-right text-xs"></i>
                </span>
              </div>
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-plus"></i>
                <span>Edit Category List</span>
              </div>
            </div>
          </div>

          <div className="">
            <div className="profilelogo ">
              {/* <h2 className='text-zinc-400 text-xl ml-4'>Edit Category</h2> */}
              <h4 className="">Edit Category</h4>
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
                      className="form-control"
                      id="formGroupExampleInput2"
                      placeholder="Qualification Name"
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
