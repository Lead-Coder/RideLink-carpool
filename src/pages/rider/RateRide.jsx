import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Card from '../../components/Card';
import Toast from '../../components/Toast';

const RateRide = () => {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [ratings, setRatings] = useState({});
  const [feedback, setFeedback] = useState({});

  const completedRides = [
    {
      id: 1,
      driver: 'Vinod Kumar',
      vehicle: 'Honda Accord',
      route: 'Mall Plaza → University Campus',
      date: '2025-01-18',
      fare: 15,
    },
    {
      id: 2,
      driver: 'Harsh Patel',
      vehicle: 'Ford Focus',
      route: 'Downtown → Shopping Center',
      date: '2025-01-15',
      fare: 20,
    },
  ];

  const handleRatingClick = (rideId, rating) => {
    setRatings({ ...ratings, [rideId]: rating });
  };

  const handleSubmitRating = (rideId) => {
    if (!ratings[rideId]) {
      setToast({
        show: true,
        message: 'Please select a rating',
        type: 'warning',
      });
      return;
    }

    setToast({
      show: true,
      message: 'Thank you for your feedback!',
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
              Rate Your Rides
            </h1>
            <p className="text-muted-foreground mb-8">
              Help us improve by rating your recent experiences
            </p>

            <div className="space-y-6">
              {completedRides.map((ride) => (
                <Card key={ride.id}>
                  <div className="space-y-4">
                    {/* Ride Info */}
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {ride.route}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Driver: {ride.driver}</span>
                        <span>•</span>
                        <span>{ride.vehicle}</span>
                        <span>•</span>
                        <span>{ride.date}</span>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Rate your experience
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRatingClick(ride.id, star)}
                            className="text-4xl transition-all"
                          >
                            {star <= (ratings[ride.id] || 0) ? '⭐' : '☆'}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Feedback */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Additional feedback (optional)
                      </label>
                      <textarea
                        className="input-field min-h-[100px] resize-none"
                        placeholder="Share your experience..."
                        value={feedback[ride.id] || ''}
                        onChange={(e) =>
                          setFeedback({ ...feedback, [ride.id]: e.target.value })
                        }
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSubmitRating(ride.id)}
                      className="btn-primary"
                    >
                      Submit Rating
                    </motion.button>
                  </div>
                </Card>
              ))}

              {completedRides.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-xl text-muted-foreground">
                    No completed rides to rate yet
                  </p>
                </div>
              )}
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

export default RateRide;
