"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Image from "next/image";

export default function Profile() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    profile_image: "",
    skills: [],
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("tokenCandidate");

  // Fetch profile data
  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(BaseAPI + "/admin/candidate/details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      setFormData((prev) => ({
        ...prev,
        ...data,
        profile_image: data.profile_image || prev.profile_image,
      }));
    } catch (error) {
      console.log("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit FormData
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();

      // Append text fields
      Object.keys(formData).forEach((key) => {
        if (key !== "profile_image") {
          fd.append(key, formData[key] || "");
        }
      });

      // Append image if a new file is chosen
      if (formData.profile_image instanceof File) {
        fd.append("profile_image", formData.profile_image);
      }

      const response = await axios.post(
        BaseAPI + "/admin/candidate/details",
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your profile was updated successfully.",
        background: "#111827",
        color: "#E5E7EB",
        confirmButtonColor: "#6366F1",
      });

      setIsEditing(false);
      getData();
    } catch (error) {
      console.log("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        background: "#111827",
        color: "#E5E7EB",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const fullName =
    (formData.first_name || formData.last_name)
      ? `${formData.first_name || ""} ${formData.last_name || ""}`.trim()
      : formData.name || "N/A";

  const avatarSrc =
    previewImage ||
    formData.profile_image ||
    "/Images/adminSide/dummy-profile.png";

  return (
    <div className="p-6 relative min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#0f1124] via-[#15172e] to-[#080912]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/25 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/25 blur-[140px] rounded-full -z-10" />

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 lg:p-10 neon-card"
      >
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/10 pb-6">
          <div className="flex items-center gap-5">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 opacity-60 blur-lg" />
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border border-white/40 overflow-hidden bg-black/40">
                <Image
                width={200}
                height={200}  
                  src={avatarSrc}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-wide">
                {fullName}
              </h1>
              <p className="text-sm text-gray-300 mt-1">
                {formData.bio ? formData.bio : "No bio added yet."}
              </p>

              {/* Quick meta chips */}
              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                {formData.location && (
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-gray-200">
                    📍 {formData.location}
                  </span>
                )}
                {formData.email && (
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-gray-200">
                    ✉️ {formData.email}
                  </span>
                )}
                {formData.phone && (
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-gray-200">
                    📞 {formData.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {loading && (
              <span className="text-xs text-gray-300 border border-white/15 rounded-full px-3 py-1 bg-white/5">
                Syncing profile…
              </span>
            )}
            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsEditing(true)}
                className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white 
                font-medium rounded-lg shadow-lg hover:shadow-indigo-500/40 transition-all duration-300"
              >
                Edit Profile
              </motion.button>
            )}
          </div>
        </div>

        {/* FORM / VIEW MODE */}
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.form
              key="edit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="pt-8 space-y-8"
            >
              {/* Layout */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* LEFT */}
                <div className="space-y-4">
                  {[
                    ["First Name", "first_name"],
                    ["Last Name", "last_name"],
                    ["Name (fallback)", "name"],
                    ["Email", "email"],
                    ["Phone", "phone"],
                    ["Location", "location"],
                  ].map(([label, field]) => (
                    <div key={field}>
                      <label className="text-gray-300 text-sm">{label}</label>
                      <input
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 mt-1 bg-white/10 border border-white/20 rounded-lg text-gray-100"
                        disabled={label === "Email" ? true : false}
                      />
                    </div>
                  ))}
                </div>

                {/* RIGHT */}
                <div className="space-y-4">
                  {/* Bio */}
                  <div>
                    <label className="text-gray-300 text-sm">Bio</label>
                    <textarea
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-100 mt-1"
                    />
                  </div>

                  {/* Profile Picture Upload */}
                  <div>
                    <label className="text-gray-300 text-sm">
                      Profile Picture
                    </label>

                    {/* Preview */}
                    <div className="w-28 h-28 mt-2 rounded-full overflow-hidden border border-white/30">
                      <img
                        src={
                          previewImage ||
                          formData.profile_image ||
                          "/Images/adminSide/dummy-profile.png"
                        }
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* File input */}
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-3 text-gray-200"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormData((prev) => ({
                            ...prev,
                            profile_image: file,
                          }));
                          setPreviewImage(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 bg-white/10 border border-white/20 text-white rounded-md"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md shadow"
                >
                  Save
                </button>
              </div>
            </motion.form>
          ) : (
            // VIEW MODE
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-8 space-y-6"
            >
              {[
                ["Full Name", fullName],
                ["Email", formData.email],
                ["Phone", formData.phone],
                ["Location", formData.location],
                ["Bio", formData.bio],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-3 gap-4 border-b border-white/10 pb-3"
                >
                  <p className="text-gray-400 text-sm">{label}</p>
                  <p className="text-gray-100 col-span-2">{value || "N/A"}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        .neon-card {
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.18),
                      inset 0 0 15px rgba(255, 255, 255, 0.06);
        }
      `}</style>
    </div>
  );
}
