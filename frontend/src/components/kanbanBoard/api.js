import axios from "axios";

const API_URL = "http://localhost:3000/api"; // Change this if your backend runs on a different port

// Fetch all boards for a workspace
export const fetchBoards = async (workspaceId) => {
  try {
    const response = await axios.get(`${API_URL}/boards/${workspaceId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching boards:", error);
    return [];
  }
};

// Create a new board
export const createBoard = async (title, workspaceId, imageUrl) => {
  try {
    const response = await axios.post(`${API_URL}/boards`, {
      title,
      organizationId: workspaceId,
      imageUrl,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating board:", error);
    return null;
  }
};

// Delete a board
export const deleteBoard = async (boardId) => {
  try {
    await axios.delete(`${API_URL}/boards/${boardId}`);
  } catch (error) {
    console.error("Error deleting board:", error);
  }
};



// API service for interacting with the backend

// Task API functions
export const fetchTasks = async (boardId) => {
  try {
    const response = await fetch(`/api/tasks?boardId=${boardId}`)
    if (!response.ok) throw new Error("Failed to fetch tasks")
    return await response.json()
  } catch (error) {
    console.error("Error fetching tasks:", error)
    throw error
  }
}

export const createTask = async (taskData) => {
  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    })
    if (!response.ok) throw new Error("Failed to create task")
    return await response.json()
  } catch (error) {
    console.error("Error creating task:", error)
    throw error
  }
}

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    })
    if (!response.ok) throw new Error("Failed to update task")
    return await response.json()
  } catch (error) {
    console.error("Error updating task:", error)
    throw error
  }
}

export const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete task")
    return await response.json()
  } catch (error) {
    console.error("Error deleting task:", error)
    throw error
  }
}

export const setTaskReminder = async (taskId) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}/reminder`, {
      method: "POST",
    })
    if (!response.ok) throw new Error("Failed to set reminder")
    return await response.json()
  } catch (error) {
    console.error("Error setting reminder:", error)
    throw error
  }
}

// List API functions
export const fetchLists = async (boardId) => {
  try {
    const response = await fetch(`/api/lists?boardId=${boardId}`)
    if (!response.ok) throw new Error("Failed to fetch lists")
    return await response.json()
  } catch (error) {
    console.error("Error fetching lists:", error)
    throw error
  }
}

export const createList = async (listData) => {
  try {
    const response = await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(listData),
    })
    if (!response.ok) throw new Error("Failed to create list")
    return await response.json()
  } catch (error) {
    console.error("Error creating list:", error)
    throw error
  }
}

export const updateList = async (listId, listData) => {
  try {
    const response = await fetch(`/api/lists/${listId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(listData),
    })
    if (!response.ok) throw new Error("Failed to update list")
    return await response.json()
  } catch (error) {
    console.error("Error updating list:", error)
    throw error
  }
}

export const deleteList = async (listId) => {
  try {
    const response = await fetch(`/api/lists/${listId}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete list")
    return await response.json()
  } catch (error) {
    console.error("Error deleting list:", error)
    throw error
  }
}

// Board API functions
export const fetchBoard = async (boardId) => {
  try {
    const response = await fetch(`/api/boards/${boardId}`)
    if (!response.ok) throw new Error("Failed to fetch board")
    return await response.json()
  } catch (error) {
    console.error("Error fetching board:", error)
    throw error
  }
}

export const fetchBoardsByOrganization = async (organizationId) => {
  try {
    const response = await fetch(`/api/boards/${organizationId}`)
    if (!response.ok) throw new Error("Failed to fetch boards")
    return await response.json()
  } catch (error) {
    console.error("Error fetching boards:", error)
    throw error
  }
}

