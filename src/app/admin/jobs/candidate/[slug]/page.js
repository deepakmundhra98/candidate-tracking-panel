"use client";
import React from "react";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";
import "../../../../common.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GroupIcon from "@mui/icons-material/Group";
import { useState, useEffect } from "react";
import AdminFooter from "../../../Components/AdminFooter/AdminFooter";
import AdminLayout from "../../../AdminLayout";
import Cookies from "js-cookie";
import BaseAPI from "../../../../BaseAPI/BaseAPI";
import axios from "axios";
import Swal from "sweetalert2";

const Page = ({params}) => {

  const slug = params.slug;
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const token = Cookies.get("token");

  const [searchKeyword, setSearchKeyword] = useState("");
  const [skills, setSkills] = useState(null);
  const [filteredSkills, setFilteredSkills] = useState([]);






  console.log(slug,"bahar")
  const getData = async () => {

    try {
      const response = await axios.post(
        BaseAPI + `/admin/jobs/getappliedcandidatelist/${slug}`,
        null,
        {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setUserData(response.data.response);
      console.log(response.data.response)
      

      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };




  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    // Filter skills based on the keyword
    const filtered = userData.filter((userData) =>
      userData.job_name.toLowerCase().includes(keyword.toLowerCase())
    );
    setSkills(filtered);
    // console.log(filtered);
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearchKeyword("");
    setSkills();
  };

  const columns = [
    
    { field: " firstName", headerName: "First Name", width: 120 },
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
              <button className="btn  btn-info btn-xxss" title="view"  onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
              }}>
                <i className="fa fa-eye"></i>
              </button>

              <button
                className="btn  btn-success btn-smmm"
                title="iinterview feedback"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents event bubbling
                }}
              >
                <i class="fa-solid fa-square-pen"></i>
              </button>
              <button
                className="btn  btn-info btn-xxss"
                title="interview status"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents event bubbling
                }}
              >
                <FormatListBulletedIcon sx={{ fontSize: 20 }} />
              </button>
              <Link
                href={`/admin/jobs/scheduleinterview/${params.row.slug}`}
                className="btn btn-xxxxxss"
                title="schedule interview"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents event bubbling
                }}
              >
                <GroupIcon />
              </Link>
            </div>
          </button>
        </strong>
      ),
    },
  ];

  const rows = skills
    ? skills.map((i) => ({
      id: i.id,
      candidate_id: i.candidate_id,
        job_id: i.job_id,
        firstName: i.first_name,
        lastname: i.last_name,
        email: i.email,
        createat: i.created_at,
        status: i.status,
        slug: i.slug,
        interview_status: i.interview_status,
        process_name: i.process_name,
        user: i.username,
        phone: i.phone,
        dob: i.dateofbirth,
        address: i.address,
        gender: i.gender,
      }))
    :  userData.map((item) => ({
      id: item.id,
        employer_id: item.employer_id,
        candidate_id: item.candidate_id,
        job_id: item.job_id,
        firstName: item.first_name,
        lastname: item.last_name,
        email: item.email,
        createat: item.created_at,
        status: item.status,
        slug: item.slug,
        interview_status: item.interview_status,
        process_name: item.process_name,
        user: item.username,
        phone: item.phone,
        dob: item.dateofbirth,
        address: item.address,
        gender: item.gender,
      }));

  // const navigate = useNavigate();




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
 

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <AdminLayout>
        {loading && <div className="loader-container"></div>}
        <div className="adminChangeUsername" style={{ minHeight: '80vh' }}>
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
      </AdminLayout>
    </>
  );
};

export default Page;
