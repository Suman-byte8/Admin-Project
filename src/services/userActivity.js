import { adminApi } from './adminApi';

export const userActivityApi = {
  // Fetch recent user activities
  getRecentActivities: async (page = 1, limit = 50) => {
    try {
      const token = localStorage.getItem('adminToken');

      // Try to get user activity with role header
      const axios = (await import('axios')).default;
      const API_URL = import.meta.env.VITE_BACKEND_URL;

      const response = await axios.get(`${API_URL}/admin/user-activity?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-User-Role': 'admin', // Explicitly set role as admin
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching user activities:', error);
      throw error;
    }
  },

  // Delete user by ID
  deleteUser: async (userId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const axios = (await import('axios')).default;
      const API_URL = import.meta.env.VITE_BACKEND_URL;

      const response = await axios.delete(`${API_URL}/admin/delete-user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Get activity icon based on activity type
  getActivityIcon: (activityType) => {
    const icons = {
      'sign-up': 'FaUserPlus',
      'login': 'FaSignInAlt',
      'logout': 'FaSignOutAlt',
      'booking': 'FaCalendarCheck',
      'payment': 'FaCreditCard',
      'profile-update': 'FaUserEdit',
      'reservation': 'FaCalendarAlt',
    };
    return icons[activityType] || 'FaInfoCircle';
  },

  // Format timestamp for display
  formatTimestamp: (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  },
};
