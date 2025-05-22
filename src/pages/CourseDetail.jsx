import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { getCourseById } from '../services/courseService';
import { fetchAssignmentsForCourse } from '../services/assignmentService';
import { fetchStudentsForCourse } from '../services/studentCourseService';

// Import icons
const ArrowLeftIcon = getIcon('arrow-left');
const BookOpenIcon = getIcon('book-open');
const UserIcon = getIcon('user');
const CalendarIcon = getIcon('calendar');
const ClipboardListIcon = getIcon('clipboard-list');
const EditIcon = getIcon('edit-3');
const PlusIcon = getIcon('plus');

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // State for course data
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  
  // Fetch course data when component mounts or courseId changes
  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch course details
        const courseData = await getCourseById(courseId);
        setCourse(courseData);
        
        // Fetch related data
        if (courseData) {
          const [assignmentsData, studentsData] = await Promise.all([
            fetchAssignmentsForCourse(courseId),
            fetchStudentsForCourse(courseId)
          ]);
          
          setAssignments(assignmentsData);
          setStudents(studentsData);
        }
      } catch (error) {
        console.error("Error loading course details:", error);
        toast.error("Failed to load course details");
        navigate('/dashboard'); // Redirect on error
      } finally {
        setIsLoading(false);
      }
    };
    
    if (courseId) {
      loadCourseData();
    }
  }, [courseId, navigate]);
  
  const handleEditCourse = () => {
    navigate(`/courses/${courseId}/edit`);
  };
  
  const handleAddAssignment = () => {
    navigate(`/courses/${courseId}/assignments/new`);
  };
  
  const handleAddStudent = () => {
    navigate(`/courses/${courseId}/students/enroll`);
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3 text-surface-600 dark:text-surface-400">Loading course details...</span>
        </div>
      </div>
    );
  }
  
  // Render not found state
  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Link to="/dashboard" className="btn btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button and course title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <Link to="/dashboard" className="inline-flex items-center text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light mb-4 transition-colors">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <BookOpenIcon className="h-6 w-6 mr-2 text-primary" />
            {course.Name}
          </h1>
          <div className="text-surface-600 dark:text-surface-400 mt-1">
            Course ID: {course.course_id}
          </div>
        </div>
        
        <button
          onClick={handleEditCourse}
          className="btn btn-outline mt-4 md:mt-0 flex items-center"
        >
          <EditIcon className="h-4 w-4 mr-2" />
          Edit Course
        </button>
      </div>
      
      {/* Course information card */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Course Information</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-surface-500 dark:text-surface-400">Department</div>
                <div className="font-medium">{course.department}</div>
              </div>
              <div>
                <div className="text-sm text-surface-500 dark:text-surface-400">Credits</div>
                <div className="font-medium">{course.credits}</div>
              </div>
              <div>
                <div className="text-sm text-surface-500 dark:text-surface-400">Term</div>
                <div className="font-medium">{course.term}</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Instructor</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-surface-500" />
                <span className="font-medium">{course.instructor}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <ClipboardListIcon className="h-5 w-5 mr-2 text-surface-500" />
                <span>
                  <span className="font-medium">{assignments.length}</span> Assignments
                </span>
              </div>
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-surface-500" />
                <span>
                  <span className="font-medium">{students.length}</span> Students Enrolled
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs for assignments and students */}
      <div className="mb-6">
        <div className="border-b border-surface-200 dark:border-surface-700 flex">
          <button
            className={`pb-3 px-4 font-medium ${activeTab === 'details' ? 'text-primary border-b-2 border-primary' : 'text-surface-600 dark:text-surface-400'}`}
            onClick={() => setActiveTab('details')}
          >
            Assignments
          </button>
          <button
            className={`pb-3 px-4 font-medium ${activeTab === 'students' ? 'text-primary border-b-2 border-primary' : 'text-surface-600 dark:text-surface-400'}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
        </div>
      </div>
      
      {/* Tab content */}
      <div className="mb-8">
        {activeTab === 'details' && <CourseAssignments assignments={assignments} courseId={courseId} onAddAssignment={handleAddAssignment} />}
        {activeTab === 'students' && <CourseStudents students={students} courseId={courseId} onAddStudent={handleAddStudent} />}
      </div>
    </div>
  );
};

export default CourseDetail;