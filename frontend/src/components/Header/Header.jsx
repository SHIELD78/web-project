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
            <span>T</span>
          </div>
          <span className={styles.logoText}>Taskify</span>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.workspaceSelector} onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}>
          {activeWorkspace && (
            <>
              <div className={styles.workspaceIcon} style={{ backgroundColor: "#6c5ce7" }}>
                {activeWorkspace.name.charAt(0)}
              </div>
              <span>{activeWorkspace.name}</span>
              <ChevronDownIcon />
            </>
          )}
          {workspaceMenuOpen && (
            <div className={styles.workspaceMenu}>
              {workspaces.map((workspace) => (
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
              ))}
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