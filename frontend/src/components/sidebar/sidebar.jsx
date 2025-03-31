"use client"

import { useState } from "react"
import {
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  GridIcon,
  ActivityIcon,
  SettingsIcon,
  BillingIcon,
} from "../Icons/Icons.jsx"
import { useClerk } from "@clerk/clerk-react";  // Clerk integration
import styles from "./Sidebar.module.css"

function Sidebar({ workspaces, activeWorkspace, onWorkspaceChange, isOpen, setWorkspaces }) {
  const [expandedWorkspaces, setExpandedWorkspaces] = useState({
    [activeWorkspace]: true,
  })
  
  const [activeNavItem, setActiveNavItem] = useState("boards")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState("")

  // Clerk user management
  const { user } = useClerk();  // Get the current user from Clerk

  // Toggle workspace expansion
  const toggleWorkspace = (workspaceId) => {
    setExpandedWorkspaces((prev) => ({
      ...prev,
      [workspaceId]: !prev[workspaceId],
    }))
  }

  // Open the workspace creation modal
  const handleAddWorkspace = () => {
    setIsModalOpen(true)
  }

  // Create a new workspace
  const handleCreateWorkspace = () => {
    if (!user) {
      alert("You must be logged in to create a workspace.");
      return;
    }

    if (newWorkspaceName.trim()) {
      const newWorkspace = {
        id: `ws${workspaces.length + 1}`,
        name: newWorkspaceName,
        remainingBoards: 3,
        userId: user.id, // Associate workspace with the logged-in user
      }

      setWorkspaces((prev) => [...prev, newWorkspace])
      setNewWorkspaceName("")
      setIsModalOpen(false)

      // Optionally, save this workspace to a backend or Clerk's database
    } else {
      alert("Please enter a workspace name")
    }
  }

  // Close modal without creating a workspace
  const handleModalClose = () => {
    setIsModalOpen(false)
    setNewWorkspaceName("")
  }

  // If sidebar is not open, return collapsed view
  if (!isOpen) {
    return <div className={styles.sidebarCollapsed}></div>
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.workspacesHeader}>
        <h2>Workspaces</h2>
        <button className={styles.addButton} onClick={handleAddWorkspace}>
          <PlusIcon />
        </button>
      </div>

      {/* Create Workspace Modal */}
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Create New Workspace</h3>
            <input
              type="text"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="Enter workspace name"
            />
            <button onClick={handleCreateWorkspace}>Create</button>
            <button onClick={handleModalClose}>Cancel</button>
          </div>
        </div>
      )}

      <div className={styles.workspacesList}>
        {workspaces.map((workspace) => (
          <div key={workspace.id} className={styles.workspaceItem}>
            <div
              className={`${styles.workspaceHeader} ${activeWorkspace === workspace.id ? styles.active : ""}`}
              onClick={() => {
                onWorkspaceChange(workspace.id)
                toggleWorkspace(workspace.id)
              }}
            >
              <div className={styles.workspaceIcon} style={{ backgroundColor: "#6c5ce7" }}>
                {workspace.name.charAt(0)}
              </div>
              <span className={styles.workspaceName}>{workspace.name}</span>
              <button
                className={styles.expandButton}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleWorkspace(workspace.id)
                }}
              >
                {expandedWorkspaces[workspace.id] ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </button>
            </div>

            {expandedWorkspaces[workspace.id] && activeWorkspace === workspace.id && (
              <div className={styles.workspaceNav}>
                <button
                  className={`${styles.navItem} ${activeNavItem === "boards" ? styles.activeNavItem : ""}`}
                  onClick={() => setActiveNavItem("boards")}
                >
                  <GridIcon />
                  <span>Boards</span>
                </button>
                <button
                  className={`${styles.navItem} ${activeNavItem === "activity" ? styles.activeNavItem : ""}`}
                  onClick={() => setActiveNavItem("activity")}
                >
                  <ActivityIcon />
                  <span>Activity</span>
                </button>
                <button
                  className={`${styles.navItem} ${activeNavItem === "settings" ? styles.activeNavItem : ""}`}
                  onClick={() => setActiveNavItem("settings")}
                >
                  <SettingsIcon />
                  <span>Settings</span>
                </button>
                <button
                  className={`${styles.navItem} ${activeNavItem === "billing" ? styles.activeNavItem : ""}`}
                  onClick={() => setActiveNavItem("billing")}
                >
                  <BillingIcon />
                  <span>Billing</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar