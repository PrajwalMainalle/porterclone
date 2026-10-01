const authService = require("../services/authService");

// ======================================================
// Register
// ======================================================

const register = async (req, res) => {
  try {
    const data = await authService.register(
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data,
    });
  } catch (error) {
    console.error(
      "Register error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Login
// ======================================================

const login = async (req, res) => {
  try {
    const data = await authService.login(
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error) {
    console.error(
      "Login error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Export
// ======================================================

module.exports = {
  register,
  login,
};