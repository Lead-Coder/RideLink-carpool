import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';

const DriverVerification = () => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const pendingDrivers = [
    {
      id: 1,
      name: 'Sameer Shah',
      email: 'sameer.shah@email.com',
      phone: '9175339003',
      vehicleNumber: 'MH-XYZ-5678',
      vehicleModel: 'Honda Civic',
      appliedDate: '2025-01-15',
      status: 'Pending',
    },
    {
      id: 2,
      name: 'Hiten Mehta',
      email: 'hiten.mehta@email.com',
      phone: '9278480283',
      vehicleNumber: 'UP-DEF-9012',
      vehicleModel: 'Tesla Model Y',
      appliedDate: '2025-01-16',
      status: 'Pending',
    },
  ];

  const handleVerificationAction = (driver, action) => {
    setSelectedDriver(driver);
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = () => {
    setShowModal(false);
    const message =
      modalAction === 'approve'
        ? `${selectedDriver?.name} has been approved!`
        : `${selectedDriver?.name} has been rejected`;
    
    setToast({
      show: true,
      message,
      type: modalAction === 'approve' ? 'success' : 'warning',
    });
  };

  return (
    <div className="page-container flex flex-col">
      <Navbar userRole="admin" />
      
      <div className="flex flex-1">
        <Sidebar userRole="admin" />
        
        <main className="flex-1 p-6 lg:p-8">
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          > */}
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Driver Verification ✓
            </h1>
            <p className="text-muted-foreground mb-8">
              Review and approve driver applications
            </p>

            {pendingDrivers.length > 0 ? (
              <div className="space-y-4">
                {pendingDrivers.map((driver) => (
                  <Card key={driver.id}>
                    <div className="space-y-4">
                      {/* Driver Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-3xl">
                            👤
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground">
                              {driver.name}
                            </h3>
                            <p className="text-muted-foreground">{driver.email}</p>
                            <p className="text-sm text-muted-foreground">
                              Applied: {driver.appliedDate}
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500 text-black">
                          {driver.status}
                        </span>
                      </div>

                      {/* Driver Details */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-y border-border">
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium text-foreground">{driver.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Vehicle Model</p>
                          <p className="font-medium text-foreground">
                            {driver.vehicleModel}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Vehicle Number</p>
                          <p className="font-medium text-foreground">
                            {driver.vehicleNumber}
                          </p>
                        </div>
                      </div>

                      {/* Documents Preview */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">
                          Submitted Documents
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-secondary rounded-lg text-center">
                            <div className="text-4xl mb-2">📄</div>
                            <p className="text-sm text-foreground font-medium">
                              Driver License
                            </p>
                            <button className="text-primary text-sm hover:underline mt-1">
                              View Document
                            </button>
                          </div>
                          <div className="p-4 bg-secondary rounded-lg text-center">
                            <div className="text-4xl mb-2">🚗</div>
                            <p className="text-sm text-foreground font-medium">
                              Vehicle Registration
                            </p>
                            <button className="text-primary text-sm hover:underline mt-1">
                              View Document
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleVerificationAction(driver, 'approve')}
                          className="flex-1 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:bg-green-600"
                        >
                          ✓ Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleVerificationAction(driver, 'reject')}
                          className="flex-1 bg-red-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:bg-red-600"
                        >
                          ✗ Reject
                        </motion.button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">✓</div>
                <p className="text-xl text-muted-foreground">
                  No pending driver verifications
                </p>
              </div>
            )}
          {/* </motion.div> */}
        </main>
      </div>

      <Footer />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalAction === 'approve' ? 'Approve Driver' : 'Reject Driver'}
      >
        <div className="py-4">
          <p className="text-foreground mb-6">
            Are you sure you want to {modalAction} {selectedDriver?.name}'s application?
          </p>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={confirmAction}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold ${
                modalAction === 'approve'
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              Confirm
            </motion.button>
          </div>
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

export default DriverVerification;
