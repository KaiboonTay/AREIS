import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const TriggerAtRisk = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({ courses: [], students: [], studentsgrades: [] });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [emailStatus, setEmailStatus] = useState(""); // For displaying email success or failure message
  const modalRef = useRef(null);

  const colors = [
    "bg-yellow-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-red-100",
    "bg-purple-100",
    "bg-orange-100",
    "bg-indigo-100",
  ];

  const flagColors = ["#d1d5db", "#fb923c", "#0000ff", "#ef4444"]; // Gray, Orange, Blue, Red

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const openModal = (student, courseid) => {
    console.log("Student object passed to modal:", student);
    console.log("Course ID passed to modal:", courseid);
    setSelectedStudent({ ...student, courseid }); // Set both student and course ID
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

        // Close the modal
        setIsModalOpen(false);

        // Display success message as a notification
        setEmailStatus("Email sent successfully");
        setTimeout(() => setEmailStatus(""), 5000); // Automatically hide after 5 seconds

        // Refresh the student grades data to update the flag status
        const updatedDataResponse = await fetch("/managestudents/api/trigger-at-risk/");
        const updatedData = await updatedDataResponse.json();
        setData(updatedData); // Update the data state to reflect changes in the UI
      } else {
        console.error("Failed to send email:", result.error);
        setEmailStatus(`Failed to send email: ${result.error}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setEmailStatus("An error occurred while sending the email.");
    }
  };

  useEffect(() => {
    fetch("/managestudents/api/trigger-at-risk/")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);


  const cleanHeader = (header) => {
    // Remove everything in parentheses and trim
    let cleanedHeader = header.replace(/\s*\(.*?\)/, "").trim();
  
    // If the header starts with "Assessment", truncate after "Assessment X"
    const assessmentMatch = cleanedHeader.match(/^(Assessment \d+)/);
    if (assessmentMatch) {
      cleanedHeader = assessmentMatch[1];
    }
  
    return cleanedHeader;
  };


  return (
    <div className="px-20 mx-auto mt-8">
      {/* Notification for email status */}
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

      {/* Page Header */}
      <div className="mb-6 text-left">
        <h1 className="text-2xl font-bold">Manual Trigger At-Risk</h1>
        <p className="text-gray-600 mt-2">
          Identify and flag students needing attention. Review the master list or select a course to
          see enrolled students and manually trigger at-risk flags.
        </p>
        <hr className="mt-4 mb-6" />
      </div>

      {/* Masterlist Header */}
      <div className="mb-6 text-center mt-4">
        <h2 className="text-xl font-semibold">Masterlist</h2>
        <p className="text-gray-600 mt-2">Review the complete master list of students.</p>
      </div>

      {/* Master List Section */}
      <motion.div
        className="border border-gray-300 rounded-lg"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="p-4 flex justify-between items-center cursor-pointer"
          onClick={() => handleToggle(-1)}
        >
          <h3 className="font-medium text-lg">UON Students: Master List</h3>
          <span className="text-lg">{activeIndex === -1 ? "-" : ">"}</span>
        </div>
        <motion.div
          initial={{ maxHeight: 0 }}
          animate={{ maxHeight: activeIndex === -1 ? "100vh" : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="overflow-hidden transition-max-height"
        >
          {activeIndex === -1 && (
            <div className="p-4 text-gray-700 bg-white">
              <div className="flex justify-between items-center">
                <p>Total Students: {data.studentsgrades.length}</p>

                {/* Legend for Flag Status*/}
                <div className="text-center mt-2 mb-2">
                  <div className="flex justify-right space-x-4 items-center">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                        <line x1="10" y1="5" x2="10" y2="60" stroke="black" strokeWidth="2" />
                        <polygon points="10,5 40,15 10,25" fill="blue" />
                      </svg>
                      <span>Auto flagged</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                        <line x1="10" y1="5" x2="10" y2="60" stroke="black" strokeWidth="2" />
                        <polygon points="10,5 40,15 10,25" fill="orange" />
                      </svg>
                      <span>Manually flagged</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                        <line x1="10" y1="5" x2="10" y2="60" stroke="black" strokeWidth="2" />
                        <polygon points="10,5 40,15 10,25" fill="#ef4444" />
                      </svg>
                      <span>Responded</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                        <line x1="10" y1="5" x2="10" y2="60" stroke="black" strokeWidth="2" />
                        <polygon points="10,5 40,15 10,25" fill="green" />
                      </svg>
                      <span>Acknowledged</span>
                    </div>
                  </div>
                </div>

              </div>
              <div className="overflow-y-auto max-h-96 mt-4">
                <table className="table-auto w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">Student ID</th>
                      <th className="border p-2">First Name</th>
                      <th className="border p-2">Surname</th>
                      <th className="border p-2">Phone No.</th>
                      <th className="border p-2">Email Address</th>
                      <th className="border p-2">Course ID</th>
                      <th className="border p-2">Course Description</th>
                      <th className="border p-2">Current Grade</th>
                      <th className="border p-2">Final Grade</th>
                      <th className="border p-2">Flag Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.studentsgrades.map((grade, studentIndex) => {
                      const student = data.students.find(
                        (student) => student.studentid === grade.studentid
                      );
                      const course = data.courses.find(
                        (course) => course.courseid === grade.courseid
                      );

                      if (!student || !course) return null;

                      return (
                        <tr key={studentIndex} className="text-center">
                          <td className="border p-2">{student.studentid}</td>
                          <td className="border p-2">{student.firstname}</td>
                          <td className="border p-2">{student.lastname}</td>
                          <td className="border p-2">{student.phoneno}</td>
                          <td className="border p-2">{student.email}</td>
                          <td className="border p-2">{grade.courseid}</td>
                          <td className="border p-2">{course.classdescription}</td>
                          <td className="border p-2">{grade.currentscore}</td>
                          <td className="border p-2">{grade.finalgrade}</td>
                          <td className="border p-2">
                            <div className="flex justify-center items-center h-full">
                              {(grade.flagstatus === 1 || grade.flagstatus === 3) ? (
                                <svg
                                  className="w-8 h-8"
                                  viewBox="0 0 64 64"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <line
                                    x1="10"
                                    y1="5"
                                    x2="10"
                                    y2="60"
                                    stroke="black"
                                    strokeWidth="2"
                                  />
                                  <polygon
                                    points="10,5 40,15 10,25"
                                    fill={flagColors[grade.flagstatus]}
                                  />
                                </svg>
                              ) : (
                                <button
                                  onClick={() => openModal(student, grade.courseid)}
                                  className="flex items-center justify-center"
                                >
                                  <svg
                                    className="w-8 h-8"
                                    viewBox="0 0 64 64"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <line
                                      x1="10"
                                      y1="5"
                                      x2="10"
                                      y2="60"
                                      stroke="black"
                                      strokeWidth="2"
                                    />
                                    <polygon
                                      points="10,5 40,15 10,25"
                                      fill={flagColors[grade.flagstatus]}
                                    />
                                  </svg>
                                </button>
                              )}
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
        </motion.div>
      </motion.div>

      {/* Courses Header */}
      <div className="mb-6 text-center mt-4">
        <h2 className="text-xl font-semibold">Courses</h2>
        <p className="text-gray-600 mt-2">
          Select a course to view enrolled students and manually trigger at-risk flags.
        </p>
      </div>

      {/* Courses Section */}
      <div className="space-y-4">
        {data.courses.map((course, index) => {
          // dynamic headers for the current course
          const dynamicHeaders = data.studentsgrades.reduce((headers, grade) => {
            if (grade.courseid === course.courseid) {
              const keys = Object.keys(grade.assessments || {});
              keys.forEach((key) => {
                if (!headers.includes(key)) headers.push(key);
              });
            }
            return headers;
          }, []);

        return (
          <motion.div
            key={index}
            className="border border-gray-300 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div
              className={`p-4 flex justify-between items-center cursor-pointer ${colors[index % colors.length]}`}
              onClick={() => handleToggle(index)}
            >
              <h3 className="font-medium text-lg">{course.courseid} : {course.classdescription}</h3>
              <span className="text-lg">{activeIndex === index ? "-" : ">"}</span>
            </div>
            <motion.div
              initial={{ maxHeight: 0 }}
              animate={{ maxHeight: activeIndex === index ? "100vh" : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="overflow-hidden transition-max-height"
            >
              {activeIndex === index && (
                <div className="p-4 text-gray-700 bg-white">
                  {/* Total Students*/}
                  <div className="flex justify-between items-center">
                    <p>
                      Total Students: {
                        data.studentsgrades.filter((grade) => grade.courseid === course.courseid).length
                      }
                    </p>

                    {/* Legend for Flag Status*/}
                    <div className="text-center mt-2 mb-2">
                      <div className="flex justify-right space-x-4 items-center">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                            <line x1="10" y1="5" x2="10" y2="60" stroke="black" strokeWidth="2" />
                            <polygon points="10,5 40,15 10,25" fill="blue" />
                          </svg>
                          <span>Auto flagged</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                            <line x1="10" y1="5" x2="10" y2="60" stroke="black" strokeWidth="2" />
                            <polygon points="10,5 40,15 10,25" fill="orange" />
                          </svg>
                          <span>Manually flagged</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                            <line x1="10" y1="5" x2="10" y2="60" stroke="black" strokeWidth="2" />
                            <polygon points="10,5 40,15 10,25" fill="#ef4444" />
                          </svg>
                          <span>Responded</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                            <line x1="10" y1="5" x2="10" y2="60" stroke="black" strokeWidth="2" />
                            <polygon points="10,5 40,15 10,25" fill="green" />
                          </svg>
                          <span>Acknowledged</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-y-auto max-h-96 mt-4">
                    <table className="table-auto w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border p-2">First Name</th>
                          <th className="border p-2">Surname</th>
                          <th className="border p-2">Phone No.</th>
                          <th className="border p-2">Email Address</th>
                          {/* split some part of headers dynamically */}
                          {dynamicHeaders.map((header, i) => (
                            <th key={i} className="border p-2">{cleanHeader(header)}</th>
                          ))}
                          <th className="border p-2">Current Grade</th>
                          <th className="border p-2">Final Grade</th>
                          <th className="border p-2">Flag Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.studentsgrades
                          .filter((grade) => grade.courseid === course.courseid)
                          .map((grade, studentIndex) => {
                            const student = data.students.find(
                              (student) => student.studentid === grade.studentid
                            );

                            const assessments = grade?.assessments || {};
                            
                            

                            return (
                              <tr key={studentIndex} className="text-center">
                                <td className="border p-2">{student.firstname}</td>
                                <td className="border p-2">{student.lastname}</td>
                                <td className="border p-2">{student.phoneno}</td>
                                <td className="border p-2">{student.email}</td>
                                {/* dynamic assessment values */}
                                {dynamicHeaders.map((header, i) => (
                                  <td key={i} className="border p-2">
                                    {assessments[header] !== undefined ? assessments[header] : null}
                                  </td>
                                ))}
                                <td className="border p-2">{grade.currentscore}</td>
                                <td className="border p-2">{grade.finalgrade}</td>
                                <td className="border p-2">
                                  <div className="flex justify-center items-center h-full">
                                    {(grade.flagstatus === 1 || grade.flagstatus === 3) ? (
                                      <svg
                                        className="w-8 h-8"
                                        viewBox="0 0 64 64"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <line
                                          x1="10"
                                          y1="5"
                                          x2="10"
                                          y2="60"
                                          stroke="black"
                                          strokeWidth="2"
                                        />
                                        <polygon
                                          points="10,5 40,15 10,25"
                                          fill={flagColors[grade.flagstatus]}
                                        />
                                      </svg>
                                    ) : (
                                      <button
                                        onClick={() => openModal(student, grade.courseid)}
                                        className="flex items-center justify-center"
                                      >
                                        <svg
                                          className="w-8 h-8"
                                          viewBox="0 0 64 64"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <line
                                            x1="10"
                                            y1="5"
                                            x2="10"
                                            y2="60"
                                            stroke="black"
                                            strokeWidth="2"
                                          />
                                          <polygon
                                            points="10,5 40,15 10,25"
                                            fill={flagColors[grade.flagstatus]}
                                          />
                                        </svg>
                                      </button>
                                    )}
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
            </motion.div>
          </motion.div>
          );
      })}
      </div>

      {/* Modal Section */}
{isModalOpen && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <motion.div
      ref={modalRef}
      className="bg-white p-8 rounded-lg w-full max-w-3xl intervention-form relative" // Add "relative" for positioning the "X" button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Nút "X" để đóng form */}
      <button
        onClick={closeModal} // Gọi hàm closeModal
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold text-2xl"
      >
        &times;
      </button>

      <h2 className="text-2xl font-bold text-center mb-6">"At Risk" Early Intervention Form</h2>
      <form>
        <div className="mb-6 grid grid-cols-2 gap-4">
          {[
            "General English",
            "Math",
            "Time Management",
            "Exam",
            "Writing Skills",
            "Research Skills",
          ].map((skill, i) => (
            <div key={i} className="flex items-center">
              <input
                type="checkbox"
                id={skill.toLowerCase().replace(" ", "-")}
                className="mr-2"
              />
              <label htmlFor={skill.toLowerCase().replace(" ", "-")}>{skill}</label>
            </div>
          ))}
        </div>
        <textarea
          rows="4"
          placeholder="Issues"
          className="w-full border border-gray-300 p-3 rounded-lg mb-6"
        ></textarea>
        <div className="flex justify-center">
          <button
            type="button"
            className="bg-black text-white py-3 px-6 rounded-lg text-lg"
            onClick={() => handleFlagClick(selectedStudent, selectedStudent?.courseid)}
          >
            Save & Flag Student
          </button>
        </div>
      </form>
      {emailStatus && <p className="mt-6 text-center text-lg">{emailStatus}</p>}
    </motion.div>
  </div>
)}
    </div>
  );
};

export default TriggerAtRisk;







