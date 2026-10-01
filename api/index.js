const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");

// Load env if available
require("dotenv").config({ path: path.join(__dirname, "../backend/.env") });

const connectDB = require("../backend/src/config/db");

const authRoutes = require("../backend/src/routes/authRoutes");
const vehicleRoutes = require("../backend/src/routes/vehicleRoutes");
const bookingRoutes = require("../backend/src/routes/bookingRoutes");
const authMiddleware = require("../backend/src/middleware/authMiddleware");
const roleMiddleware = require("../backend/src/middleware/roleMiddleware");

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Vehicle Booking API is running on Vercel Serverless",
  });
});

// Connect database middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ success: false, message: "Database connection failed", error: err.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/api/test-protected", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You accessed a protected route",
    user: req.user,
  });
});

app.get(
  "/api/test-admin",
  authMiddleware,
  roleMiddleware("ADMIN"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "You accessed an admin route",
      user: req.user,
    });
  }
);

module.exports = app;
