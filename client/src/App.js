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
import { AuthContext } from "./shared/context/auth";
import Dashboard from "./dashboard/pages/UserDashboard";
function App() {
  const { isLoggedIn } = useContext(AuthContext);
  let routes;
  if (isLoggedIn) {
    routes = (
      <Routes>
        <Route path="/" element={<h1>Account</h1>} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" Component={Login} />
        <Route path="/signup" Component={Signup} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <ChakraProvider>
      <Router>
        <Navbar />
        <div className="content">{routes}</div>
      </Router>
    </ChakraProvider>
  );
}

export default App;
