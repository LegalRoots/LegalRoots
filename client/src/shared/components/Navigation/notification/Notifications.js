import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./Notifications.css";

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("Connected to the server!");
      socket.emit("register", userId);
    });

    socket.on("newNotification", (notification) => {
      console.log("New notification received", notification);
      setNotifications((prev) => [notification, ...prev]); // Add new notification at the beginning
      setUnreadCount((prev) => prev + 1);
    });

    const fetchNotifications = async () => {
      const response = await fetch(`/JusticeRoots/notifications/${userId}`);
      const data = await response.json();
      const reversedNotifications = data.data.notifications.reverse();
      setNotifications(reversedNotifications); // Set reversed notifications
      setUnreadCount(reversedNotifications.filter((n) => !n.read).length);
    };

    fetchNotifications();

    return () => {
      socket.off("newNotification");
      socket.disconnect();
    };
  }, [userId]);

  const markAsRead = async (notificationId) => {
    try {
      await fetch(
        `/JusticeRoots/notifications/${userId}/read/${notificationId}`,
        {
          method: "PUT",
        }
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div>
      <div className="notifications-icon" onClick={toggleDropdown}>
        <i className="fa-solid fa-bell fa-xl"></i>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>
      {showDropdown && (
        <div className="notifications-dropdown">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-item ${notification.read ? "read" : ""}`}
              onClick={() => !notification.read && markAsRead(notification._id)}
            >
              {notification.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
