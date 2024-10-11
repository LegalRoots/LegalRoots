import { userState, useState } from "react";
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  let routes;
  if (isLoggedIn) {
    routes = (
      <Routes>
        <Route path="/" element={<h1>home</h1>} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route
          path="/"
          element={<h1 className="text font-bold underline">home</h1>}
        />
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
        {routes}
      </Router>
    </ChakraProvider>
  );
}

export default App;
