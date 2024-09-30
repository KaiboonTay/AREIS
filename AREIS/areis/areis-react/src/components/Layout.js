// src/components/Layout.js
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Layout.css';


const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Navbar />
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
