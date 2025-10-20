import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const Toast = ({ message, type = 'success', isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className={`${getStyles()} px-6 py-4 rounded-xl shadow-lg flex items-center space-x-3 min-w-[300px]`}>
            <span className="text-xl">
              {type === 'success' && '✓'}
              {type === 'error' && '✗'}
              {type === 'warning' && '⚠'}
            </span>
            <p className="font-medium">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
