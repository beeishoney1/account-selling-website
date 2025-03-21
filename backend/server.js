
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const db = require("./config/db"); // Ensure this is the correct path
const app = express();
require('dotenv').config();

const server = http.createServer(app); // Create HTTP server for socket.io

// ✅ Import Routes
const storeRoutes = require("./routes/storeRoutes"); // ✅ Import storeRoutes
const userRoutes = require("./routes/userRoutes");
// ✅ Ensure this line exists
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const accountRoutes = require("./routes/accountRoutes");
const stockRoutes = require("./routes/stockRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const buyRoutes = require("./routes/buyRoutes"); // ✅ Import buyRoutes


// ✅ Import Middleware Correctly (Fix: Use Destructuring)
const { verifyToken, verifyAdmin, authenticateToken, authMiddleware } = require("./middleware/authMiddleware");
const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);
app.use("/uploads", express.static("uploads")); // Serve images



// ✅ Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ✅ Apply Authentication Middleware to Protected Routes

app.use("/api/accounts", verifyToken, accountRoutes);  // ✅ Protected route
app.use("/api/user", verifyToken, userRoutes);  // ✅ Protected route

// ✅ Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/buy", buyRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api", storeRoutes); // ✅ Register store routes
// ✅ Ensure this line exists
app.use("/api", buyRoutes); // ✅ Ensure this line exists
app.use("/api/admin", adminRoutes);
app.use("/api", accountRoutes);
app.use("/api/accounts", require("./routes/accountRoutes"));


// ✅ Fix CORS Issue for All Routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, admin-key");
  next();
});

app.get('/api/transactions', (req, res) => {
  db.query("SELECT * FROM transactions", (err, results) => {
      if (err) {
          console.error("❌ Error fetching transactions:", err);
          return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(results);
  });
});

// ✅ Test Database Connection
db.connect((err) => {
  if (err) {
    console.error("❌ Database Connection Error:", err);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL Database");
});

// ✅ Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ New WebSocket Connection:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", socket.id);
  });
});

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the Account Selling API!");
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ msg: "Internal Server Error" });
});

// ✅ Start Server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
