// src/services/distinctive.js
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const authHeader = (token) => ({
  Authorization: `Bearer ${token}`,
});

// READ
export const fetchDistinctives = async (token) => {
  const { data } = await axios.get(`${API_URL}/content/home/distinctives`, {
    headers: authHeader(token),
  });
  return data;
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

// UPDATE (JSON ONLY: title, description, images as URL array)
export const updateDistinctive = async (id, body, token) => {
  const { data } = await axios.put(
    `${API_URL}/content/home/distinctive/${id}`,
    body,
    { headers: { ...authHeader(token) } }
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
