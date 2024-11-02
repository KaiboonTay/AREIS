// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { FaHome, FaSearch, FaUserAlt, FaBell, FaUsers, FaQuestionCircle } from "react-icons/fa";

const SideBar = () => {
  return (
    <div className="w-[266px] bg-[#D9D9D9] min-h-[100vh]">
      <div>
        <img src={`/static/logoLogin.png`} alt="Logo" />
      </div>
      <div className="w-full flex flex-col mt-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `w-full px-4 py-3 flex items-center space-x-4 ${
              isActive ? "bg-blue-300" : ""
            } hover:bg-blue-200`
          }
        >
          <FaHome />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/studentform"
          className={({ isActive }) =>
            `w-full px-4 py-3 flex items-center space-x-4 ${
              isActive ? "bg-blue-300" : ""
            } hover:bg-blue-200`
          }
        >
          <FaSearch />
          <span>Student Form</span>
        </NavLink>

        <NavLink
          to="/managestudents/at-risk-students/"
          className={({ isActive }) =>
            `w-full px-4 py-3 flex items-center space-x-4 ${
              isActive ? "bg-blue-300" : ""
            } hover:bg-blue-200`
          }
        >
          <FaUserAlt />
          <span>At-Risk Students</span>
        </NavLink>

        <NavLink
          to="/managestudents/trigger-at-risk/"
          className={({ isActive }) =>
            `w-full px-4 py-3 flex items-center space-x-4 ${
              isActive ? "bg-blue-300" : ""
            } hover:bg-blue-200`
          }
        >
          <FaBell />
          <span>Trigger At Risk</span>
        </NavLink>

        <NavLink
          to="/managedata/upload-csv/"
          className={({ isActive }) =>
            `w-full px-4 py-3 flex items-center space-x-4 ${
              isActive ? "bg-blue-300" : ""
            } hover:bg-blue-200`
          }
        >
          <FaBell />
          <span>Upload CSV (Admin)</span>
        </NavLink>

        <NavLink
          to="/managedata/upload-grades/"
          className={({ isActive }) =>
            `w-full px-4 py-3 flex items-center space-x-4 ${
              isActive ? "bg-blue-300" : ""
            } hover:bg-blue-200`
          }
        >
          <FaBell />
          <span>Upload Grades</span>
        </NavLink>

        <NavLink
          to="/users/login/"
          className={({ isActive }) =>
            `w-full px-4 py-3 flex items-center space-x-4 ${
              isActive ? "bg-blue-300" : ""
            } hover:bg-blue-200`
          }
        >
          <FaBell />
          <span>Login Test</span>
        </NavLink>

        {/* Link to Manage User */}
        <NavLink
          to="/manageuser"
          className={({ isActive }) =>
            `w-full px-4 py-3 flex items-center space-x-4 ${
              isActive ? "bg-blue-300" : ""
            } hover:bg-blue-200`
          }
        >
          <FaUsers />
          <span>Manage User</span>
        </NavLink>

        {/* Link to Need Help */}
        <NavLink
          to="/need-help"
          className={({ isActive }) =>
            `w-full px-4 py-3 flex items-center space-x-4 ${
              isActive ? "bg-blue-300" : ""
            } hover:bg-blue-200`
          }
        >
          <FaQuestionCircle />
          <span>Need Help</span>
        </NavLink>
      </div>
    </div>
  );
};

export default SideBar;
