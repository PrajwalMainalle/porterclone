require("dotenv").config();

const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      email: "admin@porterclone.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin123456", 10);

    const admin = await User.create({
      name: "System Admin",
      email: "admin@porterclone.com",
      password: hashedPassword,
      phone: "9999999999",
      role: "ADMIN",
    });

    console.log("Admin created successfully");
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error.message);
    process.exit(1);
  }
};

createAdmin();