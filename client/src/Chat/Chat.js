import React, { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Chat from "devextreme-react/chat";

import { AuthContext } from "../shared/context/auth";
const socket = io("http://localhost:5000");

export default function ChatComponent() {
  const { user } = useContext(AuthContext);
  const currentUser = user;
  const conversationId = "123";
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
  }, [conversationId, typingUsers]);

  const onMessageEntered = ({ message }) => {
    const newMessage = { ...message, conversationId };
    axios
      .post(
        `http://localhost:5000/JusticeRoots/conversations/${conversationId}`,
        {
          text: message.text,
          senderId: currentUser.id,
        }
      )
      .catch((err) => console.error("Error sending message:", err));
  };

  const typingStart = () => {
    socket.emit("typing", { conversationId, user: currentUser });
  };

  const typingEnd = () => {
    socket.emit("stopTyping", { conversationId, user: currentUser });
  };

  return (
    <Chat
      user={currentUser}
      items={messages}
      onMessageEntered={onMessageEntered}
      onTypingStart={typingStart}
      onTypingEnd={typingEnd}
      typingUsers={typingUsers}
    />
  );
}
