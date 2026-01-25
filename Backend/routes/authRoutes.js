const express = require("express");
const {
  register,
  userLogin,
  adminLogin,
  changePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Registration (direct, no OTP)
router.post("/register", register);

// Login routes
router.post("/login/user", userLogin);
router.post("/login/admin", adminLogin);

// Change password (for authenticated users)
router.post("/change-password", protect, changePassword);

module.exports = router;
