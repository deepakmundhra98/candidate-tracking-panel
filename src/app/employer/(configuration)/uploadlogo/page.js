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
import EmployerLayout from "../../EmployerLayout";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Page = () => {
  const [userData, setUserData] = useState({
    logo: "",
    showOnHomepage: "0",
  });
  const [logoData, setLogoData] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const token = Cookies.get("tokenEmployer");

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + "/admin/changewebsitelogo",
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setLoading(false);
      setSelectedImage(response.data.response.logo_path);
      setUserData(response.data.response);
      setLogoData(response.data.response.logo_path);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get profile photo data");
    }
  };

  const handleFileUpload1 = async (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];

    // Check if the file is selected
    if (file) {
      // Check the file size (in bytes)
      const fileSizeInBytes = file.size;
      const maxSizeInBytes = 500 * 1024; // 500 KB
      if (fileSizeInBytes > maxSizeInBytes) {
        Swal.fire({
          title: "Image size should be under 500 KB",
          icon: "warning",
          confirmButtonText: "Close",
        });
        // Clear the file input
        fileInput.value = ""; // This clears the input
        setSelectedImage("");
        setUserData((prevLogo) => ({
          ...prevLogo,
          logo: "",
        }));
        return;
      }

      // Convert the image to base64
      convertToBase64(file).then((base64) => {
        setUserData((prevLogo) => ({
          ...prevLogo,
          logo: base64,
        }));
        setSelectedImage(base64);
        console.log(selectedImage);
      });
    }
  };

  const handleCheckboxChange = (e) => {
    // Set the state to 1 if checked, 0 if unchecked
    setUserData({ ...userData, showOnHomepage: e.target.checked ? "1" : "0" });
  };

  const handleClick = async () => {
    try {
      if (!userData.logo || userData.logo === null) {
        Swal.fire({
          title: "Please select a Logo!",
          icon: "warning",
          confirmButtonText: "Close",
        });
      } else {
        const confirmationResult = await Swal.fire({
          title: "Upload?",
          text: "Do you want to upload this logo?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseAPI + "/admin/changewebsitelogo",
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
              title: "Logo updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            }).then(() => {
              router.push("/employer/dashboard");
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
        text: "Could not upload logo",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  useEffect(() => {
    getData();
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <EmployerLayout>
        {loading && <div className="loader-container"></div>}
        <div className="adminChangeUsername" style={{ minHeight: "80vh" }}>
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
              <Link
                underline="hover"
                color="inherit"
                href="/employer/configuration"
              >
                <div className="flex gap-2 items-center justify-center">
                  <i className="fa fa-gears"></i>
                  <span>
                    Configuration{" "}
                    <i class="fa-solid fa-angles-right text-xs"></i>
                  </span>
                </div>
              </Link>
              <div className="flex gap-2 items-center  ">
                <i className="fa-solid fa-upload"></i>
                <span>Change Website Logo</span>
              </div>
            </div>
          </div>
          <div className="changeProfilePicture backgroundColor">
            <div className="">
              <div className="profilelogochange">
                <div className="mb-3">
                  {/* <div className="LOgoChangring">
                    <h4>Change Website logo </h4>
                  </div> */}
                  <div className="w-32 h-32 rounded-lg border-2 shadow-sm flex items-center justify-center">
                    {selectedImage ? (
                      <Image
                        src={selectedImage}
                        alt="selected logo"
                        width={100}
                        height={100}
                        className="object-contain"
                      />
                    ) : (
                      <Image
                        src="/Images/adminSide/dummy-profile.png"
                        alt=""
                        width={100}
                        height={100}
                        className="object-contain"
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
                    <div className="form-check my-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="showOnHomePage"
                        name="showOnHomePage"
                        checked={userData.showOnHomepage === "1"}
                        onChange={handleCheckboxChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="showOnHomePage"
                      >
                        Show on home page ?
                      </label>
                    </div>
                  </form>

                  <div className="bottomButtons">
                    <button className="btn button1" onClick={handleClick}>
                      Save
                    </button>
                    <Link href="/employer/dashboard" className="btn button2">
                      Cancel
                    </Link>
                  </div>
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
