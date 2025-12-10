"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../../../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import axios from "axios";
import BaseAPI from "../../../../BaseAPI/BaseAPI";
import Swal from "sweetalert2";
import AdminFooter from "@/app/admin/Components/AdminFooter/AdminFooter";
import Cookies from "js-cookie";
import EmployerLayout from "../../../EmployerLayout";
import "@/app/employer/employer.css";
import "../../../../common.css";
import { useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles
const Page = ({ params }) => {
  const editor = useRef(null);
  const router = useRouter();
  const [userData, setUserData] = useState({
    title: "",
    subject: "",
    template: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    subject: "",
    template: "",
  });
  const [variables, setVariables] = useState([]);
  const [loading, setLoading] = useState(false);
  const tokenKey = Cookies.get("tokenEmployer");
  const [templateId, setTemplateId] = useState({
    id: "",
  });

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

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + `/admin/emailtemplate/editemailtemplate/${params.slug}`,
        null, // Pass null as the request body if not required
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + tokenKey,
          },
        }
      );
      setLoading(false);
      setTemplateId({ ...templateId, id: response.data.response.id });
      console.log(templateId);
      setUserData(response.data.response);
      setVariables(response.data.response.variables);
    } catch (error) {
      setLoading(false);
      console.log("Cannot get data at edit Page List");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleVariableClickSubject = (e, value) => {
    e.preventDefault();
    console.log(value);
    // Concatenate value to the subject key in userData state
    setUserData((prevUserData) => ({
      ...prevUserData,
      subject: prevUserData.subject + value,
    }));
  };
  const handleVariableClickTemplate = (e, value) => {
    e.preventDefault();
    console.log(value);
    // Concatenate value to the subject key in userData state
    setUserData((prevUserData) => ({
      ...prevUserData,
      template: prevUserData.template + value,
    }));
  };

  const handleClick = async () => {
    try {
      console.log(userData);
      const newErrors = {};

      if (userData.title === "") {
        newErrors.title = "Title is required";
        window.scrollTo(0, 0);
      }
      if (userData.subject === "") {
        newErrors.subject = "Subject is required";
        window.scrollTo(0, 0);
      }
      if (userData.template === "") {
        newErrors.template = "Template is required";
        window.scrollTo(0, 0);
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Update Template?",
          text: "Do you want to update this template?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (confirmationResult.isConfirmed) {
          setLoading(true);

          const response = await axios.post(
            BaseAPI + `/admin/emailtemplate/editemailtemplate/${params.slug}`,
            userData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer" + " " + tokenKey,
              },
            }
          );

          setLoading(false);

          if (response.data.status === 200) {
            Swal.fire({
              title: "Template Updated successfully!",
              icon: "success",
              confirmButtonText: "Close",
            }).then(() => {
              router.push("/employer/email-templates");

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
        text: "Could not update email template. Please try again later!",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Could not update email template!", error);
    }
  };

  const handleTestMail = async () => {
    try {
      setLoading(true);
      // console.log("Sending request with data:", templateId.id);
      const response = await axios.post(
        BaseAPI + `/admin/emailtemplate/testemailtemplate/${params.slug}`,
        null, // Pass null as the request body if not required
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + tokenKey,
          },
        }
      );
      setLoading(false);
      if (response.data.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Email sent successfully to your email address",
          icon: "success",
          confirmButtonText: "Close",
        });
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not test mail. Please try again later!",
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
          className="addInterviewProcessAdd adminChangeUsername "
          style={{ minHeight: "80vh" }}
        >
          <div className="addInterviewProcess">
            <div className="breadCumb1" role="">
              <div className="flex gap-3 items-center flex-wrap">
                <Link
                  underline="hover"
                  color="inherit"
                  href="/employer/dashboard"
                >
                  <div className="flex gap-2 items-center ">
                    <i className="fa-solid fa-gauge "></i>
                    <span>
                      Dashboard <i class="fa-solid fa-angles-right text-xs"></i>
                    </span>
                  </div>
                </Link>
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-envelope"></i>

                  <Link href="/employer/email-templates">
                    {" "}
                    <span>
                      Email Templates{" "}
                      <i class="fa-solid fa-angles-right text-xs"></i>
                    </span>
                  </Link>
                </div>
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-edit"></i>
                  <span>Edit Email Template </span>
                </div>
              </div>
            </div>
          </div>
          <div className="emailTemplateBody">
            <div className="">
              <div className="emailTemplateHeader">
                <h2 className="">Edit Email Template</h2>

                <button
                  className="btn testEmailtemplateButton"
                  onClick={handleTestMail}
                >
                  Test Mail
                </button>
              </div>
            </div>
            <form>
              <div className="mb-4 mt-5">
                <div class="mb-5 DashBoardInputBx">
                  <label for="formFile" class="form-label">
                    Title<span className="RedStar">*</span>
                  </label>
                  <input
                    type="text"
                    id="form3Example1"
                    className={`form-control ${errors.title && "input-error"}`}
                    name="title"
                    placeholder="Enter Title"
                    value={userData.title}
                    onChange={handleChange}
                  />
                  {errors.title && (
                    <div className="text-danger">{errors.title}</div>
                  )}
                </div>
                <div className="firstBlockEmailTemplate">
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Variables to use
                    </label>
                    <div className="allbuttons">
                      {Object.entries(variables)?.map(([key, value]) => {
                        return (
                          <div className="APEditEmailTemplateButtons">
                            <button
                              className="btn variableButton"
                              onClick={(e) =>
                                handleVariableClickSubject(e, value)
                              }
                            >
                              {value}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div id="emailHelp" class="form-text">
                      Note* : click on above variable buttons to use these in
                      below subject on behalf of dynamic values (like :
                      username: [!username!])
                    </div>
                  </div>
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Subject<span className="RedStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="form3Example1"
                      className={`form-control ${
                        errors.subject && "input-error"
                      }`}
                      name="subject"
                      placeholder="Subject"
                      value={userData.subject}
                      onChange={handleChange}
                    />
                    {errors.subject && (
                      <div className="text-danger">{errors.subject}</div>
                    )}
                  </div>
                </div>
                <div className="secondBlockEmailTemplate">
                  <div class="mb-5 DashBoardInputBx">
                    <label for="formFile" class="form-label">
                      Variables to use
                    </label>
                    <div className="allbuttons">
                      {Object.entries(variables)?.map(([key, value]) => {
                        return (
                          <div className="APEditEmailTemplateButtons">
                            <button
                              className="btn variableButton"
                              onClick={(e) =>
                                handleVariableClickTemplate(e, value)
                              }
                            >
                              {value}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <div id="emailHelp" class="form-text">
                      Note* : click on above variable buttons to use these in
                      below subject on behalf of dynamic values (like :
                      username: [!username!])
                    </div>
                  </div>
                  <div className="mb-5 DashBoardInputBx DashBoardCreatBx APJoditEditor">
                    <label className="form-label" htmlFor="form3Example3">
                      Body<span className="RedStar">*</span>
                    </label>

                    <ReactQuill
                      theme="snow"
                      value={userData.template}
                      onChange={(value) =>
                        handleChange({
                          target: {
                            name: "template",
                            value,
                          },
                        })
                      }
                      style={{ minHeight: "250px", height: "200px" }}
                      placeholder="Add your text here..."
                    />
                    {errors.template && (
                      <div className="text-danger">{errors.template}</div>
                    )}
                  </div>
                </div>
                <div className="bottomButtons">
                  <button
                    type="button"
                    className="themeButton1"
                    onClick={handleClick}
                  >
                    SAVE
                  </button>
                  <button
                    type="button"
                    className="themeButton2"
                    onClick={() => router.push("/employer/email-templates")}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <AdminFooter />
      </EmployerLayout>
    </>
  );
};

export default Page;
