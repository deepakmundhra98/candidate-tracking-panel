"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import "@/app/common.css";

const Page = ({ interviewDetails, token }) => {
  const [userName, setUserName] = useState("");
  const [processName, setProcessName] = useState("");

  console.log(interviewDetails, "inter");

  useEffect(() => {
    const fetchData = async () => {
      if (interviewDetails) {
        try {
          if (interviewDetails.user_assigned) {
            const userResponse = await axios.post(
              `${BaseAPI}/admin/getuserdata`,
              { user_assigned: Array.isArray(interviewDetails.user_assigned) ? interviewDetails.user_assigned.join(",") : interviewDetails.user_assigned },
              {
                headers: {
                  "content-type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setUserName(userResponse.data.response);
          }

          const processResponse = await axios.post(
            `${BaseAPI}/admin/getprocessname/${interviewDetails.process_id}`,
            null,
            {
              headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setProcessName(processResponse.data.response.process_name);
        } catch (error) {
          console.log(error.message);
        }
      }
    };

    fetchData();
  }, [interviewDetails, token]);

  const getInterviewTypeName = (id) => {
    if (id === "1") {
      return "Telephone";
    }
    if (id === "2") {
      return "On Site";
    }
    if (id === "3") {
      return "Web Conference";
    }
    return "";
  };

  const getInterviewDuration = (id) => {
    if (id === "1") {
      return "1 Hour";
    } else {
      return id + " " + "Minutes";
    }
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

  if (!interviewDetails) {
    return null;
  }

  const formattedDate = new Date(interviewDetails.interview_date)
    .toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  console.log(formattedDate); // Output: March 2, 2025


  return (
    <>
      <h2 className="text-xl font-bold mb-2">
        Scheduled on:{" "}
        {formattedDate}
        {/* {interviewDetails.interview_date.split("-").reverse().join("-")} */}
      </h2>
      <div className="rounded-lg p-6 bg-blue-50  border-blue-200 border-l-blue-600 border-l-4 mb-4">
        <div className="interview_timing">
          <label>{getStartTime(interviewDetails.start_time)}</label>
          <span>{processName}</span>
        </div>
        <div className="interview_timing">
          <label>{getInterviewDuration(interviewDetails.duration)}</label>
          <span>{interviewDetails.interview_type}</span>
        </div>
        <div className="row"></div>
        <div className="interview_timing">
          <ul className="">
            <li>
              {" "}
              <label>Interview Details:</label>
              <span>{interviewDetails.interview_type_detail}</span>
            </li>
            {/* <li>{interviewDetails.interview_type_detail}</li> */}
          </ul>
        </div>
        <div className="interview_timing">
          <label>Interviewer : </label>
          <span>
            {/* {userName.first_name ? userName.first_name : ""}{" "}
            {userName.last_name ? userName.last_name : ""} */}
            {userName}
          </span>
        </div>
        <div className="interview_timing">
          <label>Comment : </label>
          <span>{interviewDetails.comment}</span>
        </div>
      </div>
    </>
  );
};

export default Page;
