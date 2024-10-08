// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'; // Adjusted path to Home.js in src
import About from './pages/About'; // Adjusted path to About.js in src
import CourseList from './pages/managestudents/CourseList';
import SendEmail from './pages/managestudents/SendEmail';
import StudentForm from './pages/managestudents/StudentForm';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/sendemail" element={<SendEmail />} />
        <Route path="/student-form" element={<StudentForm />} />
      </Routes>
    </Router>
  );
};

export default App;