"use client";
import React, { useState, useEffect } from "react";
import "./globals.css";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "./common.css";
import axios from "axios";
import BaseAPI from "/src/app/BaseAPI/BaseAPI";
import parse from "html-react-parser";
import Image from "next/image";

const Page = () => {
  const [totalJobData, setTotalJobData] = useState([]);
  const getData = async () => {
    try {
      const response = await axios.post(BaseAPI + "/jobs/listing");
      setTotalJobData(response.data.response);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  // const getData = await.action
  return (
    <>
      <div className=" ">
        <section className="userpage">
          <div className="container">
            <div className="logo ">
              <Image
                // src="../../../Images/userSide/rms-logo.png"
                src="/Images/userSide/rms-logo.png"
                alt="logo"
                width={120}
                height={90}
              />
            </div>
          </div>
        </section>
        <section className="list--job" style={{ minHeight: "100vh" }}>
          <div className="container">
            <div className="row">
              {totalJobData !== "" &&
                totalJobData.map((i) => {
                  return (
                    <>
                      <div className="col-lg-6 col-md-12 col-sm-12">
                        <div className="new-job">
                          <div className="newjob_details">
                            <h2>
                              <Link href={`/job/jobdescription/${i.slug}`}>
                                {i.job_name}
                              </Link>
                            </h2>
                            <h3>
                              {i.job_description &&
                                parse(i.job_description.substring(0, 200))}
                              ..
                            </h3>
                          </div>
                          <div className="apply--btn">
                            <div className="post--date">
                              <i class="fa fa-calendar"></i>
                              <span>{i.job_created_at}</span>
                            </div>

                            <Link
                              href={`/job/jobdescription/${i.slug}`}
                              className="btn post-btn"
                            >
                              Apply Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
        </section>

        <div className="copyright">
          <div className="container">
            © Copyright @ 2024 |{" "}
            <Link
              href="https://www.logicspice.com/recruitment-management-software"
              className="anchor__web"
              target="_blank"
            >
              Recruitment Management Software
            </Link>{" "}
            by Logicspice. All Rights Reserved
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
