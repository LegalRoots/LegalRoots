import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/auth";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const [showNav, setShowNav] = useState(true);

  const handleLogout = () => {
    logout();
  };
  const { pathname } = useLocation();
  useEffect(() => {
    const firstSection = pathname.split("/")[1];
    if (
      firstSection === "admin" ||
      (firstSection === "online" && pathname.split("/")[2] === "court")
    ) {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  }, [pathname]);

  return (
    <>
      {showNav && (
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
            {isLoggedIn ? (
              <>
                <div className="user-icon">
                  <img
                    src={`/images/${user.photo}`}
                    alt="User Avatar"
                    className="avatar"
                    onClick={() => {
                      navigate(`/dashboard/`);
                    }}
                  />
                  <span className="username">{user.username}</span>
                </div>
                <button
                  className="nav-item logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="nav-item" to="/login">
                  Login
                </Link>
                <Link className="nav-item" to="/signup">
                  Signup
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
