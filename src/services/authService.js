/**
 * Authentication service to handle user authentication operations
 */

// Get the current authenticated user
export const getCurrentUser = () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    return apperClient.getCurrentUser();
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Logout the current user
export const logout = async () => {
  const { ApperUI } = window.ApperSDK;
  await ApperUI.logout();
};

// Get users from the User2 table
export const fetchUsers = async (params = {}) => {
  const { ApperClient } = window.ApperSDK;
  const apperClient = new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
  
  const response = await apperClient.fetchRecords('User2', params);
  return response.data || [];
};