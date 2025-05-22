import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { fetchCourses, createCourse, updateCourse, deleteCourse } from '../services/courseService';
import { getDepartmentOptions } from '../services/departmentService';

// Constants
const TERMS = ['All', 'Fall 2023', 'Spring 2024'];

// Get icon components
const PlusIcon = getIcon('plus');
const EditIcon = getIcon('edit-3');
const TrashIcon = getIcon('trash-2');
const CheckIcon = getIcon('check');
const XIcon = getIcon('x');
const SearchIcon = getIcon('search');
const FilterIcon = getIcon('filter');
const RefreshCwIcon = getIcon('refresh-cw');

const MainFeature = () => {
  // Course state
  const [courses, setCourses] = useState([]);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [departments, setDepartments] = useState(['All', 'Computer Science', 'Mathematics', 'English', 'Biology']);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedTerm, setSelectedTerm] = useState('All');
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    department: '',
    credits: 3,
    term: '',
    instructor: '',
    tags: ''
  });

  // Form errors
  const [formErrors, setFormErrors] = useState({});

  // Loading state for simulating API requests
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch courses when component mounts
  useEffect(() => {
  const handleEdit = (course) => {    
    setEditingCourseId(course.recordId);
  const handleDelete = async (course) => {
    if (!confirm(`Are you sure you want to delete course ${course.id}?`)) {
      return;
    }
    try {
      setIsLoading(true);
      await deleteCourse(course.recordId);
      
      // Update local state after successful deletion
      setCourses(courses.filter(c => c.recordId !== course.recordId));
      toast.success(`Course ${course.id} has been deleted`);
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    } finally {
      setIsLoading(false);
    }
      id: '',
      name: '',
      department: departments.find(d => d !== 'All') || '',
      credits: 3,
      term: TERMS.find(t => t !== 'All') || '',
      instructor: '',
      tags: ''
    });
    setFormErrors({});
    setEditingCourse(null);
    setEditingCourseId(null);
  };

  // Open form for adding new course
  const handleAddNew = () => {
    resetForm();
    setIsFormOpen(true);
  };

  // Open form for editing course
  const handleEdit = (course) => {
    setFormData({...course});
    setEditingCourse(course.id);
      !editingCourse && courses.some(course => course.id === formData.id.trim())

      // Only check for duplicates when creating new course
  // Delete course
  const handleDelete = (courseId) => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setCourses(courses.filter(course => course.id !== courseId));
      toast.success(`Course ${courseId} has been deleted`);
      setIsLoading(false);
    }, 600);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  const handleSubmit = async (e) => {
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.id.trim()) {
      errors.id = 'Course ID is required';

    setIsSubmitting(true);
    } else if (
    try {
    }
    
        const updatedCourse = await updateCourse(editingCourseId, {
          name: formData.name,
          department: formData.department,
          credits: formData.credits,
          term: formData.term,
          instructor: formData.instructor,
          tags: formData.tags || ''
        });
        
        if (updatedCourse) {
          // Update local state
          const updatedCourses = courses.map(course => 
            course.recordId === editingCourseId ? 
              {
                ...formData,
                recordId: editingCourseId
              } : course
          );
          setCourses(updatedCourses);
          toast.success(`Course ${formData.id} has been updated`);
        }
    }
    
        const newCourse = await createCourse({
          id: formData.id,
          name: formData.name,
          department: formData.department,
          credits: formData.credits,
          term: formData.term,
          instructor: formData.instructor,
          tags: formData.tags || ''
        });
        
        if (newCourse) {
          // Add to local state
          setCourses([...courses, {
            id: formData.id,
            name: formData.name,
            department: formData.department,
            credits: formData.credits,
            term: formData.term,
            instructor: formData.instructor,
            tags: formData.tags || '',
            recordId: newCourse.Id
          }]);
          toast.success(`Course ${formData.id} has been added`);
        }
    }
    
      errors.term = 'Term is required';
    }
    } catch (error) {
      console.error("Error submitting course:", error);
      toast.error(editingCourse ? "Failed to update course" : "Failed to add course");
    } finally {
      setIsSubmitting(false);
    }
    if (formData.credits < 1 || formData.credits > 6) {
      errors.credits = 'Credits must be between 1 and 6';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      if (editingCourse) {
        // Update existing course
        setCourses(
          courses.map(course => 
            course.id === editingCourse ? { ...formData } : course
          )
        );
        toast.success(`Course ${formData.id} has been updated`);
      } else {
        // Add new course
        setCourses([...courses, { ...formData }]);
        toast.success(`Course ${formData.id} has been added`);
      }
      
      setIsLoading(false);
      setIsFormOpen(false);
      resetForm();
    }, 800);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('All');
    setSelectedTerm('All');
  };

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6">
      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
            {/* Department filter - now using departments from API */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-surface-500" />
            </div>
            <input
              type="text"
              className="input pl-10 w-full"
              placeholder="Search courses by ID, name, or instructor"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filters section */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Department filter */}
            <div className="relative">
              <select
                className="input appearance-none pr-10 pl-4 py-2"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                {TERMS.map(term => (
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FilterIcon className="h-4 w-4 text-surface-500" />
              </div>
            </div>
            
            {/* Term filter */}
            <div className="relative">
              <select
                className="input appearance-none pr-10 pl-4 py-2"
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
              >
                {terms.map(term => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FilterIcon className="h-4 w-4 text-surface-500" />
              </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-surface-600 dark:text-surface-400">Loading courses...</span>
        </div>
      )}
            </div>
      {/* No courses state */}
      {!isLoading && courses.length === 0 && (
        <div className="text-center py-8 text-surface-500 dark:text-surface-400">No courses found. Add your first course to get started.</div>
      )}
            
            {/* Reset filters button */}
            <button
              className="btn btn-outline p-2 h-full"
              onClick={resetFilters}
              aria-label="Reset filters"
              title="Reset filters"
            >
              <RefreshCwIcon className="h-4 w-4" />
            </button>
          </div>
          
          {/* Add new course button */}
          <button
            className="btn btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
            onClick={handleAddNew}
              {!isLoading && filteredCourses.length > 0 ? (
            <PlusIcon className="h-4 w-4" />
            <span>Add Course</span>
          </button>
        </div>
      </div>
      
      {/* Courses table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-surface-200 dark:border-surface-700">
              <th className="pb-3 font-semibold">Course ID</th>
              <th className="pb-3 font-semibold">Name</th>
              <th className="pb-3 font-semibold hidden sm:table-cell">Department</th>
              <th className="pb-3 font-semibold hidden md:table-cell">Credits</th>
              <th className="pb-3 font-semibold hidden lg:table-cell">Term</th>
              <th className="pb-3 font-semibold">Instructor</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
                          className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          onClick={() => handleDelete(course)}
                filteredCourses.map((course) => (
                  <motion.tr
                    key={course.id}
                    className="border-b border-surface-100 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td className="py-3 font-medium">{course.id}</td>
                    <td className="py-3">{course.name}</td>
                    <td className="py-3 hidden sm:table-cell">{course.department}</td>
                    <td className="py-3 hidden md:table-cell">{course.credits}</td>
                    <td className="py-3 hidden lg:table-cell">{course.term}</td>
                    <td className="py-3">{course.instructor}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                          onClick={() => handleEdit(course)}
                          disabled={isLoading}
                          aria-label="Edit course"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          onClick={() => handleDelete(course.id)}
                          disabled={isLoading}
                          aria-label="Delete course"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-surface-500 dark:text-surface-400">
                    No courses found. Try adjusting your filters or add a new course.
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {/* Course form dialog */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!isLoading) {
                setIsFormOpen(false);
                resetForm();
              }
            }}
          >
            <motion.div
              className="bg-white dark:bg-surface-800 rounded-xl shadow-lg w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">
                    {editingCourse ? 'Edit Course' : 'Add New Course'}
                  </h3>
                  <button
                    className="p-1.5 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full"
                    onClick={() => {
                      if (!isLoading) {
                        setIsFormOpen(false);
                        resetForm();
                      }
                    }}
                    disabled={isLoading}
                    aria-label="Close"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {/* Course ID */}
                    <div>
                      <label htmlFor="id" className="label">Course ID</label>
                      <input
                        type="text"
                        id="id"
                        name="id"
                        className={`input w-full ${formErrors.id ? 'border-red-500 dark:border-red-500' : ''}`}
                        value={formData.id}
                        onChange={handleInputChange}
                        disabled={!!editingCourse}
                        required
                      />
                      {formErrors.id && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.id}</p>
                      )}
                    </div>
                    
                    {/* Course Name */}
                    <div>
                      <label htmlFor="name" className="label">Course Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className={`input w-full ${formErrors.name ? 'border-red-500 dark:border-red-500' : ''}`}
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                      )}
                    </div>
                    
                    {/* Department */}
                    <div>
                      <label htmlFor="department" className="label">Department</label>
                      <select
                        id="department"
                        name="department"
                        className={`input w-full ${formErrors.department ? 'border-red-500 dark:border-red-500' : ''}`}
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select a department</option>
                        {departments.filter(d => d !== 'All').map(department => (
                          <option key={department} value={department}>{department}</option>
                        ))}
                      </select>
                      {formErrors.department && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.department}</p>
                      )}
                    </div>
                    
                    {/* Credits */}
                    <div>
                      <label htmlFor="credits" className="label">Credits</label>
                      <input
                        type="number"
                        id="credits"
                        name="credits"
                        min="1"
                        max="6"
                        className={`input w-full ${formErrors.credits ? 'border-red-500 dark:border-red-500' : ''}`}
                        value={formData.credits}
                        onChange={handleInputChange}
                        required

                    {/* Tags */}
                    <div>
                      <label htmlFor="tags" className="label">Tags (comma-separated)</label>
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        className={`input w-full ${formErrors.tags ? 'border-red-500 dark:border-red-500' : ''}`}
                        value={formData.tags || ''}
                        onChange={handleInputChange}
                        placeholder="tag1,tag2,tag3"
                      />
                      {formErrors.tags && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.tags}</p>
                      )}
                    </div>
                      />
                      {formErrors.credits && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.credits}</p>
                      )}
                    </div>
                    
                    {/* Term */}
                    <div>
                      <label htmlFor="term" className="label">Term</label>
                      <select
                        id="term"
                        name="term"
                      type="submit"
                        value={formData.term}
                      disabled={isSubmitting}
                        required
                      {isSubmitting ? (
                        <option value="">Select a term</option>
                        {terms.filter(t => t !== 'All').map(term => (
                          <option key={term} value={term}>{term}</option>
                        ))}
                      </select>
                      {formErrors.term && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.term}</p>
                      )}
                    </div>
                    
                    {/* Instructor */}
                    <div>
                      <label htmlFor="instructor" className="label">Instructor</label>
                      <input
                        type="text"
                        id="instructor"
                        name="instructor"
                        className={`input w-full ${formErrors.instructor ? 'border-red-500 dark:border-red-500' : ''}`}
                        value={formData.instructor}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.instructor && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.instructor}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        if (!isLoading) {
                          setIsFormOpen(false);
                          resetForm();
                        }
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary flex items-center gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <CheckIcon className="h-4 w-4" />
                          <span>{editingCourse ? 'Update Course' : 'Add Course'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;