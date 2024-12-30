import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Divider,
  CircularProgress,
  TextField,
  InputAdornment,
  Paper,
} from "@mui/material";
import { Chat, Search } from "@mui/icons-material";
import axios from "axios";
import { AuthContext } from "../shared/context/auth";
import { useNavigate } from "react-router-dom";

const ChatsPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [lawyers, setLawyers] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lawyersResponse, usersResponse] = await Promise.all([
          fetch("http://localhost:5000/JusticeRoots/lawyers").then((res) =>
            res.json()
          ),
          fetch("http://localhost:5000/JusticeRoots/users").then((res) =>
            res.json()
          ),
        ]);

        setLawyers(lawyersResponse.data.lawyers);
        setUsers(usersResponse.data.users);
        setFilteredLawyers(lawyersResponse.data.lawyers);
        setFilteredUsers(usersResponse.data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    setFilteredLawyers(
      lawyers.filter((lawyer) =>
        `${lawyer.first_name} ${lawyer.last_name}`
          .toLowerCase()
          .includes(lowerCaseQuery)
      )
    );
    const filteredUsers = users.filter((user) =>
      `${user.first_name} ${user.last_name}`
        .toLowerCase()
        .includes(lowerCaseQuery)
    );
    setFilteredUsers(filteredUsers.filter((User) => User._id !== user._id));
  }, [searchQuery, lawyers, users]);

  const handleOpenChat = (id, type) => {
    axios
      .post("http://localhost:5000/JusticeRoots/conversations", {
        participants: [user._id, id],
        type,
      })
      .then((response) => {
        navigate(`/chat/${response.data._id}`);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error creating conversation:", error);
      });
  };

  const renderList = (items, type) => (
    <List
      sx={{
        width: "70%",
      }}
    >
      {items.map((item) => (
        <React.Fragment key={item._id}>
          <ListItem sx={{ alignItems: "flex-start" }}>
            <ListItemAvatar>
              <Avatar
                src={`/path/to/images/${item.photo}`}
                alt={`${item.first_name} ${item.last_name}`}
              />
            </ListItemAvatar>
            <ListItemText
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
              primary={`${item.first_name} ${item.last_name}`}
              secondary={
                type === "lawyer"
                  ? `${item.specialization} - ${item.city}`
                  : item.email
              }
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ width: "50%" }}
              startIcon={<Chat />}
              onClick={() => handleOpenChat(item._id, type)}
            >
              Chat
            </Button>
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box width="80%" display="flex" height="100vh" bgcolor="#f5f5f5">
      {/* Sidebar */}
      <Paper elevation={3} sx={{ width: 300, padding: 2, bgcolor: "#fff" }}>
        <Typography variant="h5" gutterBottom>
          Chats
        </Typography>
        <TextField
          fullWidth
          placeholder="Search clients or lawyers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Total Lawyers: {filteredLawyers.length}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Total Users: {filteredUsers.length}
        </Typography>
      </Paper>

      {/* Main Content */}
      <Box flex={1} overflow="auto" padding={2}>
        <Typography variant="h6" gutterBottom>
          Lawyers
        </Typography>
        {filteredLawyers.length ? (
          renderList(filteredLawyers, "lawyer")
        ) : (
          <Typography>No lawyers found.</Typography>
        )}
        <Divider sx={{ my: 4 }} />
        <Typography variant="h6" gutterBottom>
          Users
        </Typography>
        {filteredUsers.length ? (
          renderList(filteredUsers, "user")
        ) : (
          <Typography>No users found.</Typography>
        )}

        <Typography variant="h6" gutterBottom>
          Ai ChatBot
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "50%" }}
          startIcon={<Chat />}
          onClick={() => navigate("/chatbot")}
        >
          Chat
        </Button>
      </Box>
    </Box>
  );
};

export default ChatsPage;
