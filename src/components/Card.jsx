import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -5, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' } : {}}
      className={`dashboard-card ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
