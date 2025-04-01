// API service for backend integration
const API_URL = "http://localhost:5000/api"; // Change this to your actual API URL

// Task-related API calls
export const fetchTasks = async (boardId) => {
  try {
    const response = await fetch(`${API_URL}/tasks?boardId=${boardId}`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to create task');
    return await response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to update task');
    return await response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to delete task');
    return await response.json();
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// List-related API calls
export const createList = async (listData) => {
  try {
    const response = await fetch(`${API_URL}/lists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listData),
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to create list');
    return await response.json();
  } catch (error) {
    console.error('Error creating list:', error);
    throw error;
  }
};

export const updateList = async (listId, listData) => {
  try {
    const response = await fetch(`${API_URL}/lists/${listId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listData),
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to update list');
    return await response.json();
  } catch (error) {
    console.error('Error updating list:', error);
    throw error;
  }
};

export const deleteList = async (listId) => {
  try {
    const response = await fetch(`${API_URL}/lists/${listId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to delete list');
    return await response.json();
  } catch (error) {
    console.error('Error deleting list:', error);
    throw error;
  }
};

// Board-related API calls
export const fetchBoards = async (organizationId) => {
  try {
    const response = await fetch(`${API_URL}/boards/${organizationId}`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch boards');
    return await response.json();
  } catch (error) {
    console.error('Error fetching boards:', error);
    throw error;
  }
};

export const createBoard = async (boardData) => {
  try {
    const response = await fetch(`${API_URL}/boards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(boardData),
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to create board');
    return await response.json();
  } catch (error) {
    console.error('Error creating board:', error);
    throw error;
  }
};

export const deleteBoard = async (boardId) => {
  try {
    const response = await fetch(`${API_URL}/boards/${boardId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to delete board');
    return await response.json();
  } catch (error) {
    console.error('Error deleting board:', error);
    throw error;
  }
};

// Set a reminder for a task
export const setTaskReminder = async (taskId) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}/reminder`, {
      method: 'POST',
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to set reminder');
    return await response.json();
  } catch (error) {
    console.error('Error setting reminder:', error);
    throw error;
  }
};
