"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";

import { FiCheckCircle } from "react-icons/fi";
import "swiper/swiper-bundle.css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import axios from "axios";
import DemoModal from "../Components/DemoModal";
import Image from "next/image";
import BaseAPI from "../BaseAPI/BaseAPI";
const Page = () => {
  const [blogData, setBlogData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    getData();
  }, []);


    const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const faqData = [
    {
      q: "What is an ATS?",
      a: "An ATS (Applicant Tracking System) is a tool that helps organize the hiring process. It automatically collects, sorts, and manages job applications, making it easier for hiring teams to track candidates, communicate with them, and find the best fit for the job.",
    },
    {
      q: "What are the best ATS systems for small businesses?",
      a: "The best ATS for small businesses should be easy to use, affordable, and scalable. ATSWAY is a great choice because it offers simple features, strong support, and helps small businesses stay organized while hiring.",
    },
    {
      q: "What are the main benefits of using an ATS?",
      a: "An ATS speeds up the hiring process by automatically sorting resumes, making it easier to find relevant candidates. It also keeps all candidate information in one place for collaborative hiring.",
    },
    {
      q: "How do applicant tracking systems work?",
      a: "When a candidate applies, the ATS scans the resume for details like contact info, skills, and experience. This data is stored so hiring teams can view and manage applicants easily throughout the hiring process.",
    },
    {
      q: "What other features does an ATS have?",
      a: (
        <>
          <p>An ATS includes multiple useful hiring features:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Resume Parsing & Candidate Database</li>
            <li>Job Posting & Application Management</li>
            <li>Workflow & Pipeline Tracking</li>
            <li>Analytics & Reports</li>
            <li>Integrations & Automation Tools</li>
          </ul>
        </>
      ),
    },
  ];


  const getData = async () => {
    try {
      const response = await axios.get(
        BaseAPI + "/blog/listing"
      );
      setBlogData(response.data.response.blogData);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      
      <div className="bg-white !py-2 lg:py-0">
        <div className="container mx-auto my-12 ">
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 px-4 sm:px-6 lg:px-8">
            <div className="md:w-1/2 text-center md:text-left flex flex-col">
              <h1 className="text-4xl leading-tight font-bold mb-2 text-left">
                Applicant Tracking System for Agency Recruiters
              </h1>
              <p className="text-lg font-bold mb-2 text-left">
                Find, Hire, and Onboard Talent with Ease
              </p>
              <p className="text-md mb-6 text-left">
                Atsway simplifies your hiring process. Our Applicant tracking
                system with integrated HR features helps you attract the right
                candidates, collaborate with your team, and make the hiring
                process smoother from start to finish. With our easy-to-use
                tools, you can quickly manage and track applicants, and even
                handle essential HR tasks like payroll and attendance
                management—all in one place.
              </p>
              {/* <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 font-medium text-white px-6 py-3 rounded self-start"
              >
                Request a Demo
              </button> */}
            </div>
            <div className="md:w-1/2 md:h-full flex justify-center md:justify-end mt-8 md:mt-0">
              <img
                src="../Images/home/banner.png"
                alt="Banner"
                className="size-3/4 div-vertical"
              />
            </div>
          </div>
        </div>
        <div
          className="bg-cover bg-center h-[500px]"
          style={{ backgroundImage: "url('/Images/home/background.png')" }}
        >
          <div className="container mx-auto mt-5 ">
            <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 px-4  sm:px-6 lg:px-8">
              <div className="md:w-1/2 text-center md:text-left my-20">
                <h2 className="text-3xl font-bold mb-4 text-left">
                  Efficient Recruiting with Our ATS Software
                </h2>
                <p className="text-md mb-6 text-left">
                  Our AI-Powered Applicant Tracking System (ATS) makes
                  recruiting easier and faster while enhancing HR and payroll
                  management. It helps you find the right candidates quickly by
                  organizing everything from job posts to hires while keeping
                  track of employee attendance, payroll processing, and
                  onboarding tasks. With a simple, easy-to-use platform, you’ll
                  save time on repetitive tasks and focus more on what matters.
                </p>
                <p className="text-md mb-6 text-left">
                  You can customize how things work, track candidates through
                  each step, and work closely with your team. Our ATS makes the
                  hiring process smoother, so you can spend less time on the
                  admin side and more time finding the best talent for your
                  team.
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0">
                <img
                  src="/Images/home/image3.png"
                  alt="Hero"
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-5">
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 px-4  sm:px-6 lg:px-8">
            <div>
              <h2 className="text-3xl text-black font-bold text-center mb-8">
                Benefits of Choosing ATS Software
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <img
                    src="/Images/home/icon1.png"
                    alt="icon1"
                    className="div-vertical"
                  />
                  <h3 className="text-lg font-semibold my-2">Hire Faster</h3>
                  <p className="text-md">
                    Reduce the time it takes to fill positions by automating
                    repetitive tasks and focusing on what matters.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <img
                    src="/Images/home/icon2.png"
                    alt="icon1"
                    className="div-horizontal"
                  />
                  <h3 className="text-lg font-semibold my-2">Stay Organized</h3>
                  <p className="text-md">
                    Keep track of all your recruitment activities in one place,
                    from job postings to candidate interviews.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <img
                    src="/Images/home/icon3.png"
                    alt="icon1"
                    className="div-vertical"
                  />
                  <h3 className="text-lg font-semibold my-2">
                    Better Collaboration
                  </h3>
                  <p className="text-md">
                    Communicate easily with your team and candidates to ensure a
                    smooth hiring process.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <img
                    src="/Images/home/icon4.png"
                    alt="icon1"
                    className="div-horizontal"
                  />
                  <h3 className="text-lg font-semibold my-2">
                    Find Top Talent
                  </h3>
                  <p className="text-md">
                    Use smart sourcing tools to build a strong talent pool and
                    connect with the right candidates.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <img
                    src="/Images/home/icon5.png"
                    alt="icon1"
                    className="div-vertical"
                  />
                  <h3 className="text-lg font-semibold my-2">
                    Improve Candidate Experience
                  </h3>
                  <p className="text-md">
                    Make it easy for job seekers to apply and stay updated
                    throughout the hiring process.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <img
                    src="/Images/home/icon6.png"
                    alt="icon1"
                    className="div-horizontal"
                  />
                  <h3 className="text-lg font-semibold my-2">
                    Make Smarter Decisions
                  </h3>
                  <p className="text-md">
                    Get useful insights with recruitment analytics to hire the
                    best fit for your team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-12 custom-class">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 p-0 flex flex-col-reverse md:flex-row justify-between items-center ">
            <div className="h-full">
              <img
                src="/Images/home/Mask group.png"
                alt="Hero"
                className="h-full"
              />
            </div>

            <div className="md:w-1/2 bg-[#16384D] text-left md:text-left p-6 flex flex-col">
              <h2 className="text-3xl text-white font-bold mb-4">
                The Future of Applicant Tracking Systems (ATS)
              </h2>
              <p className="mb-6 text-white">
                As technology advances, ATS will become smarter and more
                efficient, benefiting both employers and job seekers.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div>
                    <FiCheckCircle className="text-white text-xl mr-1" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">AI-Powered Hiring:</h3>
                    <p className="text-white">
                      Future ATS will use AI to understand applicants' career
                      journeys and predict job success, focusing on skills and
                      experience, not just keywords.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div>
                    <FiCheckCircle className="text-white text-xl mr-1" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Video Resumes:</h3>
                    <p className="text-white">
                      ATS may support video resumes or cover letters, offering a
                      more personal view of candidates. Virtual and augmented
                      reality might also play a role in showcasing skills.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div>
                    <FiCheckCircle className="text-white text-xl mr-1" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">
                      Better Candidate Experience:
                    </h3>
                    <p className="text-white">
                      ATS will make the application process smoother with
                      automated feedback, real-time interactions, and a more
                      engaging experience for candidates.
                    </p>
                  </div>
                </li>
              </ul>
              {/* <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 ml-6 px-2.5 w-40 py-2 bg-white text-black font-bold rounded-lg shadow-lg hover:bg-gray-400"
              >
                See it in action
              </button> */}
            </div>
          </div>
        </div>

        <section className="my-12 container mx-auto bg-white px-4 my-12 sm:px-6 lg:px-8 ">
          <h2 className="text-3xl text-center font-bold mb-10 pt-6 ">
            Testimonials
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <div className="bg-white shadow-lg p-6 rounded flex flex-col justify-between">
              <img
                alt="profilepic."
                class="w-24 h-24 rounded-full mx-auto mb-4"
                src="../Images/home/T1.png"
              />
              <p class="text-gray-700 mb-4">
                ATSWAY has really helped us improve our hiring efficiency. It
                keeps everything in one place and ensures we never miss an
                important step.
              </p>
              <p class="font-bold">Josh L., Hiring Manager</p>
            </div>
            <div className="bg-white shadow-lg p-6 rounded flex flex-col justify-between">
              <img
                alt="profilepic."
                class="w-24 h-24 rounded-full mx-auto mb-4"
                src="../Images/home/T2.png"
              />
              <p class="text-gray-700 mb-4">
                ATSWAY is simple, effective, and customizable. The candidate
                tracking feature has been especially useful for our team, and we
                love how it keeps everyone in sync.
              </p>
              <p class="font-bold">David H., Director of Human Resources</p>
            </div>
            <div className="bg-white shadow-lg p-6 rounded flex flex-col justify-between">
              <img
                alt="profilepic."
                class="w-24 h-24 rounded-full mx-auto mb-4"
                src="../Images/home/T3.png"
              />
              <p class="text-gray-700 mb-4">
                We love how easy it is to use ATSway. The candidate filtering
                and communication tools are exactly what we needed. It’s helped
                us make quicker, better hiring decisions.
              </p>
              <p class="font-bold">Olivia P., Head of Talent Acquisition</p>
            </div>
          </div>
        </section>

        <div class="container mx-auto py-12">
          <div class="text-center mb-8">
            <h3 class="text-3xl font-bold mb-2">OUR BLOGS</h3>
            <p class="text-gray-600">
              Expert hiring insights, ATS strategies, and workforce trends to
              help you win top talent.
            </p>
          </div>

          <Swiper
            spaceBetween={20}
            slidesPerView={2}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            breakpoints={{
              1640: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
             
              768: {
                slidesPerView: 2, 
                spaceBetween: 20, 
              },

              0: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
            }}
          >
            {blogData.length > 0 &&
              blogData.map((blog, index) => (
                <SwiperSlide key={index}>
                  <div className="group relative">
                    <img
                      src={blog.image}
                      alt="The Future of Blockchain: Top Trends Shaping Industry in 2024"
                      className="w-full h-auto"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:!opacity-50 transition-opacity"></div>
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="absolute bottom-4 left-4 bg-purple-600 text-white font-medium px-4 py-2 rounded opacity-0 group-hover:!opacity-100 transition-opacity"
                    >
                      Read more
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>

        {/* <section
          className="bg-cover bg-center h-[800px]"
          style={{ backgroundImage: "url('/Images/home/banner2.png')" }}
        >
          <div className="container mx-auto pt-10">
            <div className=" text-center text-black font-bold text-3xl px-4 py-6 sm:px-6 lg:px-8 ">
              <h2>Frequently Asked Questions</h2>
            </div>
            <div className="flex flex-col-reverse md:flex-row  gap-4 px-4 py-6 sm:px-6 lg:px-8">
              <div className="md:w-1/2 text-center md:text-left rounded-md ">
                <div
                  class="accordion accordion-flush rounded-md"
                  id="accordionFlushExample"
                >
                  <div class="accordion-item">
                    <h3 class="accordion-header" id="flush-headingOne">
                      <button
                        class="accordion-button collapsed text-lg font-bold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseOne"
                        aria-expanded="false"
                        aria-controls="flush-collapseOne"
                      >
                        What is an ATS?
                      </button>
                    </h3>
                    <div
                      id="flush-collapseOne"
                      class="accordion-collapse collapse"
                      aria-labelledby="flush-headingOne"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body text-left">
                        An ATS (Applicant Tracking System) is a tool that helps
                        organize the hiring process. It automatically collects,
                        sorts, and manages job applications. It makes it easier
                        for hiring teams to keep track of candidates,
                        communicate with them, and find the best fit for the
                        job.
                      </div>
                    </div>
                  </div>

                  <div class="accordion-item">
                    <h3 class="accordion-header" id="flush-headingTwo">
                      <button
                        class="accordion-button collapsed text-lg font-bold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseTwo"
                        aria-expanded="false"
                        aria-controls="flush-collapseTwo"
                      >
                        What are the best ATS systems for small businesses?
                      </button>
                    </h3>
                    <div
                      id="flush-collapseTwo"
                      class="accordion-collapse collapse"
                      aria-labelledby="flush-headingTwo"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body text-left">
                        The best ATS for small businesses should be easy to use,
                        affordable, and able to grow with your company. ATSWAY
                        is a good choice because it has simple features, is
                        cost-effective, and offers great support. It helps small
                        businesses save time while keeping things organized as
                        they hire.
                      </div>
                    </div>
                  </div>

                  <div class="accordion-item">
                    <h3 class="accordion-header" id="flush-headingThree">
                      <button
                        class="accordion-button collapsed text-lg font-bold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseThree"
                        aria-expanded="false"
                        aria-controls="flush-collapseThree"
                      >
                        What are the main benefits of using an ATS?
                      </button>
                    </h3>
                    <div
                      id="flush-collapseThree"
                      class="accordion-collapse collapse"
                      aria-labelledby="flush-headingThree"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body text-left">
                        Using an ATS helps speed up the hiring process. It
                        automatically sorts resumes, making it quicker to find
                        the right candidates. It also keeps all candidate
                        information in one place, making it easier for the
                        hiring team to work together.
                      </div>
                    </div>
                  </div>

                  <div class="accordion-item">
                    <h3 class="accordion-header" id="flush-headingFour">
                      <button
                        class="accordion-button collapsed text-lg font-bold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseFour"
                        aria-expanded="false"
                        aria-controls="flush-collapseFour"
                      >
                        How do applicant tracking systems work?
                      </button>
                    </h3>
                    <div
                      id="flush-collapseFour"
                      class="accordion-collapse collapse"
                      aria-labelledby="flush-headingFour"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body text-left">
                        When a candidate applies for a job, the ATS scans their
                        resume to get important details like their contact info,
                        work experience, and skills. This information is stored
                        in a system where the hiring team can easily find and
                        review it. The ATS also helps communicate with
                        applicants and keeps track of where they are in the
                        hiring process.
                      </div>
                    </div>
                  </div>

                  <div class="accordion-item">
                    <h3 class="accordion-header" id="flush-headingFive">
                      <button
                        class="accordion-button collapsed text-lg font-bold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseFive"
                        aria-expanded="false"
                        aria-controls="flush-collapseFive"
                      >
                        What other features does an ATS have?
                      </button>
                    </h3>
                    <div
                      id="flush-collapseFive"
                      class="accordion-collapse collapse"
                      aria-labelledby="flush-headingFive"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body text-left">
                        <p>
                          An ATS has many useful features to help with hiring:
                        </p>
                        <ul class="list-disc list-inside">
                          <li>
                            Resume Parsing and Candidate Database: It reads
                            resumes and stores candidate details for future use.
                          </li>
                          <li>
                            Job Posting and Application Management: Post jobs on
                            different platforms and track applicants in one
                            place.
                          </li>
                          <li>
                            Workflow and Pipeline Management: See where each
                            candidate is in the hiring process and adjust
                            workflows as needed.
                          </li>
                          <li>
                            Analytics and Reporting: Get simple reports on
                            things like how long it takes to hire and how
                            candidates feel about the process.
                          </li>
                          <li>
                            Integration and Automation: It works with other
                            tools like payroll or onboarding and can automate
                            tasks like sending emails or scheduling interviews.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0 ">
                <img
                  src="/Images/home/faq.png"
                  alt="Hero"
                  className="rounded-sm "
                />
              </div>
            </div>
          </div>
        </section> */}

            <section
      className="bg-cover bg-center h-[700px]"
      style={{ backgroundImage: "url('/Images/home/banner2.png')" }}
    >
      <div className="container mx-auto pt-10">
        {/* Heading */}
        <div className="text-center text-black font-bolder text-3xl px-4 py-6">
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-4 px-4 py-6">

          {/* Accordion Left */}
          <div className="bg-white px-4 h-full pb-3 lg:w-1/2 text-center lg:text-left rounded-md">
            {faqData.map((item, i) => (
              <div key={i} className="border-b border-gray-300 py-3">
                <button
                  className="w-full flex justify-between items-center text-left text-lg font-bold"
                  onClick={() => toggle(i)}
                >
                  {item.q}
                  <span className="text-xl">{openIndex === i ? "−" : "+"}</span>
                </button>

                <div
                  className={`transition-all overflow-hidden ${
                    openIndex === i ? "max-h-60 mt-2" : "max-h-0"
                  }`}
                >
                  <div className="text-gray-700 text-left">{item.a}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Image */}
          <div className="lg:w-1/2 flex justify-center lg:justify-center">
            <Image
              src="/Images/home/faq.png"
              width={500}
              height={400}
              alt="FAQ"
              className="rounded-sm"
            />
          </div>
        </div>
      </div>
    </section>

        <div className="my-12 py-12">
          <div className="container mx-auto rounded-lg border border-gray-300 p-4 bg-gray-100 w-3/4">
            <div class="flex flex-col-reverse md:flex-row justify-between items-center gap-4 px-4  sm:px-6 lg:px-8">
              <div className="text-center md:text-left">
                <h2 className="text-lg sm:text-3xl font-bold mb-4">
                  Smart Hiring Made Simple with Atsway ATS
                </h2>
                <p className="text-md mb-6">
                  Atsway comes packed with powerful features designed to
                  simplify your hiring process and help you find the right
                  talent faster. From organizing candidates to automating tasks,
                  our applicant tracking system software makes recruitment
                  effortless and efficient.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="my-12 container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl text-center font-bold ">
            Key Features of Atsway ATS
          </h2>
        </section>

        <div className="bg-gray-100">
          <div className="flex flex-col md:flex-row items-center container mx-auto px-4 sm:px-6 lg:px-8  justify-center  my-6">
            <div className="md:w-1/2 p-6">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  1. Simple and Organized Candidate Tracking
                </h3>
                <p className="text-md mb-4">
                  Manage your entire hiring process on a single screen with our
                  intuitive tracking system. Easily customize recruitment stages
                  for each job and visualize progress in the way that works best
                  for you.
                </p>
                <p className="text-md font-bold">
                  Flexible Tracking Options:
                  <span className="font-normal">
                    {" "}
                    Easily monitor and manage candidates, jobs, and hiring
                    progress with a clear and structured pipeline that keeps
                    everything organized.
                  </span>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 p-6 flex items-center justify-center">
              <img
                src="/Images/home/features/1.png"
                alt="Illustration of people managing candidate tracking on a large screen with checkmarks and graphs"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="">
          <div className="flex flex-col-reverse md:flex-row items-center container mx-auto px-4 sm:px-6 lg:px-8  justify-center  my-6">
            <div className="md:w-1/2 p-6  rounded-lg flex items-center justify-center">
              <img
                src="/Images/home/features/2.png"
                alt="Illustration of people managing candidate tracking on a large screen with checkmarks and graphs"
                className="w-full h-auto"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <h3 className="text-2xl font-bold mb-4">
                2. Automated Communication for a Smoother Process
              </h3>
              <p className="text-md mb-4">
                Stay connected with candidates without the extra effort. Atsway
                lets you automate personalized emails and updates at every step
                of the hiring process, keeping candidates informed and engaged.
              </p>
              <p className="text-md font-bold">
                Smart Automation:
                <span className="font-normal">
                  {" "}
                  Set up automated emails for interview invites, follow-ups, or
                  rejections to ensure a consistent experience.
                </span>
              </p>
              <p className="text-md font-bold">
                Custom Workflows:
                <span className="font-normal">
                  {" "}
                  Apply automation across all job openings or tailor it for
                  specific hiring needs.
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100">
          <div className="flex flex-col md:flex-row items-center container mx-auto px-4 sm:px-6 lg:px-8  justify-center  my-6">
            <div className="md:w-1/2 p-6">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  3. Quick and Efficient Candidate Screening
                </h3>
                <p className="text-md mb-4">
                  Make faster hiring decisions with our quick-screening tools.
                  Instantly review candidate details, compare qualifications,
                  and take action—all within your hiring dashboard.
                </p>
                <p className="text-md font-bold">
                  Instant Candidate Review:
                  <span className="font-normal">
                    {" "}
                    Access key candidate details without switching between
                    screens.
                  </span>
                </p>
                <p className="text-md font-bold">
                  Streamlined Decision Making:
                  <span className="font-normal">
                    {" "}
                    Move candidates forward or remove them from the pipeline
                    with a single click.
                  </span>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 p-6   flex items-center justify-center">
              <img
                src="/Images/home/features/3.png"
                alt="Illustration of people managing candidate tracking on a large screen with checkmarks and graphs"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="">
          <div className="flex flex-col-reverse md:flex-row items-center container mx-auto px-4 sm:px-6 lg:px-8  justify-center  my-6">
            <div className="md:w-1/2 p-6  rounded-lg flex items-center justify-center">
              <img
                src="/Images/home/features/4.png"
                alt="Illustration of people managing candidate tracking on a large screen with checkmarks and graphs"
                className="w-full h-auto"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <h4 className="text-2xl font-bold mb-4">
                4. All-in-One Candidate Profiles
              </h4>
              <p className="text-md mb-4">
                Keep everything you need in one place with detailed candidate
                profiles. Store resumes, messages, notes, and feedback in an
                organized way, making it easy to track and evaluate candidates
                now and in the future.
              </p>
              <p className="text-md font-normal">
                <ul>
                  <li>
                    • Access complete candidate details, including resumes and
                    communication history, in one view.
                  </li>
                  <li>
                    • Save past candidate data for future opportunities and
                    smarter hiring decisions.
                  </li>
                </ul>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100">
          <div className="flex flex-col md:flex-row items-center container mx-auto px-4 sm:px-6 lg:px-8  justify-center  my-6">
            <div className="md:w-1/2 p-6">
              <div>
                <h5 className="text-2xl font-bold mb-4">
                  5. Quick and Easy Search for Everything You Need
                </h5>
                <p className="text-md mb-4">
                  Find what you're looking for in seconds with our smart search
                  features. Whether it's candidates, job openings, or contacts,
                  our ATS software helps you navigate your hiring database with
                  ease.
                </p>
                <p className="text-md font-normal">
                  <ul>
                    <li>
                      • Easily search and retrieve candidates, job listings, or
                      contacts based on your criteria.
                    </li>
                    <li>
                      • Get instant results with our fast and intuitive
                      search-as-you-type feature.
                    </li>
                  </ul>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 p-6  rounded-lg flex items-center justify-center">
              <img
                src="/Images/home/features/5.png"
                alt="Illustration of people managing candidate tracking on a large screen with checkmarks and graphs"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="">
          <div className="flex flex-col-reverse md:flex-row items-center container mx-auto px-4 sm:px-6 lg:px-8  justify-center  my-6">
            <div className="md:w-1/2 p-6  rounded-lg flex items-center justify-center">
              <img
                src="/Images/home/features/6.png"
                alt="Illustration of people managing candidate tracking on a large screen with checkmarks and graphs"
                className="w-full h-auto"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <h6 className="text-2xl font-bold mb-4">
                6. Advanced Search with Multiple Filters
              </h6>
              <p className="text-md mb-4">
                Find the right candidates faster by searching with multiple
                criteria at once. Our Applicant Tracking System lets you filter
                candidates based on job titles, skills, locations, and more to
                match the perfect fit for your job openings.
              </p>
              <p className="text-md font-normal">
                <ul>
                  <li>
                    • Use advanced search options to narrow down candidates
                    quickly and effectively.
                  </li>
                  <li>
                    • Customize searches based on your unique hiring needs with
                    flexible filters.
                  </li>
                </ul>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100">
          <div className="flex flex-col md:flex-row items-center container mx-auto px-4 sm:px-6 lg:px-8  justify-center  my-6">
            <div className="md:w-1/2 p-6">
              <div>
                <h4 className="text-2xl font-bold mb-4">
                  7. Branded Resumes Made Easy
                </h4>
                <p className="text-md mb-4">
                  Easily customize candidate resumes to reflect your brand
                  identity. Add your company logo, and watermark, and
                  personalize resumes effortlessly within our ATS.
                </p>
                <p className="text-md font-normal">
                  <ul>
                    <li>
                      • Create professional-looking resumes with just a few
                      clicks.
                    </li>
                    <li>
                      • Save time and maintain consistency with our easy
                      branding tools.
                    </li>
                  </ul>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 p-6  rounded-lg flex items-center justify-center">
              <img
                src="/Images/home/features/7.png"
                alt="Illustration of people managing candidate tracking on a large screen with checkmarks and graphs"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="">
          <div className="flex flex-col-reverse md:flex-row items-center container mx-auto px-4 sm:px-6 lg:px-8  justify-center  my-6">
            <div className="md:w-1/2 p-6  rounded-lg flex items-center justify-center">
              <img
                src="/Images/home/features/8.png"
                alt="Illustration of people managing candidate tracking on a large screen with checkmarks and graphs"
                className="w-full h-auto"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <h4 className="text-2xl font-bold mb-4">
                8. Customize Your Data, Your Way
              </h4>
              <p className="text-md mb-4">
                Customize the ATS software to fit your unique hiring needs by
                adding custom fields, sections, and views for candidates, jobs,
                and organizations.
              </p>
              <p className="text-md font-normal">
                <ul>
                  <li>• Organize recruitment data the way you prefer.</li>
                  <li>
                    • Easily search and retrieve information with custom
                    filters.
                  </li>
                </ul>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100">
          <div className="flex flex-col md:flex-row items-center container mx-auto px-4 sm:px-6 lg:px-8  justify-center  my-6">
            <div className="md:w-1/2 p-6">
              <div>
                <h4 className="text-2xl font-bold mb-4">
                  9. Stay on Top of Onboarding Milestones
                </h4>
                <p className="text-md mb-4">
                  Track important hiring dates such as start dates, probation
                  periods, and employment end dates to ensure a smooth
                  onboarding process.
                </p>
                <p className="text-md font-normal">
                  <ul>
                    <li>• Set reminders and keep onboarding on track.</li>
                    <li>
                      • Customize milestones to match your company’s process.
                    </li>
                  </ul>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 p-6  rounded-lg flex items-center justify-center">
              <img
                src="/Images/home/features/9.png"
                alt="Illustration of people managing candidate tracking on a large screen with checkmarks and graphs"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="">
          <div className="flex flex-col-reverse md:flex-row items-center container mx-auto px-4 sm:px-6 lg:px-8  justify-center  my-6">
            <div className="md:w-1/2 p-6  rounded-lg flex items-center justify-center">
              <img
                src="/Images/home/features/10.png"
                alt="Illustration of people managing candidate tracking on a large screen with checkmarks and graphs"
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <h4 className="text-2xl font-bold mb-4">
                10. Evaluate Candidates with Scorecards
              </h4>
              <p className="text-md mb-4">
                Make better hiring decisions by using scorecards to standardize
                candidate evaluations and compare them side by side.
              </p>
              <p className="text-md font-normal">
                <ul>
                  <li>
                    • Create custom scorecards for consistent assessments.
                  </li>
                  <li>
                    • Share and review feedback with your team in one place.
                  </li>
                </ul>
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-100">
          <div className="flex flex-col md:flex-row items-center container mx-auto px-4 sm:px-6 lg:px-8  justify-center  my-6">
            <div className="md:w-1/2 p-6">
              <div>
                <h4 className="text-2xl font-bold mb-4">
                  11. Connect with Candidates via Text Messages
                </h4>
                <p className="text-md mb-4">
                  Improve response times and keep candidates engaged with direct
                  SMS communication, all from within the ATS platform.
                </p>
                <p className="text-md font-normal">
                  <ul>
                    <li>
                      • Send interview updates and application status via text.
                    </li>
                    <li>
                      • Organize and track conversations for better follow-ups.
                    </li>
                  </ul>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 p-6  rounded-lg flex items-center justify-center">
              <img
                src="/Images/home/features/11.png"
                alt="Illustration of people managing candidate tracking on a large screen with checkmarks and graphs"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="">
          <div className="flex flex-col-reverse md:flex-row items-center container mx-auto px-4 sm:px-6 lg:px-8  justify-center  my-6">
            <div className="md:w-1/2 p-6  rounded-lg flex items-center justify-center">
              <img
                src="/Images/home/features/12.png"
                alt="Illustration of people managing candidate tracking on a large screen with checkmarks and graphs"
                className="w-full h-auto"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <h4 className="text-2xl font-bold mb-4">
                12. Send Batch Notifications in One Go
              </h4>
              <p className="text-md mb-4">
                Easily update candidates and clients by sending bulk emails
                straight from the ATS. Save time and keep everyone informed.
              </p>
              <p className="text-md font-normal">
                <ul>
                  <li>• Use email templates for quick communication.</li>
                  <li>
                    • Track responses and measure the success of your outreach.
                  </li>
                </ul>
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-100">
          <div className="flex flex-col md:flex-row items-center container mx-auto px-4 sm:px-6 lg:px-8  justify-center  my-6">
            <div className="md:w-1/2 p-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  13. Effective Job Marketing
                </h2>
                <p className="text-md mb-4">
                  Get your job listings in front of the right people, faster.
                  With just one click, share job openings across multiple job
                  boards, social media platforms, and your branded career page.
                  Maximize visibility and attract top talent effortlessly.
                </p>
                <p className="text-md font-normal">
                  <ul>
                    <li>
                      <span className="font-bold">
                        One-Click Job Postings –
                      </span>{" "}
                      Post jobs to job boards, social media, and your career
                      site in just one click.
                    </li>
                    <li>
                      <span className="font-bold">Boost Candidate Reach –</span>
                      Expand your hiring reach by targeting the right audience.
                    </li>
                  </ul>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 p-6  rounded-lg flex items-center justify-center">
              <img
                src="/Images/home/features/13.png"
                alt="Illustration of people managing candidate tracking on a large screen with checkmarks and graphs"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="">
          <div className="flex flex-col-reverse md:flex-row items-center container mx-auto px-4 sm:px-6 lg:px-8  justify-center  my-6">
            <div className="md:w-1/2 p-6  rounded-lg flex items-center justify-center">
              <img
                src="/Images/home/features/14.png"
                alt="Illustration of people managing candidate tracking on a large screen with checkmarks and graphs"
                className="w-full h-auto"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <h3 className="text-2xl font-bold mb-4">
                14. Smart Resume Parsing
              </h3>
              <p className="text-md mb-4">
                Save time and effort by automatically extracting key details
                from resumes. Our system processes resumes in multiple formats,
                converting them into structured candidate profiles to speed up
                hiring.
              </p>
              <p className="text-md font-normal">
                <ul>
                  <li>
                    <span className="font-bold">Quick Data Extraction –</span>{" "}
                    Instantly capture candidate information from resumes.
                  </li>
                  <li>
                    <span className="font-bold">Multiple File Support –</span>
                    Works with PDF, Word, and other popular formats.
                  </li>
                  <li>
                    <span className="font-bold">
                      Accurate Candidate Profiles –
                    </span>
                    Organize and analyze candidate data efficiently.
                  </li>
                </ul>
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-100">
          <div className="flex flex-col md:flex-row items-center container mx-auto px-4 sm:px-6 lg:px-8  justify-center  my-6">
            <div className="md:w-1/2 p-6">
              <div>
                <h5 className="text-2xl font-bold mb-4">
                  15. Streamlined New Hire Onboarding
                </h5>
                <p className="text-md mb-4">
                  Simplify and personalize the entire onboarding journey with
                  our secure digital portal. Guide new hires through paperwork,
                  requirements, and company policies—all from one centralized
                  platform.
                </p>
                <p className="text-md font-normal">
                  <ul>
                    <li>
                      <span className="font-bold">Centralized eBoarding –</span>{" "}
                      Manage onboarding tasks and documents in one place.
                    </li>
                    <li>
                      <span className="font-bold">
                        Digital Documents & eSignatures –
                      </span>
                      Complete all paperwork online with easy eSign options.
                    </li>
                    <li>
                      <span className="font-bold">
                        Tailored Onboarding Process –
                      </span>{" "}
                      Customize steps based on job roles and company needs.
                    </li>
                    <li>
                      <span className="font-bold">
                        Better Candidate Experience –
                      </span>
                      Make onboarding smooth and engaging for new hires.
                    </li>
                  </ul>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 p-6  rounded-lg flex items-center justify-center">
              <img
                src="/Images/home/features/15.png"
                alt="Illustration of people managing candidate tracking on a large screen with checkmarks and graphs"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="">
          <div className="flex flex-col-reverse md:flex-row items-center container mx-auto px-4 sm:px-6 lg:px-8  justify-center  my-6">
            <div className="md:w-1/2 p-6  rounded-lg flex items-center justify-center">
              <img
                src="/Images/home/features/16.png"
                alt="Illustration of people managing candidate tracking on a large screen with checkmarks and graphs"
                className="w-full h-auto"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <h6 className="text-2xl font-bold mb-4">
                16. Recruitment Analytics & Reporting
              </h6>
              <p className="text-md mb-4">
                Make smarter hiring decisions with real-time insights. Our
                easy-to-use dashboards and reports provide a clear view of your
                hiring performance, helping you track key metrics and optimize
                your recruitment process.
              </p>
              <p className="text-md font-normal">
                <ul>
                  <li>
                    <span className="font-bold">Real-Time Dashboards –</span>{" "}
                    Instantly capture candidate information from resumes.
                  </li>
                  <li>
                    <span className="font-bold">Visual Reports –</span>Works
                    with PDF, Word, and other popular formats.
                  </li>
                  <li>
                    <span className="font-bold">Customizable Insights –</span>
                    Organize and analyze candidate data efficiently.
                  </li>
                </ul>
              </p>
            </div>
          </div>
        </div>
        <DemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </>
  );
};

export default Page;
