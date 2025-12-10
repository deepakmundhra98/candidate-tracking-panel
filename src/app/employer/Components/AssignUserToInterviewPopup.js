import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { motion, AnimatePresence } from "framer-motion";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import Cookies from "js-cookie";
import Select from "react-select";
import Swal from "sweetalert2";

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.3)",
    color: "#1f2937",
    fontSize: "0.75rem",
    minHeight: "32px",
    height: "32px",
    backdropFilter: "blur(6px)",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "white",
    borderRadius: "8px",
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "0.75rem",
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
    background:
      state.isFocused || state.isSelected
        ? "linear-gradient(90deg, #ef4030, #007bff)"
        : "white",
    color: state.isFocused || state.isSelected ? "white" : "#1f2937",
    cursor: "pointer",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1f2937",
    fontSize: "0.75rem",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#6b7280",
    fontSize: "0.75rem",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "32px",
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "32px",
    padding: "0 8px",
  }),
};

export default function AssignUserToInterviewPopup({
  onClose,
  process_id,
  userListRefresh,
}) {
  // console.log("test")
  const token = Cookies.get("tokenEmployer") ;
  const [userData, setUserData] = useState({
    process_id: "",
    user_id: "",
  });
  const [errors, setErrors] = useState({});
  const [processData, setProcessData] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      const response = await axios.post(
        BaseAPI + "/admin/assignusertoprocess/add",
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const processes = response.data.response.processes;
      const users = response.data.response.users;

      setProcessData(processes);
      setUserDetails(users);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (processData.length > 0 && process_id) {
      const matched = processData.find(
        (p) => String(p.id) === String(process_id)
      );
      if (matched) {
        const selected = { value: matched.id, label: matched.process_name };
        setSelectedProcess(selected);
        setUserData((prev) => ({ ...prev, process_id: matched.id }));
      }
    }
  }, [processData, process_id]);

  const handleClick = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!selectedProcess) newErrors.process_id = "Please select a process";
    if (!selectedUser) newErrors.user_id = "Please select a user";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await axios.post(
        BaseAPI + "/admin/assignusertoprocess/add",
        {
          process_id: selectedProcess.value,
          user_id: selectedUser.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (response.data.status === 200) {
        Swal.fire({
          title: "User assigned to process successfully!",
          icon: "success",
          confirmButtonText: "Close",
        }).then(() => {
          userListRefresh?.();
          onClose();
        });
      } else {
        Swal.fire({
          title: response.data.message || "Something went wrong",
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: "Could not assign process",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };
  if (!selectedProcess) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center mt-20">
        <Draggable handle=".drag-header">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3 }}
              className="w-96 rounded-2xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-lg bg-white/10"
            >
              {/* Header */}
              <div
                className="drag-header cursor-move px-5 py-3 flex justify-between items-center"
                style={{
                  background: "linear-gradient(90deg, #007bff, #ef4030)",
                  color: "#ffffff",
                }}
              >
                <h3 className="text-white font-semibold text-sm tracking-wide text-start">
                  Assign User to Process
                </h3>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                  }}
                  className="text-white text-xl hover:scale-125 transition duration-200"
                >
                  &times;
                </button>
              </div>

              {/* Content */}
              <div className="px-6 pt-[20px] pb-[200px] space-y-4 bg-white/20 backdrop-blur-md text-white">
                <Select
                  placeholder="Select Process"
                  className="border border-gray-300 rounded px-[3px] py-[3px]"
                  options={processData.map((p) => ({
                    value: p.id,
                    label: p.process_name,
                  }))}
                  styles={customSelectStyles}
                  value={selectedProcess}
                  onChange={(selected) => {
                    setSelectedProcess(selected);
                    setUserData((prev) => ({
                      ...prev,
                      process_id: selected.value,
                    }));
                  }}
                  isDisabled={true}
                />

                <Select
                  placeholder="Select User"
                  className="border border-gray-300 rounded px-[3px] py-[3px]"

                  options={userDetails.map((u) => ({
                    value: u.id,
                    label: `${u.first_name} ${u.last_name}`,
                  }))}
                  styles={customSelectStyles}
                  value={selectedUser}
                  onChange={(selected) => {
                    setSelectedUser(selected);
                    setUserData((prev) => ({
                      ...prev,
                      user_id: selected.value,
                    }));
                  }}
                />

                <button
                  className="w-full py-2 rounded-lg text-sm font-semibold text-white shadow-md transition duration-300"
                  style={{
                    background: "linear-gradient(90deg, #ef4030, #007bff)",
                  }}
                  onClick={handleClick}
                >
                  {loading ? "Assigning..." : "Add"}
                </button>
              </div>
            </motion.div>
          </div>
        </Draggable>
      </div>
    </AnimatePresence>
  );
}
