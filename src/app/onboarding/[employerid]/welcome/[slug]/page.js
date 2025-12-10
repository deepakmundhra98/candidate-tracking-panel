"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "@/app/onboarding/onboarding.css";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const Page = () => {
  const [ids, setIds] = useState({ id1: null, id2: null });
  const [loading, setLoading] = useState(true);
  const [candidateName, setCandidateName] = useState(null);
  const pathname = usePathname();

  const getData = async (id1, id2) => {
    try {
      const response = await axios.post(
        BaseAPI + "/candidates/getcandidatedetails",
        {
          employer_id: id1,
          candidate_id: id2,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === 200) {
        setCandidateName(
          response.data.response.first_name +
            " " +
            response.data.response.last_name
        );
      } else if (response.data.status === 500) {
        Swal.fire({
          icon: "warning",
          title: response.data.response,
          text: "",
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Something went wrong",
          text: "",
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (pathname) {
      const pathParts = pathname.split("/");
      if (pathParts.length >= 5) {
        const id1 = pathParts[2];
        const id2 = pathParts[4];
        setIds({ id1, id2 });
        getData(id1, id2);
        Cookies.set("employer_id", id1);
      }
    }
  }, [pathname]);

  // Conditional rendering based on loading state
  if (loading) {
    return <div className="loader-container"></div>; // Show loader while fetching data
  }

  return (
    <>
      {candidateName && (
        <>
          <div className="onboarding-container">
            <div className="text-container animate-left">
              <h1>Hey {candidateName}</h1>
              <h3>Welcome to Your Onboarding Journey!</h3>
              <p>
                We're thrilled to have you join us. As you begin this process,
                please ensure the information you provide is accurate, as it
                will undergo verification. Your attention to detail helps us
                ensure a smooth onboarding experience. Let’s get started!
              </p>
              <Link
                href={`/onboarding/personal-details/${ids.id2}`}
                className="start-button"
              >
                Get Started
              </Link>
            </div>
            <div className="image-container animate-right">
              <Image
                src="/Images/onboarding/onboarding-startscreen.jpg"
                width={500}
                height={500}
                alt="Welcome Animation"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Page;
