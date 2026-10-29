import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHotel, FaSignOutAlt, FaUser, FaCompass, FaCalendarAlt, FaChartLine } from 'react-icons/fa';

const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="custom-navbar shadow-sm sticky-top bg-white">
      <div className="container d-flex align-items-center justify-content-between py-3">
        {/* Brand Name matching screenshot: RoomsForUse / SB Hotel */}
        <Link to="/" className="navbar-brand d-flex align-items-center text-decoration-none">
          <span className="brand-title">RoomsForUse</span>
        </Link>

        {/* Right side navigation items */}
        <nav className="d-flex align-items-center gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link-custom ${isActive ? 'active-nav' : ''}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/rooms"
            className={({ isActive }) =>
              `nav-link-custom ${isActive ? 'active-nav' : ''}`
            }
          >
            Rooms
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/my-bookings"
                className={({ isActive }) =>
                  `nav-link-custom ${isActive ? 'active-nav' : ''}`
                }
              >
                My Bookings
              </NavLink>

              {isAdmin ? (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `nav-link-custom ${isActive ? 'active-nav' : ''}`
                  }
                >
                  Dashboard
                </NavLink>
              ) : (
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `nav-link-custom ${isActive ? 'active-nav' : ''}`
                  }
                >
                  Dashboard
                </NavLink>
              )}

              {/* User greeting and logout matching image: Hi, name | Logout */}
              <div className="d-flex align-items-center gap-3 ms-2">
                <span className="user-greeting">Hi, {user?.name || 'User'}</span>
                <button onClick={handleLogout} className="btn-text-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `nav-link-custom ${isActive ? 'active-nav' : ''}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `nav-link-custom ${isActive ? 'active-nav' : ''}`
                }
              >
                SignUp
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;