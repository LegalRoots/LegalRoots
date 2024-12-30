import { createContext, useState, useEffect } from "react";
import io from "socket.io-client";
import Cookies from "js-cookie";
const socket = io("http://localhost:5000");

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
  const [user, setUser] = useState(() => {
    const savedUser =
      sessionStorage.getItem("user") || localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [type, setType] = useState(() => {
    const savedType = sessionStorage.getItem("userType");
    return savedType ? JSON.parse(savedType) : null;
  });
  const [token, setToken] = useState(() => {
    const savedToken = Cookies.get("token");
    return savedToken ? savedToken : null;
  });
  const isLoggedIn = !!user;
  const login = (userData, checkbox, type) => {
    const userInfo = userData.data.user;
    const token = userData.token;
    setUser(userInfo);
    setToken(token);
    setType(type);

    if (checkbox) {
      localStorage.setItem("user", JSON.stringify(userInfo));
      localStorage.setItem("userType", JSON.stringify(type));
    }
    sessionStorage.setItem("userType", JSON.stringify(type));
    sessionStorage.setItem("user", JSON.stringify(userInfo));
    Cookies.set("token", token, { expires: 7 });

    socket.connect();
    socket.emit("register", userInfo._id);
  };

  const logout = () => {
    setUser(null);
    setType(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    localStorage.removeItem("userType");
    sessionStorage.removeItem("userType");
    Cookies.remove("token");

    socket.disconnect();
  };

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  const updateUserContext = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
    sessionStorage.setItem("user", JSON.stringify(newUserData));
  };

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
