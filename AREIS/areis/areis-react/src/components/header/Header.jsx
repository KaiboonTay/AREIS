
import { FaCog } from "react-icons/fa"; // Icon for settings
import { MdKeyboardArrowDown } from "react-icons/md"; // Icon for dropdown arrow
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';





const Header = () => {

  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && query) {
      navigate(`managestudents/search?name=${query}`);
    }
  };

  return (
    <div className="flex justify-between items-center w-full p-4 bg-white shadow-md">
      {/* Left Side: Welcome message */}
      <div>
        <h1 className="text-2xl font-bold">Welcome Dr Vincent</h1>
        <p className="text-gray-500">Early At-Risk Intervention Strategy, NAIHE</p>
      </div>

      {/* Right Side: Settings and User Profile */}
      <div className="flex items-center space-x-4">

        {/* Search Bar */}
        <input
            type="text"
            placeholder="Enter student name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="p-2 border rounded-md"
        />

        {/* Settings Icon */}
        <FaCog className="text-2xl cursor-pointer" />

        {/* User Profile */}
        <div className="flex items-center space-x-2">
          <img
            src="https://via.placeholder.com/40"
            alt="User Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          {/* Dropdown Arrow */}
          <MdKeyboardArrowDown className="text-xl cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Header;
