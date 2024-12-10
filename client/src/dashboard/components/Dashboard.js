import React, { useState } from "react";
import Sidebar from "./sidebar/Sidebar";
import CaseCard from "../../Cases/components/CaseCard";
import HireLawyer from "./HireLawyer";
import "./Dashboard.css";
import MainFeed from "./MainFeed/MainFeed";
import { Outlet } from "react-router-dom";
import Grid from "@mui/material/Grid2";
const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />

      <Outlet />
    </div>
  );
};

export default Dashboard;
