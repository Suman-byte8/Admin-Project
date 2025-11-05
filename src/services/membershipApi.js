import axios from "axios";
import { cachedFetchMembership } from "../utils/apiCache";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const getMemberships = async (page = 1, limit = 50) => {
  try {
    // Try cached version first (only for first page to avoid complexity)
    if (page === 1) {
      const cachedData = await cachedFetchMembership();
      if (cachedData) {
        return { memberships: cachedData.slice(0, limit), totalPages: Math.ceil(cachedData.length / limit), currentPage: 1 };
      }
    }

    // Fallback to API call
    const response = await axios.get(`${API_URL}/membership`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
      },
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching memberships:", error);
    throw error;
  }
};

export const getMemberById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/membership/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching member by ID:", error);
    throw error;
  }
};

export const updateMembershipStatus = async (id, status, membershipType) => {
  try {
    const response = await axios.put(`${API_URL}/membership/${id}/status`, { status, membershipType }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        "Content-Type": "application/json"
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating membership status:", error);
    throw error;
  }
};

export const deleteMembership = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/membership/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting membership:", error);
    throw error;
  }
};
