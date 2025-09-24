import http from "./http";

export const getMemberships = async (page = 1, limit = 50) => {
  try {
    const response = await http.get("/membership", {
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
    const response = await http.get(`/membership/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching member by ID:", error);
    throw error;
  }
};

export const updateMembershipStatus = async (id, status, membershipType) => {
  try {
    const response = await http.put(`/membership/${id}/status`, { status, membershipType });
    return response.data;
  } catch (error) {
    console.error("Error updating membership status:", error);
    throw error;
  }
};

export const deleteMembership = async (id) => {
  try {
    const response = await http.delete(`/membership/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting membership:", error);
    throw error;
  }
};
