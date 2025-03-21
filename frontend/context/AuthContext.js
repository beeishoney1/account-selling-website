import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load token from local storage when app starts (optional)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Function to set user and token after login
  const login = (userData, newToken) => {
    setUser(userData);
    setToken(newToken);
    localStorage.setItem("token", newToken); // Optional, remove if not using localStorage
  };

  // Function to log out
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  // Fetch user info (replace API_URL with your actual API endpoint)
  const fetchUserInfo = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/user/info`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching user info:", error.response?.data?.msg || error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, fetchUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
