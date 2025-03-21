// Example userController.js
const db = require("../config/db");

const getUserInfo = (req, res) => {
  const userId = req.user.id;  // Get user ID from the token

  const query = "SELECT username, coins FROM users WHERE id = ?";
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching user info:", err);
      return res.status(500).json({ msg: "Failed to fetch user info" });
    }

    if (result.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(result[0]);  // Return user data (including balance/coins)
  });
};

module.exports = { getUserInfo };
