const express = require("express");
const db = require("../config/db"); // ✅ Import db (NOT pool)
const { verifyToken } = require("../middleware/authMiddleware"); // ✅ Import token verification

const router = express.Router();

// ✅ Fetch all available stocks (Public Route - No Login Needed)
router.get("/", (req, res) => {
    db.query(`SELECT s.id, s.name, s.price, s.created_at, 
                (SELECT id FROM accounts WHERE stock_id = s.id AND is_sold = 0 LIMIT 1) AS accountID
         FROM stocks s`, (err, results) => {
        if (err) {
            console.error("❌ Database error:", err.message);
            return res.status(500).json({ msg: "Database error", error: err.message });
        }
        if (!results || results.length === 0) {
            return res.status(404).json({ msg: "No stocks available." });
        }
        res.json(results);
    });
});



// ✅ Buy Stock Route (Requires Login)
router.post("/buy", verifyToken, (req, res) => {
    const { userId, stockId } = req.body;

    if (!userId || !stockId) {
        return res.status(400).json({ msg: "Missing userId or stockId" });
    }

    // ✅ Check if stock is available
    db.query("SELECT * FROM stocks WHERE id = ? AND status = 'available'", [stockId], (err, stock) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ msg: "Database error", error: err.message });
        }
        if (stock.length === 0) {
            return res.status(404).json({ msg: "Stock not available" });
        }

        // ✅ Check if user has enough coins
        db.query("SELECT coins FROM users WHERE id = ?", [userId], (err, user) => {
            if (err) {
                console.error("❌ Database error:", err);
                return res.status(500).json({ msg: "Database error", error: err.message });
            }
            if (user[0].coins < 100) {
                return res.status(400).json({ msg: "Not enough coins" });
            }

            // ✅ Deduct coins and update stock status
            db.query("UPDATE users SET coins = coins - 100 WHERE id = ?", [userId], (err) => {
                if (err) {
                    console.error("❌ Error updating user coins:", err);
                    return res.status(500).json({ msg: "Error updating user coins" });
                }

                db.query("UPDATE stocks SET status = 'sold', buyer_id = ? WHERE id = ?", [userId, stockId], (err) => {
                    if (err) {
                        console.error("❌ Error updating stock:", err);
                        return res.status(500).json({ msg: "Error updating stock" });
                    }

                    res.json({ success: true, msg: "Purchase successful!" });
                });
            });
        });
    });
});

module.exports = router;
