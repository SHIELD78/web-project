"use client"

import { useState, useEffect } from "react"
import Header from "../Header/Header.jsx"
import Sidebar from "../Sidebar/Sidebar.jsx"
import BoardsGrid from "../Boards/BoardsGrid.jsx"
import styles from "./Dashboard.module.css"

function Dashboard({ workspaces, setWorkspaces, boards, setBoards, activeWorkspace, onWorkspaceChange }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showBoardModal, setShowBoardModal] = useState(false)
  const [boardTitle, setBoardTitle] = useState("")
  const [selectedBackground, setSelectedBackground] = useState("/default-board-bg.jpg")

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth > 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const activeWorkspaceData = workspaces.find((w) => w.id === activeWorkspace)

  // ✅ Show board creation modal
  const handleCreateBoard = () => {
    if (!activeWorkspaceData) {
      console.error("❌ No active workspace found!")
      return
    }

    const remainingBoards = activeWorkspaceData.remainingBoards ?? 4
    if (remainingBoards <= 0) {
      console.warn("⚠️ No remaining boards available!")
      return
    }

    setShowBoardModal(true)
  }

  // ✅ Handle board creation
  const handleConfirmBoardCreation = () => {
    if (!boardTitle.trim()) {
      alert("Please enter a board name")
      return
    }

    const newBoard = {
      id: Date.now(),
      title: boardTitle,
      workspaceId: activeWorkspace,
      backgroundImage: selectedBackground,
    }

    setBoards((prevBoards) => [...prevBoards, newBoard])
    setWorkspaces((prev) =>
      prev.map((w) =>
        w.id === activeWorkspace
          ? { ...w, remainingBoards: Math.max(w.remainingBoards - 1, 0) }
          : w
      )
    )

    setBoardTitle("")
    setShowBoardModal(false)
  }

  return (
    <div className={styles.dashboard}>
      <Header
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activeWorkspace={activeWorkspaceData}
        workspaces={workspaces}
        onWorkspaceSelect={onWorkspaceChange}
        handleCreateBoard={handleCreateBoard}
      />
      <div className={`${styles.content} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <Sidebar
          workspaces={workspaces}
          setWorkspaces={setWorkspaces}
          activeWorkspace={activeWorkspace}
          onWorkspaceChange={onWorkspaceChange}
          isOpen={isSidebarOpen}
        />
        <main className={styles.main}>
          <BoardsGrid
            boards={boards.filter((b) => b.workspaceId === activeWorkspace)}
            setBoards={setBoards} 
            workspaceId={activeWorkspace}
            remainingBoards={activeWorkspaceData?.remainingBoards ?? 4}
            handleCreateBoard={handleCreateBoard}
          />
        </main>
      </div>

      {/* ✅ Board Creation Modal */}
      {showBoardModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Create a New Board</h3>
            
            <input
              type="text"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              placeholder="Enter board name"
              className={styles.inputField}
            />
            
            <label>Choose Background:</label>
            
            <div className={styles.backgroundOptions}>
              {["/images/img1.jpg", "/images/img2.jpg", "/images/img3.jpg"].map((bg, index) => (
                <div
                  key={index}
                  className={`${styles.backgroundPreview} ${selectedBackground === bg ? styles.selected : ""}`}
                  style={{ backgroundImage: `url(${bg})` }}
                  onClick={() => setSelectedBackground(bg)}
                />
              ))}
            </div>

            <button onClick={handleConfirmBoardCreation} className={styles.createButton}>Create</button>
            <button onClick={() => setShowBoardModal(false)} className={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard