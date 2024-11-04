import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function StudentProfile() {
    const { studentid } = useParams();
    const [studentData, setStudentData] = useState(null);
    const [error, setError] = useState(null);
    const flagColors = ["#d1d5db", "#fb923c", "#0000ff", "#ef4444"]; // Gray, Orange, Blue, Red

    

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

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!studentData) return <p>Loading...</p>;

    return (
        <div>
            <h2>{studentData.student.firstname} {studentData.student.lastname}</h2>
            <p><strong>Student ID:</strong> {studentData.student.studentid}</p>
            <p><strong>Email:</strong> {studentData.student.email}</p>
            <p><strong>Phone No.:</strong> {studentData.student.phoneno}</p>
            <p><strong>Grades: </strong></p>
                <div className="overflow-y-auto max-h-96 mt-4">
                    <table className="table-auto w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Course ID</th>
                            <th className="border p-2">Course Description</th>
                            <th className="border p-2">Journal 1</th>
                            <th className="border p-2">Journal 2</th>
                            <th className="border p-2">Assessment 1</th>
                            <th className="border p-2">Assessment 2</th>
                            <th className="border p-2">Assessment 3</th>
                            <th className="border p-2">Current Grade</th>
                            <th className="border p-2">Final Grade</th>
                            <th className="border p-2">Flag Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        { studentData.studentgrades
                        .map((grade)=> {
                            const course = studentData.courses.find(course => course.courseid === grade.courseid);
                        return (
                       
                            <tr className="text-center">
                                <td className="border p-2">{grade.courseid}</td>
                                <td className="border p-2">{course.classdescription}</td>
                                <td className="border p-2">{grade.journal1}</td>
                                <td className="border p-2">{grade.journal2}</td>
                                <td className="border p-2">{grade.assessment1}</td>
                                <td className="border p-2">{grade.assessment2}</td>
                                <td className="border p-2">{grade.assessment3}</td>
                                <td className="border p-2">{grade.currentscore}</td>
                                <td className="border p-2">{grade.finalgrade}</td>
                                <td className="border p-2">
                                  <div className="flex justify-center items-center h-full">
                                  {grade.flagstatus === 2 || grade.flagstatus === 0 ? (
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
                            );})
                          }
                      </tbody>
                    </table>
                  </div>


        </div>
    );
}

export default StudentProfile;