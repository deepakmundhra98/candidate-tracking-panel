import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Image from "next/image";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import Swal from "sweetalert2";
import CandidateModal from "@/app/Components/CandidateModal/CandidateModal";
import { motion } from "framer-motion";

const ProfileCard = (props) => {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const [lgShow, setLgShow] = useState(false);
  const [commentLogShow, setCommentLogShow] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [slider, setSlider] = useState(false);
  const token = Cookies.get("tokenStaff");
  const [showDetails, setShowDetails] = useState(false); // State for showing details modal
  const [showComments, setShowComments] = useState(false); // State for showing comments modal
  //   const slideClose = () => setslider(false);
  const [interviewCompletionComment, setInterviewCompletionComment] =
    useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleOpen = (eachData) => {
    console.log(eachData, "here");
    setModalData(eachData);
    setSelectedRecord(eachData);
    setSlider(true);
    // setShowDetails(true);
  };

  const slideClose = () => {
    setSlider(false);
    setModalData(null);
    // setShowDetails(false);
  };
  const handleShowDetails = () => {
    setShowDetails(!showDetails);
  };
  const curr = Cookies.get("curr");
  const tokenClient = Cookies.get("tokenClient");
  const userType = Cookies.get("user_type");
  useEffect(() => {
    if (tokenClient && userType === "recruiter") {
      setAuthenticated(true);
    }
    // getComment();
  }, []);

  const handleNavigate = (slug) => {
    if (authenticated) {
      navigate(`/candidates/profile/${slug}`);
    }
  };

  const [interviewComments, setInterviewComment] = useState({
    comment: "",
    user_type: "staff",
    candidate_id: props.candidate_id,
    job_id: props.candidateInterviewDetails.job_id,
    process_id: props.candidateInterviewDetails.process_id,
    type: "",
  });

  const [interviewData, setInterviewData] = useState([]);

  const handleShowCommentsModal = async () => {
    try {
      const response = await axios.post(
        BaseAPI + `/admin/candidate/addinterviewcomment`,
        {
          candidate: props.candidate_id,
          job_id: props.candidateInterviewDetails.job_id,
          process_id: props.candidateInterviewDetails.process_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setCommentLogShow(true);
      setInterviewData(response.data.response);
    } catch (error) {
      console.log(error.message);
    }
  };

  const addFeedbackOnInterviewCompletion = async () => {
    let updatedData = {
      ...interviewComments,
      type: "feedback",
    };
    try {
      const response = await axios.post(
        BaseAPI + `/admin/candidate/addinterviewcomment`,
        updatedData,
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
        setInterviewCompletionComment(false);
        props.getData(props.staff_id);
        handleMarkAsComplete();
        setInterviewComment({
          comment: "",
          user_type: "staff",
          candidate_id: props.candidate_id,
          job_id: props.candidateInterviewDetails.job_id,
          process_id: props.candidateInterviewDetails.process_id,
          type: "",
        })
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const addComment = async () => {
    try {
      let updatedData = {
        ...interviewComments,
        type: "comment",
      };
      setCommentLogShow(false);

      const response = await axios.post(
        BaseAPI + `/admin/candidate/addinterviewcomment`,
        updatedData,
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
        }).then(() => {
          setInterviewComment({
            comment: "",
            user_type: "staff",
            candidate_id: props.candidate_id,
            job_id: props.candidateInterviewDetails.job_id,
            process_id: props.candidateInterviewDetails.process_id,
            type: "",
          })
          handleShowCommentsModal();
        });
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleMarkAsComplete = async () => {
    try {
      // console.log("I am from skip trigger");
      const response = await axios.post(
        BaseAPI +
          `/admin/candidate/interviewcompletionstatus/${props.candidateInterviewDetails.id}`,
        {
          candidate_id: props.candidate_id,
          process_id: props.candidateInterviewDetails.process_id,
          job_id: props.candidateInterviewDetails.job_id,
        },
        {
          headers: {
            "Content-Type": "application/json",

            Authorization: "Bearer" + " " + token,
          },
        }
      );
      if (response.data.status === 200) {
        Swal.fire({
          title: "Candidate interview marked as complete",
          icon: "success",
          confirmButtonText: "Close",
        });
        props.getData(props.staff_id);
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDocDownload = async (documentUrl) => {
    // Create an anchor element
    const anchor = document.createElement("a");

    // Set the href attribute to the document URL
    anchor.href = documentUrl;

    // Set the download attribute to force the browser to download the file instead of navigating to it
    anchor.setAttribute("download", "");

    // Hide the anchor element
    anchor.style.display = "none";

    // Append the anchor element to the document body
    document.body.appendChild(anchor);

    // Trigger a click on the anchor element
    anchor.click();

    // Remove the anchor element from the document body after a short delay
    setTimeout(() => {
      document.body.removeChild(anchor);
    }, 100);
  };

  const getStartTime = (id) => {
    switch (id) {
      case "1":
        return "01:00 AM";
      case "2":
        return "02:00 AM";
      case "3":
        return "03:00 AM";
      case "4":
        return "04:00 AM";
      case "5":
        return "05:00 AM";
      case "6":
        return "06:00 AM";
      case "7":
        return "07:00 AM";
      case "8":
        return "08:00 AM";
      case "9":
        return "09:00 AM";
      case "10":
        return "10:00 AM";
      case "11":
        return "11:00 AM";
      case "12":
        return "12:00 PM";
      case "13":
        return "01:00 PM";
      case "14":
        return "02:00 PM";
      case "15":
        return "03:00 PM";
      case "16":
        return "04:00 PM";
      case "17":
        return "05:00 PM";
      case "18":
        return "06:00 PM";
      case "19":
        return "07:00 PM";
      case "20":
        return "08:00 PM";
      case "21":
        return "09:00 PM";
      case "22":
        return "10:00 PM";
      case "23":
        return "11:00 PM";
      case "24":
        return "12:00 AM"; // Note: This is midnight
      default:
        return "";
    }
  };

  const getInterviewDuration = (id) => {
    if (id === "1") {
      return "1 Hour";
    } else {
      return id + " " + "Minutes";
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: -20 }}
        // transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.01 }} // Scale up and change color on hover
        transition={{ type: "spring", stiffness: 300 }}
        className="profileCard"
        style={{
          border:
            props.candidateInterviewDetails.interview_completion_status === 1
              ? "1px solid #5ed973"
              : "1px solid #8db7f5",
        }}
      >
        {" "}
        <div
          className={`card border-none profileCardDetails ${
            showDetails || showComments ? "is-flipped" : ""
          }`}
        >
          <div className="firstSection text-center">
            {props.profile_image ? (
              <Image
                width={100}
                height={100}
                src={props.profile_image}
                alt=""
                className="profileCardImage !object-cover rounded-full my-[10px] ImageCardImage "
              />
            ) : (
              <Image
                width={100}
                height={100}
                src="/Images/adminSide/dummy-profile.png"
                alt=""
                className="profileCardImage rounded-full my-[10px] ImageCardImage"
              />
            )}
          </div>
          <div className="secondSection text-center">
            <h2>
              {props.first_name} {props.last_name}
            </h2>
            <p className="text-muted">
              {props.candidateInterviewDetails.interview_date
                .split("-")
                .reverse()
                .join("-")}
            </p>
            <p className="text-muted">{props.email}</p>
            <p className="text-muted">{props.phone}</p>
          </div>

          {/* Back of the card */}
          <div className="card__face card__face--back">
            {/* Your back card content here */}
            <div className="card__content">
              <i class="fa-solid fa-xmark" onClick={handleShowDetails}></i>
              <div className="card__header">
                <h2 className="" style={{fontSize: "26px"}}>Interview Details</h2>
                {!props.candidateInterviewDetails.interview_date ? (
                  <p className="text-muted">
                    {props.candidateInterviewDetails.interview_date}
                  </p>
                ) : (
                  <div className="interview-details text-xs" >
                    <div className="detail">
                      <span className="key">Process Name:</span>
                      <span className="value">
                        {props.candidateInterviewDetails.process_name}
                      </span>
                    </div>
                    {/* <div className="detail">
                    <span className="key">Round No:</span>
                    <span className="value">
                      {props.candidateInterviewDetails.round
                        ? props.candidateInterviewDetails.round
                        : "N/A"}
                    </span>
                  </div> */}
                    <div className="detail">
                      <span className="key">Interview Type:</span>
                      <span className="value">
                        {props.candidateInterviewDetails.interview_type
                          ? props.candidateInterviewDetails.interview_type
                          : "N/A"}
                      </span>
                    </div>
                    <div className="detail">
                      <span className="key">Interview Details:</span>
                      <span className="value">
                        <Link
                          href={
                            props.candidateInterviewDetails
                              .interview_type_detail
                          }
                          target="_blank"
                        >
                          {props.candidateInterviewDetails
                            .interview_type_detail &&
                            props.candidateInterviewDetails
                              .interview_type_detail}
                        </Link>
                        {!props.candidateInterviewDetails
                          .interview_type_detail && "N/A"}
                      </span>
                    </div>
                    <div className="detail">
                      <span className="key">Interview Date:</span>
                      <span className="value">
                        {props.candidateInterviewDetails.interview_date
                          ? props.candidateInterviewDetails.interview_date
                              .split("-")
                              .reverse()
                              .join("-")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="detail">
                      <span className="key">Start Time:</span>
                      <span className="value">
                        {props.candidateInterviewDetails.start_time
                          ? getStartTime(
                              props.candidateInterviewDetails.start_time
                            )
                          : "N/A"}
                      </span>
                    </div>
                    <div className="detail">
                      <span className="key">Duration:</span>
                      <span className="value">
                        {props.candidateInterviewDetails.duration
                          ? getInterviewDuration(
                              props.candidateInterviewDetails.duration
                            )
                          : "N/A"}
                      </span>
                    </div>
                    <div className="detail">
                      <span className="key">Comment:</span>
                      <span className="value">
                        {props.candidateInterviewDetails.comment
                          ? props.candidateInterviewDetails.comment
                          : "N/A"}
                      </span>
                    </div>
                    <div className="detail">
                      <span className="key">Assigned By:</span>
                      <span className="value">
                        {props.candidateInterviewDetails.assigned_by
                          ? props.candidateInterviewDetails.assigned_by
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              {/* Add other back side content as needed */}
            </div>
          </div>
        </div>
        <div className="fourthSection text-center">
          <div className="process__actionnn" style={{ margin: "10px 0" }}>
            <Button
              variant="primary"
              onClick={() => handleOpen(props)}
              className="btn btn-info btn-xxss bg-danger"
              title="View details"
            >
              <i className="fa fa-eye text-white"></i>
            </Button>

            {/* {modalData && (
            <CandidateModal
              onClose={() => slideClose()}
              profileData={selectedRecord}
            />
          )} */}

            <button
              className="btn  btn-success btn-smmm bg-success"
              title="Add comment"
              //   onClick={() => handleFeedbackModel(params.row.id)}
              onClick={() => setLgShow(true)}
            >
              <i class="fa-solid fa-square-pen text-white"></i>
            </button>
            <Modal
              size="lg"
              show={lgShow}
              onHide={() => setLgShow(false)}
              aria-labelledby="feedback"
            >
              <Modal.Header closeButton className="bg-red-500 text-white">
                <Modal.Title id="feedback " className="provide_feedback">
                  Provide Comment
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="dDrt">
                  <textarea
                    className="form-control border-dark "
                    cols="80"
                    rows="5"
                    // name="comment"
                    value={interviewComments.comment}
                    onChange={(e) =>
                      setInterviewComment({
                        ...interviewComments,
                        comment: e.target.value,
                      })
                    } // setInterviewComment(e.target.value)}
                  ></textarea>
                  <span>
                    <button
                      className="btn btn-primary btn-feedback"
                      onClick={() => {
                        addComment();
                        setLgShow(false);
                      }}
                    >
                      Submit Comment
                    </button>
                  </span>
                </div>
              </Modal.Body>
            </Modal>
            {props.is_interview_scheduled === 0 && (
              <Button
                variant="primary"
                onClick={() => handleOpen(props)}
                className="btn btn-info btn-xxss bg-danger"
                title="Schedule Interview"
              >
                <i class="fa-solid fa-calendar-days"></i>
              </Button>
            )}
            <Button
              variant="primary"
              onClick={() => handleShowCommentsModal()}
              className="btn  btn-success btn-smmm bg-success"
              title="Get comment Logs"
            >
              <i class="fa-solid fa-comment"></i>
            </Button>
            <Modal
              size="lg"
              show={commentLogShow}
              onHide={() => setCommentLogShow(false)}
              aria-labelledby="feedback"
            >
              <Modal.Header closeButton className="bg-red-500 text-white">
                <Modal.Title id="feedback " className="provide_feedback">
                  Comments
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="">
                  {interviewData.length > 0 ? (
                    interviewData?.map((i) => {
                      return (
                        <div>
                          <span className="fw-bold p-2">{i.user_name}</span>:{" "}
                          {i.comment ? i.comment : "N/A"} ({i.created})
                        </div>
                      );
                    })
                  ) : (
                    <p className="fw-normal">No comments found</p>
                  )}
                  <br />

                  <span>
                    <button
                      className="btn btn-primary btn-feedback"
                      onClick={() => setLgShow(true)}
                    >
                      Add Comment
                    </button>
                  </span>
                </div>
              </Modal.Body>
            </Modal>
            {/* Note button */}
            <button
              className="btn btn-primary btn-group"
              title={`Notes for ${props.first_name} ${props.last_name}`}
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
                // Open the modal or trigger UI for notes
                fetchNotes(
                  props.candidate_id,
                  props.first_name,
                  props.last_name
                );
              }}
            >
              <i className="fas fa-sticky-note"></i>
            </button>
            <Button
              variant="primary"
              onClick={handleShowDetails}
              className="btn  btn-success btn-smmm bg-danger"
              title="Get Interview Details"
            >
              <i class="fa-solid fa-info-circle"></i>
            </Button>
          </div>
        </div>
        <div className="fifthSection text-center">
          {props.candidateInterviewDetails.interview_completion_status ===
            null && (
            <>
              <button
                class="interviewNotCompletedbutton"
                role="button"
                // onClick={handleMarkAsComplete}
                onClick={() => setInterviewCompletionComment(true)}
              >
                Mark Interview as completed
              </button>
              <Modal
                size="lg"
                show={interviewCompletionComment}
                onHide={() => setInterviewCompletionComment(false)}
                aria-labelledby="feedback"
              >
                <Modal.Header closeButton className="bg-red-500 text-white">
                  <Modal.Title id="feedback " className="provide_feedback">
                    Feedback and Recommendation
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="dDrt">
                    <textarea
                      className="form-control border-dark "
                      cols="80"
                      rows="5"
                      // name="comment"
                      value={interviewComments.comment}
                      onChange={(e) =>
                        setInterviewComment({
                          ...interviewComments,
                          comment: e.target.value,
                        })
                      } // setInterviewComment(e.target.value)}
                    ></textarea>
                    <span>
                      <button
                        className="btn btn-primary btn-feedback"
                        onClick={() => addFeedbackOnInterviewCompletion()}
                      >
                        Submit
                      </button>
                      <button
                        className="btn btn-primary btn-feedback ms-2"
                        onClick={() => {
                          handleMarkAsComplete();
                          setInterviewCompletionComment(false);
                        }}
                      >
                        Skip
                      </button>
                    </span>
                  </div>
                </Modal.Body>
              </Modal>
            </>
          )}
          {props.candidateInterviewDetails.interview_completion_status ===
            1 && (
            <button
              class="button-33"
              role="button"
              // onClick={handleMarkAsComplete}
            >
              Interview Completed
            </button>
          )}
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
                        <td style={{ padding: "10px" }}>{note.note_title}</td>
                        <td style={{ padding: "10px" }}>{note.user_type}</td>
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
                          {note.user_type !== "employer" && (
                            <Button
                              title="Edit"
                              className="btn btn-warning"
                              onClick={() => handleEdit(note)}
                              style={{ marginRight: "5px" }}
                            >
                              <i className="fas fa-pen"></i>
                            </Button>
                          )}
                          {note.user_type !== "employer" && (
                            <Button
                              variant="contained"
                              color="secondary"
                              title="Delete"
                              className="btn btn-danger"
                              onClick={() => handleDelete(note.id)}
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </Button>
                          )}
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
                      <h6 style={{ width: "120px", margin: 0, color: "#555" }}>
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
                      <h6 style={{ width: "120px", margin: 0, color: "#555" }}>
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

                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                      <h6 style={{ width: "120px", margin: 0, color: "#555" }}>
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
                      <p className="text-danger">{noteFormErrors.note_title}</p>
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
                    <Button variant="primary" onClick={() => handleSave()}>
                      Add
                    </Button>
                  </form>
                </>
              )}
            </Modal.Body>
          </Modal>
        </div>
      </motion.div>
      {modalData && (
        <CandidateModal
          onClose={() => slideClose()}
          profileData={selectedRecord}
        />
      )}
    </>
  );
};

export default ProfileCard;
