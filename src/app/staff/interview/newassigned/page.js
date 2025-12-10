"use client";
import React from "react";
import Link from "next/link";
import "../../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useState, useEffect } from "react";
import AdminFooter from "../../../admin/Components/AdminFooter/AdminFooter";
import StaffLayout from "../../StaffLayout";
import Cookies from "js-cookie";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Image from "next/image";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import ProfileCard from "../../../admin/Components/ProfileCard/ProfileCard";

const Page = () => {
  const router = useRouter();
  const slideClose = () => setslider(false);
  const [slider, setslider] = useState(false);
  const [userData, setUserData] = useState([]);
  const [modalData, setModalData] = useState();
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("tokenStaff");
  const userId = Cookies.get("staffId");
  const [mdShow, setMdShow] = useState(false);
  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);
  const handleOpen = (eachData) => {
    console.log(eachData, "here");
    setslider(true);
    setModalData(eachData);
  };

  const getData = async (userId) => {
    // console.log(id);
    try {
      
      const response = await axios.post(
        BaseAPI + `/admin/candidate/assignedinterviewstouser/${userId}`,

        null,
        {
          headers: {
            "Content-Type": "application/json",
            
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setLoading(false);
      setUserData(response.data.response.interviewAssignedData);
      // console.log(response.candidateDetails)


      console.log();
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const [candidateFeedbackData, setCandidateFeedbackData] = useState({
    candidate_id: "",
    user_assigned: userId,
    feedback: "",
  });

  const handleFeedbackModel = (eachData) => {
    // console.log(eachData, "here");
    setLgShow(true);

    setCandidateFeedbackData((prev) => ({
      ...prev,
      candidate_id: eachData.candidate_id,
    }));
  };

  const addFeedbacktoCandidate = async () => {
    console.log(setCandidateFeedbackData.candidate_id, "candidate_id");
    try {
      const response = await axios.post(
        BaseAPI + "/admin/candidate/addcandidatefeedback",
        candidateFeedbackData,
        {
          headers: {
            "Content-Type": "application/json",

            Authorization: "Bearer" + " " + token,
          },
        }
      );
      if (response.data.status === 200) {
        Swal.fire({
          title: "Comment added successfully",
          icon: "success",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };



  const [searchKeyword, setSearchKeyword] = useState("");
  const [skills, setSkills] = useState(null);

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    // Filter skills based on the keyword
    const filtered = userData.filter((userData) =>
      userData.candidateDetails.toLowerCase().includes(keyword.toLowerCase())
    );
    setSkills(filtered);
    // console.log(filtered);
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearchKeyword("");
    setSkills(null);
  };
  useEffect(() => {
    getData(userId);
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleShowModal = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  const getData2 =(id) => {
    console.log(id, "From child")
  }

  return (
    <>
      <StaffLayout>
        {loading && <div className="loader-container"></div>}
        <div
          className=" backgroundColor adminChangeUsername"
          style={{ minHeight: "80vh" }}
        >
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
                <i class="fa-solid fa-clipboard-question"></i>
                <span>Interview Assigned</span>
              </div>
            </div>
          </div>
          <div className="">
            <div className="profilelogo">
              <h2>Interviews Assigned</h2>
            </div>
            <div className="serachKeyItems  bg-white">
              <form action="">
                {userData.length > 0 && (
                  <>
                  <p>Search Candidate by Name, Email, Contact</p>
                  <div className="flex flex-col md:flex-row">
                    <input
                      type="text"
                      className="formm-control  w-100 mb-2 md:mb-0 md:mr-2"
                      placeholder="Search By Keyword"
                      value={searchKeyword}
                      onChange={handleSearch}
                    />
                    <div className="flex flex-col md:flex-row md:h-11 items-center">
                      {/* <button
                        className="btn btn-serach md:mb-0 md:mr-2 "
                 
                      >
                        SEARCH
                      </button> */}
                      <button
                        className="btn btn-clearFilters"
                        onClick={handleClearFilters}
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                  </>
                )}
                
              </form>
            </div>

            <div className="row">
              {userData.length > 0 ? (
                <>
                  {userData.map((i, index) => {
                    return (
                      <>
                        <div className="col-md-4 col-lg-4 col-xxl-4" key={index}>
                          <ProfileCard
                            first_name={i.candidateDetails.first_name}
                            last_name={i.candidateDetails.last_name}
                            name={i.candidateDetails.first_name + " " + i.candidateDetails.last_name}
                            // candidate_job_name={i.candidateDetails.job_name}
                            candidate_interview_schedule={i.interview_date}
                            email={i.candidateDetails.email_address}
                            phone={i.candidateDetails.contact}
                            candidate_id={i.candidateDetails.id}
                            profile_image={
                              i.candidateDetails.profile_image
                            }
                            cv_document={
                              i.candidateDetails.document_cv
                            }
                            date_of_birth={
                              i.candidateDetails.date_of_birth
                            }
                            gender={i.candidateDetails.gender}
                            martial_status={
                              i.candidateDetails.martial_status
                            }
                            address={
                              i.candidateDetails.address
                                ? i.candidateDetails.address
                                : "Not Available"
                            }
                            physically_challenged={
                              i.candidateDetails.physically_challenged
                                ? i.candidateDetails.physically_challenged
                                : "Not Available"
                            }
                            education={
                              i.candidateDetails.education
                                ? i.candidateDetails.education
                                : "Not Available"
                            }
                            experience={
                              i.candidateDetails.experience
                                ? i.candidateDetails.experience
                                : "Not Available"
                            } 
                            additional_data={
                              i.candidateDetails.additional_data
                            }
                            cover_letter_title={
                              i.candidateDetails.cover_letter_title ? i.candidateDetails.cover_letter_title : "Not Available"
                            }
                            cover_letter_description={
                              i.candidateDetails.cover_letter_description ? i.candidateDetails.cover_letter_description : "Not Available"
                            }
                            is_interview_scheduled={i.is_interview_scheduled}
                            candidateInterviewDetails={i.candidateInterviewDetails}
                            getData={() => getData(userId)}
                            staff_id={userId}
                            getData2={() => getData2(userId)}
                          />
                        </div>
                      </>
                    );
                  })}
                </>
              ) : (
                <div className="noDataAvailable">
                  {" "}
                  <p>No interviews assigned</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <AdminFooter />
      </StaffLayout>
    </>
  );
};

export default Page;