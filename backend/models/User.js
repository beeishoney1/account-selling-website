const db = require("../config/db");
const mongoose = require("mongoose");
// Create users table
const createUserTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            coins INT UNSIGNED DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.query(query, (err) => {
        if (err) console.error("Error creating users table:", err);
        else console.log("Users table ready");
    });
};

// Add coins to a user
const addCoins = (userId, amount, callback) => {
    const query = `UPDATE users SET coins = coins + ? WHERE id = ?`;
    db.query(query, [amount, userId], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

// Remove coins from a user
const removeCoins = (userId, amount, callback) => {
    const query = `UPDATE users SET coins = GREATEST(coins - ?, 0) WHERE id = ?`;
    db.query(query, [amount, userId], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

// Get user balance
const getUserBalance = (userId, callback) => {
    const query = `SELECT coins FROM users WHERE id = ?`;
    db.query(query, [userId], (err, result) => {
        if (err) return callback(err);
        if (result.length === 0) return callback(new Error("User not found"));
        callback(null, result[0]);
    });
};
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    coins: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false }  // <-- Add this
  });
  
  module.exports = mongoose.model("User", UserSchema);
module.exports = { addCoins, removeCoins, getUserBalance };
