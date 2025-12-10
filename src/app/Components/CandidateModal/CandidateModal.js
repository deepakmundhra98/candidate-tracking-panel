import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

const tabs = [
  "DETAILS",
  "EDUCATION",
  "EXPERIENCE",
  "ADDITIONAL",
  "COVER LETTER",
];

export default function CandidateModal({ onClose, profileData }) {
  const [activeTab, setActiveTab] = useState("DETAILS");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
    >
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-4xl">
        <Header onClose={onClose} profileData={profileData} />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="p-6 !h-[350px]">
          {activeTab === "DETAILS" && <Details profileData={profileData} />}
          {activeTab === "EDUCATION" && (
            <EducationDetails profileData={profileData} />
          )}
          {activeTab === "EXPERIENCE" && (
            <ExperienceDetails profileData={profileData} />
          )}
          {activeTab === "ADDITIONAL" && (
            <AdditionalDetails profileData={profileData} />
          )}
          {activeTab === "COVER LETTER" && (
            <CoverLetterDetails profileData={profileData} />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Header({ onClose, profileData }) {
  return (
    <div className="flex items-center p-6 border-b border-gray-200 bg-gray-100 rounded-t-3xl">
      {profileData.profile_image !== "" ? (
        <Image
          alt={`Profile picture of ${profileData.name}`}
          className="!w-20 !h-20 !object-cover rounded-full mr-5"
          src={profileData.profile_image}
          width={70}
          height={70}
        />
      ) : (
        <Image
          alt={`Profile picture of ${profileData.name}`}
          className="w-22 h-22 rounded-full mr-5"
          src="/Images/adminSide/dummy-profile.png"
          width={110}
          height={110}
        />
      )}

      <div>
        <h2 className="text-2xl font-medium text-gray-700">
          {profileData.name}
        </h2>
        <p className="text-gray-400">{profileData.email}</p>
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

// function Details({ profileData }) {
//   const details = [
//     { label: "Name", value: profileData.name },
//     { label: "Email", value: profileData.email ? profileData.email : "N/A" },
//     { label: "Phone", value: profileData.phone ? profileData.phone : "N/A" },
//     {
//       label: "Date Of Birth",
//       value: profileData.date_of_birth ? profileData.date_of_birth : "N/A",
//     },
//     { label: "Gender", value: profileData.gender ? profileData.gender : "N/A" },
//     {
//       label: "Marital Status",
//       value: profileData.martial_status ? profileData.martial_status : "N/A",
//     },
//     {
//       label: "Physically Challenged",
//       value: profileData.physically_challenged
//         ? profileData.physically_challenged
//         : "N/A",
//     },
//     {
//       label: "Address",
//       value: profileData.address ? profileData.address : "N/A",
//     },
//   ];

//   return (
//     <div>
//       <h3 className="text-lg text-gray-700 border-x border-t py-3 px-4 rounded-t-lg mb-0">
//         Basic Details
//       </h3>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-b-lg min-h-[45vh]">
//         {details.map((item) => (
//           <div key={item.label}>
//             <p className="text-gray-400 pb-0 mb-0">{item.label}</p>
//             <p className="text-gray-700">{item.value}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

function Details({ profileData }) {
  const details = [
    { label: "Name", value: profileData.name },
    { label: "Email", value: profileData.email || "N/A" },
    { label: "Phone", value: profileData.phone || "N/A" },
    { label: "Date Of Birth", value: profileData.date_of_birth || "N/A" },
    { label: "Gender", value: profileData.gender || "N/A" },
    { label: "Marital Status", value: profileData.martial_status || "N/A" },
    {
      label: "Physically Challenged",
      value: profileData.physically_challenged || "N/A",
    },
    { label: "Address", value: profileData.address || "N/A" },
  ];

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-700 border-x border-t py-3 px-4 rounded-t-lg ">
        Basic Details
      </h3>
      <div className="gap-4 border p-4 !h-[240px] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 ">
          {details.map((item) => (
            <div className="mb-3" key={item.label}>
              <p className="text-gray-400 text-[14px]">{item.label}</p>
              <p className="text-gray-700 mb-0 text-[16px] break-all">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EducationDetails({ profileData }) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-700 border-x border-t py-3 px-4 rounded-t-lg ">
        Education Qualifications
      </h3>
      <div
        className={`!h-[240px] overflow-y-auto space-y flex flex-col gap-2 ${
          profileData.education?.length == 0
            ? "border mb-2 p-4 rounded-b-lg"
            : ""
        }`}
      >
        {" "}
        {profileData.education.length > 0 ? (
          profileData.education.map((edu, index) => (
            <div
              key={index}
              className={`grid grid-cols-3 gap-x-8 gap-y-2 ${
                profileData.education?.length > 0
                  ? "border p-4 rounded-b-lg"
                  : ""
              }`}
            >
              <div className="mb-2">
                <p className="text-gray-400 mb-1 text-[14px]">Qualification</p>
                <p className="text-gray-700 text-[16px]">
                  {edu.qualification_id}
                </p>
              </div>
              <div className="mb-2">
                <p className="text-gray-400 mb-1 text-[14px]">Course subjects</p>
                <p className="text-gray-700 text-[16px]">{edu.course}</p>
              </div>
              <div className="mb-2">
                <p className="text-gray-400 mb-1 text-[14px]">School/college</p>
                <p className="text-gray-700 text-[16px]">
                  {edu.school_college}
                </p>
              </div>
              <div className="mb-2">
                <p className="text-gray-400 mb-1 text-[14px]">City</p>
                <p className="text-gray-700 text-[16px]">{edu.city}</p>
              </div>
              <div className="mb-2">
                <p className="text-gray-400 mb-1 text-[14px]">University</p>
                <p className="text-gray-700 text-[16px]">
                  {edu.university_board}
                </p>
              </div>
              <div className="mb-2">
                <p className="text-gray-400 mb-1 text-[14px]">Year of passing</p>
                <p className="text-gray-700 text-[16px]">{edu.passing_year}</p>
              </div>
            </div>
          ))
        ) : (
          <div>
            <p className="text-gray-700 font-medium">
              No education details found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ExperienceDetails({ profileData }) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-700 border-x border-t py-3 px-4 rounded-t-lg ">
        Experience Details
      </h3>{" "}
      <div
        className={`!h-[240px] overflow-y-auto space-y flex flex-col gap-2 ${
          profileData.experience?.length == 0
            ? "border mb-2 p-4 rounded-b-lg"
            : ""
        }`}
      >
        {profileData.experience.length > 0 ? (
          profileData.experience.map((i, index) => (
            <div
              key={index}
              className={`grid grid-cols-3 gap-x-8 gap-y-2 ${
                profileData.experience?.length > 0
                  ? "border p-4 rounded-b-lg"
                  : ""
              }`}
            >
              <div className="mb-2">
                <p className="text-gray-400 mb-1 text-[14px]">Date From</p>
                <p className="text-gray-700 text-[16px]">
                  {i.start_date.split("-").reverse().join("-")}
                </p>
              </div>
              <div className="mb-2">
                <p className="text-gray-400 mb-1 text-[14px]">Date To</p>
                <p className="text-gray-700 text-[16px]">
                  {i.end_date.split("-").reverse().join("-")}
                </p>
              </div>
              <div className="mb-2">
                <p className="text-gray-400 mb-1 text-[14px]">Name of organization</p>
                <p className="text-gray-700 text-[16px]">
                  {i.organisation_name}
                </p>
              </div>
              <div className="mb-2">
                <p className="text-gray-400 mb-1 text-[14px]">Designation</p>
                <p className="text-gray-700 text-[16px]">{i.designation}</p>
              </div>
              <div className="mb-2">
                <p className="text-gray-400 mb-1 text-[14px]">Reason of leaving</p>
                <p className="text-gray-700 text-[16px]">
                  {i.reason_of_leaving}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div>
            <p className="text-gray-700 font-medium">
              No experience details found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function AdditionalDetails({ profileData }) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-700 border-x border-t py-3 px-4 rounded-t-lg">
        Additional Details
      </h3>
      <div className="grid grid-cols-3 gap-x-8 gap-y-2 border p-4 rounded-b-lg !h-[240px] overflow-y-auto ">
        {profileData.cv_document === "" &&
          profileData.additional_data?.length == 0 && (
            <div>
              <p className="text-gray-700 text-[16px]">
                No additional details found
              </p>
            </div>
          )}
        {profileData.cv_document !== "" && (
          <div className="mb-4">
            <p className="text-gray-400 mb-1 text-[14px]">CV Document</p>
            <p className="text-gray-700 text-[16px]">
              <Link
                href={profileData.cv_document}
                target="_blank"
                style={{ color: "#1665d8" }}
              >
                <i class="fa fa-download" aria-hidden="true"></i> Download
              </Link>
            </p>
          </div>
        )}

        {profileData.additional_data?.map((i, index) => (
          <>
            <div className="mb-4">
              <p className="text-gray-400 mb-1 text-[14px]">{i.label}</p>
              <p className="text-gray-700 text-[16px]">{i.value}</p>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

function CoverLetterDetails({ profileData }) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-700 border-x border-t py-3 px-4 rounded-t-lg">
        Cover Letter Details
      </h3>
      <div className="border p-4 rounded-b-lg !h-[240px] overflow-y-auto">
        <div className="mb-4">
          <p className="text-gray-400 mb-1 text-[14px]">Title</p>
          <p className="text-gray-700 text-[16px]">
            {profileData.cover_letter_title
              ? profileData.cover_letter_title
              : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-gray-400 mb-2 text-[14px]">Description</p>
          <p className="text-gray-700 text-[16px]">
            {profileData.cover_letter_description
              ? profileData.cover_letter_description
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
