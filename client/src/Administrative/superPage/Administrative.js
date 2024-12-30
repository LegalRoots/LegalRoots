import { Route, Routes, NavLink } from "react-router-dom";
import Employees from "../pages/Employees/Employees";
import Jobs from "../pages/Jobs/Jobs";
import Sidebar from "../components/sidebar/Sidebar";

import "./Administrative.css";
import Judge from "../pages/Judges/Judges";
import JoinOnlineCourt from "../pages/JoinOnlineCourt/JoinOnlineCourt";
import Courts from "../pages/Courts/Courts";
import Cases from "../pages/Cases/Cases";
import Profile from "../pages/Profile/Profile";
import Assignments from "../pages/Assignments/Assignments";
import ScheduledCourts from "../pages/ScheduledCourts/ScheduledCourts";
import CourtBranch from "../pages/courtBranches/CourtBranch";
import Users from "../pages/Users/Users";
import { AuthContext } from "../../shared/context/auth";
import { useContext, useEffect, useState } from "react";
import MainFeed from "../../dashboard/components/MainFeed/MainFeed";
const Administrative = () => {
  const { user, type } = useContext(AuthContext);

  const [perms, setPerms] = useState(null);

  useEffect(() => {
    if (type === "Admin" && user?.job.permissions) {
      setPerms(user.job.permissions);
    }
  }, [user]);

  let routes;
  if (type === "Admin" && perms) {
    routes = (
      <Routes>
        {perms.employees.view && <Route path="/emp/*" Component={Employees} />}
        {perms.jobs.view && <Route path="/job" Component={Jobs} />}
        {perms.judges.view && <Route path="/judges/*" Component={Judge} />}
        <Route path="/onlinecourt" Component={Courts} />
        <Route path="/onlinecourt/join" Component={JoinOnlineCourt} />

        {(perms.cases.view ||
          perms.caseTypes.view ||
          perms.case.manage ||
          perms.caseTypes.manage ||
          perms.cases.control ||
          perms.cases.assign) && <Route path="/cases/*" Component={Cases} />}
        <Route path="/profile/:id" Component={Profile} />
        {perms.cases.assign && (
          <Route path="/assignments/*" Component={Assignments} />
        )}
        {perms.scheduled.view && (
          <Route path="/courts/scheduled/*" Component={ScheduledCourts} />
        )}
        {perms.courtBranches.view && (
          <Route path="/courtbranch/*" Component={CourtBranch} />
        )}
        <Route path="/users/*" Component={Users} />
        <Route path="/mainfeed" Component={MainFeed} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/emp/*" Component={Employees} />
        <Route path="/onlinecourt" Component={Courts} />
        <Route path="/onlinecourt/join" Component={JoinOnlineCourt} />
        <Route path="/cases/*" Component={Cases} />
        <Route path="/profile/:id" Component={Profile} />
        <Route path="/users/*" Component={Users} />
        <Route path="/mainfeed" Component={MainFeed} />
      </Routes>
    );
  }

  return (
    <div className="Administrative-container">
      <Sidebar />
      {routes}
    </div>
  );
};

export default Administrative;
