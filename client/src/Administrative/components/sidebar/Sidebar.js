import "./Sidebar.css";
import logo from "../../../shared/assets/logo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../shared/context/auth";
import { useContext, useEffect, useState } from "react";
const Sidebar = () => {
  const { logout, user, type } = useContext(AuthContext);

  const [perms, setPerms] = useState(null);

  useEffect(() => {
    if (type === "Admin" && user?.job.permissions) {
      setPerms(user.job.permissions);
    }
  }, [user]);

  let links;
  if (type === "Admin" && perms) {
    links = (
      <div className="sidebar-links">
        <Link to={`/admin/profile/${user.ssid}`}>
          <p>Profile</p>
        </Link>
        <Link to="/admin/mainfeed">
          <p>Main Feed</p>
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
    );
  } else {
    links = (
      <div className="sidebar-links">
        <Link to={`/admin/profile/${user.ssid}`}>
          <p>Profile</p>
        </Link>
        <Link to="/admin/mainfeed">
          <p>Main Feed</p>
        </Link>
        <Link to="/admin/users">
          <p>Users</p>
        </Link>
        <Link to="/admin/emp">
          <p>Employees</p>
        </Link>

        <Link to="/admin/onlinecourt/join">
          <p>Join a Court</p>
        </Link>
        <Link to="/admin/onlinecourt">
          <p>Initiate</p>
        </Link>

        <Link to="/admin/cases/manage">
          <p>Cases</p>
        </Link>
      </div>
    );
  }

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <img src={logo} alt="website logo" />
        <p>Administrative Commision</p>
      </div>
      {links}
      <div className="sidebar-links__logout">
        <Link to="/">
          <p onClick={logout}>Logout</p>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
