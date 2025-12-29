import { useState } from "react";
import { NavLink } from "react-router-dom";
import { roles } from "../config/roles";

//add other sidebar links at the config/roles.js file

export default function Sidebar({ role }) {
  const [collapsed, setCollapsed] = useState(false);
  const menu = roles[role]?.menu || [];

  return (
    <aside
      className={`bg-dark text-white d-flex flex-column vh-100 ${
        collapsed ? "sidebar-collapsed" : ""
      }`}
      style={{
        width: collapsed ? "80px" : "260px",
        transition: "width 0.3s",
      }}
    >
      {/* Header */}
      <div className="p-3 border-bottom border-secondary d-flex align-items-center justify-content-between">
        {!collapsed && <h5 className="mb-0 fw-bold">Dashboard</h5>}
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => setCollapsed(!collapsed)}
        >
          <i className={`bi ${collapsed ? "bi-chevron-right" : "bi-chevron-left"}`} />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-grow-1 p-2">
        <ul className="nav nav-pills flex-column gap-2">
          {menu.map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center ${
                    isActive ? "active bg-primary" : "text-white"
                  }`
                }
              >
                <i className={`bi ${item.icon} fs-5`} />
                {!collapsed && <span className="ms-3">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-top border-secondary">
        <button className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center">
          <i className="bi bi-box-arrow-right" />
          {!collapsed && <span className="ms-2">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
