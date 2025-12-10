"use client";
import React from "react";
import Link from "next/link";
import "../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useState, useEffect } from "react";
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
import { set } from "date-fns";
// import SwipeableEdgeDrawer from "../Components/SwipeableDrawer";
import HTMLReactParser from "html-react-parser";
import CandidateModal from "@/app/Components/CandidateModal/CandidateModal";
import JobModal from "@/app/Components/JobModal/JobModal";
import { Spinner } from "react-bootstrap";
import { Tooltip } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";


  // Animation variants for the modal
  const modalVariants = {
    hidden: {
      opacity: 0,
      y: -50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: 50,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  // Animation variants for the backdrop
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

const Page = () => {
  const router = useRouter();
  const [userData, setUserData] = useState([]);
  const [formData, setFormData] = useState({
    round: "",
    process_id: "",
    user_id: "",
    comment: "",
  });

  const [slider, setslider] = useState(false);
  const [statusData, setStatusData] = useState([]);
  const [processData, setProcessData] = useState([]);
  const [user, setUser] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const tokenStaff = Cookies.get("tokenStaff");
  const [mdShow, setMdShow] = useState(false);
  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);
  const [interviewJourney, setInterviewJourney] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [skills, setSkills] = useState(null);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [statusID, setStatusID] = useState();
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectFeedbackData, setRejectFeedbackData] = useState({
    status: "",
    candidate_id: "",
    reason: "",
  });
  const [commentLogs, setCommentLogs] = useState([]);
  const [commentData, setCommentData] = useState({
    candidate_id: "",
    comment: "",
    job_id: "",
  });
  const [error, setError] = useState("");
  const [sendRejectionMessage, setSendRejectionMessage] = useState(false);
  const access = Cookies.get("access");
  const [userAccess, setUserAccess] = useState({});

  useEffect(() => {
    const access = Cookies.get("access");

    if (typeof access !== null || access !== "" || access !== undefined) {
      console.log(JSON.parse(access));

      setUserAccess(JSON.parse(access));
    } else {
      setUserAccess({});
    }
  }, []);
  const handleOpen = (eachData) => {
    setslider(true);
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

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + "/admin/candidates/listing",
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + tokenStaff,
          },
        }
      );
      setUserData(response.data.response.candidatesData);
      setStatusData(response.data.response.statusList);
      setProcessData(response.data.response.processList);
      setUser(response.data.response.user);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    // Filter skills based on the keyword
    const filtered = userData.filter((userData) =>
      userData.first_name
        .toLowerCase()
        .includes(
          keyword.toLowerCase() ||
            userData.last_name.toLowerCase().includes(keyword.toLowerCase())
        )
    );
    setSkills(filtered);
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearchKeyword("");
    setSkills();
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
            Authorization: `Bearer ${tokenStaff}`,
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
      setLoading(false);
      console.log(error.message);
    }
  };

  const changeStatusToReject = async () => {
    try {
      const updatedData = {
        ...rejectFeedbackData,
        sendRejectionMessage: sendRejectionMessage,
      };
      const response = await axios.post(
        BaseAPI +
          `/admin/candidates/statuschange/${rejectFeedbackData.candidate_id}`,
        updatedData,
        {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer" + " " + tokenStaff,
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
            authorization: "Bearer" + " " + tokenStaff,
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

  const getStatusName = (statusId) => {
    const status = statusData.find((status) => status.id == statusId);
    return status ? status.status_name : null; // Returns the name or null if not found
  };

  const handleInterview = (candidateId, jobId) => {
    // e.stopPropagation();
    Cookies.set("job_id", jobId);
    router.push(`/staff/jobs/scheduleinterview/${candidateId}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
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
    if (!commentData.comment.trim()) {
      setError("Comment is required");
      return;
    }
    setError("");
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + `/admin/candidate/addcomment`,
        commentData,
        {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer" + " " + tokenStaff,
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

  const getCommentLogs = async (candidate_id, job_id) => {
    try {
      console.log(candidate_id, job_id, "Start");
      setLoading(true);
      const response = await axios.post(
        BaseAPI + `/admin/candidate/getcommentlogs/${candidate_id}`,
        {
          job_id: job_id,
        },
        {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer" + " " + tokenStaff,
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
            Authorization: `Bearer ${tokenStaff}`,
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
            Authorization: `Bearer ${tokenStaff}`,
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
                Authorization: `Bearer ${tokenStaff}`,
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
                Authorization: `Bearer ${tokenStaff}`,
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
      width: 130,
      flex: 0.7,
      headerClassName: "redText",
      cellClassName: "redBorder",
      renderCell: (params) => (
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
      ),
    },
    {
      field: "mail",
      headerName: "Email",
      width: 200,
      flex: 0.7,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },
    {
      field: "jobname",
      headerName: "Job Name",
      width: 130,
      flex: 1,
      headerClassName: "redText",
      cellClassName: "redBorder",
      renderCell: (params) => (
        <div
          className="text-primary"
          onClick={(e) => {
            e.stopPropagation();
            handleJobOpen(params.row.jobData);
          }}
          style={{ cursor: "pointer" }}
        >
          {params.row.jobname}
        </div>
      ),
    },
    {
      field: "appliedDate",
      headerName: "Applied Date",
      width: 130,
      flex: 0.5,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },
    {
      field: "currentStatus",
      headerName: "Current Status",
      width: 150,
      flex: 0.5,
      headerClassName: "redText",
      cellClassName: "redBorder",
      renderCell: (params) => (
        <>
          {params.row.interview_status ? (
            <div className="text-black fw-bold ms-2">
              {getStatusName(params.row.interview_status)}
            </div>
          ) : params.row.latest_interview_status?.process_name ? (
            <Tooltip
              title={
                <span style={{ fontSize: "12px", width: "200px" }}>
                  Last Interview scheduled:{" "}
                  <b>{params.row.latest_interview_status.process_name}</b>
                  <br />
                  Status:{" "}
                  <b>{params.row.latest_interview_status.completion_status}</b>
                </span>
              }
              placement="right"
            >
              <div className="text-yellow-500 fw-bold ms-2">
                {params.row.latest_interview_status.process_name}
              </div>
            </Tooltip>
          ) : (
            <div className="text-green-700 fw-bold ms-2">New!</div>
          )}
        </>
      ),
    },
    ...(userAccess[1]?.Change_Status === 1
      ? [
          {
            field: "status",
            headerName: "Change Status",
            width: 170,
            flex: 0.7,
            headerClassName: "redText",
            cellClassName: "redBorder",
            renderCell: (params) => (
              <>
                {params.row.interview_status === "9" ? (
                  <div className="text-danger fw-bold ms-2">Rejected</div>
                ) : (
                  <select
                    className="form-select shadow-none"
                    style={{ display: "inline-block" }}
                    value={statusID}
                    onChange={(e) => handleStatusChange(e, params.row.id)}
                  >
                    <option value="">Select Status</option>
                    {statusData.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.status_name}
                      </option>
                    ))}
                  </select>
                )}
              </>
            ),
          },
        ]
      : []),
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
              className="btn btn-info btn-xxss"
              title="view"
            >
              <i className="fa fa-eye"></i>
            </Button>
            <button
              className="btn btn-success btn-smmm"
              title="Add Comment"
              onClick={(e) => {
                e.stopPropagation();
                fetchDataForComment(params.row.id, params.row.job_id);
                setLgShow(true);
              }}
            >
              <i className="fa-solid fa-square-pen"></i>
            </button>
            <button
              className="btn btn-info btn-xxss"
              title="Comment Log"
              onClick={(e) => {
                e.stopPropagation();
                getCommentLogs(params.row.id, params.row.job_id);
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
                {commentLogs.length > 0 ? (
                  commentLogs.map((i) => {
                    return (
                      <>
                        <div className="dDrt">
                          <span>Job Name : </span>
                          {i.job_name ? i.job_name : "Job not found"}
                        </div>
                        <div className="dDrt">
                          <span>Comment By : </span>
                          {i.user_name}
                        </div>
                        {/* <div className="dDrt">
                        <span>Interview Status : </span>
                      </div> */}
                        <div className="dDrt">
                          <span>Comment : </span>
                          {i.comment}
                        </div>
                        <div className="dDrt">
                          <span>Date : </span>
                          {i.created}
                        </div>
                        <div className="dDart" style={{ marginLeft: "20px" }}>
                          ------------------
                        </div>
                      </>
                    );
                  })
                ) : (
                  <div className="dDrt">
                    <span>No Comments Found</span>
                  </div>
                )}
              </Modal.Body>
            </Modal>
            <button
              className="btn btn-primary btn-group"
              title={`Notes for ${params.row.first_name} ${params.row.last_name}`}
              onClick={(e) => {
                e.stopPropagation();
                fetchNotes(
                  params.row.id,
                  params.row.first_name,
                  params.row.last_name
                );
              }}
            >
              <i className="fas fa-sticky-note"></i>
            </button>
            <button
              className="btn btn-primary btn-group"
              title="Interview Journey"
              onClick={(e) => {
                fetchInterviewJourney(params.row);
                e.stopPropagation();
              }}
            >
              <i className="fa-solid fa-route"></i>
            </button>
            {userAccess[1]?.Interview_Schedule === 1 &&
              !(
                params.row.interview_status === "8" ||
                params.row.interview_status === "9"
              ) && (
                <button
                  className="btn btn-xxxxxss"
                  title="Schedule Interview"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInterview(params.row.id, params.row.job_id);
                  }}
                >
                  <i className="fas fa-users"></i>
                </button>
              )}
          </div>
        </strong>
      ),
    },
  ];

  // const columns = [
  //   {
  //     field: "name",
  //     headerName: "Name",
  //     width: 130,
  //     headerClassName: "redText",
  //     cellClassName: "redBorder",
  //     renderCell: (params) => (
  //       <>
  //         <div
  //           className="text-primary"
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             handleOpen(params.row);
  //           }}
  //           style={{ cursor: "pointer" }}
  //         >
  //           {params.row.name}
  //         </div>
  //       </>
  //     ),
  //   },
  //   {
  //     field: "mail",
  //     headerName: "Email",
  //     width: 200,
  //     headerClassName: "redText",
  //     cellClassName: "redBorder",
  //   },
  //   {
  //     field: "jobname",
  //     headerName: "Job Name",
  //     width: 130,
  //     headerClassName: "redText",
  //     cellClassName: "redBorder",
  //     renderCell: (params) => (
  //       <>
  //         <div
  //           className="text-primary"
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             handleJobOpen(params.row.jobData);
  //           }}
  //           style={{ cursor: "pointer" }}
  //         >
  //           {params.row.jobname}
  //         </div>
  //       </>
  //     ),
  //   },

  //   {
  //     field: "appliedDate",
  //     headerName: "Applied Date",
  //     width: 130,
  //     headerClassName: "redText",
  //     cellClassName: "redBorder",
  //   },
  //   {
  //     field: "currentStatus",
  //     headerName: "Current Status",
  //     width: 150,
  //     headerClassName: "redText",
  //     cellClassName: "redBorder",
  //     renderCell: (params) => (
  //       <>
  //         {params.row.interview_status ? (
  //           <div className="text-black fw-bold ms-2">
  //             {getStatusName(params.row.interview_status)}
  //           </div>
  //         ) : (
  //           <>
  //             {params.row.latest_interview_status &&
  //             params.row.latest_interview_status.process_name ? (
  //               <Tooltip
  //                 title={
  //                   <span style={{ fontSize: "12px", width: "200px" }}>
  //                     Last Interview scheduled:{" "}
  //                     <b>{params.row.latest_interview_status.process_name}</b>{" "}
  //                     <br /> Status:{" "}
  //                     <b>
  //                       {params.row.latest_interview_status.completion_status}
  //                     </b>
  //                   </span>
  //                 }
  //                 placement="right"
  //               >
  //                 {" "}
  //                 <div className="text-yellow-500 fw-bold ms-2">
  //                   {params.row.latest_interview_status.process_name}
  //                   {/* -{" "}
  //                 {params.row.latest_interview_status.completion_status} */}
  //                 </div>
  //               </Tooltip>
  //             ) : (
  //               <div className="text-green-700 fw-bold ms-2">New!</div>
  //             )}
  //           </>
  //         )}
  //       </>
  //     ),
  //   },
  //   {userAccess[1]?.interview_schedule === 1 &&(
  //     {
  //       field: "status",
  //       headerName: "Change Status",
  //       width: 170,
  //       headerClassName: "redText",
  //       cellClassName: "redBorder",
  //       renderCell: (params) => (
  //         <>
  //           {params.row.interview_status === "9" ? (
  //             <>
  //               <div className="text-danger fw-bold ms-2">Rejected</div>
  //             </>
  //           ) : (
  //             <select
  //               className="form-select shadow-none"
  //               style={{ display: "inline-block" }}
  //               value={statusID}
  //               onClick={(e) => handleStatusChange(e, params.row.id)}
  //             >
  //               <option value="" selected>
  //                 Select Status
  //               </option>
  //               {statusData.map((i) => {
  //                 return (
  //                   <option key={i.id} value={i.id}>
  //                     {i.status_name}
  //                   </option>
  //                 );
  //               })}
  //             </select>
  //           )}
  //         </>
  //       ),
  //     },
  //   )},

  //   {
  //     field: "action",
  //     headerName: "Action",
  //     headerClassName: "redText",
  //     cellClassName: "redBorder",
  //     width: 243,
  //     renderCell: (params) => (
  //       <strong>
  //         <div className="process__actionnn" style={{ margin: "10px 0" }}>
  //           <Button
  //             variant="primary"
  //             onClick={(e) => {
  //               e.stopPropagation();
  //               handleOpen(params.row);
  //             }}
  //             className="btn btn-info btn-xxss"
  //             title="view"
  //           >
  //             <i className="fa fa-eye"></i>
  //           </Button>
  //           <button
  //             className="btn  btn-success btn-smmm"
  //             title="Add Comment"
  //             onClick={(e) => {
  //               e.stopPropagation(); // Prevents event bubbling
  //               fetchDataForComment(params.row.id, params.row.job_id);
  //               setLgShow(true);
  //             }}
  //           >
  //             <i class="fa-solid fa-square-pen"></i>
  //           </button>
  //           <Modal
  //             size="lg"
  //             show={lgShow}
  //             onHide={() => setLgShow(false)}
  //             aria-labelledby="feedback"
  //           >
  //             <Modal.Header closeButton className="bg-red-500 text-white">
  //               <Modal.Title id="feedback " className="provide_feedback">
  //                 Provide Comment/Feedback
  //               </Modal.Title>
  //             </Modal.Header>
  //             <Modal.Body>
  //               <div className="dDrt">
  //                 <textarea
  //                   className="form-control border-dark "
  //                   cols="80"
  //                   rows="5"
  //                   name="comment"
  //                   value={commentData.comment}
  //                   onChange={(e) =>
  //                     setCommentData({
  //                       ...commentData,
  //                       comment: e.target.value,
  //                     })
  //                   }
  //                 ></textarea>
  //                 <span>
  //                   <button
  //                     className="btn btn-primary btn-feedback"
  //                     onClick={(e) => {
  //                       e.stopPropagation(); // Prevents event bubbling
  //                       addComment(params.row.id, params.row.job_id);
  //                     }}
  //                   >
  //                     Submit Comment
  //                   </button>
  //                 </span>
  //               </div>
  //             </Modal.Body>
  //           </Modal>
  //           <button
  //             className="btn  btn-info btn-xxss"
  //             title="Comment Log"
  //             onClick={(e) => {
  //               e.stopPropagation(); // Prevents event bubbling
  //               getCommentLogs(params.row.id, params.row.job_id);
  //             }}
  //           >
  //             <FormatListBulletedIcon sx={{ fontSize: 20 }} />
  //           </button>
  //
  //           <button
  //             className="btn btn-primary btn-group"
  //             title={`Notes for ${params.row.first_name} ${params.row.last_name}`}
  //             onClick={(e) => {
  //               e.stopPropagation(); // Prevents event bubbling
  //               fetchNotes(
  //                 params.row.id,
  //                 params.row.first_name,
  //                 params.row.last_name
  //               );
  //             }}
  //           >
  //             <i className="fas fa-sticky-note"></i>
  //           </button>

  //           <button
  //             className="btn btn-primary btn-group"
  //             title="Interview Journey"
  //             onClick={(e) => {
  //               fetchInterviewJourney(params.row);
  //               e.stopPropagation(); // Prevents event bubbling
  //             }}
  //           >
  //             <i className="fa-solid fa-route"></i>
  //           </button>
  //           {userAccess[1]?.interview_schedule === 1 &&
  //             !(
  //               params.row.interview_status === "8" ||
  //               params.row.interview_status === "9"
  //             ) && (
  //               <button
  //                 className="btn btn-xxxxxss"
  //                 title="Schedule Interview"
  //                 onClick={(e) => {
  //                   e.stopPropagation();
  //                   handleInterview(params.row.id, params.row.job_id);
  //                 }}
  //               >
  //                 <i className="fas fa-users"></i>
  //               </button>
  //             )}
  //         </div>
  //       </strong>
  //     ),
  //   },
  // ];

  const rows =
    skills?.length > 0
      ? skills.map((i) => ({
          employer_id: item.employer_id,
          id: item.candidate_id,

          job_id: item.job_id,
          fName: item.first_name,
          lName: item.last_name,
          name: item.first_name + " " + item.last_name,
          mail: item.email_address,
          appliedDate: item.applied_date,
          status: item.status,
          slug: item.slug,
          interview_status: item.interview_status,
          process_name: item.process_name,
          user: item.username,
          phone: item.phone,
          dob: item.dateofbirth,
          address: item.address,
          gender: item.gender,
          jobname: item.jobAppliedFor,
          jobData: item.jobData,
          first_name: item.first_name,
          middle_name: item.middle_name,
          last_name: item.last_name,
          email: item.email_address,
          phone: item.contact,
          date_of_birth: item.date_of_birth,
          gender: item.gender,
          martial_status: item.martial_status,
          physically_challenged: item.physically_challenged,
          address: item.address,
          profile_image: item.profile_image,
          education: item.education,
          experience: item.experience,
          status: item.status,
          slug: item.slug,
          interview_status: item.interview_status,
          process_name: item.process_name,
          user: item.username,
          address: item.address,
          jobname: item.jobAppliedFor,
          cv_document: item.cv_document,
          currentStatus: item.interview_status,
          cover_letter_title: item.cover_letter_title,
          cover_letter_description: item.cover_letter_description,
          latest_interview_status: item.latest_interview_status,
          additional_data: item.additional_data,
        }))
      : userData.map((item) => ({
          employer_id: item.employer_id,
          id: item.candidate_id,

          job_id: item.job_id,
          fName: item.first_name,
          lName: item.last_name,
          name: item.first_name + " " + item.last_name,
          mail: item.email_address,
          appliedDate: item.applied_date,
          status: item.status,
          slug: item.slug,
          interview_status: item.interview_status,
          process_name: item.process_name,
          user: item.username,
          phone: item.phone,
          dob: item.dateofbirth,
          address: item.address,
          gender: item.gender,
          jobname: item.jobAppliedFor,
          jobData: item.jobData,
          first_name: item.first_name,
          middle_name: item.middle_name,
          last_name: item.last_name,
          email: item.email_address,
          phone: item.contact,
          date_of_birth: item.date_of_birth,
          gender: item.gender,
          martial_status: item.martial_status,
          physically_challenged: item.physically_challenged,
          address: item.address,
          profile_image: item.profile_image,
          education: item.education,
          experience: item.experience,
          status: item.status,
          slug: item.slug,
          interview_status: item.interview_status,
          process_name: item.process_name,
          user: item.username,
          address: item.address,
          jobname: item.jobAppliedFor,
          cv_document: item.cv_document,
          currentStatus: item.interview_status,
          cover_letter_title: item.cover_letter_title,
          cover_letter_description: item.cover_letter_description,
          latest_interview_status: item.latest_interview_status,
          additional_data: item.additional_data,
        }));

  return (
    <>
      <StaffLayout>
        <div className="swipeableDrawer">
          {" "}
          {/* <SwipeableEdgeDrawer token={tokenStaff} /> */}
        </div>
        {loading && <div className="loader-container"></div>}
        <div
          className=" backgroundColor adminChangeUsername"
          style={{ minHeight: "80vh" }}
        >
          <div className="breadCumb1" role="">
            <div className="flex gap-3 items-center">
              <Link
                underline="hover"
                color="inherit"
                href="/employer/dashboard"
              >
                <div className="flex gap-2 items-center">
                  <i className="fa-solid fa-gauge "></i>
                  <span>
                    Dashboard <i class="fa-solid fa-angles-right text-xs"></i>
                  </span>
                </div>
              </Link>
              <div className="flex gap-2 items-center  ">
                <i class="fa-solid fa-users"></i>
                <span>Candidates List</span>
              </div>
            </div>
          </div>
          <div className="">
           
            <div className="serachKeyItems  bg-white">
              <form action="">
                <p>Search Candidate by Name</p>
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
              {/* candidate details */}

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

             

              {/* Reject Modal */}
              <Modal
                size="lg"
                show={rejectModal}
                onHide={() => setRejectModal(false)}
                aria-labelledby="feedback"
              >
                <Modal.Header closeButton className="bg-red-500 text-white">
                  <Modal.Title id="feedback " className="provide_feedback">
                    Provide rejection feedback
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="dDrt">
                    <textarea
                      className="form-control border-dark "
                      cols="80"
                      rows="5"
                      placeholder="Enter Feedback"
                      onChange={(e) =>
                        setRejectFeedbackData({
                          ...rejectFeedbackData,
                          reason: e.target.value,
                        })
                      }
                    ></textarea>
                    <div
                      className="sendRejectionCheckbox"
                      style={{ color: "#7a7373" }}
                    >
                      {" "}
                      <label
                        htmlFor=""
                        style={{ marginRight: "10px", fontWeight: "500" }}
                      >
                        Send Rejection Message to candidate?
                      </label>
                      <input
                        type="checkbox"
                        value={sendRejectionMessage}
                        id=""
                        onChange={() =>
                          setSendRejectionMessage(!sendRejectionMessage)
                        }
                      />
                    </div>
                    <span>
                      <button
                        className="btn btn-primary btn-feedback"
                        onClick={changeStatusToReject}
                      >
                        Submit Feedback
                      </button>
                    </span>
                  </div>
                </Modal.Body>
              </Modal>

              {/* Interview Journey Modal */}
              {/* <Modal
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
                    Interview Journey Status for {selectedRecord?.fName}{" "}
                    {selectedRecord?.lName}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <CustomizedTimeline
                    stepsData={stepsData}
                  />
                </Modal.Body>
              </Modal> */}
               <AnimatePresence>
      {interviewJourney && (
        <>
          {/* Animated Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />

          {/* Animated Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Modal
              size="xl"
              show={interviewJourney}
              onHide={() => {
                setInterviewJourney(false);
                setSelectedRecord(null); // Clear selected record on close
              }}
              aria-labelledby="interview-journey-modal-title"
              
              dialogClassName="max-w-5xl w-full"
            >
              <Modal.Header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg shadow-md">
                <Modal.Title
                  id="interview-journey-modal-title"
                  className="text-lg font-semibold"
                >
                  Interview Journey Status for {selectedRecord?.fName}{" "}
                  {selectedRecord?.lName}
                </Modal.Title>
                <button
                  type="button"
                  className="text-white hover:text-gray-200 focus:outline-none transition-colors absolute right-[10px]"
                  onClick={() => {
                    setInterviewJourney(false);
                    setSelectedRecord(null);
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </Modal.Header>
              <Modal.Body className="bg-white rounded-b-lg p-6">
                {selectedRecord && (
                  <CustomizedTimeline stepsData={stepsData} />
                )}
              </Modal.Body>
            </Modal>
          </motion.div>
        </>
      )}
    </AnimatePresence>

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
                        <Button variant="primary" onClick={() => handleSave()}>
                          Add
                        </Button>
                      </form>
                    </>
                  )}
                </Modal.Body>
              </Modal>
              {/* Modal for adding comment */}
              <Modal
                size="lg"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="feedback"
              >
                <Modal.Header closeButton className="bg-red-500 text-white">
                  <Modal.Title id="feedback" className="provide_feedback">
                    Provide Comment
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="dDrt">
                    <textarea
                      className="form-control border-dark"
                      cols="80"
                      rows="5"
                      name="comment"
                      value={commentData.comment}
                      onChange={(e) => {
                        setCommentData({
                          ...commentData,
                          comment: e.target.value,
                        });
                        if (error) setError(""); // Clear error when user types
                      }}
                    ></textarea>

                    {/* Validation message */}
                    {error && (
                      <p
                        className="text-danger"
                        style={{ display: "block", marginTop: "2px" }}
                      >
                        {error}
                      </p>
                    )}

                    <span>
                      <button
                        className="btn btn-primary btn-feedback mt-3"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents event bubbling
                          addComment();
                        }}
                      >
                        Submit Comment
                      </button>
                    </span>
                  </div>
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
