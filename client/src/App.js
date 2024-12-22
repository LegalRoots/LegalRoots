import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Authentication/pages/Login";
import Signup from "./Authentication/pages/Signup";
import "./App.css";
import { useContext } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "./shared/components/Navigation/Navbar";
import LandingPage from "./Landing/pages/LandingPage";
import { AuthProvider } from "./shared/context/auth";
import Dashboard from "./dashboard/pages/UserDashboard";
import Employees from "./Administrative/pages/Employees/Employees";
import Administrative from "./Administrative/superPage/Administrative";
import { AuthContext } from "./shared/context/auth";
import router from "./routes/AppRouter";
import { HistoryContext, history } from "./shared/context/historyContext";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
function App() {
  const theme = createTheme({
    palette: {
      mode: "light",
      primary: { main: "#ffbf00" },
      secondary: { main: "#f4a261" },
      background: { default: "#ffffff", paper: "#f5f5f5" },
      text: { primary: "#000000", secondary: "#555555" },
      action: { active: "#ffb200", hover: "#eeeeee", selected: "#e3f2fd" },
    },
    typography: {
      fontFamily: "'Roboto', 'Arial', sans-serif",
      h1: { fontWeight: 600, fontSize: "3rem" },
      h2: { fontWeight: 500, fontSize: "2.5rem" },
      h3: { fontWeight: 400, fontSize: "2rem" },
      body1: { fontWeight: 400, fontSize: "1rem" },
    },
  });

  return (
    <ChakraProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HistoryContext.Provider value={history}>
          <RouterProvider router={router} />
        </HistoryContext.Provider>
      </ThemeProvider>
    </ChakraProvider>
  );
}

export default App;
