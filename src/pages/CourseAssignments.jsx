import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';
import { deleteAssignment } from '../services/assignmentService';

// Import icons
const PlusIcon = getIcon('plus');
const EditIcon = getIcon('edit-3');
const TrashIcon = getIcon('trash-2');
const CalendarIcon = getIcon('calendar');
const ClipboardListIcon = getIcon('clipboard-list');

const CourseAssignments = ({ assignments = [], courseId, onAddAssignment }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(null);
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      return dateString ? format(new Date(dateString), 'MMM dd, yyyy') : 'No due date';
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  };
  
  // Handle edit assignment
  const handleEditAssignment = (assignmentId) => {
    navigate(`/courses/${courseId}/assignments/${assignmentId}/edit`);
  };
  
  // Handle delete assignment
  const handleDeleteAssignment = async (assignmentId, title) => {
    if (!confirm(`Are you sure you want to delete the assignment "${title}"?`)) {
      return;
    }
    
    try {
      setIsLoading(true);
      await deleteAssignment(assignmentId);
      toast.success(`Assignment "${title}" has been deleted`);
      // In a real app, you would refresh the assignments list
      // This is handled by the parent component in a full implementation
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast.error("Failed to delete assignment");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle description expansion
  const toggleDescription = (assignmentId) => {
    setExpandedDescription(expandedDescription === assignmentId ? null : assignmentId);
  };
  
  // If there are no assignments
  if (assignments.length === 0) {
    return (
      <div className="card p-8 text-center">
        <ClipboardListIcon className="h-12 w-12 mx-auto text-surface-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Assignments Yet</h3>
        <p className="text-surface-600 dark:text-surface-400 mb-6">
          This course doesn't have any assignments yet. Get started by creating the first assignment.
        </p>
        <button
          onClick={onAddAssignment}
          className="btn btn-primary flex items-center justify-center mx-auto"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Assignment
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Assignments</h2>
        <button
          onClick={onAddAssignment}
          className="btn btn-primary flex items-center justify-center"
          disabled={isLoading}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Assignment
        </button>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-surface-600 dark:text-surface-400">Loading...</span>
        </div>
      )}
      
      {/* Assignments list */}
      <AnimatePresence>
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <motion.div
              key={assignment.Id}
              className="card hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold mb-1">{assignment.title}</h3>
                  
                  <div className="flex items-center text-surface-600 dark:text-surface-400 text-sm mb-2">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>Due: {formatDate(assignment.due_date)}</span>
                  </div>
                  
                  {/* Description preview */}
                  <div className="text-surface-700 dark:text-surface-300">
                    {assignment.description && (
                      <>
                        <div className={expandedDescription === assignment.Id ? '' : 'line-clamp-2'}>
                          {assignment.description.split('\n').map((line, i) => (
                            <p key={i}>{line}</p>
                          ))}
                        </div>
                        {assignment.description.length > 120 && (
                          <button
                            onClick={() => toggleDescription(assignment.Id)}
                            className="text-sm text-primary dark:text-primary-light mt-1 hover:underline focus:outline-none"
                          >
                            {expandedDescription === assignment.Id ? 'Show less' : 'Show more'}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex mt-4 md:mt-0 space-x-2">
                  <button
                    onClick={() => handleEditAssignment(assignment.Id)}
                    className="btn btn-outline py-1 px-3 flex items-center"
                    disabled={isLoading}
                  >
                    <EditIcon className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAssignment(assignment.Id, assignment.title)}
                    className="btn btn-outline py-1 px-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 flex items-center"
                    disabled={isLoading}
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default CourseAssignments;