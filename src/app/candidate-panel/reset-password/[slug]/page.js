"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Header from "@/app/Components/Header";
import Footer from "@/app/Components/Footer/Footer";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";

// Yup validation schema
const resetSchema = Yup.object().shape({
  new_password: Yup.string()
    .min(6, "New Password must be at least 6 characters")
    .required("New Password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("new_password"), null], "Passwords do not match")
    .required("Confirm Password is required"),
});

export default function ResetPassword({params}) {
  const router = useRouter();
//   const params = useSearchParams();

  const token = params.slug;

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      setError("Invalid or expired reset link.");
    }
  }, [token]);

  // Handle Reset Password API
  const handleReset = async ({ new_password, confirm_password }) => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await axios.post(
        BaseAPI + "/candidate/reset-password",
        {
          token,
          new_password,
          confirm_password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data.status === 200) {
        setMessage("Your password has been reset successfully.");
        setTimeout(() => {
          router.push("/candidate-panel/login");
        }, 2000);
      } else {
        setError(res.data.response || "Reset failed. Try again.");
      }
    } catch (err) {
      setError(err.message || "Reset failed. Try again.");
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
              Reset your password
            </h2>
            <p className="text-sm text-gray-600">
              Enter and confirm your new password.
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 flex">
              <div className="text-green-600 mr-3">
                ✔
              </div>
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 flex">
              <div className="text-red-500 mr-3">
                ✖
              </div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <Formik
            initialValues={{ new_password: "", confirm_password: "" }}
            validationSchema={resetSchema}
            onSubmit={async (values, { setSubmitting }) => {
              await handleReset(values);
              setSubmitting(false);

            }}
          >
            {({ errors, touched }) => (
              <Form>
                {/* New Password */}
                <div className="mb-6">
                  <label htmlFor="password" className="sr-only">
                    New Password
                  </label>
                  <Field
                    id="password"
                    name="new_password"
                    type="password"
                    placeholder="New password"
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300"
                  />
                  {errors.new_password && touched.new_password && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.new_password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                  <label htmlFor="confirm_password" className="sr-only">
                    Confirm Password
                  </label>
                  <Field
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    placeholder="Confirm password"
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300"
                  />
                  {errors.confirm_password && touched.confirm_password && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.confirm_password}
                    </p>
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
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

                {/* Back to Login */}
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
