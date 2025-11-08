import axios from "axios";
import { cachedFetchGallery, invalidateCache } from "../utils/apiCache";

const API_URL = import.meta.env.VITE_BACKEND_URL;


// Get gallery images with caching, optionally filtered by tab
export const fetchGalleryImages = async (tab = null) => {
  try {
    // Try cached version first
    const cachedData = await cachedFetchGallery();
    if (cachedData) {
      // Filter by tab if provided
      if (tab) {
        return cachedData.filter(item => item.tab === tab);
      }
      return cachedData;
    }

    // Fallback to API call with auth
    const url = tab ? `${API_URL}/content/gallery?tab=${tab}` : `${API_URL}/content/gallery`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    throw new Error('Failed to fetch gallery images');
  }
};

// Add new gallery images
export const addGalleryImages = async (formData, token) => {
  try {
    const response = await axios.post(`${API_URL}/content/gallery/admin`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    // Invalidate gallery cache after mutation
    invalidateCache('gallery');
    return response.data;
  } catch (error) {
    console.error('Error adding gallery images:', error);
    throw new Error(error.response?.data?.message || 'Failed to add gallery images');
  }
};

// Update gallery image
export const updateGalleryImage = async (imageId, formData, token) => {
  try {
    const response = await axios.put(`${API_URL}/content/gallery/admin/${imageId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    // Invalidate gallery cache after mutation
    invalidateCache('gallery');
    return response.data;
  } catch (error) {
    console.error('Error updating gallery image:', error);
    throw new Error(error.response?.data?.message || 'Failed to update gallery image');
  }
};

// Delete gallery image
export const deleteGalleryImage = async (imageId) => {
  try {
    const response = await axios.delete(`${API_URL}/content/gallery/admin/${imageId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Invalidate gallery cache after mutation
    invalidateCache('gallery');
    return response.data;
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete gallery image');
  }
};
