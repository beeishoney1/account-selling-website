const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const { getUserInfo } = require("../controllers/userController");

const secretKey = process.env.JWT_SECRET_KEY || "beesamaadmin";

const REFRESH_SECRET = "beesamarefresh"; // ✅ Ensure this matches across files

// ✅ Admin can get all users
router.get("/users", verifyToken, verifyAdmin, (req, res) => {
    db.query("SELECT id, username, email, coins FROM users", (err, results) => {
        if (err) return res.status(500).json({ msg: "Database error", err });
        res.json(results);
    });
});

// ✅ Get user info
router.get("/accounts", verifyToken, (req, res) => {
    const query = "SELECT id, username, coins FROM accounts"; // Modify the query if needed
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ msg: "Database error", err });
        res.json(results); // Send back the list of accounts
    });
});

// ✅ Verify if a token is valid
router.get("/verify-token", verifyToken, (req, res) => {
    res.json({ message: "Token is valid", user: req.user });
});

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ msg: "All fields are required" });
    }

    try {
        console.log("🔍 Received Registration Data:", req.body); // ✅ Debugging Log

        // ✅ Check if the user already exists
        const [existingUser] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // ✅ Insert new user with plain text password
        await db.promise().query(
            "INSERT INTO users (username, email, password, coins, isAdmin) VALUES (?, ?, ?, ?, ?)", 
            [username, email, password, 0, 0]
        );

        console.log("✅ Registration successful for:", email);
        res.json({ msg: "Registration successful! Please log in." });

    } catch (error) {
        console.error("❌ Registration error:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// ✅ Fix Login Route (Store Token in DB)
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err || results.length === 0) return res.status(400).json({ msg: "User not found" });

        const user = results[0];
        if (password !== user.password) return res.status(401).json({ msg: "Invalid password" });

        const token = jwt.sign(
            { id: user.id, email: user.email, isAdmin: user.isAdmin },
            secretKey, // ✅ Ensure this matches authMiddleware.js
            { expiresIn: "12h" }
        );


        db.query("UPDATE users SET token = ? WHERE id = ?", [token, user.id], (updateErr) => {
            if (updateErr) return res.status(500).json({ msg: "Database error" });

            res.json({ 
                token, 
                id: user.id,  // ✅ Ensure `id` is sent correctly
                username: user.username, 
                coins: user.coins, 
                isAdmin: user.isAdmin 
            });
            
        });
    });
});

// ✅ Fix Refresh Token Route (Update Token in DB)
router.post("/refresh-token", (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(403).json({ msg: "Refresh token required." });

    db.query("SELECT * FROM users WHERE token = ?", [token], (err, results) => {
        if (err || results.length === 0) return res.status(403).json({ msg: "Invalid token." });

        const user = results[0];
        const newToken = jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, "SECRET_KEY", { expiresIn: "12h" });

        db.query("UPDATE users SET token = ? WHERE id = ?", [newToken, user.id], (updateErr) => {
            if (updateErr) return res.status(500).json({ msg: "Database error" });

            res.json({ token: newToken });
        });
    });
});

module.exports = router;
