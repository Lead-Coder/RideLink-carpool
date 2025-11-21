import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import Modal from '../components/Modal';

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Register = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('rider');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [otp, setOtp] = useState("");

  const [riderData, setRiderData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'rider'
  });

  const [driverData, setDriverData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'driver',
    vehicleNumber: ''
  });

  const showToast = (msg, type = "error") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false }), 2000);
  };

  // SAFE JSON
  const safeJSON = async (res) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  // helper to upload files after registration (call after registerUser success for drivers)
const uploadDriverDocs = async (email, vehicleNumber, files) => {
  // files: { licenseFile, vehiclePaperFile, idProofFile }
  try {
    const fd = new FormData();
    fd.append("email", email);
    if (vehicleNumber) fd.append("vehicleNumber", vehicleNumber);
    if (files.licenseFile) fd.append("license", files.licenseFile);
    if (files.vehiclePaperFile) fd.append("vehiclePaper", files.vehiclePaperFile);
    if (files.idProofFile) fd.append("idProof", files.idProofFile);

    const res = await fetch(`${BACKEND_URL}/api/driver/upload-docs`, {
      method: "POST",
      body: fd
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    return { ok: false, err };
  }
};

  // 1️⃣ SEND OTP
  const sendOtp = async (userData) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email })
      });

      const data = await safeJSON(res);

      if (!res.ok) {
        return showToast(data?.message || "Could not send OTP");
      }

      setShowOtpModal(true);
      showToast("OTP sent to email!", "success");

    } catch (error) {
      showToast("Server error. Check backend.");
    }
  };

  // 2️⃣ VERIFY OTP
  const verifyOtp = async (userData) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email, otp })
      });

      const data = await safeJSON(res);

      if (!res.ok) {
        return showToast(data?.message || "Invalid OTP");
      }

      setShowOtpModal(false);
      registerUser(userData);

    } catch (error) {
      showToast("Server error");
    }
  };

  // 3️⃣ COMPLETE REGISTRATION
  const registerUser = async (userData) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      const data = await safeJSON(res);

      if (!res.ok) {
        return showToast(data?.message || "Registration failed");
      }

      setShowSuccessModal(true);
      setTimeout(() => navigate("/login"), 2000);

    } catch (error) {
      showToast("Registration error");
    }
  };

  // SUBMIT HANDLERS
  const handleRiderSubmit = (e) => {
    e.preventDefault();
    sendOtp(riderData);
  };

  const handleDriverSubmit = (e) => {
    e.preventDefault();
    sendOtp(driverData);
  };

  return (
    <div className="page-container flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <div className="card">
            <h2 className="text-3xl font-bold text-center mb-8">
              Create Account
            </h2>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 p-1 bg-secondary/50 rounded-xl">
              <button
                onClick={() => setActiveTab('rider')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'rider'
                    ? 'bg-primary text-white'
                    : 'bg-transparent text-muted-foreground'
                }`}
              >
                🚗 Register as Rider
              </button>

              <button
                onClick={() => setActiveTab('driver')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'driver'
                    ? 'bg-primary text-white'
                    : 'bg-transparent text-muted-foreground'
                }`}
              >
                🚙 Register as Driver
              </button>
            </div>

            {/* Rider Form */}
            {activeTab === 'rider' && (
              <form onSubmit={handleRiderSubmit} className="space-y-4">

                <input className="input-field" placeholder="Full Name" required
                  value={riderData.name}
                  onChange={(e) => setRiderData({ ...riderData, name: e.target.value })} />

                <input className="input-field" placeholder="Email" required type="email"
                  value={riderData.email}
                  onChange={(e) => setRiderData({ ...riderData, email: e.target.value })} />

                <input className="input-field" placeholder="Phone" required
                  value={riderData.phone}
                  onChange={(e) => setRiderData({ ...riderData, phone: e.target.value })} />

                <input className="input-field" placeholder="Password" required type="password"
                  value={riderData.password}
                  onChange={(e) => setRiderData({ ...riderData, password: e.target.value })} />

                <button className="btn-primary w-full mt-4">Send OTP</button>
              </form>
            )}

            {/* Driver Form */}
            {activeTab === 'driver' && (
              <form onSubmit={handleDriverSubmit} className="space-y-4">

                <input className="input-field" placeholder="Full Name" required
                  value={driverData.name}
                  onChange={(e) => setDriverData({ ...driverData, name: e.target.value })} />

                <input className="input-field" placeholder="Email" required type="email"
                  value={driverData.email}
                  onChange={(e) => setDriverData({ ...driverData, email: e.target.value })} />

                <input className="input-field" placeholder="Phone" required
                  value={driverData.phone}
                  onChange={(e) => setDriverData({ ...driverData, phone: e.target.value })} />

                <input className="input-field" placeholder="Password" required type="password"
                  value={driverData.password}
                  onChange={(e) => setDriverData({ ...driverData, password: e.target.value })} />

                <input className="input-field" placeholder="Vehicle Number" required
                  value={driverData.vehicleNumber}
                  onChange={(e) => setDriverData({ ...driverData, vehicleNumber: e.target.value })} />

                <button className="btn-primary w-full mt-4">Send OTP</button>
              </form>
            )}

            <p className="mt-6 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-primary">Login here</Link>
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />

      {/* OTP Modal */}
      <Modal isOpen={showOtpModal} onClose={() => setShowOtpModal(false)} title="Verify OTP">
        <div className="p-4 space-y-4">
          <p className="text-center">Enter the 6-digit OTP sent to your email.</p>
          <input
            className="input-field"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            className="btn-primary w-full"
            onClick={() => verifyOtp(activeTab === 'rider' ? riderData : driverData)}
          >
            Verify & Register
          </button>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Registration Successful! 🎉"
      >
        <p className="text-center p-4">Redirecting to login page...</p>
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default Register;