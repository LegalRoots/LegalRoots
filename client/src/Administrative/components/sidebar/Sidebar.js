import "./Sidebar.css";
import logo from "../../../shared/assets/logo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../shared/context/auth";
import { useContext } from "react";
const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <img src={logo} alt="website logo" />
        <p>Administrative Commision</p>
      </div>
      <div className="sidebar-links">
        <Link to={`/admin/profile/${user.ssid}`}>
          <p>Profile</p>
        </Link>
        <Link to="/admin/emp">
          <p>Employees</p>
        </Link>
        <Link to="/admin/judges">
          <p>Judges</p>
        </Link>
        <Link to="/admin/job">
          <p>Jobs</p>
        </Link>
        <Link to="/admin/onlinecourt/join">
          <p>Join a Court</p>
        </Link>
        <Link to="/admin/onlinecourt">
          <p>Courts</p>
        </Link>
        <Link to="/admin/courts/scheduled">
          <p>Scheduled Courts</p>
        </Link>
        <Link to="/admin/cases">
          <p>Cases</p>
        </Link>
        <Link to="/admin/assignments">
          <p>Assignments</p>
        </Link>
        <Link to="/admin/courtbranch">
          <p>Court Branches</p>
        </Link>
      </div>
      <div className="sidebar-links__logout">
        <Link to="/">
          <p onClick={logout}>Logout</p>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
