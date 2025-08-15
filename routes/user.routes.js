const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../controllers/user.controller");

const { protect, authorizeRoles, allowSelfOrRoles } = require("../middleware/authMiddleware");

// Admin can create user of any role (via body.role)
router.post("/", protect, authorizeRoles("admin"), createUser);

// Admin only: list all users
router.get("/", protect, authorizeRoles("admin"), getUsers);

// Self OR admin: read, update, delete by id
router.get("/:id", protect, allowSelfOrRoles("admin"), getUserById);
router.put("/:id", protect, allowSelfOrRoles("admin"), updateUser);
router.delete("/:id", protect, allowSelfOrRoles("admin"), deleteUser);

module.exports = router;
