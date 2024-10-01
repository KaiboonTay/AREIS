import { Outlet } from "react-router-dom";
import SideBar from "../components/side-bar/SideBar";
import Header from "../components/header/Header";



const MainLayout = () => {
  return (
    <div>
      <div className="flex">
        <SideBar />
        <div className="w-full">
          <Header />
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
