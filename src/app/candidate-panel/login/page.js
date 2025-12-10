"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Header from "@/app/Components/Header";
import Footer from "@/app/Components/Footer/Footer";
import Link from "next/link";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // API Login Handler
  const handleLogin = async ({ email, password }) => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.post(BaseAPI+"/user/candidate/login",{
        email: email,
        password: password,
      },{
        headers: {
          "Content-Type": "application/json",
        }
      })


      if(response.data.status === 200) {
        Cookies.set("tokenCandidate", response.data.token);
        Cookies.set("candidateData", JSON.stringify(response.data.user));
        Cookies.set("userType", response.data.userType);


        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You have logged in successfully!",
        }).then(() => {
          router.push("/candidate-panel/dashboard");
        })
      } else{
        setError(response.data.message || "Login failed. Try again.");
      }
    } catch (err) {
      setError(err.message || "Login failed. Try again.");
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
            Sign in to your candidate account
          </h2>
          
        </div>

        {/* Error Box */}
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
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await handleLogin(values);
            setSubmitting(false);
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
                  required
                  placeholder="Email address"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300"
                />
                {errors.email && touched.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="mb-6">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300"
                />
                {errors.password && touched.password && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me + Forgot Password */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded mr-2"
                  />
                  <label htmlFor="remember-me" className="text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <Link
                    href="/candidate-panel/forgot-password"
                  
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Forgot your password?
                </Link>


              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/candidate-panel/register")}
                className="mt-4 w-full py-2 px-4 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                Don't have an account? Create an account
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
