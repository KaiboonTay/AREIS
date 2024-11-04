// src/App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import ManageUser from './pages/ManageUser/ManageUser';
import AddUser from './pages/ManageUser/AddUser';
import ViewEditUser from './pages/ManageUser/ViewEditUser';
import TriggerAtRisk from './pages/TriggerAtRisk';
import Login from './pages/Login';
import CourseList from './pages/CourseList';
import UploadCsv from './pages/UploadCsv';
import UploadGrades from './pages/UploadGrades';
import AtRiskStudents from './pages/AtRiskStudents';
import StudentForm from './pages/StudentForm';
import NeedHelp from './pages/NeedHelp'; // Import the NeedHelp component
import SearchPage from './pages/SearchPage';
import StudentProfile from './pages/StudentProfile';

const App = () => {
  return (
    <Routes>
      {/* Main layout for the app */}
      <Route path="/" element={<MainLayout />}>
        {/* Root dashboard page */}
        <Route index element={<Dashboard />} />
        
        {/* Nested route for managing users */}
        <Route path="manageuser" element={<ManageUser />}>
          <Route path="add-user" element={<AddUser />} />
          <Route path="view-edit-user" element={<ViewEditUser />} />
        </Route>

        {/* Other routes */}
        <Route path="managestudents/at-risk-students" element={<AtRiskStudents />} />
        <Route path="managestudents/trigger-at-risk" element={<TriggerAtRisk />} />
        <Route path="managedata/upload-csv" element={<UploadCsv />} />
        <Route path="managedata/upload-grades" element={<UploadGrades />} />
        <Route path="courselist" element={<CourseList />} />
        <Route path="managestudents/student-form" element={<StudentForm />} />
        
        {/* Route for login */}
        <Route path="users/login" element={<Login />} />
        
        {/* Route for Need Help */}
        <Route path="need-help" element={<NeedHelp />} />
        {/* Route for Search bar */}
        <Route path="managestudents/search" element={<SearchPage />} />
        <Route path="managestudents/studentprofile/:studentid" element={<StudentProfile />} />
      </Route>
    </Routes>
  );
};

export default App;
