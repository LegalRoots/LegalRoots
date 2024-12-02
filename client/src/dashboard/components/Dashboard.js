import React, { useState } from "react";
import Sidebar from "./sidebar/Sidebar";
import MyCases from "./MyCases";
import HireLawyer from "./HireLawyer";
import "./Dashboard.css";
import MainFeed from "./MainFeed/MainFeed";
const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("my-cases");

  const renderComponent = () => {
    switch (activeComponent) {
      case "my-cases":
        return <MyCases />;
      case "hire-lawyer":
        return <HireLawyer />;
      case "main-feed":
        return <MainFeed />;
      default:
        return <MyCases />;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className="dash-content">{renderComponent()}</div>
    </div>
  );
};

export default Dashboard;
