import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ActivityIcon, SettingsIcon } from "../Icons/Icons.jsx";
import { useClerk, useSession } from "@clerk/clerk-react";
import styles from "./Sidebar.module.css";

// Dashboard Icon
export function DashboardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M3 13h8V3H3v10zm10 8h8V11h-8v10zm-10 0h8v-6H3v6zm10-18v6h8V3h-8z" />
    </svg>
  );
}

function Sidebar({ activeWorkspace, onWorkspaceChange }) {
  const { user } = useClerk();
  const { session } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [organizations, setOrganizations] = useState(() => {
    // Load cached organizations from sessionStorage (if available)
    const cachedOrgs = sessionStorage.getItem("organizations");
    return cachedOrgs ? JSON.parse(cachedOrgs) : [];
  });
  const [loading, setLoading] = useState(organizations.length === 0); // Only show loading initially
  const [error, setError] = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    async function fetchOrganizations() {
      if (organizations.length > 0) return; // Don't fetch again if data is already available

      setLoading(true);
      setError(null);

      try {
        if (user && session) {
          const token = await session.getToken();
          if (token) {
            const response = await fetch("http://localhost:3000/api/organizations", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Failed to fetch organizations");
            }

            const data = await response.json();
            setOrganizations(data);
            sessionStorage.setItem("organizations", JSON.stringify(data)); // Cache data
          }
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (user && session && organizations.length === 0) {
      fetchOrganizations();
    }
  }, [user, session, organizations.length]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orgId = params.get("orgId");

    if (orgId && openDropdowns[orgId]) {
      setOpenDropdowns((prev) => ({ ...prev, [orgId]: true }));
    }
  }, [location]);

  const handleOrganizationClick = (orgId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [orgId]: !prev[orgId],
    }));
    navigate(`/dashboard?orgId=${orgId}`);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.selectOrgContainer}>
        <h2 className={styles.selectOrgHeader}>Select Organization</h2>

        {loading && organizations.length === 0 && <p>Loading organizations...</p>}
        {error && <p className={styles.errorText}>Error: {error}</p>}
        {organizations.length > 0 ? (
          organizations.map((org) => (
            <div key={org.id} className={`${styles.organizationItem} ${openDropdowns[org.id] ? styles.active : ""}`}>
              <div className={styles.orgHeader} onClick={() => handleOrganizationClick(org.id)}>
                <div className={styles.workspaceIcon} style={{ backgroundColor: "#0984e3" }}>
                  {org.name.charAt(0)}
                </div>
                <span className={styles.workspaceName}>{org.name}</span>
              </div>

              {openDropdowns[org.id] && (
                <div className={styles.dropdownMenu}>
                  <Link to={`/dashboard?orgId=${org.id}`} className={styles.dropdownItem}>
                    <DashboardIcon /> Dashboard
                  </Link>
                  <Link to={`/activitylog/organization/${org.id}`} className={styles.dropdownItem}>
                    <ActivityIcon /> Activity
                  </Link>
                  <Link to={`/settings?orgId=${org.id}`} className={styles.dropdownItem}>
                    <SettingsIcon /> Settings
                  </Link>
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
            {user.imageUrl ? <img src={user.imageUrl || "/placeholder.svg"} alt={user.fullName || "User"} /> : <span>{(user.fullName || "User").charAt(0)}</span>}
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