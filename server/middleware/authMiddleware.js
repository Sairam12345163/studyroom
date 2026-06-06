const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ─── Protect Route Middleware ─────────────────────────
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check if token exists in request headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Token format: "Bearer eyJhbGciOiJIUzI1..."
      token = req.headers.authorization.split(" ")[1];
    }

    // 2. If no token found, deny access
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // 3. Verify the token is valid & not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find user from token's id & attach to request
    req.user = await User.findById(decoded.id).select("-password");

    // 5. Move to next function (the actual route)
    next();

  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// ─── Role Check Middleware ────────────────────────────
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Only ${roles.join(", ")} can do this.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRole };