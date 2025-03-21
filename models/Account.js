const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ["available", "sold"], default: "available" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Account", accountSchema);
