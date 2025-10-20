import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = ({ userRole }) => {
  const location = useLocation();

  const getRoleLinks = () => {
    switch (userRole) {
      case 'rider':
        return [
          { name: 'Dashboard', path: '/rider/dashboard', icon: '📊' },
          { name: 'Search Ride', path: '/rider/search-ride', icon: '🔍' },
          { name: 'My Bookings', path: '/rider/track-ride', icon: '📋' },
          { name: 'Rate Rides', path: '/rider/rate-ride', icon: '⭐' },
        ];
      case 'driver':
        return [
          { name: 'Dashboard', path: '/driver/dashboard', icon: '📊' },
          { name: 'Add Ride', path: '/driver/add-ride', icon: '➕' },
          { name: 'My Rides', path: '/driver/my-rides', icon: '🚗' },
          { name: 'Profile', path: '/driver/profile', icon: '👤' },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
          { name: 'Verify Drivers', path: '/admin/driver-verification', icon: '✓' },
          { name: 'Reports', path: '/admin/reports', icon: '📈' },
        ];
      default:
        return [];
    }
  };

  const links = getRoleLinks();

  return (
      <div className="p-6 shadow-md">
        <h2 className="text-xl font-bold text-foreground mb-6 capitalize">
          {userRole} Menu
        </h2>
        <nav className="space-y-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span className="font-medium">{link.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>
  );
};

export default Sidebar;
