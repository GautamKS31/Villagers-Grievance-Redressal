const User = require("../models/User");
const {
  generateToken,
  generateRefreshToken,
} = require("../utils/generateToken");

// Direct Registration (without OTP)
exports.register = async (req, res) => {
  try {
    const { fullName, username, phone, village, password, role } = req.body;

    // Validate required fields
    if (!fullName || !username || !phone || !village || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Check if username already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create user
    const user = await User.create({
      fullName,
      username,
      phone,
      village,
      password,
      role: role || "user",
      isVerified: true,
    });

    res.status(201).json({
      message: "Registration successful! You can now login.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// User Login
exports.userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username and password" });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      message: "Login successful",
      token,
      refreshToken,
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
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username and password" });
    }

    // Find admin user
    const user = await User.findOne({ username, role: "admin" });
    if (!user) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      message: "Admin login successful",
      token,
      refreshToken,
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
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Change Password (authenticated users)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide current and new password" });
    }

    const user = await User.findById(req.user.id);

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
