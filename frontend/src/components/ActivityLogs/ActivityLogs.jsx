import React from "react";
import "./ActivityLogs.css";
import Sidebar from "../sidebar/sidebar";
import TopNav from "../topnav/topnav";

const organizationName = "Lorem Inc.";

const activityLogs = [
  { id: 1, user: "antonio erdeljac", action: 'created list "Todo"', timestamp: "Nov 6, 2023 at 12:12 AM" },
  { id: 2, user: "antonio erdeljac", action: 'updated card "Complete rename"', timestamp: "Nov 6, 2023 at 12:22 AM" },
  { id: 3, user: "antonio erdeljac", action: 'created card "Landing Page - Copy"', timestamp: "Nov 6, 2023 at 12:25 AM" },
  { id: 4, user: "antonio erdeljac", action: 'created list "Done"', timestamp: "Nov 6, 2023 at 12:12 AM" },
  { id: 5, user: "antonio erdeljac", action: 'deleted card "Complete rename"', timestamp: "Nov 6, 2023 at 12:23 AM" },
  { id: 6, user: "antonio erdeljac", action: 'updated board "Rename"', timestamp: "Nov 6, 2023 at 12:26 AM" },
];

const ActivityLogs = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <div className="activity-container">
          {/* Organization name aligned to the left */}
          <h2 className="org-name">{organizationName}</h2>

          <div className="activity-log">
            {activityLogs.length > 0 ? (
              activityLogs.map((log) => (
                <div key={log.id} className="log-item">
                  <div className="log-avatar">{log.user.charAt(0).toUpperCase()}</div>
                  <div className="log-details">
                    <p className="log-user">
                      <span className="user-name">{log.user}</span> {log.action}
                    </p>
                    <p className="log-timestamp">{log.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No activity logs available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
