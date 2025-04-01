import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { PlusIcon, ActivityIcon, SettingsIcon } from "../Icons/Icons.jsx";
import { useClerk, OrganizationSwitcher, useOrganization, useOrganizationList } from "@clerk/clerk-react";
import styles from "./Sidebar.module.css";

function Sidebar({ workspaces, activeWorkspace, onWorkspaceChange }) {
  const { user } = useClerk();
  const { organization } = useOrganization(); // Get selected organization
  const { organizationList } = useOrganizationList(); // Get all organizations
  const navigate = useNavigate();

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
        
        {/* Organization Switcher */}
        <OrganizationSwitcher />

        {/* Display all organizations */}
        {organizationList?.map((org) => (
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
        ))}
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
