import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

// Import icons
const BookOpenIcon = getIcon('book-open');
const UsersIcon = getIcon('users');
const CalendarIcon = getIcon('calendar');
const ClipboardListIcon = getIcon('clipboard-list');
const ChartIcon = getIcon('bar-chart-2');

const Home = () => {
  // Dashboard stats
  const [stats] = useState([
    { 
      id: 1, 
      title: 'Active Courses', 
      value: 24, 
      icon: 'book-open', 
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
    },
    { 
      id: 2, 
      title: 'Total Students', 
      value: 1250, 
      icon: 'users', 
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
    },
    { 
      id: 3, 
      title: 'Upcoming Exams', 
      value: 8, 
      icon: 'calendar', 
      color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
    },
    { 
      id: 4, 
      title: 'Assignments Due', 
      value: 16, 
      icon: 'clipboard-list', 
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
    }
  ]);

  // Recent courses for quick access
  const [recentCourses] = useState([
    { id: 'CS101', name: 'Introduction to Computer Science', instructor: 'Dr. Alan Turing', students: 42 },
    { id: 'MATH201', name: 'Advanced Calculus', instructor: 'Dr. Katherine Johnson', students: 35 },
    { id: 'ENG103', name: 'Creative Writing', instructor: 'Prof. Jane Austen', students: 28 },
    { id: 'BIO205', name: 'Molecular Biology', instructor: 'Dr. Rosalind Franklin', students: 30 }
  ]);

  // User role (would normally come from auth context)
  const [userRole] = useState('Administrator');

  // Function to handle viewing a course
  const handleViewCourse = (courseId) => {
    toast.info(`Viewing course details for ${courseId}`);
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
          Welcome back, <span className="font-semibold">{userRole}</span>
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
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
        })}
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
          {recentCourses.map((course) => (
            <motion.div 
              key={course.id}
              className="card hover:shadow-lg dark:hover:shadow-surface-800/50 transition-all"
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="px-2 py-1 bg-primary/10 text-primary dark:text-primary-light rounded text-xs font-medium">
                  {course.id}
                </span>
                <span className="flex items-center text-surface-600 dark:text-surface-400 text-sm">
                  <UsersIcon className="h-4 w-4 mr-1" />
                  {course.students}
                </span>
              </div>
              <h4 className="font-semibold mb-2">{course.name}</h4>
              <p className="text-surface-600 dark:text-surface-400 text-sm mb-4">
                {course.instructor}
              </p>
              <button 
                className="text-primary dark:text-primary-light text-sm font-medium hover:underline"
                onClick={() => handleViewCourse(course.id)}
              >
                View Details
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;