// src/services/reservationApi.js
import axios from "axios";
import { labelToSlug } from "../utils/typeMapper";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Fetch list with filters
export const fetchReservations = async (token, filters) => {
  const res = await axios.get(`${API_URL}/reservations`, {
    headers: { Authorization: `Bearer ${token}` },
    params: filters,
  });
  return res.data;
};

// Get single reservation by type+id
export const getReservationById = async (token, type, id) => {
  const slug = labelToSlug(type); // normalize
  const res = await axios.get(`${API_URL}/reservations/${slug}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // { success, data }
};

// Update status
export const updateReservationStatus = async (token, type, id, status) => {
  const slug = labelToSlug(type);
  const res = await axios.put(
    `${API_URL}/reservations/${slug}/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Delete
export const deleteReservation = async (token, type, id) => {
  const slug = labelToSlug(type);
  const res = await axios.delete(`${API_URL}/reservations/${slug}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};