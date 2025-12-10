"use client";
import React from "react";
import Link from "next/link";
import "../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useState, useEffect, useRef } from "react";
import AdminFooter from "../../admin/Components/AdminFooter/AdminFooter";
import StaffLayout from "../StaffLayout";
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
import InterviewProgress from "@/app/admin/Components/InterviewProgress/InterviewProgress";
import CustomizedTimeline from "@/app/admin/Components/Timeline/Timeline";
import HTMLReactParser from "html-react-parser";
import CandidateModal from "@/app/Components/CandidateModal/CandidateModal";
import JobModal from "@/app/Components/JobModal/JobModal";

const Page = () => {
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [showInterviewJourneyModal, setShowInterviewJourneyModal] =
    useState(false);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [interviewJourneyRecord, setInterviewJourneyRecord] = useState(null);
  const [candidateName, setCandidateName] = useState("");
  const token = Cookies.get("tokenStaff");
  const router = useRouter();
  const [emailTemplateId, setEmailTemplateId] = useState("");

  const handleOpen = (eachData) => {
    setSelectedRecord(eachData);
    handleShowModal(eachData);
  };

  const [jobModal, setJobModal] = useState(false);
  const [JobModalData, setJobModalData] = useState({});
  const handleJobOpen = (eachData) => {
    setJobModal(true);
    setJobModalData(eachData);
  };

  const handleCloseJobModal = () => {
    setJobModal(false);
    setJobModalData(null);
  };

  const handleOpenInterviewJourney = (eachData, firstName, lastName) => {
    setCandidateName(firstName + " " + lastName);
    setInterviewJourneyRecord(eachData);
    handleShowInterviewJourneyModal(eachData);
  };

  const [userAccess, setUserAccess] = useState({});

  useEffect(() => {
    const access = Cookies.get("access");

    if (typeof access !== null || access !== "" || access !== undefined) {
      setUserAccess(JSON.parse(access));
    } else {
      setUserAccess({});
    }
  }, []);

  const [expiryData, setExpiryData] = useState({
    candidate_id: "",
    onboarding_expiry: "",
    onboarding_expiry_value: "",
  });

  const [errors, setErrors] = useState({
    onboarding_expiry: "",
    onboarding_expiry_value: "",
  });

  const getData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + "/admin/candidates/selectedcandidates",
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setLoading(false);
      if (response.data.status === 200) {
        setUserData(response.data.response);
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/staff/dashboard");
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name !== "onboarding_expiry" && name !== "onboarding_expiry_value") {
      setUserData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setExpiryData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    const filtered = userData.filter(
      (userData) =>
        userData.first_name.toLowerCase().includes(keyword.toLowerCase()) ||
        userData.last_name.toLowerCase().includes(keyword.toLowerCase()) ||
        userData.email_address.toLowerCase().includes(keyword.toLowerCase()) ||
        userData.jobAppliedFor.toLowerCase().includes(keyword.toLowerCase()) ||
        userData.applied_date.toLowerCase().includes(keyword)
    );
    setFilteredData(filtered);
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearchKeyword("");
    setFilteredData();
  };
  useEffect(() => {
    getData();
  }, []);

  const handleShowModal = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  const handleShowInterviewJourneyModal = (record) => {
    setInterviewJourneyRecord(record);
    setShowInterviewJourneyModal(true);
  };

  const handleCloseInterviewJourneyModal = () => {
    setShowInterviewJourneyModal(false);
    setInterviewJourneyRecord(null);
  };

  const handleShowExpiryModal = (id) => {
    setShowExpiryModal(true);
    setSelectedRecord(id);
  };

  const handleCloseExpiryModal = () => {
    setShowExpiryModal(false);
    setSelectedRecord(null);
  };

  const handleOfferLetterSetup = (job_id, candidateId) => {
    Cookies.set("job_id", job_id);
    router.push(`/staff/selected-candidates/setup-offer-letter/${candidateId}`);
  };

  const [candidateId, setCandidateId] = useState("");

  const sendOnboardingLink = async (candidate_id) => {
    if (
      expiryData.onboarding_expiry === "" ||
      expiryData.onboarding_expiry === null
    ) {
      setErrors((prev) => ({
        ...prev,
        onboarding_expiry: "Please enter expiry type",
      }));
      return;
    }
    if (expiryData.onboarding_expiry_value === "") {
      setErrors((prev) => ({
        ...prev,
        onboarding_expiry_value: "Please enter expiry date",
      }));
      return;
    }

    try {
      const confirmationResult = await Swal.fire({
        title: "Do you want to send the onboarding link?",
        text: "This will send the onboarding link to the candidate via Email.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (confirmationResult.isConfirmed) {
        console.log(candidate_id, "ha");
        console.log(candidateId, "yes");
        setShowExpiryModal(false);
        setLoading(true);
        const response = await axios.post(
          BaseAPI + "/admin/candidates/sendonboardingform",
          {
            candidate_id: candidateId,
            staff_id: Cookies.get("staffId"),
            user_type: "staff",
          },
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
            title: "Onboarding Email sent successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          getData();
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewModalData, setPreviewModalData] = useState(false);

  const showOnboardingEmailPreview = async () => {
    try {
      const response = await axios.post(
        BaseAPI +
          "/admin/emailtemplate/onboarding-form/getEmailTemplatePreview/" +
          emailTemplateId,
        {
          candidate_id: candidateId,
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

  // Note functionailty
  const [ShowNote, setShowNote] = useState(false);
  const [notes, setNotes] = useState();
  const [viewNote, setViewNote] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);

  const [noteForm, setNoteForm] = useState({
    note_title: "",
    note_description: "",
    candidate_id: "",
    share_with_staff: false,
  });
  const [noteFormErrors, setNoteFormErrors] = useState({
    note_title: "",
    note_description: "",
  });
  const [candidateData, setcandidateData] = useState({
    candidate_name: "",
    candidate_id: "",
  });
  const fetchNotes = async (id, first_name, last_name) => {
    try {
      setLoading(true);
      setcandidateData({
        ...candidateData,
        candidate_name: first_name + " " + last_name,
        candidate_id: id,
      });
      const response = await axios.post(
        `${BaseAPI}/admin/user/notelisting`,
        { user_type: "employer", candidate_id: id },
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      setLgShow1(true);
      setNotes(response.data.response.notes);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleView = (note) => {
    setSelectedNote(note);
    // console.log(note, "note");

    setViewNote(true);
    // setShowNote(true);
    setLgShow1(false);
  };

  const handleEdit = (note) => {
    // console.log(note, "note");
    setNoteForm(note);
    setIsEdit(true);
    setShowNote(true);
    setLgShow1(false);
  };

  const handleDelete = async (noteId) => {
    try {
      const response = await axios.post(
        BaseAPI + `/admin/user/notedelete/${noteId}`,
        null,
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      } else {
        console.error("Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleAdd = () => {
    setNoteForm({ note_title: "", note_description: "" });
    setIsEdit(false);

    // Close other modals
    setLgShow1(false);
    setSelectedNote(null);

    setShowNote(true);
  };

  const handleSave = async (id) => {
    const newErrors = {};
    if (noteForm.note_title === "") {
      newErrors.note_title = "Note title is required";
    }
    if (noteForm.note_description === "") {
      newErrors.note_description = "Note description is required";
    }
    setNoteFormErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setShowNote(false);

      if (isEdit) {
        try {
          const response = await axios.post(
            BaseAPI + `/admin/user/noteedit/${noteForm.id}`,
            { ...noteForm, candidate_id: candidateData.candidate_id },
            {
              headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setLgShow1(true);
          // fetchNotes(noteForm.candidate_id, candidateName);
          if (response.data.status === 200) {
            const updatedNote = response.data.response;
            setNotes((prevNotes) =>
              prevNotes.map((note) =>
                note.id === updatedNote.id ? { ...note, ...updatedNote } : note
              )
            );
            setShowNote(false); // Close the modal
          } else {
            console.error("Failed to update note");
          }
        } catch (error) {
          console.error("Error updating note:", error);
        }
      } else {
        try {
          setLoading(true);
          const response = await axios.post(
            BaseAPI + "/admin/user/noteadd",
            { ...noteForm, candidate_id: candidateData.candidate_id },
            {
              headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          ); // Assuming this is the endpoint for creating a new note
          // fetchNotes(noteForm.candidate_id, candidateName);
          setLgShow1(true);
          if (response.data.status === 200) {
            setLoading(false);

            const newNote = response.data.response;
            setNotes((prevNotes) => [...prevNotes, newNote]);
            setShowNote(false); // Close the modal
          } else {
            setLoading(false);
            console.error("Failed to add note");
          }
        } catch (error) {
          setLoading(false);
          console.error("Error adding note:", error);
        }
      }
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
      flex: 1,
      headerClassName: "redText",
      cellClassName: "redBorder",
      renderCell: (params) => (
        <>
          <div
            className="text-primary"
            onClick={(e) => {
              e.stopPropagation();
              handleOpen(params.row);
            }}
            style={{ cursor: "pointer" }}
          >
            {params.row.name}
          </div>
        </>
      ),
    },
    {
      field: "email_address",
      headerName: "Email",
      width: 300,
      flex: 1,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },

    {
      field: "jobAppliedFor",
      headerName: "Job Name",
      width: 130,
      flex: 1,
      headerClassName: "redText",
      cellClassName: "redBorder",
      renderCell: (params) => (
        <>
          <div
            className="text-primary"
            onClick={(e) => {
              e.stopPropagation();
              handleJobOpen(params.row.jobData);
            }}
            style={{ cursor: "pointer" }}
          >
            {params.row.jobAppliedFor}
          </div>
        </>
      ),
    },

    {
      field: "appliedDate",
      headerName: "Applied Date",
      width: 130,
      flex: 1,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },

    {
      field: "status",
      headerName: "Change Status",
      width: 200,
      flex: 1,
      headerClassName: "redText",
      cellClassName: "redBorder",
      renderCell: (params) => {
        return params.row.offer_letter_status === 1 ? (
          <>
            <div style={{ color: "green", fontWeight: "bold" }}>
              Offer letter sent!{" "}
              <i class="fa-solid fa-circle-check green-icon"></i>
            </div>
          </>
        ) : (
          "Offer letter Not sent"
        );
      },
    },

    {
      field: "action",
      headerName: "Action",
      headerClassName: "redText",
      cellClassName: "redBorder",
      width: 243,
      flex: 1,
      renderCell: (params) => (
        <strong>
          <div className="process__actionnn" style={{ margin: "10px 0" }}>
            <Button
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen(params.row);
              }}
              className="btn btn-info btn-smmm"
              title="View Candidate Details"
            >
              <i className="fa fa-eye"></i>
            </Button>
            {/* Note button */}
            <button
              className="btn btn-primary btn-group"
              title={`Notes for ${params.row.first_name} ${params.row.last_name}`}
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
                // Open the modal or trigger UI for notes
                fetchNotes(
                  params.row.id,
                  params.row.firstName,
                  params.row.lastName
                );
              }}
            >
              <i className="fas fa-sticky-note"></i>
            </button>
            {params.row.offer_letter_accepted === 1 && (
              <Button
                variant="primary"
                className="btn btn-success btn-smmm"
                title="Candidate has accepted the offer letter"
              >
                <i className="fa-solid fa-check green-icon"></i>
              </Button>
            )}
            {params.row.offer_letter_accepted === 0 && (
              <Button
                variant="primary"
                className="btn btn-danger btn-smmm"
                title="Candidate has declined the offer letter"
              >
                <i className="fa-solid fa-circle-xmark red-icon"></i>{" "}
              </Button>
            )}
            <Button
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenInterviewJourney(
                  params.row.interview_journey,
                  params.row.firstName,
                  params.row.lastName
                );
              }}
              className="btn btn-success btn-smmm"
              title="View Candidate Interview Journey Details"
            >
              <i className="fa-solid fa-route"></i>
            </Button>

            {params.row.offer_letter_status !== 1 &&
              params.row.draft_status === null &&
              userAccess[15]?.Offer_Letter_Creation === 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOfferLetterSetup(
                      params.row.job_id,
                      params.row.candidateId
                    );
                  }}
                  className="btn  btn-success btn-smmm"
                  title="Setup offer letter"
                >
                  <i class="fa-solid fa-square-pen"></i>
                </button>
              )}
            {params.row.offer_letter_status === null &&
              params.row.draft_status === "1" && (
                <button
                  onClick={(e) => {
                    handleOfferLetterSetup(
                      params.row.job_id,
                      params.row.candidateId
                    );
                    e.stopPropagation();
                  }}
                  className="btn  btn-success btn-smmm"
                  title="Offer letter draft"
                >
                  <i class="fa-regular fa-file-lines"></i>
                </button>
              )}
            {params.row.offer_letter_status === 1 &&
              params.row.on_boarding_status !== 1 &&
              userAccess[15]?.Candidate_Onboarding === 1 && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents event bubbling
                    handleShowExpiryModal(params.row.candidateId);
                    console.log(params.row.candidateId);
                    setCandidateId(params.row.candidateId);
                    setEmailTemplateId(params.row.email_template_id);
                  }}
                  className="btn btn-warning btn-smmm"
                  title="Send onboarding link"
                >
                  <i
                    class="fa-solid fa-handshake"
                    style={{ color: "white" }}
                  ></i>
                </Button>
              )}

            {params.row.on_boarding_completion_status	 === "1" && (
              <Link
                href={`/staff/selected-candidates/show-onboarding-details/${params.row.candidateId}`}
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="btn btn-danger btn-smmm"
                title="View Candidate Onboarding Details"
              >
                <i class="fa-solid fa-user-check"></i>
              </Link>
            )}
          </div>
        </strong>
      ),
    },
  ];

  const rows =
    filteredData.length > 0
      ? filteredData.map((i) => ({
          id: i.id, // Matches column field 'id
          address: i.address,
          firstName: i.first_name,
          lastName: i.last_name,
          name: i.first_name + " " + i.last_name,

          appliedDate: i.applied_date,
          candidateId: i.candidate_id,
          contact: i.contact,
          phone: i.contact,
          cvDocument: i.cv_document,
          date_of_birth: i.date_of_birth,
          education: i.education,
          email_address: i.email_address,
          email: i.email_address,
          experience: i.experience,
          offer_letter_status: i.offer_letter_status,
          on_boarding_status: i.on_boarding_status,
          gender: i.gender,
          id: i.id,
          jobAppliedFor: i.jobAppliedFor,
          job_id: i.job_id,

          marital_status: i.martial_status,
          martial_status: i.martial_status,
          middle_name: i.middle_name,
          physically_challenged: i.physically_challenged,
          profile_image: i.profile_image,
          draft_status: i.draft_status,
          cv_document: i.cv_document,
          interview_journey: i.interview_journey,
          offer_letter_accepted: i.offer_letter_accepted,
          email_template_id: i.email_template_id,
          jobData: i.jobData,
          cover_letter_title: i.cover_letter_title,
          cover_letter_description: i.cover_letter_description,
          additional_data: i.additional_data,
          on_boarding_completion_status	: i.on_boarding_completion_status
        }))
      : userData?.map((i) => ({
          id: i.id, // Matches column field 'id
          address: i.address,
          firstName: i.first_name,
          lastName: i.last_name,
          name: i.first_name + " " + i.last_name,

          appliedDate: i.applied_date,
          candidateId: i.candidate_id,
          contact: i.contact,
          phone: i.contact,
          cvDocument: i.cv_document,
          date_of_birth: i.date_of_birth,
          education: i.education,
          email_address: i.email_address,
          email: i.email_address,
          experience: i.experience,
          offer_letter_status: i.offer_letter_status,
          on_boarding_status: i.on_boarding_status,
          gender: i.gender,
          id: i.id,
          jobAppliedFor: i.jobAppliedFor,
          job_id: i.job_id,

          marital_status: i.martial_status,
          martial_status: i.martial_status,
          middle_name: i.middle_name,
          physically_challenged: i.physically_challenged,
          profile_image: i.profile_image,
          draft_status: i.draft_status,
          cv_document: i.cv_document,
          interview_journey: i.interview_journey,
          offer_letter_accepted: i.offer_letter_accepted,
          email_template_id: i.email_template_id,
          jobData: i.jobData,
          cover_letter_title: i.cover_letter_title,
          cover_letter_description: i.cover_letter_description,
          additional_data: i.additional_data,
          on_boarding_completion_status: i.on_boarding_completion_status
        }));
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
                <i class="fa-solid fa-user-check"></i>
                <span>Selected Candidates List</span>
              </div>
            </div>
          </div>
          <div className="">
            
            <div className="serachKeyItems  bg-white">
              <form action="">
                <p>Search Candidate by Name, Email</p>
                <div className="flex flex-col md:flex-row">
                  <input
                    type="text"
                    className="formm-control  w-100 mb-2 md:mb-0 md:mr-2"
                    placeholder="Search By Keyword"
                    value={searchKeyword}
                    onChange={handleSearch}
                  />
                  <div className="flex flex-col md:flex-row md:h-11 items-center">
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

            <div className="interviewPreviewTable TableScroll">
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
                  checkboxSelection
                />
              </div>

              {/* Candidate Modal */}
              {showModal && (
                <CandidateModal
                  onClose={() => setShowModal(false)}
                  profileData={selectedRecord}
                />
              )}

              {/* Job Details */}
              {jobModal && (
                <JobModal
                  onClose={() => setJobModal(false)}
                  jobData={JobModalData}
                />
              )}

              <Modal show={showExpiryModal} onHide={handleCloseExpiryModal}>
                <Modal.Header closeButton className="bg-red-500 text-white">
                  <Modal.Title>Set expiry time for onboarding link</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedRecord && (
                    <div>
                      <div className="dDrt mb-3">
                        <span> Set Expiry Time : </span>
                        <select
                          name="onboarding_expiry"
                          className="form-control"
                          value={expiryData.onboarding_expiry}
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
                      <div className="dDrt mb-3">
                        <span>Set Expiry Value: </span>
                        <input
                          type="text"
                          name="onboarding_expiry_value"
                          value={expiryData.onboarding_expiry_value}
                          className="form-control"
                          onChange={handleChange}
                        />
                        {errors.onboarding_expiry_value && (
                          <div className="text-danger">
                            {errors.onboarding_expiry_value}
                          </div>
                        )}
                      </div>
                      <div className="dDrt onboardingBox">
                        {" "}
                        <button
                          className=""
                          onClick={() => sendOnboardingLink(selectedRecord.id)}
                          style={{
                            color: "white",
                            borderRadius: "3px",
                            border: "1px solid hsl(5, 86%, 56%)",
                            backgroundColor: "#ef4030",
                            padding: "2px 12px",
                            marginRight: "10px",
                          }}
                        >
                          Send Onboarding Link
                        </button>
                        <button
                          className=""
                          onClick={() =>
                            showOnboardingEmailPreview(selectedRecord.id)
                          }
                          style={{
                            color: "white",
                            borderRadius: "3px",
                            border: "1px solid hsl(5, 86%, 56%)",
                            backgroundColor: "#ef4030",
                            padding: "2px 12px",
                            marginRight: "10px",
                          }}
                        >
                          Show Email Preview
                        </button>
                      </div>
                    </div>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseExpiryModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal
                size="lg"
                show={showInterviewJourneyModal}
                onHide={() => setShowInterviewJourneyModal(false)}
                aria-labelledby="interview status"
              >
                <Modal.Header closeButton className="bg-red-500 text-white">
                  <Modal.Title id="interview status ">
                    Interview Journey of {candidateName}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {interviewJourneyRecord?.map((i, index) => {
                    return (
                      <>
                          <div className="dDrt modalSubHeader">
                            <p className="!text-[25px] mb-[10px]">
                              Interview {index + 1}
                            </p>
                          </div>
                          <div className="dDrt">
                            <span>Interview Process Name: </span>
                            {i.process_name
                              ? i.process_name
                              : "Process name not found"}
                          </div>
                          <div className="dDrt">
                            <span>Interview Date : </span>
                            {i.interview_date}
                          </div>
                          <div className="dDrt">
                            <span>Interview Time : </span>
                            {i.start_time}
                          </div>
                          <div className="dDrt">
                            <span>Interview Type : </span>
                            {i.interview_type}
                          </div>
                          <div className="dDrt">
                            <span>Interview Duration : </span>
                            {i.duration}{" "}
                            {i.duration === "1" ? "Hour" : "Minutes"}
                          </div>
                          <div className="dDrt">
                            <span>Comment : </span>
                            {i.comment}
                          </div>

                          {i.interview_cancelation_status === "1" && (
                            <>
                              <div className="dDrt">
                                <span>Interview Status : </span>
                                <span className="text-danger fw-bold">
                                  Cancelled
                                </span>
                              </div>
                              <div className="dDrt">
                                <span>Interview Cancellation Reason : </span>
                                {i.interview_cancelation_reason}
                              </div>
                            </>
                          )}

                          <div className="dDrt">
                            <span>Interview Assigned To : </span>
                            {i.staff_name}
                          </div>
                          <div className="dDrt">
                            <span>Interview Assigned By : </span>
                            {i.employer_name}
                          </div>
                          <div className="dDrt">
                            <span>Interview Completion Marked By : </span>
                            {i.completion_staff_name}
                          </div>
                          <div className="dDrt">
                            <span>Interview Feedback : </span>
                            {i.feedback_and_recommendations ? i.feedback_and_recommendations : "No feedback available"}
                          </div>
                          {/* <div className="dDart" style={{ marginLeft: "20px" }}>
                          ------------------
                        </div> */}
                        
                      </>
                    );
                  })}
                 
                </Modal.Body>
              </Modal>
              <Modal
                size="lg"
                show={showPreviewModal}
                onHide={() => setShowPreviewModal(false)}
                aria-labelledby="example-modal-sizes-title-lg"
              >
                <Modal.Header closeButton className="Process_assigned">
                  <Modal.Title id="example-modal-sizes-title-lg">
                    Onboarding Form Email Preview
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {previewModalData && HTMLReactParser(previewModalData)}
                </Modal.Body>
              </Modal>

              {/* Note modals */}
              <Modal
                size="lg"
                show={lgShow1}
                onHide={() => {
                  setLgShow1(false);
                  setNotes([]);
                }}
                aria-labelledby="example-modal-sizes-title-lg"
              >
                <Modal.Header closeButton className="Process_assigned">
                  <Modal.Title id="example-modal-sizes-title-lg">
                    Notes for {candidateData.candidate_name}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="notes-container">
                    <table
                      className="notes-table"
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        margin: "20px 0",
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            backgroundColor: "#f4f4f4",
                            textAlign: "left",
                          }}
                        >
                          <th
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                            }}
                          >
                            Title
                          </th>
                          <th
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                            }}
                          >
                            Author
                          </th>
                          <th
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                            }}
                          >
                            Shared with staff?
                          </th>
                          <th
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                            }}
                          >
                            Created On
                          </th>
                          <th
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                              textAlign: "center",
                            }}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {notes?.map((note) => (
                          <tr
                            key={note.id}
                            style={{ borderBottom: "1px solid #ddd" }}
                          >
                            <td style={{ padding: "10px" }}>
                              {note.note_title}
                            </td>
                            <td style={{ padding: "10px" }}>
                              {note.user_type}
                            </td>
                            <td style={{ padding: "10px" }}>
                              {note.share_with_staff === "1" ? "Yes" : "No"}
                            </td>
                            <td style={{ padding: "10px" }}>
                              {note.created_date} at {note.created_time}
                            </td>
                            <td
                              style={{ padding: "10px", textAlign: "center" }}
                            >
                              <Button
                                variant="contained"
                                color="primary"
                                className="btn btn-success"
                                onClick={() => handleView(note)}
                                style={{ marginRight: "5px" }}
                              >
                                <i className="fas fa-eye"></i>
                              </Button>
                              <Button
                                title="Edit"
                                className="btn btn-warning"
                                onClick={() => handleEdit(note)}
                                style={{ marginRight: "5px" }}
                              >
                                <i className="fas fa-pen"></i>
                              </Button>
                              <Button
                                variant="contained"
                                color="secondary"
                                title="Delete"
                                className="btn btn-danger"
                                onClick={() => handleDelete(note.id)}
                              >
                                <i className="fa-solid fa-trash-can"></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAdd}
                      className="mt-3"
                      style={{ display: "block", margin: "20px auto" }}
                    >
                      Add Note
                    </Button>
                  </div>
                </Modal.Body>
              </Modal>
              {/* Code for notes section */}
              {/* Code for viewing note */}
              <Modal
                size="md"
                show={viewNote} // Boolean to control the visibility of the modal
                onHide={() => {
                  setViewNote(false);
                  setLgShow1(false);
                }} // Function to close the modal
                aria-labelledby="view-note-modal-title"
              >
                <Modal.Header closeButton className="Process_assigned">
                  <Modal.Title id="example-modal-sizes-title-lg">
                    {selectedNote?.note_title}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedNote ? (
                    <>
                      <div
                        className="note-details"
                        style={{
                          padding: "20px",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          backgroundColor: "#ffffff",
                          maxWidth: "600px",
                          margin: "20px auto",
                        }}
                      >
                        <h5
                          style={{
                            margin: "0 0 15px",
                            fontWeight: "600",
                            color: "#333",
                          }}
                        >
                          Note Details
                        </h5>

                        <div style={{ display: "flex", marginBottom: "15px" }}>
                          <h6
                            style={{ width: "120px", margin: 0, color: "#555" }}
                          >
                            Note By:
                          </h6>
                          <p
                            style={{
                              margin: 0,
                              color: "#333",
                              fontWeight: "500",
                            }}
                          >
                            {selectedNote.user_type}
                          </p>
                        </div>
                        <div style={{ display: "flex", marginBottom: "15px" }}>
                          <h6
                            style={{ width: "120px", margin: 0, color: "#555" }}
                          >
                            Created On:
                          </h6>
                          <p
                            style={{
                              margin: 0,
                              color: "#333",
                              fontWeight: "500",
                            }}
                          >
                            {selectedNote.created_date} at{" "}
                            {selectedNote.created_time}
                          </p>
                        </div>
                        <div
                          style={{ display: "flex", alignItems: "flex-start" }}
                        >
                          <h6
                            style={{ width: "120px", margin: 0, color: "#555" }}
                          >
                            Description:
                          </h6>
                          <p
                            style={{
                              margin: 0,
                              color: "#333",
                              lineHeight: "1.5",
                            }}
                          >
                            {selectedNote.note_description}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p>No note selected.</p>
                  )}
                </Modal.Body>
              </Modal>

              {/* Modal for Adding or Editing */}
              <Modal
                size="lg"
                show={ShowNote}
                onHide={() => {
                  setShowNote(false);
                  setLgShow1(true);
                }}
                aria-labelledby="example-modal-sizes-title-lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title id="example-modal-sizes-title-lg">
                    {isEdit ? "Edit Note" : "Add Note"}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {isEdit ? (
                    <form>
                      <div className="mb-3">
                        <label htmlFor="note-title">Title</label>
                        <input
                          type="text"
                          id="note-title"
                          name="note_title"
                          className="form-control"
                          value={noteForm.note_title}
                          onChange={(e) =>
                            setNoteForm({
                              ...noteForm,
                              note_title: e.target.value,
                            })
                          }
                        />
                        {noteFormErrors.note_title && (
                          <p className="text-danger">
                            {noteFormErrors.note_title}
                          </p>
                        )}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="note-description">Description</label>
                        <textarea
                          id="note-description"
                          className="form-control"
                          rows="3"
                          value={noteForm.note_description}
                          onChange={(e) =>
                            setNoteForm({
                              ...noteForm,
                              note_description: e.target.value,
                            })
                          }
                        ></textarea>
                        {noteFormErrors.note_description && (
                          <p className="text-danger">
                            {noteFormErrors.note_description}
                          </p>
                        )}
                      </div>
                      {/* Checkbox for sharing with staff */}
                      <div className="mb-3 form-check">
                        <input
                          type="checkbox"
                          id="share-with-staff"
                          className="form-check-input"
                          checked={noteForm.share_with_staff === "1"} // Convert "1" to true and "0" to false
                          onChange={(e) =>
                            setNoteForm({
                              ...noteForm,
                              share_with_staff: e.target.checked ? "1" : "0", // Store as "1" or "0"
                            })
                          }
                        />
                        <label
                          htmlFor="share-with-staff"
                          className="form-check-label"
                        >
                          Share with Staff
                        </label>
                      </div>
                      <Button variant="primary" onClick={() => handleSave()}>
                        Save
                      </Button>
                    </form>
                  ) : (
                    <>
                      <form>
                        <div className="mb-3">
                          <label htmlFor="note-title">Title</label>
                          <input
                            type="text"
                            id="note-title"
                            name="note_title"
                            className="form-control"
                            value={noteForm.note_title}
                            onChange={(e) =>
                              setNoteForm({
                                ...noteForm,
                                note_title: e.target.value,
                              })
                            }
                          />
                          {noteFormErrors.note_title && (
                            <p className="text-danger">
                              {noteFormErrors.note_title}
                            </p>
                          )}
                        </div>
                        <div className="mb-3">
                          <label htmlFor="note-description">Description</label>
                          <textarea
                            id="note-description"
                            className="form-control"
                            rows="3"
                            value={noteForm.note_description}
                            onChange={(e) =>
                              setNoteForm({
                                ...noteForm,
                                note_description: e.target.value,
                              })
                            }
                          ></textarea>
                          {noteFormErrors.note_description && (
                            <p className="text-danger">
                              {noteFormErrors.note_description}
                            </p>
                          )}
                        </div>
                        {/* Checkbox for sharing with staff */}
                        <div className="mb-3 form-check">
                          <input
                            type="checkbox"
                            id="share-with-staff"
                            className="form-check-input"
                            checked={noteForm.share_with_staff === "1"} // Convert "1" to true and "0" to false
                            onChange={(e) =>
                              setNoteForm({
                                ...noteForm,
                                share_with_staff: e.target.checked ? "1" : "0", // Store as "1" or "0"
                              })
                            }
                          />
                          <label
                            htmlFor="share-with-staff"
                            className="form-check-label"
                          >
                            Share with Staff
                          </label>
                        </div>
                        <Button
                          variant="primary"
                          onClick={() => handleSave(params.row.id)}
                        >
                          Add
                        </Button>
                      </form>
                    </>
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
