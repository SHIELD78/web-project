"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../Header/Header.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
import BoardsGrid from "../Boards/BoardsGrid.jsx";
import styles from "./Dashboard.module.css";

const API_URL = "http://localhost:3000/api";

function Dashboard({ workspaces, setWorkspaces, onWorkspaceChange }) {
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [boardTitle, setBoardTitle] = useState("");
  const [selectedBackground, setSelectedBackground] = useState("/images/default-board-bg.jpg");
  const [boards, setBoards] = useState([]);

  const { getToken, userId } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get organizationId from URL
  const organizationId = searchParams.get("orgId");

  useEffect(() => {
    if (organizationId) {
      fetchBoards(organizationId);
    }
  }, [organizationId]);

  const fetchBoards = async (orgId) => {
    try {
      const token = await getToken();
      const response = await axios.get(`${API_URL}/boards/${orgId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoards(response.data);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  const handleCreateBoard = () => {
    setShowBoardModal(true);
  };

  const handleConfirmBoardCreation = async () => {
    if (!boardTitle.trim()) {
      alert("Please enter a board name");
      return;
    }

    try {
      const token = await getToken();
      const response = await axios.post(
        `${API_URL}/boards`,
        {
          title: boardTitle,
          organizationId,
          imageUrl: selectedBackground,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        setBoards((prevBoards) => [...prevBoards, response.data]);
      }
    } catch (error) {
      console.error("Error creating board:", error);
    }

    setBoardTitle("");
    setShowBoardModal(false);
  };

  return (
    <div className={styles.dashboard}>
      <Header
        activeWorkspace={organizationId}
        workspaces={workspaces}
        onWorkspaceSelect={onWorkspaceChange}
        handleCreateBoard={handleCreateBoard}
      />
      <div className={styles.content}>
        <Sidebar
          workspaces={workspaces}
          setWorkspaces={setWorkspaces}
          activeWorkspace={organizationId}
          onWorkspaceChange={onWorkspaceChange}
        />
        <main className={styles.main}>
          <BoardsGrid
            boards={boards}
            setBoards={setBoards}
            workspaceId={organizationId}
            handleCreateBoard={handleCreateBoard}
          />
        </main>
      </div>

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
            <button onClick={handleConfirmBoardCreation} className={styles.createButton}>
              Create
            </button>
            <button onClick={() => setShowBoardModal(false)} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;