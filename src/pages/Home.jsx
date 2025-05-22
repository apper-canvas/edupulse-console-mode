import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-6 text-primary dark:text-primary-light"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to EduPulse
        </motion.h1>
        
        <motion.p 
          className="text-xl mb-8 text-surface-600 dark:text-surface-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          The comprehensive educational management system for institutions
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link to="/login" className="btn btn-primary px-8 py-3">
            Sign In
          </Link>
          <Link to="/signup" className="btn btn-outline px-8 py-3">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;