import React, { useState, useEffect, useRef } from 'react';

const TriggerAtRisk = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({ courses: [], students: [], studentsgrades: [] });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [emailStatus, setEmailStatus] = useState(''); // For displaying email success or failure message
  const modalRef = useRef(null);

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
    setEmailStatus('');
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
    fetch('/managestudents/trigger-at-risk/')
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
      {/* Accordion Items */}
      <div className="space-y-4">
        {data.courses.map((course, index) => (
          <div key={index} className="border border-gray-300 rounded-lg">
            <div 
              className={`p-4 flex justify-between items-center cursor-pointer ${colors[index % colors.length]}`}
              onClick={() => handleToggle(index)}
            >
              <h3 className="font-medium text-lg">{course.courseid} : {course.classdescription}</h3>
              <span className="text-lg">
                {activeIndex === index ? '-' : '>'}
              </span>
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
                                  <div className="flex justify-center items-center h-full">
                                    <button onClick={() => openModal(student)} className="flex items-center justify-center">
                                      {grade.gradeinput < 50 && (
                                        <span className="relative inline-block">
                                          <span className="block w-1 h-6 bg-yellow-400"></span>
                                          <span className="absolute left-1 top-0 w-3 h-3 bg-yellow-400 clip-flag"></span>
                                        </span>
                                      )}
                                      {grade.gradeinput >= 50 && (
                                        <span className="relative inline-block">
                                          <span className="block w-1 h-6 bg-gray-400"></span>
                                          <span className="absolute left-1 top-0 w-3 h-3 bg-gray-400 clip-flag"></span>
                                        </span>
                                      )}
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
                  onClick={() => handleFlagClick(selectedStudent)} 
                >
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
