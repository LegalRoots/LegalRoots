import { createContext, useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  login: (user) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser =
      sessionStorage.getItem("user") || localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isLoggedIn = !!user;
  const login = (userData, checkbox) => {
    const userInfo = userData.data.user;
    setUser(userInfo);
    if (checkbox) {
      localStorage.setItem("user", JSON.stringify(userInfo));
    }
    sessionStorage.setItem("user", JSON.stringify(userInfo));
    socket.connect();
    socket.emit("register", userInfo._id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    socket.disconnect();
  };

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
