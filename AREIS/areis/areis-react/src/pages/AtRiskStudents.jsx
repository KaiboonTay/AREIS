import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const AtRiskStudents = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({ courses: [], studentgrades: [], students: [] });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const modalRef = useRef(null); // Create a ref to track the modal element

  const colors = ["bg-yellow-100", "bg-blue-100", "bg-green-100", "bg-red-100", "bg-purple-100", "bg-orange-100", "bg-indigo-100"];
  const flagColors = ["#d1d5db", "#fb923c", "#0000ff", "#ef4444"]; // Gray, Yellow, Orange, Red
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
        {flagCategory.map((category, index) => (
          <div key={index} className="border border-gray-300 rounded-lg">
            {/* Header */}
            <div 
              className={`p-4 flex justify-between items-center cursor-pointer ${colors[index % colors.length]}`}
              onClick={() => handleToggle(index)}
            >
              <h3 className="font-medium text-lg">{category.name}</h3>
              <span className="text-lg">
                {activeIndex === index ? '-' : '>'}
              </span>
            </div>
            
            {/* Content */}
            <div className={`overflow-hidden transition-max-height duration-500 ease-in-out ${activeIndex === index ? 'max-h-screen' : 'max-h-0'}`}>
              {activeIndex === index && (
                <div className="p-4 text-gray-700 bg-white">
                  <p>Total Students: {data.studentgrades.filter(grade => grade.flagstatus === category.flagStatus).length}</p>
                  {/* <p>Lecturer: course.lecturer</p> */}

                  {/* Scrollable Table for students */}
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
                            <tr key={studentIndex} className="text-center">
                            <td className="border p-2">{student.studentid}</td>
                            <td className="border p-2">{student.lastname}, {student.firstname}</td>
                            <td className="border p-2">{course.courseid}</td>
                            <td className="border p-2">{course.classdescription}</td>
                            <td className="border p-2">{grade.trimester}</td>
                            <td className="border p-2">
                                  <div className="flex justify-center items-center h-full">
                                    {grade.flagstatus === 2 ? (
                                      <button onClick={() => openModal(student)} className="flex items-center justify-center">
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
                </div>
              )}
            </div>
          </div>
        ))}
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
};

export default AtRiskStudents;
