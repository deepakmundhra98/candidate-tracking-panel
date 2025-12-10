"use client";
import React from "react";
import { useState } from "react";
// import Sidebar from "../../component/sidebar/page";
import Link from "next/link";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "../../../common.css";
import Swal from "sweetalert2";
import AdminFooter from "../../Components/AdminFooter/AdminFooter";
import AdminLayout from "../../AdminLayout";

const Page = () => {
  // const navigate = useNavigate();

  const [userData, setUserData] = useState({
    generalSetting: "1",
  });
  const [loading, setLoading] = useState(false);

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
  };
  const handleClick = async () => {
    try {
      if (userData.generalSetting != 1 || userData.generalSetting === null) {
        Swal.fire({
          title: "Please select!",
          icon: "warning",
          confirmButtonText: "Close",
        });
      } else {
        const confirmationResult = await Swal.fire({
          title: "Update?",
          text: "Do you want to update General Settings?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        // if (confirmationResult.isConfirmed) {
        //   setLoading(true);
        //   const response = await axios.post(
        //     BaseApi + "/admin/changePassword",
        //     userData,
        //     {
        //       headers: {
        //         "Content-Type": "application/json",
        //         // key: ApiKey,
        //         // token: tokenKey,
        //         // adminid: adminID,
        //       },
        //     }
        //   );
        //   setLoading(false);
        //   if (response.data.status === 200) {
        //     Swal.fire({
        //       title: "Password updated successfully!",
        //       icon: "success",
        //       confirmButtonText: "Close",
        //     });

        //     window.scrollTo(0, 0);
        //   } else if (response.data.status === 500) {
        //     Swal.fire({
        //       title: response.data.message,
        //       icon: "error",
        //       confirmButtonText: "Close",
        //     });
        //   } else {
        //     Swal.fire({
        //       title: response.data.message,
        //       icon: "error",
        //       confirmButtonText: "Close",
        //     });
        //   }
        // }
      }
    } catch (error) {
      //   setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not update General Settings",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };
  return (
    <>
      <AdminLayout>
        {loading && <div className="loader-container"></div>}
        <div className="adminChangeUsername" style={{ minHeight: '80vh' }}>
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
                <i class="fa-solid fa-lock"></i>
                <span>General Setting</span>
              </div>
            </div>
          </div>
          <div
            className="generalSettings backgroundColor"
            style={{ minHeight: "60vh" }}
          >
            <div className="profilelogo">
              <h2>General Settings</h2>
            </div>
            <div className="profilelogochange">
              <input
                type="checkbox"
                className="mr-2"
                name="generalSetting"
                value={userData.generalSetting}
                checked={userData.generalSetting === 1}
                onChange={handleChange}
              />
              <label for="" className="settingCheck">
                {" "}
                Allow Categories?{" "}
              </label>
              <div className="bottomButtons">
                <button className="btn button1" onClick={handleClick}>
                  Save
                </button>
                <Link href="/admin/dashboard" className="btn button2">
                  Cancel
                </Link>
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
