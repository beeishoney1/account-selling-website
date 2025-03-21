import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './style/Register.css'; // Import custom CSS for styling

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // ✅ Handle User Registration
    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/api/auth/register", {
                username,
                email,
                password
            });

            console.log("✅ Registration success:", response.data);
            alert("Registration successful! You can now log in.");
            navigate("/login"); // Redirect to login after successful registration
        } catch (error) {
            console.error("❌ Registration failed:", error.response?.data?.msg || error.message);
            setError(error.response?.data?.msg || "Registration failed. Try again.");
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>📝 Register</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleRegister} className="register-form">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
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
                    <button type="submit" className="register-button">Register</button>
                </form>
                <div className="login-link">
                    Already have an account? <a href="/login">Login</a>
                </div>
            </div>
        </div>
    );
};

export default Register;