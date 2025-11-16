import { useEffect, useState } from 'react';
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

  const [dbDrivers, setDbDrivers] = useState([]);

  // Load from MongoDB
  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/verify-driver`);
        const data = await res.json();
        setDbDrivers(data);
      } catch (err) {
        console.error('Failed to fetch driver verifications', err);
      }
    };
    loadDrivers();
  }, []);

  // Hardcoded list remains the same
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

  const handleVerificationAction = (driver, action, isDb = false) => {
    setSelectedDriver({ ...driver, isDb });
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = async () => {
    setShowModal(false);

    // If driver is from MongoDB
    if (selectedDriver.isDb) {
      try {
        await fetch(
          `http://localhost:5000/api/verify-driver/${selectedDriver._id}`,
          { method: 'DELETE' }
        );

        setDbDrivers(prev => prev.filter(d => d._id !== selectedDriver._id));
      } catch (err) {
        setToast({
          show: true,
          message: 'Failed to update verification status',
          type: 'error',
        });
        return;
      }
    }

    const message =
      modalAction === 'approve'
        ? `${selectedDriver?.driverName || selectedDriver?.name} has been approved`
        : `${selectedDriver?.driverName || selectedDriver?.name} has been rejected`;

    setToast({
      show: true,
      message,
      type: modalAction === 'approve' ? 'success' : 'warning',
    });
  };

  const openPdf = (fileName) => {
    window.open(`/${fileName}`, '_blank');
  };

  return (
    <div className="page-container flex flex-col">
      <Navbar userRole="admin" />

      <div className="flex flex-1">
        <Sidebar userRole="admin" />

        <main className="flex-1 p-6 lg:p-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Driver Verification
          </h1>
          <p className="text-muted-foreground mb-8">
            Review and approve driver applications
          </p>

          {/* First show MongoDB entries */}
          {dbDrivers.length > 0 && (
            <div className="space-y-4 mb-10">
              {dbDrivers.map((driver) => (
                <Card key={driver._id}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-3xl">👤</div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{driver.driverName}</h3>
                          <p className="text-muted-foreground">{driver.driverEmail}</p>
                          <p className="text-sm text-muted-foreground">
                            Applied: {new Date(driver.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500 text-black">
                        Pending
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-y border-border">
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium text-foreground">{driver.driverPhone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Vehicle Model</p>
                        <p className="font-medium text-foreground">{driver.vehicleModel}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Vehicle Number</p>
                        <p className="font-medium text-foreground">{driver.vehicleNumber}</p>
                      </div>
                    </div>

                    {/* Documents */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Submitted Documents</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-secondary rounded-lg text-center">
                          <div className="text-4xl mb-2">📄</div>
                          <p className="text-sm text-foreground font-medium">Driver License</p>
                          <button
                            className="text-primary text-sm hover:underline mt-1"
                            onClick={() => openPdf('license.pdf')}>
                            View Document
                          </button>
                        </div>

                        <div className="p-4 bg-secondary rounded-lg text-center">
                          <div className="text-4xl mb-2">🚗</div>
                          <p className="text-sm text-foreground font-medium">Vehicle Registration</p>
                          <button
                            className="text-primary text-sm hover:underline mt-1"
                            onClick={() => openPdf(driver.vehicleDocFileName || 'license.pdf')}>
                            View Document
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleVerificationAction(driver, 'approve', true)}
                        className="flex-1 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold"
                      >
                        ✓ Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleVerificationAction(driver, 'reject', true)}
                        className="flex-1 bg-red-500 text-white px-6 py-3 rounded-xl font-semibold"
                      >
                        ✗ Reject
                      </motion.button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Hardcoded list shown below */}
          <div className="space-y-4">
            {pendingDrivers.map((driver) => (
              <Card key={driver.id}>
                <div className="space-y-4">
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
                        <button
                          className="text-primary text-sm hover:underline mt-1"
                          onClick={() => openPdf('license.pdf')}
                        >
                          View Document
                        </button>
                      </div>
                      <div className="p-4 bg-secondary rounded-lg text-center">
                        <div className="text-4xl mb-2">🚗</div>
                        <p className="text-sm text-foreground font-medium">
                          Vehicle Registration
                        </p>
                        <button
                          className="text-primary text-sm hover:underline mt-1"
                          onClick={() => openPdf('license.pdf')}
                        >
                          View Document
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVerificationAction(driver, 'approve')}
                      className="flex-1 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold"
                    >
                      ✓ Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVerificationAction(driver, 'reject')}
                      className="flex-1 bg-red-500 text-white px-6 py-3 rounded-xl font-semibold"
                    >
                      ✗ Reject
                    </motion.button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
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
            Are you sure you want to {modalAction} {selectedDriver?.driverName || selectedDriver?.name}'s application?
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
