import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import StatCard from '../../components/StatCard';

const AdminDashboard = () => {
  const quickLinks = [
    { name: 'Verify Drivers', path: '/admin/driver-verification', icon: '✓' },
    { name: 'View Reports', path: '/admin/reports', icon: '📈' },
  ];

  return (
    <div className="page-container flex flex-col">
      <Navbar userRole="admin" />
      
      <div className="flex flex-1">
        <Sidebar userRole="admin" />
        
        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mb-8">
              System overview and management
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Users" value="1,247" icon="👥" />
              <StatCard title="Active Rides" value="58" icon="🚗" />
              <StatCard title="Verified Drivers" value="423" />
              <StatCard title="Total Revenue" value="$52,340" icon="💰" />
            </div>

            {/* Quick Actions */}
            <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

            {/* Recent Activity */}
            <h2 className="text-2xl font-bold text-foreground mb-6">Recent Activity</h2>
            <div className="dashboard-card">
              <div className="space-y-4">
                {[
                  { action: 'New driver registration', user: 'John Smith', time: '5 min ago' },
                  { action: 'Ride completed', user: 'Sarah Johnson', time: '15 min ago' },
                  { action: 'Payment processed', user: 'Mike Wilson', time: '1 hour ago' },
                  { action: 'Driver verified', user: 'Admin Team', time: '2 hours ago' },
                ].map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.user}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{activity.time}</div>
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

export default AdminDashboard;
