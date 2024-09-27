// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul>
        <li><Link to="/">🏠 Home</Link></li>
        <li><Link to="/about">🔎 Search</Link></li>
        <li><Link to="/about">🚩 At Risk Students</Link></li>
        <li><Link to="/courses">📌 Trigger At-Risk</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;