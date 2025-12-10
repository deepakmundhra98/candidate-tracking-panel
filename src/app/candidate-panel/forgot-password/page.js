"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Header from "@/app/Components/Header";
import Footer from "@/app/Components/Footer/Footer";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";

const forgotSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function Page() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // API Handler
  const handleForgot = async ({ email }) => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await axios.post(BaseAPI + "/candidate/forgot-password", {
        email: email,
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      if(res.data.status === 200) {
      setMessage("A password reset link has been sent to your email.");

      } else {
        setError(res.data.response || "Request failed. Try again.");
      }

    } catch (err) {
      setError(err.message || "Request failed. Try again.");
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
              Forgot your password?
            </h2>
            <p className="text-sm text-gray-600">
              Enter your email and we&apos;ll send you a password reset link.
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 flex">
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

          {/* Form */}
          <Formik
            initialValues={{ email: "" }}
            validationSchema={forgotSchema}
            onSubmit={async (values, { setSubmitting }) => {
              await handleForgot(values);
              setSubmitting(false);
              values.email = "";
            }}
          >
            {({ errors, touched }) => (
              <Form>
                {/* Email */}
                <div className="mb-6">
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300"
                  />
                  {errors.email && touched.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-4 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Sending..." : "Send reset link"}
                </button>

                {/* Go Back */}
                <button
                  type="button"
                  onClick={() => router.push("/candidate-panel/login")}
                  className="mt-4 w-full py-2 px-4 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  Back to login
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
