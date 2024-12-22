import React, { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import "./Notifications.css";
import { AuthContext } from "../../../context/auth";

const Notifications = ({ userId }) => {
  const { type } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (type) {
      const socket = io("http://localhost:5000", {
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
        const response = await fetch(
          `http://localhost:5000/JusticeRoots/notifications/${userId}/${type}`
        );
        const data = await response.json();

        const reversedNotifications = data?.data?.notifications?.reverse();

        setNotifications(reversedNotifications);
        setUnreadCount(reversedNotifications?.filter((n) => !n.read).length);
        setLoading(false);
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
      prev.map((notif) => {
        return notif._id === notificationId ? { ...notif, read: true } : notif;
      })
    );
    try {
      await fetch(
        `/JusticeRoots/notifications/${userId}/${type}/read/${notificationId}`,
        {
          method: "PUT",
        }
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

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
          {notifications.map((notification, index) => {
            return (
              <div
                key={index}
                className={`notification-item ${
                  notification.read ? "read" : ""
                }`}
                onClick={() =>
                  !notification.read && markAsRead(notification._id)
                }
              >
                {notification.message}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
