import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import { fetchDashboardStats } from '../services/dashboardService';
import { fetchRecentCourses } from '../services/courseService';

// Import icons
const BookOpenIcon = getIcon('book-open');
const UsersIcon = getIcon('users');
const CalendarIcon = getIcon('calendar');
const ClipboardListIcon = getIcon('clipboard-list');

const Dashboard = () => {
  // Dashboard stats
  const [stats, setStats] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // User info from Redux
  const user = useSelector((state) => state.user.user);
  const userRole = user?.role || 'User';

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsData, coursesData] = await Promise.all([
          fetchDashboardStats(),
          fetchRecentCourses(4) // Limit to 4 recent courses
        ]);
        
        setStats(statsData);
        setRecentCourses(coursesData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  // Function to handle viewing a course
  const handleViewCourse = (courseId) => {
    toast.info(`Viewing course details for ${courseId}`);
    // In a real implementation, navigate to course details page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard header */}
      <div className="mb-8">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard
        </motion.h2>
        <p className="text-surface-600 dark:text-surface-400">
          Welcome back, <span className="font-semibold">{user?.firstName || userRole}</span>
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          // Show skeleton loaders when loading
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="h-16 bg-surface-200 dark:bg-surface-700 rounded-lg"></div>
            </div>
          ))
        ) : (
          stats.map((stat) => {
            // Dynamically get the icon component
            const IconComponent = getIcon(stat.icon);
            
            return (
              <motion.div
                key={stat.id}
                className="card flex items-center p-5 hover:shadow-lg dark:hover:shadow-surface-800/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: stat.id * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`${stat.color} p-3 rounded-xl mr-4`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-surface-600 dark:text-surface-400 text-sm">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold">
                    {stat.value}
                  </h3>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Main feature */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Course Management</h3>
        <MainFeature />
      </div>

      {/* Recent courses section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Recent Courses</h3>
          <button 
            className="btn btn-outline text-sm"
            onClick={() => toast.info("View all courses functionality would go here")}
          >
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading ? (
            // Show skeleton loaders when loading
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="h-24 bg-surface-200 dark:bg-surface-700 rounded-lg mb-3"></div>
                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            recentCourses.map((course) => (
              <motion.div 
                key={course.id}
                className="card hover:shadow-lg dark:hover:shadow-surface-800/50 transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-1 bg-primary/10 text-primary dark:text-primary-light rounded text-xs font-medium">
                    {course.course_id}
                  </span>
                  <span className="flex items-center text-surface-600 dark:text-surface-400 text-sm">
                    <UsersIcon className="h-4 w-4 mr-1" />
                    {course.studentCount || 0}
                  </span>
                </div>
                <h4 className="font-semibold mb-2">{course.Name}</h4>
                <p className="text-surface-600 dark:text-surface-400 text-sm mb-4">
                  {course.instructor}
                </p>
                <button 
                  className="text-primary dark:text-primary-light text-sm font-medium hover:underline"
                  onClick={() => handleViewCourse(course.course_id)}
                >
                  View Details
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;