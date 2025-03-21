const db = require("../config/db");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "beesamaadmin"; // Make sure this is consistent everywhere

// ✅ Register
const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        db.query(sql, [username, email, password], (err, result) => {
            if (err) {
                console.error("Database error during registration:", err);
                return res.status(500).json({ msg: "Database error" });
            }
            res.json({ msg: "User registered successfully" });
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Login
const loginUser = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if user exists
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).json({ msg: "Database error", error: err });

        if (results.length === 0) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }

        const user = results[0];

        if (user.password !== password) { // ⚠️ Replace with bcrypt comparison in production
            return res.status(401).json({ msg: "Invalid email or password" });
        }

        // Generate Access Token
        const token = jwt.sign({ id: user.id, email: user.email }, "your_secret_key", {
            expiresIn: "1h",
        });

        // Generate Refresh Token
        const refreshToken = jwt.sign({ id: user.id }, "your_refresh_secret", {
            expiresIn: "7d",
        });

        // Store Refresh Token in Database
        db.query("UPDATE users SET refresh_token = ? WHERE id = ?", [refreshToken, user.id], (err) => {
            if (err) {
                console.error("Error storing refresh token:", err);
                return res.status(500).json({ msg: "Failed to store refresh token." });
            }

            res.json({
                token,
                refreshToken,
                username: user.username,
                coins: user.coins,
                isAdmin: user.isAdmin === 1,
            });
        });
    });
};

module.exports = { loginUser };
