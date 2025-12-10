"use client";
import { useEffect, useState } from "react";
import "@/app/onboarding/onboarding.css";
import axios from "axios"; // Ensure axios is imported
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import Image from "next/image";

const Page = ({ params }) => {
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});

  const handleChange = (e, field) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [field.id]: {
        question: field.question,
        value_type: field.value_type,
        options: field.options || [],
        answer: type === "checkbox" ? checked : value,
      },
    });
  };

  const getData = async () => {
    try {
      const response = await axios.post(
        `${BaseAPI}/candidates/get-preference-data`,
        {
          employer_id: Cookies.get("employer_id") || 22,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === 200) {
        setFormFields(response.data.response.preferences);
      } else if (response.data.status === 500) {
        Swal.fire({
          icon: "warning",
          title: "Error",
          text: response.data.response,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const submitPreference = async (e) => {
    e.preventDefault();
    try {
      const payload = Object.values(formData);
      const response = await axios.post(
        `${BaseAPI}/candidates/savepreferences/${params.slug}`,
        { preferences: payload, },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Your onboarding work has been completed. You will receive an email regarding it. You can now close the window.",
        });
        setFormData({});
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <section className="prefences-page">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="left-side">
              <form onSubmit={submitPreference} className="preference-form">
                {formFields.map((field) => (
                  <div className="form-group" key={field.id}>
                    <label>{field.question}</label>
                    {field.value_type === "select-box" && (
                      <select
                        className="form-control form-select"
                        name={field.id}
                        onChange={(e) => handleChange(e, field)}
                      >
                        <option value="">Select an option</option>
                        {field.options.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                    {field.value_type === "radio" &&
                      field.options.map((option, index) => (
                        <div key={index}>
                          <input
                            type="radio"
                            name={field.id}
                            value={option}
                            onChange={(e) => handleChange(e, field)}
                          />
                          <label>{option}</label>
                        </div>
                      ))}
                    {field.value_type === "checkbox" &&
                      field.options.map((option, index) => (
                        <div key={index}>
                          <input
                            type="checkbox"
                            name={field.id}
                            value={option}
                            onChange={(e) => handleChange(e, field)}
                          />
                          <label>{option}</label>
                        </div>
                      ))}
                    {field.value_type === "input-box" && (
                      <input
                        type="text"
                        className="form-control"
                        name={field.id}
                        onChange={(e) => handleChange(e, field)}
                      />
                    )}
                    {field.value_type === "text-area" && (
                      <textarea
                        className="form-control"
                        name={field.id}
                        onChange={(e) => handleChange(e, field)}
                      ></textarea>
                    )}
                    {field.value_type === "date" && (
                      <input
                        type="date"
                        className="form-control"
                        name={field.id}
                        onChange={(e) => handleChange(e, field)}
                      />
                    )}
                    {field.value_type === "file" && (
                      <input
                        type="file"
                        className="form-control"
                        name={field.id}
                        onChange={(e) => handleChange(e, field)}
                      />
                    )}
                  </div>
                ))}

                <button type="submit">Submit Preferences</button>
              </form>
            </div>
          </div>
          <div className="col-md-6">
            <div className="right-side">
              <Image
                                                width={500}
                                                height={500}
                                                src="/Images/onboarding/on-boarding-banner.png"
                                                alt="GIF"
                                              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
