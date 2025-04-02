"use client"

import { useState, useRef, useEffect } from "react"
import "./kanban.css"
import {useNavigate} from "react-router-dom"
const KanbanBoard = () => {
  const navigate = useNavigate()
  // State for lists, tasks, and modal
  const [lists, setLists] = useState([
    { id: "list1", title: "To Do", position: 0 },
    { id: "list2", title: "In Progress", position: 1 },
    { id: "list3", title: "Done", position: 2 },
  ])

  const [tasksByList, setTasksByList] = useState({
    list1: [
      {
        id: "task1",
        title: "Research competitors",
        description: "Analyze top 5 competitors in the market",
        listId: "list1",
        reminder: false,
      },
      {
        id: "task2",
        title: "Create wireframes",
        description: "Design initial wireframes for homepage",
        listId: "list1",
        reminder: true,
        reminderTime: "2023-05-20T10:00",
      },
    ],
    list2: [
      {
        id: "task3",
        title: "Implement login page",
        description: "Create React components for login",
        listId: "list2",
        reminder: false,
      },
    ],
    list3: [
      {
        id: "task4",
        title: "Setup project repo",
        description: "Initialize Git repository",
        listId: "list3",
        reminder: false,
      },
      {
        id: "task5",
        title: "Configure CI/CD",
        description: "Setup GitHub Actions workflow",
        listId: "list3",
        reminder: true,
        reminderTime: "2023-05-25T15:30",
      },
    ],
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState("") // 'task', 'list', or 'reminder'
  const [modalData, setModalData] = useState({})
  const [isDraggingAddButton, setIsDraggingAddButton] = useState(false)
  const [addButtonPosition, setAddButtonPosition] = useState({ x: 0, y: 0 })

  const columnsContainerRef = useRef(null)
  const addButtonRef = useRef(null)

  // Scroll to the end when a new list is added
  useEffect(() => {
    if (columnsContainerRef.current) {
      columnsContainerRef.current.scrollLeft = columnsContainerRef.current.scrollWidth
    }
  }, [lists.length])

  // Handle adding a new list
  const handleAddList = () => {
    const newList = {
      id: `list-${Date.now()}`,
      title: "New List",
      position: lists.length,
    }

    setLists([...lists, newList])
    setTasksByList({
      ...tasksByList,
      [newList.id]: [],
    })
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
      description: "",
      reminder: false,
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
  const handleSaveModal = () => {
    if (modalType === "list") {
      if (modalData.id) {
        // Update existing list
        setLists(lists.map((list) => (list.id === modalData.id ? { ...list, title: modalData.title } : list)))
      }
    } else if (modalType === "task") {
      const listId = modalData.listId

      if (modalData.id) {
        // Update existing task
        setTasksByList({
          ...tasksByList,
          [listId]: tasksByList[listId].map((task) => (task.id === modalData.id ? { ...task, ...modalData } : task)),
        })
      } else {
        // Create new task
        const newTask = {
          id: `task-${Date.now()}`,
          title: modalData.title || "New Task",
          description: modalData.description || "",
          listId,
          reminder: false,
        }

        setTasksByList({
          ...tasksByList,
          [listId]: [...(tasksByList[listId] || []), newTask],
        })
      }
    } else if (modalType === "reminder") {
      // Set reminder for task
      const updatedTask = {
        ...modalData,
        reminder: true,
      }

      setTasksByList({
        ...tasksByList,
        [updatedTask.listId]: tasksByList[updatedTask.listId].map((task) =>
          task.id === updatedTask.id ? updatedTask : task,
        ),
      })
    }

    setIsModalOpen(false)
  }

  // Handle deleting a list
  const handleDeleteList = (listId) => {
    setLists(lists.filter((list) => list.id !== listId))

    // Remove tasks for this list
    const newTasksByList = { ...tasksByList }
    delete newTasksByList[listId]
    setTasksByList(newTasksByList)
  }

  // Handle deleting a task
  const handleDeleteTask = (taskId, listId) => {
    setTasksByList({
      ...tasksByList,
      [listId]: tasksByList[listId].filter((task) => task.id !== taskId),
    })
  }

  // Drag and drop handlers for tasks
  const handleDragTask = (e, task) => {
    e.stopPropagation() // Prevent list dragging when dragging a task
    e.dataTransfer.setData("taskId", task.id)
    e.dataTransfer.setData("fromListId", task.listId)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDropTask = (e, toListId) => {
    e.preventDefault()

    const taskId = e.dataTransfer.getData("taskId")
    const fromListId = e.dataTransfer.getData("fromListId")

    if (!taskId || fromListId === toListId) return

    // Find the task in the source list
    const taskToMove = tasksByList[fromListId]?.find((task) => task.id === taskId)

    if (!taskToMove) return

    // Update task with new listId
    const updatedTask = { ...taskToMove, listId: toListId }

    // Update local state
    setTasksByList({
      ...tasksByList,
      [fromListId]: tasksByList[fromListId].filter((task) => task.id !== taskId),
      [toListId]: [...(tasksByList[toListId] || []), updatedTask],
    })
  }

  // Drag and drop handlers for lists
  const handleDragList = (e, list) => {
    e.dataTransfer.setData("listId", list.id)
  }

  const handleDropList = (e, dropList) => {
    e.preventDefault()

    const draggedListId = e.dataTransfer.getData("listId")

    if (!draggedListId || draggedListId === dropList.id) return

    // Find the indices of the dragged and drop lists
    const draggedIndex = lists.findIndex((list) => list.id === draggedListId)
    const dropIndex = lists.findIndex((list) => list.id === dropList.id)

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

    // Update local state
    setLists(reorderedLists)
  }

  // Handle dragging the add button
  const handleAddButtonMouseDown = (e) => {
    if (e.button !== 0) return // Only left mouse button

    setIsDraggingAddButton(true)

    const startX = e.clientX
    const startY = e.clientY
    const startLeft = addButtonRef.current.offsetLeft
    const startTop = addButtonRef.current.offsetTop

    const handleMouseMove = (e) => {
      if (!isDraggingAddButton) return

      const newX = startLeft + (e.clientX - startX)
      const newY = startTop + (e.clientY - startY)

      setAddButtonPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
      setIsDraggingAddButton(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  // Handle going back
  const handleBack = () => {
    
    navigate("/dashboard");
    // This would typically navigate back in a real app
    
  }

  return (
    <div className="kanban-board">
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
          <span>Back</span>
        </button>

        <button className="add-list-button" onClick={handleAddList}>
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
        </button>
      </div>

      <div className="columns-container" ref={columnsContainerRef}>
        {lists.map((list) => (
          <div
            key={list.id}
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
                <button onClick={() => handleDeleteList(list.id)} className="delete-btn">
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

            <div className="tasks-container" onDragOver={handleDragOver} onDrop={(e) => handleDropTask(e, list.id)}>
              {tasksByList[list.id]?.map((task) => (
                <div key={task.id} className="task" draggable onDragStart={(e) => handleDragTask(e, task)}>
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
                      <button onClick={() => handleDeleteTask(task.id, list.id)} className="delete-btn">
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
              <button className="add-task-btn" onClick={() => handleAddTask(list.id)}>
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
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {modalData.id ? "Edit" : "Add"}{" "}
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