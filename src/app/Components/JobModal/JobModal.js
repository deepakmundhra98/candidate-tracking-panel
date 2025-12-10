import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { motion } from "framer-motion";

const tabs = ["DETAILS", "INTRVIEW PROCESS"];

export default function JobModal({ onClose, jobData }) {
  const [activeTab, setActiveTab] = useState("DETAILS");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
    >
      <div className="bg-white scale-90 rounded-3xl shadow-lg w-full max-w-5xl">
        <Header onClose={onClose} jobData={jobData} />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="p-6 min-h-[350px]">
          {activeTab === "DETAILS" && <Details jobData={jobData} />}
          {activeTab === "INTRVIEW PROCESS" && (
            <InterviewProcess jobData={jobData} />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Header({ onClose, jobData }) {
  return (
    <div className="flex items-center p-8 border-b border-gray-200 bg-gray-100 rounded-t-3xl">
      <div>
        <h2 className="text-2xl font-medium text-gray-700">
          {jobData.job_name}
        </h2>
        {/* <p className="text-gray-400">{jobData.email}</p> */}
      </div>
      <button
        className="ml-auto text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
}

function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`flex-1 py-4 text-center ${
            activeTab === tab
              ? "text-[#1665d8] border-b-4 border-[#1665d8]"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function Details({ jobData }) {
  const details = [
    { label: "Job Title", value: jobData.job_name },
    { label: "Category", value: jobData.category },
    { label: "Designation", value: jobData.designation },
    { label: "Job Posted Date", value: jobData.job_created_at },
    {
      label: "Location",
      value: jobData.location ? jobData.location : "Location Not Available",
    },
    {
      label: "Experience",
      value:
        `${jobData.min_exp} - ${jobData.max_exp} Years` ||
        jobData.min_exp - jobData.max_exp + " Years",
    },
    {
      label: "Annual Salary",
      value:
        `${jobData.min_salary} - ${jobData.max_salary}` ||
        jobData.min_salary - jobData.max_salary + "",
    },
    { label: "Skills", value: jobData.skill },
    {
      label: "Work Type",
      value: jobData.work_type ? jobData.work_type : "Work Type Not Available",
    },
    // { label: "Job Description", value: jobData.job_description },
  ];

  // console.log(jobData.min_salary,"yes")

  return (
    <div>
      <h3 className="text-lg text-gray-700 border-x border-t py-3 px-4 rounded-t-lg mb-0">
        Basic Details
      </h3>
      <div className="gap-4 border p-4 !min-h-[350px]">
        <div className="grid grid-cols-1 md:grid-cols-3 ">
          {details.map((item) => (
            <div className="mb-3" key={item.label}>
              <p className="text-gray-400 pb-1 mb-0">{item.label}</p>
              <p className="text-gray-700 mb-0">{item.value}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-gray-400 pb-2 mb-0">Job Description</p>
          <p className="text-gray-700 mb-0">
            {jobData.job_description
              ? jobData.job_description
              : "Job Description Not Available"}
          </p>
        </div>
      </div>
    </div>
  );
}

function InterviewProcess({ jobData }) {
  return (
    //     <div className="">
    //       <h3 className="text-lg font-medium text-gray-700 border-x border-t py-3 px-4 rounded-t-lg !mb-0">
    //         Interview Process
    //       </h3>
    //       <div className="pt-8 space-y !min-h-[358px] border rounded-lg ">
    //         <div className="!flex !flex-row  mb-0 py-4 px-0.5 ">
    //           {jobData.process_order?.split(",").map((i, index) => (
    //             <>
    //               <div
    //                 key={index}
    //                 className="border-4 ring-1 ring-[#1665d8] ring-offset-8 !border-[#1665d8] rounded-[50%] w-fit p-[30px] mb-2 mx-3"
    //                 style={{ width: "140px", height: "140px", alignContent: "center"}}
    //               >
    //                 <p className="text-gray-400 text-[15px] mb-2 text-center">
    //                   Process{" "}{index + 1}
    //                 </p>
    //                 <p className="!text-[#1665d8] text-[15px] text-gray-700 font-medium text-center">
    //                   {i.trim()}
    //                 </p>
    //               </div>
    //               <i
    //   className="!flex !flex-col !justify-center fa-solid fa-chevron-right"
    //   style={{ color: "#1665d8", fontSize: "30px", display: "last-child" ? "none" : "flex" }}
    // ></i>

    //             </>
    //           ))}
    //         </div>
    //       </div>
    //     </div>

    <div className="">
      <h3 className="text-lg font-medium text-gray-700 border-x border-t py-3 px-4 rounded-t-lg !mb-0">
        Interview Process
      </h3>
      <div className="pt-8 space-y !min-h-[350px] border rounded-lg">
        <div className="!flex !flex-row justify-center mb-0 py-4 px-0.5">
          {jobData.process_order?.split(",").map((i, index, array) => (
            <React.Fragment key={index}>
              <div
                className="border-4 ring-1 ring-[#1665d8] ring-offset-8 !border-[#1665d8] rounded-[50%] w-fit p-[30px] mb-2 mx-3"
                style={{
                  width: "140px",
                  height: "140px",
                  alignContent: "center",
                }}
              >
                <p className="text-gray-400 text-[15px] mb-2 text-center">
                  Process {index + 1}
                </p>
                <p className="!text-[#1665d8] text-[15px] text-gray-700 font-medium text-center">
                  {i.trim()}
                </p>
              </div>
              {index !== array.length - 1 && ( // Hide the last icon
                <i
                  className="!flex !flex-col !justify-center fa-solid fa-chevron-right"
                  style={{ color: "#1665d8", fontSize: "30px" }}
                ></i>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
