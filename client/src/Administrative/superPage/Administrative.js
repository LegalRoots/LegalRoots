import { Route, Routes, NavLink } from "react-router-dom";
import Employees from "../pages/Employees/Employees";
import Jobs from "../pages/Jobs/Jobs";
import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../../shared/components/Navigation/Navbar";

import "./Administrative.css";
import Judge from "../pages/Judges/Judges";
import JoinOnlineCourt from "../pages/JoinOnlineCourt/JoinOnlineCourt";
import Courts from "../pages/Courts/Courts";
import Cases from "../pages/Cases/Cases";

const Administrative = () => {
  let routes = (
    <Routes>
      <Route path="/emp/*" Component={Employees} />
      <Route path="/job" Component={Jobs} />
      <Route path="/judges/*" Component={Judge} />
      <Route path="/onlinecourt" Component={Courts} />
      <Route path="/onlinecourt/join" Component={JoinOnlineCourt} />
      <Route path="/cases/*" Component={Cases} />
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
