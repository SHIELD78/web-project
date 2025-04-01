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