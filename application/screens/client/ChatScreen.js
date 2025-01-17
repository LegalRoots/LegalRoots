import React, { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { GiftedChat } from "react-native-gifted-chat";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../../src/shared/context/auth";
import { API_URL } from "@env";
import { useNavigation, useRoute } from "@react-navigation/native";

const socket = io(`${API_URL}`);

export default function ChatComponent() {
  const navigation = useNavigation();
  const route = useRoute();
  const { convId } = route.params;
  const { user, type } = useContext(AuthContext);

  const currentUser = {
    ...user,
    id: user._id,
    name: `${user.first_name} ${user.last_name}`,
  };

  const conversationId = convId;
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/JusticeRoots/conversations/${conversationId}/messages`)
      .then((response) => {
        response.data.forEach((message) => {
          message.user = {
            _id: message.author._id,
            name: `${message.author.first_name} ${message.author.last_name}`,
          };
          message.createdAt = message.timestamp;
        });
        setMessages(response.data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching messages:", err));

    socket.emit("joinConversation", conversationId);

    socket.on("message", (message) => {
      setMessages((prevMessages) => GiftedChat.append(prevMessages, message));
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

  const onSendMessage = (newMessages = []) => {
    const message = newMessages[0];
    const newMessage = { ...message, conversationId };

    axios
      .post(
        `${API_URL}/JusticeRoots/conversations/${conversationId}/messages`,
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
  console.log(currentUser);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <GiftedChat
          user={{ _id: currentUser._id, name: currentUser.name }}
          messages={messages}
          onSend={onSendMessage}
          onInputTextChanged={typingStart}
          isTyping={typingUsers.length > 0}
          placeholder="Type a message..."
          alwaysShowSend
          renderUsernameOnMessage
          showAvatarForEveryMessage
        />
      )}

      {typingUsers.length > 0 && (
        <Text style={styles.typingIndicator}>
          {typingUsers.map((u) => u.name).join(", ")} is typing...
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",

    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#007AFF",
  },
  goBack: {
    color: "#fff",
    fontSize: 16,
    marginRight: 10,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  typingIndicator: {
    padding: 5,
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
  },
});
