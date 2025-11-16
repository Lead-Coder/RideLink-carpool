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

  // You can switch to fetching rides from backend later. For now these match your UI.
  const mockRides = [
    {
      id: 'r1',
      driver: 'Sameer Shah',
      vehicle: 'Toyota',
      fare: 25,
      seatsLeft: 3,
      rating: 4.8,
      departureTime: '09:00',
      driverID: 'driver_john_1',
      vehicleID: 'veh_101',
    },
    {
      id: 'r2',
      driver: 'Ramesh Mehta',
      vehicle: 'Honda Accord',
      fare: 22,
      seatsLeft: 2,
      rating: 4.9,
      departureTime: '09:30',
      driverID: 'driver_sarah_2',
      vehicleID: 'veh_102',
    },
    {
      id: 'r3',
      driver: 'Raj Gandhi',
      vehicle: 'Hundai Verna',
      fare: 30,
      seatsLeft: 1,
      rating: 5.0,
      departureTime: '10:00',
      driverID: 'driver_mike_3',
      vehicleID: 'veh_103',
    },
  ];

  // state for selected ride and booking panel
  const [selectedRide, setSelectedRide] = useState(null);
  const [bookingData, setBookingData] = useState({
    pickupLocation: '',
    dropLocation: '',
    seatsBooked: 1,
    dateTime: '',
    userId: 'rider_sample_1', // replace with actual logged in user id from auth
  });
  const [bookingStatus, setBookingStatus] = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowResults(true);
  };

  // when user clicks Book Ride
  const handleBookRide = (ride) => {
    setSelectedRide(ride);
    setBookingData({
      ...bookingData,
      pickupLocation: searchData.pickup || '',
      dropLocation: searchData.destination || '',
      seatsBooked: Math.min(searchData.seats || 1, ride.seatsLeft),
      dateTime: `${searchData.date || ''} ${searchData.time || ride.departureTime}`,
      userId: bookingData.userId,
    });
    setBookingStatus(null);
    // keep user on same page, show booking card to right or below
  };

  // send booking to backend
  const confirmBooking = async () => {
    if (!selectedRide) return;
    setLoadingBooking(true);
    setBookingStatus(null);

    // Build booking payload matching backend schema
    const payload = {
      rideId: selectedRide.id,
      rideInfo: {
        driver: selectedRide.driver,
        driverID: selectedRide.driverID,
        vehicle: selectedRide.vehicle,
        vehicleID: selectedRide.vehicleID,
        fare: selectedRide.fare,
      },
      pickupLocation: bookingData.pickupLocation,
      dropLocation: bookingData.dropLocation,
      dateTime: bookingData.dateTime,
      seatCount: bookingData.seatsBooked,
      status: 'Pending', 
      userId: bookingData.userId,
      amount: selectedRide.fare * bookingData.seatsBooked,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to create booking.');
      }

      const created = await res.json();
      setBookingStatus({
        success: true,
        message: `Booking confirmed. Booking ID: ${created._id}`,
        booking: created,
      });

      // Optionally reduce seatsLeft locally so user sees immediate update
      setSelectedRide((prev) => prev ? { ...prev, seatsLeft: prev.seatsLeft - bookingData.seatsBooked } : prev);
    } catch (err) {
      setBookingStatus({ success: false, message: err.message || 'Booking failed' });
    } finally {
      setLoadingBooking(false);
    }
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
              Search for a Ride
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

            {/* Search Results + Booking panel layout */}
            {showResults && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Available Rides ({mockRides.length})
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                              ₹{ride.fare}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleBookRide(ride)}
                              className="btn-primary"
                            >
                              Book Ride
                            </motion.button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Booking panel on the right column */}
                  <div>
                    {selectedRide ? (
                      <Card>
                        <h3 className="text-lg font-bold text-foreground mb-3">
                          Booking: {selectedRide.driver} • {selectedRide.vehicle}
                        </h3>

                        <div className="space-y-3">
                          <div className="text-sm text-muted-foreground">
                            Departure time: {selectedRide.departureTime}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Pickup Location
                            </label>
                            <input
                              className="input-field"
                              value={bookingData.pickupLocation}
                              onChange={(e) =>
                                setBookingData({ ...bookingData, pickupLocation: e.target.value })
                              }
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Drop Location
                            </label>
                            <input
                              className="input-field"
                              value={bookingData.dropLocation}
                              onChange={(e) =>
                                setBookingData({ ...bookingData, dropLocation: e.target.value })
                              }
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Seats
                            </label>
                            <select
                              className="input-field"
                              value={bookingData.seatsBooked}
                              onChange={(e) =>
                                setBookingData({ ...bookingData, seatsBooked: parseInt(e.target.value) })
                              }
                            >
                              {Array.from({ length: Math.min(4, selectedRide.seatsLeft) }, (_, i) => i + 1).map((n) => (
                                <option key={n} value={n}>
                                  {n} {n === 1 ? 'seat' : 'seats'}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Date and time
                            </label>
                            <input
                              className="input-field"
                              value={bookingData.dateTime}
                              onChange={(e) =>
                                setBookingData({ ...bookingData, dateTime: e.target.value })
                              }
                            />
                          </div>

                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={confirmBooking}
                              className="btn-primary"
                              disabled={loadingBooking}>
                              {loadingBooking ? 'Booking...' : 'Confirm Booking'}
                            </button>

                            <button
                              onClick={() => alert('Make Payment Module is scheduled for later')}
                              className="btn-secondary">
                              Make Payment
                            </button>

                            <button
                              onClick={() => alert('Track Ride Module is coming shortly')}
                              className="btn-secondary">
                              Track Ride
                            </button>
                          </div>

                          <div className="mt-3">
                            <div className="text-sm text-muted-foreground">
                              Fare per seat: ₹{selectedRide.fare}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Total: ₹{selectedRide.fare * bookingData.seatsBooked}
                            </div>
                          </div>

                          {bookingStatus && (
                            <div className={`mt-3 p-3 rounded ${bookingStatus.success ? 'bg-green-100' : 'bg-red-100'}`}>
                              <div className="font-medium">{bookingStatus.message}</div>
                              {bookingStatus.booking && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  Booking saved at {new Date(bookingStatus.booking.createdAt).toLocaleString()}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </Card>
                    ) : (
                      <Card>
                        <div className="text-center text-muted-foreground">
                          Select a ride to open the booking panel
                        </div>
                      </Card>
                    )}
                  </div>
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
