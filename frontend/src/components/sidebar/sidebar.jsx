import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon, ActivityIcon, SettingsIcon } from "../Icons/Icons.jsx";
import { useClerk, OrganizationSwitcher, useSession } from "@clerk/clerk-react";
import styles from "./Sidebar.module.css";

function Sidebar({ workspaces, activeWorkspace, onWorkspaceChange }) {
  const { user } = useClerk();
  const { session } = useSession();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrganizations() {
      setLoading(true);
      setError(null);
      
      try {
        if (user && session) {
          // Get the token from the session
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
          }
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (user && session) {
      fetchOrganizations();
    }
  }, [user, session]);

  const handleAddWorkspace = () => {
    window.location.href = "/selectorg";
  };

  const handleOrganizationClick = (org) => {
    window.location.href = `/organization/${org.id}`;
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.selectOrgContainer}>
        <h2 className={styles.selectOrgHeader}>Select Organization</h2>
        <button className={styles.addButton} onClick={handleAddWorkspace}>
          <PlusIcon />
        </button>

        {/* Organization Switcher from Clerk */}
        <OrganizationSwitcher />

        {/* Display organizations */}
        {loading && <p>Loading organizations...</p>}
        {error && <p className={styles.errorText}>Error: {error}</p>}
        
        {organizations.length > 0 ? (
          organizations.map((org) => (
            <div
              key={org.id}
              className={styles.organizationItem}
              onClick={() => handleOrganizationClick(org)}
            >
              <div className={styles.workspaceIcon} style={{ backgroundColor: "#0984e3" }}>
                {org.name.charAt(0)}
              </div>
              <span className={styles.workspaceName}>{org.name}</span>
            </div>
          ))
        ) : !loading && !error ? (
          <p>No organizations found.</p>
        ) : null}
      </div>

      <div className={styles.workspacesHeader}>
        <h2>Workspace</h2>
      </div>

      {/* Activity */}
      <div className={styles.workspaceItem} onClick={() => navigate('/ActivityLog')}>
        <div className={styles.workspaceHeader}>
          <ActivityIcon />
          <span className={styles.workspaceName}>Activity</span>
        </div>
      </div>

      {/* Settings */}
      <div className={styles.workspaceItem} onClick={() => navigate('/settings')}>
        <div className={styles.workspaceHeader}>
          <SettingsIcon />
          <span className={styles.workspaceName}>Settings</span>
        </div>
      </div>

      {/* User Profile Section */}
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