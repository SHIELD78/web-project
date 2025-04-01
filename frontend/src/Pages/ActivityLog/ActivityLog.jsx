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
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import axios from "axios";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE", "#00C49F"];

const ActivityLogPage = () => {
  const { organization } = useOrganization();
  const organizationId = organization?.id;
  const [activityLogs, setActivityLogs] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar visibility state
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [error, setError] = useState(null); // Error state for API calls

  // Fetch activity logs
  useEffect(() => {
    if (!organizationId) return;

    setLoading(true); // Start loading
    setError(null); // Reset error

    axios.get(`http://localhost:3000/api/activity/organization/${organizationId}`)
      .then((response) => {
        setActivityLogs(response.data);
      })
      .catch((err) => {
        console.error("Error fetching activity logs:", err);
        setError("Failed to load activity logs.");
      })
      .finally(() => {
        setLoading(false); // End loading
      });

  }, [organizationId]);

  const processActivityData = (logs) => {
    const actionCounts = {};
    logs.forEach((log) => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
    });
    return Object.keys(actionCounts).map((action) => ({
      action,
      count: actionCounts[action],
    }));
  };

  const activityData = processActivityData(activityLogs);

  if (!organizationId) return <p>Loading organization...</p>;

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
        activeWorkspace={organizationId}
      />
      
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header toggleSidebar={toggleSidebar} />
        
        <div className="activity-container">
          <h2 className="org-name">{organization.name} - Activity Logs</h2>

          {/* Chart Buttons */}
          <div className="chart-buttons">
            <button 
              className={`chart-button ${chartType === "bar" ? "active" : ""}`}
              onClick={() => setChartType("bar")}
            >
              Bar Chart
            </button>
            <button 
              className={`chart-button ${chartType === "line" ? "active" : ""}`}
              onClick={() => setChartType("line")}
            >
              Line Chart
            </button>
            <button 
              className={`chart-button ${chartType === "pie" ? "active" : ""}`}
              onClick={() => setChartType("pie")}
            >
              Pie Chart
            </button>
          </div>

          {/* Chart Section */}
          <div className="activity-chart">
            <h3>Activity Overview</h3>
            {loading ? (
              <p>Loading chart...</p> // Loading placeholder
            ) : error ? (
              <p>{error}</p> // Error message
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                {chartType === "bar" && (
                  <BarChart data={activityData}>
                    <XAxis dataKey="action" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" />
                  </BarChart>
                )}
                {chartType === "line" && (
                  <LineChart data={activityData}>
                    <XAxis dataKey="action" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#6366f1" />
                  </LineChart>
                )}
                {chartType === "pie" && activityData.length > 0 ? (
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
                )}
              </ResponsiveContainer>
            )}
          </div>

          {/* Activity Log */}
          <div className="activity-log">
            <h3>Recent Activity</h3>
            {loading ? (
              <p>Loading activity logs...</p> // Loading placeholder
            ) : error ? (
              <p>{error}</p> // Error message
            ) : activityLogs.length > 0 ? (
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
              <p className="no-data">No activity logs available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogPage;