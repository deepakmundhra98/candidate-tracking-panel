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
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Image from "next/image";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import HTMLReactParser from "html-react-parser";
import "@/app/employer/employer.css";

const Page = () => {
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const token = Cookies.get("tokenEmployer");
  const router = useRouter();

  const handleOpen = (eachData) => {
    setSelectedRecord(eachData);
    handleShowModal(eachData);
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + "/admin/emailtemplate/index",
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setLoading(false);
      setUserData(response.data.response.email);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (keyword.trim() !== "") {
      const filtered = userData.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword.toLowerCase()) ||
          item.subject.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(userData); // Reset to all data if the search is cleared
    }
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearchKeyword("");
    setFilteredData(userData); // Reset to all data
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

  const columns = [
    {
      field: "title",
      headerName: "Title",
      flex: 2,
      width: 400,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },
    {
      field: "subject",
      headerName: "Subject",
      flex: 2,
      width: 400,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },

    {
      field: "action",
      headerName: "Action",
      headerClassName: "redText",
      cellClassName: "redBorder",
      flex: 1,
      width: 330,
      renderCell: (params) => (
        <strong>
          <div className="process__actionnn" style={{ margin: "10px 0" }}>
            <Button
              variant="primary"
              onClick={(e) => {
                handleOpen(params.row);
                e.stopPropagation();
              }}
              className="btn btn-info btn-smmm"
              title="view"
            >
              <i className="fa fa-eye"></i>
            </Button>
            <Link
              onClick={(e) => e.stopPropagation()}
              href={`/employer/email-templates/edit/${params.row.id}`}
              className="btn btn-warning btn-smmm"
              title="view"
            >
              <i className="fa fa-pencil"></i>
            </Link>
          </div>
        </strong>
      ),
    },
  ];

  const rows = (searchKeyword ? filteredData : userData).map((i) => ({
    id: i.id,
    title: i.title,
    subject: i.subject,
    static_email_heading: i.static_email_heading,
    variable: i.variable,
    template: i.template,
  }));

  return (
    <>
      <EmployerLayout>
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
                <i class="fa-solid fa-envelope"></i>

                <span>Email Templates List</span>
              </div>
            </div>
          </div>
          <div className="">
            
            <div className="serachKeyItems  bg-white">
              <form action="">
                <p>Search Email template by title or subject</p>
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

              <div className="emailTemplateModal"><Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton className="bg-red-500 text-white ">
                  <Modal.Title>
                    {" "}
                    {selectedRecord && selectedRecord.title}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedRecord && (
                    <div>
                      <div className="dDrt">
                        <span>Title: </span>
                        <div className="value">
                          {" "}
                          {selectedRecord && selectedRecord.title}
                        </div>
                      </div>
                      <div className="dDrt">
                        <span>Subject: </span>
                        <div className="value">
                          {selectedRecord.subject
                            ? selectedRecord.subject
                            : "N/A"}
                        </div>
                      </div>
                      <div className="dDrt">
                        <span>Template: </span>
                        <div className="template">
                          {" "}
                          {selectedRecord &&
                            HTMLReactParser(selectedRecord.template)}
                        </div>
                      </div>
                    </div>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal></div>

              
            </div>
          </div>
        </div>
        <AdminFooter />
      </EmployerLayout>
    </>
  );
};

export default Page;
