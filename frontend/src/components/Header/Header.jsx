"use client";

import { useState } from "react";
import { useClerk } from "@clerk/clerk-react"; // Import Clerk hook
import styles from "./Header.module.css";

function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { signOut } = useClerk(); // Get the signOut function

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <span>O</span>
          </div>
          <span className={styles.logoText}>Organizo</span>
        </div>
      </div>

      <div className={styles.rightSection}>
        {/* Sign Out Button (Left of Avatar) */}
        <button className={styles.signOutButton} onClick={() => signOut()}>
          Sign Out
        </button>

        {/* User Avatar */}
        <div className={styles.userProfile} onClick={() => setUserMenuOpen(!userMenuOpen)}>
          <div className={styles.avatar}>A</div>
        </div>
      </div>
    </header>
  );
}

export default Header;