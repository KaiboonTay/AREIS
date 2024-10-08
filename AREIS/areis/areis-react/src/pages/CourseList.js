import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Accordion } from 'react-bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';


function CourseList() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetch('/managestudents/courses/')
            .then(response => response.json())
            .then(data => setCourses(data));
    }, []);

    return (
        <Layout>
        {/* <div>
            <h1>Courses</h1>
            {courses.map(course => (
                <h2 key={course.courseid}>
                    <Link to={`/courses/${course.courseid}/students`}>
                        {course.courseid} : {course.classdescription}
                    </Link>
                </h2>
            ))}
        </div> */}
        <div>
            <h1>Courses</h1>
            {courses.map(course => (
                <Accordion>
                    <Accordion.Header>
                        <h2>{course.courseid} : {course.classdescription}</h2>
                    </Accordion.Header>
                    <Accordion.Body>
                        <small>Sample body</small>
                    </Accordion.Body>
                </Accordion>
            ))}
        </div>

        </Layout>
    );
}

export default CourseList;