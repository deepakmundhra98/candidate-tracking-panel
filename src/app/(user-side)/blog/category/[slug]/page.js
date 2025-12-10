"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import parse from "html-react-parser";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/navigation";
import Loader from "../../../../Components/Loader";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import Swal from "sweetalert2";
import Footer from "@/app/Components/Footer/Footer";
import Header from "@/app/Components/Header";
import BaseAPI from "@/app/BaseAPI/BaseAPI";

export default function BlogCategoryPage({ params }) {
  const { slug } = params;
  const router = useRouter();

  const recaptchaKey = "6Ld_kMcqAAAAAB1nFQrF68fTbpK61mFG__bXQBe-";

  const [loading, setLoading] = useState(false);
  const [blogData, setBlogData] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 15;

  const [categoryList, setCategoryList] = useState([]);
  const [recentPostsList, setRecentPostsList] = useState([]);

  const [subscribeForm, setSubscribeForm] = useState({
    email: "",
    recaptcha: "",
  });
  const [subErrors, setSubErrors] = useState({});

  // -------------------------------------------
  // GET ALL BLOG DATA
  // -------------------------------------------
  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        BaseAPI + "/blog/listing"
      );
      const allBlogs = response.data.response.blogData;

      setBlogData(allBlogs);
      setCategoryList(response.data.response.categoryList);
      setRecentPostsList(response.data.response.recentBlogs);

      const filtered = allBlogs.filter((blog) =>
        blog.category_names
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .includes(slug)
      );

      setFilteredBlogs(filtered);
    } catch (error) {
      console.error(error);
      router.push("/hr-blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [slug]);

  // -------------------------------------------
  // SEARCH HANDLER
  // -------------------------------------------
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    if (!value) {
      const filtered = blogData.filter((blog) =>
        blog.category_names
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .includes(slug)
      );
      setFilteredBlogs(filtered);
      return;
    }

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

  // -------------------------------------------
  // PAGINATION
  // -------------------------------------------
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(
    indexOfFirstBlog,
    indexOfLastBlog
  );
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // -------------------------------------------
  // SUBSCRIBE HANDLER
  // -------------------------------------------
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubscribe = async () => {
    let err = {};

    if (!subscribeForm.email) err.email = "Please enter email.";
    else if (!isValidEmail(subscribeForm.email))
      err.email = "Entered email is invalid.";

    if (!subscribeForm.recaptcha)
      err.recaptcha = "Please complete reCAPTCHA.";

    if (Object.keys(err).length > 0) {
      setSubErrors(err);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        BaseAPI + "/blog/subscribe",
        { email_address: subscribeForm.email }
      );

      if (response.data.status === "200") {
        Swal.fire("Success", "Subscribed successfully!", "success");
      } else {
        Swal.fire("Warning", "Already subscribed!", "warning");
      }

      setSubscribeForm({ email: "", recaptcha: "" });
    } catch (error) {
      Swal.fire("Error", "Subscription failed!", "error");
    }
    setLoading(false);
  };

  // -------------------------------------------
  // RENDER
  // -------------------------------------------
  if (loading) return <Loader />;

  return (
    <>
    <Header />  
      {/* Banner */}
      <div className="bg-blue-600 py-6 mb-6">
        <div className="container mx-auto">
          <h1 className="text-4xl text-white font-bold px-4">
            Blog Category: {slug.replace(/-/g, " ").toUpperCase()}
          </h1>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 px-4">

          {/* LEFT CONTENT */}
          <div className="lg:w-3/4">

            {currentBlogs.length > 0 ? (
              currentBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white shadow rounded-lg p-6 mb-6"
                >
                  <h2 className="text-xl font-semibold">
                    <Link
                      href={`/hr-blog/${blog.slug}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {blog.subject}
                    </Link>
                  </h2>

                  <p className="text-gray-500 mt-1 text-sm">
                    {new Date(blog.created_at).toLocaleDateString("en-US")} /
                    {blog.category_names.split(",").map((cat, i) => (
                      <Link
                        key={i}
                        href={`/hr-blog/category/${cat
                          .trim()
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="text-blue-600 ml-1"
                      >
                        {cat.trim()}
                      </Link>
                    ))}
                  </p>

                  {/* Tags */}
                  <p className="mt-2 text-sm text-gray-600">
                    {blog.tags.split(",").map((tag, i) => (
                      <Link
                        key={i}
                        href={`/hr-blog/tag/${tag.trim().replace(/\s+/g, "-")}`}
                        className="text-blue-600"
                      >
                        {tag.trim()}
                        {i < blog.tags.split(",").length - 1 ? ", " : ""}
                      </Link>
                    ))}
                  </p>

                  {blog.image && (
                    <Image
                      src={blog.image}
                      alt={blog.subject}
                      width={700}
                      height={400}
                      className="rounded my-4"
                    />
                  )}

                  <div className="text-gray-700">
                    {parse(
                      blog.blog_description.length > 200
                        ? blog.blog_description.slice(0, 200) + "..."
                        : blog.blog_description
                    )}
                  </div>

                  <Link
                    href={`/hr-blog/${blog.slug}`}
                    className="text-blue-500 mt-3 inline-block"
                  >
                    READ MORE
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-lg text-gray-500">
                No blogs found.
              </p>
            )}

            {/* Pagination */}
            {currentBlogs.length > 0 && (
              <div className="flex justify-center mt-4 gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:w-1/3">

            {/* Search */}
            <p className="font-semibold">Search</p>
            <div className="relative mb-5">
              <input
                className="w-full px-3 py-2 border rounded"
                type="text"
                value={searchText}
                onChange={handleSearchChange}
              />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Categories */}
            <h3 className="font-semibold mb-2">Categories</h3>
            <ul className="mb-5">
              {categoryList.map((cat) => (
                <li key={cat.id} className="flex items-center mb-2">
                  <IoIosArrowForward />
                  <Link
                    href={`/hr-blog/category/${cat.slug}`}
                    className="text-blue-600 ml-1"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Subscribe */}
            <div className="border p-4 rounded shadow mb-6">
              <p className="font-semibold mb-2">Subscribe</p>
              <input
                className="w-full px-2 py-2 border rounded"
                placeholder="Email"
                value={subscribeForm.email}
                onChange={(e) =>
                  setSubscribeForm({
                    ...subscribeForm,
                    email: e.target.value,
                  })
                }
              />
              {subErrors.email && (
                <p className="text-red-500 text-sm">{subErrors.email}</p>
              )}

              <div className="mt-2">
                <ReCAPTCHA
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
                onClick={handleSubscribe}
                className="w-full mt-3 py-2 bg-blue-600 text-white rounded"
              >
                SUBSCRIBE
              </button>
            </div>

            {/* Recent Posts */}
            <h3 className="font-semibold mb-3">Recent Posts</h3>
            <ul>
              {recentPostsList.map((post) => (
                <li key={post.slug} className="flex mb-2">
                  <IoIosArrowForward />
                  <Link
                    href={`/hr-blog/${post.slug}`}
                    className="text-blue-600 ml-1"
                  >
                    {post.subject}
                  </Link>
                </li>
              ))}
            </ul>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
