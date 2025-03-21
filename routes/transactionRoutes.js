const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

// ✅ Get Transaction History for Logged-in User
router.get("/", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("Fetching transactions for user:", userId);

        const query = `
            SELECT 
                t.id, 
                s.name AS stock_name, 
                a.account_data AS account_info, 
                t.price, 
                DATE_FORMAT(t.created_at, '%Y-%m-%d %H:%i:%s') AS formatted_date
            FROM transactions t
            JOIN stocks s ON t.stock_id = s.id
            JOIN accounts a ON t.account_id = a.id
            WHERE t.user_id = ?
            ORDER BY t.created_at DESC;
        `;

        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error("❌ Error fetching transactions:", err);
                return res.status(500).json({ msg: "Internal Server Error" });
            }
            res.json(results);
        });

    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// ✅ Buy an Account (Deduct coins and save transaction)
router.post("/buy", verifyToken, async (req, res) => {
    try {
        const { stockId } = req.body;
        const userId = req.user.id;

        if (!stockId) {
            return res.status(400).json({ msg: "Stock ID is required" });
        }

        // ✅ Check if user has enough coins
        const userQuery = "SELECT coins FROM users WHERE id = ?";
        db.query(userQuery, [userId], (err, userResult) => {
            if (err) {
                console.error("❌ Error checking user coins:", err);
                return res.status(500).json({ msg: "Internal Server Error" });
            }

            if (userResult.length === 0) {
                return res.status(404).json({ msg: "User not found" });
            }

            const userCoins = userResult[0].coins;

            // ✅ Get stock price & ensure availability
            const stockQuery = "SELECT id, price FROM stocks WHERE id = ? AND status = 'available'";
            db.query(stockQuery, [stockId], (err, stockResult) => {
                if (err) {
                    console.error("❌ Error checking stock:", err);
                    return res.status(500).json({ msg: "Internal Server Error" });
                }

                if (stockResult.length === 0) {
                    return res.status(404).json({ msg: "Stock not available" });
                }

                const stockPrice = stockResult[0].price;

                if (userCoins < stockPrice) {
                    return res.status(400).json({ msg: "Not enough coins" });
                }

                // ✅ Select an available account
                const getAccountQuery = "SELECT id, account_data FROM accounts WHERE stock_id = ? AND is_sold = 0 LIMIT 1";
                db.query(getAccountQuery, [stockId], (err, accountResult) => {
                    if (err) {
                        console.error("❌ Error fetching account:", err);
                        return res.status(500).json({ msg: "Internal Server Error" });
                    }

                    if (accountResult.length === 0) {
                        return res.status(404).json({ msg: "No available accounts" });
                    }

                    const accountId = accountResult[0].id;
                    const accountData = accountResult[0].account_data;

                    // ✅ Deduct user coins & mark account as sold in a transaction
                    const updateUserCoins = "UPDATE users SET coins = coins - ? WHERE id = ?";
                    const insertTransaction = "INSERT INTO transactions (user_id, stock_id, account_id, price) VALUES (?, ?, ?, ?)";
                    const updateAccount = "UPDATE accounts SET is_sold = 1 WHERE id = ?";

                    db.query(updateUserCoins, [stockPrice, userId], (err) => {
                        if (err) {
                            console.error("❌ Error updating user coins:", err);
                            return res.status(500).json({ msg: "Internal Server Error" });
                        }

                        db.query(insertTransaction, [userId, stockId, accountId, stockPrice], (err) => {
                            if (err) {
                                console.error("❌ Error inserting transaction:", err);
                                return res.status(500).json({ msg: "Internal Server Error" });
                            }

                            db.query(updateAccount, [accountId], (err) => {
                                if (err) {
                                    console.error("❌ Error updating account status:", err);
                                    return res.status(500).json({ msg: "Internal Server Error" });
                                }

                                console.log("✅ Account purchased successfully:", accountData);
                                res.json({ msg: "Purchase successful", account: accountData });
                            });
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

module.exports = router;
