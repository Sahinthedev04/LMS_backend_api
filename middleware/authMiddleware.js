const jwt = require("jsonwebtoken");

// Token verify
exports.protect = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }
  try {
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Role-based guard
exports.authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

// Self OR specific roles (e.g., admin)
exports.allowSelfOrRoles = (...roles) => (req, res, next) => {
  if (req.user && req.user.id === req.params.id) return next();
  if (req.user && roles.includes(req.user.role)) return next();
  return res.status(403).json({ message: "Forbidden" });
};
