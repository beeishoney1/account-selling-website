const db = require("../config/db");

// ✅ Add an account for sale
exports.addAccount = (req, res) => {
    const { username, password, price } = req.body;
    if (!username || !password || !price) {
        return res.status(400).json({ message: "All fields are required" });
    }

    db.query("INSERT INTO accounts (username, password, price) VALUES (?, ?, ?)", [username, password, price], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", err });
        res.status(201).json({ message: "Account added successfully!" });
    });
};

// ✅ Buy an account
exports.buyAccount = (req, res) => {
    const { accountId } = req.body;
    const userId = req.user.id;

    if (!accountId) {
        return res.status(400).json({ message: "Account ID is required" });
    }

    db.query("SELECT * FROM accounts WHERE id = ?", [accountId], (err, accountResults) => {
        if (err) return res.status(500).json({ message: "Database error", err });
        if (accountResults.length === 0) return res.status(404).json({ message: "Account not found" });

        const account = accountResults[0];

        db.query("SELECT coins FROM users WHERE id = ?", [userId], (err, userResults) => {
            if (err) return res.status(500).json({ message: "Database error", err });
            if (userResults.length === 0) return res.status(404).json({ message: "User not found" });

            const userCoins = userResults[0].coins;

            if (userCoins < account.price) {
                return res.status(400).json({ message: "Insufficient coins" });
            }

            // ✅ Deduct coins and complete transaction
            db.query("UPDATE users SET coins = coins - ? WHERE id = ?", [account.price, userId], (err) => {
                if (err) return res.status(500).json({ message: "Failed to deduct coins", err });

                db.query("DELETE FROM accounts WHERE id = ?", [accountId], (err) => {
                    if (err) return res.status(500).json({ message: "Failed to remove account", err });

                    db.query("INSERT INTO transactions (user_id, account_id, price) VALUES (?, ?, ?)", [userId, accountId, account.price], (err) => {
                        if (err) return res.status(500).json({ message: "Failed to log transaction", err });

                        res.status(200).json({ message: "Account purchased successfully!" });
                    });
                });
            });
        });
    });
};
