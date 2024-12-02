import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/auth";
import Notifications from "./notification/Notifications";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useContext(AuthContext);
<<<<<<< HEAD
=======
  const [showNav, setShowNav] = useState(true);

>>>>>>> ebcddf323b3cec92340d32280b4610849252adde
  const handleLogout = () => {
    logout();
  };
  const { pathname } = useLocation();
  useEffect(() => {
    const firstSection = pathname.split("/")[1];
    if (firstSection === "admin") {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  }, []);

  return (
    <>
      {showNav && (
        <nav className="navbar">
          <div className="navbar-left">
            <Link to="/" className="logo">
              JusticeRoots
            </Link>
<<<<<<< HEAD
          </li>
          <li>
            <Link className="nav-item" to="/contact">
              Contact
            </Link>
          </li>
          <li> </li>
        </ul>
      </div>
      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            <Notifications userId={user._id} />
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
            <button className="nav-item logout-button" onClick={handleLogout}>
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
=======
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
>>>>>>> ebcddf323b3cec92340d32280b4610849252adde
  );
};

export default Navbar;
