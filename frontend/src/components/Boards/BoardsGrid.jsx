import { UserIcon, PlusIcon } from "../Icons/Icons";
import { AiOutlineDelete } from "react-icons/ai";
import styles from "./BoardsGrid.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const API_URL = "http://localhost:3000/api";

function BoardsGrid({ boards, setBoards, workspaceId, handleCreateBoard }) {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  // Handle board deletion
  const handleDeleteBoard = async (boardId, e) => {
    e.stopPropagation();

    try {
      const token = await getToken();
      const response = await axios.delete(`${API_URL}/boards/${boardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setBoards(boards.filter((board) => board._id !== boardId));
      }
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  return (
    <div className={styles.boardsContainer}>
      <div className={styles.boardsHeader}>
        <UserIcon />
        <h2>Your Boards</h2>
      </div>

      <div className={styles.boardsGrid}>
        {boards.length > 0 &&
          boards.map((board, index) => (
            <div
              key={board._id || index}
              className={styles.boardCard}
              onClick={() => navigate(`/board/${board._id}`)}
            >
              <div
                className={styles.boardBackground}
                style={{
                  backgroundImage: `url(${board.imageUrl || '/images/default-board-bg.jpg'})`,
                }}
              >
                <h3 className={styles.boardTitle}>{board.title}</h3>
              </div>
              <button
                className={styles.deleteButton}
                onClick={(e) => handleDeleteBoard(board._id, e)}
              >
                <AiOutlineDelete />
              </button>
            </div>
          ))}

        <div className={styles.createBoardCard} onClick={handleCreateBoard}>
          <div className={styles.createBoardContent}>
            <PlusIcon />
            <h3>Create New Board</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardsGrid;