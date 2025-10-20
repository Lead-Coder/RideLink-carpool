import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'rider',
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mock login - save role to localStorage
    localStorage.setItem('userRole', formData.role);
    
    setToast({
      show: true,
      message: 'Login successful!',
      type: 'success',
    });

    setTimeout(() => {
      navigate(`/${formData.role}/dashboard`);
    }, 1000);
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
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              Welcome Back
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
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

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Login as
                </label>
                <div className="flex gap-4">
                  {['rider', 'driver', 'admin'].map((role) => (
                    <label key={role} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={formData.role === role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className="mr-2"
                      />
                      <span className="capitalize text-foreground">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full btn-primary"
              >
                Login
              </motion.button>
            </form>

            <p className="mt-6 text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Register here
              </Link>
            </p>
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
