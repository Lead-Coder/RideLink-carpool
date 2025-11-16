import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';

const DriverProfile = () => {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // driver main profile
  const [profileData, setProfileData] = useState({
    name: 'John Driver',
    email: 'john.driver@email.com',
    phone: '+1 234 567 8900',
    vehicleNumber: 'ABC-1234',
    vehicleModel: 'Toyota Camry',
    verificationStatus: 'Pending'
  });

  // new verification data to send to backend
  const [verificationData, setVerificationData] = useState({
    driverName: '',
    driverEmail: '',
    driverPhone: '',
    licenseNumber: '',
    vehicleNumber: '',
    vehicleModel: '',
    licenseFileName: '',
    vehicleDocFileName: ''
  });

  // handle file input (only store file name, not the file)
  const handleFileSelect = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setVerificationData(prev => ({
        ...prev,
        [fieldName]: file.name
      }));
    }
  };

  // submit verification
  const handleSubmitVerification = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/verify-driver`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(verificationData)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit verification details');
      }

      setToast({
        show: true,
        message: 'Driver verification details submitted',
        type: 'success'
      });
    } catch (err) {
      setToast({
        show: true,
        message: err.message,
        type: 'error'
      });
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setToast({
      show: true,
      message: 'Profile updated successfully',
      type: 'success'
    });
  };

  return (
    <div className="page-container flex flex-col">
      <Navbar userRole="driver" />
      
      <div className="flex flex-1">
        <Sidebar userRole="driver" />
        
        <main className="flex-1 p-6 lg:p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Driver Profile 👤
            </h1>
            <p className="text-muted-foreground mb-8">
              Manage your profile and documents
            </p>

            <div className="max-w-3xl">
              
              {/* Verification Status */}
              <div className="dashboard-card mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      Verification Status
                    </h3>
                    <p className="text-muted-foreground">
                      Your account verification status
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full font-semibold ${
                      profileData.verificationStatus === 'Verified'
                        ? 'bg-green-500 text-white'
                        : 'bg-yellow-500 text-black'
                    }`}
                  >
                    {profileData.verificationStatus === 'Verified' ? '✓ ' : '⏳ '}
                    {profileData.verificationStatus}
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="dashboard-card mb-6">
                <h3 className="text-xl font-bold text-foreground mb-6">
                  Personal Information
                </h3>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={verificationData.driverName}
                        onChange={(e) =>
                          setVerificationData({ ...verificationData, driverName: e.target.value })
                        }
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="input-field"
                        value={verificationData.driverEmail}
                        onChange={(e) =>
                          setVerificationData({ ...verificationData, driverEmail: e.target.value })
                        }
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        className="input-field"
                        value={verificationData.driverPhone}
                        onChange={(e) =>
                          setVerificationData({ ...verificationData, driverPhone: e.target.value })
                        }
                      />
                    </div>

                    {/* License Number */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        License Number
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={verificationData.licenseNumber}
                        onChange={(e) =>
                          setVerificationData({ ...verificationData, licenseNumber: e.target.value })
                        }
                      />
                    </div>

                    {/* Vehicle Number */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Vehicle Number
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={verificationData.vehicleNumber}
                        onChange={(e) =>
                          setVerificationData({ ...verificationData, vehicleNumber: e.target.value })
                        }
                      />
                    </div>

                    {/* Vehicle Model */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Vehicle Model
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={verificationData.vehicleModel}
                        onChange={(e) =>
                          setVerificationData({ ...verificationData, vehicleModel: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="btn-primary"
                  >
                    Update Profile
                  </motion.button>
                </form>
              </div>

              {/* Documents */}
              <div className="dashboard-card">
                <h3 className="text-xl font-bold text-foreground mb-6">
                  Documents
                </h3>
                <div className="space-y-4">
                  
                  {/* license */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Driver License
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="input-field"
                        onChange={(e) => handleFileSelect(e, 'licenseFileName')}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-secondary whitespace-nowrap"
                      >
                        Upload
                      </motion.button>
                    </div>
                  </div>

                  {/* vehicle docs */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Vehicle Documents
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="input-field"
                        onChange={(e) => handleFileSelect(e, 'vehicleDocFileName')}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-secondary whitespace-nowrap"
                      >
                        Upload
                      </motion.button>
                    </div>
                  </div>

                  {/* Submit verification */}
                  <div className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmitVerification}
                      className="btn-primary"
                    >
                      Submit Verification Details
                    </motion.button>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        </main>
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

export default DriverProfile;
