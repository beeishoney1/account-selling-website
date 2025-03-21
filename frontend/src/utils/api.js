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
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("❌ No authentication token found in localStorage.");
      return { error: "Unauthorized. Please log in again." };
    }

    // ✅ Log the token to make sure it's retrieved
    console.log("🔍 Token before sending request:", token);

    const headers = {
      "Authorization": `Bearer ${token}`, // ✅ Ensure correct format
      "Content-Type": "application/json",
    };

    // ✅ Log the headers to make sure they are correct
    console.log("🔍 Sending headers:", headers);

    const res = await axios.get("http://localhost:5000/api/user/info", { headers });

    console.log("✅ User Info Received:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching user info:", error.response?.data?.message || error.message);

    if (error.response?.status === 401) {
      return { error: "Session expired. Please log in again." };
    }

    return { error: "Failed to fetch user info. Please try again." };
  }
};



// Fetch all users (Admin only)
export// Fetch the users
const getUsers = async () => {
  const token = localStorage.getItem("token"); // Automatically get token from localStorage

  if (!token) {
    alert("You must be logged in.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/admin/users", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Add token to Authorization header
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    console.log(data); // This will give you the list of users

    // You can render the data to the DOM (e.g., display users in a table)
    renderUsers(data);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// Example render function (you can modify it based on your HTML structure)
let selectedUserId = null; // Store selected user ID

const renderUsers = (users) => {
  const userList = document.getElementById("user-list");
  const userSelect = document.getElementById("user-select"); // Get the dropdown

  if (!userList || !userSelect) {
    
    return;
  }

  userList.innerHTML = ""; // Clear previous user list
  userSelect.innerHTML = '<option value="">Select User</option>'; // Reset dropdown

  users.forEach(user => {
    // 🔹 Create user div (if using a list)
    const userItem = document.createElement("div");
    userItem.classList.add("user-item");
    userItem.innerHTML = `
      <p><strong>Username:</strong> ${user.username}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Coins:</strong> ${user.coins}</p>
    `;

    // 🔹 Add user to the dropdown
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = `${user.username} (${user.email})`;
    userSelect.appendChild(option);

    userList.appendChild(userItem);
  });

  console.log("✅ Users rendered in list & dropdown.");
};

// Call the function to get users when the page loads
document.addEventListener("DOMContentLoaded", getUsers);
// Add coins to a user (Admin only)
export const addCoins = async (userId, amount) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token provided");
    }

    const res = await axios.post(
      `${API_URL}/admin/add-coins`,
      { userId, amount },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure token is passed
          "admin-key": "beesamadmin", // You can use this if you need admin key
        },
      }
    );
    console.log("Coins added:", res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to add coins:", error.response?.data?.msg || error.message);
    throw error;
  }
};

// Remove coins from a user (Admin only)
export const removeCoins = async (userId, amount) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token provided");
    }

    const res = await axios.post(
      `${API_URL}/admin/remove-coins`,
      { userId, amount },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure token is passed
          "admin-key": "beesamadmin", // You can use this if you need admin key
        },
      }
    );
    console.log("Coins removed:", res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to remove coins:", error.response?.data?.msg || error.message);
    throw error;
  }
};
export const refreshToken = async () => {
  try {
      const oldToken = localStorage.getItem("token");
      if (!oldToken) throw new Error("No token found.");

      const res = await axios.post("http://localhost:5000/api/auth/refresh-token", { token: oldToken });

      const newToken = res.data.token;
      localStorage.setItem("token", newToken); // ✅ Store new token

      return newToken;
  } catch (error) {
      console.error("❌ Error refreshing token:", error.response?.data?.message || error.message);
      return null;
  }
};
