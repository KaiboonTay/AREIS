import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const TriggerAtRisk = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({ courses: [], students: [], studentsgrades: [] });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [emailStatus, setEmailStatus] = useState("");
  const modalRef = useRef(null);

  const colors = ["bg-yellow-100", "bg-blue-100", "bg-green-100", "bg-red-100"];
  const flagColors = ["#d1d5db", "#fb923c", "#0000ff", "#ef4444"]; // Gray, Orange, Blue, Red

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const openModal = (student, courseid) => {
    setSelectedStudent({ ...student, courseid });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const cleanHeader = (header) => {
    return header.replace(/\s*\(.*?\)/, "").trim(); // Removes parentheses and their contents
  };

  const fetchTriggerAtRiskData = async () => {
    try {
      const response = await fetch("/managestudents/api/trigger-at-risk/");
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchTriggerAtRiskData();
  }, []);

  return (
    <div className="px-20 mx-auto mt-8">
      {/* Courses Section */}
      <div className="space-y-4">
        {data.courses.map((course, index) => {
          // Calculate dynamic headers for the current course
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
                <h3 className="font-medium text-lg">
                  {course.courseid} : {course.classdescription}
                </h3>
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
                    <div className="overflow-y-auto max-h-96 mt-4">
                      <table className="table-auto w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border p-2">First Name</th>
                            <th className="border p-2">Surname</th>
                            <th className="border p-2">Phone No.</th>
                            <th className="border p-2">Email Address</th>
                            {/* Render dynamic headers */}
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
                                  <td className="border p-2">{student?.firstname || "N/A"}</td>
                                  <td className="border p-2">{student?.lastname || "N/A"}</td>
                                  <td className="border p-2">{student?.phoneno || "N/A"}</td>
                                  <td className="border p-2">{student?.email || "N/A"}</td>
                                  {/* Render dynamic assessment values */}
                                  {dynamicHeaders.map((header, i) => (
                                    <td key={i} className="border p-2">
                                      {assessments[header] !== undefined ? assessments[header] : null}
                                    </td>
                                  ))}
                                  <td className="border p-2">{grade.currentscore || "N/A"}</td>
                                  <td className="border p-2">{grade.finalgrade || "N/A"}</td>
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
    </div>
  );
};

export default TriggerAtRisk;
