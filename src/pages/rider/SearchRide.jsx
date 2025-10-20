import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Card from '../../components/Card';

const SearchRide = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    pickup: '',
    destination: '',
    date: '',
    time: '',
    seats: 1,
  });
  const [showResults, setShowResults] = useState(false);

  const mockRides = [
    {
      id: 1,
      driver: 'John Smith',
      vehicle: 'Toyota Camry',
      fare: 25,
      seatsLeft: 3,
      rating: 4.8,
      departureTime: '09:00 AM',
    },
    {
      id: 2,
      driver: 'Sarah Johnson',
      vehicle: 'Honda Accord',
      fare: 22,
      seatsLeft: 2,
      rating: 4.9,
      departureTime: '09:30 AM',
    },
    {
      id: 3,
      driver: 'Mike Wilson',
      vehicle: 'Tesla Model 3',
      fare: 30,
      seatsLeft: 1,
      rating: 5.0,
      departureTime: '10:00 AM',
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setShowResults(true);
  };

  const handleBookRide = (rideId) => {
    navigate('/rider/book-ride', { state: { rideId } });
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
              Search for a Ride 🔍
            </h1>
            <p className="text-muted-foreground mb-8">
              Find the perfect ride for your journey
            </p>

            {/* Search Form */}
            <div className="dashboard-card mb-8">
              <form onSubmit={handleSearch} className="space-y-4">
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
                      value={searchData.pickup}
                      onChange={(e) =>
                        setSearchData({ ...searchData, pickup: e.target.value })
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
                      value={searchData.destination}
                      onChange={(e) =>
                        setSearchData({ ...searchData, destination: e.target.value })
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
                      value={searchData.date}
                      onChange={(e) =>
                        setSearchData({ ...searchData, date: e.target.value })
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
                      value={searchData.time}
                      onChange={(e) =>
                        setSearchData({ ...searchData, time: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Number of Seats
                    </label>
                    <select
                      className="input-field"
                      value={searchData.seats}
                      onChange={(e) =>
                        setSearchData({ ...searchData, seats: parseInt(e.target.value) })
                      }
                    >
                      {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'seat' : 'seats'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn-primary w-full md:w-auto"
                >
                  Search Rides
                </motion.button>
              </form>
            </div>

            {/* Search Results */}
            {showResults && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Available Rides ({mockRides.length})
                </h2>
                <div className="space-y-4">
                  {mockRides.map((ride) => (
                    <Card key={ride.id}>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-2xl">
                              👤
                            </div>
                            <div>
                              <h3 className="font-bold text-foreground text-lg">
                                {ride.driver}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {ride.vehicle} • {ride.departureTime}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">
                              ⭐ {ride.rating}
                            </span>
                            <span className="text-muted-foreground">
                              🪑 {ride.seatsLeft} seats left
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="text-3xl font-bold text-primary">
                            ${ride.fare}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleBookRide(ride.id)}
                            className="btn-primary"
                          >
                            Book Ride
                          </motion.button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default SearchRide;
