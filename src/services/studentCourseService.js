/**
 * Student Course service to handle enrollment-related operations
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

// Fetch students enrolled in a course
export const fetchStudentsForCourse = async (courseId) => {
  try {
    const apperClient = getApperClient();
    
    // First get the enrollment records
    const enrollmentParams = {
      fields: ['Id', 'student', 'course'],
      where: [{
        fieldName: 'course',
        operator: 'ExactMatch',
        values: [courseId]
      }]
    };
    
    const enrollmentResponse = await apperClient.fetchRecords('student_course', enrollmentParams);
    const enrollments = enrollmentResponse.data || [];
    
    // If there are no enrollments, return empty array
    if (enrollments.length === 0) {
      return [];
    }
    
    // Get the student IDs from enrollments
    const studentIds = enrollments.map(enrollment => enrollment.student);
    
    // Fetch student details
    const studentParams = {
      fields: ['Id', 'Name', 'student_id', 'full_name', 'email'],
      where: [{
        fieldName: 'Id',
        operator: 'ExactMatch',
        values: studentIds
      }]
    };
    
    const studentResponse = await apperClient.fetchRecords('student', studentParams);
    const students = studentResponse.data || [];
    
    // Combine enrollment and student data
    return students.map(student => {
      const enrollment = enrollments.find(e => e.student === student.Id);
      return {
        ...student,
        enrollmentId: enrollment?.Id
      };
    });
  } catch (error) {
    console.error('Error fetching students for course:', error);
    toast.error('Failed to fetch enrolled students');
    throw error;
  }
};

// Enroll a student in a course
export const enrollStudentInCourse = async (studentId, courseId) => {
  try {
    const apperClient = getApperClient();
    
    // Check if enrollment already exists
    const checkParams = {
      fields: ['Id'],
      where: [
        {
          fieldName: 'student',
          operator: 'ExactMatch',
          values: [studentId]
        },
        {
          fieldName: 'course',
          operator: 'ExactMatch',
          values: [courseId]
        }
      ]
    };
    
    const checkResponse = await apperClient.fetchRecords('student_course', checkParams);
    if (checkResponse.data && checkResponse.data.length > 0) {
      toast.warning('Student is already enrolled in this course');
      return null;
    }
    
    // Create enrollment record
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
    toast.error('Failed to enroll student');
    throw error;
  }
};

// Remove a student from a course
export const removeStudentFromCourse = async (enrollmentId) => {
  try {
    const apperClient = getApperClient();
    await apperClient.deleteRecord('student_course', { RecordIds: [enrollmentId] });
    return true;
  } catch (error) {
    console.error('Error removing student from course:', error);
    toast.error('Failed to unenroll student');
    throw error;
  }
};