import React, { useState, useEffect } from "react";
import { useOrganization } from "@clerk/clerk-react";
import {
  BarChart,
  LineChart,
  PieChart,
  Bar,
  Line,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import "./ActivityLog.css";
import "../../components/Sidebar/Sidebar"
import "../../components/Header/Header"

import axios from "axios";
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE", "#00C49F"];

const ActivityLogPage = () => {
  const { organization } = useOrganization();
  const organizationId = organization?.id;
  const [activityLogs, setActivityLogs] = useState([]);
  const [chartType, setChartType] = useState("bar");
 
  useEffect(() => {
    if (!organizationId) return;
  
    axios.get(`http://localhost:3000/api/activity/organization/${organizationId}`)
  .then((response) => {
    // Axios automatically parses the response JSON, so no need to call .json()
    setActivityLogs(response.data);
  })
  .catch((err) => {
    console.error("Error fetching activity logs:", err);
  });

  }, [organizationId]);
  
  
  
  const processActivityData = (logs) => {
    const actionCounts = {};
    logs.forEach((log) => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
    });
    return Object.keys(actionCounts).map((action) => ({ action, count: actionCounts[action] }));
  };

  const activityData = processActivityData(activityLogs);

  if (!organizationId) return <p>Loading organization...</p>;

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <div className="activity-container">
          <h2 className="org-name">{organization.name} - Activity Logs</h2>

          <div className="chart-buttons">
            <button onClick={() => setChartType("bar")}>Bar Chart</button>
            <button onClick={() => setChartType("line")}>Line Chart</button>
            <button onClick={() => setChartType("pie")}>Pie Chart</button>
          </div>

          <div className="activity-chart">
            <h3>Activity Overview</h3>
            <ResponsiveContainer width="80%" height={300}>
              {chartType === "bar" && (
                <BarChart data={activityData}>
                  <XAxis dataKey="action" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="purple" />
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
                activityData.length > 0 ? (
                  <PieChart>
                    <Tooltip />
                    <Legend />
                    <Pie data={activityData} dataKey="count" nameKey="action" label>
                      {activityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                ) : (
                  <p>No activity data available.</p>
                )
              )}
            </ResponsiveContainer>
          </div>

          <div className="activity-log">
            {activityLogs.length > 0 ? (
              activityLogs.map((log) => (
                <div key={log._id} className="log-item">
                  <div className="log-avatar">{log.userId?.charAt(0).toUpperCase() || "U"}</div>
                  <div className="log-details">
                    <p className="log-user">
                      <span className="user-name">{log.userId || "Unknown User"}</span> {log.action}
                    </p>
                    <p className="log-timestamp">{new Date(log.timestamp).toLocaleString()}</p>
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

    export default ActivityLogPage;

   