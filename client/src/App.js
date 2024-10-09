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
        <Route path="/" element={<h1>home</h1>} />
        <Route path="/login" Component={Login} />
        <Route path="/signup" Component={Signup} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <Router>
      <h1>in App.js</h1>
      {routes}
    </Router>
  );
}

export default App;
