import "./Sidebar.css";
import logo from "../../../shared/assets/logo.png";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <img src={logo} alt="website logo" />
        <p>Administrative Commision</p>
      </div>
      <div className="sidebar-links">
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
        <Link to="/admin/cases">
          <p>Cases</p>
        </Link>
        <Link to="/admin/onlinecourt">
          <p>Acounts</p>
        </Link>
        <Link to="/admin/onlinecourt">
          <p>History</p>
        </Link>
      </div>
      <div className="sidebar-links__logout">
        <Link to="/">
          <p>Logout</p>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
