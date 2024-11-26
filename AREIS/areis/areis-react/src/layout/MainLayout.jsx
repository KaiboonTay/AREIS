import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/side-bar/SideBar";
import Header from "../components/header/Header";

const MainLayout = () => {
  const location = useLocation();

  // Specify the routes where Sidebar and Header should NOT appear
  const noNavbarSidebarRoutes = ["/managestudents/student-form"];

  const shouldShowNavbarSidebar = !noNavbarSidebarRoutes.some((route) =>
    location.pathname.startsWith(route)
);

  return (
    <div>
      <div className="flex">
        {shouldShowNavbarSidebar && <SideBar />}
        <div className="w-full">
          {shouldShowNavbarSidebar && <Header />}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;