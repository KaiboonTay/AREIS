import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

function SearchPage() {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('name');
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            const response = await fetch(`/managestudents/api/students/?search=${query}`);
            const data = await response.json();
            setStudents(data);
        };

        if (query) fetchStudents();
    }, [query]);

    return (
        <div>
            <h2>Search Results for "{query}"</h2>
            <ul>
                {students.map((student) => (
                    <li key={student.studentid}>
                        <Link to={`/managestudents/studentprofile/${student.studentid}`}>
                        {student.firstname} {student.lastname}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SearchPage;