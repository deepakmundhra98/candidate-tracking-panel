"use client";

import React, { useEffect, useState } from "react";
// import { useState, useEffect } from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "../../../common.css";
import Footer from "@/app/Components/Footer/Footer";
import Image from "next/image";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
// import {getDescriptionData} from "../../../action/action"
import { useRouter } from "next/navigation";

import { getDescriptionData } from "@/app/action/action";
import HTMLReactParser from "html-react-parser";
import Cookies from "js-cookie";
const Page = ({ params }) => {
  const router = useRouter();
  const slug = params.slug;
  const [pageData, setPageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [constantsData, setConstantsData] = useState([]);
  const [siteData, setSiteData] = useState([]);

  let employerId = Cookies.get("employer_code");
  const getDescriptionData = async (slug) => {
    try {
      const response = await axios.post(
        BaseAPI + `/jobs/description/${slug}`,
        null,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      setLoading(false);
      // console.log(response.data.response, "Yhas");
      setPageData(response.data.response);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const getConstants = async () => {
    try {
      const response = await axios.post(
        BaseAPI + "/getconstants",
        { employer_id: employerId },
        {
          headers: {
            "content-type": "Application/json",
          },
        }
      );
      // console.log(response.data);
      setConstantsData(response.data.response);
      setSiteData(response.data.response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  useEffect(() => {
    getDescriptionData(slug);
    getConstants();
  }, []);

  return (
    <>
      {loading && <div className="loader-containerNormal"></div>}

      <section className="jobdescription">
        <div className="container">
          <div className="homepageLogo">
            {siteData.show_company_logo === "1" && (
              <>
                {" "}
                {siteData.company_logo !== "" ? (
                  <Image
                    src={siteData.company_logo}
                    alt="logo"
                    width={350}
                    height={150}
                  />
                ) : (
                  <Image
                    src="/Images/userSide/rms-logo.png"
                    alt="logo"
                    width={120}
                    height={90}
                  />
                )}
              </>
            )}
          </div>
          <div className="viewjobdetails">
            <div className="row">
              {/* <div className="col-lg-2 col-md-12 col-sm-12">
                {pageData && (
                  <>
                   
                  </>
                )}
              </div> */}
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="emp-details flex-md-row flex-column">
                  <div className="jobdetails">
                    <h1>{pageData.title}</h1>
                    <div className="emp-phone">
                      <i class="fa-solid fa-location-dot"></i>
                      <span>{pageData.location} </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-outline-light flex items-center hover:text-gray-300"
                onClick={() => router.back()}
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Go Back
              </button>
              <a href={`/job/jobapply/${slug}`} className=" post__btn">
                <i class="fa-brands fa-telegram"></i> Apply for {pageData.title}
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="jobovberview" style={{ minHeight: "100vh" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="job-overviewBox">
                <div className="job_description_bxx">
                  <h4 className="flex items-center">
                    <span>Job Details</span>
                  </h4>
                  <div className="item flex items-center">
                    <p className="flex w-full">
                      <span className="w-2/5 flex items-center">
                        <i className="fa-solid fa-building mr-2"></i> Category:
                      </span>
                      <span className="w-3/5">
                        {pageData.category_id ? pageData.category_id : "N/A"}
                      </span>
                    </p>
                  </div>
                  <div className="item flex items-center">
                    <p className="flex w-full">
                      <span className="w-2/5 flex items-center">
                        <i className="fa-solid fa-industry mr-2"></i> Industry:
                      </span>
                      <span className="w-3/5">
                        {pageData.industry ? pageData.industry : "N/A"}
                      </span>
                    </p>
                  </div>
                  <div className="item flex items-center">
                    <p className="flex w-full">
                      <span className="w-2/5 flex items-center">
                        <i className="fa-solid fa-clock mr-2"></i> Work Type:
                      </span>
                      <span className="w-3/5">
                        {pageData.work_type ? pageData.work_type : "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="job-overviewBox">
                <div className="job_description_bxx">
                  <h4 className="flex items-center">
                    <span>Requirements & Salary</span>
                  </h4>
                  <div className="item flex items-center">
                    <p className="flex w-full">
                      <span className="w-2/5 flex items-center">
                        <i className="fa-solid fa-briefcase mr-2"></i>{" "}
                        Experience:
                      </span>
                      <span className="w-3/5">
                        {pageData.min_exp} - {pageData.max_exp} Years
                      </span>
                    </p>
                  </div>
                  <div className="item flex items-center">
                    <p className="flex w-full">
                      <span className="w-2/5 flex items-center">
                        <i className="fa-solid fa-graduation-cap mr-2"></i>{" "}
                        Qualification:
                      </span>
                      <span className="w-3/5">
                        {pageData.qualification
                          ? pageData.qualification
                          : "N/A"}
                      </span>
                    </p>
                  </div>
                  <div className="item flex items-center">
                    <p className="flex w-full">
                      <span className="w-2/5 flex items-center">
                        <i className="fa-solid fa-dollar-sign mr-2"></i> Annual
                        Salary:
                      </span>
                      <span className="w-3/5">{`${pageData.min_salary} - ${pageData.max_salary}`}</span>
                    </p>
                  </div>
                  <div className="item flex items-center">
                    <p className="flex w-full">
                      <span className="w-2/5 flex items-center">
                        <i className="fa-solid fa-lightbulb mr-2"></i> Skills:
                      </span>
                      <span className="w-3/5">
                        {pageData.skill ? pageData.skill : "N/A"}
                      </span>
                    </p>
                  </div>
                  <div className="item flex items-center">
                    <p className="flex w-full">
                      <span className="w-2/5 flex items-center">
                        <i className="fa-solid fa-user-tie mr-2"></i>{" "}
                        Designation:
                      </span>
                      <span className="w-3/5">
                        {pageData.designation ? pageData.designation : "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="tab-content">
                <div id="one">
                  {pageData && (
                    <>
                      <div className="job_description_bxx">
                        <h4 className="flex items-center">
                          <Image
                            src="/Images/userSide/job-detail-icon.png"
                            width={50}
                            height={50}
                            alt="logo"
                          />
                          <span> Job Description</span>
                        </h4>
                        <p>
                          {pageData.description &&
                            HTMLReactParser(pageData.description)}
                        </p>
                      </div>
                      <a href={`/job/jobapply/${slug}`} className=" post__btn">
                        <i class="fa-brands fa-telegram"></i> Apply for{" "}
                        {pageData.title}
                      </a>
                    </>
                  )}

                  {/* {pageData && (
                    <>
                      <div className="job_description_bxx">
                        <h4 className="flex items-center">
                          <Image
                            src="/Images/userSide/job-category-icon.png"
                            width={50}
                            height={50}
                            alt="logo"
                          />
                          <span>Category</span>
                        </h4>
                        <p>{pageData.category_id}</p>
                      </div>
                    </>
                  )}
                  {pageData && (
                    <>
                      <div className="job_description_bxx">
                        <h4 className="flex items-center">
                          <Image
                            src="/Images/userSide/job-industry-icon.png"
                            width={50}
                            height={50}
                            alt="logo"
                          />
                          <span>Industry</span>
                        </h4>
                        <p>{pageData.industry ? pageData.industry : "N/A"}</p>
                      </div>
                    </>
                  )}
                  {pageData && (
                    <>
                      <div className="job_description_bxx">
                        <h4 className="flex items-center">
                          <Image
                            src="/Images/userSide/job-dworktype-icon.png"
                            width={50}
                            height={50}
                            alt="logo"
                          />
                          <span>Work Type</span>
                        </h4>
                        <p>{pageData.work_type}</p>
                      </div>
                    </>
                  )} */}
                </div>

                {/* <div id="two">
                  <div className="main-headding">
                    <h2>
                      <span>Requirements and Salary Details</span>
                    </h2>
                  </div>
                  {pageData && (
                    <>
                      <div className="job_description_bxx">
                        <h4 className="flex items-center">
                          <Image
                            src="/Images/userSide/job-exoerience-icon.png"
                            width={50}
                            height={50}
                            alt="logo"
                          />
                          <span>Experience</span>
                        </h4>
                        <p>
                          {pageData.min_exp} - {pageData.max_exp} Year
                        </p>
                      </div>
                    </>
                  )}
                  {pageData && (
                    <>
                      <div className="job_description_bxx">
                        <h4 className="flex items-center">
                          <Image
                            src="/Images/userSide/job-qualification-icon.png"
                            width={50}
                            height={50}
                            alt="logo"
                          />
                          <span>Qualification</span>
                        </h4>
                        <p>
                          {pageData.qualification
                            ? pageData.qualification
                            : "N/A"}
                        </p>
                      </div>
                    </>
                  )}
                  {pageData && (
                    <>
                      <div className="job_description_bxx">
                        <h4 className="flex items-center">
                          <Image
                            src="/Images/userSide/requirements-icon.png"
                            width={50}
                            height={50}
                            alt="logo"
                          />
                          <span>Annual Salary</span>
                        </h4>
                        <p>{`${pageData.min_salary} - ${pageData.max_salary}`}</p>
                      </div>
                    </>
                  )}
                  {pageData && (
                    <>
                      <div className="job_description_bxx">
                        <h4 className="flex items-center">
                          <Image
                            src="/Images/userSide/job-skills-icon.png"
                            width={50}
                            height={50}
                            alt="logo"
                          />
                          <span>Skills</span>
                        </h4>
                        <p>{pageData.skill}</p>
                      </div>
                    </>
                  )}
                  {pageData && (
                    <>
                      <div className="job_description_bxx">
                        <h4 className="flex items-center">
                          <Image
                            src="/Images/userSide/job-designation-icon.png"
                            width={50}
                            height={50}
                            alt="logo"
                          />
                          <span>Designation</span>
                        </h4>
                        <p>{pageData.designation}</p>
                      </div>
                    </>
                  )}
                  <a href={`/job/jobapply/${slug}`} className=" post__btn">
                    <i class="fa-brands fa-telegram"></i>
                    Apply Job
                  </a>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <div className="py-7">
        <Footer />
      </div> */}
    </>
  );
};

export default Page;
