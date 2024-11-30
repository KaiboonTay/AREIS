import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUserGraduate,
  FaUserShield,
  FaExclamationTriangle,
  FaFileUpload,
  FaFileAlt,
  FaSignInAlt,
  FaUserCog,
  FaQuestionCircle,
} from "react-icons/fa";

const SideBar = () => {
  return (
    <div className="w-[266px] bg-[#f0f0f0] min-h-[100vh] shadow-lg flex flex-col items-center pt-6">
      <div className="flex justify-center mb-8">
        <img src={`/static/logoLogin.png`} alt="Logo" className="w-[100%]" />
      </div>
      <div className="w-full flex flex-col space-y-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `no-underline w-full px-6 py-3 flex items-center space-x-4 text-gray-700 font-semibold rounded-lg transition-all ${
              isActive ? "bg-blue-100 text-blue-600 shadow-md" : ""
            } hover:bg-gray-200 hover:shadow-sm`
          }
        >
          <FaHome />
          <span>Home</span>
        </NavLink>

        {/*<NavLink
          to="/studentform"
          className={({ isActive }) =>
            `no-underline w-full px-6 py-3 flex items-center space-x-4 text-gray-700 font-semibold rounded-lg transition-all ${
              isActive ? "bg-blue-100 text-blue-600 shadow-md" : ""
            } hover:bg-gray-200 hover:shadow-sm`
          }
        >
          <FaUserGraduate />
          <span>Student Form</span>
        </NavLink> */}

        <NavLink
          to="/managestudents/at-risk-students/"
          className={({ isActive }) =>
            `no-underline w-full px-6 py-3 flex items-center space-x-4 text-gray-700 font-semibold rounded-lg transition-all ${
              isActive ? "bg-blue-100 text-blue-600 shadow-md" : ""
            } hover:bg-gray-200 hover:shadow-sm`
          }
        >
          <FaUserShield />
          <span>At-Risk Students</span>
        </NavLink>

        <NavLink
          to="/managestudents/trigger-at-risk/"
          className={({ isActive }) =>
            `no-underline w-full px-6 py-3 flex items-center space-x-4 text-gray-700 font-semibold rounded-lg transition-all ${
              isActive ? "bg-blue-100 text-blue-600 shadow-md" : ""
            } hover:bg-gray-200 hover:shadow-sm`
          }
        >
          <FaExclamationTriangle />
          <span>Trigger At Risk</span>
        </NavLink>

        <NavLink
          to="/managedata/upload-csv/"
          className={({ isActive }) =>
            `no-underline w-full px-6 py-3 flex items-center space-x-4 text-gray-700 font-semibold rounded-lg transition-all ${
              isActive ? "bg-blue-100 text-blue-600 shadow-md" : ""
            } hover:bg-gray-200 hover:shadow-sm`
          }
        >
          <FaFileUpload />
          <span>Upload CSV (Admin)</span>
        </NavLink>

        <NavLink
          to="/managedata/upload-grades/"
          className={({ isActive }) =>
            `no-underline w-full px-6 py-3 flex items-center space-x-4 text-gray-700 font-semibold rounded-lg transition-all ${
              isActive ? "bg-blue-100 text-blue-600 shadow-md" : ""
            } hover:bg-gray-200 hover:shadow-sm`
          }
        >
          <FaFileAlt />
          <span>Upload Grades</span>
        </NavLink>

        <div className="my-4"></div>

        <NavLink
          to="/users/login/"
          className={({ isActive }) =>
            `no-underline w-full px-6 py-3 flex items-center space-x-4 text-gray-700 font-semibold rounded-lg transition-all ${
              isActive ? "bg-blue-100 text-blue-600 shadow-md" : ""
            } hover:bg-gray-200 hover:shadow-sm`
          }
        >
          <FaSignInAlt />
          <span>Login Test</span>
        </NavLink>

        <NavLink
          to="/manageuser"
          className={({ isActive }) =>
            `no-underline w-full px-6 py-3 flex items-center space-x-4 text-gray-700 font-semibold rounded-lg transition-all ${
              isActive ? "bg-blue-100 text-blue-600 shadow-md" : ""
            } hover:bg-gray-200 hover:shadow-sm`
          }
        >
          <FaUserCog />
          <span>Manage User</span>
        </NavLink>

        <NavLink
          to="/need-help"
          className={({ isActive }) =>
            `no-underline w-full px-6 py-3 flex items-center space-x-4 text-gray-700 font-semibold rounded-lg transition-all ${
              isActive ? "bg-blue-100 text-blue-600 shadow-md" : ""
            } hover:bg-gray-200 hover:shadow-sm`
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
