"use client";
import React from "react";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";
import "../../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GroupIcon from "@mui/icons-material/Group";
import { useState } from "react";
import AdminFooter from "../../../admin/Components/AdminFooter/AdminFooter";
import EmployerLayout from "../../EmployerLayout";

const Page = () => {


  const [loading, setLoading] = useState(false)

  const columns = [
    { field: "firstname", headerName: "First Name", width: 120 },
    { field: "lastname", headerName: "Last Name", width: 120 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "createat", headerName: "Created At", width: 150 },
    {
      field: "changestatus",
      headerName: "Change Status",
      width: 150,
      renderCell: (params) => (
        <strong>
          <button onClick={() => console.log(params.row.jobtitle)}>
            <select>
              <option>Applied</option>
              <option>Interview</option>
              <option>Shortlist</option>
              <option>Offer</option>
              <option>Not applicable</option>
            </select>
          </button>
        </strong>
      ),
    },

    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <strong>
          <button onClick={() => console.log(params.row.jobtitle)}>
            <div className="process__actionnn">
              <button className="btn  btn-info btn-xxss" title="view">
                <i className="fa fa-eye"></i>
              </button>

              <button
                className="btn  btn-success btn-smmm"
                title="iinterview feedback"
              >
                <i class="fa-solid fa-square-pen"></i>
              </button>
              <button
                className="btn  btn-info btn-xxss"
                title="interview status"
              >
                <FormatListBulletedIcon sx={{ fontSize: 20 }} />
              </button>
              <Link
                href="/staff/jobs/scheduleinterview"
                className="btn btn-xxxxxss"
                title="schedule interview"
              >
                <GroupIcon />
              </Link>
            </div>
          </button>
        </strong>
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      firstname: "	fdsdsf",
      lastname: "fdsdsf",
      email: "dsf@fdgdfg.dfgd",
      createat: "December 28, 2023",
      changestatus: "",
    },
  ];

  // const navigate = useNavigate();

  const [userData, setUserData] = useState({
    qualificationName: "",
  });

  const [errors, setErrors] = useState({
    qualificationName: "",
  });

  const [sidebarDisplay, setSidebarDisplay] = useState(false);
  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const handleClick = async () => {
    try {
      const newErrors = {};

      if (userData.qualificationName === "") {
        newErrors.qualificationName = "Qualification name is required";
      }

      setErrors(newErrors);

      //   if (Object.keys(newErrors).length === 0) {
      //     const confirmationResult = await Swal.fire({
      //       title: "Add?",
      //       text: "Do you want to add Qualification Name?",
      //       icon: "question",
      //       showCancelButton: true,
      //       confirmButtonText: "Yes",
      //       cancelButtonText: "No",
      //     });
      // if (confirmationResult.isConfirmed) {
      //   setLoading(true);
      //   const response = await axios.post(
      //     BaseApi + "/admin/changePassword",
      //     userData,
      //     {
      //       headers: {
      //         "Content-Type": "application/json",
      //         // key: ApiKey,
      //         // token: tokenKey,
      //         // adminid: adminID,
      //       },
      //     }
      //   );
      //   setLoading(false);
      //   if (response.data.status === 200) {
      //     Swal.fire({
      //       title: "Password updated successfully!",
      //       icon: "success",
      //       confirmButtonText: "Close",
      //     });
      //     setUserData({
      //       ...userData,
      //       old_password: "",
      //       new_password: "",
      //       conf_password: "",
      //     });
      //     window.scrollTo(0, 0);
      //   } else if (response.data.status === 500) {
      //     Swal.fire({
      //       title: response.data.message,
      //       icon: "error",
      //       confirmButtonText: "Close",
      //     });
      //   } else {
      //     Swal.fire({
      //       title: response.data.message,
      //       icon: "error",
      //       confirmButtonText: "Close",
      //     });
      //   }
      // }
      //   }
    } catch (error) {
      //   setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not add qualification name",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };
  return (
    <>
      <EmployerLayout>
        {loading && <div className="loader-container"></div>}
        <div className="adminChangeUsername" style={{ minHeight: '80vh' }}>
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
                <i class="fa-solid fa-user"></i>
                <span> Applied Candidates list</span>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="profilelogo">
              <h2> Applied Candidates list</h2>
            </div>

            <div className="serachKeyItems bg-white">
              <form action="">
                <p>Search Candidate by Name, Email, Contact</p>
                <div className="serachBykeyword">
                  <input
                    type="text"
                    className="formm-control"
                    placeholder="Search By Keyword"
                  />
                  <div className="searchBtn">
                    {/* <button className="btn btn-serach">SEARCH</button> */}
                    <button className="btn btn-clearFilters">
                      Clear Filters
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="interviewPreviewTable ">
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
            </div>
          </div>
        </div>
        <AdminFooter />
      </EmployerLayout>
    </>
  );
};

export default Page;
