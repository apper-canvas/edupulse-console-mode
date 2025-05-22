/**
 * Student Course service to handle the relationship between students and courses
 */

import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Fetch all student-course relationships
export const fetchStudentCourses = async (studentId = null, courseId = null) => {
  try {
    const apperClient = getApperClient();
    
    // Build query params
    const params = {
      fields: ['Id', 'Name', 'student', 'course', 'Tags']
    };
    
    // Add filters if provided
    const conditions = [];
    
    if (studentId) {
      conditions.push({
        fieldName: 'student',
        operator: 'EqualTo',
        values: [studentId]
      });
    }
    
    if (courseId) {
      conditions.push({
        fieldName: 'course',
        operator: 'EqualTo',
        values: [courseId]
      });
    }
    
    if (conditions.length > 0) {
      params.where = conditions;
    }
    
    const response = await apperClient.fetchRecords('student_course', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching student courses:', error);
    toast.error('Failed to fetch student course relationships');
    throw error;
  }
};

// Enroll a student in a course
export const enrollStudentInCourse = async (studentId, courseId) => {
  try {
    const apperClient = getApperClient();
    
    // Check if enrollment already exists
    const existing = await fetchStudentCourses(studentId, courseId);
    if (existing.length > 0) {
      toast.warning('Student is already enrolled in this course');
      return existing[0];
    }
    
    // Create a name for the relationship
    const params = {
      records: [{
        Name: `Enrollment-${studentId}-${courseId}`,
        student: studentId,
        course: courseId
      }]
    };
    
    const response = await apperClient.createRecord('student_course', params);
    return response.results?.[0]?.data || null;
  } catch (error) {
    console.error('Error enrolling student:', error);
    toast.error('Failed to enroll student in course');
    throw error;
  }
};

// Get student count for a specific course
export const getStudentCountForCourse = async (courseId) => {
  try {
    const enrollments = await fetchStudentCourses(null, courseId);
    return enrollments.length;
  } catch (error) {
    console.error(`Error getting student count for course ${courseId}:`, error);
    return 0;
  }
};