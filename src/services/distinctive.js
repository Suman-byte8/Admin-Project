// src/services/distinctive.js
import axios from "axios";
import { cachedFetchDistinctives } from "../utils/apiCache";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const authHeader = (token) => ({
  Authorization: `Bearer ${token}`,
});

// READ with caching
export const fetchDistinctives = async (token) => {
  try {
    // Try cached version first
    const cachedData = await cachedFetchDistinctives();
    if (cachedData) {
      return cachedData;
    }

    // Fallback to API call with auth
    const { data } = await axios.get(`${API_URL}/content/home/distinctives`, {
      headers: authHeader(token),
    });
    return data;
  } catch (error) {
    console.error("Error fetching distinctives:", error);
    throw error;
  }
};

// CREATE (multipart form-data for images)
export const addDistinctive = async (formData, token) => {
  const { data } = await axios.post(
    `${API_URL}/content/home/add-distinctive`,
    formData,
    {
      headers: {
        ...authHeader(token),
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

// UPDATE (FormData: title, description, existingImages as URL array, images as new files)
export const updateDistinctive = async (id, formData, token) => {
  const { data } = await axios.put(
    `${API_URL}/content/home/distinctive/${id}`,
    formData,
    {
      headers: {
        ...authHeader(token),
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

// DELETE
export const deleteDistinctive = async (id, token) => {
  const { data } = await axios.delete(
    `${API_URL}/content/home/distinctive/${id}`,
    { headers: { ...authHeader(token) } }
  );
  return data;
};
