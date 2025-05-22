/**
 * Assignment service to handle all assignment-related operations
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

// Fetch assignments for a specific course
export const fetchAssignmentsForCourse = async (courseId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: ['Id', 'Name', 'title', 'due_date', 'description', 'course'],
      where: [{
        fieldName: 'course',
        operator: 'ExactMatch',
        values: [courseId]
      }],
      orderBy: [{ fieldName: 'due_date', sortType: 'ASC' }]
    };
    
    const response = await apperClient.fetchRecords('assignment', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching assignments for course:', error);
    toast.error('Failed to fetch assignments');
    throw error;
  }
};

// Create a new assignment
export const createAssignment = async (assignmentData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include Updateable fields
    const params = {
      records: [{
        Name: assignmentData.title,
        title: assignmentData.title,
        due_date: assignmentData.dueDate,
        description: assignmentData.description,
        course: assignmentData.courseId
      }]
    };
    
    const response = await apperClient.createRecord('assignment', params);
    return response.results?.[0]?.data || null;
  } catch (error) {
    console.error('Error creating assignment:', error);
    toast.error('Failed to create assignment');
    throw error;
  }
};

// Update an existing assignment
export const updateAssignment = async (assignmentId, assignmentData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include Updateable fields
    const params = {
      records: [{
        Id: assignmentId,
        Name: assignmentData.title,
        title: assignmentData.title,
        due_date: assignmentData.dueDate,
        description: assignmentData.description,
        course: assignmentData.courseId
      }]
    };
    
    const response = await apperClient.updateRecord('assignment', params);
    return response.results?.[0]?.data || null;
  } catch (error) {
    console.error('Error updating assignment:', error);
    toast.error('Failed to update assignment');
    throw error;
  }
};

// Delete an assignment
export const deleteAssignment = async (assignmentId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [assignmentId]
    };
    
    await apperClient.deleteRecord('assignment', params);
    return true;
  } catch (error) {
    console.error('Error deleting assignment:', error);
    toast.error('Failed to delete assignment');
    throw error;
  }
};

// Get an assignment by ID
export const getAssignmentById = async (assignmentId) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.getRecordById('assignment', assignmentId, { fields: ['Id', 'Name', 'title', 'due_date', 'description', 'course'] });
    return response.data || null;
  } catch (error) {
    console.error('Error fetching assignment by ID:', error);
    throw error;
  }
};