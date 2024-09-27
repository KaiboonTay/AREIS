import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';

function CourseList() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetch('/managestudents/courses/')
            .then(response => response.json())
            .then(data => setCourses(data));
    }, []);

    return (
        <Layout>
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
        </Layout>
    );
}

export default CourseList;