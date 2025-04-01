"use client"

import { useState } from "react"
import { MenuIcon, ChevronDownIcon } from "../Icons/Icons.jsx"
import styles from "./Header.module.css"

function Header({ toggleSidebar, activeWorkspace, workspaces, onWorkspaceSelect }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button className={styles.menuButton} onClick={toggleSidebar}>
          <MenuIcon />
        </button>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <span>O</span>
          </div>
          <span className={styles.logoText}>Organizo</span>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.workspaceSelector} onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}>
          {activeWorkspace?.name ? (
            <>
              <div className={styles.workspaceIcon} style={{ backgroundColor: "#6c5ce7" }}>
                {activeWorkspace.name.charAt(0).toUpperCase()}
              </div>
              <span>{activeWorkspace.name}</span>
              <ChevronDownIcon />
            </>
          ) : (
            <span className={styles.placeholderText}>Select a workspace</span>
          )}
          {workspaceMenuOpen && (
            <div className={styles.workspaceMenu}>
              {workspaces.length > 0 ? (
                workspaces.map((workspace) => (
                  <div
                    key={workspace.id}
                    className={styles.workspaceOption}
                    onClick={() => {
                      onWorkspaceSelect(workspace.id)
                      setWorkspaceMenuOpen(false)
                    }}
                  >
                    {workspace.name}
                  </div>
                ))
              ) : (
                <div className={styles.noWorkspaces}>No workspaces available</div>
              )}
            </div>
          )}
        </div>

        <div className={styles.userProfile} onClick={() => setUserMenuOpen(!userMenuOpen)}>
          <div className={styles.avatar}>A</div>
        </div>
      </div>
    </header>
  )
}

export default Header