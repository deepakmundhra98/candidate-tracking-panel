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
import CustomizedTimeline from "@/app/admin/Components/Timeline/Timeline";
import HTMLReactParser from "html-react-parser";
import CandidateModal from "@/app/Components/CandidateModal/CandidateModal";
import JobModal from "@/app/Components/JobModal/JobModal";
const Page = () => {
  const router = useRouter();
  const slideClose = () => setslider(false);

  const [slider, setslider] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);

  const [userData, setUserData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [processData, setProcessData] = useState([]);
  const [user, setUser] = useState([]);
  const [modalData, setModalData] = useState();
  const [interviewJourney, setInterviewJourney] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("tokenStaff");
  const userId = Cookies.get("staffId");
  const [mdShow, setMdShow] = useState(false);
  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);
  const [cancellationEmailTemplateId, setCancellationEmailTemplateId] =
    useState();
  const [commentLogs, setCommentLogs] = useState([]);
  const [commentData, setCommentData] = useState({
    candidate_id: "",
    comment: "",
    job_id: "",
  });
  const handleOpen = (eachData) => {
    setslider(true);
    setModalData(eachData);
    setSelectedRecord(eachData);
    handleShowModal(eachData);
  };
  const [userAccess, setUserAccess] = useState({});

  useEffect(() => {
    const access = Cookies.get("access");

    if (typeof access !== null || access !== "" || access !== undefined) {
      // console.log(JSON.parse(access));

      setUserAccess(JSON.parse(access));
    } else {
      setUserAccess({});
    }
  }, []);
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

  const getData = async (userId) => {
    try {
      const response = await axios.post(
        BaseAPI + `/admin/candidate/staff-interview-list/${userId}`,

        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setUserData(response.data.response.interviewAssignedData);
      setStatusData(response.data.response.statusList);
      setProcessData(response.data.response.processList);
      setUser(response.data.response.user);
      setCancellationEmailTemplateId(
        response.data.response.interview_cancellation_email_template_id
      );
      setLoading(false);
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
    const filtered = userData.filter(
      (userData) =>
        userData.candidateDetails.first_name
          .toLowerCase()
          .includes(keyword.toLowerCase()) ||
        userData.user_assigned.toLowerCase().includes(keyword.toLowerCase()) ||
        userData.candidateDetails.job_name
          .toLowerCase()
          .includes(keyword.toLowerCase()) ||
        userData.candidateInterviewDetails.interview_date
          .toLowerCase()
          .includes(keyword.toLowerCase())
    );
    setSkills(filtered);
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearchKeyword("");
    setSkills(null);
  };
  useEffect(() => {
    getData(userId);
  }, []);

  const handleShowModal = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const fetchDataForComment = async (candidate_id, job_id) => {
    // console.log(candidate_id, job_id, "Start");
    setCommentData({
      ...commentData,
      candidate_id: candidate_id,
      job_id: job_id,
    });
  };

  const addComment = async (rowData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + `/admin/candidate/addcomment`,
        commentData,
        {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setLoading(false);
      if (response.data.status === 200) {
        setLgShow(false);
        setCommentData({
          candidate_id: "",
          comment: "",
          job_id: "",
        });
        Swal.fire({
          title: "Comment Added successfully!",
          icon: "success",
          confirmButtonText: "Close",
        });
        getData();
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const getCommentLogs = async (candidate_id, job_id, process_id) => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + `/admin/candidate/getcommentlogs/${candidate_id}`,
        {
          job_id: job_id,
          process_id: process_id,
          candidate_id: candidate_id,
        },
        {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setLoading(false);
      if (response.data.status === 200) {
        setMdShow(true);
        setCommentLogs(response.data.response);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const [cancellationData, setCancellationData] = useState({
    candidate_id: "",
    process_id: "",
    job_id: "",
    reason: "",
  });

  const [cancellationShow, setCancellationShow] = useState(false);

  const fetchDataForInterviewCancellation = async (
    candidate_id,
    job_id,
    process_id
  ) => {
    // console.log(candidate_id, job_id, "Start");
    setCancellationData({
      ...cancellationData,
      candidate_id: candidate_id,
      job_id: job_id,
      process_id: process_id,
    });
  };

  const cancelInterview = async (rowData) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Cancel Interview?",
        text: "Do you want to cancel this interview? This will send an Email to the candidate regarding the cancellation of the interview.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          BaseAPI + `/admin/candidate/interviewcancelation`,
          cancellationData,
          {
            headers: {
              "content-type": "application/json",
              Authorization: "Bearer" + " " + token,
            },
          }
        );
        setLoading(false);
        if (response.data.status === 200) {
          setCancellationShow(false);
          setCancellationData({
            candidate_id: "",
            process_id: "",
            reason: "",
            job_id: "",
          });
          Swal.fire({
            title: "Interview Cancelled successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
          getData(userId);
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const handleReschedule = async (
    candidate_id,
    job_id,
    employer_id,
    process_id
  ) => {
    Cookies.set("candidate_id", candidate_id);
    Cookies.set("job_id", job_id);
    Cookies.set("process_id", process_id);
    router.push("/staff/interview-list/reschedule/" + candidate_id);
  };
  const [statusID, setStatusID] = useState();

  const changeStatusToReject = async () => {
    try {
      const response = await axios.post(
        BaseAPI +
          `/admin/candidates/statuschange/${rejectFeedbackData.candidate_id}`,
        rejectFeedbackData,
        {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer" + " " + tokenEmployer,
          },
        }
      );
      if (response.data.status === 200) {
        setRejectModal(false);
        Swal.fire({
          title: "Status Changed successfully!",
          icon: "success",
          confirmButtonText: "Close",
        });
        getData();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleStatusChange = async (e, candidateId) => {
    let id = e.target.value;
    // console.log(id);
    // return;
    if (!id) {
      // If "Select Status" option is selected, return without making the API call
      return;
    }
    if (id === "9") {
      setRejectModal(true);
      setRejectFeedbackData({
        status: id,
        candidate_id: candidateId,
      });
      return;
    }
    try {
      const response = await axios.post(
        BaseAPI + `/admin/candidates/statuschange/${candidateId}`,
        { status: id },
        {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer" + " " + tokenEmployer,
          },
        }
      );
      if (response.data.status === 200) {
        Swal.fire({
          title: "Status Changed successfully!",
          icon: "success",
          confirmButtonText: "Close",
        });
        getData();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleCancellationInput = (e) => {
    const { name, value } = e.target;
    if (e.target.value !== "" || e.target.value !== null) {
      setShowPreviewButton(true);
    } else {
      setShowPreviewButton(false);
    }
    setCancellationData({
      ...cancellationData,
      [name]: value,
    });
  };

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewModalData, setPreviewModalData] = useState(false);
  const [showPreviewButton, setShowPreviewButton] = useState(false);

  const handlePreviewModal = async () => {
    try {
      setCancellationShow(false);
      setLoading(true);
      const response = await axios.post(
        BaseAPI +
          "/admin/emailtemplate/interview-cancellation/getEmailTemplatePreview/" +
          cancellationEmailTemplateId,
        {
          cancellationData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCancellationShow(true);
      setLoading(false);
      if (response.data.status === 200) {
        setShowPreviewModal(true);
        setPreviewModalData(response.data.response);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Note functionailty
  const [ShowNote, setShowNote] = useState(false);
  const [notes, setNotes] = useState();
  const [viewNote, setViewNote] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
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

  const handleResendInterviewEmail = async (id) => {
    try {
      const response = await axios.post(
        BaseAPI + `/admin/candidate/resend-interview-schedule-email/${id}`,
        null,
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
        Swal.fire({
          title: "Email sent successfully",
          icon: "success",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const [stepsData, setStepsData] = useState([]);

  const fetchInterviewJourney = async (candidateData) => {
    try {
      setLoading(true);
      // setSelectedRecord(candidateData); // Update selected record data
      // const { candidate_id, job_id } = candidateData;
      let candidate_id = candidateData.id;
      let job_id = candidateData.job_id;
      // console.log(candidateData,"yaha")
      setSelectedRecord(candidateData);
      const response = await axios.post(
        BaseAPI + "/admin/getinterviewjourneystatus",
        { candidate_id, job_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === "200") {
        setLoading(false);
        setStepsData(response.data.response);
        setInterviewJourney(true);
        // console.log(response.data.response);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const columns = [
    {
      field: "candidateName",
      headerName: "Candidate Name",
      width: 200,
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
            {params.row.candidateName}
          </div>
        </>
      ),
    },
    {
      field: "jobAppliedTo",
      headerName: "Job Applied To",
      width: 150,
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
            {params.row.jobAppliedTo}
          </div>
        </>
      ),
    },
    {
      field: "interviewer",
      headerName: "Interviewer",
      width: 150,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },

    {
      field: "interviewName",
      headerName: "Interview Name",
      width: 150,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },

    {
      field: "interviewDate",
      headerName: "Interview Date",
      width: 135,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },

    {
      field: "status",
      headerName: "Change Status",
      width: 200,
      headerClassName: "redText",
      cellClassName: "redBorder",
      renderCell: (params) => {
        // Check if the interview is completed
        if (params.row.interview_completion_status === 1) {
          return (
            <div className="text-success fw-bold d-flex align-items-center">
              Interview Completed
            </div>
          );
        }

        // Check if the interview is cancelled
        if (params.row.interview_cancellation_status === "1") {
          return (
            <div className="text-danger fw-bold d-flex align-items-center">
              Interview Cancelled
              <span
                className="ms-2"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title={params.row.interview_cancellation_reason}
              >
                <i className="fa-solid fa-circle-info text-info"></i>
              </span>
            </div>
          );
        }

        if (
          params.row.interview_completion_status === null &&
          params.row.interview_cancellation_status === "0"
        ) {
          return (
            <>
              <select
                className="form-select shadow-none"
                style={{ display: "inline-block" }}
                value={statusID}
                onClick={(e) => handleStatusChange(e, params.row.id)}
              >
                <option value="" selected>
                  Select Status
                </option>
                {statusData.map((i) => {
                  return (
                    <option key={i.id} value={i.id}>
                      {i.status_name}
                    </option>
                  );
                })}
              </select>
            </>
          );
        }
      },
    },

    {
      field: "action",
      headerName: "Action",
      headerClassName: "redText",
      cellClassName: "redBorder",
      width: 300,
      renderCell: (params) => (
        <strong>
          <div className="process__actionnn" style={{ margin: "10px 0" }}>
            <Button
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen(params.row);
              }}
              className="btn btn-info btn-xxss"
              title="view"
            >
              <i className="fa fa-eye"></i>
            </Button>

            <button
              className="btn  btn-success btn-smmm"
              title="Add Comment"
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
                fetchDataForComment(params.row.id, params.row.job_id);
                setLgShow(true);
              }}
            >
              <i class="fa-solid fa-square-pen"></i>
            </button>
            <Modal
              size="lg"
              show={lgShow}
              onHide={() => setLgShow(false)}
              aria-labelledby="feedback"
            >
              <Modal.Header closeButton className="bg-red-500 text-white">
                <Modal.Title id="feedback " className="provide_feedback">
                  Provide Comment/Feedback
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="dDrt">
                  <textarea
                    className="form-control border-dark "
                    cols="80"
                    rows="5"
                    name="comment"
                    value={commentData.comment}
                    onChange={(e) =>
                      setCommentData({
                        ...commentData,
                        comment: e.target.value,
                      })
                    }
                  ></textarea>
                  <span>
                    <button
                      className="btn btn-primary btn-feedback"
                      // onClick={() => addComment(params.row)}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents event bubbling
                        addComment(params.row.id, params.row.job_id);
                      }}
                    >
                      Submit Comment
                    </button>
                  </span>
                </div>
              </Modal.Body>
            </Modal>
            <button
              className="btn  btn-info btn-xxss"
              title="Comment Log"
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
                getCommentLogs(
                  params.row.candidate_id,
                  params.row.job_id,
                  params.row.process_id
                );
              }}
            >
              <FormatListBulletedIcon sx={{ fontSize: 20 }} />
            </button>
            <Modal
              size="lg"
              show={mdShow}
              onHide={() => setMdShow(false)}
              aria-labelledby="interview status"
            >
              <Modal.Header closeButton className="bg-red-500 text-white">
                <Modal.Title id="interview status ">Comment Log</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {commentLogs.map((i) => {
                  return (
                    <>
                      <div className="dDrt">
                        <span>Job Name : </span>
                        {i.job_name ? i.job_name : "Job not found"}
                      </div>
                      <div className="dDrt">
                        <span>Interview Process Name : </span>
                        {i.process_name
                          ? i.process_name
                          : "Process name not found"}
                      </div>
                      <div className="dDrt">
                        <span>Comment By : </span>
                        {i.user_name}
                        {i.user_type === "staff" ? " (Staff)" : " (Employer)"}
                      </div>
                      <div className="dDrt">
                        <span>Comment : </span>
                        <b>{i.comment}</b>
                      </div>
                      <div className="dDrt">
                        <span>Date : </span>
                        {i.created}
                      </div>
                      <div className="dDrt">
                        <span>Time : </span>
                        {i.created_time}
                      </div>
                      <div className="dDart" style={{ marginLeft: "20px" }}>
                        ------------------
                      </div>
                    </>
                  );
                })}
              </Modal.Body>
            </Modal>

            {/* Note button */}
            <button
              className="btn btn-primary btn-group"
              title={`Notes for ${params.row.first_name} ${params.row.last_name}`}
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
                fetchNotes(
                  params.row.candidate_id,
                  params.row.first_name,
                  params.row.last_name
                );
              }}
            >
              <i className="fas fa-sticky-note"></i>
            </button>

            {/* Interview Journey button start */}
            {/* <button
              className="btn  btn-success btn-smmm"
              title="Interview Journey"
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
                fetchInterviewJourney(params.row);

                // setInterviewJourney(true);
                // setSelectedRecord(params.row); // Update selected record data
              }}
            >
              <i className="fa-solid fa-route"></i>
            </button> */}

            {/* Interview reschedule start */}
            {params.row.interview_completion_status === null && userAccess[14]?.Reschedule_Interview === 1 && (
              <button
                // href={`/employer/interview/reschedule/${params.row.id}`}
                className="btn btn-primary btn-group"
                title="Reschedule Interview"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents event bubbling
                  handleReschedule(
                    params.row.candidate_id,
                    params.row.job_id,
                    params.row.employer_id,
                    params.row.process_id
                  );
                }}
              >
                <i class="fas fa-pen"></i>
              </button>
            )}

            {/* Button to cancel interview */}
            {params.row.interview_completion_status === null &&
              params.row.interview_cancellation_status !== "1" && userAccess[14]?.Cancel_Interview === 1 && (
                <>
                  <button
                    className="btn  btn-danger btn-smmm"
                    title="Cancel Interview"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents event bubbling
                      fetchDataForInterviewCancellation(
                        params.row.id,
                        params.row.job_id,
                        params.row.process_id
                      );
                      setCancellationData({
                        ...cancellationData,
                        reason: "",
                      });
                      setCancellationShow(true);
                    }}
                  >
                    <i class="fa-solid fa-circle-exclamation"></i>
                  </button>
                  <Modal
                    size="lg"
                    show={cancellationShow}
                    onHide={() => setCancellationShow(false)}
                    aria-labelledby="feedback"
                  >
                    <Modal.Header closeButton className="bg-red-500 text-white">
                      <Modal.Title id="feedback " className="provide_feedback">
                        Provide Interview Cancellation reason
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="dDrt">
                        <textarea
                          type="email"
                          class="form-control"
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          rows="7"
                          placeholder="Interview Cancellation Reason"
                          value={cancellationData.reason}
                          onChange={handleCancellationInput}
                          name="reason"
                        />
                        {/* <span> */}
                        <button
                          className="btn btn-primary btn-feedback mr-2"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevents event bubbling
                            cancelInterview(params.row.id, params.row.job_id);
                          }}
                        >
                          Cancel Interview
                        </button>
                        {/* </span> */}
                        {showPreviewButton && (
                          <button
                            className="btn btn-primary btn-feedback"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevents event bubbling
                              handlePreviewModal(
                                params.row.id,
                                params.row.job_id
                              );
                            }}
                          >
                            Preview Cancel Interview Email
                          </button>
                        )}
                      </div>
                    </Modal.Body>
                  </Modal>

                  {/* Modal for showing cancel email preview */}
                  <Modal
                    size="lg"
                    show={showPreviewModal}
                    onHide={() => setShowPreviewModal(false)}
                    aria-labelledby="example-modal-sizes-title-lg"
                  >
                    <Modal.Header closeButton className="Process_assigned">
                      <Modal.Title id="example-modal-sizes-title-lg">
                        Cancel Interview Email Preview
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {previewModalData && HTMLReactParser(previewModalData)}
                    </Modal.Body>
                  </Modal>
                </>
              )}

            {/* Ends here */}

            {params.row.interview_completion_status === null && (
              <button
                className="btn btn-primary btn-group"
                title="Resend Interview Email"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents event bubbling
                  handleResendInterviewEmail(params.row.id, params.row.job_id);
                }}
              >
                <i class="fas fa-paper-plane"></i>
              </button>
            )}
          </div>
        </strong>
      ),
    },
  ];

  const rows =
    skills?.length > 0
      ? skills.map((item, index) => ({
          employer_id: item.employer_id,
          id: item.id,
          candidate_id: item.candidateDetails.id,

          job_id: item.candidateInterviewDetails.job_id,
          process_id: item.candidateInterviewDetails.process_id,
          candidateName:
            item.candidateDetails.first_name +
            " " +
            item.candidateDetails.last_name,
          jobAppliedTo: item.candidateDetails.job_name,
          interviewer: item.user_assigned || item.candidateInterviewDetails.panelist_names,
          interviewName: item.candidateInterviewDetails.process_name,
          interviewDate: item.candidateInterviewDetails.interview_date
            .split("-")
            .reverse()
            .join("-"),
          additional_data: item.candidateDetails.additional_data,
          panelist_names: item.candidateInterviewDetails.panelist_names,

        }))
      : userData.map((item, index) => ({
          employer_id: item.employer_id,
          id: item.id, // Ensure unique id
          candidate_id: item.candidateDetails.id,
          job_id: item.candidateInterviewDetails.job_id,
          candidateName:
            item.candidateDetails.first_name +
            " " +
            item.candidateDetails.last_name,
          jobAppliedTo: item.candidateDetails.job_name,
          interviewer: item.user_assigned || item.candidateInterviewDetails.panelist_names,
          interviewName: item.candidateInterviewDetails.process_name,
          interviewDate: item.candidateInterviewDetails.interview_date
            .split("-")
            .reverse()
            .join("-"),
          first_name: item.candidateDetails.first_name,
          middle_name: item.candidateDetails.middle_name,
          last_name: item.candidateDetails.last_name,
          name:
            item.candidateDetails.first_name +
            " " +
            item.candidateDetails.middle_name +
            " " +
            item.candidateDetails.last_name,
          email: item.candidateDetails.email_address,
          phone: item.candidateDetails.contact,
          date_of_birth: item.candidateDetails.date_of_birth,
          gender: item.candidateDetails.gender,
          martial_status: item.candidateDetails.martial_status,
          physically_challenged: item.candidateDetails.physically_challenged,
          address: item.candidateDetails.address,

          education: item.candidateDetails.education,
          experience: item.candidateDetails.experience,

          status: item.status,
          slug: item.slug,
          interview_status: item.interview_status,
          process_name: item.process_name,
          process_id: item.candidateInterviewDetails.process_id,
          user: item.username,
          interview_cancellation_status:
            item.candidateInterviewDetails.interview_cancelation_status,
          interview_cancellation_reason:
            item.candidateInterviewDetails.interview_cancelation_reason,
          address: item.address,

          jobname: item.jobAppliedFor,
          profile_image: item.candidateDetails.profile_image,
          cv_document: item.candidateDetails.cv_document,
          interview_completion_status:
            item.candidateInterviewDetails.interview_completion_status,
          jobData: item.jobData,
          cover_letter_title: item.candidateDetails.cover_letter_title,
          cover_letter_description:
            item.candidateDetails.cover_letter_description,
          additional_data: item.candidateDetails.additional_data,
          panelist_names: item.candidateInterviewDetails.panelist_names,
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
                <i class="fa-solid fa-clipboard-question"></i>
                <span>Interview Assigned</span>
              </div>
            </div>
          </div>
          <div className="">
            
            <div className="serachKeyItems  bg-white">
              <form action="">
                <p>
                  Search Candidate by Candidate Name, Job Name, Interviewer Name
                  or Applied Date
                </p>
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

            <div className="interviewPreviewTable TableScroll">
              <div style={{ height: 400, width: "100%" }}>
                {userData.length > 0 ? (
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.id} 
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                      },
                    }}
                    pageSizeOptions={[5, 10, 20, 50]}
                    checkboxSelection
                  />
                ) : (
                  <div className="noDataAvailable">No records found</div>
                )}
              </div>
            </div>
            {showModal && (
              <CandidateModal
                onClose={() => setShowModal(false)}
                profileData={selectedRecord}
              />
            )}

            {jobModal && (
              <JobModal
                onClose={() => setJobModal(false)}
                jobData={JobModalData}
              />
            )}

            {/* Interview Journey */}
            <Modal
              size="xl"
              show={interviewJourney}
              onHide={() => {
                setInterviewJourney(false);
                setSelectedRecord(null); // Clear selected record on close
              }}
              aria-labelledby="example-modal-sizes-title-lg"
            >
              <Modal.Header closeButton className="Process_assigned">
                <Modal.Title id="example-modal-sizes-title-lg">
                  Interview Journey Status for {selectedRecord?.first_name}{" "}
                  {selectedRecord?.last_name}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* {selectedRecord && ( */}
                <CustomizedTimeline
                  // candidate_id={selectedRecord.candidate_id}
                  // job_id={selectedRecord.job_id}
                  stepsData={stepsData}
                />
                {/* )} */}
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
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          Title
                        </th>
                        <th
                          style={{ padding: "10px", border: "1px solid #ddd" }}
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
                          Created on
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
                          <td style={{ padding: "10px" }}>{note.note_title}</td>
                          <td style={{ padding: "10px" }}>{note.user_type}</td>
                          <td style={{ padding: "10px" }}>
                            {note.share_with_staff === "1" ? "Yes" : "No"}
                          </td>
                          <td style={{ padding: "10px" }}>
                            {note.created_date} at {note.created_time}
                          </td>

                          <td style={{ padding: "10px", textAlign: "center" }}>
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
                      <Button variant="primary" onClick={() => handleSave()}>
                        Add
                      </Button>
                    </form>
                  </>
                )}
              </Modal.Body>
            </Modal>
          </div>
        </div>
        <AdminFooter />
      </StaffLayout>
    </>
  );
};

export default Page;
