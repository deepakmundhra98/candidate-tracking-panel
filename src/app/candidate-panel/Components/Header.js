import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  const [candidateProfileImage, setCandidateProfileImage] = useState("");

  useEffect(() => {
    const image = Cookies.get("candidate_profile_image");
    if (image) {
      setCandidateProfileImage(image);
    }
  }, []);
  let tokenCandidate = Cookies.get("tokenCandidate");
  let employer_id = Cookies.get("candidates_employer_id");
  let candidateId = Cookies.get("candidateId");
  const handleLogout = async () => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Logout?",
        text: "Do you want to logout?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        const response = await axios.post(BaseAPI + "/admin/logout", null, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + tokenCandidate,
          },
        });
        router.push("/candidate-panel/employer");

        Cookies.remove("tokenCandidate");
        Cookies.remove("fnameCandidate");
        Cookies.remove("candidateId");
        Cookies.remove("candidateUserType");
        Cookies.remove("candidate_profile_image");
        console.log("hi");
        window.location.reload();
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "success",
          title: "Logout successful",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Could not log you out",
        icon: "error",
        confirmButtonText: "Close",
      });
      console.log("Cannot logout!");
    }
  };
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/Images/userSide/rms-logo.png"
            alt="Somhako Logo"
            className="h-10"
            width={120}
            height={90}
          />
        </div>
        <div className="flex items-center space-x-4">
          {candidateProfileImage ? (
            <Image
              src={candidateProfileImage}
              alt="User Avatar"
              className="h-10 w-10 rounded-full"
              width={40}
              height={40}
            />
          ) : (
            <Image
              src="/Images/adminSide/dummy-profile.png"
              alt="User Avatar"
              className="h-10 w-10 rounded-full"
              width={40}
              height={40}
            />
          )}
          {/* <i className="fas fa-bell text-gray-600"></i> */}
          <button title="Logout" onClick={handleLogout}>
            {" "}
            <i className="fas fa-sign-out-alt text-gray-600 fa-lg"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
