"use client"

import { useState, useEffect } from "react"
import "./kanban.css"

const KanbanBoard = ({ backgroundImage }) => {
  // State for columns (lists), tasks, and modal
  const [columns, setColumns] = useState([])
  const [tasks, setTasks] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState("") // 'task', 'column', or 'reminder'
  const [modalData, setModalData] = useState({})
  const [draggedItem, setDraggedItem] = useState(null)
  const [draggedList, setDraggedList] = useState(null)

  useEffect(() => {
    // API: Fetch all columns
    const fetchColumns = async () => {
      try {
        // const response = await fetch('/api/columns');
        // const data = await response.json();
        // setColumns(data);

        // Placeholder data
        setColumns([
          { id: "col1", title: "To Do", order: 1 },
          { id: "col2", title: "In Progress", order: 2 },
          { id: "col3", title: "Done", order: 3 },
        ])
      } catch (error) {
        console.error("Error fetching columns:", error)
      }
    }

    fetchColumns()
  }, [])

  useEffect(() => {
    // API: Fetch tasks for each column
    const fetchTasks = async () => {
      try {
        const tasksObj = {}

        // For each column, fetch its tasks
        // for (const column of columns) {
        //   const response = await fetch(`/api/columns/${column.id}/tasks`);
        //   const data = await response.json();
        //   tasksObj[column.id] = data;
        // }

        // Placeholder data
        tasksObj["col1"] = [
          {
            id: "t1",
            title: "Research competitors",
            description: "Analyze top 5 competitors",
            columnId: "col1",
            reminder: null,
          },
          {
            id: "t2",
            title: "Create wireframes",
            description: "Design initial wireframes for homepage",
            columnId: "col1",
            reminder: "2023-05-20T10:00",
          },
        ]
        tasksObj["col2"] = [
          {
            id: "t3",
            title: "Implement login page",
            description: "Create React components for login",
            columnId: "col2",
            reminder: null,
          },
        ]
        tasksObj["col3"] = [
          {
            id: "t4",
            title: "Setup project repo",
            description: "Initialize Git repository",
            columnId: "col3",
            reminder: null,
          },
          {
            id: "t5",
            title: "Configure CI/CD",
            description: "Setup GitHub Actions workflow",
            columnId: "col3",
            reminder: "2023-05-25T15:30",
          },
        ]

        setTasks(tasksObj)
      } catch (error) {
        console.error("Error fetching tasks:", error)
      }
    }

    if (columns.length > 0) {
      fetchTasks()
    }
  }, [columns])

  const handleAddColumn = () => {
    setModalType("column")
    setModalData({})
    setIsModalOpen(true)
  }

  const handleEditColumn = (column) => {
    setModalType("column")
    setModalData(column)
    setIsModalOpen(true)
  }

  const handleAddTask = (columnId) => {
    setModalType("task")
    setModalData({ columnId, description: "", reminder: null })
    setIsModalOpen(true)
  }

  const handleEditTask = (task) => {
    setModalType("task")
    setModalData(task)
    setIsModalOpen(true)
  }

  const handleAddReminder = (task) => {
    setModalType("reminder")
    setModalData(task)
    setIsModalOpen(true)
  }

  const handleSaveModal = async () => {
    if (modalType === "column") {
      if (modalData.id) {
        // API: Update column details
        // await fetch(`/api/columns/${modalData.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(modalData),
        // });

        // Update locally
        setColumns(columns.map((column) => (column.id === modalData.id ? { ...column, ...modalData } : column)))
      } else {
        // API: Add a new column
        // const response = await fetch('/api/columns', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ ...modalData, order: columns.length + 1 }),
        // });
        // const newColumn = await response.json();

        // Add locally
        const newColumn = {
          id: `col-${Date.now()}`,
          title: modalData.title || "New Column",
          order: columns.length + 1,
        }
        setColumns([...columns, newColumn])
        setTasks({ ...tasks, [newColumn.id]: [] })
      }
    } else if (modalType === "task") {
      const columnId = modalData.columnId

      if (modalData.id) {
        // API: Update task details
        // await fetch(`/api/tasks/${modalData.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(modalData),
        // });

        // Update locally
        setTasks({
          ...tasks,
          [columnId]: tasks[columnId].map((task) => (task.id === modalData.id ? { ...task, ...modalData } : task)),
        })
      } else {
        // API: Add a new task
        // const response = await fetch('/api/columns/${columnId}/tasks', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(modalData),
        // });
        // const newTask = await response.json();

        // Add locally
        const newTask = {
          id: `task-${Date.now()}`,
          title: modalData.title || "New Task",
          description: modalData.description || "",
          columnId,
          reminder: modalData.reminder,
        }
        setTasks({
          ...tasks,
          [columnId]: [...(tasks[columnId] || []), newTask],
        })
      }
    } else if (modalType === "reminder") {
      // Update task with reminder
      const updatedTask = { ...modalData }

      // API: Update task with reminder
      // await fetch(`/api/tasks/${modalData.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedTask),
      // });

      // Update locally
      setTasks({
        ...tasks,
        [updatedTask.columnId]: tasks[updatedTask.columnId].map((task) =>
          task.id === updatedTask.id ? updatedTask : task,
        ),
      })
    }

    setIsModalOpen(false)
  }

  const handleDeleteColumn = async (columnId) => {
    // API: Delete a column
    // await fetch(`/api/columns/${columnId}`, {
    //   method: 'DELETE'
    // });

    // Delete locally
    setColumns(columns.filter((column) => column.id !== columnId))

    // Remove tasks for this column
    const newTasks = { ...tasks }
    delete newTasks[columnId]
    setTasks(newTasks)
  }

  const handleDeleteTask = async (taskId, columnId) => {
    // API: Delete a task
    // await fetch(`/api/tasks/${taskId}`, {
    //   method: 'DELETE'
    // });

    // Delete locally
    setTasks({
      ...tasks,
      [columnId]: tasks[columnId].filter((task) => task.id !== taskId),
    })
  }

  // Drag and drop handlers for tasks
  const handleDragTask = (e, task, fromColumnId) => {
    e.stopPropagation() // Prevent column dragging when dragging a task
    e.dataTransfer.setData("taskId", task.id)
    e.dataTransfer.setData("fromColumnId", fromColumnId)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDropTask = (e, toColumnId) => {
    e.preventDefault()

    const taskId = e.dataTransfer.getData("taskId")
    const fromColumnId = e.dataTransfer.getData("fromColumnId")

    if (!taskId || fromColumnId === toColumnId) return

    // Find the task in the source column
    const taskToMove = tasks[fromColumnId]?.find((task) => task.id === taskId)

    if (!taskToMove) return

    // Create updated task with new columnId
    const updatedTask = { ...taskToMove, columnId: toColumnId }

    // API: Update task's columnId
    // await fetch(`/api/tasks/${taskId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updatedTask),
    // });

    // Update locally
    setTasks({
      ...tasks,
      [fromColumnId]: tasks[fromColumnId].filter((task) => task.id !== taskId),
      [toColumnId]: [...(tasks[toColumnId] || []), updatedTask],
    })
  }

  // Drag and drop handlers for columns
  const handleDragColumn = (e, columnId) => {
    e.dataTransfer.setData("columnId", columnId)
  }

  const handleDropColumn = (e, dropColumnId) => {
    e.preventDefault()

    const draggedColumnId = e.dataTransfer.getData("columnId")

    if (!draggedColumnId || draggedColumnId === dropColumnId) return

    // Find the indices of the dragged and drop columns
    const draggedIndex = columns.findIndex((col) => col.id === draggedColumnId)
    const dropIndex = columns.findIndex((col) => col.id === dropColumnId)

    if (draggedIndex === -1 || dropIndex === -1) return

    // Create a copy of the columns array
    const updatedColumns = [...columns]

    // Remove the dragged column
    const [draggedColumn] = updatedColumns.splice(draggedIndex, 1)

    // Insert it at the drop position
    updatedColumns.splice(dropIndex, 0, draggedColumn)

    // Update the order property for all columns
    const reorderedColumns = updatedColumns.map((col, index) => ({
      ...col,
      order: index + 1,
    }))

    // API: Update column orders
    // const updatePromises = reorderedColumns.map(column =>
    //   fetch(`/api/columns/${column.id}`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(column),
    //   })
    // );
    // await Promise.all(updatePromises);

    // Update locally
    setColumns(reorderedColumns)
  }

  // Sort columns by order
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order)

  return (
    <div className="kanban-board" style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}>
      <div className="kanban-header">
        <h1>Kanban Board</h1>
        <button className="add-column-btn" onClick={handleAddColumn}>
          + Add Column
        </button>
      </div>

      <div className="columns-container">
        {sortedColumns.map((column) => (
          <div
            key={column.id}
            className="column"
            draggable
            onDragStart={(e) => handleDragColumn(e, column.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropColumn(e, column.id)}
          >
            <div className="column-header">
              <h2>{column.title}</h2>
              <div className="column-actions">
                <button onClick={() => handleEditColumn(column)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => handleDeleteColumn(column.id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>

            <div className="tasks-container" onDragOver={handleDragOver} onDrop={(e) => handleDropTask(e, column.id)}>
              {tasks[column.id]?.map((task) => (
                <div key={task.id} className="task" draggable onDragStart={(e) => handleDragTask(e, task, column.id)}>
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    <div className="task-actions">
                      <button onClick={() => handleEditTask(task)} className="edit-btn">
                        Edit
                      </button>
                      <button onClick={() => handleAddReminder(task)} className="reminder-btn">
                        {task.reminder ? "Edit Reminder" : "Add Reminder"}
                      </button>
                      <button onClick={() => handleDeleteTask(task.id, column.id)} className="delete-btn">
                        Delete
                      </button>
                    </div>
                  </div>
                  {task.description && <p className="task-description">{task.description}</p>}
                  {task.reminder && (
                    <div className="task-reminder">
                      <span className="reminder-icon">⏰</span>
                      <span>{new Date(task.reminder).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              ))}
              <button className="add-task-btn" onClick={() => handleAddTask(column.id)}>
                + Add Task
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
                {modalType === "column" ? "Column" : modalType === "task" ? "Task" : "Reminder"}
              </h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {(modalType === "column" || modalType === "task") && (
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
                    value={modalData.reminder || ""}
                    onChange={(e) => setModalData({ ...modalData, reminder: e.target.value })}
                  />
                  {modalData.reminder && (
                    <button
                      className="clear-reminder-btn"
                      onClick={() => setModalData({ ...modalData, reminder: null })}
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

