import React, { useState } from "react";
import "./Sidebar.css";
import GroupsIcon from "@mui/icons-material/Groups";
const { useLocation, useNavigate } = require("react-router-dom");
const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("main-feed");
  const location = useLocation();
  const navigate = useNavigate();
  const handleItemClick = (item) => {
    setActiveItem(item);
    navigate(`/user/${item}`);
  };

  return (
    <div className="sidebar">
      <h2>
        {" "}
        <span className="material-symbols-outlined" style={{ color: "white" }}>
          dashboard
        </span>{" "}
        <span style={{ color: "white" }}>Dashboard</span>
      </h2>
      <ul>
        <li
          className={activeItem === "main-feed" ? "active" : ""}
          onClick={() => handleItemClick("main-feed")}
        >
          <span className="material-symbols-outlined">forum</span>
          <span style={{ color: "white" }}>Main Feed</span>
        </li>
        <li
          className={activeItem === "my-cases" ? "active" : ""}
          onClick={() => handleItemClick("my-cases")}
        >
          <span className="material-symbols-outlined">cases</span>
          <span>My Cases</span>
        </li>
        <li
          className={activeItem === "hire-lawyer" ? "active" : ""}
          onClick={() => handleItemClick("hire-lawyer")}
        >
          <span className="material-symbols-outlined">person_add</span>
          <span> Hire a Lawyer</span>{" "}
        </li>

        <li
          className={activeItem === "pay-lawyer" ? "active" : ""}
          onClick={() => handleItemClick("pay-lawyer")}
        >
          <span class="material-symbols-outlined">attach_money</span>
          <span>Payment</span>{" "}
        </li>

        <li
          className={activeItem === "join-court" ? "active" : ""}
          onClick={() => handleItemClick("join-court")}
        >
          <span class="material-symbols-outlined">groups_2</span>
          <span>Join Court</span>{" "}
        </li>

        <li
          className={activeItem === "chats" ? "active" : ""}
          onClick={() => handleItemClick("chats")}
        >
          <span class="material-symbols-outlined">chat</span>
          <span>Chats</span>{" "}
        </li>

        <li
          className={activeItem === "profile-settings" ? "active" : ""}
          onClick={() => handleItemClick("profile-settings")}
        >
          <span className="material-symbols-outlined">manage_accounts</span>
          <span> Profile Settings</span>{" "}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
