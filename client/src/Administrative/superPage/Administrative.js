import { Route, Routes, NavLink } from "react-router-dom";
import Employees from "../pages/Employees/Employees";
import Jobs from "../pages/Jobs/Jobs";
import Sidebar from "../components/sidebar/Sidebar";

import "./Administrative.css";

const Administrative = () => {
  let routes = (
    <Routes>
      <Route path="/emp/*" Component={Employees} />
      <Route path="/job" Component={Jobs} />
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
