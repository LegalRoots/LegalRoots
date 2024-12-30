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
import ChatIcon from "@mui/icons-material/Chat";
import GroupsIcon from "@mui/icons-material/Groups";
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
        {/* Main Feed */}
        <ListItem
          selected={activeItem === "main-feed"}
          onClick={() => handleItemClick("main-feed")}
          sx={{
            backgroundColor:
              activeItem === "main-feed" ? "primary.main" : "inherit",
            color: activeItem === "main-feed" ? "white" : "inherit",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <ListItemIcon>
            <Forum
              sx={{
                color: activeItem === "main-feed" ? "white" : "primary.main",
              }}
            />
          </ListItemIcon>
          <Typography
            sx={{ color: activeItem === "main-feed" ? "white" : "inherit" }}
          >
            Main Feed
          </Typography>
        </ListItem>

        {/* Pending Cases */}
        <ListItem
          selected={activeItem === "pending-cases"}
          onClick={() => handleItemClick("pending-cases")}
          sx={{
            backgroundColor:
              activeItem === "pending-cases" ? "primary.main" : "inherit",
            color: activeItem === "pending-cases" ? "white" : "inherit",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <ListItemIcon>
            <PendingIcon
              sx={{
                color:
                  activeItem === "pending-cases" ? "white" : "primary.main",
              }}
            />
          </ListItemIcon>
          <Typography
            sx={{ color: activeItem === "pending-cases" ? "white" : "inherit" }}
          >
            Pending Cases
          </Typography>
        </ListItem>

        {/* My Cases */}
        <ListItem
          selected={activeItem === "my-cases"}
          onClick={() => handleItemClick("my-cases")}
          sx={{
            backgroundColor:
              activeItem === "my-cases" ? "primary.main" : "inherit",
            color: activeItem === "my-cases" ? "white" : "inherit",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <ListItemIcon>
            <Gavel
              sx={{
                color: activeItem === "my-cases" ? "white" : "primary.main",
              }}
            />
          </ListItemIcon>
          <Typography
            sx={{ color: activeItem === "my-cases" ? "white" : "inherit" }}
          >
            My Cases
          </Typography>
        </ListItem>

        {/* Join a Court */}
        <ListItem
          selected={activeItem === "join-court"}
          onClick={() => handleItemClick("join-court")}
          sx={{
            backgroundColor:
              activeItem === "join-court" ? "primary.main" : "inherit",
            color: activeItem === "join-court" ? "white" : "inherit",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <ListItemIcon>
            <GroupsIcon
              sx={{
                color: activeItem === "join-court" ? "white" : "primary.main",
              }}
            />
          </ListItemIcon>
          <Typography
            sx={{ color: activeItem === "join-court" ? "white" : "inherit" }}
          >
            Join a Court
          </Typography>
        </ListItem>

        <ListItem
          selected={activeItem === "chats"}
          onClick={() => {
            handleItemClick("chats");
          }}
          sx={{
            backgroundColor:
              activeItem === "chats" ? "primary.main" : "inherit",
            color: activeItem === "chats" ? "white" : "inherit",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <ListItemIcon>
            <ChatIcon
              sx={{
                color: activeItem === "chats" ? "white" : "primary.main",
              }}
            />
          </ListItemIcon>
          <Typography
            sx={{ color: activeItem === "chats" ? "white" : "inherit" }}
          >
            Chat
          </Typography>
        </ListItem>

        <ListItem
          selected={activeItem === "profile-settings"}
          onClick={() => handleItemClick("profile-settings")}
          sx={{
            backgroundColor:
              activeItem === "profile-settings" ? "primary.main" : "inherit",
            color: activeItem === "profile-settings" ? "white" : "inherit",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <ListItemIcon>
            <Settings
              sx={{
                color:
                  activeItem === "profile-settings" ? "white" : "primary.main",
              }}
            />
          </ListItemIcon>
          <Typography
            sx={{
              color: activeItem === "profile-settings" ? "white" : "inherit",
            }}
          >
            Profile Settings
          </Typography>
        </ListItem>
      </List>
    </div>
  );
};

export default LawyerSidebar;
