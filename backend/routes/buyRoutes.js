const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, async (req, res) => {
    console.log("🔍 Received request at /api/buy:", req.body);
    console.log("🔍 User ID from token:", req.user?.id);

    try {
        if (!req.body || !req.body.stockId || !req.body.accountIDs || req.body.accountIDs.length === 0) {
            return res.status(400).json({ success: false, msg: "Stock ID and accountIDs are required" });
        }

        const { stockId, accountIDs, price } = req.body;
        const userId = req.user.id; // Extract user ID from token

        console.log("🔍 Processing purchase for User ID:", userId, "Stock ID:", stockId);

        // ✅ Check if stock exists and is available
        const [stock] = await db.promise().query(
            "SELECT * FROM stocks WHERE id = ? AND status = 'available'", 
            [stockId]
        );

        if (stock.length === 0) {
            return res.status(404).json({ success: false, msg: "Stock not available or already sold" });
        }

        // ✅ Check if the user has enough coins
        const [user] = await db.promise().query(
            "SELECT coins FROM users WHERE id = ?", 
            [userId]
        );

        if (user.length === 0) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        const userCoins = user[0].coins;

        if (userCoins < price) {
            return res.status(400).json({ success: false, msg: "Insufficient coins" });
        }

        // ✅ Verify all requested accounts are available
        const [availableAccounts] = await db.promise().query(
            "SELECT id FROM accounts WHERE id IN (?) AND is_sold = 0", 
            [accountIDs]
        );

        if (availableAccounts.length !== accountIDs.length) {
            return res.status(400).json({ success: false, msg: "Some accounts are no longer available" });
        }

        // ✅ Deduct coins from user
        await db.promise().query("UPDATE users SET coins = coins - ? WHERE id = ?", [price, userId]);

        // ✅ Mark selected accounts as sold
        await db.promise().query("UPDATE accounts SET is_sold = 1 WHERE id IN (?)", [accountIDs]);

        // ✅ Record transaction
        for (const accountId of accountIDs) {
       await db.promise().query(
    "INSERT INTO transactions (user_id, stock_id, account_id, price, amount, created_at) VALUES (?, ?, ?, ?, ?, NOW())", 
    [userId, stockId, accountId, price / accountIDs.length, price] // ✅ Provide amount value
);
            
        }

        console.log("✅ Purchase Successful!");

        res.json({ success: true, msg: "✅ Purchase successful!" });

    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ success: false, msg: "Internal Server Error", error: error.message });
    }
});

module.exports = router;
