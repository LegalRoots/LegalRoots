import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { io } from "socket.io-client";
import { AuthContext } from "../../src/shared/context/auth";
import { API_URL } from "@env";

const Notifications = ({ userId }) => {
  const { type } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (type) {
      const socket = io(`${API_URL}`, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      socket.on("connect", () => {
        console.log("Connected to the server!");
        socket.emit("register", userId);
      });

      socket.on("newNotification", (notification) => {
        console.log("New notification", notification);
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      const fetchNotifications = async () => {
        try {
          const response = await fetch(
            `${API_URL}/JusticeRoots/notifications/${userId}/${type}`
          );
          const data = await response.json();
          const reversedNotifications = data?.data?.notifications?.reverse();
          setNotifications(reversedNotifications);
          setUnreadCount(reversedNotifications?.filter((n) => !n.read).length);
        } catch (error) {
          console.error("Failed to fetch notifications", error);
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();

      return () => {
        socket.off("newNotification");
        socket.disconnect();
      };
    }
  }, [userId, type]);

  const markAsRead = async (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif._id === notificationId ? { ...notif, read: true } : notif
      )
    );
    try {
      await fetch(
        `${API_URL}/JusticeRoots/notifications/${userId}/${type}/read/${notificationId}`,
        {
          method: "PUT",
        }
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <Text style={styles.noNotificationsText}>
          No notifications available
        </Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.notificationItem,
                item.read ? styles.readNotification : styles.unreadNotification,
              ]}
              onPress={() => !item.read && markAsRead(item._id)}
            >
              <Text style={styles.notificationText}>{item.message}</Text>
              {!item.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  notificationItem: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2, // For shadow on Android
    shadowColor: "#000", // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: "#007BFF",
  },
  readNotification: {
    opacity: 0.6,
  },
  notificationText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007BFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#333",
  },
  noNotificationsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 32,
  },
});

export default Notifications;
