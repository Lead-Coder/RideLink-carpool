import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import Modal from '../components/Modal';

const Register = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('rider');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const [riderData, setRiderData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [driverData, setDriverData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    vehicleNumber: '',
    license: null,
    vehicleDoc: null,
  });

  const handleRiderSubmit = (e) => {
    e.preventDefault();
    setShowSuccessModal(true);
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  const handleDriverSubmit = (e) => {
    e.preventDefault();
    setShowSuccessModal(true);
    setTimeout(() => {
      navigate('/login');
    }, 2000);
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
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              Create Account
            </h2>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 p-1 bg-secondary/50 rounded-xl">
              <button
                onClick={() => setActiveTab('rider')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'rider'
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}>
                🚗 Register as Rider
              </button>
              <button
                onClick={() => setActiveTab('driver')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'driver'
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}>
                🚙 Register as Driver
              </button>
            </div>

            {/* Rider Form */}
            {activeTab === 'rider' && (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleRiderSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="John Doe"
                    value={riderData.name}
                    onChange={(e) =>
                      setRiderData({ ...riderData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    placeholder="your@email.com"
                    value={riderData.email}
                    onChange={(e) =>
                      setRiderData({ ...riderData, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    className="input-field"
                    placeholder="+1 234 567 8900"
                    value={riderData.phone}
                    onChange={(e) =>
                      setRiderData({ ...riderData, phone: e.target.value })
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
                    value={riderData.password}
                    onChange={(e) =>
                      setRiderData({ ...riderData, password: e.target.value })
                    }
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full btn-primary mt-6"
                >
                  Create Rider Account
                </motion.button>
              </motion.form>
            )}

            {/* Driver Form */}
            {activeTab === 'driver' && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleDriverSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="John Doe"
                    value={driverData.name}
                    onChange={(e) =>
                      setDriverData({ ...driverData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    placeholder="your@email.com"
                    value={driverData.email}
                    onChange={(e) =>
                      setDriverData({ ...driverData, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    className="input-field"
                    placeholder="+1 234 567 8900"
                    value={driverData.phone}
                    onChange={(e) =>
                      setDriverData({ ...driverData, phone: e.target.value })
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
                    value={driverData.password}
                    onChange={(e) =>
                      setDriverData({ ...driverData, password: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="ABC-1234"
                    value={driverData.vehicleNumber}
                    onChange={(e) =>
                      setDriverData({ ...driverData, vehicleNumber: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Driver License
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="input-field"
                    onChange={(e) =>
                      setDriverData({ ...driverData, license: e.target.files[0] })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Vehicle Documents
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="input-field"
                    onChange={(e) =>
                      setDriverData({ ...driverData, vehicleDoc: e.target.files[0] })
                    }
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full btn-primary mt-6"
                >
                  Create Driver Account
                </motion.button>
              </motion.form>
            )}

            <p className="mt-6 text-center text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Registration Successful! 🎉"
      >
        <div className="text-center py-4">
          <p className="text-muted-foreground mb-4">
            Your account has been created successfully!
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting to login page...
          </p>
        </div>
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
