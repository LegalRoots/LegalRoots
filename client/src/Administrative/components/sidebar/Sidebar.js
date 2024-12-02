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
      </div>
    </div>
  );
};

export default Sidebar;
