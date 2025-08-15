const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// ✅ Register a new user
router.post("/register", (req, res) => {
  console.log("📩 Register request received:", req.body.email);
  authController.register(req, res);
});

// ✅ Login user
router.post("/login", (req, res) => {
  console.log("📩 Login request received:", req.body.email);
  authController.login(req, res);
});

module.exports = router;
