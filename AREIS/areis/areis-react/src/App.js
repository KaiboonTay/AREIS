// src/App.js
import React from 'react';
<<<<<<< Updated upstream
import Home from './pages/Home'; // Adjusted path to Home.js in src
import About from './pages/About'; // Adjusted path to About.js in src

import { Route, Routes } from "react-router-dom";
import Login from './pages/login/Login';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/dashboard/Dashboard';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
=======

// import Home from './pages/Home'; // Adjusted path to Home.js in src
// import About from './pages/About'; // Adjusted path to About.js in src
// import CourseList from './pages/managestudents/CourseList';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/dashboard/Dashboard';
import { Route, Routes } from 'react-router-dom';
import TriggerAtRisk from './pages/trigger-at-rick/TriggerAtRisk';

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
        <Route path="/trigger-at-risk" element={<TriggerAtRisk/>} />
      </Route>
      {/* <Route path="/login" element={<Login />} /> */}
    </Routes>
>>>>>>> Stashed changes
    </>
  );
};

export default App;