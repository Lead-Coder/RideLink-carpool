import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';

const BookRide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rideId = location.state?.rideId;

  // Mock ride details
  const rideDetails = {
    driver: 'Vinay Agarwal',
    vehicle: 'Toyota Camry',
    fare: 25,
    seats: 1,
    pickup: 'Home',
    destination: 'Airport Terminal',
    date: '2025-01-20',
    time: '09:00 AM',
    rating: 4.8,
  };

  const handleConfirmBooking = () => {
    navigate('/rider/payment', { state: { rideDetails } });
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
              Confirm Booking 🎫
            </h1>
            <p className="text-muted-foreground mb-8">
              Review your ride details before booking
            </p>

            <div className="max-w-2xl">
              <div className="dashboard-card mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Ride Details
                </h2>

                <div className="space-y-6">
                  {/* Driver Info */}
                  <div className="flex items-center gap-4 pb-6 border-b border-border">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-3xl">
                      👤
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-xl">
                        {rideDetails.driver}
                      </h3>
                      <p className="text-muted-foreground">
                        {rideDetails.vehicle}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ⭐ Rating: {rideDetails.rating}/5.0
                      </p>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pickup:</span>
                      <span className="font-semibold text-foreground">
                        {rideDetails.pickup}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Destination:</span>
                      <span className="font-semibold text-foreground">
                        {rideDetails.destination}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-semibold text-foreground">
                        {rideDetails.date}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-semibold text-foreground">
                        {rideDetails.time}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Seats:</span>
                      <span className="font-semibold text-foreground">
                        {rideDetails.seats}
                      </span>
                    </div>
                  </div>

                  {/* Fare */}
                  <div className="pt-6 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold text-foreground">
                        Total Fare:
                      </span>
                      <span className="text-4xl font-bold text-primary">
                        ₹{rideDetails.fare}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(-1)}
                  className="btn-secondary flex-1"
                >
                  Go Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmBooking}
                  className="btn-primary flex-1"
                >
                  Proceed to Payment
                </motion.button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default BookRide;
