/**
 * Student service to handle all student-related operations
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

// Fetch all students with optional filters
export const fetchStudents = async (searchQuery = '') => {
  try {
    const apperClient = getApperClient();
    
    // Build query params
    const params = {
      fields: ['Id', 'Name', 'student_id', 'full_name', 'email', 'Tags'],
      orderBy: [{ fieldName: 'Name', sortType: 'ASC' }]
    };
    
    // Add search query if provided
    if (searchQuery) {
      params.whereGroups = [{
        operator: 'OR',
        subGroups: [
          {
            conditions: [{
              fieldName: 'Name',
              operator: 'Contains',
              values: [searchQuery]
            }],
            operator: ''
          },
          {
            conditions: [{
              fieldName: 'student_id',
              operator: 'Contains',
              values: [searchQuery]
            }],
            operator: ''
          },
          {
            conditions: [{
              fieldName: 'email',
              operator: 'Contains',
              values: [searchQuery]
            }],
            operator: ''
          }
        ]
      }];
    }
    
    const response = await apperClient.fetchRecords('student', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching students:', error);
    toast.error('Failed to fetch students');
    throw error;
  }
};

// Create a new student
export const createStudent = async (studentData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include Updateable fields
    const params = {
      records: [{
        Name: studentData.name,
        student_id: studentData.studentId,
        full_name: studentData.fullName,
        email: studentData.email,
        Tags: studentData.tags || ''
      }]
    };
    
    const response = await apperClient.createRecord('student', params);
    return response.results?.[0]?.data || null;
  } catch (error) {
    console.error('Error creating student:', error);
    toast.error('Failed to create student');
    throw error;
  }
};

// Get total number of students
export const getStudentCount = async () => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: ['Id']
    };
    
    const response = await apperClient.fetchRecords('student', params);
    return response.data?.length || 0;
  } catch (error) {
    console.error('Error counting students:', error);
    return 0;
  }
};