// src/App.js
import React from 'react';

// import Home from './pages/Home'; // Adjusted path to Home.js in src
// import About from './pages/About'; // Adjusted path to About.js in src
// import CourseList from './pages/managestudents/CourseList';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import { Route, Routes } from 'react-router-dom';
import TriggerAtRisk from './pages/TriggerAtRisk';
import Login from './pages/Login';
import CourseList from './pages/CourseList';
import UploadCsv from './pages/UploadCsv';
import UploadGrades from './pages/UploadGrades';
import AtRiskStudents from './pages/AtRiskStudents';
import StudentForm from './pages/StudentForm';

const App = () => {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<Home />} />
    //     <Route path="/about" element={<About />} />
    //     <Route path="/managestudents/courses" element={<CourseList />} />
    //   </Routes>
    // </Router>
    <>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="managestudents/at-risk-students/" element={<AtRiskStudents/>} />
        <Route path="managestudents/trigger-at-risk/" element={<TriggerAtRisk/>} />
        {/* <Route path="/managestudents/trigger-at-risk/" element={<CourseList/>} /> */}
        <Route path="managedata/upload-csv/" element={<UploadCsv/>} />
        <Route path="managedata/upload-grades/" element={<UploadGrades/>} />
      </Route>
      <Route path="/courselist" element={<CourseList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/studentform" element={<StudentForm/>} />
    </Routes>
    </>
  );
};

export default App;