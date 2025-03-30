import React, { useState } from "react";
import { BarChart, LineChart, PieChart, Bar, Line, Pie, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import "./ActivityLogs.css";
import Sidebar from "../sidebar/sidebar";
import TopNav from "../topnav/topnav";

const organizationName = "Lorem Inc.";

const activityLogs = [
  { id: 1, user: "antonio erdeljac", action: "created list", timestamp: "Nov 6, 2023 at 12:12 AM" },
  { id: 2, user: "antonio erdeljac", action: "updated card", timestamp: "Nov 6, 2023 at 12:22 AM" },
  { id: 3, user: "antonio erdeljac", action: "created card", timestamp: "Nov 6, 2023 at 12:25 AM" },
  { id: 4, user: "antonio erdeljac", action: "created list", timestamp: "Nov 6, 2023 at 12:12 AM" },
  { id: 5, user: "antonio erdeljac", action: "deleted card", timestamp: "Nov 6, 2023 at 12:23 AM" },
  { id: 6, user: "antonio erdeljac", action: "updated board", timestamp: "Nov 6, 2023 at 12:26 AM" },
];

const processActivityData = (logs) => {
  const actionCounts = {};
  logs.forEach((log) => {
    actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
  });
  return Object.keys(actionCounts).map((action) => ({ action, count: actionCounts[action] }));
};

const activityData = processActivityData(activityLogs);
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE", "#00C49F"];

const ActivityLogs = () => {
  const [chartType, setChartType] = useState("bar");

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <div className="activity-container">
          <h2 className="org-name">{organizationName}</h2>

          <div className="chart-buttons">
            <button onClick={() => setChartType("bar")}>Bar Chart</button>
            <button onClick={() => setChartType("line")}>Line Chart</button>
            <button onClick={() => setChartType("pie")}>Pie Chart</button>
          </div>

          <div className="activity-chart">
            <h3>Activity Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "bar" && (
                <BarChart data={activityData}>
                  <XAxis dataKey="action" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              )}
              {chartType === "line" && (
                <LineChart data={activityData}>
                  <XAxis dataKey="action" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                </LineChart>
              )}
              {chartType === "pie" && (
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie data={activityData} dataKey="count" nameKey="action" label>
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

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