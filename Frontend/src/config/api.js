const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default API_URL;

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};
