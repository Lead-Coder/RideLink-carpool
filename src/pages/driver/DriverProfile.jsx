import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import Toast from "../../components/Toast";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function DriverProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // upload state
  const [licenseFile, setLicenseFile] = useState(null);
  const [vehiclePaperFile, setVehiclePaperFile] = useState(null);
  const [idProofFile, setIdProofFile] = useState(null);
  const [vehicleNumberInput, setVehicleNumberInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (m, t = "success") => {
    setToast({ show: true, message: m, type: t });
    setTimeout(() => setToast({ show: false }), 2500);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const email = localStorage.getItem("email");
    if (!email) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/driver/profile?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setUser(data);
      setVehicleNumberInput(data?.vehicleNumber || "");
    } catch (err) {
      showToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const docLink = (doc) => (doc ? `${BACKEND_URL}${doc.url}` : null);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!licenseFile && !vehiclePaperFile && !idProofFile && !vehicleNumberInput) {
      return showToast("Select files or update vehicle number", "error");
    }

    // require all files to set status to pending (but allow partial upload - user can upload later)
    const fd = new FormData();
    fd.append("email", user.email);
    if (vehicleNumberInput) fd.append("vehicleNumber", vehicleNumberInput);
    if (licenseFile) fd.append("license", licenseFile);
    if (vehiclePaperFile) fd.append("vehiclePaper", vehiclePaperFile);
    if (idProofFile) fd.append("idProof", idProofFile);

    try {
      setUploading(true);
      const res = await fetch(`${BACKEND_URL}/api/driver/upload-docs`, {
        method: "POST",
        body: fd
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data?.message || "Upload failed", "error");
      } else {
        showToast("Files uploaded successfully", "success");
        // refresh profile
        await loadProfile();
        // clear file inputs
        setLicenseFile(null);
        setVehiclePaperFile(null);
        setIdProofFile(null);
      }
    } catch (err) {
      showToast("Upload error", "error");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Navbar userRole="driver" />
        <div className="p-8">Loading profile...</div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-container">
        <Navbar userRole="driver" />
        <div className="p-8">No profile found. Please login.</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-container flex flex-col">
      <Navbar userRole="driver" />

      <div className="flex flex-1">
        <Sidebar userRole="driver" />

        <main className="flex-1 p-6 lg:p-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-4">Driver Profile</h1>

            {/* Verification status */}
            <div className="card mb-4 p-4">
              <h3 className="font-semibold">Verification Status</h3>
              <p className="mt-2">
                {user.verificationStatus === "not_verified" && <span className="text-yellow-600">Not Verified</span>}
                {user.verificationStatus === "pending" && <span className="text-indigo-600">Pending (under review)</span>}
                {user.verificationStatus === "verified" && <span className="text-green-600">Verified</span>}
                {user.verificationStatus === "disapproved" && <span className="text-red-600">Disapproved</span>}
              </p>

              {user.verificationStatus !== "verified" && (
                <p className="mt-3 text-sm text-muted-foreground">
                  You cannot add rides until your account is verified. Upload required documents below.
                </p>
              )}
            </div>

            {/* Personal Info */}
            <div className="card mb-4 p-4">
              <h3 className="font-semibold mb-2">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-2">
                <div><strong>Name:</strong> {user.name}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Phone:</strong> {user.phone || '-'}</div>
                <div><strong>Vehicle Number:</strong> {user.vehicleNumber || '-'}</div>
              </div>
            </div>

            {/* Documents display */}
            <div className="card mb-6 p-4">
              <h3 className="font-semibold mb-3">Documents</h3>

              <div className="space-y-3">
                <div>
                  <strong>Driving License:</strong>
                  {user.documents?.license ? (
                    <div className="mt-1">
                      <a href={docLink(user.documents.license)} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        View / Download
                      </a>
                    </div>
                  ) : (
                    <div className="text-muted-foreground mt-1">Not uploaded</div>
                  )}
                </div>

                <div>
                  <strong>Vehicle Paper:</strong>
                  {user.documents?.vehiclePaper ? (
                    <div className="mt-1">
                      <a href={docLink(user.documents.vehiclePaper)} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        View / Download
                      </a>
                    </div>
                  ) : (
                    <div className="text-muted-foreground mt-1">Not uploaded</div>
                  )}
                </div>

                <div>
                  <strong>ID Proof (Aadhar):</strong>
                  {user.documents?.idProof ? (
                    <div className="mt-1">
                      <a href={docLink(user.documents.idProof)} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        View / Download
                      </a>
                    </div>
                  ) : (
                    <div className="text-muted-foreground mt-1">Not uploaded</div>
                  )}
                </div>
              </div>
            </div>

            {/* Upload form */}
            <div className="card p-4">
              <h3 className="font-semibold mb-2">Upload / Update Documents</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Upload all three documents to move your status to <strong>Pending</strong>. Files allowed: JPG, PNG, PDF. (You may skip and upload later.)
              </p>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Vehicle Number</label>
                  <input
                    className="input-field"
                    placeholder="Enter vehicle number"
                    value={vehicleNumberInput}
                    onChange={(e) => setVehicleNumberInput(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Driving License (jpg/png/pdf)</label>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={(e) => setLicenseFile(e.target.files[0] || null)}
                  />
                  {licenseFile && <div className="text-sm mt-1">Selected: {licenseFile.name}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Vehicle Paper (jpg/png/pdf)</label>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={(e) => setVehiclePaperFile(e.target.files[0] || null)}
                  />
                  {vehiclePaperFile && <div className="text-sm mt-1">Selected: {vehiclePaperFile.name}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">ID Proof (Aadhar) (jpg/png/pdf)</label>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={(e) => setIdProofFile(e.target.files[0] || null)}
                  />
                  {idProofFile && <div className="text-sm mt-1">Selected: {idProofFile.name}</div>}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      // clear chosen files
                      setLicenseFile(null);
                      setVehiclePaperFile(null);
                      setIdProofFile(null);
                      setVehicleNumberInput(user?.vehicleNumber || "");
                    }}
                    className="btn-secondary"
                  >
                    Reset
                  </button>

                  <button type="submit" disabled={uploading} className="btn-primary">
                    {uploading ? "Uploading..." : "Upload Documents"}
                  </button>
                </div>
              </form>
            </div>

          </motion.div>
        </main>
      </div>

      <Footer />
      <Toast message={toast.message} type={toast.type} isVisible={toast.show} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}