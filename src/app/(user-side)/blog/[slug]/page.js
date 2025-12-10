"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import parse from "html-react-parser";
import Link from "next/link";
import Image from "next/image";
import ReCAPTCHA from "react-google-recaptcha";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { BsFillTagFill } from "react-icons/bs";
import Swal from "sweetalert2";
import Loader from "../../../Components/Loader";
import { useRouter } from "next/navigation";
import Footer from "@/app/Components/Footer/Footer";
import Header from "@/app/Components/Header";
import BaseAPI from "@/app/BaseAPI/BaseAPI";

const Page = ({ params }) => {
  const { slug } = params;
  const router = useRouter();
  const recaptchaRef = useRef();

  const recaptchaKey = "6Ld_kMcqAAAAAB1nFQrF68fTbpK61mFG__bXQBe-";

  const [loading, setLoading] = useState(false);
  const [blogData, setBlogData] = useState({});
  const [comments, setComments] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [recentPostsList, setRecentPostsList] = useState([]);

  const TitleRef = useRef("");
  const DescriptionRef = useRef("");
  const KeywordsRef = useRef("");

  // --------------------------
  // COMMENT FORM
  // --------------------------
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
    website: "",
    recaptcha: "",
  });
  const [errors, setErrors] = useState({});

  // --------------------------
  // SUBSCRIPTION FORM
  // --------------------------
  const [subscribeForm, setSubscribeForm] = useState({
    email: "",
    recaptcha: "",
  });
  const [subErrors, setSubErrors] = useState({});

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ---------------------------------
  // 👉 GET BLOG DETAILS
  // ---------------------------------
  const getData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        BaseAPI + `/blog/detail/${slug}`
      );

      if (!response.data.response || !response.data.response.blogData) {
        throw new Error("Blog not found");
      }

      const data = response.data.response.blogData;

      setBlogData(data);
      setCategoryList(response.data.response.categoryList);
      setRecentPostsList(response.data.response.recentBlogs);

      TitleRef.current = data.meta_title;
      DescriptionRef.current = data.meta_description;
      KeywordsRef.current = data.meta_keyword;
    } catch (error) {
      Swal.fire({
        icon: "warning",
        title: "No Blog Found!",
        text: "This blog does not exist or was removed.",
      });

      router.push("/blog");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------
  // 👉 GET COMMENTS
  // ---------------------------------
  const getPostComment = async () => {
    try {
      const response = await axios.get(
        BaseAPI + `/blog/comments/${slug}`
      );
      setComments(response.data.comments);
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------------------------
  // LOAD DATA ON PARAM CHANGE
  // ---------------------------------
  useEffect(() => {
    getData();
    getPostComment();
  }, [slug]);

  // ---------------------------------
  // COMMENT FORM SUBMIT
  // ---------------------------------
  const validateForm = () => {
    let newErrors = {};
    if (!formData.comment) newErrors.comment = "Please enter a comment.";
    if (!formData.name) newErrors.name = "Please enter your name.";
    if (!formData.email) newErrors.email = "Please enter your email.";
    else if (!isValidEmail(formData.email))
      newErrors.email = "Invalid email address.";
    if (!formData.recaptcha) newErrors.recaptcha = "Verify reCAPTCHA.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePostComment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        BaseAPI + `/blog/comments/${slug}`,
        formData
      );

      if (response.data.status === "200") {
        Swal.fire("Success", "Your comment was submitted!", "success");
        setFormData({
          name: "",
          email: "",
          comment: "",
          website: "",
          recaptcha: "",
        });

        getPostComment();
      }
    } catch (error) {
      Swal.fire("Error", "Could not submit comment.", "error");
    }
    setLoading(false);
  };

  // ---------------------------------
  // SUBSCRIBE HANDLER
  // ---------------------------------
  const handleSubscribe = async () => {
    let err = {};

    if (!subscribeForm.email) err.email = "Enter email.";
    else if (!isValidEmail(subscribeForm.email))
      err.email = "Invalid email.";

    if (!subscribeForm.recaptcha) err.recaptcha = "Verify reCAPTCHA.";

    if (Object.keys(err).length) {
      setSubErrors(err);
      return;
    }

    try {
      const response = await axios.post(
        BaseAPI + "/blog/subscribe",
        { email_address: subscribeForm.email }
      );

      if (response.data.status === "200") {
        Swal.fire("Success", "Subscribed to blog!", "success");
      } else {
        Swal.fire({
          icon: "warning",
          title: "",
          text: response.data.message || "Try again later.",
        });
      }

      recaptchaRef.current.reset();


      setSubscribeForm({ email: "", recaptcha: "" });
    } catch (error) {
      Swal.fire("Error", "Subscription failed!", "error");
    }
  };

  // ---------------------------------
  // RENDER PAGE
  // ---------------------------------

  if (loading) return <Loader />;

  return (
    <>
    <Header />
      {/* MAIN PAGE */}
      <div className="container mx-auto my-10 px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col lg:flex-row gap-12">

          {/* -------------------------- */}
          {/* LEFT CONTENT (BLOG) */}
          {/* -------------------------- */}
          <div className="lg:w-3/4">

            {/* Title */}
            <h1 className="text-3xl font-bold">{blogData.subject}</h1>

            {/* Date + Category */}
            <p className="text-sm text-gray-500 mt-2">
              {new Date(blogData.created_at).toLocaleDateString("en-US")} /

              {blogData.category_id &&
                blogData.category_id.split(",").map((cat, i) => (
                  <span key={i}>
                    <Link
                      href={`/blog/category/${cat
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="text-blue-600 ml-1"
                    >
                      {cat.trim()}
                    </Link>
                    {i < blogData.category_id.split(",").length - 1 && ", "}
                  </span>
                ))}
            </p>

            {/* Image */}
            {blogData.image && (
              <Image
                src={blogData.image}
                width={975}
                height={450}
                alt={blogData.subject}
                className="rounded my-6"
              />
            )}

            {/* Blog Content */}
            <div className="prose max-w-none text-black">
              {parse(blogData.blog_description || "")}
            </div>

            {/* Tags */}
            <div className="mt-6">
              <p className="font-medium text-lg flex items-center gap-1">
                <BsFillTagFill /> Tags
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {blogData.tags &&
                  blogData.tags.split(",").map((tag, i) => (
                    <Link
                      key={i}
                      href={`/blog/tag/${tag.trim().replace(/\s+/g, "-")}`}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md"
                    >
                      {tag.trim()}
                    </Link>
                  ))}
              </div>
            </div>

            {/* Comments */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold">Comments</h2>

              {comments.length === 0 ? (
                <p>No comments yet.</p>
              ) : (
                <ul className="mt-3 space-y-4">
                  {comments.map((c) => (
                    <li key={c.id} className="p-3 border rounded-md shadow-sm">
                      <p className="font-bold">{c.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(c.created_at).toLocaleDateString()}
                      </p>
                      <div className="mt-2">{parse(c.comment)}</div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Comment Form */}
              <h3 className="text-lg mt-6 font-medium">Leave a Reply</h3>

              <div className="mt-4">
                {/* Comment */}
                <textarea
                  id="comment"
                  rows="4"
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  className="w-full p-3 border rounded-md"
                  placeholder="Write your comment"
                />
                {errors.comment && (
                  <p className="text-red-500 text-sm">{errors.comment}</p>
                )}

                {/* Name */}
                <input
                  id="name"
                  className="w-full p-3 mt-3 border rounded-md"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}

                {/* Email */}
                <input
                  id="email"
                  className="w-full p-3 mt-3 border rounded-md"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}

                {/* Website */}
                <input
                  id="website"
                  className="w-full p-3 mt-3 border rounded-md"
                  placeholder="Website"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                />

                <div className="mt-3">
                  <ReCAPTCHA
                    sitekey={recaptchaKey}
                    onChange={(v) =>
                      setFormData({ ...formData, recaptcha: v })
                    }
                  />
                  {errors.recaptcha && (
                    <p className="text-red-500 text-sm">{errors.recaptcha}</p>
                  )}
                </div>

                <button
                  onClick={handlePostComment}
                  className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-md"
                >
                  POST COMMENT
                </button>
              </div>
            </div>
          </div>

          {/* -------------------------- */}
          {/* RIGHT SIDEBAR */}
          {/* -------------------------- */}
          <div className="lg:w-1/3 sticky top-6 h-fit">

            {/* Search */}
            <div className="mb-6">
              <p className="text-lg font-semibold">Search</p>
              <div className="relative mt-1">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-3 py-2 border rounded-md"
                />
                <FaSearch className="absolute right-3 top-2/4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Categories</h4>
              <ul>
                {categoryList.map((cat) => (
                  <li key={cat.id} className="mb-2 flex items-center gap-1">
                    <IoIosArrowForward />
                    <Link
                      href={`/blog/category/${cat.slug}`}
                      className="text-blue-600"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscribe */}
            <div className="border p-4 rounded-md shadow mb-6">
              <p className="font-semibold text-lg mb-2">
                Subscribe to our Blog
              </p>

              <input
                className="w-full p-2 border rounded"
                placeholder="Enter email"
                value={subscribeForm.email}
                onChange={(e) =>
                  setSubscribeForm({ ...subscribeForm, email: e.target.value })
                }
              />
              {subErrors.email && (
                <p className="text-red-500 text-sm">{subErrors.email}</p>
              )}

              <div className="mt-2">
                <ReCAPTCHA
                 ref={recaptchaRef}
                  sitekey={recaptchaKey}
                  onChange={(v) =>
                    setSubscribeForm({ ...subscribeForm, recaptcha: v })
                  }
                />
                {subErrors.recaptcha && (
                  <p className="text-red-500 text-sm">{subErrors.recaptcha}</p>
                )}
              </div>

              <button
                className="w-full mt-3 py-2 bg-blue-600 text-white rounded-md"
                onClick={handleSubscribe}
              >
                SUBSCRIBE
              </button>
            </div>

            {/* Recent Posts */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Recent Posts</h4>
              <ul>
                {recentPostsList.map((r) => (
                  <li key={r.slug} className="flex items-center gap-1 mb-2">
                    <IoIosArrowForward />
                    <Link
                      href={`/blog/${r.slug}`}
                      className="text-blue-600"
                    >
                      {r.subject}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
export default Page;
