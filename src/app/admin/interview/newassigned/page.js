"use client";
import React from "react";
import Link from "next/link";
import "../../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useState, useEffect } from "react";
import AdminFooter from "../../Components/AdminFooter/AdminFooter";
import AdminLayout from "../../AdminLayout";
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
import ProfileCard from "../../Components/ProfileCard/ProfileCard";

const Page = () => {
  const router = useRouter();
  const slideClose = () => setslider(false);

  const [slider, setslider] = useState(false);

  const [userData, setUserData] = useState([]);

  const [modalData, setModalData] = useState();

  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");
  const userId = Cookies.get("adminId");

  // console.log(userId,"userid");

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
            // key: ApiKey,
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setUserData(response.data.response);
      // console.log(response.candidateDetails)

      console.log();
    } catch (error) {
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
          title: "Feedback added successfully",
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

  return (
    <>
      <AdminLayout>
        {loading && <div className="loader-container"></div>}
        <div
          className=" backgroundColor adminChangeUsername"
          style={{ minHeight: "80vh" }}
        >
          <div className="breadCumb1" role="">
            <div className="flex gap-3 items-center">
              <Link underline="hover" color="inherit" href="/admin/dashboard">
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
              </form>
            </div>

            <div className="row">
              {userData.map((i) => {
                return (
                  <>
                    <div className="col-md-4 col-lg-4 col-xxl-4">
                      <ProfileCard
                        candidate_first_name={i.candidateDetails.first_name}
                        candidate_last_name={i.candidateDetails.last_name}
                        // candidate_job_name={i.candidateDetails.job_name}
                        candidate_interview_schedule={i.interview_date}
                        candidate_email={i.candidateDetails.email_address}
                        candidate_contact={i.candidateDetails.contact}
                        candidate_id={i.candidate_id}
                        candidate_profile_image={
                          i.candidateDetails.profile_image
                        }
                        candidate_date_of_birth={
                          i.candidateDetails.date_of_birth
                        }
                        candidate_gender={i.candidateDetails.gender}
                        candidate_marital_status={
                          i.candidateDetails.martial_status
                        }
                        candidate_address={
                          i.candidateDetails.address
                            ? i.candidateDetails.address
                            : "Not Available"
                        }
                        candidate_physically_challenged={
                          i.candidateDetails.physically_challenged
                            ? i.candidateDetails.physically_challenged
                            : "Not Available"
                        }
                        candidateEducation={
                          i.candidateDetails.education
                            ? i.candidateDetails.education
                            : "Not Available"
                        }
                        candidateExperience={
                          i.candidateDetails.experience
                            ? i.candidateDetails.experience
                            : "Not Available"
                        } //
                      />
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </div>
        <AdminFooter />
      </AdminLayout>
    </>
  );
};

export default Page;
