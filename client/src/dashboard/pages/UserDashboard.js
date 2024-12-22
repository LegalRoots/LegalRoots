import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth";
import "./UserDashboard.css";
import React from "react";
import Dashboard from "../components/Dashboard";

const UserDashboard = () => {
  const { isLoggedIn } = useContext(AuthContext);
  if (isLoggedIn) {
    return (
      <div className="user-dashboard">
        <Dashboard />
      </div>
    );
  } else {
    return (
      <div className="user-dashboard">
        <h1>Please log in to view your dashboard</h1>
      </div>
    );
  }
};

export default UserDashboard;
