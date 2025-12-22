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
      a: " An ATS (Applicant Tracking System) is a tool that helps organize the hiring process. It collects, sorts, and manages job applications, making it easier for hiring teams to track candidates and find the best fit.",
    },
    {
      q: "What are the best ATS systems for small businesses?",
      a: " The best ATS for small businesses is easy to use, affordable, and scalable. ATSWAY is a great choice because of its simple features, cost-effectiveness, and strong support.",
    },
    {
      q: "What are the main benefits of using an ATS?",
      a: " An ATS speeds up hiring by sorting resumes and keeping candidate info organized, which helps the hiring team work more efficiently.",
    },
    {
      q: "How do applicant tracking systems work?",
      a: " When candidates apply, the ATS scans resumes to extract info like contact details, experience, and skills. This helps hiring teams review and communicate with candidates while tracking their progress.",
    },
    {
      q: "What other features does an ATS have?",
      // a: (
      //   <>
      //     <p>An ATS includes multiple useful hiring features:</p>
      //     <ul className="list-disc list-inside mt-2">
      //       <li>Resume Parsing & Candidate Database</li>
      //       <li>Job Posting & Application Management</li>
      //       <li>Workflow & Pipeline Tracking</li>
      //       <li>Analytics & Reports</li>
      //       <li>Integrations & Automation Tools</li>
      //     </ul>
      //   </>
      // ),
      a: " An ATS offers features like resume parsing, job posting, application tracking, workflow management, analytics, integrations, and automation to streamline hiring.",
    },

    {
      q: "How can an ATS help me as a job seeker?",
      a: "An ATS designed for candidates helps you organize your job applications, track interview schedules, build better resumes, and get notifications about your application status - all in one place.",
    },

    {
      q: "Can I use an ATS to improve my resume?",
      a: "Yes! Many candidate-focused ATS platforms offer resume-building tools and keyword suggestions to optimize your resume and increase your chances of getting noticed by employers.",
    },

    {
      q: "Will I know the status of my job applications through an ATS?",
      a: "Absolutely. A candidate-oriented ATS keeps you updated with real-time alerts on whether your application was viewed, shortlisted, or if interviews are scheduled.",
    },

    {
      q: "Is my personal data safe in an ATS?",
      a: "Yes, your data is stored securely, and with candidate-focused ATS, you have full control over your profile, applications, and documents.",
    },

    {
      q: "Can I apply to multiple jobs and keep track of them easily?",
      a: "Yes, ATS platforms allow you to save job listings, apply directly, and monitor the progress of all your applications from a single dashboard.",
    },
  ];

  const getData = async () => {
    try {
      const response = await axios.get(BaseAPI + "/blog/listing");
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
                Applicant Tracking System for Candidates{" "}
              </h1>
              <p className="text-lg font-bold mb-2 text-left">
                Find, Track, and Grow Your Career with Confidence{" "}
              </p>
              <p className="text-md mb-6 text-left">
                Atsway helps candidates stay organized, discover better
                opportunities, and present themselves professionally. Our smart
                applicant tracking system is built for job seekers who want to
                manage their job applications, track progress, and create a
                polished resume - all in one place. With simple tools and a
                clean interface, you can save jobs, monitor application stages,
                and build a standout resume that gets attention.
              </p>
              <Link
                href="/candidate-panel/build-resume"
                className="bg-[#27BAEE] font-medium text-white px-6 py-3 rounded self-start"
              >
                Build Your Resume Now
              </Link>
            </div>
            <div className="md:w-1/2 md:h-full flex justify-center md:justify-end mt-8 md:mt-0">
              <Image
                width={500}
                height={400}
                src="/Images/home/banner.png"
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
                  Streamline Your Job Search with Our Simple ATS Software{" "}
                </h2>
                <p className="text-md mb-6 text-left">
                  Our AI-Powered Applicant Tracking System makes your job search
                  easier by helping you manage every opportunity in one
                  dashboard. You can save job postings, keep track of where
                  you&apos;ve applied, and instantly see updates as you move
                  through each stage. Our integrated tools help you stay
                  prepared with resume-building support, reminders, and
                  application progress tracking.
                </p>
                <p className="text-md mb-6 text-left">
                  With a clear, organized view of all your applications, you
                  spend less time juggling spreadsheets and more time landing
                  the right job. Everything is built to help you stay focused,
                  confident, and ready for your next career move.
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0">
                <Image
                  width={400}
                  height={400}
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
                Benefits of Choosing ATS Software for Candidates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <img
                    src="/Images/home/icon1.png"
                    alt="icon1"
                    className="div-vertical"
                  />
                  <h3 className="text-lg font-semibold my-2">Stay Organized</h3>
                  <p className="text-md">
                    Keep all your job applications, interviews, and documents in
                    one easy-to-manage dashboard. No more lost emails or missed
                    deadlines.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <img
                    src="/Images/home/icon2.png"
                    alt="icon1"
                    className="div-horizontal"
                  />
                  <h3 className="text-lg font-semibold my-2">
                    Apply Faster and Smarter
                  </h3>
                  <p className="text-md">
                    Save multiple resumes and cover letters, auto-fill
                    applications quickly, and tailor your submissions to match
                    each job&apos;s requirements.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <img
                    src="/Images/home/icon3.png"
                    alt="icon1"
                    className="div-vertical"
                  />
                  <h3 className="text-lg font-semibold my-2">
                    Get Real-Time Updates
                  </h3>
                  <p className="text-md">
                    Receive instant notifications about your application status,
                    interview schedules, and recruiter messages to stay informed
                    every step of the way.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <img
                    src="/Images/home/icon4.png"
                    alt="icon1"
                    className="div-horizontal"
                  />
                  <h3 className="text-lg font-semibold my-2">
                    Improve Your Resume and Profile
                  </h3>
                  <p className="text-md">
                    Use smart tools that suggest improvements, highlight missing
                    skills, and ensure your resume passes employer ATS
                    screenings.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <img
                    src="/Images/home/icon5.png"
                    alt="icon1"
                    className="div-vertical"
                  />
                  <h3 className="text-lg font-semibold my-2">
                    Prepare Confidently for Interviews
                  </h3>
                  <p className="text-md">
                    Access detailed job info, recruiter notes, and reminders so
                    you walk into every interview well-prepared and stress-free.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <img
                    src="/Images/home/icon6.png"
                    alt="icon1"
                    className="div-horizontal"
                  />
                  <h3 className="text-lg font-semibold my-2">
                    Discover Relevant Job Opportunities
                  </h3>
                  <p className="text-md">
                    Get personalized job recommendations based on your skills,
                    experience, and preferences — saving you time and effort.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-12 custom-class">
          <div className="px-0 gap-4 sm:px-0 lg:px-0 p-0 flex flex-col-reverse md:flex-row items-center">
            {/* LEFT SECTION — IMAGE */}
            <div className="md:w-1/2 w-full h-full">
              <Image
                width={800}
                height={400}
                src="/Images/home/Mask group.png"
                alt="Hero"
                className="h-full w-full object-cover"
              />
            </div>

            {/* RIGHT SECTION — CONTENT */}
            <div className="md:w-1/2 w-full bg-[#16384D] text-left p-6 flex flex-col">
              <h2 className="text-3xl text-white font-bold mb-4">
                The Future of Applicant Tracking Systems (ATS)
              </h2>

              <p className="mb-6 text-white">
                As technology advances, ATS will become smarter and more
                efficient, benefiting both employers and job seekers.
              </p>

              <ul className="space-y-6">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-white text-2xl flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white">AI-Powered Hiring:</h3>
                    <p className="text-white">
                      Future ATS will use AI to understand applicants' career
                      journeys and predict job success, focusing on skills and
                      experience, not just keywords.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-white text-2xl flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white">Video Resumes:</h3>
                    <p className="text-white">
                      ATS may support video resumes or cover letters, offering a
                      more personal view of candidates. Virtual and augmented
                      reality might also play a role in showcasing skills.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-white text-2xl flex-shrink-0 mt-1" />
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
            </div>
          </div>
        </div>

        <section className="my-12 container mx-auto bg-white px-4 my-12 sm:px-6 lg:px-8 ">
          <h2 className="text-3xl text-center font-bold mb-10 pt-6 ">
            What Candidates Are Saying About ATSWAY
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <div className="bg-white shadow-lg p-6 rounded flex flex-col justify-between">
              <img
                alt="profilepic."
                class="w-24 h-24 rounded-full mx-auto mb-4"
                src="../Images/home/T1.png"
              />
              <p class="text-gray-700 mb-4">
                ATSWAY helped me keep track of all my job applications in one
                place. The reminders and status updates made my job search so
                much easier and less stressful.
              </p>
              <p class="font-bold">Shreyn S.</p>
            </div>
            <div className="bg-white shadow-lg p-6 rounded flex flex-col justify-between">
              <img
                alt="profilepic."
                class="w-24 h-24 rounded-full mx-auto mb-4"
                src="../Images/home/T2.png"
              />
              <p class="text-gray-700 mb-4">
                Thanks to ATSWAY&apos;s resume builder and keyword suggestions,
                my applications are getting more attention. I&apos;m finally
                landing interviews!
              </p>
              <p class="font-bold">David H.</p>
            </div>
            <div className="bg-white shadow-lg p-6 rounded flex flex-col justify-between">
              <img
                alt="profilepic."
                class="w-24 h-24 rounded-full mx-auto mb-4"
                src="../Images/home/T3.png"
              />
              <p class="text-gray-700 mb-4">
                I love how ATSWAY notifies me instantly about interview
                schedules and application progress. It keeps me informed and
                confident throughout my job hunt.
              </p>
              <p class="font-bold">Jamimah K.</p>
            </div>

            {/* <div className="bg-white shadow-lg p-6 rounded flex flex-col justify-between">
              <img
                alt="profilepic."
                class="w-24 h-24 rounded-full mx-auto mb-4"
                src="../Images/home/T3.png"
              />
              <p class="text-gray-700 mb-4">
                The job recommendations based on my profile saved me hours of
                searching. ATSWAY made my job search focused and efficient.
              </p>
              <p class="font-bold">Karan P.</p>
            </div> */}
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

        <section
          className="bg-cover bg-center h-[900px]"
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
                      <span className="text-xl">
                        {openIndex === i ? "−" : "+"}
                      </span>
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
                  Smart Job Searching Made Simple with ATSWAY
                </h2>
                <p className="text-md mb-6">
                  ATSWAY offers powerful features designed to simplify your job
                  search and help you land the right opportunities faster. From
                  organizing your applications to providing personalized
                  insights, our applicant tracking system makes managing your
                  career effortless and efficient—so you can focus on preparing
                  and succeeding.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="my-12 container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl text-center font-bold ">
            Key Features of ATSWAY ATS for Candidates
          </h2>
        </section>

        <div className="bg-gray-100">
          <div className="flex flex-col md:flex-row items-center container mx-auto px-4 sm:px-6 lg:px-8  justify-center  my-6">
            <div className="md:w-1/2 p-6">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  1. Simple and Organized Application Tracking
                </h3>
                <p className="text-md mb-4">
                  Manage your entire job search in one place with an easy-to-use
                  dashboard. Track every application stage and stay on top of
                  your progress without any confusion. Customize your job search
                  stages and keep everything clear and structured.
                </p>
                <p className="text-md">
                  <ul className="list-disc list-inside">
                    <li>
                      <b>Clear Overview:</b> View all your applied jobs and
                      statuses in one screen.
                    </li>
                    <li>
                      <b>Customizable Stages:</b> Set personal job search
                      milestones and track progress.
                    </li>
                    <li>
                      <b>Organized Pipeline:</b> Never lose track of where you
                      stand with each employer.
                    </li>
                  </ul>
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
                2. Automated Notifications for Job Updates
              </h3>
              <p className="text-md mb-4">
                Stay informed without the hassle of checking emails constantly.
                Automated alerts keep you updated on application progress,
                interview invites, and follow-ups so you&apos;re always
                prepared.
              </p>
              <p className="text-md">
                <ul className="list-disc list-inside">
                  <li>
                    <b>Instant Alerts:</b> Receive updates when your
                    application moves forward.
                  </li>
                  <li>
                    <b>Interview Reminders:</b> Never miss a scheduled
                    interview or deadline.
                  </li>
                  <li>
                    <b>Follow-Up Prompts:</b> Get notified when to send
                    follow-ups or additional info.
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
                <h3 className="text-2xl font-bold mb-4">
                  3. Quick Resume & Profile Optimization{" "}
                </h3>
                <p className="text-md mb-4">
                  Boost your chances with resume suggestions tailored to job
                  descriptions. Easily build and customize your profile and
                  resume to match what recruiters want to see.
                </p>
                <p className="text-md">
                  <ul className="list-disc list-inside">
                    <li>
                      <b>Keyword Suggestions:</b> Improve resume keywords for
                      ATS compatibility.
                    </li>
                    <li>
                      <b>Profile Strength:</b> Highlight your skills and
                      experience effectively.
                    </li>
                    <li>
                      <b>Resume Versions:</b> Create multiple resumes for
                      different roles quickly.
                    </li>
                  </ul>
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
                4. Centralized Candidate Profile Management
              </h4>
              <p className="text-md mb-4">
                Keep all your job search documents and communications in one
                secure place. Organize resumes, cover letters, interview notes,
                and feedback for easy reference anytime.
              </p>
              <p className="text-md">
                <ul className="list-disc list-inside">
                  <li>
                    <b>Document Storage:</b> Save all important files securely
                    in your profile.
                  </li>
                  <li>
                    <b>Communication History:</b> Track messages with
                    recruiters in one view.
                  </li>
                  <li>
                    <b>Notes & Feedback:</b> Keep personal interview and job
                    notes handy.
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
                  5. Smart Job Search & Saving Tools
                </h5>
                <p className="text-md mb-4">
                  Find, save, and revisit job listings with ease. Use smart
                  search features and bookmark favorite opportunities to apply
                  when ready.
                </p>
                <p className="text-md">
                  <ul className="list-disc list-inside">
                    <li>
                      <b>Powerful Search:</b> Filter jobs by role, location,
                      salary, and more.
                    </li>
                    <li>
                      <b>Save & Revisit:</b> Bookmark jobs to apply later
                      without losing track.
                    </li>
                    <li>
                      <b>Instant Results:</b> Quickly access relevant job
                      listings anytime.
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
                6. Personalized Job Recommendations{" "}
              </h6>
              <p className="text-md mb-4">
                Get matched with job openings that fit your skills and
                preferences. Focus your efforts on roles that truly align with
                your career goals.
              </p>
              <p className="text-md">
                <ul className="list-disc list-inside">
                  <li>
                    <b>Skill-Based Matches:</b> See jobs tailored to your
                    profile.
                  </li>
                  <li>
                    <b>Preference Filters:</b> Choose location, salary, and
                    company type.
                  </li>
                  <li>
                    <b>New Job Alerts:</b> Receive notifications when relevant
                    jobs post.
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
                  7. Build a Professional, Recruiter-Friendly Profile{" "}
                </h4>
                <p className="text-md mb-4">
                  Create a polished, structured profile that grabs recruiters’
                  attention. Highlight your strengths and make it easy for
                  employers to see your value.
                </p>
                <p className="text-md">
                  <ul className="list-disc list-inside">
                    <li>
                      <b>Clean Formatting:</b> Present your experience in an
                      easy-to-read layout.
                    </li>
                    <li>
                      <b>Highlight Key Skills:</b> Showcase what makes you
                      unique.
                    </li>
                    <li>
                      <b>Profile Visibility:</b> Increase chances of being
                      discovered by recruiters.
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
                8. Track Your Career Growth & Skill Development{" "}
              </h4>
              <p className="text-md mb-4">
                Monitor your progress over time with insights on skill gaps and
                achievements. Plan upskilling and certifications to stay
                competitive in your field.
              </p>
              <p className="text-md">
                <ul className="list-disc list-inside">
                  <li>
                    <b>Skill Gap Analysis:</b> Identify areas to improve based
                    on job trends.
                  </li>
                  <li>
                    <b>Progress Tracking:</b> See how your applications and
                    interviews improve.
                  </li>
                  <li>
                    <b>Upskilling Suggestions:</b> Get recommendations for
                    courses and certifications.
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
                  9. Stay Ready for Interviews with Preparation Tools
                </h4>
                <p className="text-md mb-4">
                  Access interview details, company info, and reminders all in
                  one place. Keep your prep notes and recruiter messages handy
                  for confident performance.
                </p>
                <p className="text-md">
                  <ul className="list-disc list-inside">
                    <li>
                      <b>Interview Schedules:</b> Get alerts and view upcoming
                      interviews easily.
                    </li>
                    <li>
                      <b>Job Details:</b> Review role requirements and company
                      info anytime.
                    </li>
                    <li>
                      <b>Prep Notes:</b> Store your own notes and tips for
                      each interview.
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
                10. Secure Document Management
              </h4>
              <p className="text-md mb-4">
                Keep your resumes, certificates, and portfolios safe and
                accessible for every job application. Upload and update
                documents without worry.
              </p>
              <p className="text-md">
                <ul className="list-disc list-inside">
                  <li>
                    <b>Secure Storage:</b> Protect your files with encryption
                    and privacy.
                  </li>
                  <li>
                    <b>Multiple Document Types:</b> Save resumes, cover
                    letters, portfolios, and more.
                  </li>
                  <li>
                    <b>Easy Attachments:</b> Add documents quickly when
                    applying.
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
                  11. Consistent Follow-Up and Communication
                </h4>
                <p className="text-md mb-4">
                  Maintain professional communication with recruiters through
                  automated reminders and messaging tools. Build positive
                  relationships with timely responses.
                </p>
                <p className="text-md">
                  <ul className="list-disc list-inside">
                    <li>
                      <b>Automated Reminders:</b> Get prompts to follow up on
                      applications.
                    </li>
                    <li>
                      <b>Messaging Hub:</b> Manage all recruiter
                      communications in one place.
                    </li>
                    <li>
                      <b>Response Tracking:</b> Know when recruiters reply or
                      request info.
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
                src="/Images/home/features/1-old.png"
                alt="Illustration of people managing candidate tracking on a large screen with checkmarks and graphs"
                className="w-full h-auto"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <h4 className="text-2xl font-bold mb-4">
                12. Multi-Device Access Anywhere, Anytime
              </h4>
              <p className="text-md mb-4">
                Manage your job search on your phone, tablet, or desktop
                seamlessly. Stay updated and apply to jobs no matter where you
                are.
              </p>
              <p className="text-md">
                <ul className="list-disc list-inside">
                  <li>
                    <b>Cross-Platform Sync:</b> Your data updates instantly
                    across devices.
                  </li>
                  <li>
                    <b>Mobile-Friendly Interface:</b> Apply and track easily
                    on the go.
                  </li>
                  <li>
                    <b>Cloud Storage:</b> Access documents and profiles
                    anywhere.
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
                  13. Save Time with Auto-Fill Applications{" "}
                </h2>
                <p className="text-md mb-4">
                  Apply faster with pre-filled application forms using your
                  stored profile information. Avoid repetitive typing and
                  streamline your job submissions.
                </p>
                <p className="text-md">
                  <ul className="list-disc list-inside">
                    <li>
                      <b>Auto-Fill Forms:</b> Complete applications quickly
                      with saved data.
                    </li>
                    <li>
                      <b>Consistent Info:</b> Ensure accuracy across multiple
                      job sites.
                    </li>
                    <li>
                      <b>One-Click Apply:</b> Reduce effort and increase
                      efficiency.
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
                14. Personalized Career Dashboard{" "}
              </h3>
              <p className="text-md mb-4">
                View your entire job search progress, upcoming tasks, and saved
                jobs in one customizable dashboard. Stay motivated and organized
                every step of the way.
              </p>
              <p className="text-md">
                <ul className="list-disc list-inside">
                  <li>
                    <b>At-A-Glance Summary:</b> Track applications,
                    interviews, and tasks.
                  </li>
                  <li>
                    <b>Custom Views:</b> Arrange dashboard elements to fit
                    your needs.
                  </li>
                  <li>
                    <b>Motivational Insights:</b> See progress and next steps
                    clearly.
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
                  15. Long-Term Career Planning Tools
                </h5>
                <p className="text-md mb-4">
                  Beyond job applications, plan your career path with goal
                  setting, milestone tracking, and document storage. Turn your
                  job search into a strategic journey.
                </p>
                <p className="text-md">
                  <ul className="list-disc list-inside">
                    <li>
                      <b>Goal Setting:</b> Define short- and long-term career
                      objectives.
                    </li>
                    <li>
                      <b>Milestone Tracking:</b> Monitor certifications,
                      promotions, and more.
                    </li>
                    <li>
                      <b>Career History:</b> Keep a record of jobs applied,
                      interviews, and offers.
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
                16. Job Search Analytics & Insights{" "}
              </h6>
              <p className="text-md mb-4">
                Make smarter career moves with personalized, real-time insights
                into your job search progress. Our easy-to-use dashboards help
                you understand where your applications stand, track your
                interview success, and identify opportunities for improvement.
                Stay informed and adapt your strategy for better results.
              </p>
              <p className="text-md">
                <ul className="list-disc list-inside">
                  <li>
                    <b>Real-Time Progress Tracking:</b> See updates on your
                    applications, interviews, and offers at a glance.
                  </li>
                  <li>
                    <b>Visual Performance Reports:</b> Understand your job
                    search trends with easy-to-read charts and graphs.
                  </li>
                  <li>
                    <b>Custom Insights & Suggestions:</b> Receive customized
                    advice to optimize your resume, applications, and skills for
                    future success.
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
