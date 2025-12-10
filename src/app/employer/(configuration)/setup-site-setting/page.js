"use client";
import React, { useRef } from "react";
import { useState } from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "../../../common.css";
import Swal from "sweetalert2";
import AdminFooter from "../../../admin/Components/AdminFooter/AdminFooter";
import AdminLayout from "../../EmployerLayout";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import BaseAPI from "../../../BaseAPI/BaseAPI";
import { useEffect } from "react";
import "../../employer.css";
import Image from "next/image";


const Page = () => {
  const token = Cookies.get("tokenEmployer");
  const router = useRouter();
  const [userData, setUserData] = useState({
    showFooterOnHomepage: "0",
    company_contact: "",
    company_email: "",
    company_address: "",
    primary_color: "#000000",
    secondary_color: "#ffffff",
    font_style: "Arial",
    primary_banner: "",
    show_primary_banner: "0",
    secondary_banner: "",
    allow_candidate_accounts: "",
    application_form_banner: "",
  });

  const [errors, setErrors] = useState({
    showFooterOnHomepage: "",
  });
  const [loading, setLoading] = useState(true);

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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: checked ? "1" : "0",
    }));
  };

  const getData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + `/admin/sitesetting`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setLoading(false);
      setUserData(response.data.response);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get plans data at APmanageplans");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const fileRef = useRef({});

// Make sure this is NOT imported at the top:
// ❌ import Image from 'next/image';

const handleFileChange = (e, type) => {
  const file = e.target.files[0];
  if (!file) {
    console.log("No file selected");
    return;
  }

  console.log(`File selected for ${type}:`, file.name, file.type, file.size);

  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    console.log("Invalid file type:", file.type);
    Swal.fire({
      icon: "warning",
      title: "Invalid file type",
      text: "Please upload a JPG, PNG, or WEBP image.",
    });
    e.target.value = ""; // Clear input
    return;
  }

  if (file.size > 1024 * 1024) {
    console.log("File size too large:", file.size);
    Swal.fire({
      icon: "warning",
      title: "File too large",
      text: "File size should be less than 1MB.",
    });
    e.target.value = "";
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  console.log("Object URL created:", objectUrl);
  const img = new window.Image(); // ✅ Use native Image constructor

  img.onload = () => {
    const { width, height } = img;
    console.log(`Image loaded: ${width}x${height}`);

    URL.revokeObjectURL(objectUrl);
    console.log("Object URL revoked");

    if (width < 1920 || height < 200) {
      Swal.fire({
        icon: "warning",
        title: "Image too small",
        text: "Minimum image dimensions are 1920x200 pixels.",
      });
      e.target.value = "";
      return;
    }

    if (width > 2400 || height > 700) {
      Swal.fire({
        icon: "warning",
        title: "Image too large",
        text: "Maximum image dimensions are 2400x700 pixels.",
      });
      e.target.value = "";
      return;
    }

    // ✅ Passed all checks
    fileRef.current[type] = file;
    setUserData((prev) => ({
      ...prev,
      [type]: file.name,
    }));
    console.log(`File stored for ${type}:`, file.name);
  };

  img.onerror = () => {
    console.error("Failed to load image");
    URL.revokeObjectURL(objectUrl);
    Swal.fire({
      icon: "error",
      title: "Failed to load image",
      text: "The selected image could not be loaded. Please try another file.",
    });
    e.target.value = "";
  };

  img.src = objectUrl;
  console.log("Image src set, waiting for load");
};

  

  const handleClick = async () => {
    try {
      const newErrors = {};

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Update?",
          text: "Do you want to update Site settings?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (confirmationResult.isConfirmed) {
          setLoading(true);

          const formData = new FormData();

          Object.keys(userData).forEach((key) => {
            if (
              key !== "primary_banner" &&
              key !== "secondary_banner" &&
              key !== "application_form_banner"
            ) {
              formData.append(key, userData[key]);
            }
          });

          if (fileRef.current.primary) {
            formData.append("primary_banner", fileRef.current.primary);
            console.log(
              "Primary banner file added to FormData:",
              fileRef.current.primary.name
            );
          } else {
            if (userData.primary_banner) {
              formData.append("primary_banner", userData.primary_banner);
              console.log(
                "No new primary banner, using existing:",
                userData.primary_banner
              );
            }
          }

          if (fileRef.current.secondary) {
            formData.append("secondary_banner", fileRef.current.secondary);
          }
          if (fileRef.current.application_form_banner) {
            formData.append(
              "application_form_banner",
              fileRef.current.application_form_banner
            );
          }

          for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
          }

          const response = await axios.post(
            BaseAPI + `/admin/sitesetting`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + token,
              },
            }
          );

          setLoading(false);

          if (response.data.status === 200) {
            Swal.fire({
              title: "Site settings updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            }).then(() => {
              router.push("/employer/generalsetting");
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
        text: "Could not update general settings",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <>
      <AdminLayout>
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
                  <i className="fa-solid fa-gauge"></i>
                  <span>
                    Dashboard <i className="fa-solid fa-angles-right text-xs"></i>
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
              <Link underline="hover" color="inherit" href="/employer/website-setting">
                <div className="flex gap-2 items-center">
                  <i className="fa-solid fa-lock"></i>
                  <span>
                    Website Setting{" "}
                    <i className="fa-solid fa-angles-right text-xs"></i>
                  </span>
                </div>
              </Link>
              <div className="flex gap-2 items-center">
                <i className="fa-solid fa-gear"></i>
                <span>Setup Site Settings</span>
              </div>
            </div>
          </div>
          <div
            className="generalSettings backgroundColor"
            style={{ minHeight: "60vh" }}
          >
            <div className="profilelogo">
              <h2>Site Settings</h2>
            </div>
            <div className="generalSetting">
              <div className="row">
                <div className="col-lg-4 col-md-4 col-sm-2 labelText">
                  Show footer on Homepage?
                </div>
                <div className="col-lg-8 col-md-8 col-sm-10 inputContainer">
                  <div className="form-check my-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="showFooterOnHomePage"
                      name="showFooterOnHomepage"
                      checked={userData.showFooterOnHomepage === "1"}
                      onChange={handleCheckboxChange}
                      style={{ width: "20px", height: "20px" }}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-4 col-sm-2 labelText">
                  Create Candidate Accounts after Job Apply?
                </div>
                <div className="col-lg-8 col-md-8 col-sm-10 inputContainer">
                  <div className="form-check my-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="allow_candidate_accounts"
                      name="allow_candidate_accounts"
                      checked={userData.allow_candidate_accounts === "1"}
                      onChange={handleCheckboxChange}
                      style={{ width: "20px", height: "20px" }}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-4 col-sm-2 labelText">
                  Company Contact
                </div>
                <div className="col-lg-8 col-md-8 col-sm-10 inputContainer">
                  <input
                    type="text"
                    name="company_contact"
                    className="form-control"
                    value={userData.company_contact}
                    onChange={handleChange}
                  />
                  {errors.company_contact && (
                    <div className="text-danger">{errors.company_contact}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-4 col-sm-2 labelText">
                  Company Email
                </div>
                <div className="col-lg-8 col-md-8 col-sm-10 inputContainer">
                  <input
                    type="text"
                    name="company_email"
                    className="form-control"
                    value={userData.company_email}
                    onChange={handleChange}
                  />
                  {errors.company_email && (
                    <div className="text-danger">{errors.company_email}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-4 col-sm-2 labelText">
                  Company Address
                </div>
                <div className="col-lg-8 col-md-8 col-sm-10 inputContainer">
                  <input
                    type="text"
                    name="company_address"
                    className="form-control"
                    value={userData.company_address}
                    onChange={handleChange}
                  />
                  {errors.company_address && (
                    <div className="text-danger">{errors.company_address}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 labelText">Primary Color</div>
                <div className="col-lg-4 inputContainer">
                  <input
                    type="color"
                    name="primary_color"
                    value={userData.primary_color}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 labelText">Secondary Color</div>
                <div className="col-lg-4 inputContainer">
                  <input
                    type="color"
                    name="secondary_color"
                    value={userData.secondary_color}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 labelText">Font Style</div>
                <div className="col-lg-8 inputContainer">
                  <select
                    name="font_style"
                    value={userData.font_style}
                    onChange={handleChange}
                  >
                    <option value="Arial">Arial</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 labelText">Primary Banner</div>
                <div className="col-lg-8 inputContainer">
                  <input
                    type="file"
                    name="primary_banner"
                    className="form-control"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileChange(e, "primary")}
                  />
                  <small className="text-muted">
                    For best view, upload an image of 1920x300 resolution.
                  </small>
                  <br />
                  <span className="text-muted">
                    Show Primary Banner on homepage?{" "}
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="show_primary_banner"
                      name="show_primary_banner"
                      checked={userData.show_primary_banner === "1"}
                      onChange={handleCheckboxChange}
                      style={{ width: "15px", height: "15px" }}
                    />
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 labelText">
                  Existing Primary Banner
                </div>
                <div className="col-lg-8 inputContainer">
                  {userData.existing_primary_banner !== "" ? (
                    <div className="rounded border p-2">
                      <Image
                        src={userData.existing_primary_banner}
                        alt="Primary banner"
                        width={1500}
                        height={300}
                      />
                    </div>
                  ) : (
                    <div className="">No image uploaded</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 labelText">Secondary Banner</div>
                <div className="col-lg-8 inputContainer">
                  <input
                    type="file"
                    name="secondary_banner"
                    className="form-control"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileChange(e, "secondary")}
                  />
                  <small className="text-muted">
                    For best view, upload an image of 1920x300 resolution.
                  </small>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 labelText">
                  Existing Secondary Banner
                </div>
                <div className="col-lg-8 inputContainer">
                  {userData.existing_secondary_banner !== "" ? (
                    <div className="rounded border p-2">
                      <Image
                        src={userData.existing_secondary_banner}
                        alt="Secondary banner"
                        width={1500}
                        height={300}
                      />
                    </div>
                  ) : (
                    <div className="">No image uploaded</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 labelText">
                  Application Form Banner
                </div>
                <div className="col-lg-8 inputContainer">
                  <input
                    type="file"
                    name="application_form_banner"
                    className="form-control"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) =>
                      handleFileChange(e, "application_form_banner")
                    }
                  />
                  <small className="text-muted">
                    For best view, upload an image of 1920x300 resolution.
                  </small>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 labelText">
                  Existing Application Form Banner
                </div>
                <div className="col-lg-8 inputContainer">
                  {userData.existing_application_form_banner !== "" ? (
                    <div className="rounded border p-2">
                      <Image
                        src={userData.existing_application_form_banner}
                        alt="Application form banner"
                        width={1500}
                        height={300}
                      />
                    </div>
                  ) : (
                    <div className="">No image uploaded</div>
                  )}
                </div>
              </div>
              <div className="row bottomButtons">
                <div className="col-lg-8 col-md-8 col-sm-10 inputContainer">
                  <button className="btn themeButton1" onClick={handleClick}>
                    Save
                  </button>
                  <Link
                    href="/employer/generalsetting"
                    className="btn themeButton2"
                  >
                    Cancel
                  </Link>
                </div>
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
