"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "@/app/offer-letter/offer-letter.css";
import "@/app/common.css";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import Confetti from "react-confetti";
import CountdownBox from "@/app/offer-letter/CountdownBox";

const Page = () => {
  const [ids, setIds] = useState({ id1: null, id2: null });
  const [loading, setLoading] = useState(true);
  const [candidateName, setCandidateName] = useState(null);
  const [expiryTime, setExpiryTime] = useState(null);
  const [offerAccepted, setOfferAccepted] = useState(false);
  const pathname = usePathname();
  const [candidateData, setCandidateData] = useState([]);
  const [offerData, setOfferData] = useState([]);
  let minutesRemaining;

  const getData = async (id1, id2) => {
    try {
      const response = await axios.post(
        BaseAPI + "/candidates/getofferletterdata",
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
      setLoading(false);
      if (response.data.status === 200) {
        setCandidateName(
          response.data.response.candidateData.first_name +
            " " +
            response.data.response.candidateData.last_name
        );
        setCandidateData(response.data.response.candidateData);
        setOfferData(response.data.response.candidateOfferDetailsData);
        // setExpiryTime(response.data.response.candidateOfferDetailsData.remaining_time);
        getRemainingMinutes(
          response.data.response.candidateOfferDetailsData.remaining_time
        );
        // Example usage:
        // const remainingTime = response.data.response.candidateOfferDetailsData.remaining_time;
        // minutesRemaining = getRemainingMinutes(remainingTime);
        // console.log(`Minutes remaining: ${minutesRemaining}`);
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

  const getRemainingMinutes = (targetTime) => {
    const currentTime = new Date();
    const targetDate = new Date(targetTime);

    console.log(targetDate);

    // Calculate the difference in milliseconds
    const diffInMillis = targetDate - currentTime;

    // Convert the difference from milliseconds to minutes
    const diffInMinutes = Math.floor(diffInMillis / (1000 * 60));

    setExpiryTime(diffInMinutes);

    // return diffInMinutes;
  };

  const handleAccept = async () => {
    try {
      const response = await axios.post(
        BaseAPI + "/candidates/changeofferletterstatus",
        {
          employer_id: ids.id1,
          candidate_id: ids.id2,
          status_id: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === 200) {
        setOfferAccepted(true);

        setExpiryTime(0);
        Swal.fire({
          icon: "success",
          title: "Congratulations!",
          text: "You have successfully accepted the job offer.",
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Something went wrong",
          text: response.data.response,
        });
      }
      getData
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleOfferDecline = async () => {
    setOfferAccepted(false);
    try {
      const response = await axios.post(
        BaseAPI + "/candidates/changeofferletterstatus",
        {
          employer_id: ids.id1,
          candidate_id: ids.id2,
          status_id: 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === 200) {
        setExpiryTime(null);
        Swal.fire({
          icon: "success",
          title: "Offer Declined",
          text: "You have successfully declined the job offer.",
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Something went wrong",
          text: response.data.response,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Conditional rendering based on loading state
  if (loading) {
    return <div className="loader-containerNormal"></div>; // Show loader while fetching data
  }

  return (
    <>
      {candidateName && (
        <>
          {offerAccepted && <Confetti />}
          <header className="header">
            {offerData.company_logo !== "" ? (
              <Image
                src={offerData.company_logo}
                alt="Company Logo"
                width={150}
                height={50}
              />
            ) : (
              <Image
                src="/Images/offer-letter/dummy-logo.png"
                alt="Company Logo"
                width={60}
                height={60}
              />
            )}
          </header>
          <main className="main-content">
            <div className="content-container">
              <h1>Hey {candidateName}</h1>

              {(offerData.offer_letter_accepted === null) && (
                <>
                  <h3>Congratulations on your offer!</h3>
                  <p>
                    We're thrilled to have you join us. Here are the details of
                    your offer:
                  </p>
                  <ul>
                    <li>
                      <strong>Position:</strong> {offerData.position_name}
                    </li>
                    {/* <li>
                      <strong>Department:</strong> {offerData.department}
                    </li> */}
                    <li>
                      <strong>Location:</strong> {offerData.work_location}
                    </li>
                    <li>
                      <strong>Start Date:</strong>{" "}
                      {offerData.joining_date.split("-").reverse().join("-")}
                    </li>
                    <li>
                      <strong>Salary:</strong> {offerData.compensation}
                    </li>
                    <li>
                      <strong>Benefits:</strong> {offerData.benefits}
                    </li>
                  </ul>

                  <p className="countdown">
                    <strong>Offer expires in:</strong>
                    <CountdownBox expiryValue={expiryTime} />
                  </p>
                </>
              )}
              {offerData.offer_letter_accepted === 1 && (
                // This means offer is accepted
                <button className="btn btn-accept">
                  You Accepted the Offer
                </button>
              )}
              {offerData.offer_letter_accepted === "0" && (
                // This means offer is accepted
                <button className="btn btn-decline">
                  You Declined the Offer
                </button>
              )}

              {offerData.offer_letter_accepted === null && (
                <div className="button-group">
                  {offerAccepted ? (
                    <button className="btn btn-accept">Offer Accepted</button>
                  ) : (
                    <button className="btn btn-accept" onClick={handleAccept}>
                      Accept Offer
                    </button>
                  )}

                  {!offerAccepted && (
                    <button
                      className="btn btn-decline"
                      onClick={handleOfferDecline}
                    >
                      Decline Offer
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="offer-letter-image">
              <Image
                src="/Images/offer-letter/right-notpad-img.png"
                alt="Offer Letter"
                width={400}
                height={400}
              />
            </div>
          </main>
          <footer className="footer">
            <div className="footer-content">
              <p>
                For any queries, contact us at:{" "}
                <a href={`mailto:${offerData.employer_email}`}>
                  {offerData.employer_email}
                </a>
              </p>
              <p>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </p>
              <p>
                This is a formal job offer. By accepting, you agree to the terms
                and conditions outlined in your offer letter.
              </p>
            </div>
          </footer>
        </>
      )}
    </>
  );
};

export default Page;
