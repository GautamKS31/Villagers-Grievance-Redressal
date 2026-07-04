const Grievance = require("../models/Grievance");
const User = require("../models/User");

// @desc    Create new grievance
// @route   POST /api/grievances
// @access  Private (User)
exports.createGrievance = async (req, res) => {
  try {
    const { title, description, category, urgency, location, images } =
      req.body;

    // Validate required fields
    if (!title || !description || !category || !urgency || !location) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Validate location
    if (
      !location.coordinates ||
      location.coordinates.length !== 2 ||
      !location.address
    ) {
      return res.status(400).json({
        message: "Please provide valid location with coordinates and address",
      });
    }

    const grievance = await Grievance.create({
      user: req.user.id,
      title,
      description,
      category,
      urgency,
      location: {
        type: "Point",
        coordinates: location.coordinates,
        address: location.address,
      },
      images: images || [],
    });

    const populatedGrievance = await Grievance.findById(grievance._id).populate(
      "user",
      "fullName username phone village",
    );

    res.status(201).json({
      message: "Grievance created successfully",
      grievance: populatedGrievance,
    });
  } catch (error) {
    console.error("Create grievance error:", error);
    res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Get all grievances for logged-in user
// @route   GET /api/grievances/my-grievances
// @access  Private (User)
exports.getMyGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ user: req.user.id })
      .populate("acceptedBy", "fullName username")
      .sort({ createdAt: -1 });

    res.json({
      count: grievances.length,
      grievances,
    });
  } catch (error) {
    console.error("Get my grievances error:", error);
    res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Get single grievance by ID
// @route   GET /api/grievances/:id
// @access  Private
exports.getGrievanceById = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id)
      .populate("user", "fullName username phone village")
      .populate("acceptedBy", "fullName username");

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    // Check if user is authorized to view this grievance
    if (
      req.user.role !== "admin" &&
      grievance.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(grievance);
  } catch (error) {
    console.error("Get grievance error:", error);
    res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Get all grievances (Admin)
// @route   GET /api/grievances/admin/all
// @access  Private (Admin)
exports.getAllGrievances = async (req, res) => {
  try {
    const {
      status,
      urgency,
      category,
      village,
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (urgency) filter.urgency = urgency;
    if (category) filter.category = category;

    const skip = (page - 1) * limit;

    let query = Grievance.find(filter)
      .populate("user", "fullName username phone village")
      .populate("acceptedBy", "fullName username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Filter by village if provided
    if (village) {
      query = query.where("user.village").equals(village);
    }

    const grievances = await query;
    const total = await Grievance.countDocuments(filter);

    res.json({
      count: grievances.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      grievances,
    });
  } catch (error) {
    console.error("Get all grievances error:", error);
    res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Update grievance status (Admin)
// @route   PUT /api/grievances/:id/status
// @access  Private (Admin)
exports.updateGrievanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const grievance = await Grievance.findById(id);

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    // Update only the fields we need
    grievance.status = status;
    if (adminNotes) {
      grievance.adminNotes = adminNotes;
    }

    // Set timestamps based on status
    if (status === "Accepted" && !grievance.acceptedAt) {
      grievance.acceptedAt = Date.now();
      grievance.acceptedBy = req.user.id;
    }

    if (status === "Resolved" && !grievance.resolvedAt) {
      grievance.resolvedAt = Date.now();
    }

    // Save with validation disabled for unchanged fields
    await grievance.save({ validateModifiedOnly: true });

    const updatedGrievance = await Grievance.findById(id)
      .populate("user", "fullName username phone village")
      .populate("acceptedBy", "fullName");

    res.json(updatedGrievance);
  } catch (error) {
    console.error("Update grievance status error:", error);
    res.status(500).json({ message: "Failed to update grievance status" });
  }
};

// @desc    Add rating and feedback to resolved grievance
// @route   PUT /api/grievances/:id/rating
// @access  Private (User)
exports.addRating = async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Please provide a valid rating (1-5)" });
    }

    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    // Check if user owns this grievance
    if (grievance.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if grievance is resolved
    if (grievance.status !== "Resolved") {
      return res
        .status(400)
        .json({ message: "Can only rate resolved grievances" });
    }

    // Check if already rated
    if (grievance.rating) {
      return res.status(400).json({ message: "Grievance already rated" });
    }

    grievance.rating = rating;
    grievance.feedback = feedback || "";

    await grievance.save();

    const updatedGrievance = await Grievance.findById(grievance._id)
      .populate("user", "fullName username phone village")
      .populate("acceptedBy", "fullName username");

    res.json({
      message: "Rating submitted successfully",
      grievance: updatedGrievance,
    });
  } catch (error) {
    console.error("Add rating error:", error);
    res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Get grievance statistics (Admin)
// @route   GET /api/grievances/admin/stats
// @access  Private (Admin)
exports.getGrievanceStats = async (req, res) => {
  try {
    const total = await Grievance.countDocuments();
    const pending = await Grievance.countDocuments({ status: "Pending" });
    const accepted = await Grievance.countDocuments({ status: "Accepted" });
    const inProgress = await Grievance.countDocuments({
      status: "In Progress",
    });
    const resolved = await Grievance.countDocuments({ status: "Resolved" });
    const rejected = await Grievance.countDocuments({ status: "Rejected" });

    // Get urgency stats
    const critical = await Grievance.countDocuments({ urgency: "Critical" });
    const high = await Grievance.countDocuments({ urgency: "High" });
    const medium = await Grievance.countDocuments({ urgency: "Medium" });
    const low = await Grievance.countDocuments({ urgency: "Low" });

    // Get category stats
    const categoryStats = await Grievance.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get average rating
    const ratingStats = await Grievance.aggregate([
      {
        $match: { rating: { $exists: true, $ne: null } },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    res.json({
      total,
      status: {
        pending,
        accepted,
        inProgress,
        resolved,
        rejected,
      },
      urgency: {
        critical,
        high,
        medium,
        low,
      },
      categories: categoryStats,
      ratings: ratingStats[0] || { averageRating: 0, totalRatings: 0 },
    });
  } catch (error) {
    console.error("Get grievance stats error:", error);
    res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};
