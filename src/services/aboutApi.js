import axios from "axios";
import { cachedFetchAboutPage } from "../utils/apiCache";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const API_BASE_URL = `${API_URL}/content/about`;

// About Page API functions
export const aboutApi = {
  // Get About page content with caching
  getAboutPage: async (token) => {
    try {
      // Try cached version first
      const cachedData = await cachedFetchAboutPage();
      if (cachedData) {
        return cachedData;
      }

      // Fallback to API call with auth
      const response = await axios.get(`${API_BASE_URL}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching About page:", error);
      throw error;
    }
  },

  // Update About Us section
  updateAboutUs: async (aboutUsData, token) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/update-about-us`, aboutUsData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating About Us section:", error);
      throw error;
    }
  },

  // Add content block
  addContentBlock: async (contentBlockData, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/content-blocks`, contentBlockData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding content block:", error);
      throw error;
    }
  },

  // Update content block
  updateContentBlock: async (id, contentBlockData, token) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/content-blocks/${id}`, contentBlockData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating content block:", error);
      throw error;
    }
  },

  // Delete content block
  deleteContentBlock: async (id, token) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/content-blocks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting content block:", error);
      throw error;
    }
  },

  // Add amenity
  addAmenity: async (amenityData, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/amenities`, amenityData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding amenity:", error);
      throw error;
    }
  },

  // Update amenity
  updateAmenity: async (id, amenityData, token) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/amenities/${id}`, amenityData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating amenity:", error);
      throw error;
    }
  },

  // Delete amenity
  deleteAmenity: async (id, token) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/amenities/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting amenity:", error);
      throw error;
    }
  },

  // Add service
  addService: async (serviceData, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/services`, serviceData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding service:", error);
      throw error;
    }
  },

  // Update service
  updateService: async (id, serviceData, token) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/services/${id}`, serviceData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating service:", error);
      throw error;
    }
  },

  // Delete service
  deleteService: async (id, token) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
  }
};

export default aboutApi;
