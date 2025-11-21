import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import Toast from "../../components/Toast";
import Modal from "../../components/Modal";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function DriverVerification() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDriver, setSelectedDriver] = useState(null);
  const [modalAction, setModalAction] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false }), 2000);
  };

  // Load pending drivers
  useEffect(() => {
    fetchPendingDrivers();
  }, []);

  const fetchPendingDrivers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/drivers?status=pending`);
      const data = await res.json();
      setDrivers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (driver, action) => {
    setSelectedDriver(driver);
    setModalAction(action);
    setShowModal(true);
  };

  const reviewDriver = async () => {
    if (!selectedDriver) return;

    setShowModal(false);

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/admin/drivers/${selectedDriver._id}/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: modalAction }),
        }
      );

      const data = await res.json();

      if (!res.ok) return showToast(data.message || "Action failed", "error");

      showToast(`Driver ${modalAction === "approve" ? "approved" : "rejected"}`, "success");

      await fetchPendingDrivers();
    } catch (err) {
      showToast("Server error", "error");
    }
  };

  const docLink = (doc) => (doc ? `${BACKEND_URL}${doc.url}` : null);

  return (
    <div className="page-container flex flex-col">
      <Navbar userRole="admin" />

      <div className="flex flex-1">
        <Sidebar userRole="admin" />

        <main className="flex-1 p-8">
          <h1 className="text-4xl font-bold mb-2">Driver Verification</h1>
          <p className="text-muted-foreground mb-6">
            Review pending drivers & approve their registration
          </p>

          {loading ? (
            <p>Loading...</p>
          ) : drivers.length === 0 ? (
            <p className="text-center text-muted-foreground mt-10">
              No pending drivers.
            </p>
          ) : (
            <div className="space-y-6">
              {drivers.map((driver) => (
                <div key={driver._id} className="card p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold">{driver.name}</h2>
                      <p className="text-muted-foreground">{driver.email}</p>
                      <p className="text-muted-foreground">{driver.phone}</p>
                    </div>

                    <span className="px-3 py-1 bg-yellow-400 rounded-full font-semibold text-black">
                      Pending
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    {/* Document Block */}
                    <div className="p-4 bg-secondary rounded">
                      <h3 className="font-semibold mb-2">Driving License</h3>
                      {driver.documents?.license ? (
                        <a
                          href={docLink(driver.documents.license)}
                          target="_blank"
                          className="text-primary underline"
                        >
                          View Document
                        </a>
                      ) : (
                        <p className="text-muted-foreground">Not uploaded</p>
                      )}
                    </div>

                    <div className="p-4 bg-secondary rounded">
                      <h3 className="font-semibold mb-2">Vehicle Paper</h3>
                      {driver.documents?.vehiclePaper ? (
                        <a
                          href={docLink(driver.documents.vehiclePaper)}
                          target="_blank"
                          className="text-primary underline"
                        >
                          View Document
                        </a>
                      ) : (
                        <p className="text-muted-foreground">Not uploaded</p>
                      )}
                    </div>

                    <div className="p-4 bg-secondary rounded">
                      <h3 className="font-semibold mb-2">ID Proof (Aadhar)</h3>
                      {driver.documents?.idProof ? (
                        <a
                          href={docLink(driver.documents.idProof)}
                          target="_blank"
                          className="text-primary underline"
                        >
                          View Document
                        </a>
                      ) : (
                        <p className="text-muted-foreground">Not uploaded</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openModal(driver, "approve")}
                      className="flex-1 bg-green-500 text-white py-3 rounded-xl"
                    >
                      ✓ Approve
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openModal(driver, "reject")}
                      className="flex-1 bg-red-500 text-white py-3 rounded-xl"
                    >
                      ✗ Reject
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />

      {/* Confirm Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${modalAction === "approve" ? "Approve" : "Reject"} Driver`}
      >
        <div className="p-4">
          <p className="mb-6">
            Are you sure you want to {modalAction}{" "}
            <strong>{selectedDriver?.name}</strong>?
          </p>

          <div className="flex gap-4">
            <button className="btn-secondary flex-1" onClick={() => setShowModal(false)}>
              Cancel
            </button>

            <button
              className={`flex-1 py-2 rounded-xl text-white ${
                modalAction === "approve" ? "bg-green-500" : "bg-red-500"
              }`}
              onClick={reviewDriver}
            >
              Confirm
            </button>
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
}