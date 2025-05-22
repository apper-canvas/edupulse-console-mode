import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { fetchCourses } from '../services/courseService';
import { getDepartmentOptions } from '../services/departmentService';

// Import icons
const SearchIcon = getIcon('search');
const FilterIcon = getIcon('filter');
const RefreshCwIcon = getIcon('refresh-cw');
const BookOpenIcon = getIcon('book-open');
const PlusIcon = getIcon('plus');
const ChevronRightIcon = getIcon('chevron-right');

const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState(['All']);
  const [terms, setTerms] = useState(['All', 'Fall 2023', 'Spring 2024']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedTerm, setSelectedTerm] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch courses and departments when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [departmentOptions, coursesData] = await Promise.all([
          getDepartmentOptions(),
          fetchCourses(searchQuery, selectedDepartment, selectedTerm)
        ]);
        
        // Add 'All' option to departments
        setDepartments(['All', ...departmentOptions]);
        setCourses(coursesData);
      } catch (error) {
        console.error("Error loading courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [searchQuery, selectedDepartment, selectedTerm]);
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('All');
    setSelectedTerm('All');
  };
  
  // Handle adding new course
  const handleAddCourse = () => {
    navigate('/courses/new');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Courses</h1>
        <button
          onClick={handleAddCourse}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Course
        </button>
      </div>
      
      {/* Search and filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4 p-4">
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
              >
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
            </div>
            
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
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-3 text-surface-600 dark:text-surface-400">Loading courses...</span>
        </div>
      )}
      
      {/* Course grid/list will be implemented here */}
    </div>
  );
};

export default CourseList;