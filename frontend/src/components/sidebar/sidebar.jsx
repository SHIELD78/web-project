"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  GridIcon,
  ActivityIcon,
  SettingsIcon,
  BillingIcon,
} from "../Icons/Icons.jsx";
import { useClerk, useOrganization } from "@clerk/clerk-react";
import styles from "./Sidebar.module.css";

function Sidebar({ workspaces, activeWorkspace, onWorkspaceChange, isOpen }) {
  const { user } = useClerk();
  const { organization } = useOrganization(); // Get selected organization
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [expandedWorkspaces, setExpandedWorkspaces] = useState({ [activeWorkspace]: true });

  useEffect(() => {
    if (organization) {
      setSelectedOrg(organization); // Store the selected organization
    }
  }, [organization]);

  const toggleWorkspace = (workspaceId) => {
    setExpandedWorkspaces((prev) => ({
      ...prev,
      [workspaceId]: !prev[workspaceId],
    }));
  };

  const handleAddWorkspace = () => {
    window.location.href = "/selectorg";
  };

  const handleOrganizationClick = () => {
    if (organization) {
      window.location.href = `/organization/${organization.id}`;
    }
  };

  if (!isOpen) {
    return <div className={styles.sidebarCollapsed}></div>;
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.selectOrgContainer}>
        <h2 className={styles.selectOrgHeader}>Select Organization</h2>
        <button className={styles.addButton} onClick={handleAddWorkspace}>
          <PlusIcon />
        </button>

        {/* Display the selected organization */}
        {selectedOrg && (
          <div className={styles.organizationItem} onClick={handleOrganizationClick}>
            <div className={styles.workspaceIcon} style={{ backgroundColor: "#0984e3" }}>
              {selectedOrg.name.charAt(0)}
            </div>
            <span className={styles.workspaceName}>{selectedOrg.name}</span>
          </div>
        )}
      </div>

      <div className={styles.workspacesHeader}>
        <h2>Workspace</h2>
      </div>

      {/* Activity */}
      <div className={styles.workspaceItem}>
        <div className={styles.workspaceHeader}>
          <ActivityIcon />
          <span className={styles.workspaceName}>Activity</span>
        </div>
      </div>

      {/* Settings */}
      <div className={styles.workspaceItem}>
        <div className={styles.workspaceHeader}>
          <SettingsIcon />
          <span className={styles.workspaceName}>Settings</span>
        </div>
      </div>

      {/* Tasks */}
      <div className={styles.workspaceItem}>
        <div className={styles.workspaceHeader}>
          <GridIcon />
          <span className={styles.workspaceName}>Tasks</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;