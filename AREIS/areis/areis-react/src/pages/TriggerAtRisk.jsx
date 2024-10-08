import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const TriggerAtRisk = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({ courses: [], students: [], studentsgrades: []});
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
    fetch('/managestudents/trigger-at-risk/')
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

  // const courses = [
  //   {
  //     title: "INFT3800 - Professional Practice in IT",
  //     totalStudents: 20,
  //     lecturer: "Dr. Vincent",
  //     students: [
  //       { firstName: "Ploynapha", surname: "Jampanaun", grade: 55, officialGrade: "P", phone: "12345678", email: "c3423222@uon.edu.au", flag: "🚩" },
  //       { firstName: "Thai Tung", surname: "Mai", grade: 55, officialGrade: "P", phone: "12345678", email: "c3423222@uon.edu.au", flag: "🚩" },
  //       { firstName: "Eugene", surname: "Ngew", grade: 55, officialGrade: "P", phone: "12345678", email: "c3423222@uon.edu.au", flag: "🚩" },
  //       { firstName: "Ploynapha", surname: "Jampanaun", grade: 55, officialGrade: "P", phone: "12345678", email: "c3423222@uon.edu.au", flag: "🚩" },
  //       { firstName: "Thai Tung", surname: "Mai", grade: 55, officialGrade: "P", phone: "12345678", email: "c3423222@uon.edu.au", flag: "🚩" },
  //       { firstName: "Eugene", surname: "Ngew", grade: 55, officialGrade: "P", phone: "12345678", email: "c3423222@uon.edu.au", flag: "🚩" },
  //       { firstName: "Ploynapha", surname: "Jampanaun", grade: 55, officialGrade: "P", phone: "12345678", email: "c3423222@uon.edu.au", flag: "🚩" },
  //       { firstName: "Thai Tung", surname: "Mai", grade: 55, officialGrade: "P", phone: "12345678", email: "c3423222@uon.edu.au", flag: "🚩" },
  //       { firstName: "Eugene", surname: "Ngew", grade: 55, officialGrade: "P", phone: "12345678", email: "c3423222@uon.edu.au", flag: "🚩" },
  //       { firstName: "Ploynapha", surname: "Jampanaun", grade: 55, officialGrade: "P", phone: "12345678", email: "c3423222@uon.edu.au", flag: "🚩" },
  //       { firstName: "Thai Tung", surname: "Mai", grade: 55, officialGrade: "P", phone: "12345678", email: "c3423222@uon.edu.au", flag: "🚩" },
  //       { firstName: "Eugene", surname: "Ngew", grade: 55, officialGrade: "P", phone: "12345678", email: "c3423222@uon.edu.au", flag: "🚩" },
  //       { firstName: "Ploynapha", surname: "Jampanaun", grade: 55, officialGrade: "P", phone: "12345678", email: "c3423222@uon.edu.au", flag: "🚩" },
  //       { firstName: "Thai Tung", surname: "Mai", grade: 55, officialGrade: "P", phone: "12345678", email: "c3423222@uon.edu.au", flag: "🚩" },
  //       { firstName: "Eugene", surname: "Ngew", grade: 55, officialGrade: "P", phone: "12345678", email: "c3423222@uon.edu.au", flag: "🚩" },
  //       // More dummy students...
  //     ],
  //     bgColor: "bg-blue-100",
  //   },
  //   {
  //     title: "INFT3050 - Web Programming",
  //     totalStudents: 25,
  //     lecturer: "Dr. Smith",
  //     students: [
  //       // Data for students in Web Programming...
  //     ],
  //     bgColor: "bg-green-200",
  //   },
  //   {
  //     title: "INFT3080 - Games Design",
  //     totalStudents: 18,
  //     lecturer: "Dr. Johnson",
  //     students: [
  //       // Data for students in Games Design...
  //     ],
  //     bgColor: "bg-red-200",
  //   }
  // ];

  return (
    <div className="px-20 mx-auto mt-8">
      {/* Accordion Items */}
      <div className="space-y-4">
        {data.courses.map((course, index) => (
          <div key={index} className="border border-gray-300 rounded-lg">
            {/* Header */}
            <div 
              className={`p-4 flex justify-between items-center cursor-pointer ${colors[index % colors.length]}`}
              onClick={() => handleToggle(index)}
            >
              <h3 className="font-medium text-lg">{course.courseid} : {course.classdescription}</h3>
              <span className="text-lg">
                {activeIndex === index ? '-' : '>'}
              </span>
            </div>
            
            {/* Content */}
            <div className={`overflow-hidden transition-max-height duration-500 ease-in-out ${activeIndex === index ? 'max-h-screen' : 'max-h-0'}`}>
              {activeIndex === index && (
                <div className="p-4 text-gray-700 bg-white">
                  <p>Total Students: {data.studentsgrades.filter(grade => grade.courseid === course.courseid).length}</p>
                  {/* <p>Lecturer: course.lecturer</p> */}

                  {/* Scrollable Table for students */}
                  <div className="overflow-y-auto max-h-96 mt-4">
                    <table className="table-auto w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border p-2">First Name</th>
                          <th className="border p-2">Surname</th>
                          <th className="border p-2">Grade</th>
                          <th className="border p-2">Official Grade</th>
                          <th className="border p-2">Phone No.</th>
                          <th className="border p-2">Email Address</th>
                          <th className="border p-2">Flag Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        
                         {data.studentsgrades
                          .filter(grade => grade.courseid === course.courseid)
                          .map((grade, studentIndex) => {
                            const student = data.students.find(student => student.studentid === grade.studentid);
                          return (
                            <tr key={studentIndex} className="text-center">
                            <td className="border p-2">{student.firstname}</td>
                            <td className="border p-2">{student.lastname}</td>
                            <td className="border p-2">{grade.gradeinput}</td>
                            <td className="border p-2">{grade.officialgrade}</td>
                            <td className="border p-2">{student.phoneno}</td>
                            <td className="border p-2">{student.email}</td>
                            <td className="border p-2">
                              {/* Flex container to center the flag horizontally and vertically */}
                              <div className="flex justify-center items-center h-full">
                                {/* Button that opens the modal with student details */}
                                <button onClick={() => openModal(student)} className="flex items-center justify-center">
                                  {/* Show yellow flag if grade is below 50 */}
                                  {grade.gradeinput < 50 && (
                                    <span className="relative inline-block">
                                      {/* Flag pole */}
                                      <span className="block w-1 h-6 bg-yellow-400"></span>
                                      {/* Yellow flag */}
                                      <span className="absolute left-1 top-0 w-3 h-3 bg-yellow-400 clip-flag"></span>
                                    </span>
                                  )}
                                  {/* Show no flag if grade is 50 or above */}
                                  {grade.gradeinput >= 50 && (
                                    <span className="relative inline-block">
                                      {/* Flag pole */}
                                      <span className="block w-1 h-6 bg-gray-400"></span>
                                      {/* Gray flag (no flag) */}
                                      <span className="absolute left-1 top-0 w-3 h-3 bg-gray-400 clip-flag"></span>
                                    </span>
                                  )}
                                  {/* Display "Flagged" or "No Flag" text */}
                                  <span className="ml-2">{grade.flagstatus ? "" : ""}</span>
                                </button>
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div ref={modalRef} className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold text-center mb-4">"At Risk" Early Intervention Form</h2>
            <p className="text-center mb-2">Lecturer</p>

            <form>
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TriggerAtRisk;
