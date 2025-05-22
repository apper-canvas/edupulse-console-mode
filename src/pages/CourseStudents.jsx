import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { removeStudentFromCourse } from '../services/studentCourseService';

// Import icons
const PlusIcon = getIcon('plus');
const UserIcon = getIcon('user');
const UserXIcon = getIcon('user-x');
const UsersIcon = getIcon('users');
const MailIcon = getIcon('mail');
const SearchIcon = getIcon('search');

const CourseStudents = ({ students = [], courseId, onAddStudent }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.student_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle unenroll student
  const handleUnenrollStudent = async (enrollmentId, studentName) => {
    if (!confirm(`Are you sure you want to unenroll ${studentName} from this course?`)) {
      return;
    }
    
    try {
      setIsLoading(true);
      await removeStudentFromCourse(enrollmentId);
      toast.success(`${studentName} has been unenrolled from the course`);
      // In a real app, you would refresh the students list
      // This is handled by the parent component in a full implementation
    } catch (error) {
      console.error("Error unenrolling student:", error);
      toast.error("Failed to unenroll student");
    } finally {
      setIsLoading(false);
    }
  };
  
  // If there are no students
  if (students.length === 0) {
    return (
      <div className="card p-8 text-center">
        <UsersIcon className="h-12 w-12 mx-auto text-surface-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Students Enrolled</h3>
        <p className="text-surface-600 dark:text-surface-400 mb-6">
          There are no students enrolled in this course yet. Start by enrolling students.
        </p>
        <button
          onClick={onAddStudent}
          className="btn btn-primary flex items-center justify-center mx-auto"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Enroll Students
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <h2 className="text-xl font-semibold">Enrolled Students ({students.length})</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-surface-500" />
            </div>
            <input
              type="text"
              className="input pl-10 w-full"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Add student button */}
          <button
            onClick={onAddStudent}
            className="btn btn-primary flex items-center justify-center whitespace-nowrap"
            disabled={isLoading}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Enroll Student
          </button>
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-surface-600 dark:text-surface-400">Loading...</span>
        </div>
      )}
      
      {/* Students list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <motion.div
                key={student.Id}
                className="card hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg mr-3">
                    {student.full_name?.charAt(0) || 'S'}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-semibold">{student.full_name}</h3>
                    <div className="text-sm text-surface-600 dark:text-surface-400">{student.student_id}</div>
                    
                    <div className="flex items-center text-sm text-surface-600 dark:text-surface-400 mt-2">
                      <MailIcon className="h-4 w-4 mr-1" />
                      <a href={`mailto:${student.email}`} className="hover:text-primary">
                        {student.email}
                      </a>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleUnenrollStudent(student.enrollmentId, student.full_name)}
                    className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    title="Unenroll student"
                    disabled={isLoading}
                  >
                    <UserXIcon className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full card p-6 text-center">
              <p className="text-surface-600 dark:text-surface-400">
                No students found matching your search criteria.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CourseStudents;