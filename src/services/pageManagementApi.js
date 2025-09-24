import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL

/**
 * Adds a new hero banner.
 * @param {FormData} formData - The form data containing headline, subHeadline, and image.
 * @param {string} token - The authentication token.
 * @returns {Promise<any>} The response data from the server.
 */
export const addHeroBanner = async (formData, token) => {
    // console.log("Token for adding banner:", token); // Debugging line
    try {
        const response = await axios.post(`${API_URL}/content/home/add-hero-banner`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding hero banner:', error);
        throw error;
    }
};

/**
 * Fetches existing banners.
 * @param {string} token - The authentication token.
 * @returns {Promise<any>} The response data from the server.
 */
export const fetchBanners = async (token) => {
    // console.log("Token for fetching banners:", token); // Debugging line
    try {
        const response = await axios.get(`${API_URL}/content/home/hero-banner`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching banners:', error);
        throw error;
    }
};

/**
 * Deletes a banner by ID.
 * @param {string} id - The ID of the banner to delete.
 * @param {string} token - The authentication token.
 * @returns {Promise<any>} The response data from the server.
 */
// export const deleteBanner = async (id, token) => {
//     // console.log("Token for deleting banner:", token); // Debugging line
//     try {
//         const response = await axios.delete(`${API_URL}/content/home/banner/${id}`, {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error deleting banner:', error);
//         throw error;
//     }
// };


// Add this update function
export const updateBanner = async (id, formData, token) => {
    try {
        const response = await axios.put(`${API_URL}/content/home/update-hero-banner/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating banner:', error);
        throw error;
    }
};

// Fix the delete function to include token
export const deleteBanner = async (id, token) => {
    try {
        const response = await axios.delete(`${API_URL}/content/home/delete-hero-banner/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting banner:', error);
        throw error;
    }
};

/**
 * Fetches distinctive content.
 * @param {string} token - The authentication token.
 * @returns {Promise<any>} The response data from the server.
 */
export const fetchDistinctives = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/content/home/distinctives`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching distinctives:', error);
        throw error;
    }
};

/**
 * Adds a new distinctive feature.
 * @param {FormData} formData - The form data containing title, description, and images.
 * @param {string} token - The authentication token.
 * @returns {Promise<any>} The response data from the server.
 */
export const addDistinctive = async (formData, token) => {
    try {
        const response = await axios.post(`${API_URL}/content/home/add-distinctive`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding distinctive feature:', error);
        throw error;
    }
};

/**
 * Updates a distinctive feature.
 * @param {string} id - The ID of the distinctive feature to update.
 * @param {FormData} formData - The form data containing title, description, and images.
 * @param {string} token - The authentication token.
 * @returns {Promise<any>} The response data from the server.
 */
export const updateDistinctive = async (id, formData, token) => {
    try {
        const response = await axios.put(`${API_URL}/content/home/distinctive/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating distinctive feature:', error);
        throw error;
    }
};

/**
 * Deletes a distinctive feature by ID.
 * @param {string} id - The ID of the distinctive feature to delete.
 * @param {string} token - The authentication token.
 * @returns {Promise<any>} The response data from the server.
 */
export const deleteDistinctive = async (id, token) => {
    try {
        const response = await axios.delete(`${API_URL}/content/home/distinctive/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting distinctive feature:', error);
        throw error;
    }
};
