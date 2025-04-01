import axios from "axios";

const API_URL = "http://localhost:3000/api"; // Change this if your backend runs on a different port

// Board API functions
export const fetchBoards = async (workspaceId) => {
  try {
    const response = await axios.get(`${API_URL}/boards/${workspaceId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
};

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
    throw error;
  }
};

export const deleteBoard = async (boardId) => {
  try {
    await axios.delete(`${API_URL}/boards/${boardId}`);
  } catch (error) {
    console.error("Error deleting board:", error);
    throw error;
  }
};

// Task API functions
export const fetchTasks = async (listId) => {
  try {
    const response = await axios.get(`${API_URL}/tasks?listId=${listId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await axios.post(`${API_URL}/tasks`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await axios.put(`${API_URL}/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    await axios.delete(`${API_URL}/tasks/${taskId}`);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// List API functions
export const fetchLists = async (boardId) => {
  try {
    const response = await axios.get(`${API_URL}/lists?boardId=${boardId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lists:", error);
    throw error;
  }
};

export const createList = async (listData) => {
  try {
    const response = await axios.post(`${API_URL}/lists`, listData);
    return response.data;
  } catch (error) {
    console.error("Error creating list:", error);
    throw error;
  }
};

export const updateList = async (listId, listData) => {
  try {
    const response = await axios.put(`${API_URL}/lists/${listId}`, listData);
    return response.data;
  } catch (error) {
    console.error("Error updating list:", error);
    throw error;
  }
};

export const deleteList = async (listId) => {
  try {
    await axios.delete(`${API_URL}/lists/${listId}`);
  } catch (error) {
    console.error("Error deleting list:", error);
    throw error;
  }
};
