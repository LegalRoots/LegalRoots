import "./Sidebar.css";
import logo from "../../../shared/assets/logo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../shared/context/auth";
import { useContext, useEffect, useState } from "react";
const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);

  const [perms, setPerms] = useState(null);

  useEffect(() => {
    if (user?.job.permissions) {
      setPerms(user.job.permissions);
    }
  }, [user]);

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <img src={logo} alt="website logo" />
        <p>Administrative Commision</p>
      </div>
      {perms && (
        <div className="sidebar-links">
          <Link to={`/admin/profile/${user.ssid}`}>
            <p>Profile</p>
          </Link>
          {perms.users.view && (
            <Link to="/admin/users">
              <p>Users</p>
            </Link>
          )}
          {perms.employees.view && (
            <Link to="/admin/emp">
              <p>Employees</p>
            </Link>
          )}
          {perms.judges.view && (
            <Link to="/admin/judges">
              <p>Judges</p>
            </Link>
          )}
          {perms.jobs.view && (
            <Link to="/admin/job">
              <p>Jobs</p>
            </Link>
          )}
          <Link to="/admin/onlinecourt/join">
            <p>Join a Court</p>
          </Link>
          <Link to="/admin/onlinecourt">
            <p>Courts</p>
          </Link>
          {perms.scheduled.view && (
            <Link to="/admin/courts/scheduled">
              <p>Scheduled Courts</p>
            </Link>
          )}
          <Link to="/admin/cases">
            <p>Cases</p>
          </Link>
          {perms.cases.assign && (
            <Link to="/admin/assignments">
              <p>Assignments</p>
            </Link>
          )}
          {perms.courtBranches.view && (
            <Link to="/admin/courtbranch">
              <p>Court Branches</p>
            </Link>
          )}
        </div>
      )}
      <div className="sidebar-links__logout">
        <Link to="/">
          <p onClick={logout}>Logout</p>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
