const jwt = require("jsonwebtoken");
const db = require("../config/db");
const secretKey = process.env.JWT_SECRET_KEY || "beesamaadmin"; // Use a valid secret key

// ✅ Verify user authentication (requires token)
const verifyToken = (req, res, next) => {
  console.log("🔍 Incoming Headers:", req.headers); // ✅ Debugging
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No token provided.");
      return res.status(401).json({ message: "No token provided." });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔹 Received Token:", token);

  if (!token) {
      console.log("❌ Malformed token.");
      return res.status(403).json({ message: "Malformed token." });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
          console.error("❌ Token verification failed:", err.message);
          return res.status(403).json({ message: "Unauthorized: Invalid or expired token" });
      }

      console.log("✅ Token verified successfully:", decoded);
      req.user = decoded; // Store user data in request
      next();
  });
};




// ✅ Check if the user is an admin
function verifyAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized access." });
    }
    if (req.user.isAdmin !== 1) {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
}

// ✅ Authenticate user based on token
function authenticateToken(req, res, next) {
  console.log("🔍 Incoming Headers:", req.headers); // ✅ Log headers

  const authHeader = req.headers.authorization; // ✅ Correct way to get token

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("❌ No token received or invalid format.");
      return res.status(401).json({ message: "No token provided." });
  }

  const token = req.headers["authorization"]?.split(" ")[1];


  jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
          console.error("❌ Token verification failed:", err.message);
          return res.status(403).json({ message: "Invalid or expired token." });
      }

      console.log("✅ Token verified successfully:", decoded);
      req.user = decoded;
      next();
  });
}


// ✅ General authentication middleware
function authMiddleware(req, res, next) {
    console.log("✅ Auth Middleware Triggered");
    next();
}

// ✅ Correctly export functions
module.exports = { verifyToken, verifyAdmin, authenticateToken, authMiddleware };
