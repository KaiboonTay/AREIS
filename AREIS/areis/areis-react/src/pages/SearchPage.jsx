import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

function SearchPage() {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('name');
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch(`/managestudents/api/students/?search=${query}`);
                if (!response.ok) throw new Error("Failed to fetch students data");

                const data = await response.json();
                setStudents(data);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        if (query) fetchStudents();
    }, [query]);

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Search Results for "{query}"</h2>
            {Array.isArray(students) && students.length > 0 ? (
                <ul className="space-y-4">
                    {students.map((student) => (
                        <li key={student.studentid}>
                            <Link
                                to={`/managestudents/studentprofile/${student.studentid}`}
                                className="no-underline block bg-[#f0f0f0] rounded-lg shadow-md p-6 hover:bg-gray-100 hover:shadow-lg transition-all flex flex-col items-start space-y-2 w-full max-w-lg"
                            >
                                <div className="text-2xl font-semibold text-blue-600">
                                    {student.firstname} {student.lastname}
                                </div>
                                <div className="text-gray-700 text-x1 flex gap-4"> 
                                    <span><strong>ID:</strong> {student.studentid}</span>
                                    <span><strong>Program:</strong> {student.acadprogdesc}</span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 text-lg mt-4">No students found.</p>
            )}
        </div>
    );
}

export default SearchPage;