import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';

const TrackRide = () => {
  const [selectedRide, setSelectedRide] = useState(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const myBookings = [
    {
      id: 1,
      driver: 'John Smith',
      vehicle: 'Toyota Camry',
      pickup: 'Downtown Station',
      destination: 'Airport Terminal',
      status: 'In Progress',
      fare: 25,
      date: '2025-01-20',
      time: '09:00 AM',
    },
    {
      id: 2,
      driver: 'Sarah Johnson',
      vehicle: 'Honda Accord',
      pickup: 'Mall Plaza',
      destination: 'University Campus',
      status: 'Completed',
      fare: 15,
      date: '2025-01-18',
      time: '02:00 PM',
    },
    {
      id: 3,
      driver: 'Mike Wilson',
      vehicle: 'Tesla Model 3',
      pickup: 'Central Park',
      destination: 'Beach Resort',
      status: 'Upcoming',
      fare: 40,
      date: '2025-01-25',
      time: '11:00 AM',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-500 text-white';
      case 'Completed':
        return 'bg-green-500 text-white';
      case 'Upcoming':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleEndRide = () => {
    setShowEndModal(false);
    setToast({
      show: true,
      message: 'Ride completed successfully!',
      type: 'success',
    });
  };

  return (
    <div className="page-container flex flex-col">
      <Navbar userRole="rider" />
      
      <div className="flex flex-1">
        <Sidebar userRole="rider" />
        
        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-2">
              My Bookings 📋
            </h1>
            <p className="text-muted-foreground mb-8">
              Track and manage all your rides
            </p>

            <div className="space-y-4">
              {myBookings.map((booking) => (
                <Card key={booking.id}>
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-1">
                            {booking.pickup} → {booking.destination}
                          </h3>
                          <p className="text-muted-foreground">
                            Driver: {booking.driver} • {booking.vehicle}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Date:</span>
                          <span className="ml-2 text-foreground font-medium">
                            {booking.date}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time:</span>
                          <span className="ml-2 text-foreground font-medium">
                            {booking.time}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Fare:</span>
                          <span className="ml-2 text-primary font-bold">
                            ${booking.fare}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:w-48">
                      {booking.status === 'In Progress' && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedRide(booking)}
                            className="btn-primary w-full"
                          >
                            Track Live
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedRide(booking);
                              setShowEndModal(true);
                            }}
                            className="btn-secondary w-full"
                          >
                            End Ride
                          </motion.button>
                        </>
                      )}
                      {booking.status === 'Upcoming' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn-outline w-full"
                        >
                          View Details
                        </motion.button>
                      )}
                      {booking.status === 'Completed' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn-outline w-full"
                        >
                          Rate Ride
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Live Tracking View */}
                  {selectedRide?.id === booking.id && booking.status === 'In Progress' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 pt-6 border-t border-border"
                    >
                      <h4 className="font-bold text-foreground mb-4">Live Tracking</h4>
                      <div className="bg-secondary rounded-lg p-6 text-center">
                        <div className="text-6xl mb-4">🗺️</div>
                        <p className="text-muted-foreground">
                          Map view would be displayed here
                        </p>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm text-foreground">
                              Driver is 5 minutes away
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Contact: +1 234 567 8900
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </Card>
              ))}
            </div>
          </motion.div>
        </main>
      </div>

      <Footer />

      <Modal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        title="End Ride"
      >
        <div className="py-4">
          <p className="text-foreground mb-6">
            Are you sure you want to end this ride? This action cannot be undone.
          </p>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEndModal(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEndRide}
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

export default TrackRide;
