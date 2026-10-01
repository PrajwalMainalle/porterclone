const express = require("express");

const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  approveBooking,
  rejectBooking,
  assignVehicle,
  completeBooking,
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createBooking
);

router.get(
  "/my",
  authMiddleware,
  getMyBookings
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllBookings
);

router.patch(
  "/:id/cancel",
  authMiddleware,
  cancelBooking
);

router.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("ADMIN"),
  approveBooking
);

router.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("ADMIN"),
  rejectBooking
);

router.patch(
  "/:id/assign-vehicle",
  authMiddleware,
  roleMiddleware("ADMIN"),
  assignVehicle
);

router.patch(
  "/:id/complete",
  authMiddleware,
  roleMiddleware("ADMIN"),
  completeBooking
);

router.get(
  "/:id",
  authMiddleware,
  getBookingById
);

module.exports = router;