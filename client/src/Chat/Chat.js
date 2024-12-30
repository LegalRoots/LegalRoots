import React, { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Chat from "devextreme-react/chat";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../shared/context/auth";
import { AppBar, Toolbar, IconButton, Paper, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "devextreme/dist/css/dx.material.orange.light.css";
const socket = io("http://localhost:5000");

export default function ChatComponent() {
  const { convId } = useParams();
  const navigate = useNavigate();
  const { user, type } = useContext(AuthContext);
  const currentUser = {
    ...user,
    id: user._id,
    name: `${user.first_name} ${user.last_name}`,
  };
  const conversationId = convId;
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/JusticeRoots/conversations/${conversationId}/messages`
      )
      .then((response) => setMessages(response.data))
      .catch((err) => console.error("Error fetching messages:", err));
    socket.emit("joinConversation", conversationId);

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("typing", ({ user }) => {
      if (!typingUsers.some((u) => u.id === user.id)) {
        setTypingUsers((prev) => [...prev, user]);
      }
    });

    socket.on("stopTyping", ({ user }) => {
      setTypingUsers((prev) => prev.filter((u) => u.id !== user.id));
    });

    return () => {
      socket.off("message");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [conversationId]);

  const onMessageEntered = ({ message }) => {
    const newMessage = { ...message, conversationId };
    axios
      .post(
        `http://localhost:5000/JusticeRoots/conversations/${conversationId}/messages`,
        {
          text: message.text,
          author: { _id: currentUser.id },
          authorType: type,
        }
      )
      .then(() => {
        socket.emit("message", newMessage);
      })
      .catch((err) => console.error("Error sending message:", err));
  };

  const typingStart = () => {
    socket.emit("typing", { conversationId, user: currentUser });
  };

  const typingEnd = () => {
    socket.emit("stopTyping", { conversationId, user: currentUser });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            sx={{ width: "50px", height: "50px" }}
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Go back
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper
        elevation={3}
        style={{
          flex: 1,
          margin: "16px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Chat
          user={currentUser}
          items={messages}
          onMessageEntered={onMessageEntered}
          onTypingStart={typingStart}
          onTypingEnd={typingEnd}
          typingUsers={typingUsers}
        />
      </Paper>
    </div>
  );
}
