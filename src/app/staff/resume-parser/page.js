"use client";
import React, { useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import "../../common.css";
import "@fortawesome/fontawesome-free/css/all.css";
import Swal from "sweetalert2";
import AdminFooter from "../../admin/Components/AdminFooter/AdminFooter";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import StaffLayout from "../StaffLayout";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

const Page = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("tokenStaff");
  let employerId = Cookies.get("employerId");
  let staffId = Cookies.get("staffId");
  const [listData, setListData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const fileInputRef = useRef(null); // Create a ref for the file input
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
  const handleOpen = (eachData) => {
    setSelectedRecord(eachData);
    handleShowModal(eachData);
  };
  const handleShowModal = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };
  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const [parserData, setParsedData] = useState([]);
  // const [filteredParsedData, setFilteredData] = useState({
  //   date_of_birth: "",
  //   education: [],
  //   email: "",
  //   language: "",
  //   linkedIn: "",
  //   name: "",
  //   phone: "",
  //   designation: "",
  //   skills: [],
  //   summary: "",
  //   website: "",
  //   experience: [],
  //   employer_id: Cookies.get("employerId"),
  // });
  const [filteredData, setFilteredData] = useState([]); // Initialize as an empty array
  const [sendFinalData, setSendFinalData] = useState([]);
  // Search functionality

  const [searchKeyword, setSearchKeyword] = useState("");
  const [skills, setSkills] = useState(null);
  const [filteredSkills, setFilteredSkills] = useState([]);

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    // Filter skills based on the keyword
    const filtered = listData.filter((listData) =>
      listData.category_name.toLowerCase().includes(keyword.toLowerCase())
    );
    setSkills(filtered);
    // console.log(filtered);
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearchKeyword("");
    setSkills();
  };

  // const handleUpload = async () => {
  //   if (files.length === 0) {
  //     alert("Please select files to upload.");
  //     return;
  //   }

  //   setUploading(true);

  //   const formData = new FormData();
  //   for (let file of files) {
  //     formData.append("resumes[]", file);
  //   }

  //   try {
  //     // Replace with your actual Laravel API endpoint
  //     const response = await axios.post(
  //       BaseAPI + "/admin/upload-bulk-resumes",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: "Bearer " + token,
  //         },
  //       }
  //     );
  //     setParsedData(response.data.response.data);
  //     setFilteredData((prevData) => {
  //       // Ensure prevData is an array
  //       const currentData = Array.isArray(prevData) ? prevData : [];

  //       // Extract the array of objects from the response
  //       const mappedData = response.data.response.map((item) => {
  //         const data = item.data; // Get the data from each item
  //         return {
  //           education: data.education || null,
  //           experience: data.workExperience || null,
  //           email: data.emails || null,
  //           name: `${data.name.first} ${data.name.last}` || null,
  //           linkedIn: data.linkedin || null,
  //           phone: data.phoneNumbers || null,
  //           summary: data.summary || null,
  //           website: data.websites || null,
  //           language: data.languages || null,
  //           skills: data.skills || null,
  //           designation: data.profession || null,
  //           date_of_birth: data.dateOfBirth || null,
  //         };
  //       });

  //       // Return the new state as an array of objects
  //       return [...currentData, ...mappedData]; // Combine with existing data
  //     });
  //     // console.log("Upload Successful:", response.data.response.data.education);
  //     alert("Resumes uploaded successfully!");
  //     // saveParsedData();
  //   } catch (error) {
  //     console.error("Upload Failed:", error.message);
  //     alert("Failed to upload resumes.");
  //   }

  //   setUploading(false);
  // };

  const handleUpload = async () => {
    if (files.length === 0) {
      // alert("Please select files to upload.");
      Swal.fire({
        title: "Please select files to upload.",
        icon: "warning",
        confirmButtonText: "Close",
      });
      return;
    }

    setUploading(true);

    const formData = new FormData();
    for (let file of files) {
      formData.append("resumes[]", file);
    }

    try {
      const response = await axios.post(
        BaseAPI + "/admin/upload-bulk-resumes",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        }
      );

      const parsedData = response.data.response; // Get the parsed data
      setParsedData(parsedData); // Update the state

      // Prepare the data for saving
      const mappedData = parsedData.map((item) => {
        const data = item.data; // Get the data from each item
        return {
          education: data.education || null,
          experience: data.workExperience || null,
          email: data.emails || null,
          name: `${data.name.first} ${data.name.last}` || null,
          linkedIn: data.linkedin || null,
          phone: data.phoneNumbers || null,
          summary: data.summary || null,
          website: data.websites || null,
          language: data.languages || null,
          skills: data.skills || null,
          designation: data.profession || null,
          date_of_birth: data.dateOfBirth || null,
        };
      });

      // Update filteredData and call saveParsedData with the new data
      setFilteredData((prevData) => [...prevData, ...mappedData]);
      // await saveParsedData(mappedData); // Pass the new data directly

      // alert("Resumes uploaded successfully!");
      Swal.fire({
        icon: "success",
        title: "Resumes uploaded successfully!",
        confirmButtonText: "Close",
      }).then(() => {
        setUploading(false);
      });
      setParsedData([]); // Clear the parsed data state
      // setFilteredData([]); // Clear the filtered data state
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = null; // Reset the input value
      }
    } catch (error) {
      console.error("Upload Failed:", error.message);
      alert("Failed to upload resumes.");
    }

    setUploading(false);
  };

  useEffect(() => {
    if (filteredData.length > 0) {
      saveParsedData(filteredData);
    }
  }, [filteredData]);

  const saveParsedData = async () => {
    try {
      console.log("saveParsedData:", filteredData);
      const updatedData = {
        employer_id: Cookies.get("employerId"),
        candidates: filteredData,
      };
      const response = await axios.post(
        BaseAPI + "/admin/save-parsed-data",
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("saveParsedData:", response.data.response);
      setFilteredData([]);
      getFinalListing();
    } catch (error) {
      console.error("saveParsedData Failed:", error);
    }
  };

  const getFinalListing = async () => {
    try {
      const response = await axios.post(
        BaseAPI + "/admin/parsed-candidate-list",
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      setFilteredData([]);
      setListData(response.data.response);
    } catch (error) {
      console.error("getFinalListing Failed:", error);
    }
  };

  useEffect(() => {
    getFinalListing();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(
        BaseAPI + `/admin/delete-parsed-data`,
        { id: id, employer_id: employerId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      if (response.data.status === 200) {
        Swal.fire({
          title: response.data.message,
          icon: "success",
          confirmButtonText: "Close",
        });
        getFinalListing();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleMultipleDelete = async () => {
    if (selectedIds.length === 0) {
      Swal.fire({
        title: "Please select at least one candidate to delete.",
        icon: "warning",
        confirmButtonText: "Close",
      });
      return;
    }
    try {
      const confirmationResult = await Swal.fire({
        title: "Delete?",
        text: "Do you want to Delete these Candidates?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        const idList = selectedIds.map((id) => id.toString()); // Ensure IDs are strings

        console.log(idList);
        setLoading(true);
        const response = await axios.post(
          BaseAPI + "/admin/parsed-candidate-list",
          {
            idList: idList.join(","),
            action: "delete",
          }, // Pass null as the request body if not required
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
            title: "Candidates Deleted successfully!",
            icon: "success",
            confirmButtonText: "Close",
          });
        } else {
          Swal.fire({
            title: "Couldn't Delete!",
            icon: "error",
            confirmButtonText: "Close",
          });
        }
        getFinalListing();
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed. Please try after some time!",
        text: "Could not Delete Candidates",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Couldn't Delete the record!", error.message);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 340,
      flex: 1,
      headerClassName: "redText",
    },
    {
      field: "email",
      headerName: "Email Address",
      width: 240,
      flex: 1,
      headerClassName: "redText",
    },

    {
      field: "phone",
      headerName: "Phone Number",
      width: 240,
      flex: 1,
      headerClassName: "redText",
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "redText",
      width: 293,
      flex: 1,
      renderCell: (params) => (
        <div className="process__actionnn" style={{ margin: "10px 0px" }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={(e) => {
              handleOpen(params.row);
              e.stopPropagation(); // Prevents event bubbling
            }}
            title="View all Details"
            className="btn btn-danger btn-Deleteee"
          >
            <i className="fa-solid fa-eye"></i>
          </Button>

          {/* {params.row.employer_id !== 0 && (
            <Link
              href={`categories/edit/${params.row.slug}`}
              title="Edit"
              className="btn btn-warning btn-Edittt"
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
              }}
            >
              <i className="fa-solid fa-square-pen"></i>
            </Link>
          )} */}
          {userAccess[9]?.Delete === 1 && (
            <Button
              variant="contained"
              color="secondary"
              onClick={(e) => {
                handleDelete(params.row.id);
                e.stopPropagation(); // Prevents event bubbling
              }}
              title="Delete"
              className="btn btn-warning btn-Edittt"
            >
              <i className="fa-solid fa-trash-can"></i>
            </Button>
          )}
        </div>
      ),
    },
  ];

  const rows = skills
    ? skills?.map((i) => ({
        id: i.id,
        employer_id: i.employer_id,
        name: i.name,
        date_of_birth: i.date_of_birth,
        education: i.education,
        experience: i.experience,
        email: i.email,
        linkedIn: i.linkedIn,
        phone: i.phone,
        summary: i.summary,
        website: i.website,
        language: i.language,
        skills: i.skills,
        designation: i.designation,
      }))
    : listData?.map((item) => ({
        id: item.id,
        employer_id: item.employer_id,
        name: item.name,
        date_of_birth: item.date_of_birth,
        education: item.education,
        experience: item.experience,
        email: item.email,
        linkedIn: item.linkedIn,
        phone: item.phone,
        summary: item.summary,
        website: item.website,
        language: item.language,
        skills: item.skills,
        designation: item.designation,
      }));

  return (
    <>
      <StaffLayout>
        {loading && <div className="loader-container"></div>}
        <div
          className=" backgroundColour adminChangeUsername"
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
              <div className="flex gap-2 items-center">
                <i class="fa-solid fa-clipboard-check"></i>
                <span>Resume Parser</span>
              </div>
            </div>
          </div>
          {userAccess[9]?.Upload === 1 && (
            <div className="resumeUploader">
              <h2>Bulk Resume Upload</h2>
              <div className="resumeInputbox">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  ref={fileInputRef} // Attach the ref to the input
                />
              </div>
              <span className="text-muted text-sm">
                Select only 10MB files or less to upload for a smooth experience
              </span>

              <div className="resumeUploadButton">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="btn themeButton1"
                >
                  {uploading ? "Uploading..." : "Upload Resumes"}
                </button>
              </div>
            </div>
          )}

          <div className="interviewPreviewTable TableScroll">
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 20 },
                  },
                }}
                pageSizeOptions={[20, 30]}
                checkboxSelection
                onRowSelectionModelChange={(newRowSelectionModel) => {
                  setSelectedIds(newRowSelectionModel);
                  console.log(selectedIds);
                  // console.log("object")
                }}
                rowSelectionModel={selectedIds}
                {...listData}
                isRowSelectable={(params) => params.row.employer_id !== 0}
              />
            </div>
            <div className="BottomButtom">
              {/* <button
                  className="btn btn-dark btn-Activateee"
                  onClick={() => handleMultipleActivate()}
                >
                  Activate
                </button> */}
              {/* <button
                  className="btn btn-dark btn-Activateee"
                  onClick={() => handleMultipleDeactivate()}
                >
                  Deactivate
                </button> */}
              <button
                className="btn btn-dark btn-Activateee"
                onClick={() => handleMultipleDelete()}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        {/* candidate details */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton className="bg-red-500 text-white">
            <Modal.Title>Details of {selectedRecord?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedRecord && (
              <div>
                <div className="dDrt flex align-items-center">
                  {/* <span>Profile Image :</span> */}
                  {/* {selectedRecord.profile_image !== "" ? (
                    <Image
                      src={selectedRecord.profile_image}
                      alt="profile-image"
                      width={190}
                      height={50}
                      className="modalProfileImage"
                    />
                  ) : (
                    <Image
                      src="/Images/adminSide/dummy-profile.png"
                      alt="profile-image"
                      width={130}
                      height={30}
                      className="modalProfileImage"
                      style={{ borderRadius: "50%" }}
                    />
                  )} */}
                </div>
                <div className="dDrt">
                  <span>Name: </span>
                  {selectedRecord && selectedRecord.name}
                </div>

                <div className="dDrt">
                  <span>Email :</span>
                  {selectedRecord && selectedRecord.email}
                </div>
                <div className="dDrt">
                  <span>Phone : </span>
                  {selectedRecord && selectedRecord.phone
                    ? selectedRecord.phone
                    : "N/A"}
                </div>
                <div className="dDrt">
                  <span>Date Of Birth : </span>
                  {selectedRecord && selectedRecord.date_of_birth
                    ? selectedRecord.date_of_birth
                    : "N/A"}
                </div>
                <div className="dDrt">
                  <span>Gender : </span>
                  {selectedRecord.gender}
                </div>
                <div className="dDrt">
                  <span>Designation : </span>
                  {selectedRecord.designation
                    ? selectedRecord.designation
                    : "N/A"}
                </div>
                <div className="dDrt">
                  <span>Martial Status : </span>
                  Married
                </div>
                <div className="dDrt">
                  <span>Physically Challenged : </span>
                  {selectedRecord.physically_challenged}
                </div>
                <div className="dDrt">
                  <span>Address : </span>
                  {selectedRecord.address ? selectedRecord.address : "N/A"}
                </div>
                <div className="dDrt">
                  <span>Language : </span>
                  {selectedRecord.language ? selectedRecord.language : "N/A"}
                </div>
                <div className="dDrt">
                  <span>LinkedIn : </span>
                  {selectedRecord.linkedIn ? selectedRecord.linkedIn : "N/A"}
                </div>
                <div className="dDrt">
                  <span>Skills : </span>
                  {/* {selectedRecord.skills ? selectedRecord.skills : "N/A"} */}
                </div>
                <div className="dDrt">
                  <span>Summary : </span>
                  {selectedRecord.summary ? selectedRecord.summary : "N/A"}
                </div>
                <div className="dDrt">
                  <span>Website : </span>
                  {selectedRecord.website ? selectedRecord.website : "N/A"}
                </div>
                <div className="dDrt">
                  ------------------------------------------
                </div>
                <div className="dDrt modalSubHeader">
                  <h4>Education Qualification</h4>
                </div>
                {selectedRecord.education?.map((i) => {
                  return (
                    <>
                      <div className="dDrt">
                        <span>Qualification : </span>
                        {i.accreditation.education}
                      </div>

                      <div className="dDrt">
                        <span>Grades : </span>
                        {i.grade?.value ? i.grade?.value : "N/A"}
                      </div>
                      <div className="dDrt">
                        <span>Organization : </span>
                        {i.organization}
                      </div>
                      <div className="dDrt">
                        <span>City : </span>
                        {i.location?.formatted ? i.location?.formatted : "N/A"}
                      </div>
                      {/* <div className="dDrt">
                        <span>University : </span>
                        {i.university_board}
                      </div>
                      <div className="dDrt">
                        <span>Year of passing : </span>
                        {i.passing_year}
                      </div> */}
                      <div className="dDrt">
                        ------------------------------------------
                      </div>
                    </>
                  );
                })}

                <div className="dDrt modalSubHeader">
                  <h4>Experience Details</h4>
                </div>
                {selectedRecord.experience?.map((i) => {
                  return (
                    <>
                      {/* <div className="dDrt">
                        <span>Date from : </span>
                        {i.dates.startDate.split("-").reverse().join("-")}
                      </div>
                      <div className="dDrt">
                        <span>Date to : </span>
                        {i.dates.endDate.split("-").reverse().join("-")}
                      </div> */}

                      <div className="dDrt">
                        <span>Name of organization : </span>
                        {i.organization}
                      </div>
                      <div className="dDrt">
                        <span>Date : </span>
                        {i.dates?.rawText ? i.dates.rawText : "N/A"}
                      </div>
                      <div className="dDrt">
                        <span>Designation : </span>
                        {i.jobTitle ? i.jobTitle : "N/A"}
                      </div>
                      <div className="dDrt">
                        <span>Location : </span>
                        {i.location?.formatted ? i.location.formatted : "N/A"}
                      </div>
                      {/* <div className="dDrt">
                        <span>Reason of leaving : </span>
                        {i.reason_of_leaving}
                      </div> */}
                      <div className="dDrt">
                        ------------------------------------------
                      </div>
                    </>
                  );
                })}

                {/* <div className="dDrt modalSubHeader">
                  <h4>Additional Details</h4>
                </div>
                <div className="dDrt">
                  <span>CV Document : </span>
                  <Link
                    href={selectedRecord.cv_document}
                    target="_blank"
                    style={{ color: "blue" }}
                  >
                    Download
                  </Link>
                </div> */}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <AdminFooter />
      </StaffLayout>
    </>
  );
};

export default Page;
