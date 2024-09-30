// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Make sure to create this CSS file to style the sidebar

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>AREIS</h2>
      </div>
      <ul className="sidebar-links">
        <li>
          <Link to="/">
            <span role="img" aria-label="home">🏠</span> Home
          </Link>
        </li>
        <li>
          <Link to="/about">
            <span role="img" aria-label="about">🔎</span> Search
          </Link>
        </li>
        <li>
          <Link to="/about">
            <span role="img" aria-label="at-about">🚩</span> At-Risk Students
          </Link>
        </li>
        <li>
          <Link to="/courses">
            <span role="img" aria-label="courses">📌</span> Trigger At-Risk
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
