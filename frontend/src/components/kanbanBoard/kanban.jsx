import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./kanban.css"
import {
  fetchLists,
  fetchTasks,
  createList,
  updateList,
  deleteList,
  createTask,
  updateTask,
  deleteTask,
  setTaskReminder,
} from "./api.js"

const KanbanBoard = ({ boardId, boardTitle, backgroundImage, organizationId }) => {
  const [lists, setLists] = useState([])
  const [tasksByList, setTasksByList] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState("") // 'task', 'list', or 'reminder'
  const [modalData, setModalData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const columnsContainerRef = useRef(null)
  const navigate = useNavigate()

  // Fetch lists and tasks when component mounts
  useEffect(() => {
    const loadBoardData = async () => {
      try {
        setIsLoading(true)

        // Fetch lists for this board
        const listsData = await fetchLists(boardId)

        // Sort lists by position
        const sortedLists = listsData.sort((a, b) => a.position - b.position)
        setLists(sortedLists)

        // Fetch tasks for each list
        const tasksData = await fetchTasks(boardId)

        // Group tasks by listId
        const tasksByListId = {}
        tasksData.forEach((task) => {
          if (!tasksByListId[task.listId]) {
            tasksByListId[task.listId] = []
          }
          tasksByListId[task.listId].push(task)
        })

        // Sort tasks by position within each list
        Object.keys(tasksByListId).forEach((listId) => {
          tasksByListId[listId].sort((a, b) => a.position - b.position)
        })

        setTasksByList(tasksByListId)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load board data")
        setIsLoading(false)
        console.error("Error loading board data:", err)
      }
    }

    if (boardId) {
      loadBoardData()
    }
  }, [boardId])

  // Handle adding a new list
  const handleAddList = async () => {
    try {
      // Calculate the next position
      const nextPosition = lists.length > 0 ? Math.max(...lists.map((list) => list.position)) + 1 : 0

      // Create new list data
      const newListData = {
        title: "New List",
        boardId,
        position: nextPosition,
      }

      // Create the list in the backend
      const createdList = await createList(newListData)

      // Update the local state
      setLists([...lists, createdList])
      setTasksByList({
        ...tasksByList,
        [createdList._id]: [],
      })

      // Scroll to the new list
      setTimeout(() => {
        if (columnsContainerRef.current) {
          columnsContainerRef.current.scrollLeft = columnsContainerRef.current.scrollWidth
        }
      }, 100)
    } catch (err) {
      setError("Failed to add new list")
      console.error("Error adding new list:", err)
    }
  }

  // Handle editing a list
  const handleEditList = (list) => {
    setModalType("list")
    setModalData(list)
    setIsModalOpen(true)
  }

  // Handle adding a task to a list
  const handleAddTask = (listId) => {
    setModalType("task")
    setModalData({
      listId,
      boardId,
      description: "",
      reminder: false,
      position: tasksByList[listId] ? tasksByList[listId].length : 0,
    })
    setIsModalOpen(true)
  }

  // Handle editing a task
  const handleEditTask = (task) => {
    setModalType("task")
    setModalData(task)
    setIsModalOpen(true)
  }

  // Handle adding a reminder to a task
  const handleAddReminder = (task) => {
    setModalType("reminder")
    setModalData(task)
    setIsModalOpen(true)
  }

  // Handle saving modal data
  const handleSaveModal = async () => {
    try {
      if (modalType === "list") {
        if (modalData._id) {
          // Update existing list
          const updatedList = await updateList(modalData._id, {
            title: modalData.title,
          })

          // Update local state
          setLists(lists.map((list) => (list._id === updatedList._id ? updatedList : list)))
        }
      } else if (modalType === "task") {
        if (modalData._id) {
          // Update existing task
          const updatedTask = await updateTask(modalData._id, {
            title: modalData.title,
            description: modalData.description,
            reminder: modalData.reminder,
            reminderTime: modalData.reminderTime,
          })

          // Update local state
          setTasksByList({
            ...tasksByList,
            [updatedTask.listId]: tasksByList[updatedTask.listId].map((task) =>
              task._id === updatedTask._id ? updatedTask : task,
            ),
          })
        } else {
          // Create new task
          const newTask = await createTask({
            title: modalData.title || "New Task",
            description: modalData.description || "",
            boardId: modalData.boardId,
            listId: modalData.listId,
            position: modalData.position,
            reminder: false,
          })

          // Update local state
          setTasksByList({
            ...tasksByList,
            [newTask.listId]: [...(tasksByList[newTask.listId] || []), newTask],
          })
        }
      } else if (modalType === "reminder") {
        // Set reminder for task
        if (modalData.reminderTime) {
          const updatedTask = await updateTask(modalData._id, {
            reminder: true,
            reminderTime: modalData.reminderTime,
          })

          // Send email notification
          await setTaskReminder(modalData._id)

          // Update local state
          setTasksByList({
            ...tasksByList,
            [updatedTask.listId]: tasksByList[updatedTask.listId].map((task) =>
              task._id === updatedTask._id ? updatedTask : task,
            ),
          })
        }
      }

      setIsModalOpen(false)
    } catch (err) {
      setError(`Failed to ${modalData._id ? "update" : "create"} ${modalType}`)
      console.error(`Error ${modalData._id ? "updating" : "creating"} ${modalType}:`, err)
    }
  }

  // Handle deleting a list
  const handleDeleteList = async (listId) => {
    try {
      await deleteList(listId)

      // Update local state
      setLists(lists.filter((list) => list._id !== listId))

      // Remove tasks for this list
      const newTasksByList = { ...tasksByList }
      delete newTasksByList[listId]
      setTasksByList(newTasksByList)
    } catch (err) {
      setError("Failed to delete list")
      console.error("Error deleting list:", err)
    }
  }

  // Handle deleting a task
  const handleDeleteTask = async (taskId, listId) => {
    try {
      await deleteTask(taskId)

      // Update local state
      setTasksByList({
        ...tasksByList,
        [listId]: tasksByList[listId].filter((task) => task._id !== taskId),
      })
    } catch (err) {
      setError("Failed to delete task")
      console.error("Error deleting task:", err)
    }
  }

  // Drag and drop handlers for tasks
  const handleDragTask = (e, task) => {
    e.stopPropagation() // Prevent list dragging when dragging a task
    e.dataTransfer.setData("taskId", task._id)
    e.dataTransfer.setData("fromListId", task.listId)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDropTask = async (e, toListId) => {
    e.preventDefault()

    const taskId = e.dataTransfer.getData("taskId")
    const fromListId = e.dataTransfer.getData("fromListId")

    if (!taskId || fromListId === toListId) return

    try {
      // Find the task in the source list
      const taskToMove = tasksByList[fromListId]?.find((task) => task._id === taskId)

      if (!taskToMove) return

      // Calculate new position in target list
      const newPosition = tasksByList[toListId] ? tasksByList[toListId].length : 0

      // Update task with new listId and position
      const updatedTask = await updateTask(taskId, {
        listId: toListId,
        position: newPosition,
      })

      // Update local state
      setTasksByList({
        ...tasksByList,
        [fromListId]: tasksByList[fromListId].filter((task) => task._id !== taskId),
        [toListId]: [...(tasksByList[toListId] || []), { ...taskToMove, listId: toListId, position: newPosition }],
      })
    } catch (err) {
      setError("Failed to move task")
      console.error("Error moving task:", err)
    }
  }

  // Drag and drop handlers for lists
  const handleDragList = (e, list) => {
    e.dataTransfer.setData("listId", list._id)
  }

  const handleDropList = async (e, dropList) => {
    e.preventDefault()

    const draggedListId = e.dataTransfer.getData("listId")

    if (!draggedListId || draggedListId === dropList._id) return

    try {
      // Find the indices of the dragged and drop lists
      const draggedIndex = lists.findIndex((list) => list._id === draggedListId)
      const dropIndex = lists.findIndex((list) => list._id === dropList._id)

      if (draggedIndex === -1 || dropIndex === -1) return

      // Create a copy of the lists array
      const updatedLists = [...lists]

      // Remove the dragged list
      const [draggedList] = updatedLists.splice(draggedIndex, 1)

      // Insert it at the drop position
      updatedLists.splice(dropIndex, 0, draggedList)

      // Update the position property for all lists
      const reorderedLists = updatedLists.map((list, index) => ({
        ...list,
        position: index,
      }))

      // Update positions in the backend
      const updatePromises = reorderedLists.map((list) => updateList(list._id, { position: list.position }))
      await Promise.all(updatePromises)

      // Update local state
      setLists(reorderedLists)
    } catch (err) {
      setError("Failed to reorder lists")
      console.error("Error reordering lists:", err)
    }
  }

  // Handle going back to boards view
  const handleBack = () => {
    navigate(`/organization/${organizationId}/boards`)
  }

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div className="kanban-board" style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}>
      <div className="kanban-topbar">
        <button className="back-button" onClick={handleBack}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back to Boards</span>
        </button>
        <h1>{boardTitle || "Kanban Board"}</h1>
      </div>

      <div className="columns-container" ref={columnsContainerRef}>
        {lists.map((list) => (
          <div
            key={list._id}
            className="column"
            draggable
            onDragStart={(e) => handleDragList(e, list)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropList(e, list)}
          >
            <div className="column-header">
              <h2>{list.title}</h2>
              <div className="column-actions">
                <button onClick={() => handleEditList(list)} className="edit-btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button onClick={() => handleDeleteList(list._id)} className="delete-btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="tasks-container" onDragOver={handleDragOver} onDrop={(e) => handleDropTask(e, list._id)}>
              {tasksByList[list._id]?.map((task) => (
                <div key={task._id} className="task" draggable onDragStart={(e) => handleDragTask(e, task)}>
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    <div className="task-actions">
                      <button onClick={() => handleEditTask(task)} className="edit-btn">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button onClick={() => handleAddReminder(task)} className="reminder-btn">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                      </button>
                      <button onClick={() => handleDeleteTask(task._id, list._id)} className="delete-btn">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {task.description && <p className="task-description">{task.description}</p>}
                  {task.reminder && (
                    <div className="task-reminder">
                      <span className="reminder-icon">⏰</span>
                      <span>{new Date(task.reminderTime).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              ))}
              <button className="add-task-btn" onClick={() => handleAddTask(list._id)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Task
              </button>
            </div>
          </div>
        ))}

        {/* Add List Button */}
        <div className="add-list-column">
          <button className="add-list-btn" onClick={handleAddList}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add List</span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {modalData._id ? "Edit" : "Add"}{" "}
                {modalType === "list" ? "List" : modalType === "task" ? "Task" : "Reminder"}
              </h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {(modalType === "list" || modalType === "task") && (
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={modalData.title || ""}
                    onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                    placeholder={`Enter ${modalType} title`}
                  />
                </div>
              )}

              {modalType === "task" && (
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={modalData.description || ""}
                    onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                    placeholder="Enter task description"
                  />
                </div>
              )}

              {(modalType === "task" || modalType === "reminder") && (
                <div className="form-group">
                  <label>Reminder (optional)</label>
                  <input
                    type="datetime-local"
                    value={modalData.reminderTime || ""}
                    onChange={(e) => setModalData({ ...modalData, reminderTime: e.target.value })}
                  />
                  {modalData.reminderTime && (
                    <button
                      className="clear-reminder-btn"
                      onClick={() => setModalData({ ...modalData, reminderTime: null, reminder: false })}
                    >
                      Clear Reminder
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSaveModal}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default KanbanBoard

