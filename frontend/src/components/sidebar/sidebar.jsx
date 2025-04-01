import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon, ActivityIcon, SettingsIcon } from "../Icons/Icons.jsx";
import { useClerk, OrganizationSwitcher, useSession } from "@clerk/clerk-react";
import styles from "./Sidebar.module.css";

// Dashboard Icon
export function DashboardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
    >
      <path d="M3 13h8V3H3v10zm10 8h8V11h-8v10zm-10 0h8v-6H3v6zm10-18v6h8V3h-8z" />
    </svg>
  );
}

function Sidebar({ workspaces, activeWorkspace, onWorkspaceChange }) {
  const { user } = useClerk();
  const { session } = useSession();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [hasFetched, setHasFetched] = useState(false); // Track if data has already been fetched

  useEffect(() => {
    async function fetchOrganizations() {
      if (hasFetched) return; // Don't fetch if already fetched

      setLoading(true);
      setError(null);

      try {
        if (user && session) {
          const token = await session.getToken();
          if (token) {
            const response = await fetch("http://localhost:3000/api/organizations", {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              },
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Failed to fetch organizations");
            }

            const data = await response.json();
            setOrganizations(data);
            setHasFetched(true); // Mark data as fetched
          }
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (user && session && !hasFetched) {
      fetchOrganizations();
    }
  }, [user, session, hasFetched]);

  const handleAddWorkspace = () => {
    window.location.href = "/selectorg";
  };

  const toggleDropdown = (orgId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [orgId]: !prev[orgId],
    }));
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.selectOrgContainer}>
        <h2 className={styles.selectOrgHeader}>Select Organization</h2>
        
       
        {loading && !hasFetched && <p>Loading organizations...</p>}
        {error && <p className={styles.errorText}>Error: {error}</p>}
        {organizations.length > 0 ? (
          organizations.map((org) => (
            <div
              key={org.id}
              className={`${styles.organizationItem} ${openDropdowns[org.id] ? styles.active : ""}`}
              onClick={() => toggleDropdown(org.id)} // Click to toggle dropdown
            >
              <div className={styles.orgHeader}>
                <div className={styles.workspaceIcon} style={{ backgroundColor: "#0984e3" }}>
                  {org.name.charAt(0)}
                </div>
                <span className={styles.workspaceName}>{org.name}</span>
              </div>
              {openDropdowns[org.id] && (
                <div className={styles.dropdownMenu}>
                  <div
                    className={styles.dropdownItem}
                    onClick={() =>{ if (activeWorkspace !== org.id) {
                      onWorkspaceChange(org.id); // Change the active workspace
                    }
                  
                    // Navigate to the dashboard and pass the workspace ID as a URL parameter
                    navigate(`/dashboard?orgId=${org.id}`);}}
                  >
                    <DashboardIcon /> Dashboard
                  </div>
                  <div
                    className={styles.dropdownItem}
                    onClick={() => navigate(`/activitylog/organization/${org.id}`)} // Navigate to activity log for the specific organization
                  >
                    <ActivityIcon /> Activity
                  </div>
                  <div
                    className={styles.dropdownItem}
                    onClick={() => navigate(`/settings`)} // Navigate to settings page
                  >
                    <SettingsIcon /> Settings
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          !loading && !error && <p>No organizations found.</p>
        )}
      </div>

      {user && (
        <div className={styles.userSection}>
          <div className={styles.userAvatar}>
            {user.imageUrl ? (
              <img src={user.imageUrl || "/placeholder.svg"} alt={user.fullName || "User"} />
            ) : (
              <span>{(user.fullName || "User").charAt(0)}</span>
            )}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.fullName || "User"}</span>
            <span className={styles.userEmail}>{user.primaryEmailAddress?.emailAddress || ""}</span>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;