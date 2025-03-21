import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './style/Login.css'; // Import custom CSS for styling

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      console.log("Attempting login..."); // ✅ Debugging
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      console.log("Response status:", response.status); // ✅ Log response status
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
        console.error("Error details:", errorData); // ✅ Log full error details
        return;
      }
  
      const data = await response.json();
      console.log("🔍 Received login response:", data); // ✅ Check if `id` is in the response
      console.log("Login successful:", data); // ✅ Log successful response
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("isAdmin", data.isAdmin === 1);
  
      localStorage.setItem(
        "user",
        JSON.stringify({
          token: data.token,
          id: data.id, // ✅ Ensure `id` is saved
          username: data.username,
          coins: data.coins,
          isAdmin: data.isAdmin === 1,
        })
      );
      
  
      console.log("🔍 Stored user data:", localStorage.getItem("user")); // ✅ Debugging
  
      navigate(data.isAdmin === 1 ? "/admindashboard" : "/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError("Could not connect to the server. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>🔑 Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login; 