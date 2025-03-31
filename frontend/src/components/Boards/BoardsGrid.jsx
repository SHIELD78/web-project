import { UserIcon, PlusIcon } from "../Icons/Icons"
import styles from "./BoardsGrid.module.css"

function BoardsGrid({ boards, setBoards, remainingBoards, handleCreateBoard }) {
  return (
    <div className={styles.boardsContainer}>
      <div className={styles.boardsHeader}>
        <UserIcon />
        <h2>Your Boards</h2>
      </div>

      <div className={styles.boardsGrid}>
        {boards.length > 0 &&
          boards.map((board) => (
            <div key={board.id} className={styles.boardCard}>
              <div className={styles.boardBackground} style={{ backgroundImage: `url(${board.backgroundImage})` }}>
                <h3 className={styles.boardTitle}>{board.title}</h3>
              </div>
            </div>
          ))
        }

        {/* ✅ "Create New Board" Button */}
        <div
          className={styles.createBoardCard}
          onClick={handleCreateBoard} // ✅ Ensure this function is called
        >
          <div className={styles.createBoardContent}>
            <PlusIcon />
            <h3>Create New Board</h3>
            <p>{remainingBoards} remaining</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardsGrid