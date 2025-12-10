"use client";
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "../../../common.css";
import Swal from "sweetalert2";
import AdminFooter from "../../../admin/Components/AdminFooter/AdminFooter";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import Cookies from "js-cookie";
import StaffLayout from "../../StaffLayout";
import NextImage from "next/image";

const Page = () => {
  const [userData, setUserData] = useState({
    logo: "",
  });
  const [logoData, setLogoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };
  const token = Cookies.get("tokenStaff");

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + "/admin/changeprofilepicture",
        null, // Pass null as the request body if not required
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setLoading(false);
      setSelectedImage(response.data.response.logo_path);
      setUserData(response.data.response.logo_path);
      setLogoData(response.data.response.logo_path);
    } catch (error) {
      // setLoading(false);
      console.log("Cannot get profile photo data");
    }
  };

  const handleFileUpload1 = async (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];

    if (file) {
      const fileSizeInBytes = file.size;
      const maxSizeInBytes = 500 * 1024; // 500 KB
      if (fileSizeInBytes > maxSizeInBytes) {
        Swal.fire({
          title: "Image size should be under 500 KB",
          icon: "warning",
          confirmButtonText: "Close",
        });
        fileInput.value = "";
        setSelectedImage("");
        setUserData((prevLogo) => ({ ...prevLogo, logo: "" }));
        return;
      }

      // ✅ Check image resolution
      const img = new Image();
      img.src = window.URL.createObjectURL(file);

      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        if (width !== 200 || height !== 200) {
          Swal.fire({
            title: "Image resolution must be exactly 200x200 pixels",
            icon: "warning",
            confirmButtonText: "Close",
          });
          fileInput.value = "";
          setSelectedImage("");
          setUserData((prevLogo) => ({ ...prevLogo, logo: "" }));
        } else {
          // ✅ Convert to base64 if validation passes
          convertToBase64(file).then((base64) => {
            setUserData((prevLogo) => ({
              ...prevLogo,
              logo: base64,
            }));
            setSelectedImage(base64);
          });
        }
      };
    }
  };

  const handleClick = async () => {
    try {
      if (!userData.logo || userData.logo === null) {
        Swal.fire({
          title: "Please select an image!",
          icon: "warning",
          confirmButtonText: "Close",
        });
      } else {
        const confirmationResult = await Swal.fire({
          title: "Upload?",
          text: "Do you want to upload this profile picture?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseAPI + "/admin/changeprofilepicture",
            userData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer" + " " + token,
                // key: ApiKey,
                // token: tokenKey,
                // adminid: adminID,
              },
            }
          );
          setLoading(false);
          if (response.data.status === 200) {
            Cookies.set(
              "staff_profile_image",
              response.data.response.logo_path
            );
            Swal.fire({
              title: "Profile picture updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            }).then(() => {
              router.push("/staff/dashboard");
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
      //   setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not update profile picture",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  useEffect(() => {
    getData();
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <StaffLayout>
        {loading && <div className="loader-container"></div>}
        <div className="adminChangeUsername" style={{ minHeight: "80vh" }}>
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
                <i class="fa-solid fa-user"></i>
                <span>Change Profile Picture</span>
              </div>
            </div>
          </div>
          <div className="changeProfilePicture backgroundColor">
            <div className="">
              <div className="LOgoChangring">
                <h4>Change Profile Picture </h4>
              </div>
              <div className="profilelogochange">
                <div className="mb-3">
                  <label className="form-label" for="formFile">
                    Profile Picture
                  </label>
                  <div className=" w-32 h-32 rounded-lg border-2 shadow-sm">
                    {selectedImage ? (
                      <NextImage
                        src={selectedImage}
                        alt="selected logo"
                        height={200}
                        width={200}
                      />
                    ) : (
                      <NextImage
                        src="/Images/adminSide/dummy-profile.png"
                        alt=""
                        width={200}
                        height={200}
                      />
                    )}
                  </div>
                  <form action="" method="post">
                    <input
                      className="form-control my-3"
                      type="file"
                      id="formFile"
                      lable="Image"
                      name="logo"
                      accept=".jpeg, .png, .jpg, .gif"
                      onChange={(e) => handleFileUpload1(e)}
                    />
                  </form>

                  <div className="bottomButtons">
                    <button className="btn button1" onClick={handleClick}>
                      Save
                    </button>
                    <Link href="/staff/dashboard" className="btn button2">
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
function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
