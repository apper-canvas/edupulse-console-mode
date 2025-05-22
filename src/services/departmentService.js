/**
 * Department service to handle all department-related operations
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

// Fetch all departments
export const fetchDepartments = async () => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: ['Id', 'Name', 'code', 'Tags'],
      orderBy: [{ fieldName: 'Name', sortType: 'ASC' }]
    };
    
    const response = await apperClient.fetchRecords('department', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching departments:', error);
    toast.error('Failed to fetch departments');
    throw error;
  }
};

// Create a new department
export const createDepartment = async (departmentData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include Updateable fields
    const params = {
      records: [{
        Name: departmentData.name,
        code: departmentData.code,
        Tags: departmentData.tags || ''
      }]
    };
    
    const response = await apperClient.createRecord('department', params);
    return response.results?.[0]?.data || null;
  } catch (error) {
    console.error('Error creating department:', error);
    toast.error('Failed to create department');
    throw error;
  }
};

// Get department filter options (for dropdown)
export const getDepartmentOptions = async () => {
  try {
    const departments = await fetchDepartments();
    
    // Format departments for dropdown
    const options = departments.map(dept => ({
      value: dept.Name,
      label: dept.Name
    }));
    
    // Add 'All' option at the beginning
    options.unshift({ value: 'All', label: 'All Departments' });
    
    return options;
  } catch (error) {
    console.error('Error getting department options:', error);
    // Return a default list in case of error
    return [{ value: 'All', label: 'All Departments' }];
  }
};