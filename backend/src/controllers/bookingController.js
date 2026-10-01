const bookingService = require("../services/bookingService");

const createBooking = async (req, res) => {
  try {
    const booking =
      await bookingService.createBooking(
        req.body,
        req.user._id
      );

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error(
      "Create booking error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings =
      await bookingService.getMyBookings(
        req.user._id
      );

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error(
      "Get my bookings error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking =
      await bookingService.getBookingById(
        req.params.id,
        req.user._id
      );

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error(
      "Get booking error:",
      error.message
    );

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking =
      await bookingService.cancelBooking(
        req.params.id,
        req.user._id,
        req.body?.cancellationReason
      );

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    console.error(
      "Cancel booking error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings =
      await bookingService.getAllBookings();

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error(
      "Get all bookings error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

const approveBooking = async (req, res) => {
  try {
    const booking =
      await bookingService.approveBooking(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message: "Booking approved successfully",
      data: booking,
    });
  } catch (error) {
    console.error(
      "Approve booking error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectBooking = async (req, res) => {
  try {
    const booking =
      await bookingService.rejectBooking(
        req.params.id,
        req.body?.rejectionReason
      );

    return res.status(200).json({
      success: true,
      message: "Booking rejected successfully",
      data: booking,
    });
  } catch (error) {
    console.error(
      "Reject booking error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const assignVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.body || {};

    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        message: "vehicleId is required",
      });
    }

    const booking =
      await bookingService.assignVehicle(
        req.params.id,
        vehicleId
      );

    return res.status(200).json({
      success: true,
      message: "Vehicle assigned successfully",
      data: booking,
    });
  } catch (error) {
    console.error(
      "Assign vehicle error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const completeBooking = async (req, res) => {
  try {
    const booking =
      await bookingService.completeBooking(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message: "Booking completed successfully",
      data: booking,
    });
  } catch (error) {
    console.error(
      "Complete booking error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  approveBooking,
  rejectBooking,
  assignVehicle,
  completeBooking,
};