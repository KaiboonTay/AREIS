import React, { useState, useEffect, useRef } from 'react';

const TriggerAtRisk = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({ courses: [], students: [], studentsgrades: [] });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [emailStatus, setEmailStatus] = useState(''); // For displaying email success or failure message
  const modalRef = useRef(null);

  const colors = [
    "bg-yellow-100", "bg-blue-100", "bg-green-100", 
    "bg-red-100", "bg-purple-100", "bg-orange-100", 
    "bg-indigo-100"
  ];

  const flagColors = ["#d1d5db", "#facc15", "#fb923c", "#ef4444"]; // Gray, Yellow, Orange, Red

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

  function getCSRFToken() {
    let csrfToken = null;
    if (document.cookie && document.cookie !== '') {
        document.cookie.split(';').forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                csrfToken = decodeURIComponent(value);
            }
        });
    }
    return csrfToken;
}

  // Function to handle flagging and sending email
  const handleFlagClick = async (student) => {
    try {
        const csrfToken = getCSRFToken();  // Retrieve the CSRF token
        console.log("Sending email to: ", student.email);  // Log the email for debugging
        console.log("CSRF Token: ", csrfToken);  // Log the CSRF token

        const response = await fetch('/managestudents/trigger-at-risk/send-email/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,  // Add the CSRF token to the headers
            },
            body: JSON.stringify({ email: student.email }),
        });

        const result = await response.json();
        if (response.ok) {
            console.log("Email sent successfully:", result);
            setEmailStatus('Email sent successfully');
        } else {
            console.error("Failed to send email:", result.error);
            setEmailStatus(`Failed to send email: ${result.error}`);
        }
    } catch (error) {
        console.error('Error sending email:', error);
        setEmailStatus('An error occurred while sending the email.');
    }
};

  useEffect(() => {
    fetch('/managestudents/api/trigger-at-risk/')
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
      <div className="space-y-4">
        {data.courses.map((course, index) => (
          <div key={index} className="border border-gray-300 rounded-lg">
            <div
              className={`p-4 flex justify-between items-center cursor-pointer ${colors[index % colors.length]}`}
              onClick={() => handleToggle(index)}
            >
              <h3 className="font-medium text-lg">{course.courseid} : {course.classdescription}</h3>
              <span className="text-lg">{activeIndex === index ? '-' : '>'}</span>
            </div>

            <div className={`overflow-hidden transition-max-height duration-500 ease-in-out ${activeIndex === index ? 'max-h-screen' : 'max-h-0'}`}>
              {activeIndex === index && (
                <div className="p-4 text-gray-700 bg-white">
                  <p>Total Students: {data.studentsgrades.filter(grade => grade.courseid === course.courseid).length}</p>

                  <div className="overflow-y-auto max-h-96 mt-4">
                    <table className="table-auto w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border p-2">First Name</th>
                          <th className="border p-2">Surname</th>
                          <th className="border p-2">Journal 1</th>
                          <th className="border p-2">Journal 2</th>
                          <th className="border p-2">Assessment 1</th>
                          <th className="border p-2">Assessment 2</th>
                          <th className="border p-2">Assessment 3</th>
                          <th className="border p-2">Current Grade</th>
                          <th className="border p-2">Final Grade</th>
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
                                <td className="border p-2">{grade.journal1}</td>
                                <td className="border p-2">{grade.journal2}</td>
                                <td className="border p-2">{grade.assessment1}</td>
                                <td className="border p-2">{grade.assessment2}</td>
                                <td className="border p-2">{grade.assessment3}</td>
                                <td className="border p-2">{grade.currentscore}</td>
                                <td className="border p-2">{grade.finalgrade}</td>
                                <td className="border p-2">{student.phoneno}</td>
                                <td className="border p-2">{student.email}</td>
                                <td className="border p-2">
                                  <div className="flex justify-center items-center h-full">
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

      {isModalOpen && (
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
             {/* Show email status message */}
             {emailStatus && <p className="mt-4 text-center">{emailStatus}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default TriggerAtRisk;
