import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

function StudentProfile() {
    const [activeIndex, setActiveIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { studentid } = useParams();
    const [studentData, setStudentData] = useState(null);
    const [error, setError] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const modalRef = useRef(null); // Create a ref to track the modal element
    const flagColors = ["#d1d5db", "#fb923c", "#0000ff", "#ef4444"];

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const response = await fetch(`/managestudents/api/studentprofile/${studentid}/`);
                if (!response.ok) throw new Error('Failed to fetch student profile data');
                const data = await response.json();
                setStudentData(data);
            } catch (error) {
                setError(error.message);
            }
        };

        if (studentid) fetchStudentProfile();
    }, [studentid]);

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
      };
    
      const openModal = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
      };

      // Close modal when clicking outside of the modal content
  useEffect(() => {

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!studentData) return <p>Loading...</p>;

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-2">
                    {studentData.student.firstname} {studentData.student.lastname}
                </h2>
                <p className="text-gray-600 text-lg">
                    <strong>Student ID:</strong> {studentData.student.studentid}
                </p>
                <p className="text-gray-600 text-lg">
                    <strong>Email:</strong> {studentData.student.email}
                </p>
                <p className="text-gray-600 text-lg">
                    <strong>Phone No.:</strong> {studentData.student.phoneno}
                </p>
            </div>

            <div className="overflow-x-auto">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Grades</h3>
                <table className="min-w-full bg-white rounded-lg shadow-lg">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="p-3 text-left">Course ID</th>
                            <th className="p-3 text-left">Course Description</th>
                            <th className="p-3 text-left">Journal 1</th>
                            <th className="p-3 text-left">Journal 2</th>
                            <th className="p-3 text-left">Assessment 1</th>
                            <th className="p-3 text-left">Assessment 2</th>
                            <th className="p-3 text-left">Assessment 3</th>
                            <th className="p-3 text-left">Current Grade</th>
                            <th className="p-3 text-left">Final Grade</th>
                            <th className="p-3 text-left">Flag Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentData.studentgrades.map((grade) => {
                            const course = studentData.courses.find(course => course.courseid === grade.courseid);
                            return (
                                <tr key={grade.courseid} className="border-t border-gray-200">
                                    <td className="p-3">{grade.courseid}</td>
                                    <td className="p-3">{course.classdescription}</td>
                                    <td className="p-3">{grade.journal1}</td>
                                    <td className="p-3">{grade.journal2}</td>
                                    <td className="p-3">{grade.assessment1}</td>
                                    <td className="p-3">{grade.assessment2}</td>
                                    <td className="p-3">{grade.assessment3}</td>
                                    <td className="p-3">{grade.currentscore}</td>
                                    <td className="p-3">{grade.finalgrade}</td>
                                    <td className="p-3">
                                        <div className="flex justify-center items-center h-full">
                                            {(grade.flagstatus === 0 || grade.flagstatus === 2) ? (
                                            <button onClick={() => openModal(studentData.student)} className="flex items-center justify-center">
                                            <svg
                                                className={`w-8 h-8`}
                                                viewBox="0 0 64 64"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                {/* Flagpole */}
                                                <line 
                                                x1="10" y1="5" 
                                                x2="10" y2="60" 
                                                stroke="black" 
                                                strokeWidth="2" 
                                                />
                                                {/* Flag */}
                                                <polygon 
                                                points="10,5 40,15 10,25" 
                                                fill={flagColors[grade.flagstatus]} 
                                                />
                                            </svg>
                                            </button>) : 
                                            <svg
                                            className={`w-8 h-8`}
                                            viewBox="0 0 64 64"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            {/* Flagpole */}
                                            <line 
                                            x1="10" y1="5" 
                                            x2="10" y2="60" 
                                            stroke="black" 
                                            strokeWidth="2" 
                                            />
                                            {/* Flag */}
                                            <polygon 
                                            points="10,5 40,15 10,25" 
                                            fill={flagColors[grade.flagstatus]} 
                                            />
                                        </svg> }
                                            
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal Popup */}
            {isModalOpen && selectedStudent &&(
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                <div ref={modalRef} className="bg-white p-6 rounded-lg w-96">
                    <h2 className="text-xl font-bold text-center mb-4">"At Risk" Early Intervention Form</h2>
                    <form>
                    <div className="mb-4">
                        {['General English', 'Math', 'Time Management', 'Exam', 'Writing Skills', 'Research Skills'].map((skill, i) => (
                        <div key={i} className="flex items-center">
                            <input type="checkbox" id={skill.toLowerCase().replace(' ', '-')} className="mr-2" />
                            <label htmlFor={skill.toLowerCase().replace(' ', '-')}>{skill}</label>
                        </div>
                        ))}
                    </div>

                    <textarea rows="4" placeholder="Issues" className="w-full border border-gray-300 p-2 rounded-lg mb-4"></textarea>

                    <div className="flex justify-center">
                        <button type="button" className="bg-black text-white py-2 px-4 rounded" onClick={() => handleFlagClick(selectedStudent)}>
                        Save & Flag Student
                        </button>
                    </div>
                    </form>
                    {/* Show email status message will ask for eugene's help*/}
                    {/* {emailStatus && <p className="mt-4 text-center">{emailStatus}</p>} */} 
                </div>
                </div>
            )}

        </div>
    );
}

export default StudentProfile;