import { FaSearch } from "react-icons/fa"; // Importing FaSearch for search icon
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query) {
      navigate(`managestudents/search?name=${query}`);
      setQuery(""); // Clear the search bar after navigating
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = () => {
    // Perform logout logic here
    navigate("/logout");
  };

  return (
    <div className="flex items-center w-full p-4 bg-white shadow-md">
      {/* Left Side: Welcome message */}
      <div className="flex-shrink-0 mr-4">
        <h1 className="text-2xl font-bold">Welcome</h1>
        <p className="text-gray-500">Early At-Risk Intervention Strategy, NAIHE</p>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-grow flex justify-center">
        <div className="flex items-center border-2 border-gray-300 rounded-full bg-gray-100 shadow-md w-full max-w-xl px-4 py-2">
          <input
            type="text"
            placeholder="Search for a student..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="p-2 outline-none bg-transparent flex-grow text-gray-700 truncate"
          />
          {/* Search Icon */}
          <button
            onClick={handleSearch}
            className="p-2 flex-shrink-0"
          >
            <FaSearch className="text-gray-500 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Right Side: Logout Button */}
      <div className="flex items-center ml-4">
        <button
          onClick={handleLogout}
          className="flex items-center border-2 border-gray-300 rounded-full bg-gray-100 shadow-md px-6 py-2 text-gray-700 font-semibold hover:bg-blue-500 hover:text-white transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;