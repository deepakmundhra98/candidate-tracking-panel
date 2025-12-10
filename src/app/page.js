"use client";
import "./globals.css";
import "./newcommon.css";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "./common.css";

import Home from "./home/page";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header";

const Page = () => {
  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  );
};

export default Page;
