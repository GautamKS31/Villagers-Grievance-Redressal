const express = require("express");
const {
  register,
  userLogin,
  adminLogin,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login/user", userLogin);
router.post("/login/admin", adminLogin);

// Protected routes
router.get("/me", protect, getMe);

module.exports = router;
