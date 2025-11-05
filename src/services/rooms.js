import axios from "axios";
import { cachedFetchRooms } from "../utils/apiCache";

const API_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Fetches all rooms with caching and pagination.
 * @param {string} token - The authentication token.
 * @param {number} page - The page number.
 * @param {number} limit - The number of rooms per page.
 * @returns {Promise<any>} The response data containing rooms and pagination info.
 */
export const getRooms = async (token, page = 1, limit = 20) => {
  try {
    // Try cached version first (only for first page to avoid complexity)
    if (page === 1) {
      const cachedData = await cachedFetchRooms();
      if (cachedData) {
        return { rooms: cachedData.slice(0, limit), totalPages: Math.ceil(cachedData.length / limit), currentPage: 1 };
      }
    }

    // Fallback to API call with auth
    const res = await axios.get(`${API_URL}/rooms/get-rooms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, limit }
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};

/**
 * Adds a new room.
 * @param {FormData} formData - The form data containing room details.
 * @param {string} token - The authentication token.
 * @returns {Promise<any>} The newly created room.
 */
export const addRoom = async (formData, token) => {
  try {
    const res = await axios.post(`${API_URL}/rooms/admin/add-rooms`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.room;
  } catch (error) {
    console.error("Error adding room:", error);
    throw error;
  }
};

/**
 * Updates a room by ID.
 * @param {string} id - The ID of the room to update.
 * @param {FormData|Object} data - The updated form data or status object.
 * @param {string} token - The authentication token.
 * @returns {Promise<any>} The updated room.
 */
export const updateRoom = async (id, data, token) => {
  try {
    // If it's a status update (plain object), use JSON content type
    const isFormData = data instanceof FormData;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": isFormData ? "multipart/form-data" : "application/json"
    };

    const res = await axios.put(
      `${API_URL}/rooms/admin/update-room-details/${id}`, 
      isFormData ? data : JSON.stringify(data),
      { headers }
    );
    return res.data.room;
  } catch (error) {
    console.error("Error updating room:", error);
    throw error;
  }
};

/**
 * Updates the status of a room by ID.
 * @param {string} id - The ID of the room to update.
 * @param {string} status - The new status of the room.
 * @param {string} token - The authentication token.
 * @returns {Promise<any>} The updated room.
 */
export const updateRoomStatus = async (id, status, token) => {
  try {
    const res = await axios.patch(
      `${API_URL}/rooms/admin/update-room-status/${id}`,
      { roomStatus: status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    return res.data.room;
  } catch (error) {
    console.error("Error updating room status:", error);
    throw error;
  }
};

/**
 * Deletes a room by ID.
 * @param {string} id - The ID of the room to delete.
 * @param {string} token - The authentication token.
 * @returns {Promise<any>} The response data.
 */
export const deleteRoom = async (id, token) => {
  try {
    const res = await axios.delete(`${API_URL}/rooms/admin/delete-room/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  }
};

/**
 * Fetches a single room by ID.
 * @param {string} id - The ID of the room to fetch.
 * @param {string} token - The authentication token.
 * @returns {Promise<any>} The response data containing the room.
 */
export const getRoomById = async (id, token) => {
  try {
    const res = await axios.get(`${API_URL}/rooms/get-room/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.room;
  } catch (error) {
    console.error("Error fetching room:", error);
    throw error;
  }
};
