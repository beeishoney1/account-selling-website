const express = require("express");
const db = require("../config/db");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

// ✅ Get all users (Admin only)
router.get("/users", verifyToken, verifyAdmin, (_, res) => {
    db.query("SELECT id, username, email, coins FROM users", (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ msg: "Database error", error: err });
        }
        res.json(results);
    });
});

// ✅ Add Coins to User
router.post("/add-coins", verifyToken, verifyAdmin, (req, res) => {
  console.log("✅ Add Coins API Called");
  console.log("Received Data:", req.body); // 🔥 Debugging log

  if (!req.body || Object.keys(req.body).length === 0) {
      console.log("❌ Request body is empty or undefined!");
      return res.status(400).json({ msg: "Request body is missing!" });
  }

  const { userId, amount } = req.body; // This was causing the error
  if (!userId || isNaN(amount) || amount <= 0) {
      console.log("❌ Invalid userId or amount", req.body);
      return res.status(400).json({ msg: "Invalid userId or amount" });
  }

  db.query("SELECT coins FROM users WHERE id = ?", [userId], (err, results) => {
      if (err) {
          console.error("❌ Database Error (Fetching Coins):", err);
          return res.status(500).json({ msg: "Database error", error: err });
      }

      if (results.length === 0) {
          console.log("❌ User Not Found");
          return res.status(404).json({ msg: "User not found" });
      }

      const newCoins = results[0].coins + parseInt(amount);
      console.log(`🔹 Current Coins: ${results[0].coins}, Adding: ${amount}, New Coins: ${newCoins}`);

      db.query("UPDATE users SET coins = ? WHERE id = ?", [newCoins, userId], (updateErr) => {
          if (updateErr) {
              console.error("❌ Database Error (Updating Coins):", updateErr);
              return res.status(500).json({ msg: "Database error", error: updateErr });
          }

          console.log(`✅ Coins Updated for User ID ${userId}: New Balance ${newCoins}`);
          res.json({ success: true, msg: `Added ${amount} coins to user ID ${userId}`, newCoins });
      });
  });
});

// ✅ Remove Coins from User
router.post("/remove-coins", verifyToken, verifyAdmin, (req, res) => {
  console.log("✅ Remove Coins API Called", req.body); // Debugging

  const { userId, amount } = req.body;

  if (!userId || isNaN(amount) || amount <= 0) {
      console.log("❌ Invalid userId or amount", req.body);
      return res.status(400).json({ msg: "Invalid userId or amount" });
  }

  db.query("SELECT coins FROM users WHERE id = ?", [userId], (err, results) => {
      if (err) {
          console.error("❌ Database Error (Fetching Coins):", err);
          return res.status(500).json({ msg: "Database error", error: err });
      }

      if (results.length === 0) {
          console.log("❌ User Not Found");
          return res.status(404).json({ msg: "User not found" });
      }

      if (results[0].coins < amount) {
          console.log("❌ Not enough coins to remove");
          return res.status(400).json({ msg: "Not enough coins to remove" });
      }

      const newCoins = results[0].coins - parseInt(amount);
      console.log(`🔹 Removing ${amount} coins. New Balance: ${newCoins}`);

      db.query("UPDATE users SET coins = ? WHERE id = ?", [newCoins, userId], (updateErr) => {
          if (updateErr) {
              console.error("❌ Database Error (Updating Coins):", updateErr);
              return res.status(500).json({ msg: "Database error", error: updateErr });
          }

          console.log(`✅ Coins Removed for User ID ${userId}: New Balance ${newCoins}`);
          res.json({ success: true, msg: `Removed ${amount} coins from user ID ${userId}`, newCoins });
      });
  });
});
// ✅ Add a new account to a stock type
router.post("/add-account", verifyToken, verifyAdmin, (req, res) => {
  const { stockId, accountData } = req.body;

  if (!stockId || !accountData) {
      return res.status(400).json({ msg: "Missing stock ID or account data." });
  }

  const query = "INSERT INTO accounts (stock_id, account_data, is_sold, created_at) VALUES (?, ?, 0, NOW())";
  db.query(query, [stockId, accountData], (err, result) => {
      if (err) {
          console.error("❌ Database Error:", err);
          return res.status(500).json({ msg: "Database error", error: err });
      }
      res.json({ success: true, msg: "Account added successfully!" });
  });
});


// ✅ Remove an account by ID
router.post("/remove-account", verifyToken, verifyAdmin, (req, res) => {
  const { accountId } = req.body;

  if (!accountId) {
      return res.status(400).json({ msg: "Account ID is required" });
  }

  console.log(`🗑 Marking account ID ${accountId} as removed`);

  // ✅ Instead of deleting, mark account as removed (is_sold = 2)
  const query = "UPDATE accounts SET is_sold = 2 WHERE id = ?";
  db.query(query, [accountId], (err, results) => {
      if (err) {
          console.error("❌ Error updating account:", err);
          return res.status(500).json({ msg: "Internal Server Error" });
      }

      res.json({ msg: "Account removed from Admin Panel but still in transaction history" });
  });
});


module.exports = router;
