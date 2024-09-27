import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function CourseList() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetch('/managestudents/courses/')
            .then(response => response.json())
            .then(data => setCourses(data));
    }, []);

    return (
        <div>
            <h1>Courses</h1>
            {courses.map(course => (
                <h2 key={course.courseid}>
                    <Link to={`/courses/${course.courseid}/students`}>
                        {course.courseid} : {course.classdescription}
                    </Link>
                </h2>
            ))}
        </div>
    );
}

export default CourseList;