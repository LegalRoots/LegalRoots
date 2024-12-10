import Navbar from "../shared/components/Navigation/Navbar";
import { Outlet } from "react-router-dom";
import React from "react";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
