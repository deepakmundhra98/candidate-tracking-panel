"use client";
import React from "react";
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

const Page = () => {
  const token = Cookies.get("tokenEmployer");
  const router = useRouter();
  const [userData, setUserData] = useState({
    offer_letter_expiry: "",
    offer_letter_expiry_value: "",
    onboarding_expiry: "",
    onboarding_expiry_value: "",
  });

  const [errors, setErrors] = useState({
    offer_letter_expiry: "",
    offer_letter_expiry_value: "",
    onboarding_expiry: "",
    onboarding_expiry_value: "",
  });
  const [loading, setLoading] = useState(true);

  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };

  const [offerLetterExpiry, setOfferLetterExpiry] = useState(false);
  const [onboardingExpiry, setOnboardingExpiry] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "offer_letter_expiry    ") {
      setOfferLetterExpiry(true);
    }
    if (name === "onboarding_expiry") {
      setOnboardingExpiry(true);
    }
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + `/admin/generalsettings`,
        null, // Pass null as the request body if not required
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setLoading(false);
      setUserData(response.data.response);
      if (
        userData.offer_letter_expiry_value !== null &&
        userData.offer_letter_expiry_value === ""
      ) {
        setOfferLetterExpiry(true);
      }
      if (userData.onboarding_expiry_value !== null) {
        setOnboardingExpiry(true);
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

      if (userData.offer_letter_expiry === "") {
        newErrors.offer_letter_expiry = "Offer Letter Expiry is required";
      }
      if (offerLetterExpiry && userData.offer_letter_expiry_value === "") {
        newErrors.offer_letter_expiry_value =
          "Offer Letter Expiry Value is required";
      }
      if (userData.onboarding_expiry === "") {
        newErrors.onboarding_expiry = "Onboarding Expiry is required";
      }

      if (onboardingExpiry && userData.onboarding_expiry_value === "") {
        newErrors.onboarding_expiry_value =
          "Onboarding Expiry Value is required";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Update?",
          text: "Do you want to update General settings?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);

          const response = await axios.post(
            BaseAPI + `/admin/generalsettings`,
            userData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer" + " " + token,
              },
            }
          );
          setLoading(false);
          console.log("Hers");
          if (response.data.status === 200) {
            Swal.fire({
              title: "General settings updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });

            window.scrollTo(0, 0);
            router.push("/employer/generalsetting");
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
    }
  };
  return (
    <>
      <AdminLayout>
        {loading && <div className="loader-container"></div>}
        <div className="adminChangeUsername" style={{ minHeight: "80vh" }}>
          <div className="breadCumb1" role="">
            <div className="flex gap-3 items-center">
              <Link underline="hover" color="inherit" href="/employer/dashboard">
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
              <Link underline="hover" color="inherit" href="/employer/website-setting">
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-lock"></i>
                  <span>Website Setting <i class="fa-solid fa-angles-right text-xs"></i></span>
                </div>
              </Link>
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-clock"></i> <span>Setup Expiry Time</span>
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
            <div className="generalSetting">
              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 labelText">
                  Set Offer Letter Link Expiry Time
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 inputContainer">
                  <select
                    name="offer_letter_expiry"
                    value={userData.offer_letter_expiry}
                    className="form-control"
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                  </select>
                  {errors.offer_letter_expiry && (
                    <div className="text-danger">
                      {errors.offer_letter_expiry}
                    </div>
                  )}
                </div>
              </div>
              {offerLetterExpiry && (
                <div className="row">
                  <div className="col-lg-2 col-md-2 col-sm-2 labelText">
                    Set Expiry Value
                  </div>
                  <div className="col-lg-10 col-md-10 col-sm-10 inputContainer">
                    <input
                      type="text"
                      name="offer_letter_expiry_value"
                      className="form-control"
                      value={userData.offer_letter_expiry_value}
                      onChange={handleChange}
                    />
                    {errors.offer_letter_expiry_value && (
                      <div className="text-danger">
                        {errors.offer_letter_expiry_value}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 labelText">
                  Set Onboarding Link Expiry Time
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 inputContainer">
                  <select
                    name="onboarding_expiry"
                    className="form-control"
                    value={userData.onboarding_expiry}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                  </select>
                  {errors.onboarding_expiry && (
                    <div className="text-danger">
                      {errors.onboarding_expiry}
                    </div>
                  )}
                </div>
              </div>
              {onboardingExpiry && (
                <div className="row">
                  <div className="col-lg-2 col-md-2 col-sm-2 labelText">
                    Set Expiry Value
                  </div>
                  <div className="col-lg-10 col-md-10 col-sm-10 inputContainer">
                    <input
                      type="text"
                      name="onboarding_expiry_value"
                      value={userData.onboarding_expiry_value}
                      className="form-control"
                      onChange={handleChange}
                    />
                    {errors.onboarding_expiry_value && (
                      <div className="text-danger">
                        {errors.onboarding_expiry_value}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="row bottomButtons">
                <div className="col-lg-2 col-md-2 col-sm-2 labelText"></div>
                <div className="col-lg-10 col-md-10 col-sm-10 inputContainer">
                  <button className="btn themeButton1" onClick={handleClick}>
                    Save
                  </button>
                  <Link href="/employer/generalsetting" className="btn themeButton2">
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
