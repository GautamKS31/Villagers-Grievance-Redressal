const express = require("express");
const {
  createGrievance,
  getMyGrievances,
  getGrievanceById,
  getAllGrievances,
  updateGrievanceStatus,
  addRating,
  getGrievanceStats,
} = require("../controllers/grievanceController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// User routes
router.post("/", protect, createGrievance);
router.get("/my-grievances", protect, getMyGrievances);
router.get("/:id", protect, getGrievanceById);
router.put("/:id/rating", protect, addRating);

// Admin routes
router.get("/admin/all", protect, admin, getAllGrievances);
router.get("/admin/stats", protect, admin, getGrievanceStats);
router.put("/:id/status", protect, admin, updateGrievanceStatus);

module.exports = router;
