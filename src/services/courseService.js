/**
 * Course service to handle all course-related operations
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

// Fetch all courses with optional filters
export const fetchCourses = async (searchQuery = '', department = 'All', term = 'All') => {
  try {
    const apperClient = getApperClient();
    
    // Build query conditions
    const conditions = [];
    
    // Add search query condition if provided
    if (searchQuery) {
      conditions.push({
        fieldName: 'Name',
        operator: 'Contains',
        values: [searchQuery]
      });
      // Also search by course_id
      conditions.push({
        fieldName: 'course_id',
        operator: 'Contains',
        values: [searchQuery]
      });
      // Also search by instructor
      conditions.push({
        fieldName: 'instructor',
        operator: 'Contains',
        values: [searchQuery]
      });
    }
    
    // Add department filter if not 'All'
    if (department && department !== 'All') {
      conditions.push({
        fieldName: 'department',
        operator: 'ExactMatch',
        values: [department]
      });
    }
    
    // Add term filter if not 'All'
    if (term && term !== 'All') {
      conditions.push({
        fieldName: 'term',
        operator: 'ExactMatch',
        values: [term]
      });
    }
    
    // Create params object for the query
    const params = {
      fields: ['Id', 'Name', 'course_id', 'department', 'credits', 'term', 'instructor', 'Tags'],
      orderBy: [{ fieldName: 'Name', sortType: 'ASC' }]
    };
    
    // Only add where clause if we have conditions
    if (conditions.length > 0) {
      if (searchQuery) {
        // For search, use OR condition across multiple fields
        params.whereGroups = [{
          operator: 'OR',
          subGroups: conditions.map(condition => ({
            conditions: [condition],
            operator: ''
          }))
        }];
      } else {
        // For filters, use AND condition
        params.where = conditions;
      }
    }
    
    const response = await apperClient.fetchRecords('course', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    toast.error('Failed to fetch courses');
    throw error;
  }
};

// Fetch recent courses with a limit
export const fetchRecentCourses = async (limit = 4) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: ['Id', 'Name', 'course_id', 'department', 'instructor', 'Tags'],
      orderBy: [{ fieldName: 'CreatedOn', sortType: 'DESC' }],
      pagingInfo: {
        limit: limit
      }
    };
    
    const response = await apperClient.fetchRecords('course', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching recent courses:', error);
    throw error;
  }
};

// Create a new course
export const createCourse = async (courseData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include Updateable fields
    const params = {
      records: [{
        Name: courseData.name,
        course_id: courseData.id,
        department: courseData.department,
        credits: parseInt(courseData.credits, 10),
        term: courseData.term,
        instructor: courseData.instructor,
        Tags: courseData.tags || ''
      }]
    };
    
    const response = await apperClient.createRecord('course', params);
    return response.results?.[0]?.data || null;
  } catch (error) {
    console.error('Error creating course:', error);
    toast.error('Failed to create course');
    throw error;
  }
};

// Update an existing course
export const updateCourse = async (courseId, courseData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include Updateable fields
    const params = {
      records: [{
        Id: courseId,
        Name: courseData.name,
        department: courseData.department,
        credits: parseInt(courseData.credits, 10),
        term: courseData.term,
        instructor: courseData.instructor,
        Tags: courseData.tags || ''
      }]
    };
    
    const response = await apperClient.updateRecord('course', params);
    return response.results?.[0]?.data || null;
  } catch (error) {
    console.error('Error updating course:', error);
    toast.error('Failed to update course');
    throw error;
  }
};

// Delete a course
export const deleteCourse = async (courseId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [courseId]
    };
    
    await apperClient.deleteRecord('course', params);
    return true;
  } catch (error) {
    console.error('Error deleting course:', error);
    toast.error('Failed to delete course');
    throw error;
  }
};