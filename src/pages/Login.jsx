import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';

const BACKEND_URL = "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("user"); // ⭐ "user" or "admin"

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false }), 2000);
  };

  const safeJSON = async (res) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await safeJSON(res);

      if (!res.ok || !data) {
        return showToast(data?.message || "Login failed.");
      }

      // Save in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("email", data.user.email);

      showToast("Login successful!", "success");

      // ⭐ REDIRECT BASED ON ROLE
      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (data.user.role === "driver") {
          navigate("/driver/dashboard");
        } else {
          navigate("/rider/dashboard");
        }
      }, 1000);

    } catch (err) {
      showToast("Cannot reach server.");
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
            
            {/* Mode Switch */}
            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => setMode("user")}
                className={`flex-1 py-2 rounded-lg font-semibold ${
                  mode === "user" ? "bg-primary text-white" : "bg-secondary"
                }`}
              >
                User Login
              </button>

              <button 
                onClick={() => setMode("admin")}
                className={`flex-1 py-2 rounded-lg font-semibold ${
                  mode === "admin" ? "bg-primary text-white" : "bg-secondary"
                }`}
              >
                Admin Login
              </button>
            </div>

            <h2 className="text-3xl font-bold text-center mb-6">
              {mode === "admin" ? "Admin Login" : "Welcome Back"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder={mode === "admin" ? "Admin email" : "you@email.com"}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  required
                  className="input-field"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full btn-primary"
              >
                {mode === "admin" ? "Login as Admin" : "Login"}
              </motion.button>

              {mode === "user" && (
                <p className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                </p>
              )}
            </form>

            {mode === "user" && (
              <p className="mt-6 text-center">
                Don’t have an account?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Register here
                </Link>
              </p>
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

export default Login;