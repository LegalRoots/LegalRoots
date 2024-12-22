import React, { useState } from "react";
import Sidebar from "../components/LawyerSidebar";

import { Outlet } from "react-router-dom";
const Dashboard = () => {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Sidebar />

      <Outlet />
    </div>
  );
};

export default Dashboard;
