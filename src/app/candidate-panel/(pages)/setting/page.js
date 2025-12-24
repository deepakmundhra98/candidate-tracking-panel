// app/settings/option-b/page.js
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

function useSettingsState() {
  const [settings, setSettings] = useState({
    email: "john.doe@example.com",
    notifications: {
      email: true,
      push: true,
      jobAlerts: true,
      newsletter: false,
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      showPhone: false,
    },
  });

  return { settings, setSettings };
}

export default function SettingsMultipleCards() {
  const { settings, setSettings } = useSettingsState();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [passErrors, setPassErrors] = useState({});
  const [strength, setStrength] = useState("");

  const token = Cookies.get("tokenCandidate");
  const router = useRouter();

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((p) => ({ ...p, [name]: value }));

    // Reset field error
    setPassErrors((p) => ({ ...p, [name]: "" }));

    // Password Strength Check
    if (name === "new_password") {
      checkStrength(value);
    }
  };

  const checkStrength = (pass) => {
    if (pass.length < 6) setStrength("weak");
    else if (pass.match(/[A-Z]/) && pass.match(/[0-9]/) && pass.length >= 8)
      setStrength("strong");
    else setStrength("medium");
  };

  const validatePasswordForm = () => {
    const temp = {};

    if (!passwordData.old_password.trim())
      temp.old_password = "Current password required.";
    if (!passwordData.new_password.trim())
      temp.new_password = "New password required.";
    if (!passwordData.confirm_password.trim())
      temp.confirm_password = "Confirm password required.";
    if (passwordData.new_password !== passwordData.confirm_password)
      temp.confirm_password = "Passwords do not match.";

    setPassErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handlePasswordSubmit = async () => {
    if (!validatePasswordForm()) return;

    const response = await axios.post(
      BaseAPI + "/admin/candidate/change-password",
      passwordData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    if(response.data.status === 200){
      Swal.fire({
        icon: 'success',
        title: 'Password Updated',
        text: 'Your password has been updated successfully.',
        confirmButtonColor: '#6366F1',
      }).then(() => {
        router.push('/candidate-panel/profile');
      });
      setShowPasswordModal(false);
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      setStrength("");
    }

    // console.log("Password Updated:", passwordData);
    
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.post(
        BaseAPI + "/admin/candidate/delete-account",
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (response.data.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Account Deleted',
          text: 'Your account has been deleted successfully.',
          confirmButtonColor: '#6366F1',
        }).then(() => {
          router.push('/');
          Cookies.remove('tokenCandidate');
          Cookies.remove('userType');
          Cookies.remove('candidateData');
        });
      }
    } catch (error) {
      console.error("Error deleting account:", error.message);
    }
  }





  return (
    <div className="relative min-h-screen px-6 py-14">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0f1124] via-[#15172e] to-[#080912]" />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-between items-start"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
              Setting
            </h1>
            <p className="text-gray-400 mt-4 max-w-2xl text-lg">
              Manage account, notifications, privacy, and security.
            </p>

            <div className="mt-6 h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
          </div>
        </motion.header>
        {/* CARDS */}
        <div className="space-y-6">
          {/* Change Password Card */}
          <Card>
            <CardTitle
              title="Security"
              subtitle="Password and account security options."
            />

            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 mt-4 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition"
            >
              Change Password
            </button>
          </Card>

          {/* DELETE ACCOUNT SECTION */}
          <DangerCard>
            <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
            <p className="text-gray-300 text-sm">
              Permanently delete your account and all data.
            </p>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="mt-4 px-4 py-2 border border-red-400 text-red-400 rounded-lg hover:bg-red-500/10 transition"
            >
              Delete Account
            </button>
          </DangerCard>
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      <AnimatePresence>
        {showPasswordModal && (
          <Modal
            onClose={() => setShowPasswordModal(false)}
            title="Change Password"
          >
            {/* CURRENT PASSWORD */}
            <PasswordInput
              label="Current Password"
              name="old_password"
              value={passwordData.old_password}
              error={passErrors.old_password}
              onChange={handlePasswordChange}
            />

            {/* NEW PASSWORD */}
            <PasswordInput
              label="New Password"
              name="new_password"
              value={passwordData.new_password}
              error={passErrors.new_password}
              onChange={handlePasswordChange}
            />

            {/* Password Strength */}
            {passwordData.new_password && (
              <PasswordStrengthIndicator strength={strength} />
            )}

            {/* CONFIRM PASSWORD */}
            <PasswordInput
              label="Confirm Password"
              name="confirm_password"
              value={passwordData.confirm_password}
              error={passErrors.confirm_password}
              onChange={handlePasswordChange}
            />

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg"
                onClick={handlePasswordSubmit}
              >
                Update Password
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* DELETE ACCOUNT MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <Modal
            onClose={() => setShowDeleteModal(false)}
            title="Delete Account"
          >
            <p className="text-gray-300 text-sm">
              This action cannot be undone. Are you sure you want to permanently
              delete your account?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={() => {
                  handleDeleteAccount();
                  setShowDeleteModal(false);
                }}
              >
                Delete
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* CARD STYLES */}
      <style>
        {`
        .neon-card {
          box-shadow: 0 0 30px rgba(99,102,241,0.12),
                      inset 0 0 12px rgba(255,255,255,0.02);
        }
        `}
      </style>
    </div>
  );
}

/* -------------------------
    REUSABLE COMPONENTS
------------------------- */

function Card({ children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-white/6 border border-white/8 neon-card"
    >
      {children}
    </motion.section>
  );
}

function DangerCard({ children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-red-500/10 border border-red-400/30"
    >
      {children}
    </motion.section>
  );
}

function CardTitle({ title, subtitle }) {
  return (
    <>
      <h2 className="text-xl font-medium text-white">{title}</h2>
      <p className="text-sm text-gray-300 mt-1">{subtitle}</p>
    </>
  );
}

function LabeledInput({ label, value, onChange, required }) {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-6 gap-4">
      <label className="col-span-1 text-sm text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        value={value}
        onChange={onChange}
        className="sm:col-span-5 px-3 py-2 rounded-lg bg-white/6 border border-white/8 text-white"
      />
    </div>
  );
}

function CheckboxRow({ label, subtitle, ...props }) {
  return (
    <label className="flex items-start gap-3 mt-4">
      <input type="checkbox" className="w-4 h-4" {...props} />
      <div>
        <div className="text-white font-medium">{label}</div>
        <div className="text-sm text-gray-300">{subtitle}</div>
      </div>
    </label>
  );
}

/* -------------------------
    PASSWORD INPUT COMPONENT
------------------------- */

function PasswordInput({ label, name, value, error, onChange }) {
  return (
    <div className="mt-4">
      <label className="text-sm text-gray-300">
        {label} <span className="text-red-400">*</span>
      </label>

      <input
        type="password"
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full mt-2 px-4 py-2 bg-white/10 border rounded-lg text-white ${
          error ? "border-red-400" : "border-white/20"
        }`}
      />

      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

/* -------------------------
    PASSWORD STRENGTH BAR
------------------------- */

function PasswordStrengthIndicator({ strength }) {
  const color =
    strength === "weak"
      ? "bg-red-500"
      : strength === "medium"
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div className="mt-2">
      <div className="text-sm text-gray-300 mb-1 capitalize">
        {strength} password
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all`}
          style={{
            width:
              strength === "weak"
                ? "30%"
                : strength === "medium"
                ? "60%"
                : "100%",
          }}
        />
      </div>
    </div>
  );
}

/* -------------------------
    MODAL COMPONENT
------------------------- */

function Modal({ children, title, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-lg p-6 rounded-2xl bg-white/10 border border-white/20 neon-card text-white"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-lg"
          >
            ×
          </button>
        </div>

        {children}
      </motion.div>
    </motion.div>
  );
}
