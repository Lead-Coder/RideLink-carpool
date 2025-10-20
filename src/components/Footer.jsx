import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card border-t border-border mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-xl">🚗</span>
            </div>
            <span className="text-lg font-semibold text-foreground">
              RideLink Carpooling
            </span>
          </div>
          
          <div className="text-muted-foreground text-sm text-center">
            © 2025 Carpooling Management System. Built by Prathmesh and Madhukar
          </div>

          <div className="flex space-x-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
