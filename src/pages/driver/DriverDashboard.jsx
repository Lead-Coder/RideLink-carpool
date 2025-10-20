import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import StatCard from '../../components/StatCard';

const DriverDashboard = () => {
  const quickLinks = [
    { name: 'Add New Ride', path: '/driver/add-ride', icon: '➕', color: 'bg-blue-100' },
    { name: 'My Rides', path: '/driver/my-rides', icon: '🚗', color: 'bg-green-100' },
    { name: 'Profile', path: '/driver/profile', icon: '👤', color: 'bg-purple-100' },
  ];

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
              Driver Dashboard 🚗
            </h1>
            <p className="text-muted-foreground mb-8">
              Manage your rides and earnings
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard title="Total Rides Offered" value="42" icon="🚗" />
              <StatCard title="Active Rides" value="3" icon="📍" />
              <StatCard title="Average Rating" value="4.8" icon="⭐" />
            </div>

            {/* Quick Links */}
            <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {quickLinks.map((link, index) => (
                <Link key={index} to={link.path}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="dashboard-card cursor-pointer"
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">{link.icon}</div>
                      <h3 className="text-xl font-bold text-foreground">{link.name}</h3>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Recent Rides */}
            <h2 className="text-2xl font-bold text-foreground mb-6">Active Rides</h2>
            <div className="dashboard-card">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-foreground">Downtown to Airport</p>
                      <p className="text-sm text-muted-foreground">3 bookings • 2025-01-20</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">$75</p>
                      <p className="text-sm text-muted-foreground">Upcoming</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DriverDashboard;
