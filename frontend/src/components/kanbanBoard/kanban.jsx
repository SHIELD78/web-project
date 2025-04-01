
import { useState, useEffect } from "react"
import "./kanban.css"

const KanbanBoard = () => {
  // State for lists, tasks, and modal
  const [lists, setLists] = useState([])
  const [tasks, setTasks] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState("") // 'task' or 'list'
  const [modalData, setModalData] = useState({})
  const [draggedItem, setDraggedItem] = useState(null)
  const [draggedList, setDraggedList] = useState(null)

  useEffect(() => {
    // API: Fetch all lists
    const fetchLists = async () => {
      try {
        // const response = await fetch('/api/lists');
        // const data = await response.json();
        // setLists(data);

        // Placeholder data
        setLists([
          { id: "1", title: "To Do", order: 1 },
          { id: "2", title: "In Progress", order: 2 },
          { id: "3", title: "Done", order: 3 },
        ])
      } catch (error) {
        console.error("Error fetching lists:", error)
      }
    }

    fetchLists()
  }, [])

  useEffect(() => {
    // API: Fetch tasks for each list
    const fetchTasks = async () => {
      try {
        const tasksObj = {}

        // For each list, fetch its tasks
        // for (const list of lists) {
        //   const response = await fetch(`/api/lists/${list.id}/tasks`);
        //   const data = await response.json();
        //   tasksObj[list.id] = data;
        // }

        // Placeholder data
        tasksObj["1"] = [
          { id: "t1", title: "Research competitors", description: "Analyze top 5 competitors", order: 1, listId: "1" },
          {
            id: "t2",
            title: "Create wireframes",
            description: "Design initial wireframes for homepage",
            order: 2,
            listId: "1",
          },
        ]
        tasksObj["2"] = [
          {
            id: "t3",
            title: "Implement login page",
            description: "Create React components for login",
            order: 1,
            listId: "2",
          },
        ]
        tasksObj["3"] = [
          { id: "t4", title: "Setup project repo", description: "Initialize Git repository", order: 1, listId: "3" },
          { id: "t5", title: "Configure CI/CD", description: "Setup GitHub Actions workflow", order: 2, listId: "3" },
        ]

        setTasks(tasksObj)
      } catch (error) {
        console.error("Error fetching tasks:", error)
      }
    }

    if (lists.length > 0) {
      fetchTasks()
    }
  }, [lists])

  const handleAddList = () => {
    setModalType("list")
    setModalData({})
    setIsModalOpen(true)
  }

  const handleEditList = (list) => {
    setModalType("list")
    setModalData(list)
    setIsModalOpen(true)
  }

  const handleAddTask = (listId) => {
    setModalType("task")
    setModalData({ listId })
    setIsModalOpen(true)
  }

  const handleEditTask = (task) => {
    setModalType("task")
    setModalData(task)
    setIsModalOpen(true)
  }

  const handleSaveModal = async () => {
    if (modalType === "list") {
      if (modalData.id) {
        // API: Update list details
        // await fetch(`/api/lists/${modalData.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(modalData),
        // });

        // Update locally
        setLists(lists.map((list) => (list.id === modalData.id ? { ...list, ...modalData } : list)))
      } else {
        // API: Add a new list
        // const response = await fetch('/api/lists', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ ...modalData, order: lists.length + 1 }),
        // });
        // const newList = await response.json();

        // Add locally
        const newList = {
          id: `list-${Date.now()}`,
          title: modalData.title || "New List",
          order: lists.length + 1,
        }
        setLists([...lists, newList])
        setTasks({ ...tasks, [newList.id]: [] })
      }
    } else if (modalType === "task") {
      const listId = modalData.listId

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
          [listId]: tasks[listId].map((task) => (task.id === modalData.id ? { ...task, ...modalData } : task)),
        })
      } else {
        // API: Add a new task
        // const response = await fetch('/api/lists/${listId}/tasks', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     ...modalData,
        //     order: tasks[listId] ? tasks[listId].length + 1 : 1
        //   }),
        // });
        // const newTask = await response.json();

        // Add locally
        const newTask = {
          id: `task-${Date.now()}`,
          title: modalData.title || "New Task",
          description: modalData.description || "",
          order: tasks[listId] ? tasks[listId].length + 1 : 1,
          listId,
        }
        setTasks({
          ...tasks,
          [listId]: [...(tasks[listId] || []), newTask],
        })
      }
    }

    setIsModalOpen(false)
  }

  const handleDeleteList = async (listId) => {
    // API: Delete a list
    // await fetch(`/api/lists/${listId}`, {
    //   method: 'DELETE'
    // });

    // Delete locally
    setLists(lists.filter((list) => list.id !== listId))

    // Remove tasks for this list
    const newTasks = { ...tasks }
    delete newTasks[listId]
    setTasks(newTasks)
  }

  const handleDeleteTask = async (taskId, listId) => {
    // API: Delete a task
    // await fetch(`/api/tasks/${taskId}`, {
    //   method: 'DELETE'
    // });

    // Delete locally
    setTasks({
      ...tasks,
      [listId]: tasks[listId].filter((task) => task.id !== taskId),
    })
  }

  // Drag and drop handlers for tasks
  const handleDragStart = (e, task) => {
    setDraggedItem(task)
    e.dataTransfer.effectAllowed = "move"
    e.target.style.opacity = "0.4"
  }

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1"
    setDraggedItem(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e, listId) => {
    e.preventDefault()

    if (!draggedItem) return

    // If task is dropped in a different list
    if (draggedItem.listId !== listId) {
      // API: Update task details (change listId)
      // await fetch(`/api/tasks/${draggedItem.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...draggedItem, listId }),
      // });

      // Update locally
      const updatedTask = { ...draggedItem, listId }

      // Remove from original list
      const sourceListTasks = tasks[draggedItem.listId].filter((task) => task.id !== draggedItem.id)

      // Add to target list
      const targetListTasks = [...(tasks[listId] || []), updatedTask]

      setTasks({
        ...tasks,
        [draggedItem.listId]: sourceListTasks,
        [listId]: targetListTasks,
      })
    }
  }

  // Drag and drop handlers for lists
  const handleListDragStart = (e, list) => {
    setDraggedList(list)
    e.dataTransfer.effectAllowed = "move"
    e.target.style.opacity = "0.4"
  }

  const handleListDragEnd = (e) => {
    e.target.style.opacity = "1"
    setDraggedList(null)
  }

  const handleListDragOver = (e, list) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleListDrop = async (e, targetList) => {
    e.preventDefault()

    if (!draggedList || draggedList.id === targetList.id) return

    // Swap orders
    const draggedOrder = draggedList.order
    const targetOrder = targetList.order

    // API: Update list orders
    // await Promise.all([
    //   fetch(`/api/lists/${draggedList.id}`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ ...draggedList, order: targetOrder }),
    //   }),
    //   fetch(`/api/lists/${targetList.id}`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ ...targetList, order: draggedOrder }),
    //   })
    // ]);

    // Update locally
    setLists(
      lists.map((list) => {
        if (list.id === draggedList.id) {
          return { ...list, order: targetOrder }
        }
        if (list.id === targetList.id) {
          return { ...list, order: draggedOrder }
        }
        return list
      }),
    )
  }

  // Sort lists by order
  const sortedLists = [...lists].sort((a, b) => a.order - b.order)

  return (
    <div className="kanban-board">
      <div className="kanban-header">
        <h1>Kanban Board</h1>
        <button className="add-list-btn" onClick={handleAddList}>
          + Add List
        </button>
      </div>

      <div className="lists-container">
        {sortedLists.map((list) => (
          <div
            key={list.id}
            className="list"
            draggable
            onDragStart={(e) => handleListDragStart(e, list)}
            onDragEnd={handleListDragEnd}
            onDragOver={(e) => handleListDragOver(e, list)}
            onDrop={(e) => handleListDrop(e, list)}
          >
            <div className="list-header">
              <h2>{list.title}</h2>
              <div className="list-actions">
                <button onClick={() => handleEditList(list)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => handleDeleteList(list.id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>

            <div className="tasks-container" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, list.id)}>
              {tasks[list.id]?.map((task) => (
                <div
                  key={task.id}
                  className="task"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    <div className="task-actions">
                      <button onClick={() => handleEditTask(task)} className="edit-btn">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteTask(task.id, list.id)} className="delete-btn">
                        Delete
                      </button>
                    </div>
                  </div>
                  <p>{task.description}</p>
                </div>
              ))}
              <button className="add-task-btn" onClick={() => handleAddTask(list.id)}>
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
                {modalData.id ? "Edit" : "Add"} {modalType === "list" ? "List" : "Task"}
              </h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={modalData.title || ""}
                  onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                  placeholder={`Enter ${modalType} title`}
                />
              </div>

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

