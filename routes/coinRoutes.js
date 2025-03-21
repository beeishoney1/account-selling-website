router.post("/add", (req, res) => {
    const { userId, amount } = req.body;
    if (!userId || !amount) return res.status(400).json({ msg: "User ID and amount are required" });

    const query = `UPDATE users SET coins = coins + ? WHERE id = ?`;
    db.query(query, [amount, userId], (err, result) => {
        if (err) return res.status(500).json({ msg: "Database error", err });

        // Emit real-time update
        io.emit("updateBalance", { userId, amount });

        res.json({ msg: `Added ${amount} coins to user ${userId}` });
    });
});
