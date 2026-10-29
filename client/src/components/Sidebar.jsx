import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaTachometerAlt,
  FaBed,
  FaCalendarCheck,
  FaUsers,
  FaSignOutAlt,
  FaPlusCircle,
} from 'react-icons/fa';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="admin-sidebar bg-white shadow-sm p-3 d-flex flex-column">
      <div className="sidebar-brand-box pb-3 mb-3 border-bottom">
        <h5 className="m-0 fw-bold text-primary">Admin Portal</h5>
        <small className="text-muted">Hotel Management</small>
      </div>

      <nav className="nav flex-column gap-2 flex-grow-1">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `sidebar-item ${isActive ? 'active' : ''}`
          }
        >
          <FaTachometerAlt /> Dashboard Overview
        </NavLink>

        <NavLink
          to="/admin/rooms"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? 'active' : ''}`
          }
        >
          <FaBed /> Manage Rooms
        </NavLink>

        <NavLink
          to="/admin/bookings"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? 'active' : ''}`
          }
        >
          <FaCalendarCheck /> Manage Bookings
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? 'active' : ''}`
          }
        >
          <FaUsers /> Manage Users
        </NavLink>
      </nav>

      <div className="pt-3 border-top mt-auto">
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;