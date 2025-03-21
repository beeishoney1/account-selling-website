const express = require("express");
const db = require("../config/db");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

// ✅ Get all accounts (Available & Sold)
router.get("/", async (req, res) => {
    try {
        const query = `
            SELECT a.id, a.stock_id, a.account_data, a.is_sold, s.name AS stock_name,
                   CASE WHEN a.is_sold = 0 THEN 'In Stock' ELSE 'Sold' END AS stock_status
            FROM accounts a
            JOIN stocks s ON a.stock_id = s.id
            ORDER BY a.is_sold ASC, a.id DESC;
        `;

        db.query(query, (err, results) => {
            if (err) {
                console.error("❌ Error fetching accounts:", err);
                return res.status(500).json({ msg: "Internal Server Error" });
            }
            res.json(results);
        });

    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// ✅ Add a new account (Admin Only)
router.post("/", verifyToken, verifyAdmin, (req, res) => {
    const { stock_id, account_data } = req.body; // Ensure the frontend sends these names correctly

    if (!stock_id || !account_data) {
        return res.status(400).json({ msg: "Stock ID and Account Data are required" });
    }

    console.log(`🆕 Adding new account to stock ID: ${stock_id}`);

    const query = "INSERT INTO accounts (stock_id, account_data, is_sold) VALUES (?, ?, 0)";
    db.query(query, [stock_id, account_data], (err, results) => {
        if (err) {
            console.error("❌ Error adding account:", err);
            return res.status(500).json({ msg: "Internal Server Error" });
        }

        res.json({ msg: "Account added successfully!", accountId: results.insertId });
    });
});

// ✅ Mark an account as removed (Does not delete from transactions)
router.post("/remove-account", verifyToken, verifyAdmin, (req, res) => {
    const { accountId } = req.body;

    if (!accountId) {
        return res.status(400).json({ msg: "Account ID is required" });
    }

    console.log(`🗑 Marking account ID ${accountId} as removed`);

    const query = "UPDATE accounts SET is_sold = 2 WHERE id = ?";
    db.query(query, [accountId], (err, results) => {
        if (err) {
            console.error("❌ Error updating account:", err);
            return res.status(500).json({ msg: "Internal Server Error" });
        }
        res.json({ msg: "Account removed from Admin Panel but still in transaction history" });
    });
});

// ✅ Remove an account (Admin Only, but transactions remain)
router.delete("/:id", verifyAdmin, (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Account ID is required" });
    }

    // ✅ Check if the account is sold before deleting
    const checkQuery = "SELECT is_sold FROM accounts WHERE id = ?";
    db.query(checkQuery, [id], (err, results) => {
        if (err) {
            console.error("❌ Error checking account status:", err);
            return res.status(500).json({ message: "Database error", error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Account not found" });
        }

        if (results[0].is_sold === 1) {
            return res.status(400).json({ message: "Cannot delete a sold account" });
        }

        // ✅ Proceed with deletion
        const deleteQuery = "DELETE FROM accounts WHERE id = ?";
        db.query(deleteQuery, [id], (err, result) => {
            if (err) {
                console.error("❌ Error removing account:", err);
                return res.status(500).json({ message: "Database error", error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Account not found" });
            }

            res.json({ success: true, message: "✅ Account removed successfully!" });
        });
    });
});

module.exports = router;
