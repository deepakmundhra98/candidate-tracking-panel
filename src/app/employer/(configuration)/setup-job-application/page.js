// "use client";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "@fortawesome/fontawesome-free/css/all.css";
// import "../../../common.css";
// import Swal from "sweetalert2";
// import AdminFooter from "../../../admin/Components/AdminFooter/AdminFooter";
// import AdminLayout from "../../EmployerLayout";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import BaseAPI from "../../../BaseAPI/BaseAPI";
// import "../../employer.css";

// const Page = () => {
//   const token = Cookies.get("tokenEmployer");
//   const router = useRouter();
//   const [userData, setUserData] = useState([
//     { id: "", label: "", value_type: "", options: [] },
//   ]);
//   const [errors, setErrors] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const handleChange = (index, field, value) => {
//     const updatedData = [...userData];
//     updatedData[index][field] = value;
//     setUserData(updatedData);
//   };

//   const getData = async () => {
//     try {
//       const response = await axios.post(
//         `${BaseAPI}/admin/get-direct-application-form-data`,
//         { employer_id: Cookies.get("employerId") },
//         {
//           headers: {
//             "content-type": "application/json",
//             Authorization: `Bearer ${Cookies.get("tokenEmployer")}`,
//           },
//         }
//       );
//       const preferences = response.data.response || [];
//       setUserData(
//         preferences.map((pref) => ({
//           id: pref.id,
//           label: pref.label,
//           value_type: pref.value_type,
//           options: pref.options || [],
//         }))
//       );
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       console.log(error.message);
//     }
//   };

//   useEffect(() => {
//     getData();
//   }, []);

//   const handleAddMore = () => {
//     setUserData([...userData, { label: "", value_type: "", options: [] }]);
//   };

//   const handleRemove = (index) => {
//     const updatedData = [...userData];
//     updatedData.splice(index, 1);
//     setUserData(updatedData);
//   };

//   const handleOptionChange = (mainIndex, optionIndex, value) => {
//     const updatedData = [...userData];
//     updatedData[mainIndex].options[optionIndex] = value;
//     setUserData(updatedData);
//   };

//   const addOption = (mainIndex) => {
//     const updatedData = [...userData];
//     updatedData[mainIndex].options.push("");
//     setUserData(updatedData);
//   };

//   const removeOption = (mainIndex, optionIndex) => {
//     const updatedData = [...userData];
//     updatedData[mainIndex].options.splice(optionIndex, 1);
//     setUserData(updatedData);
//   };

//   const validateFields = () => {
//     const validationErrors = [];
//     userData.forEach((data, index) => {
//       const fieldErrors = {};
//       if (!data.label) {
//         fieldErrors.label = "Label is required";
//       }
//       if (!data.value_type) {
//         fieldErrors.value_type = "Value Type is required";
//       }
//       validationErrors[index] = fieldErrors;
//     });
//     setErrors(validationErrors);
//     return validationErrors.every((field) => Object.keys(field).length === 0);
//   };

//   const handleClick = async () => {
//     if (!validateFields()) return;

//     try {
//       const confirmationResult = await Swal.fire({
//         title: "Update",
//         text: "Do you want to update Job Application Form setting?",
//         icon: "question",
//         showCancelButton: true,
//         confirmButtonText: "Yes",
//         cancelButtonText: "No",
//       });

//       if (confirmationResult.isConfirmed) {
//         setLoading(true);
//         const response = await axios.post(
//           `${BaseAPI}/admin/setup-direct-application-form-setting`,
//           { preferences: userData, employer_id: Cookies.get("employerId") },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setLoading(false);
//         if (response.data.status === 200) {
//           Swal.fire({
//             title: "Job Application Form setting updated successfully!",
//             icon: "success",
//             confirmButtonText: "Close",
//           }).then(() => {
//             router.push("/employer/generalsetting");
//           });
//         } else {
//           Swal.fire({
//             title: response.data.message,
//             icon: "error",
//             confirmButtonText: "Close",
//           });
//         }
//       }
//     } catch (error) {
//       setLoading(false);
//       Swal.fire({
//         title: "Failed",
//         text: "Could not update Job Application Form settings",
//         icon: "error",
//         confirmButtonText: "Close",
//       });
//     }
//   };

//   const removePreference = async (preferenceId) => {
//     try {
//       const response = await axios.post(
//         `${BaseAPI}/admin/remove_direct_application_form_section`,
//         { employer_id: Cookies.get("employerId"), id: preferenceId },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (response.data.status === 200) {
//         Swal.fire({
//           title: "Job Application Form field removed successfully!",
//           icon: "success",
//           confirmButtonText: "Close",
//         });
//         // router.push("/employer/dashboard");
//       } else {
//         Swal.fire({
//           title: response.data.message,
//           icon: "error",
//           confirmButtonText: "Close",
//         });
//       }
//     } catch (error) {
//       setLoading(false);
//       Swal.fire({
//         title: "Failed",
//         text: "Could not remove field",
//         icon: "error",
//         confirmButtonText: "Close",
//       });
//     }
//   };

//   return (
//     <>
//       <AdminLayout>
//         {loading && <div className="loader-container"></div>}
//         <div className="adminChangeUsername" style={{ minHeight: "80vh" }}>
//           <div className="breadCumb1">
//             <div className="flex gap-3 items-center">
//               <Link href="/employer/dashboard">
//                 <div className="flex gap-2 items-center">
//                   <i className="fa-solid fa-gauge"></i>
//                   <span>
//                     Dashboard{" "}
//                     <i className="fa-solid fa-angles-right text-xs"></i>
//                   </span>
//                 </div>
//               </Link>
//               <Link href="/employer/website-setting">
//                 <div className="flex gap-2 items-center">
//                   <i className="fa-solid fa-lock"></i>
//                   <span>
//                     Website Setting{" "}
//                     <i class="fa-solid fa-angles-right text-xs"></i>
//                   </span>
//                 </div>
//               </Link>
//               <div className="flex gap-2 items-center">
//                 <i className="fa-solid fa-sliders"></i>{" "}
//                 <span>Setup Job Application Form Setting</span>
//               </div>
//             </div>
//           </div>
//           <div className="generalSetting">
//             <div className="profilelogo mb-[30px]">
//               <h2>Setup Job Application Form Setting</h2>
//               <p className="pt-[10px] text-muted">Note: By default, the First Name, Middle Name, Last Name, Email Address and Contact Number fields will be generated and displayed in the general application form.</p>
//             </div>
//             {userData.map((data, index) => (
//               <div className="dynamic-fields" key={index}>
//                 <div className="row">
//                   <div className="col-lg-2 labelText">Label</div>
//                   <div className="col-lg-10 inputContainer">
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={data.label}
//                       onChange={(e) =>
//                         handleChange(index, "label", e.target.value)
//                       }
//                       placeholder="Enter Label"
//                     />
//                     {errors[index]?.label && (
//                       <div className="text-danger">{errors[index].label}</div>
//                     )}
//                   </div>
//                 </div>
//                 <div className="row">
//                   <div className="col-lg-2 labelText">Value Type</div>
//                   <div className="col-lg-10 inputContainer">
//                     <select
//                       className="form-control"
//                       value={data.value_type}
//                       onChange={(e) =>
//                         handleChange(index, "value_type", e.target.value)
//                       }
//                     >
//                       <option value="">Select</option>
//                       <option value="input-box">Input box</option>
//                       <option value="select-box">Select Box</option>
//                       <option value="text-area">Text Area</option>
//                       <option value="checkbox">Checkbox</option>
//                       <option value="radio">Radio Button</option>
//                       <option value="date">Date</option>
//                       <option value="file">File</option>
//                     </select>
//                     {errors[index]?.value_type && (
//                       <div className="text-danger">
//                         {errors[index].value_type}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 {["checkbox", "radio", "select-box"].includes(
//                   data.value_type
//                 ) && (
//                   <div className="row">
//                     <div className="col-lg-2 labelText">
//                       Enter Option Values
//                     </div>
//                     <div className="col-lg-10 inputContainer">
//                       {data.options.map((option, optIndex) => (
//                         <div
//                           key={optIndex}
//                           className="d-flex align-items-center mb-2"
//                         >
//                           <input
//                             type="text"
//                             className="form-control"
//                             value={option}
//                             onChange={(e) =>
//                               handleOptionChange(
//                                 index,
//                                 optIndex,
//                                 e.target.value
//                               )
//                             }
//                             placeholder={`Enter option ${optIndex + 1}`}
//                           />
//                           <button
//                             className="btn btn-danger btn-sm ms-2"
//                             onClick={() => removeOption(index, optIndex)}
//                           >
//                             Remove
//                           </button>
//                         </div>
//                       ))}
//                       <button
//                         className="btn btn-primary btn-sm mt-2"
//                         onClick={() => addOption(index)}
//                       >
//                         Add Option
//                       </button>
//                     </div>
//                   </div>
//                 )}
//                 <div className="row">
//                   <div className="col-lg-12 text-end">
//                     {userData.length > 1 && (
//                       <button
//                         className="btn btn-danger btn-sm"
//                         onClick={() => {
//                           if (data.id) {
//                             // If the item is from the API, call removePreference
//                             Swal.fire({
//                               title: "Are you sure?",
//                               text: "This action will permanently delete this preference.",
//                               icon: "warning",
//                               showCancelButton: true,
//                               confirmButtonText: "Yes, delete it!",
//                             }).then((result) => {
//                               if (result.isConfirmed) {
//                                 removePreference(data.id).then(() => {
//                                   const updatedData = userData.filter(
//                                     (_, i) => i !== index
//                                   );
//                                   setUserData(updatedData);
//                                 });
//                                 getData()
//                               }
//                             });
//                           } else {
//                             // Remove locally if it's a new, unsaved item
//                             handleRemove(index);
//                           }
//                         }}
//                       >
//                         Remove
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//             <div className="row text-end">
//               <div className="col-lg-12">
//                 <button className="btn btn-primary" onClick={handleAddMore}>
//                   Add More
//                 </button>
//               </div>
//             </div>
//             <div className="row bottomButtons">
//               <div className="col-lg-12">
//                 <button className="btn themeButton1" onClick={handleClick}>
//                   Save
//                 </button>
//                 <Link
//                   href="/employer/generalsetting"
//                   className="btn themeButton2"
//                 >
//                   Cancel
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//         <AdminFooter />
//       </AdminLayout>
//     </>
//   );
// };

// export default Page;

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "../../../common.css";
import Swal from "sweetalert2";
import AdminFooter from "../../../admin/Components/AdminFooter/AdminFooter";
import AdminLayout from "../../EmployerLayout";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import BaseAPI from "../../../BaseAPI/BaseAPI";
import "../../employer.css";

const Page = () => {
  const token = Cookies.get("tokenEmployer");
  const router = useRouter();
  const [userData, setUserData] = useState([
    { id: "", label: "", value_type: "", options: [] },
  ]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (index, field, value) => {
    const updatedData = [...userData];
    updatedData[index][field] = value;
    setUserData(updatedData);
  };

  const getData = async () => {
    try {
      const response = await axios.post(
        `${BaseAPI}/admin/get-direct-application-form-data`,
        { employer_id: Cookies.get("employerId") },
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${Cookies.get("tokenEmployer")}`,
          },
        }
      );
      const preferences = response.data.response || [];
      setUserData(
        preferences.map((pref) => ({
          id: pref.id,
          label: pref.label,
          value_type: pref.value_type,
          options: pref.options || [],
        }))
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleAddMore = () => {
    setUserData([...userData, { label: "", value_type: "", options: [] }]);
  };

  const handleRemove = (index) => {
    const updatedData = [...userData];
    updatedData.splice(index, 1);
    setUserData(updatedData);
  };

  const handleOptionChange = (mainIndex, optionIndex, value) => {
    const updatedData = [...userData];
    updatedData[mainIndex].options[optionIndex] = value;
    setUserData(updatedData);
  };

  const addOption = (mainIndex) => {
    const updatedData = [...userData];
    updatedData[mainIndex].options.push("");
    setUserData(updatedData);
  };

  const removeOption = (mainIndex, optionIndex) => {
    const updatedData = [...userData];
    updatedData[mainIndex].options.splice(optionIndex, 1);
    setUserData(updatedData);
  };

  const validateFields = () => {
    const validationErrors = [];

    userData.forEach((data, index) => {
      const fieldErrors = {};

      // Validate Label
      if (!data.label.trim()) {
        fieldErrors.label = "Label is required";
      }

      // Validate Value Type
      if (!data.value_type) {
        fieldErrors.value_type = "Value Type is required";
      }

      // Validate Options for checkbox, radio, select-box
      if (["checkbox", "radio", "select-box"].includes(data.value_type)) {
        if (data.options.length === 0) {
          fieldErrors.options = "At least one option is required";
        } else {
          const emptyOptions = data.options.some((opt) => !opt.trim());
          if (emptyOptions) {
            fieldErrors.options = "Option values cannot be empty";
          }
        }
      }

      validationErrors[index] = fieldErrors;
    });

    setErrors(validationErrors);
    return validationErrors.every((field) => Object.keys(field).length === 0);
  };

  const handleClick = async () => {
    if (!validateFields()) return;

    try {
      const confirmationResult = await Swal.fire({
        title: "Update",
        text: "Do you want to update Job Application Form setting?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (confirmationResult.isConfirmed) {
        setLoading(true);
        const response = await axios.post(
          `${BaseAPI}/admin/setup-direct-application-form-setting`,
          { preferences: userData, employer_id: Cookies.get("employerId") },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoading(false);
        if (response.data.status === 200) {
          Swal.fire({
            title: "Job Application Form setting updated successfully!",
            icon: "success",
            confirmButtonText: "Close",
          }).then(() => {
            router.push("/employer/generalsetting");
          });
        } else {
          Swal.fire({
            title: response.data.message,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not update Job Application Form settings",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  const removePreference = async (preferenceId) => {
    try {
      const response = await axios.post(
        `${BaseAPI}/admin/remove_direct_application_form_section`,
        { employer_id: Cookies.get("employerId"), id: preferenceId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
        Swal.fire({
          title: "Job Application Form field removed successfully!",
          icon: "success",
          confirmButtonText: "Close",
        });
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Failed",
        text: "Could not remove field",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  return (
    <>
      <AdminLayout>
        {loading && <div className="loader-container"></div>}
        <div className="adminChangeUsername" style={{ minHeight: "80vh" }}>
          <div className="breadCumb1">
            <div className="flex gap-3 items-center">
              <Link href="/employer/dashboard">
                <div className="flex gap-2 items-center">
                  <i className="fa-solid fa-gauge"></i>
                  <span>
                    Dashboard{" "}
                    <i className="fa-solid fa-angles-right text-xs"></i>
                  </span>
                </div>
              </Link>
              <Link
                underline="hover"
                color="inherit"
                href="/employer/configuration"
              >
                <div className="flex gap-2 items-center justify-center">
                  <i className="fa fa-gears"></i>
                  <span>
                    Configuration{" "}
                    <i class="fa-solid fa-angles-right text-xs"></i>
                  </span>
                </div>
              </Link>
              <Link href="/employer/website-setting">
                <div className="flex gap-2 items-center">
                  <i className="fa-solid fa-lock"></i>
                  <span>
                    Website Setting{" "}
                    <i className="fa-solid fa-angles-right text-xs"></i>
                  </span>
                </div>
              </Link>
              <div className="flex gap-2 items-center">
                <i className="fa-solid fa-sliders"></i>{" "}
                <span>Setup Job Application Form Setting</span>
              </div>
            </div>
          </div>
          <div className="generalSetting">
            <div className="profilelogo mb-[30px]">
              <h2>Setup Job Application Form Setting</h2>
              <p className="pt-[10px] text-muted">
                Note: By default, the First Name, Middle Name, Last Name, Email
                Address and Contact Number fields will be generated and
                displayed in the general application form.
              </p>
            </div>
            {userData.map((data, index) => (
              <div className="dynamic-fields" key={index}>
                <div className="row">
                  <div className="col-lg-2 labelText">Label</div>
                  <div className="col-lg-10 inputContainer">
                    <input
                      type="text"
                      className="form-control"
                      value={data.label}
                      onChange={(e) =>
                        handleChange(index, "label", e.target.value)
                      }
                      placeholder="Enter Label"
                    />
                    {errors[index]?.label && (
                      <div className="text-danger">{errors[index].label}</div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-2 labelText">Value Type</div>
                  <div className="col-lg-10 inputContainer">
                    <select
                      className="form-control"
                      value={data.value_type}
                      onChange={(e) =>
                        handleChange(index, "value_type", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="input-box">Input box</option>
                      <option value="select-box">Select Box</option>
                      <option value="text-area">Text Area</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="radio">Radio Button</option>
                      <option value="date">Date</option>
                      <option value="file">File</option>
                    </select>
                    {errors[index]?.value_type && (
                      <div className="text-danger">
                        {errors[index].value_type}
                      </div>
                    )}
                  </div>
                </div>
                {["checkbox", "radio", "select-box"].includes(
                  data.value_type
                ) && (
                  <div className="row">
                    <div className="col-lg-2 labelText">Enter Option Values</div>
                    <div className="col-lg-10 inputContainer">
                      {data.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className="d-flex align-items-center mb-2"
                        >
                          <input
                            type="text"
                            className="form-control"
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(index, optIndex, e.target.value)
                            }
                            placeholder={`Enter option ${optIndex + 1}`}
                          />
                          <button
                            className="btn btn-danger btn-sm ms-2"
                            onClick={() => removeOption(index, optIndex)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        className="btn btn-primary btn-sm mt-2"
                        onClick={() => addOption(index)}
                      >
                        Add Option
                      </button>
                      {errors[index]?.options && (
                        <div className="text-danger mt-2">
                          {errors[index].options}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-lg-12 text-end">
                    {userData.length > 1 && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          if (data.id) {
                            Swal.fire({
                              title: "Are you sure?",
                              text: "This action will permanently delete this preference.",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Yes, delete it!",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                removePreference(data.id).then(() => {
                                  const updatedData = userData.filter(
                                    (_, i) => i !== index
                                  );
                                  setUserData(updatedData);
                                });
                                getData();
                              }
                            });
                          } else {
                            handleRemove(index);
                          }
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="row text-end">
              <div className="col-lg-12">
                <button className="btn btn-primary" onClick={handleAddMore}>
                  Add More
                </button>
              </div>
            </div>
            <div className="row bottomButtons">
              <div className="col-lg-12">
                <button className="btn themeButton1" onClick={handleClick}>
                  Save
                </button>
                <Link
                  href="/employer/generalsetting"
                  className="btn themeButton2"
                >
                  Cancel
                </Link>
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

