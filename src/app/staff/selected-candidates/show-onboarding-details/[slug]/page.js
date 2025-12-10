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

const Page = ({ params }) => {
  const router = useRouter();
  const token = Cookies.get("tokenStaff");
  const jobId = Cookies.get("job_id");

  const [experienceData, setExperienceData] = useState([]);
  const [educationData, setEducationData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [preferenceData, setPreferenceData] = useState([]);

  const [loading, setLoading] = useState(true);
  let employerId = Cookies.get("employerId");
  let candidateId = params.slug;
  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };

  const [displayDraftButton, setDisplayDraftButton] = useState(false);

  const getData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + "/admin/candidates/get_candidate_details_after_onboarding",
        {
          candidate_id: candidateId,
        },
        {
          headers: {
            "Content-Type": "application/json",

            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setLoading(false);

      setUserData(response.data.response);
      setEducationData(response.data.response.education);
      setExperienceData(response.data.response.experience);
      setPreferenceData(response.data.response.preference_data.preferences);
    } catch (error) {
      setLoading(false);

      console.log(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
                  <i class="fa-solid fa-info-circle"></i>

                  <span> Candidate Onboarding Details </span>
                </div>
              </div>
            </div>
          </div>
          <div className="addInterviewProcessForm">
            <h3 className="SectionHeadingOnboardingDetails">
              Personal Details
            </h3>
            <form action="" method="post">
              <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                  Name:
                </div>
                <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                  {userData.name}
                  {userData.name_old && (
                    <p>
                      (Name changed from{" "}
                      <span className="text-danger">{userData.name_old}</span>{" "}
                      to <span className="text-danger">{userData.name}</span> by
                      the candidate.)
                    </p>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                  Gender:
                </div>
                <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                  {userData.gender}
                  {userData.gender_old && (
                    <p>
                      (Gender changed from{" "}
                      <span className="text-danger">{userData.gender_old}</span>{" "}
                      to <span className="text-danger">{userData.gender}</span>{" "}
                      by the candidate.)
                    </p>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                  Date of Birth:
                </div>
                <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                  {userData.date_of_birth}
                  {userData.date_of_birth_old && (
                    <p>
                      (Date of birth changed from{" "}
                      <span className="text-danger">
                        {userData.date_of_birth_old}
                      </span>{" "}
                      to{" "}
                      <span className="text-danger">
                        {userData.date_of_birth}
                      </span>{" "}
                      by the candidate. )
                    </p>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                  Contact Number:
                </div>
                <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                  {userData.phone_number}
                  {userData.phone_number_old && (
                    <p>
                      (Phone Number changed from{" "}
                      <span className="text-danger">
                        {userData.phone_number_old}
                      </span>{" "}
                      to{" "}
                      <span className="text-danger">
                        {userData.phone_number}
                      </span>{" "}
                      by the candidate. )
                    </p>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                  Email Address:
                </div>
                <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                  {userData.email}

                  {userData.email_old && (
                    <p className="">
                      (Email changed from{" "}
                      <span className="text-danger">{userData.email_old}</span>{" "}
                      to <span className="text-danger">{userData.email}</span>{" "}
                      by the candidate.)
                    </p>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                  Marital Status:
                </div>
                <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                  {userData.marital_status}

                  {userData.marital_status_old && (
                    <p>
                      (Marital Status changed from{" "}
                      <span className="text-danger">
                        {userData.marital_status_old}
                      </span>{" "}
                      to{" "}
                      <span className="text-danger">
                        {userData.marital_status}
                      </span>{" "}
                      by the candidate. )
                    </p>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                  Physically Challenged:
                </div>
                <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                  {userData.physically_challenged}

                  {userData.physically_challenged_old && (
                    <p>
                      (Physically Challenged status changed from{" "}
                      <span className="text-danger">
                        {userData.physically_challenged_old}
                      </span>{" "}
                      to{" "}
                      <span className="text-danger">
                        {userData.physically_challenged}
                      </span>{" "}
                      by the candidate. )
                    </p>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                  Current Address:
                </div>
                <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                  {userData.current_address}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                  Permanent Address:
                </div>
                <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                  {userData.permanent_address}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                  Uploaded CV:
                </div>
                <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                  {userData.document_cv != "" ? (
                    <Link
                      href={userData.document_cv ? userData.document_cv : "#"}
                      style={{ color: "blue" }}
                    >
                      Document
                    </Link>
                  ) : (
                    "Not Available"
                  )}
                </div>
              </div>
            </form>
          </div>
          <hr className="hr" />

          {/* Education Details */}
          <div className="addInterviewProcessForm">
            <h3 className="SectionHeadingOnboardingDetails">
              Education Details
            </h3>
            <form action="" method="post">
              {educationData?.map((i, index) => (
                <React.Fragment key={index}>
                  <h3 className="SectionSubHeadingOnboardingDetails">
                    Education Details {index + 1}
                  </h3>

                  <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                      Qualification:
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                      {i.qualification_name}
                      {i.qualification_name_old && (
                        <p>
                          (Qualification changed from{" "}
                          <span className="text-danger">
                            {i.qualification_name_old}
                          </span>{" "}
                          to{" "}
                          <span className="text-danger">
                            {i.qualification_name}
                          </span>{" "}
                          by the candidate. )
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                      Course:
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                      {i.course}
                      {i.course_old && (
                        <p>
                          (Course changed from{" "}
                          <span className="text-danger">{i.course_old}</span> to{" "}
                          <span className="text-danger">{i.course}</span> by the
                          candidate.)
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                      School/College:
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                      {i.school_college}
                      {i.school_college_old && (
                        <p>
                          (School/College changed from{" "}
                          <span className="text-danger">
                            {i.school_college_old}
                          </span>{" "}
                          to{" "}
                          <span className="text-danger">
                            {i.school_college}
                          </span>{" "}
                          by the candidate. )
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                      City:
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                      {i.city}
                      {i.city_old && (
                        <p>
                          (City changed from{" "}
                          <span className="text-danger">{i.city_old}</span> to{" "}
                          <span className="text-danger">{i.city}</span> by the
                          candidate.)
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                      University Board:
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                      {i.university_board}
                      {i.university_board_old && (
                        <p>
                          (University changed from{" "}
                          <span className="text-danger">
                            {i.university_board_old}
                          </span>{" "}
                          to{" "}
                          <span className="text-danger">
                            {i.university_board}
                          </span>{" "}
                          by the candidate. )
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                      Passing Year:
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                      {i.passing_year}
                      {i.passing_year_old && (
                        <p>
                          (Passing year changed from{" "}
                          <span className="text-danger">
                            {i.passing_year_old}
                          </span>{" "}
                          to{" "}
                          <span className="text-danger">{i.passing_year}</span>{" "}
                          by the candidate.)
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                      Percentage:
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                      {i.percentage}%
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                      Supporting Documents:
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                      <Link
                        href={i.document ? i.document : "#"}
                        style={{ color: "blue" }}
                      >
                        Document
                      </Link>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </form>
          </div>
          <hr className="hr" />

          {/* Experience Details */}
          <div className="addInterviewProcessForm">
            <h3 className="SectionHeadingOnboardingDetails">
              Experience Details
            </h3>
            <form action="" method="post">
              {experienceData?.map((i, index) => (
                <React.Fragment key={index}>
                  <h3 className="SectionSubHeadingOnboardingDetails">
                    Experience Details {index + 1}
                  </h3>
                  <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                      Organisation Name:
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                      {i.organisation_name}
                      {i.organisation_name_old && (
                        <p>
                          (Organisation name changed from{" "}
                          <span className="text-danger">
                            {i.organisation_name_old}
                          </span>{" "}
                          to{" "}
                          <span className="text-danger">
                            {i.organisation_name}
                          </span>{" "}
                          by the candidate. )
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                      Designation Name:
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                      {i.designation_name}
                      {i.designation_name_old && (
                        <p>
                          (Designation name changed from{" "}
                          <span className="text-danger">
                            {i.designation_name_old}
                          </span>{" "}
                          to{" "}
                          <span className="text-danger">
                            {i.designation_name}
                          </span>{" "}
                          by the candidate. )
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                      Start date:
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                      {i.start_date}
                      {i.start_date_old && (
                        <p>
                          (Start date changed from{" "}
                          <span className="text-danger">
                            {i.start_date_old}
                          </span>{" "}
                          to <span className="text-danger">{i.start_date}</span>{" "}
                          by the candidate. )
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                      End date:
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                      {i.end_date}
                      {i.end_date_old && (
                        <p>
                          (End date changed from{" "}
                          <span className="text-danger">{i.end_date_old}</span>{" "}
                          to <span className="text-danger">{i.end_date}</span>{" "}
                          by the candidate.)
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                      Reason of leaving:
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                      {i.reason_of_leaving}
                      {i.reason_of_leaving_old && (
                        <p>
                          (Reason of leaving changed from{" "}
                          <span className="text-danger">
                            {i.reason_of_leaving_old}
                          </span>{" "}
                          to{" "}
                          <span className="text-danger">
                            {i.reason_of_leaving}
                          </span>{" "}
                          by the candidate. )
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                      Supporting Documents:
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                      <Link
                        href={i.documents ? i.documents : "#"}
                        style={{ color: "blue" }}
                      >
                        Document
                      </Link>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </form>
          </div>
          <hr className="hr" />

          {/* Other Documents */}
          <div className="addInterviewProcessForm">
            <h3 className="SectionHeadingOnboardingDetails">Other Documents</h3>
            <form action="" method="post">
              <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                  Unique Identification Proof:
                </div>
                <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                  <Link
                    href={
                      userData.identification ? userData.identification : "#"
                    }
                    style={{ color: "blue" }}
                  >
                    Identification Document
                  </Link>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                  Certificates:
                </div>
                <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                  {userData.certificate != "" ? (
                    <Link
                      href={userData.certificate ? userData.certificate : "#"}
                      style={{ color: "blue" }}
                    >
                      Certificate Document
                    </Link>
                  ) : (
                    "Not Available"
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                  Portfolio Link:
                </div>
                <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                  <Link
                    href={userData.portfolio ? userData.portfolio : "#"}
                    style={{ color: "blue" }}
                  >
                    Portfolio
                  </Link>
                </div>
              </div>
            </form>
          </div>
          <hr className="hr" />

          {/* Preferences */}
          <div className="addInterviewProcessForm">
            <h3 className="SectionHeadingOnboardingDetails">Preferences</h3>
            <form action="" method="post">
              {preferenceData.map((preference, index) => (
                <div className="row" key={index}>
                  <div className="col-lg-3 col-md-3 col-sm-3 Name--txt">
                    {preference.question}:
                  </div>
                  <div className="col-lg-9 col-md-9 col-sm-9 Name--txt">
                    {preference.answer}
                  </div>
                </div>
              ))}
            </form>
          </div>

          <hr className="hr" />
        </div>
        <AdminFooter />
      </StaffLayout>
    </>
  );
};

export default Page;
