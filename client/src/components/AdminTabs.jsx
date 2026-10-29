import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminTabs = () => {
  return (
    <div className="admin-subnav-container bg-white border-bottom mb-4">
      <div className="container">
        <ul className="nav nav-tabs border-0 admin-tabs">
          <li className="nav-item">
            <NavLink
              to="/admin/bookings"
              className={({ isActive }) =>
                `nav-link admin-tab ${isActive ? 'active' : ''}`
              }
            >
              ALL BOOKINGS
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/rooms"
              className={({ isActive }) =>
                `nav-link admin-tab ${isActive ? 'active' : ''}`
              }
            >
              ALL ROOMS
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/rooms?action=add"
              className={({ isActive }) =>
                `nav-link admin-tab ${isActive ? 'active' : ''}`
              }
            >
              ADD ROOM
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `nav-link admin-tab ${isActive ? 'active' : ''}`
              }
            >
              ALL USER
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminTabs;