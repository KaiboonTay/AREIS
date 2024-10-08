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
        <Route path="managestudents/trigger-at-risk/" element={<TriggerAtRisk/>} />
        {/* <Route path="/managestudents/trigger-at-risk/" element={<CourseList/>} /> */}
        
      </Route>
      <Route path="/courselist" element={<CourseList />} />
      <Route path="/login" element={<Login />} />
    </Routes>
    </>
  );
};

export default App;