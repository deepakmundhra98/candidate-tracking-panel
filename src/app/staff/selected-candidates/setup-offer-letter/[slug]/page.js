"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import Swal from "sweetalert2";
import axios from "axios";
import "../../../../common.css";
import AdminFooter from "../../../../admin/Components/AdminFooter/AdminFooter";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import StaffLayout from "../../../StaffLayout";
import Modal from "react-bootstrap/Modal";
import HTMLReactParser from "html-react-parser";

const Page = ({ params }) => {
  const router = useRouter();
  const token = Cookies.get("tokenStaff");
  const jobId = Cookies.get("job_id");

  const [pageData, setPageData] = useState([]);
  const [offerLetterExpiry, setOfferLetterExpiry] = useState(false);
  const [userData, setUserData] = useState({
    position_name: "",
    reporting_person: "",
    joining_date: "",
    work_location: "",
    compensation: "",
    comment: "",
    benefits: "",
    offer_letter_expiry: "",
    offer_letter_expiry_value: "",
    // job_id: jobId,
    candidate_id: params.slug,
    // employerId: Cookies.get("employerId"),
  });

  const [errors, setErrors] = useState({
    position_name: "",
    reporting_person: "",
    joining_date: "",
    work_location: "",
    compensation: "",
    offer_letter_expiry: "",
    offer_letter_expiry_value: "",
  });
  const [loading, setLoading] = useState(true);
  let staffId = Cookies.get("staffId");
  let candidateId = params.slug;
  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };

  const [displayDraftButton, setDisplayDraftButton] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (pageData.draft_status === "1") {
      setDisplayDraftButton(true);
    }
    if (name === "offer_letter_expiry") {
      setOfferLetterExpiry(true);
    }
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
      const response = await axios.post(
        BaseAPI + "/admin/offerinitialdata",
        {
          id: staffId,
          candidate_id: candidateId,
          user_type: "staff"
        },
        {
          headers: {
            "Content-Type": "application/json",

            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setLoading(false);
      if(response.data.status === 200) {
        if (response.data.response.draft_status === "1") {
          setUserData(response.data.response.draftData);
        }
        setPageData(response.data.response);
        if (
          userData.offer_letter_expiry_value !== null &&
          userData.offer_letter_expiry_value === ""
        ) {
          setOfferLetterExpiry(true);
        }
      } else{
        Swal.fire({
          title: "Restricted",
          text: response.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/staff/selected-candidates");
        });
      }
      
    } catch (error) {
      setLoading(false);

      console.log(error.message);
    }
  };

  const saveDraft = async () => {
    try {
      const newErrors = {};

      if (userData.position_name === "") {
        newErrors.position_name = "Position name is required";
      }
      if (userData.reporting_person === "") {
        newErrors.reporting_person = "Reporting person is required";
      }
      if (userData.joining_date === "") {
        newErrors.joining_date = "Joining date is required";
      }
      if (userData.work_location === "") {
        newErrors.work_location = "Work location is required";
      }
      if (userData.compensation === "") {
        newErrors.compensation = "Compensation is required";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Save as draft?",
          text: "Do you want to save these details as draft?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const response = await axios.post(
            BaseAPI + "/admin/candidates/offerdraftdata",
            userData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer" + " " + token,
              },
            }
          );
          if (response.data.status === 200) {
            router.push("/staff/selected-candidates");
            Swal.fire({
              title: "Draft saved successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
          }
        } else {
          setLoading(false);
          console.log("error");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  const handleClick = async () => {
    try {
      const newErrors = {};

      if (userData.position_name === "") {
        newErrors.position_name = "Position name is required";
      }
      if (userData.reporting_person === "") {
        newErrors.reporting_person = "Reporting person is required";
      }
      if (userData.joining_date === "") {
        newErrors.joining_date = "Joining date is required";
      }
      if (userData.work_location === "") {
        newErrors.work_location = "Work location is required";
      }
      if (userData.compensation === "") {
        newErrors.compensation = "Compensation is required";
      }

      if (userData.offer_letter_expiry === "") {
        newErrors.offer_letter_expiry = "Offer Letter Expiry is required";
      }
      if (offerLetterExpiry && userData.offer_letter_expiry_value === "") {
        newErrors.offer_letter_expiry_value =
          "Offer Letter Expiry Value is required";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: "Setup?",
          text: "Do you want to send these details to the candidate? This will send the offer letter to the candidate via email.",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          setLoading(true);
          const updatedData = {
            ...userData,
            job_id: jobId,
            // employer_id: employerId,
            staffId: staffId,
            user_type: "staff"
          };
          const response = await axios.post(
            BaseAPI + "/admin/candidates/sendofferletteremail",
            updatedData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer" + " " + token,
              },
            }
          );
          setLoading(false);
          if (response.data.status === 200) {
            router.push("/staff/selected-candidates");
            Swal.fire({
              title: "Offer letter sent successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            // setUserData({
            //   ...userData,
            //   designation_name: ''
            // })
            // window.scrollTo(0, 0)
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
        text: "Could not send the offer letter to the candidate",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewModalData, setPreviewModalData] = useState(false);

  const handlePreviewModal = async () => {
    try {
      const response = await axios.post(
        BaseAPI +
          "/admin/emailtemplate/offer-letter/getEmailTemplatePreview/" +
          pageData.emailTemplateId,
        {
          userData,
          user_type: "staff"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
        setShowPreviewModal(true);
        setPreviewModalData(response.data.response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <StaffLayout>
        {loading && <div className="loader-container"></div>}
        <div
          className="addInterviewProcessAdd adminChangeUsername"
          style={{ minHeight: "80vh" }}
        >
          <div className="addInterviewProcess">
            <div className="breadCumb1" role="">
              <div className="flex gap-3 flex-wrap items-center">
                <Link underline="hover" color="inherit" href="/staff/dashboard">
                  <div className="flex gap-2 items-center">
                    <i className="fa-solid fa-gauge "></i>
                    <span>
                      Dashboard <i class="fa-solid fa-angles-right text-xs"></i>
                    </span>
                  </div>
                </Link>
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-briefcase"></i>

                  <span>
                    {" "}
                    <Link href="/staff/selected-candidates">
                      {" "}
                      Selected Candidates{" "}
                    </Link>{" "}
                  </span>
                  <i class="fa-solid fa-angles-right text-xs"></i>
                </div>
                <div className="flex gap-2 items-center  ">
                  <i class="fa-solid fa-plus"></i>

                  <span> Offer letter details </span>
                </div>
              </div>
            </div>
          </div>
          <div className="addInterviewProcessForm">
            <form action="" method="post">
              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  Position Name<span>*</span>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <input
                    type="text"
                    className="form-control"
                    value={userData.position_name}
                    name="position_name"
                    onChange={handleChange}
                  ></input>
                  {errors.position_name && (
                    <div className="text-danger">{errors.position_name}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  Reporting person <span>*</span>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <select
                    className="form-select shadow-none"
                    value={userData.reporting_person}
                    name="reporting_person"
                    onChange={handleChange}
                  >
                    <option selected value="">
                      Select Reporting Person
                    </option>
                    {pageData.staffList?.map((item) => (
                      <option value={item.id}>
                        {item.first_name} {item.last_name}
                      </option>
                    ))}
                  </select>
                  {errors.reporting_person && (
                    <div className="text-danger">{errors.reporting_person}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  Joining Date <span>*</span>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <input
                    type="date"
                    className="form-control"
                    value={userData.joining_date}
                    name="joining_date"
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                  ></input>
                  {errors.joining_date && (
                    <div className="text-danger">{errors.joining_date}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  Work Location<span>*</span>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <input
                    type="text"
                    className="form-control"
                    value={userData.work_location}
                    name="work_location"
                    onChange={handleChange}
                  ></input>
                  {errors.work_location && (
                    <div className="text-danger">{errors.work_location}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  Compensation<span>*</span>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <input
                    type="text"
                    className="form-control"
                    value={userData.compensation}
                    name="compensation"
                    onChange={handleChange}
                  ></input>
                  {errors.compensation && (
                    <div className="text-danger">{errors.compensation}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  Benefits
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <input
                    type="text"
                    className="form-control"
                    value={userData.benefits}
                    name="benefits"
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  Comment
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
                  <input
                    type="text"
                    className="form-control"
                    value={userData.comment}
                    name="comment"
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                  Set Offer letter expiry time<span>*</span>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
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
                  <div className="col-lg-2 col-md-2 col-sm-2 Name--txt">
                    Set Offer letter expiry time<span>*</span>
                  </div>
                  <div className="col-lg-10 col-md-10 col-sm-10 Name--txt">
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
            </form>
            <div className="bottomButtons flex flex-wrap gap-[10px] w-100 ">
              <button className="btn button1" onClick={handleClick}>
                Save
              </button>
              {pageData.draft_status !== "1" && (
                <button className="min-w-[180px] btn button3" onClick={saveDraft}>
                  Save as Draft
                </button>
              )}
              {pageData.draft_status === "1" && displayDraftButton && (
                <button
                  className="btn"
                  onClick={saveDraft}
                  style={{
                    color: "#ffffff",
                    backgroundColor: "#e4e13f",
                    borderColor: "#e4e13f",
                    fontWeight: 500,
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "16px",
                    width: "140px",
                    marginRight: "10px",
                    cursor: "pointer",
                    minWidth: "180px",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#cac85e";
                    e.target.style.borderColor = "#cac85e";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#e4e13f";
                    e.target.style.borderColor = "#e4e13f";
                  }}
                >
                  Save as Draft
                </button>
              )}

              <button className="btn button2 mr-2" onClick={handlePreviewModal}>
                Preview
              </button>
              <Link
                href="/staff/selected-candidates"
                className="btn button2"
              >
                Cancel
              </Link>

              <Modal
                size="lg"
                show={showPreviewModal}
                onHide={() => setShowPreviewModal(false)}
                aria-labelledby="example-modal-sizes-title-lg"
              >
                <Modal.Header closeButton className="Process_assigned">
                  <Modal.Title id="example-modal-sizes-title-lg">
                    Email Preview
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {previewModalData && (
                    HTMLReactParser(previewModalData)
                  )}
                </Modal.Body>
              </Modal>
            </div>
          </div>
        </div>
        <AdminFooter />
      </StaffLayout>
    </>
  );
};

export default Page;
