const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer"); // Import multer

// Fetch all stocks



// Buy stock
router.post("/buy", async (req, res) => {
    const { stockId } = req.body;
    const userId = req.user?.id; // Ensure user is authenticated

    if (!userId) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    try {
        // Check stock availability
        const [stock] = await db.query("SELECT * FROM stocks WHERE id = ?", [stockId]);
        if (stock.length === 0) {
            return res.status(400).json({ message: "Stock not found" });
        }

        // Check user balance (assuming user has an account balance)
        const [user] = await db.query("SELECT balance FROM users WHERE id = ?", [userId]);
        if (user[0].balance < stock[0].price) {
            return res.status(400).json({ message: "Insufficient funds" });
        }

        // Deduct price & update transaction history
        await db.query("UPDATE users SET balance = balance - ? WHERE id = ?", [stock[0].price, userId]);
        await db.query("INSERT INTO transactions (user_id, stock_id, amount) VALUES (?, ?, ?)", [userId, stockId, stock[0].price]);

        res.json({ success: true, message: "Purchase successful" });
    } catch (error) {
        console.error("❌ Error processing purchase:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Fetch user transactions
router.get("/transactions", async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    try {
        const [transactions] = await db.query(`
            SELECT t.id, s.name AS stock_name, t.amount, t.created_at 
            FROM transactions t
            JOIN stocks s ON t.stock_id = s.id
            WHERE t.user_id = ?
            ORDER BY t.created_at DESC
        `, [userId]);

        res.json({ transactions });
    } catch (error) {
        console.error("❌ Error fetching transactions:", error);
        res.status(500).json({ message: "Database error" });
    }
});
router.get('/transactions', async (req, res) => {
    try {
        const transactions = await db.query('SELECT * FROM transactions');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get("/", async (req, res) => {
    try {
        const query = `
            SELECT s.id, s.name, s.price, 
                   COUNT(a.id) AS available_accounts
            FROM stocks s
            LEFT JOIN accounts a ON s.id = a.stock_id AND a.is_sold = 0
            GROUP BY s.id, s.name, s.price;
        `;

        db.query(query, (err, results) => {
            if (err) {
                console.error("❌ Error fetching stocks:", err);
                return res.status(500).json({ msg: "Internal Server Error" });
            }
            res.json(results);
        });

    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images"); // Store images in 'public/images'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file
    },
});

const upload = multer({ storage });

// ✅ Upload Image & Store in Database
router.post("/upload-image/:stockId", upload.single("image"), (req, res) => {
    const stockId = req.params.stockId;

    if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
    }

    const imageUrl = `/images/${req.file.filename}`; // File path

    // ✅ Update Image URL in Database
    const query = "UPDATE stocks SET image_url = ? WHERE id = ?";
    db.query(query, [imageUrl, stockId], (err) => {
        if (err) {
            console.error("❌ Error updating stock image:", err);
            return res.status(500).json({ msg: "Internal Server Error" });
        }

        res.json({ msg: "✅ Image uploaded successfully!", imageUrl });
    });
});

// ✅ Get All Stocks (With Images)
router.get("/", (req, res) => {
    const query = "SELECT id, name, price, image_url FROM stocks WHERE status = 'available'";

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Error fetching stocks:", err);
            return res.status(500).json({ msg: "Internal Server Error" });
        }

        res.json(results);
    });
});
router.get("/", async (req, res) => {
    try {
        const query = "SELECT id, name, price, image_url FROM stocks WHERE status = 'available'";
        db.query(query, (err, results) => {
            if (err) {
                console.error("❌ Error fetching stocks:", err);
                return res.status(500).json({ msg: "Internal Server Error" });
            }
            res.json(results);
        });
    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});



module.exports = router;
