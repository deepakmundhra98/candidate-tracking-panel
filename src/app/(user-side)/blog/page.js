"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import parse from "html-react-parser";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { FaSearch } from "react-icons/fa";
import Loader from "../../Components/Loader";
import { IoIosArrowForward } from "react-icons/io";
import Swal from "sweetalert2";
import Image from "next/image";
import Header from "@/app/Components/Header";
import Footer from "@/app/Components/Footer/Footer";
import BaseAPI from "@/app/BaseAPI/BaseAPI";



const Page = () => {
  const recaptchaKey = "6Ld_kMcqAAAAAB1nFQrF68fTbpK61mFG__bXQBe-";
  const [blogData, setBlogData] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 15;
  const [categoryList, setCategoryList] = useState([]);
  const [recentPostsList, setRecentPostsList] = useState([]);
  const [loading, setLoading] = useState(false);

  // For subscription form
  const [formData, setFormData] = useState({
    email: "",
    recaptcha: "",
  });
  const [errors, setErrors] = useState({});

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handlePageChange = (pageNumber) => {
    window.scrollTo(0, 0);
    setCurrentPage(pageNumber);
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(BaseAPI + "/blog/listing");
      setBlogData(response.data.response.blogData);
      setFilteredBlogs(response.data.response.blogData);
      setCategoryList(response.data.response.categoryList);
      setRecentPostsList(response.data.response.recentBlogs);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = blogData.filter((blog) => {
      const fields = [
        blog.subject,
        blog.meta_title,
        blog.meta_keyword,
        blog.blog_description,
        blog.tags,
      ];
      return fields.some((field) =>
        field ? field.toLowerCase().includes(value) : false
      );
    });

    setFilteredBlogs(filtered);
    setCurrentPage(1);
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: "" });
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onRecaptchaChange = (value) => {
    setFormData({ ...formData, recaptcha: value });
    setErrors({ ...errors, recaptcha: "" });
  };

  const onRecaptchaExpired = () => {
    setFormData({ ...formData, recaptcha: "" });
    setErrors({ ...errors, recaptcha: "reCAPTCHA expired. Please verify again." });
  };

  const handleSubscribe = async (event) => {
    event.preventDefault();
    let newErrors = {};

    if (!formData.email) newErrors.email = "Please enter email.";
    else if (!isValidEmail(formData.email))
      newErrors.email = "Entered email is invalid.";

    if (!formData.recaptcha)
      newErrors.recaptcha = "Please complete reCAPTCHA verification.";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        BaseAPI + "/blog/subscribe",
        { email_address: formData.email }
      );

      if (response.data.status === "200") {
        Swal.fire("Success", "You have subscribed successfully!", "success");
      } else if (response.data.status === "500") {
        Swal.fire("Warning", "You have already subscribed.", "warning");
      }

      setFormData({ email: "", recaptcha: "" });
    } catch (error) {
      setErrors({ api: "Subscription failed. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header />
      {loading ? (
        <Loader />
      ) : (
        <div>
          {/* Banner */}
          <div className="bg-blue-600 py-6 mb-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Achieve Hiring Excellence with the ATSWAY Blog
              </h1>
              <p className="text-lg text-white">
                Expert hiring insights, ATS strategies, and workforce trends to help
                you win top talent.
              </p>
            </div>
          </div>

          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row gap-10 px-4 sm:px-6 lg:px-8">

              {/* LEFT SECTION */}
              <div className="lg:w-3/4 flex flex-col">
                {currentBlogs.length > 0 ? (
                  currentBlogs.map((blog) => (
                    <div key={blog.id} className="bg-white shadow-lg rounded-lg p-6 mb-6">

                      {/* Title */}
                      <h1 className="text-xl font-semibold">
                        <Link
                          href={`/blog/${blog.slug}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          {blog.subject}
                        </Link>
                      </h1>

                      {/* Date + Category */}
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(blog.created_at).toLocaleDateString("en-US")}
                        {" / "}
                        {blog.category_names &&
                          blog.category_names.split(",").map((cat, i) => (
                            <span key={i}>
                              <Link
                                href={`/blog/category/${cat
                                  .trim()
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                                className="text-blue-600"
                              >
                                {cat.trim()}
                              </Link>
                              {i < blog.category_names.split(",").length - 1 && ", "}
                            </span>
                          ))}
                      </p>

                      {/* Tags */}
                      <p className="text-sm text-gray-600 mt-2">
                        {blog.tags &&
                          blog.tags.split(",").map((tag, i) => (
                            <Link
                              key={i}
                              href={`/blog/tag/${tag.trim().replace(/\s+/g, "-")}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {tag.trim()}
                              {i < blog.tags.split(",").length - 1 && ", "}
                            </Link>
                          ))}
                      </p>

                      {/* Blog Image */}
                      <Image
                        src={blog.image || "/img/blog/dummy-blog-post.jpg"}
                        width={975}
                        height={400}
                        className="rounded my-4"
                        alt={blog.subject}
                      />

                      {/* Description */}
                      <p className="text-gray-700 mt-4">
                        {parse(
                          blog.blog_description.length > 200
                            ? blog.blog_description.slice(0, 200) + "..."
                            : blog.blog_description
                        )}
                      </p>

                      <Link
                        href={`/blog/${blog.slug}`}
                        className="text-blue-500 hover:text-blue-700 mt-4 inline-block"
                      >
                        READ MORE
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-indigo-500 text-xl font-semibold">
                    No blogs found...
                  </p>
                )}

                {/* Pagination */}
                {filteredBlogs.length > 0 && (
                  <div className="flex justify-center items-center space-x-2 my-6">
                    <button
                      className="px-4 py-2 bg-gray-300 rounded-md"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, idx) => (
                      <button
                        key={idx}
                        className={`px-4 py-2 border rounded-md ${
                          currentPage === idx + 1
                            ? "bg-blue-500 text-white"
                            : "bg-white text-blue-500"
                        }`}
                        onClick={() => handlePageChange(idx + 1)}
                      >
                        {idx + 1}
                      </button>
                    ))}

                    <button
                      className="px-4 py-2 bg-gray-300 rounded-md"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="w-full lg:w-1/3 mt-8 lg:mt-0">

                {/* Search */}
                <p className="text-lg font-semibold mb-1">Search</p>
                <div className="relative mb-4">
                  <input
                    className="w-full px-3 py-2 border rounded-md"
                    type="text"
                    value={searchText}
                    onChange={handleSearchChange}
                    placeholder="Search by title or tags"
                  />
                  <FaSearch className="absolute right-3 top-2/4 -translate-y-1/2 text-gray-400" />
                </div>

                {/* Categories */}
                <aside className="mt-3">
                  <h4 className="text-lg font-semibold mb-2">Categories</h4>
                  <ul>
                    {categoryList.map((cat) => (
                      <li key={cat.id} className="flex items-center gap-1 mb-2">
                        <IoIosArrowForward />
                        <Link
                          href={`/blog/category/${cat.slug}`}
                          className="text-blue-600 hover:underline"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </aside>

                {/* Subscribe Widget */}
                <div className="mb-8 border border-gray-300 rounded-md p-4 shadow-lg">
                  <p className="font-bold text-lg mb-3">Subscribe to Our Blog</p>

                  <input
                    id="email"
                    className="w-full h-10 px-3 border rounded"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                  <div className="mt-2">
                    <ReCAPTCHA
                      sitekey={recaptchaKey}
                      onChange={onRecaptchaChange}
                      onExpired={onRecaptchaExpired}
                    />
                    {errors.recaptcha && (
                      <p className="text-red-500 text-sm">{errors.recaptcha}</p>
                    )}
                  </div>

                  <button
                    className="w-full mt-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={handleSubscribe}
                  >
                    SUBSCRIBE
                  </button>
                </div>

                {/* Recent Posts */}
                <aside className="my-8">
                  <h4 className="text-lg font-semibold mb-4">Recent Posts</h4>
                  <ul>
                    {recentPostsList.map((post) => (
                      <li key={post.slug} className="flex items-center gap-1 mb-2">
                        <IoIosArrowForward />
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-blue-600 hover:underline"
                        >
                          {post.subject}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </aside>

              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Page;
