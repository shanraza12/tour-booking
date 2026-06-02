import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ children, navLinks }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="dashboard-layout">
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 z-index-800 d-lg-none" 
          onClick={toggleSidebar}
          style={{ zIndex: 800 }}
        ></div>
      )}

      {/* Sidebar Core */}
      <aside className={`sidebar-wrapper ${isOpen ? "open" : ""}`}>
        <div className="mb-4 px-3">
          <h5 className="fw-bold" style={{ color: "var(--heading-color)" }}>Dashboard</h5>
          <span className="text-muted small">Manage your account</span>
        </div>

        <nav className="sidebar-nav">
          {navLinks.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className={(navClass) => navClass.isActive ? "sidebar-link active" : "sidebar-link"}
              onClick={() => setIsOpen(false)} // Auto-close on mobile
            >
              <i className={item.icon}></i>
              {item.display}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-top">
           <div className="sidebar-link text-danger" style={{ cursor: "pointer" }}>
             <i className="ri-logout-circle-line"></i> Logout
           </div>
        </div>
      </aside>

      {/* Main Display Area */}
      <main className="dashboard-content-area">
        {children}
      </main>

      {/* Mobile Toggle Button */}
      <button 
        className="sidebar-mobile-toggle d-lg-none" 
        onClick={toggleSidebar}
        aria-label="Toggle Dashboard Menu"
      >
        <i className={isOpen ? "ri-close-line fs-4" : "ri-menu-2-line fs-4"}></i>
      </button>
    </div>
  );
};

export default Sidebar;
