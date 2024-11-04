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
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "./shared/components/Navigation/Navbar";
import LandingPage from "./Landing/pages/LandingPage";
import { AuthProvider } from "./shared/context/auth";
import Dashboard from "./dashboard/pages/Dashboard";
import Employees from "./Administrative/pages/Employees/Employees";
import Administrative from "./Administrative/superPage/Administrative";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userType, setUserType] = useState("administrative");
  let routes;

  if (isLoggedIn && userType === "administrative") {
    routes = (
      <Routes>
        <Route path="/" Component={LandingPage} />
        <Route path="/admin/*" element={<Administrative />} />
      </Routes>
    );
  } else if (isLoggedIn) {
    routes = (
      <Routes>
        <Route path="/" element={<h1>Account</h1>} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" Component={LandingPage} />
        <Route path="/admin/*" element={<Administrative />} />
        <Route path="/login" Component={Login} />
        <Route path="/signup" Component={Signup} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <AuthProvider>
      <ChakraProvider>
        <Router>
          <Navbar />
          {routes}
        </Router>
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;
