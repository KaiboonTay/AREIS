import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

function StudentProfile() {
    const [activeIndex, setActiveIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { studentid } = useParams();
    const [studentData, setStudentData] = useState(null);
    const [error, setError] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [emailStatus, setEmailStatus] = useState(""); // Added to track email status
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

    const openModal = (student, courseid) => {
        setSelectedStudent({...student, courseid});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
    };

    const getCSRFToken = () => {
        let csrfToken = null;
        if (document.cookie && document.cookie !== "") {
          document.cookie.split(";").forEach((cookie) => {
            const [name, value] = cookie.trim().split("=");
            if (name === "csrftoken") {
              csrfToken = decodeURIComponent(value);
            }
          });
        }
        return csrfToken;
      };

      const handleFlagClick = async () => {
        try {
            const csrfToken = getCSRFToken();
    
            const selectedOptions = Array.from(
                document.querySelectorAll(".intervention-form input[type='checkbox']:checked")
            ).map((checkbox) => checkbox.nextSibling.textContent.trim());
    
            const issues = document.querySelector(".intervention-form textarea").value.trim();
    
            console.log("Selected Options:", selectedOptions);
            console.log("Issues:", issues);
    
            const response = await fetch("/managestudents/trigger-at-risk/send-email/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify({
                    email: selectedStudent.email,
                    course: selectedStudent.courseid,
                    student_id: selectedStudent.studentid,
                    selected_options: selectedOptions,
                    issues: issues,
                }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                console.log("Email sent successfully:", result);

                setIsModalOpen(false);

                // Set notification to display success message
                setEmailStatus("Email sent successfully!");
                setTimeout(() => setEmailStatus(""), 5000); // Auto-hide notification after 5 seconds

    
                // Fetch updated student profile data for the current student
                const updatedDataResponse = await fetch(`/managestudents/api/studentprofile/${studentid}/`);
                if (updatedDataResponse.ok) {
                    const updatedData = await updatedDataResponse.json();
                    setStudentData(updatedData); // Update the student profile data
                } else {
                    console.error("Failed to fetch updated student data");
                    setEmailStatus("Email sent, but failed to refresh student data.");
                }
                
            } else {
                console.error("Failed to send email:", result.error);
                setEmailStatus(`Failed to send email: ${result.error}`);
            }
        } catch (error) {
            console.error("Error sending email:", error);
            setEmailStatus("An error occurred while sending the email.");
        }
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
              {/* Global Notification */}
              {emailStatus && (
                <div
                    className={`fixed top-4 right-4 ${
                        emailStatus.includes("successfully") ? "bg-green-500" : "bg-red-500"
                    } text-white p-4 rounded-lg shadow-md`}
                    role="alert"
                >
                    <span>{emailStatus}</span>
                    <button
                        className="ml-4 text-lg font-bold"
                        onClick={() => setEmailStatus("")}
                    >
                        ×
                    </button>
                </div>
            )}
            {/*Student Profile*/}
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
                                                <button onClick={() => openModal(studentData.student, grade.courseid)} className="flex items-center justify-center">
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
                                                </svg> 
                                            }
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal Popup */}
            {isModalOpen && selectedStudent && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div ref={modalRef} className="bg-white p-6 rounded-lg w-96 intervention-form">
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
                                <button type="button" className="bg-black text-white py-2 px-4 rounded" onClick={handleFlagClick}>
                                    Save & Flag Student
                                </button>
                            </div>
                        </form>
                        {emailStatus && <p className="mt-4 text-center">{emailStatus}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};


export default StudentProfile;