import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import Modal from "../components/Modal";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("email"); // email → otp → reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (msg, type = "error") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false }), 2000);
  };

  const safeJSON = async (res) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  // 1️⃣ SEND OTP
  const sendOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BACKEND_URL}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await safeJSON(res);
      if (!res.ok) return showToast(data?.message || "Failed to send OTP");

      showToast("OTP sent successfully!", "success");
      setStep("otp");

    } catch (err) {
      showToast("Server error");
    }
  };

  // 2️⃣ VERIFY OTP
  const verifyOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BACKEND_URL}/api/reset-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await safeJSON(res);

      if (!res.ok) return showToast(data?.message || "Invalid OTP");

      showToast("OTP verified!", "success");
      setStep("reset");

    } catch (err) {
      showToast("Server error");
    }
  };

  // 3️⃣ RESET PASSWORD
  const resetPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BACKEND_URL}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await safeJSON(res);

      if (!res.ok) return showToast(data?.message || "Reset failed");

      showToast("Password reset successful!", "success");

      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      showToast("Server error");
    }
  };

  return (
    <div className="page-container flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="card">
            <h2 className="text-3xl font-bold text-center mb-8">
              Forgot Password
            </h2>

            {/* ---------------- EMAIL STEP ---------------- */}
            {step === "email" && (
              <form className="space-y-6" onSubmit={sendOtp}>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="Enter your registered email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-primary"
                >
                  Send OTP
                </motion.button>
              </form>
            )}

            {/* ---------------- OTP STEP ---------------- */}
            {step === "otp" && (
              <form className="space-y-6" onSubmit={verifyOtp}>
                <p className="text-center text-muted-foreground">
                  Enter the OTP sent to <strong>{email}</strong>
                </p>

                <input
                  className="input-field"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full"
                >
                  Verify OTP
                </motion.button>
              </form>
            )}

            {/* ---------------- RESET PASSWORD STEP ---------------- */}
            {step === "reset" && (
              <form className="space-y-6" onSubmit={resetPassword}>
                <p className="text-center text-muted-foreground">
                  OTP verified for <strong>{email}</strong>
                </p>

                <input
                  type="password"
                  className="input-field"
                  placeholder="Enter new password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full"
                >
                  Reset Password
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </div>

      <Footer />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default ForgotPassword;