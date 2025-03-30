import React from "react";
import "./TopNav.css";

const TopNav = () => {
  return (
    <div className="top-nav">
      <h1>Activity Logs</h1>
      <div className="nav-icons">
        <span>🔔</span>
        <span>👤</span>
      </div>
    </div>
  );
};

export default TopNav;
