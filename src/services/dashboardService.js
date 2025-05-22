/**
 * Dashboard service to handle combined data for the dashboard
 */

import { getStudentCount } from './studentService';
import { fetchCourses } from './courseService';
import { getUpcomingExamsCount } from './examService';
import { getUpcomingAssignmentsCount } from './assignmentService';

// Fetch all dashboard statistics
export const fetchDashboardStats = async () => {
  try {
    // Fetch all statistics in parallel
    const [courses, studentCount, upcomingExams, upcomingAssignments] = await Promise.all([
      fetchCourses(),
      getStudentCount(),
      getUpcomingExamsCount(),
      getUpcomingAssignmentsCount()
    ]);
    
    // Format into stats array
    return [
      { 
        id: 1, 
        title: 'Active Courses', 
        value: courses.length, 
        icon: 'book-open', 
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
      },
      { 
        id: 2, 
        title: 'Total Students', 
        value: studentCount, 
        icon: 'users', 
        color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
      },
      { 
        id: 3, 
        title: 'Upcoming Exams', 
        value: upcomingExams, 
        icon: 'calendar', 
        color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
      },
      { 
        id: 4, 
        title: 'Assignments Due', 
        value: upcomingAssignments, 
        icon: 'clipboard-list', 
        color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
      }
    ];
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return empty stats in case of error
    return [];
  }
};