import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';

const AddRide = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [rideData, setRideData] = useState({
    pickup: '',
    destination: '',
    date: '',
    time: '',
    seats: 1,
    fare: '',
    vehicleNumber: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setToast({
      show: true,
      message: 'Ride added successfully!',
      type: 'success',
    });
    setTimeout(() => {
      navigate('/driver/my-rides');
    }, 1500);
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
              Add New Ride ➕
            </h1>
            <p className="text-muted-foreground mb-8">
              Offer a ride and start earning
            </p>

            <div className="max-w-2xl">
              <div className="dashboard-card">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Pickup Location
                      </label>
                      <input
                        type="text"
                        required
                        className="input-field"
                        placeholder="Enter pickup location"
                        value={rideData.pickup}
                        onChange={(e) =>
                          setRideData({ ...rideData, pickup: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Destination
                      </label>
                      <input
                        type="text"
                        required
                        className="input-field"
                        placeholder="Enter destination"
                        value={rideData.destination}
                        onChange={(e) =>
                          setRideData({ ...rideData, destination: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        className="input-field"
                        value={rideData.date}
                        onChange={(e) =>
                          setRideData({ ...rideData, date: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        required
                        className="input-field"
                        value={rideData.time}
                        onChange={(e) =>
                          setRideData({ ...rideData, time: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Available Seats
                      </label>
                      <select
                        className="input-field"
                        value={rideData.seats}
                        onChange={(e) =>
                          setRideData({ ...rideData, seats: parseInt(e.target.value) })
                        }
                      >
                        {[1, 2, 3, 4].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'seat' : 'seats'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Fare per Seat ($)
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        className="input-field"
                        placeholder="20"
                        value={rideData.fare}
                        onChange={(e) =>
                          setRideData({ ...rideData, fare: e.target.value })
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Vehicle Number
                      </label>
                      <input
                        type="text"
                        required
                        className="input-field"
                        placeholder="ABC-1234"
                        value={rideData.vehicleNumber}
                        onChange={(e) =>
                          setRideData({ ...rideData, vehicleNumber: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => navigate(-1)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="btn-primary flex-1"
                    >
                      Add Ride
                    </motion.button>
                  </div>
                </form>
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

export default AddRide;
