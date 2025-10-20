import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color = 'primary' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="dashboard-card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`text-5xl opacity-80`}>{icon}</div>
      </div>
    </motion.div>
  );
};

export default StatCard;
