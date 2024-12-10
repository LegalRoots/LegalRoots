import { Route, Routes, NavLink } from "react-router-dom";
import Employees from "../pages/Employees/Employees";
import Jobs from "../pages/Jobs/Jobs";
import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../../shared/components/Navigation/Navbar";

import "./Administrative.css";
import Judge from "../pages/Judges/Judges";

const Administrative = () => {
  let routes = (
    <Routes>
      <Route path="/emp/*" Component={Employees} />
      <Route path="/job" Component={Jobs} />
      <Route path="/judges/*" Component={Judge} />
    </Routes>
  );
  return (
    <div className="Administrative-container">
      <Sidebar />
      {routes}
    </div>
  );
};

export default Administrative;
