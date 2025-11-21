import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';

const MyRides = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const myRides = [
    {
      id: 1,
      route: 'Downtown Station → Airport',
      date: '2025-01-20',
      time: '09:00 AM',
      seats: 3,
      bookedSeats: 2,
      fare: 25,
      status: 'Upcoming',
      requests: [
        { id: 1, rider: 'Alice Johnson', seats: 1, status: 'Pending' },
      ],
    },
    {
      id: 2,
      route: 'Mall Plaza → University',
      date: '2025-01-18',
      time: '02:00 PM',
      seats: 4,
      bookedSeats: 4,
      fare: 15,
      status: 'Completed',
      requests: [],
    },
  ];

  const handleAcceptRequest = () => {
    setShowModal(false);
    setToast({
      show: true,
      message: 'Booking request accepted!',
      type: 'success',
    });
  };

  const handleRejectRequest = () => {
    setShowModal(false);
    setToast({
      show: true,
      message: 'Booking request rejected',
      type: 'warning',
    });
  };

  const handleCompleteRide = (rideId) => {
    setToast({
      show: true,
      message: 'Ride marked as completed!',
      type: 'success',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-500 text-white';
      case 'Completed':
        return 'bg-green-500 text-white';
      case 'In Progress':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="page-container flex flex-col">
      <Navbar userRole="driver" />
      
      <div className="flex flex-1">
        <Sidebar userRole="driver" />
        
        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-2">
              My Rides 🚗
            </h1>
            <p className="text-muted-foreground mb-8">
              Manage your offered rides and bookings
            </p>

            <div className="space-y-4">
              {myRides.map((ride) => (
                <Card key={ride.id}>
                  <div className="space-y-4">
                    {/* Ride Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {ride.route}
                        </h3>
                        <p className="text-muted-foreground">
                          {ride.date} • {ride.time}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ₹{getStatusColor(
                          ride.status
                        )}`}
                      >
                        {ride.status}
                      </span>
                    </div>

                    {/* Ride Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Seats</p>
                        <p className="font-bold text-foreground">{ride.seats}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Booked</p>
                        <p className="font-bold text-foreground">{ride.bookedSeats}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fare/Seat</p>
                        <p className="font-bold text-primary">₹{ride.fare}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Earnings</p>
                        <p className="font-bold text-primary">
                          ₹{ride.fare * ride.bookedSeats}
                        </p>
                      </div>
                    </div>

                    {/* Pending Requests */}
                    {ride.requests.length > 0 && (
                      <div>
                        <h4 className="font-bold text-foreground mb-3">
                          Pending Requests ({ride.requests.length})
                        </h4>
                        <div className="space-y-2">
                          {ride.requests.map((request) => (
                            <div
                              key={request.id}
                              className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                  👤
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground">
                                    {request.rider}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Requested {request.seats} seat(s)
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setShowModal(true);
                                  }}
                                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                  Accept
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={handleRejectRequest}
                                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                  Reject
                                </motion.button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {ride.status === 'Upcoming' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCompleteRide(ride.id)}
                        className="btn-primary w-full md:w-auto"
                      >
                        Mark as Completed
                      </motion.button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        </main>
      </div>

      <Footer />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Accept Booking Request"
      >
        <div className="py-4">
          <p className="text-foreground mb-6">
            Are you sure you want to accept this booking request from{' '}
            {selectedRequest?.rider}?
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
              onClick={handleAcceptRequest}
              className="btn-primary flex-1"
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

export default MyRides;
