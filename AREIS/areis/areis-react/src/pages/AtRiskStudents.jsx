import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AtRiskStudents = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({ courses: [], studentgrades: [], students: [] });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const modalRef = useRef(null);

  const colors = ["bg-yellow-100", "bg-blue-100", "bg-green-100", "bg-red-100", "bg-purple-100", "bg-orange-100", "bg-indigo-100"];
  const flagColors = ["#d1d5db", "#fb923c", "#0000ff", "#ef4444"];
  const flagCategory = [{ flagStatus: 2, name : "Auto Flagged Students"}, { flagStatus: 1, name : "Manually Flagged Students" }, { flagStatus: 3, name: "Flagged Referral" }];

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

  useEffect(() => {
    fetch('/managestudents/api/at-risk-students/')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

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

  return (
    <div className="px-20 mx-auto mt-8">

      {/* Header Section */}
      <div className="mb-6 text-left">
        <h1 className="text-2xl font-bold">At-Risk Students</h1>
        <p className="text-gray-600 mt-2">View an overview of students who have been flagged for various reasons, including automatic system flags, manual flags by administrators, and flags for referral. Click on each category to expand and see detailed information about the students in that group.</p>
        <hr className="mt-4 mb-6" />
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {flagCategory.map((category, index) => (
          <motion.div 
            key={index} 
            className="border border-gray-300 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div 
              className={`p-4 flex justify-between items-center cursor-pointer ${colors[index % colors.length]}`}
              onClick={() => handleToggle(index)}
            >
              <h3 className="font-medium text-lg">{category.name}</h3>
              <span className="text-lg">{activeIndex === index ? '-' : '>'}</span>
            </div>
            
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 text-gray-700 bg-white">
                    <p>Total Students: {data.studentgrades.filter(grade => grade.flagstatus === category.flagStatus).length}</p>
                    
                    <div className="overflow-y-auto max-h-96 mt-4">
                      <table className="table-auto w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border p-2">Student ID</th>
                            <th className="border p-2">Student Name</th>
                            <th className="border p-2">Course ID</th>
                            <th className="border p-2">Course Description</th>
                            <th className="border p-2">Trimester</th>
                            <th className="border p-2">Flag Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.studentgrades
                            .filter(grade => grade.flagstatus === category.flagStatus)
                            .map((grade, studentIndex) => {
                              const student = data.students.find(student => student.studentid === grade.studentid);
                              const course = data.courses.find(course => course.courseid === grade.courseid);
                              return (
                                <motion.tr 
                                  key={studentIndex} 
                                  className="text-center"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <td className="border p-2">{student.studentid}</td>
                                  <td className="border p-2">{student.lastname}, {student.firstname}</td>
                                  <td className="border p-2">{course.courseid}</td>
                                  <td className="border p-2">{course.classdescription}</td>
                                  <td className="border p-2">{grade.trimester}</td>
                                  <td className="border p-2">
                                    <motion.div 
                                      className="flex justify-center items-center h-full"
                                      whileHover={{ scale: 1.2 }}
                                    >
                                      <svg
                                        className="w-8 h-8"
                                        viewBox="0 0 64 64"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <line x1="10" y1="5" x2="10" y2="60" stroke="black" strokeWidth="2" />
                                        <polygon points="10,5 40,15 10,25" fill={flagColors[grade.flagstatus]} />
                                      </svg>
                                    </motion.div>
                                  </td>
                                </motion.tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && selectedStudent && (
          <motion.div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              ref={modalRef} 
              className="bg-white p-6 rounded-lg w-96"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AtRiskStudents;
