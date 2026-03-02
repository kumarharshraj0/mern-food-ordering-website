const jwt = require("jsonwebtoken");
const User = require("../models/User");

// --------------------------------------------------
// VERIFY ACCESS TOKEN (HEADER BASED)
// --------------------------------------------------
const verifyAccessToken = async (req, res, next) => {
  try {
    // Expect: Authorization: Bearer TOKEN
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No access token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Fetch user without password
    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return res.status(401).json({ message: "User not found" });

    req.user = user; // attach user object
    next();

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Access token expired",
        expired: true
      });
    }

    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

// --------------------------------------------------
// ROLE-BASED AUTHORIZATION
// --------------------------------------------------
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Unauthenticated" });


    // Check if user has at least one required role
    if (
      !req.user.roles ||
      !req.user.roles.some(role => roles.includes(role))
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

module.exports = {
  verifyAccessToken,
  requireRole
};



