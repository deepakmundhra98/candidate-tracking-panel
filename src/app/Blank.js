"use client";
import React from "react";
import Link from "next/link";
import "../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useState, useEffect } from "react";
import AdminFooter from "../../admin/Components/AdminFooter/AdminFooter";
import EmployerLayout from "../EmployerLayout";
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
// import CustomizedTimeline from "@/app/admin/Components/Timeline/Timeline";
import { set } from "date-fns";
import SwipeableEdgeDrawer from "../Components/SwipeableDrawer";
import HTMLReactParser from "html-react-parser";
// import CandidateModal from "@/app/Components/CandidateModal/CandidateModal";
// import JobModal from "@/app/Components/JobModal/JobModal";
import { Tooltip } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
// Dynamically import modals to reduce initial bundle size
const CandidateModal = dynamic(() => import("@/app/Components/CandidateModal/CandidateModal"), { ssr: false });
const JobModal = dynamic(() => import("@/app/Components/JobModal/JobModal"), { ssr: false });
const CustomizedTimeline = dynamic(() => import("@/app/admin/Components/Timeline/Timeline"), { ssr: false });
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
    const queryClient = useQueryClient();
    const tokenEmployer = Cookies.get("tokenEmployer");
  
    // State management
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [interviewJourney, setInterviewJourney] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [jobModal, setJobModal] = useState(false);
    const [jobModalData, setJobModalData] = useState(null);
    const [mdShow, setMdShow] = useState(false);
    const [lgShow, setLgShow] = useState(false);
    const [rejectModal, setRejectModal] = useState(false);
    const [stepsData, setStepsData] = useState([]);
    const [commentLogs, setCommentLogs] = useState([]);
    const [commentData, setCommentData] = useState({
      candidate_id: "",
      comment: "",
      job_id: "",
    });
    const [rejectFeedbackData, setRejectFeedbackData] = useState({
      status: "",
      candidate_id: "",
      reason: "",
    });
    const [sendRejectionMessage, setSendRejectionMessage] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
  
    // Fetch candidates data with React Query
    const { data, isLoading, error } = useQuery({
      queryKey: ["candidates", page, pageSize],
      queryFn: async () => {
        const response = await axios.post(
          `${BaseAPI}/admin/candidates/listing`,
          { page, pageSize }, // Add pagination params
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenEmployer}`,
            },
          }
        );
        return response.data.response;
      },
      keepPreviousData: true, // Keep previous data while fetching new
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
  
    // Memoize userData, statusData, processData, and user
    const userData = useMemo(() => data?.candidatesData || [], [data]);
    const statusData = useMemo(() => data?.statusList || [], [data]);
    const processData = useMemo(() => data?.processList || [], [data]);
    const user = useMemo(() => data?.user || [], [data]);
  
    // Debounced search handler
    const handleSearch = useCallback(
      debounce((keyword) => {
        setSearchKeyword(keyword);
      }, 300),
      []
    );
  
    // Memoize filtered skills
    const filteredSkills = useMemo(() => {
      if (!searchKeyword) return userData;
      return userData.filter((item) =>
        `${item.first_name} ${item.last_name}`
          .toLowerCase()
          .includes(searchKeyword.toLowerCase())
      );
    }, [searchKeyword, userData]);
  
    // Memoize rows for DataGrid
    const rows = useMemo(
      () =>
        filteredSkills.map((item) => ({
          id: item.candidate_id,
          job_id: item.job_id,
          name: `${item.first_name} ${item.last_name}`,
          mail: item.email_address,
          appliedDate: item.applied_date,
          interview_status: item.interview_status,
          process_name: item.process_name,
          process_id: item.process_id,
          jobname: item.jobAppliedFor,
          jobData: item.jobData,
          latest_interview_status: item.latest_interview_status,
        })),
      [filteredSkills]
    );
  
    // Handle clear filters
    const handleClearFilters = useCallback((e) => {
      e.preventDefault();
      setSearchKeyword("");
    }, []);
  
    // Fetch interview journey
    const fetchInterviewJourney = useMutation({
      mutationFn: async ({ candidate_id, job_id }) => {
        const response = await axios.post(
          `${BaseAPI}/admin/getinterviewjourneystatus`,
          { candidate_id, job_id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenEmployer}`,
            },
          }
        );
        return response.data.response;
      },
      onSuccess: (data, variables) => {
        setStepsData(data);
        setSelectedRecord({ id: variables.candidate_id, job_id: variables.job_id });
        setInterviewJourney(true);
      },
      onError: (error) => {
        Swal.fire({
          title: "Failed to fetch interview journey",
          text: error.message,
          icon: "error",
          confirmButtonText: "Close",
        });
      },
    });
  
    // Change status to reject
    const changeStatusToReject = useMutation({
      mutationFn: async () => {
        const updatedData = {
          ...rejectFeedbackData,
          sendRejectionMessage,
        };
        const response = await axios.post(
          `${BaseAPI}/admin/candidates/statuschange/${rejectFeedbackData.candidate_id}`,
          updatedData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenEmployer}`,
            },
          }
        );
        return response.data;
      },
      onSuccess: () => {
        setRejectModal(false);
        Swal.fire({
          title: "Status Changed successfully!",
          icon: "success",
          confirmButtonText: "Close",
        });
        queryClient.invalidateQueries(["candidates"]);
      },
      onError: (error) => {
        Swal.fire({
          title: "Failed to change status",
          text: error.message,
          icon: "error",
          confirmButtonText: "Close",
        });
      },
    });
  
    // Handle status change
    const handleStatusChange = useCallback(
      async (e, candidateId) => {
        const id = e.target.value;
        if (!id) return;
        if (id === "9") {
          setRejectModal(true);
          setRejectFeedbackData({ status: id, candidate_id: candidateId });
          return;
        }
        try {
          const response = await axios.post(
            `${BaseAPI}/admin/candidates/statuschange/${candidateId}`,
            { status: id },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenEmployer}`,
              },
            }
          );
          if (response.data.status === 200) {
            Swal.fire({
              title: "Status Changed successfully!",
              icon: "success",
              confirmButtonText: "Close",
            });
            queryClient.invalidateQueries(["candidates"]);
          }
        } catch (error) {
          Swal.fire({
            title: "Failed to change status",
            text: error.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
      },
      [queryClient]
    );
  
    // Get status name
    const getStatusName = useCallback(
      (statusId) => {
        const status = statusData.find((status) => status.id == statusId);
        return status ? status.status_name : null;
      },
      [statusData]
    );
  
    // Handle interview scheduling
    const handleInterview = useCallback((candidateId, jobId) => {
      Cookies.set("job_id", jobId);
      router.push(`/employer/jobs/scheduleinterview/${candidateId}`);
    }, [router]);
  
    // Comment-related functions
    const fetchDataForComment = useCallback((candidate_id, job_id) => {
      setCommentData({ candidate_id, comment: "", job_id });
    }, []);
  
    const addComment = useMutation({
      mutationFn: async () => {
        const response = await axios.post(
          `${BaseAPI}/admin/candidate/addcomment`,
          commentData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenEmployer}`,
            },
          }
        );
        return response.data;
      },
      onSuccess: () => {
        setLgShow(false);
        setCommentData({ candidate_id: "", comment: "", job_id: "" });
        Swal.fire({
          title: "Comment Added successfully!",
          icon: "success",
          confirmButtonText: "Close",
        });
        queryClient.invalidateQueries(["candidates"]);
      },
      onError: (error) => {
        Swal.fire({
          title: "Failed to add comment",
          text: error.message,
          icon: "error",
          confirmButtonText: "Close",
        });
      },
    });
  
    const getCommentLogs = useMutation({
      mutationFn: async ({ candidate_id, job_id, process_id }) => {
        const response = await axios.post(
          `${BaseAPI}/admin/candidate/getcommentlogs/${candidate_id}`,
          { job_id, comment_log_type: "all", process_id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenEmployer}`,
            },
          }
        );
        return response.data.response;
      },
      onSuccess: (data) => {
        setCommentLogs(data);
        setMdShow(true);
      },
      onError: (error) => {
        Swal.fire({
          title: "Failed to fetch comment logs",
          text: error.message,
          icon: "error",
          confirmButtonText: "Close",
        });
      },
    });
  
    // Modal handlers
    const handleOpen = useCallback((eachData) => {
      setSelectedRecord(eachData);
      setShowModal(true);
    }, []);
  
    const handleCloseModal = useCallback(() => {
      setShowModal(false);
      setSelectedRecord(null);
    }, []);
  
    const handleJobOpen = useCallback((eachData) => {
      setJobModal(true);
      setJobModalData(eachData);
    }, []);
  
    const handleCloseJobModal = useCallback(() => {
      setJobModal(false);
      setJobModalData(null);
    }, []);
  
    // DataGrid columns
    const columns = useMemo(
      () => [
        {
          field: "name",
          headerName: "Name",
          width: 130,
          renderCell: ({ row }) => (
            <div
              className="text-primary cursor-pointer"
              onClick={() => handleOpen(row)}
            >
              {row.name}
            </div>
          ),
        },
        { field: "mail", headerName: "Email", width: 200 },
        {
          field: "jobname",
          headerName: "Job Name",
          width: 130,
          renderCell: ({ row }) => (
            <div
              className="text-primary cursor-pointer"
              onClick={() => handleJobOpen(row.jobData)}
            >
              {row.jobname}
            </div>
          ),
        },
        { field: "appliedDate", headerName: "Applied Date", width: 130 },
        {
          field: "currentStatus",
          headerName: "Current Status",
          width: 150,
          renderCell: ({ row }) => (
            <>
              {row.interview_status ? (
                <div className="text-black fw-bold ms-2">
                  {getStatusName(row.interview_status)}
                </div>
              ) : (
                <>
                  {row.latest_interview_status?.process_name ? (
                    <Tooltip
                      title={
                        <span style={{ fontSize: "12px", width: "200px" }}>
                          Last Interview scheduled:{" "}
                          <b>{row.latest_interview_status.process_name}</b> <br />
                          Status: <b>{row.latest_interview_status.completion_status}</b>
                        </span>
                      }
                      placement="right"
                    >
                      <div className="text-yellow-500 fw-bold ms-2">
                        {row.latest_interview_status.process_name}
                      </div>
                    </Tooltip>
                  ) : (
                    <div className="text-green-700 fw-bold ms-2">New!</div>
                  )}
                </>
              )}
            </>
          ),
        },
        {
          field: "status",
          headerName: "Change Status",
          width: 170,
          renderCell: ({ row }) => (
            <>
              {row.interview_status === "9" ? (
                <div className="text-danger fw-bold ms-2">Rejected</div>
              ) : (
                <select
                  className="form-select shadow-none"
                  onChange={(e) => handleStatusChange(e, row.id)}
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
        {
          field: "action",
          headerName: "Action",
          width: 243,
          renderCell: ({ row }) => (
            <div className="process__actionnn flex gap-2">
              <Button
                variant="primary"
                onClick={() => handleOpen(row)}
                className="btn btn-info btn-xxss"
                title="view"
              >
                <i className="fa fa-eye"></i>
              </Button>
              <button
                className="btn btn-success btn-smmm"
                title="Add Comment"
                onClick={() => {
                  fetchDataForComment(row.id, row.job_id);
                  setLgShow(true);
                }}
              >
                <i className="fa-solid fa-square-pen"></i>
              </button>
              <button
                className="btn btn-info btn-xxss"
                title="Comment Log"
                onClick={() =>
                  getCommentLogs.mutate({
                    candidate_id: row.id,
                    job_id: row.job_id,
                    process_id: row.process_id,
                  })
                }
              >
                <FormatListBulletedIcon sx={{ fontSize: 20 }} />
              </button>
              <button
                className="btn btn-primary btn-group"
                title="Interview Journey"
                onClick={() =>
                  fetchInterviewJourney.mutate({
                    candidate_id: row.id,
                    job_id: row.job_id,
                  })
                }
              >
                <i className="fa-solid fa-route"></i>
              </button>
              {row.interview_status !== "8" && row.interview_status !== "9" && (
                <button
                  className="btn btn-xxxxxss"
                  title="schedule interview"
                  onClick={() => handleInterview(row.id, row.job_id)}
                >
                  <i className="fas fa-users"></i>
                </button>
              )}
            </div>
          ),
        },
      ],
      [handleOpen, handleJobOpen, getStatusName, handleStatusChange, handleInterview, fetchDataForComment, getCommentLogs, fetchInterviewJourney]
    );
  
    return (
      <EmployerLayout>
        <div className="backgroundColor adminChangeUsername" style={{ minHeight: "80vh" }}>
          <div className="breadCumb1">
            <div className="flex gap-3 items-center">
              <Link href="/employer/dashboard">
                <div className="flex gap-2 items-center">
                  <i className="fa-solid fa-gauge"></i>
                  <span>
                    Dashboard <i className="fa-solid fa-angles-right text-xs"></i>
                  </span>
                </div>
              </Link>
              <div className="flex gap-2 items-center">
                <i className="fa-solid fa-users"></i>
                <span>Candidates List</span>
              </div>
            </div>
          </div>
          <div className="profilelogo">
            <h2>Candidates List</h2>
          </div>
          <div className="serachKeyItems bg-white p-4">
            <form>
              <p>Search Candidate by Name</p>
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  className="form-control w-full md:w-1/2"
                  placeholder="Search By Keyword"
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <button
                  className="btn btn-clearFilters"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </form>
          </div>
          <div className="interviewPreviewTable TableScroll">
            {isLoading ? (
              <div className="p-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} variant="rectangular" height={60} className="mb-2" />
                ))}
              </div>
            ) : error ? (
              <div className="text-red-500 text-center p-4">
                Failed to load data. <button onClick={() => queryClient.invalidateQueries(["candidates"])}>Retry</button>
              </div>
            ) : (
              <DataGrid
                rows={rows}
                columns={columns}
                pagination
                paginationMode="server"
                rowCount={data?.totalCount || 0}
                page={page}
                pageSize={pageSize}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                pageSizeOptions={[5, 10, 20, 50]}
                checkboxSelection
                disableSelectionOnClick
              />
            )}
            {showModal && (
              <CandidateModal
                onClose={handleCloseModal}
                profileData={selectedRecord}
              />
            )}
            {jobModal && (
              <JobModal
                onClose={handleCloseJobModal}
                jobData={jobModalData}
              />
            )}
            <Modal
              size="lg"
              show={mdShow}
              onHide={() => setMdShow(false)}
              aria-labelledby="comment-log-modal"
            >
              <Modal.Header closeButton className="bg-red-500 text-white">
                <Modal.Title id="comment-log-modal">Comment Log</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {getCommentLogs.isLoading ? (
                  <Skeleton variant="text" height={100} />
                ) : commentLogs.length > 0 ? (
                  commentLogs.map((log, index) => (
                    <div key={index} className="mb-4">
                      <div><span>Job Name: </span>{log.job_name || "Job not found"}</div>
                      <div><span>Interview Process Name: </span>{log.process_name || "Process name not found"}</div>
                      <div><span>Comment By: </span>{log.user_name} {log.user_type === "staff" ? "(Staff)" : "(Employer)"}</div>
                      <div><span>Comment: </span><b>{log.comment}</b></div>
                      <div><span>Date: </span>{log.created}</div>
                      <div><span>Time: </span>{log.created_time}</div>
                      <hr className="my-2" />
                    </div>
                  ))
                ) : (
                  <div>No Comments Found</div>
                )}
              </Modal.Body>
            </Modal>
            <AnimatePresence>
              {interviewJourney && (
                <>
                  <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  />
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
                        setSelectedRecord(null);
                      }}
                      aria-labelledby="interview-journey-modal-title"
                      dialogClassName="max-w-5xl w-full"
                    >
                      <Modal.Header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg shadow-md">
                        <Modal.Title id="interview-journey-modal-title" className="text-lg font-semibold">
                          Interview Journey Status for {selectedRecord?.name}
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
                        {fetchInterviewJourney.isLoading ? (
                          <Skeleton variant="rectangular" height={200} />
                        ) : (
                          <CustomizedTimeline stepsData={stepsData} />
                        )}
                      </Modal.Body>
                    </Modal>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
        <AdminFooter />
      </EmployerLayout>
    );
  };

export default Page;
