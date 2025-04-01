import React, { useState } from "react";
import { OrganizationProfile } from "@clerk/clerk-react"; // Clerk OrganizationProfile component
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "./Setting.css"; // Import styles

const SettingsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className={`main-content ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        {/* Header with toggle button */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Settings Content */}
        <div className="settings-container">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage organization settings</p>

          {/* Organization Profile */}
          <div className="organization-profile">
            <OrganizationProfile
              appearance={{
                elements: {
                  rootBox: {
                    width: "100%",
                    boxShadow: "none",
                    height: "auto",
                  },
                  card: {
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    padding: "15px",
                    maxHeight: "300px", // Prevents internal scrolling
                    overflow: "hidden", // Ensures no extra scrollbars
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;