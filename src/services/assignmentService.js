/**
 * Assignment service to handle all assignment-related operations
 */

import { toast } from 'react-toastify';
import { format } from 'date-fns';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Fetch all assignments
export const fetchAssignments = async (courseId = null) => {
  try {
    const apperClient = getApperClient();
    
    // Build query params
    const params = {
      fields: ['Id', 'Name', 'title', 'due_date', 'description', 'course', 'Tags'],
      orderBy: [{ fieldName: 'due_date', sortType: 'ASC' }]
    };
    
    // Filter by course if provided
    if (courseId) {
      params.where = [{
        fieldName: 'course',
        operator: 'EqualTo',
        values: [courseId]
      }];
    }
    
    const response = await apperClient.fetchRecords('assignment', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching assignments:', error);
    toast.error('Failed to fetch assignments');
    throw error;
  }
};

// Create a new assignment
export const createAssignment = async (assignmentData) => {
  try {
    const apperClient = getApperClient();
    
    // Format date to ISO format
    const formattedDate = format(new Date(assignmentData.dueDate), 'yyyy-MM-dd');
    
    // Only include Updateable fields
    const params = {
      records: [{
        Name: assignmentData.title,
        title: assignmentData.title,
        due_date: formattedDate,
        description: assignmentData.description,
        course: assignmentData.courseId,
        Tags: assignmentData.tags || ''
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

// Get upcoming assignments count
export const getUpcomingAssignmentsCount = async () => {
  try {
    const apperClient = getApperClient();
    
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const params = {
      fields: ['Id'],
      where: [{
        fieldName: 'due_date',
        operator: 'GreaterThanOrEqualTo',
        values: [today]
      }]
    };
    
    const response = await apperClient.fetchRecords('assignment', params);
    return response.data?.length || 0;
  } catch (error) {
    console.error('Error counting upcoming assignments:', error);
    return 0;
  }
};