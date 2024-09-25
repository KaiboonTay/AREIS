import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="container">
      <Navbar />
      <Sidebar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;