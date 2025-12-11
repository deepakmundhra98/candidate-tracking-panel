"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Header from "@/app/Components/Header";
import Footer from "@/app/Components/Footer/Footer";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import Swal from "sweetalert2";

// Validation Schema
const registerSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  contact_number: Yup.string()
    .matches(/^[0-9]{10}$/, "Contact number must be 10 digits")
    .required("Contact number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

const handleRegister = async ({
  first_name,
  last_name,
  email,
  contact_number,
  password,
}) => {
      try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await axios.post(
        BaseAPI + "/user/candidate/register",
        {
          first_name,
          last_name,
          email,
          contact_number,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",

          },
        }
      );

      if (response.data.status === 200) {
        setMessage("Your account has been created successfully!");
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Your account has been created successfully!",
          
        }).then(() => {
          router.push("/candidate-panel/login");
        })

      } else {
        setError(response.data.response || "Request failed. Try again.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-6">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Create your candidate account
            </h2>
            <p className="text-sm text-gray-600">
              Join us and start applying for jobs instantly.
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 flex">
              <div className="text-green-600 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 flex">
              <div className="text-red-500 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* FORM */}
          <Formik
            initialValues={{
              first_name: "",
              last_name: "",
              email: "",
              contact_number: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={registerSchema}
            onSubmit={async (values, { setSubmitting }) => {
              await handleRegister(values);
              setSubmitting(false);
            }}
          >
            {({ errors, touched }) => (
              <Form>
                {/* Name */}
                <div className="mb-6">
                  <Field
                    name="first_name"
                    type="text"
                    placeholder="First name"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-[#87e0ff] focus:ring-2 focus:ring-[#87e0ff]"
                  />
                  {errors.first_name && touched.first_name && (
                    <p className="text-xs text-red-600 mt-1">{errors.first_name}</p>
                  )}
                </div>
                <div className="mb-6">
                  <Field
                    name="last_name"
                    type="text"
                    placeholder="Last name"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-[#87e0ff] focus:ring-2 focus:ring-[#87e0ff]"
                  />
                  {errors.last_name && touched.last_name && (
                    <p className="text-xs text-red-600 mt-1">{errors.last_name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="mb-6">
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email address"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-[#87e0ff] focus:ring-2 focus:ring-[#87e0ff]"
                  />
                  {errors.email && touched.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="mb-6">
                  <Field
                    name="contact_number"
                    type="text"
                    placeholder="Contact number"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-[#87e0ff] focus:ring-2 focus:ring-[#87e0ff]"
                  />
                  {errors.contact_number && touched.contact_number && (
                    <p className="text-xs text-red-600 mt-1">{errors.contact_number}</p>
                  )}
                </div>

                {/* Password */}
                <div className="mb-6">
                  <Field
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-[#87e0ff] focus:ring-2 focus:ring-[#87e0ff]"
                  />
                  {errors.password && touched.password && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                  <Field
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-[#87e0ff] focus:ring-2 focus:ring-[#87e0ff]"
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-4 bg-[#27BAEE] text-white text-sm font-medium rounded-md hover:bg-[#209cc8] focus:outline-none focus:ring-2 focus:ring-[#27BAEE] transition ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>

                {/* Already have account */}
                <button
                  type="button"
                  onClick={() => router.push("/candidate-panel/login")}
                  className="mt-4 w-full py-2 px-4 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#87e0ff] transition"
                >
                  Already have an account? Login
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <Footer />
    </>
  );
}
