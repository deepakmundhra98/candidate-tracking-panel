"use client";

import React, { useState } from "react";
import Image from "next/image";
import DemoModal from "../../Components/DemoModal";
import Header from "@/app/Components/Header";
import Footer from "@/app/Components/Footer/Footer";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items = [
    { icon: "/Images/HRMS/hrms1.png", text: "Attendance Form & Log" },
    { icon: "/Images/HRMS/hrms2.png", text: "Employee Database Management" },
    { icon: "/Images/HRMS/hrms3.png", text: "Performance Evaluation" },
    { icon: "/Images/HRMS/hrms4.png", text: "Record Of Leave Application" },
    { icon: "/Images/HRMS/hrms5.png", text: "Customizable Reports" },
    { icon: "/Images/HRMS/hrms6.png", text: "Power Pack Recruitment Tool" },
    { icon: "/Images/HRMS/hrms7.png", text: "Employee Salary Management" },
  ];

  return (
    <>
      
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-6 lg:flex-row items-center justify-center py-8 px-3">
          <div className="lg:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Smart HRMS Software for Modern Businesses
            </h1>
            <p className="text-gray-600 mb-6">
              Our HRMS software is built to make your life easier by bringing
              everything you need into one place. From tracking attendance and
              handling payroll to managing recruitment and analyzing employee
              data, it's all right here.
            </p>
            {/* <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              Book a Demo
            </button> */}
          </div>

          <div className="lg:w-1/2">
            <Image
              src="/Images/HRMS/hrms_banner.png"
              alt="HRMS banner"
              width={600}
              height={400}
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>

        {/* Features */}
        <div className="py-8">
          <div className="flex flex-col gap-3 items-center justify-center py-2">
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="font-bold text-2xl text-center">
                Key Features of HRMS Software
              </p>
              <p className="text-center w-3/4">
                HRMS software is the best solution for managing the human
                capital of any organization.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-center items-center">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="m-1 py-8 px-2 rounded-lg shadow-md flex flex-col items-center gap-3 bg-gray-100"
                  style={{ width: "290px" }}
                >
                  <div className="p-3 bg-gray-300 rounded-full flex items-center justify-center">
                    <Image
                      src={item.icon}
                      alt={item.text}
                      width={60}
                      height={60}
                    />
                  </div>
                  <p className="text-center text-base font-semibold">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sections (Payroll, Hiring, Reporting, Performance...) */}

        {/* --- SECTION 1 --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-2">Payroll, Time & Benefits</h2>
            <p className="mb-4">
              Manage payroll, track work hours, and handle benefits seamlessly.
            </p>
            <h3 className="font-bold mb-2">Key Features:</h3>
            <ul className="list-disc list-inside">
              <li>Payroll Management</li>
              <li>Leave & Attendance Management</li>
              <li>Time & Attendance Tracking</li>
              <li>Benefits Management</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <Image
              src="/Images/HRMS/hrms_pic1.png"
              alt="Payroll Image"
              width={450}
              height={350}
            />
          </div>
        </div>

        {/* --- SECTION 2 --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="flex justify-center">
            <Image
              src="/Images/HRMS/hrms_pic2.png"
              alt="Hiring process"
              width={450}
              height={350}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Hiring & Onboarding</h2>
            <p className="mb-4">
              Streamline hiring with our ATS and onboarding workflows.
            </p>
            <h3 className="font-bold mb-2">Key Features:</h3>
            <ul className="list-disc list-inside">
              <li>Applicant Tracking System</li>
              <li>New Hire Onboarding</li>
              <li>Offboarding</li>
            </ul>
          </div>
        </div>

        {/* --- SECTION 3 --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div>
            <h2 className="text-xl font-bold mb-2">HR Data & Reporting</h2>
            <p className="mb-4">
              Make informed decisions with powerful reporting tools.
            </p>
            <h3 className="font-bold mb-2">Key Features:</h3>
            <ul className="list-disc list-inside">
              <li>Employee Records</li>
              <li>Reporting</li>
              <li>Mobile Apps</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <Image
              src="/Images/HRMS/hrms_pic3.png"
              alt="HR reporting"
              width={450}
              height={350}
            />
          </div>
        </div>

        {/* --- SECTION 4 --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="flex justify-center">
            <Image
              src="/Images/HRMS/hrms_pic4.png"
              alt="Employee Experience"
              width={450}
              height={350}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">
              Employee Experience & Performance
            </h2>
            <p className="mb-4">
              Improve team satisfaction and performance with modern HR tools.
            </p>
            <h3 className="font-bold mb-2">Key Features:</h3>
            <ul className="list-disc list-inside">
              <li>Performance Management</li>
              <li>Employee Satisfaction</li>
              <li>Total Rewards</li>
              <li>Employee Community</li>
            </ul>
          </div>
        </div>

        <DemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
      <Footer />
    </>
  );
}
