const express = require("express");
const db = require("../config/db");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/info", authenticateToken, (req, res) => {
  console.log("🔍 User Info Request Headers:", req.headers);
  console.log("🔍 User Info Request Received");
  console.log("🔍 Request Headers:", req.headers);
  console.log("🔍 Decoded User:", req.user);
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: Invalid or missing token" });
  }

  const userId = req.user.id; 

  db.query("SELECT username, email, coins FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(results[0]);
  });
});

module.exports = router;
