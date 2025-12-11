"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/Components/Header";
import Footer from "@/app/Components/Footer/Footer";
import { SiTicktick } from "react-icons/si";

const faqData = [
  {
    q: "What’s included in the Basic Plan?",
    a: "The Basic Plan includes job posting, applicant tracking, hiring & onboarding, resume parsing, interview scheduling, collaboration tools, candidate database, and reports & analytics."
  },
  {
    q: "How do I choose the right plan?",
    a: "We offer simple, flexible pricing. If needed, our support team can guide you."
  },
  {
    q: "Can I upgrade later?",
    a: "Yes, upgrade anytime as your hiring needs grow."
  },
  {
    q: "Are there any hidden fees?",
    a: "No hidden fees. You pay $45 monthly and can cancel anytime."
  }
];

const Page = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <>
      <Header />

      <div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-5 lg:my-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* ===== LEFT SIDE ===== */}
            <div className="col-span-full lg:col-span-3 bg-white flex flex-col gap-6 h-full">

              {/* Pricing Section */}
              <div className="rounded-lg border border-gray-300 shadow-md p-6 py-9 min-h-[300px] flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  ATSWAY Pricing – Simple, Transparent, and Powerful
                </h2>

                <ul className="list-disc list-inside text-gray-700 mb-4">
                  <li>One Plan. Everything You Need.</li>
                  <li>All-in-One Applicant Tracking Solution</li>
                </ul>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-black text-lg mt-1"><SiTicktick className="text-[#27BAEE]" /></span>
                    <p className="ml-2 text-gray-700">
                      <span className="font-bold">Flexible & Scalable</span> – Select the right plan for you with customizable options and add-ons.
                    </p>
                  </div>

                  <div className="flex items-start">
                    <span className="text-black text-lg mt-1"><SiTicktick className="text-[#27BAEE]" /></span>
                    <p className="ml-2 text-gray-700">
                      <span className="font-bold">No Hidden Fees</span> – Pay one low price (<span className="font-bold">$45 USD</span>) per month, cancel anytime.
                    </p>
                  </div>

                  <div className="flex items-start">
                    <span className="text-black text-lg mt-1"><SiTicktick className="text-[#27BAEE]" /></span>
                    <p className="ml-2 text-gray-700">
                      <span className="font-bold">Powerful Features</span> – Everything you need for seamless hiring in one platform.
                    </p>
                  </div>
                </div>
              </div>

              {/* Add-On Solutions */}
              <div className="rounded-lg border border-gray-300 shadow-md p-6 py-8 min-h-[300px] flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Add-On Solutions</h2>
                <p className="text-gray-700 mb-4">Customize Your ATSWAY Experience</p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">HR Software Integration</h3>
                    <p className="text-gray-600">
                      Connect your ATS with your existing HR software for a smoother workflow.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Payroll & Benefits Integration</h3>
                    <p className="text-gray-600">
                      Automatically update payroll and benefits when new hires come on board.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">API Access</h3>
                    <p className="text-gray-600">
                      Integrate with other tools like time-tracking or performance management apps.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== RIGHT SIDE PRICING CARD ===== */}
            <div className="col-span-full lg:col-span-2 flex flex-col bg-white rounded-lg border border-2 border-[#27BAEE] shadow-md shadow-blue-300 w-full hover:shadow-xl">
              
              <div className="px-6 pb-3 items-center mb-4 border-b-2 border-b-gray-300">
                <h2 className="text-xl font-bold mt-4 mb-2">ATSWAY Membership Plan</h2>
                <p>
                  Whether you&apos;re hiring your first team members or expanding your recruitment efforts, this plan is made for you.
                </p>
              </div>

              <div className="flex relative justify-between px-6 pb-3 items-center mb-4 border-b-2 border-b-gray-300">
                <div className="flex gap-2">
                  <Image
                    src="/Images/home/phone_pricing.png"
                    width={50}
                    height={50}
                    className="bg-[#27BAEE] p-2 rounded-full"
                    alt="pricing icon"
                  />
                  <h2 className="text-2xl font-bold mt-2">Core Plan</h2>
                </div>

                <span
                  className="hidden sm:flex rounded absolute right-0 top-1"
                  style={{
                    backgroundImage: "url('/Images/home/bookmark_pricing.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    width: "150px",
                    height: "100px",
                  }}
                >
                  <p className="text-white text-lg font-semibold ml-6 py-1">Most Popular</p>
                </span>
              </div>

              <div className="text-start mb-4 px-6">
                <span className="text-4xl font-bold">$45</span>
                <span className="text-lg"> / Month</span>
                <p className="text-gray-500 mt-2">
                  All the Essential Tools You Need to Hire Smarter
                </p>
              </div>

              <Link
                href="/contact-us"
                className="bg-[#27BAEE] text-white self-center w-auto px-4 py-2 rounded-full font-bold"
              >
                Get Started
              </Link>

              <ul className="px-4 list-none mt-4 space-y-2 px-6 pb-6">
                {[
                  "Job Posting & Applicant Tracking Listing",
                  "Hiring & Onboarding",
                  "Resume Parsing",
                  "Collaboration Tools",
                  "Interview Scheduling",
                  "Candidate Database",
                  "Reports & Analytics",
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                   <SiTicktick className="text-[#27BAEE]" /><span className="ml-1.5">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ===== FAQ Section (Clean Tailwind Accordion) ===== */}
        <div className="container mx-auto pb-10 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-black font-bold text-3xl px-4 py-6">
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="flex flex-col-reverse lg:flex-row gap-4 px-4 py-6">

            {/* Accordion Left */}
            <div className="lg:w-1/2 text-center lg:text-left rounded-md">
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
                      openIndex === i ? "max-h-40 mt-2" : "max-h-0"
                    }`}
                  >
                    <p className="text-gray-600 text-left">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Image */}
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
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
      </div>

      <Footer />
    </>
  );
};

export default Page;
