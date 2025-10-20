import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false }) => {
  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-background bg-opacity-90 z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClass}>
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
      />
    </div>
  );
};

export default Loader;
