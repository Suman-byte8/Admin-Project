import http from './http';
const API_BASE_URL = `/admin`;

// Admin API functions
export const adminApi = {
  // Admin Login
  login: async (loginData) => {
    try {
      const response = await http.post(`${API_BASE_URL}/login`, loginData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error during admin login:", error);
      throw error;
    }
  },

  // Admin Register
  register: async (registerData) => {
    try {
      const response = await http.post(`${API_BASE_URL}/register`, registerData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error during admin registration:", error);
      throw error;
    }
  },

  // Get Admin Profile
  getProfile: async (adminId, token) => {
    try {
      const response = await http.get(`${API_BASE_URL}/profile/${adminId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      throw error;
    }
  },

  // Get User Activity (if needed)
  getUserActivity: async (token) => {
    try {
      const response = await http.get(`${API_BASE_URL}/user-activity`, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user activity:", error);
      throw error;
    }
  },

  // Get Total Registered Users Count
  getTotalUsers: async (token) => {
    try {
      const response = await http.get(`${API_BASE_URL}/total-users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching total users count:", error);
      throw error;
    }
  },
};

export default adminApi;
