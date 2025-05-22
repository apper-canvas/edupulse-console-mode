import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

// Get icon component
const AlertTriangleIcon = getIcon('alert-triangle');
const HomeIcon = getIcon('home');

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div 
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 flex justify-center">
          <motion.div 
            className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400"
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <AlertTriangleIcon className="h-12 w-12" />
          </motion.div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-2">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <motion.button
          className="btn btn-primary inline-flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
        >
          <HomeIcon className="w-4 h-4" />
          <span>Back to Home</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;