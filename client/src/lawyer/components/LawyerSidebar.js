import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
} from "@mui/material";
import PendingIcon from "@mui/icons-material/Pending";
import {
  Dashboard,
  Forum,
  Gavel,
  PersonAdd,
  Settings,
} from "@mui/icons-material";

const LawyerSidebar = () => {
  const [activeItem, setActiveItem] = useState("main-feed");
  const location = useLocation();
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    setActiveItem(item);
    navigate(`/lawyer/${item}`);
  };

  return (
    <div
      className="sidebar"
      style={{ width: 250, backgroundColor: "#333", color: "primary.main" }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "white",
          display: "flex",
          alignItems: "center",
          padding: 2,
        }}
      >
        <Dashboard sx={{ marginRight: 1 }} />
        Dashboard
      </Typography>
      <Divider color="gold" />
      <List>
        <ListItem
          button
          selected={activeItem === "main-feed"}
          onClick={() => handleItemClick("main-feed")}
        >
          <ListItemIcon>
            <Forum sx={{ color: "primary.main" }} />
          </ListItemIcon>
          <Typography sx={{ color: "white" }}>Main Feed</Typography>
        </ListItem>

        <ListItem
          button
          selected={activeItem === "pending-cases"}
          onClick={() => handleItemClick("pending-cases")}
        >
          <ListItemIcon>
            <PendingIcon sx={{ color: "primary.main" }} />
          </ListItemIcon>
          <Typography sx={{ color: "white" }}>Pending Cases</Typography>
        </ListItem>

        <ListItem
          button
          selected={activeItem === "my-cases"}
          onClick={() => handleItemClick("my-cases")}
        >
          <ListItemIcon>
            <Gavel sx={{ color: "primary.main" }} />
          </ListItemIcon>
          <Typography sx={{ color: "white" }}>My Cases</Typography>
        </ListItem>

        <ListItem
          button
          selected={activeItem === "profile-settings"}
          onClick={() => handleItemClick("profile-settings")}
        >
          <ListItemIcon>
            <Settings sx={{ color: "primary.main" }} />
          </ListItemIcon>
          <Typography sx={{ color: "white" }}>Profile Settings</Typography>
        </ListItem>
      </List>
    </div>
  );
};

export default LawyerSidebar;
