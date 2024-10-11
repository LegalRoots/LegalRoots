import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          JusticeRoots
        </Link>
      </div>
      <div className="navbar-center">
        <ul className="nav-links">
          <li>
            <Link className="nav-item" to="/about">
              About Us
            </Link>
          </li>
          <li>
            <Link className="nav-item" to="/contact">
              Contact
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <Link className="nav-item" to="/login">
          Login
        </Link>
        <Link className="nav-item" to="/signup">
          Signup
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
