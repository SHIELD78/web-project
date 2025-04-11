import React from "react";
import { UserProfile ,OrganizationProfile} from "@clerk/clerk-react"; // Clerk UserProfile component
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header"
import "./Setting.css"; // Import styles

const SettingsPage = () => {
    return (
        <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="settings-container">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage organization settings</p>

          {/* Organization Profile - Fixed Height */}
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
}
export default SettingsPage;
