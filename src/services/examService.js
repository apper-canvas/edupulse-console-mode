/**
 * Exam service to handle all exam-related operations
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

// Fetch all exams
export const fetchExams = async (courseId = null) => {
  try {
    const apperClient = getApperClient();
    
    // Build query params
    const params = {
      fields: ['Id', 'Name', 'title', 'date', 'course', 'Tags'],
      orderBy: [{ fieldName: 'date', sortType: 'ASC' }]
    };
    
    // Filter by course if provided
    if (courseId) {
      params.where = [{
        fieldName: 'course',
        operator: 'EqualTo',
        values: [courseId]
      }];
    }
    
    const response = await apperClient.fetchRecords('exam', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching exams:', error);
    toast.error('Failed to fetch exams');
    throw error;
  }
};

// Create a new exam
export const createExam = async (examData) => {
  try {
    const apperClient = getApperClient();
    
    // Format date to ISO format
    const formattedDate = format(new Date(examData.date), 'yyyy-MM-dd');
    
    // Only include Updateable fields
    const params = {
      records: [{
        Name: examData.title,
        title: examData.title,
        date: formattedDate,
        course: examData.courseId,
        Tags: examData.tags || ''
      }]
    };
    
    const response = await apperClient.createRecord('exam', params);
    return response.results?.[0]?.data || null;
  } catch (error) {
    console.error('Error creating exam:', error);
    toast.error('Failed to create exam');
    throw error;
  }
};

// Get upcoming exams count
export const getUpcomingExamsCount = async () => {
  try {
    const apperClient = getApperClient();
    
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const params = {
      fields: ['Id'],
      where: [{
        fieldName: 'date',
        operator: 'GreaterThanOrEqualTo',
        values: [today]
      }]
    };
    
    const response = await apperClient.fetchRecords('exam', params);
    return response.data?.length || 0;
  } catch (error) {
    console.error('Error counting upcoming exams:', error);
    return 0;
  }
};