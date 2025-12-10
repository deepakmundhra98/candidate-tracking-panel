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
        BaseAPI + "/admin/currencies/currencylisting",
        { user_type: "employer" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + token,
          },
        }
      );
      setLoading(false);
      setUserData(response.data.response.currency);
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
          item.name.toLowerCase().includes(keyword.toLowerCase()) ||
          item.symbol.toLowerCase().includes(keyword.toLowerCase())
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

  const handleActivationDeactivation = async (id) => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + "/admin/currencies/currencychangestatus/" + id,
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
        getData();
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const changeCurrencyStatus = async (e, id) => {
    const checked = e.target.checked;
    if (!checked) {
      Swal.fire({
        title: "This is already set as default currency",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + "/admin/currencies/isdefault/" + id,
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
        Swal.fire({
          title: "Default Currency Updated Successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
        getData();
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const deleteCurrecncy = async (id) => {
    try {
      setLoading(true);
      const response = await axios.post(
        BaseAPI + "/admin/currencies/currencydelete/" + id,
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
        Swal.fire({
          title: "Currency Deleted Successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
        getData();
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Currency Name",
      flex: 1,
      width: 200,

      headerClassName: "redText",
      cellClassName: "redBorder",
    },
    {
      field: "code",
      headerName: "Currency Code",
      flex: 1,
      width: 200,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },
    {
      field: "symbol",
      headerName: "Currency Symbol",
      flex: 1,
      width: 200,
      headerClassName: "redText",
      cellClassName: "redBorder",
    },
    {
      field: "is_default",
      headerName: "Default Currency",
      flex: 1,
      width: 200,
      headerClassName: "redText",
      cellClassName: "redBorder",
      renderCell: (params) => (
        <div className="process__actionnn" style={{ margin: "5px 0 0 0" }}>
          <input
            type="checkbox"
            checked={params.row.is_default === 1}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => changeCurrencyStatus(e, params.row.id)}
            style={{ cursor: "pointer" }}
          />
        </div>
      ),
    },

    {
      field: "action",
      headerName: "Action",
      headerClassName: "redText",
      cellClassName: "redBorder",
      width: 200,
      renderCell: (params) => (
        <strong>
          <div className="process__actionnn" style={{ margin: "5px 0 0 0" }}>
            {params.row.status === 1 ? (
              <Button
                variant="primary"
                onClick={(e) => {
                  handleActivationDeactivation(params.row.id);
                  e.stopPropagation();
                }}
                className="btn btn-success btn-sm"
                title="Deactivate Now"
              >
                <i className="fa fa-check-circle"></i>
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={(e) => {
                  handleActivationDeactivation(params.row.id);
                  e.stopPropagation();
                }}
                className="btn btn-danger btn-sm"
                title="Activate Now"
              >
                <i className="fa fa-times-circle"></i>
              </Button>
            )}

            <Link
              href={`/employer/currencies/edit/${params.row.id}`}
              className="btn btn-warning btn-sm"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <Button
              variant="primary"
              onClick={(e) => {
                deleteCurrecncy(params.row.id);
                e.stopPropagation();
              }}
              className="btn btn-danger btn-sm"
              title="Delete currency"
            >
              <i className="fa fa-trash"></i>
            </Button>
          </div>
        </strong>
      ),
    },
  ];

  const rows = (searchKeyword ? filteredData : userData).map((i) => ({
    id: i.id,
    code: i.code,
    is_default: i.is_default,
    name: i.name,
    slug: i.slug,
    status: i.status,
    symbol: i.symbol,
    symbol_place: i.symbol_place,
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
                <i class="fa-solid fa-coins"></i>

                <span>Currency List</span>
              </div>
            </div>
          </div>
          <div className="">
            {/* <div className="w-full">
              <div className="profilelogo inline-block">
                <div className="indexPageHeader">
                  <h2>Currency List</h2>
                </div>
                <div className="float-right">
                  <Link
                    href="/employer/currencies/add"
                    className="themeButton1"
                  >
                    Add Currency
                  </Link>
                </div>
              </div>
            </div> */}

            
            <div className="serachKeyItems  bg-white">
              <form action="">
                <p>Search Currency by Currency Name or Currency Symbol</p>
                <div className="flex flex-col md:flex-row justify-between items-center w-full md:gap-4">
                  <div className="w-full flex flex-col md:flex-row items-center gap-2 flex-grow">
                    <input
                      type="text"
                      className="formm-control w-100 md:mb-0"
                      placeholder="Search By Currency Name or Currency Symbol"
                      value={searchKeyword}
                      onChange={handleSearch}
                    />
                    <button
                      className="btn btn-clearFilters"
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                  <div className="add__interviewwww">
                    <Link
                      href="/employer/currencies/add"
                      className="btn btn-SubAdmin-add"
                    >
                      Add Currency
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            <div className="interviewPreviewTable TableScroll">
              <div style={{ height: "auto", width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 20 },
                    },
                  }}
                  pageSizeOptions={[10, 20, 50, 100]}
                  checkboxSelection
                />
              </div>

              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton className="bg-red-500 text-white">
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
              </Modal>
            </div>
          </div>
        </div>
        <AdminFooter />
      </EmployerLayout>
    </>
  );
};

export default Page;
