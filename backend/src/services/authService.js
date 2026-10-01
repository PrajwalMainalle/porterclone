const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ======================================================
// Helper Validation
// ======================================================

const validateRegisterData = ({
  name,
  email,
  password,
  phone,
}) => {
  if (!name || !name.trim()) {
    throw new Error("Name is required");
  }

  if (!email || !email.trim()) {
    throw new Error("Email is required");
  }

  if (!password) {
    throw new Error("Password is required");
  }

  if (!phone || !phone.trim()) {
    throw new Error("Phone number is required");
  }

  if (password.length < 6) {
    throw new Error(
      "Password must be at least 6 characters"
    );
  }

  // Basic email format validation
 
    const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.trim())) {
    throw new Error("Please provide a valid email address");
  }
};

// ======================================================
// Register
// ======================================================

const register = async (userData) => {
  const {
    name,
    email,
    password,
    phone,
  } = userData;

  // ----------------------------------------------
  // Validation
  // ----------------------------------------------

  validateRegisterData(userData);

  const normalizedEmail =
    email.trim().toLowerCase();

  const normalizedName =
    name.trim();

  const normalizedPhone =
    phone.trim();

  // ----------------------------------------------
  // Check duplicate email
  // ----------------------------------------------

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new Error(
      "User with this email already exists"
    );
  }

  // ----------------------------------------------
  // Hash password
  // ----------------------------------------------

  const hashedPassword =
    await bcrypt.hash(password, 10);

  // ----------------------------------------------
  // Create employee
  // ----------------------------------------------

  const user = await User.create({
    name: normalizedName,
    email: normalizedEmail,
    password: hashedPassword,
    phone: normalizedPhone,
    role: "EMPLOYEE",
  });

  // ----------------------------------------------
  // Generate JWT
  // ----------------------------------------------

  const token = generateToken(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
  };
};

// ======================================================
// Login
// ======================================================

const login = async (loginData) => {
  const { email, password } = loginData;

  // ----------------------------------------------
  // Validation
  // ----------------------------------------------

  if (!email || !email.trim()) {
    throw new Error("Email is required");
  }

  if (!password) {
    throw new Error("Password is required");
  }

  const normalizedEmail =
    email.trim().toLowerCase();

  // ----------------------------------------------
  // Find user
  // ----------------------------------------------

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw new Error(
      "Invalid email or password"
    );
  }

  // ----------------------------------------------
  // Compare password
  // ----------------------------------------------

  const isPasswordValid =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isPasswordValid) {
    throw new Error(
      "Invalid email or password"
    );
  }

  // ----------------------------------------------
  // Generate JWT
  // ----------------------------------------------

  const token = generateToken(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
  };
};

// ======================================================
// Export
// ======================================================

module.exports = {
  register,
  login,
};