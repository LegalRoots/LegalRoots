import React, { createContext, useState, useEffect } from "react";
import io from "socket.io-client";
import { Platform } from "react-native";
import Cookies from "js-cookie";
import { API_URL } from "@env";
let storage;
if (Platform.OS === "web") {
  storage = {
    getItem: (key) => Promise.resolve(localStorage.getItem(key)),
    setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
    removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
  };
} else {
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  storage = AsyncStorage;
}

const socket = io(`${API_URL}`);

export const AuthContext = createContext({
  isLoggedIn: false,
  type: null,
  user: null,
  token: null,
  login: (user) => {},
  logout: () => {},
  setUser: (user) => {},
  setType: (type) => {},
  updateUserContext: (newUserData) => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [type, setType] = useState(null);
  const [token, setToken] = useState(null);
  const isLoggedIn = !!user;

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const savedUser = await storage.getItem("user");
        const savedType = await storage.getItem("userType");
        const savedToken =
          Platform.OS === "web"
            ? Cookies.get("token")
            : await storage.getItem("token");

        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedType) setType(JSON.parse(savedType));
        if (savedToken) setToken(savedToken);
      } catch (error) {
        console.error("Error loading stored data:", error);
      }
    };

    loadStoredData();
  }, []);

  const login = async (userData, checkbox, userType) => {
    const userInfo = userData.data.user;
    const token = userData.token;
    setUser(userInfo);
    setToken(token);
    setType(userType);

    try {
      if (checkbox) {
        await storage.setItem("user", JSON.stringify(userInfo));
        await storage.setItem("userType", JSON.stringify(userType));
      }
      await storage.setItem("userType", JSON.stringify(userType));
      await storage.setItem("user", JSON.stringify(userInfo));
      if (Platform.OS === "web") {
        Cookies.set("token", token, { expires: 7 });
      } else {
        await storage.setItem("token", token);
      }

      socket.connect();
      socket.emit("register", userInfo._id);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = async () => {
    setUser(null);
    setType(null);
    setToken(null);

    try {
      await storage.removeItem("user");
      await storage.removeItem("userType");
      if (Platform.OS === "web") {
        Cookies.remove("token");
      } else {
        await storage.removeItem("token");
      }

      socket.disconnect();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const updateUserContext = async (newUserData) => {
    setUser(newUserData);
    try {
      await storage.setItem("user", JSON.stringify(newUserData));
    } catch (error) {
      console.error("Error updating user context:", error);
    }
  };

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        token,
        login,
        logout,
        setUser,
        type,
        setType,
        updateUserContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
