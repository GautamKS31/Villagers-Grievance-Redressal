const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { fullName, username, phone, village, password, role } = req.body;

    // Validation
    if (!fullName || !username || !phone || !village || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    // Create user
    const user = await User.create({
      fullName,
      username,
      phone,
      village,
      password,
      role: role || "user",
    });

    if (user) {
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user._id,
          fullName: user.fullName,
          username: user.username,
          phone: user.phone,
          village: user.village,
          role: user.role,
        },
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login/user
// @access  Public
exports.userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        message: "Please provide username and password",
      });
    }

    // Find user and explicitly select password field
    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Check if user role is 'user'
    if (user.role !== "user") {
      return res.status(403).json({
        message: "Access denied. Please use admin login.",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        phone: user.phone,
        village: user.village,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Login admin
// @route   POST /api/auth/login/admin
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        message: "Please provide username and password",
      });
    }

    // Find user and explicitly select password field
    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Check if user role is 'admin'
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        phone: user.phone,
        village: user.village,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};
