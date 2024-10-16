import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const AtRiskStudents = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({ casecategory: [], studentcases: [], studentgrades: [], students: [] });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const modalRef = useRef(null); // Create a ref to track the modal element

  const colors = ["bg-yellow-100", "bg-blue-100", "bg-green-100", "bg-red-100", "bg-purple-100", "bg-orange-100", "bg-indigo-100"];

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
    fetch('/dashboard/')
        .then(response => response.json())
        .then(data => setData(data));
}, []);

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



  return (
    <div className="px-20 mx-auto mt-8">
      {/* Accordion Items */}
      <div className="space-y-4">
        {data.casecategory.map((category, index) => (
          <div key={index} className="border border-gray-300 rounded-lg">
            {/* Header */}
            <div 
              className={`p-4 flex justify-between items-center cursor-pointer ${colors[index % colors.length]}`}
              onClick={() => handleToggle(index)}
            >
              <h3 className="font-medium text-lg">{category.categoryname}</h3>
              <span className="text-lg">
                {activeIndex === index ? '-' : '>'}
              </span>
            </div>
            
            {/* Content */}
            <div className={`overflow-hidden transition-max-height duration-500 ease-in-out ${activeIndex === index ? 'max-h-screen' : 'max-h-0'}`}>
              {activeIndex === index && (
                <div className="p-4 text-gray-700 bg-white">
                  <p>Total Students: {data.studentcases.filter(studentcase => studentcase.categoryid === category.categoryid).length}</p>
                  {/* <p>Lecturer: course.lecturer</p> */}

                  {/* Scrollable Table for students */}
                  <div className="overflow-y-auto max-h-96 mt-4">
                    <table className="table-auto w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border p-2">Student Name</th>
                          <th className="border p-2">Course No</th>
                          <th className="border p-2">Flag Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        
                         {data.studentcases
                          .filter(studentcase => studentcase.categoryid === category.categoryid)
                          .map((studentcase, studentIndex) => {
                            const student = data.students.find(student => student.studentid === studentcase.studentid);
                            const grade = data.studentgrades.find(grade => grade.studentid === studentcase.studentid);
                          return (
                            <tr key={studentIndex} className="text-center">
                            <td className="border p-2">
                              {/* Flex container to center the flag horizontally and vertically */}
                              <div className="flex justify-center items-center h-full">
                                {/* Button that opens the modal with student details */}
                                <button onClick={() => openModal(student)} className="flex items-center justify-center">
                                  <span className="ml-2">{student.lastname} {student.firstname}</span>
                                </button>
                              </div>
                            </td>
                            <td className="border p-2">{studentcase.courseid}</td>
                            <td className="border p-2">{grade.flagstatus}</td>
                            
                          </tr>
                          
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div ref={modalRef} className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold text-center mb-4">Review Action</h2>

            <div className="mb-4">
                {/* Display student-specific details */}
                <p><strong>Student Name:</strong> {selectedStudent.lastname} {selectedStudent.firstname}</p>
                <p><strong>Student ID:</strong> {selectedStudent.studentid}</p>
                <p><strong>Course:</strong> {
                    (() => {
                        const studentcase = data.studentcases.find(studentcase => studentcase.studentid === selectedStudent.studentid);
                        return (studentcase.courseid);
                    })()
                }</p>
                <p><strong>Trimester:</strong> {
                    (() => {
                        const studentcase = data.studentcases.find(studentcase => studentcase.studentid === selectedStudent.studentid);
                        const grade = data.studentgrades.find(grade => grade.studentid === selectedStudent.studentid && grade.courseid === studentcase.courseid);
                        return (grade.trimester);
                    })()
                }</p>
                <p><strong>Case: </strong> {
                (() => {
                    const studentcase = data.studentcases.find(studentcase => studentcase.studentid === selectedStudent.studentid);
                    const category = data.casecategory.find(category => category.categoryid === studentcase.categoryid);
                    return (category.categoryname);
                })()
                }
                </p>
                
                <p><strong>Grades: </strong></p>
                <div className="overflow-y-auto max-h-96 mt-4">
                    <table className="table-auto w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border p-2">Journal 1</th>
                          <th className="border p-2">Journal 2</th>
                          <th className="border p-2">Assessment 1</th>
                          <th className="border p-2">Assessment 2</th>
                          <th className="border p-2">Assessment 3</th>
                          <th className="border p-2">Current Grade</th>
                          <th className="border p-2">Final Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        
                       { 
                       (() => {
                            const studentcase = data.studentcases.find(studentcase => studentcase.studentid === selectedStudent.studentid);
                            const grade = data.studentgrades.find(grade => grade.studentid === selectedStudent.studentid && grade.courseid === studentcase.courseid);
                            return (
                                <tr className="text-center">
                                <td className="border p-2">{grade.journal1}</td>
                                <td className="border p-2">{grade.journal2}</td>
                                <td className="border p-2">{grade.assessment1}</td>
                                <td className="border p-2">{grade.assessment2}</td>
                                <td className="border p-2">{grade.assessment3}</td>
                                <td className="border p-2">{grade.currentscore}</td>
                                <td className="border p-2">{grade.finalgrade}</td>
                                
                            </tr>
                          );
                        }) ()
                        }
                      </tbody>
                    </table>
                  </div>

                  <form>
                        <div className="flex justify-center">
                        <button
                        type="button"
                        className="bg-black text-white py-2 px-4 rounded"
                        onClick={closeModal}
                        >
                        Save & Flag Student
                        </button>
                        </div>
                    </form>
            </div>
            
            {/* <form>
              <div className="mb-4">
                <div className="flex items-center">
                  <input type="checkbox" id="general-english" className="mr-2" />
                  <label htmlFor="general-english">General English</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="math" className="mr-2" />
                  <label htmlFor="math">Math</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="time-management" className="mr-2" />
                  <label htmlFor="time-management">Time Management</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="exam" className="mr-2" />
                  <label htmlFor="exam">Exam</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="writing-skills" className="mr-2" />
                  <label htmlFor="writing-skills">Writing Skills</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="research-skills" className="mr-2" />
                  <label htmlFor="research-skills">Research Skills</label>
                </div>
              </div>

              <div className="mb-4">
                <textarea
                  rows="4"
                  placeholder="Issues"
                  className="w-full border border-gray-300 p-2 rounded-lg"
                ></textarea>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  className="bg-black text-white py-2 px-4 rounded"
                  onClick={closeModal}
                >
                  Save & Flag Student
                </button>
              </div>
            </form> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AtRiskStudents;
