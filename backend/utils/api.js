import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Ensure this matches your backend URL

// Login user
export const loginUser = async (email, password) => {
  try {
    console.log("Sending login request:", { email, password }); // Debugging
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    console.log("Login successful:", res.data); // Debugging
    return res.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data?.msg || error.message);
    return { error: error.response?.data?.msg || "Login failed. Please try again." };
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    console.log("Sending registration data:", userData); // Debugging
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    console.log("Registration response:", data); // Debugging
    return data;
  } catch (error) {
    console.error("Registration failed:", error.message);
    return { error: "Registration failed. Please try again." };
  }
};

// Get user info (for Dashboard)
export const getUserInfo = async () => {
  try {
    const token = localStorage.getItem("token"); // Get token from localStorage
    console.log("Token retrieved:", token); // Debugging

    if (!token) {
      throw new Error("No token provided");
    }

    const response = await axios.get(`${API_URL}/user/info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("User info fetched:", response.data); // Debugging
    return response.data; // Return user data (including balance/coins)
  } catch (error) {
    console.error("Error fetching user info:", error.response?.data?.msg || error.message);
    throw error; // Throw error to be handled in the frontend
  }
};

// ✅ Add Coins to a User (Admin Only)
export const addCoins = async (userId, amount) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ No token found");
      throw new Error("Unauthorized: No token provided");
    }

    // 🔥 Debugging: Log request payload before sending
    console.log("🔹 Sending Add Coins Request:", { userId, amount });

    const response = await fetch(`${API_URL}/admin/add-coins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, amount }), // ✅ Ensure body is correctly formatted
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add coins");
    }

    console.log("✅ Coins added successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Failed to add coins:", error.message);
    throw error;
  }
};

// ✅ Remove Coins from a User (Admin Only)
export const removeCoins = async (userId, amount) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ No token found");
      throw new Error("Unauthorized: No token provided");
    }

    // 🔥 Debugging: Log request payload before sending
    console.log("🔹 Sending Remove Coins Request:", { userId, amount });

    const response = await fetch(`${API_URL}/admin/remove-coins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, amount }), // ✅ Ensure body is correctly formatted
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to remove coins");
    }

    console.log("✅ Coins removed successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Failed to remove coins:", error.message);
    throw error;
  }
};


// Fetch all users (Admin only) - Fixed token handling
export const getAdminUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found.");
      return { error: "Unauthorized. Please log in again." };
    }

    const res = await axios.get(`${API_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.data || res.data.length === 0) {
      console.warn("No users found.");
      return { error: "No users available." };
    }

    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error.response?.data?.msg || error.message);

    if (error.response?.status === 401) {
      console.warn("Token expired. Refreshing...");
      const newToken = await refreshToken();
      if (!newToken) return { error: "Session expired. Please log in again." };

      return getAdminUsers(); // Retry request with new token
    }

    return { error: "Failed to fetch users." };
  }
};

// ✅ Function to make API requests with token (Fixed refresh handling)
export const fetchWithToken = async (url, options = {}) => {
  let token = localStorage.getItem("token");

  if (!token) return { error: "No token available." };

  try {
    const response = await axios.get(`${API_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn("Access token expired, refreshing...");
      const newToken = await refreshToken();
      if (!newToken) return { error: "Session expired, please log in again." };

      return fetchWithToken(url, options); // Retry request with new token
    }
    return { error: error.message };
  }
};

// ✅ Function to Refresh Token (Fixed endpoint)
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
    localStorage.setItem("token", response.data.accessToken); // Save new token
    return response.data.accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    localStorage.removeItem("token"); // Ensure old token is cleared
    localStorage.removeItem("refreshToken");
    return null;
  }
};
