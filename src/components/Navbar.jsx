import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Navbar = ({ userRole }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const getRoleLinks = () => {
    switch (userRole) {
      case 'rider':
        return [
          { name: 'Dashboard', path: '/rider/dashboard' },
          { name: 'Search Ride', path: '/rider/search-ride' },
          { name: 'My Bookings', path: '/rider/track-ride' },
        ];
      case 'driver':
        return [
          { name: 'Dashboard', path: '/driver/dashboard' },
          { name: 'Add Ride', path: '/driver/add-ride' },
          { name: 'My Rides', path: '/driver/my-rides' },
          { name: 'Profile', path: '/driver/profile' },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard' },
          { name: 'Verify Drivers', path: '/admin/driver-verification' },
          { name: 'Reports', path: '/admin/reports' },
        ];
      default:
        return [];
    }
  };

  const links = getRoleLinks();

  return (
    <motion.nav className="bg-card shadow-md top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚗</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                RideLink
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-secondary"
              >
                {link.name}
              </Link>
            ))}
            {userRole ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="btn-outline"
              >
                Logout
              </motion.button>
            ) : (
              <>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-outline"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                  >
                    Register
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground hover:text-primary p-2">
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"
                stroke="currentColor">
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block text-foreground hover:text-primary py-2 px-4 rounded-lg hover:bg-secondary"
                onClick={() => setMobileMenuOpen(false)}>
                {link.name}
              </Link>
            ))}
            {userRole ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-foreground hover:text-primary py-2 px-4 rounded-lg hover:bg-secondary">
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-foreground hover:text-primary py-2 px-4 rounded-lg hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-foreground hover:text-primary py-2 px-4 rounded-lg hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
