import axios from "axios";
import { cachedFetchFacilities } from "../utils/apiCache";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

/**
 * Fetches all facilities with caching.
 * @returns {Promise<any>} The response data containing facilities.
 */
export const getFacilities = async (token) => {
  try {
    // Try cached version first
    const cachedData = await cachedFetchFacilities();
    if (cachedData) {
      return cachedData;
    }

    // Fallback to API call with auth
    const res = await axios.get(`${API_URL}/facilities/get-facilities`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.facilities;
  } catch (error) {
    console.error("Error fetching facilities:", error);
    throw error;
  }
};

/**
 * Adds a new facility.
 * @param {FormData} formData - The form data containing facility details.
 * @param {string} token - The authentication token.
 * @returns {Promise<any>} The newly created facility.
 */
export const addFacility = async (formData, token) => {
  try {
    const res = await axios.post(`${API_URL}/facilities/admin/add-facility`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.facility;
  } catch (error) {
    console.error("Error adding facility:", error);
    throw error;
  }
};

/**
 * Updates a facility by ID.
 * @param {string} id - The ID of the facility to update.
 * @param {FormData} formData - The updated form data.
 * @param {string} token - The authentication token.
 * @returns {Promise<any>} The updated facility.
 */
export const updateFacility = async (id, formData, token) => {
  try {
    const res = await axios.put(`${API_URL}/facilities/admin/update-facility/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.facility;
  } catch (error) {
    console.error("Error updating facility:", error);
    throw error;
  }
};

/**
 * Deletes a facility by ID.
 * @param {string} id - The ID of the facility to delete.
 * @param {string} token - The authentication token.
 * @returns {Promise<any>} The response data.
 */
export const deleteFacility = async (id, token) => {
  try {
    const res = await axios.delete(`${API_URL}/facilities/admin/delete-facility/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting facility:", error);
    throw error;
  }
};
