const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");

// ======================================================
// Validation Helpers
// ======================================================

const validateCreateBookingData = (bookingData) => {
  const {
    pickupLocation,
    dropLocation,
    bookingDate,
    startTime,
    endTime,
    requiredCapacity,
    purpose,
  } = bookingData;

  // ----------------------------------------------
  // Required fields
  // ----------------------------------------------

  if (!pickupLocation || !pickupLocation.trim()) {
    throw new Error("Pickup location is required");
  }

  if (!dropLocation || !dropLocation.trim()) {
    throw new Error("Drop location is required");
  }

  if (!bookingDate) {
    throw new Error("Booking date is required");
  }

  if (!startTime) {
    throw new Error("Start time is required");
  }

  if (!endTime) {
    throw new Error("End time is required");
  }

  if (
    requiredCapacity === undefined ||
    requiredCapacity === null ||
    requiredCapacity === ""
  ) {
    throw new Error("Required capacity is required");
  }

  if (!purpose || !purpose.trim()) {
    throw new Error("Purpose is required");
  }

  // ----------------------------------------------
  // Capacity validation
  // ----------------------------------------------

  const capacity = Number(requiredCapacity);

  if (!Number.isFinite(capacity) || capacity < 1) {
    throw new Error(
      "Required capacity must be greater than 0"
    );
  }

  // ----------------------------------------------
  // Time format validation
  // ----------------------------------------------

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!timeRegex.test(startTime)) {
    throw new Error(
      "Start time must be in HH:MM format"
    );
  }

  if (!timeRegex.test(endTime)) {
    throw new Error(
      "End time must be in HH:MM format"
    );
  }

  // ----------------------------------------------
  // Time comparison
  // ----------------------------------------------

  if (startTime >= endTime) {
    throw new Error(
      "End time must be after start time"
    );
  }

  // ----------------------------------------------
  // Date validation
  // ----------------------------------------------

  const selectedDate = new Date(bookingDate);

  if (Number.isNaN(selectedDate.getTime())) {
    throw new Error("Invalid booking date");
  }

  // ----------------------------------------------
  // Return cleaned data
  // ----------------------------------------------

  return {
    pickupLocation: pickupLocation.trim(),
    dropLocation: dropLocation.trim(),
    bookingDate: selectedDate,
    startTime,
    endTime,
    requiredCapacity: capacity,
    purpose: purpose.trim(),
  };
};

// ======================================================
// Employee: Create Booking
// ======================================================

const createBooking = async (
  bookingData,
  userId
) => {
  // ----------------------------------------------
  // Validate booking data
  // ----------------------------------------------

  const validatedData =
    validateCreateBookingData(bookingData);

  // ----------------------------------------------
  // Create booking
  // ----------------------------------------------

  const booking = await Booking.create({
    user: userId,

    pickupLocation:
      validatedData.pickupLocation,

    dropLocation:
      validatedData.dropLocation,

    bookingDate:
      validatedData.bookingDate,

    startTime:
      validatedData.startTime,

    endTime:
      validatedData.endTime,

    requiredCapacity:
      validatedData.requiredCapacity,

    purpose:
      validatedData.purpose,
  });

  return booking;
};

// ======================================================
// Employee: Get My Bookings
// ======================================================

const getMyBookings = async (userId) => {
  return await Booking.find({
    user: userId,
  })
    .populate("vehicle")
    .sort({ createdAt: -1 });
};

// ======================================================
// Employee: Get One Booking
// ======================================================

const getBookingById = async (
  bookingId,
  userId
) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    user: userId,
  }).populate("vehicle");

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
};

// ======================================================
// Employee: Cancel Booking
// ======================================================

const cancelBooking = async (
  bookingId,
  userId,
  cancellationReason
) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    user: userId,
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (
    ["COMPLETED", "CANCELLED", "REJECTED"].includes(
      booking.status
    )
  ) {
    throw new Error(
      `Booking cannot be cancelled because its current status is ${booking.status}`
    );
  }

  booking.status = "CANCELLED";

  booking.cancellationReason =
    cancellationReason
      ? cancellationReason.trim()
      : null;

  return await booking.save();
};

// ======================================================
// Admin: Get All Bookings
// ======================================================

const getAllBookings = async () => {
  return await Booking.find()
    .populate(
      "user",
      "name email phone"
    )
    .populate("vehicle")
    .sort({ createdAt: -1 });
};

// ======================================================
// Admin: Approve Booking
// ======================================================

const approveBooking = async (bookingId) => {
  const booking =
    await Booking.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status !== "PENDING") {
    throw new Error(
      `Booking cannot be approved because its current status is ${booking.status}`
    );
  }

  booking.status = "APPROVED";

  return await booking.save();
};

// ======================================================
// Admin: Reject Booking
// ======================================================

const rejectBooking = async (
  bookingId,
  rejectionReason
) => {
  const booking =
    await Booking.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status !== "PENDING") {
    throw new Error(
      `Booking cannot be rejected because its current status is ${booking.status}`
    );
  }

  if (
    !rejectionReason ||
    !rejectionReason.trim()
  ) {
    throw new Error(
      "Rejection reason is required"
    );
  }

  booking.status = "REJECTED";

  booking.rejectionReason =
    rejectionReason.trim();

  return await booking.save();
};

// ======================================================
// Admin: Assign Vehicle
// ======================================================

const assignVehicle = async (
  bookingId,
  vehicleId
) => {
  // ----------------------------------------------
  // 1. Validate vehicle ID
  // ----------------------------------------------

  if (!vehicleId) {
    throw new Error(
      "Vehicle ID is required"
    );
  }

  // ----------------------------------------------
  // 2. Find booking
  // ----------------------------------------------

  const booking =
    await Booking.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  // ----------------------------------------------
  // 3. Booking must be APPROVED
  // ----------------------------------------------

  if (booking.status !== "APPROVED") {
    throw new Error(
      `Vehicle can only be assigned to an APPROVED booking. Current status: ${booking.status}`
    );
  }

  // ----------------------------------------------
  // 4. Find vehicle
  // ----------------------------------------------

  const vehicle =
    await Vehicle.findById(vehicleId);

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  // ----------------------------------------------
  // 5. Vehicle must be active
  // ----------------------------------------------

  if (!vehicle.isActive) {
    throw new Error(
      "Vehicle is not active"
    );
  }

  // ----------------------------------------------
  // 6. Capacity validation
  // ----------------------------------------------

  if (
    vehicle.capacity <
    booking.requiredCapacity
  ) {
    throw new Error(
      `Vehicle capacity is insufficient. Required: ${booking.requiredCapacity}, Available: ${vehicle.capacity}`
    );
  }

  // ----------------------------------------------
  // 7. Check vehicle time conflict
  // ----------------------------------------------

  const existingBookings =
    await Booking.find({
      vehicle: vehicleId,

      _id: {
        $ne: bookingId,
      },

      bookingDate: booking.bookingDate,

      status: {
        $in: [
          "APPROVED",
          "ASSIGNED",
        ],
      },
    });

  // ----------------------------------------------
  // 8. Check time overlap
  // ----------------------------------------------

  const hasOverlap =
    existingBookings.some(
      (existingBooking) => {
        return (
          booking.startTime <
            existingBooking.endTime &&
          booking.endTime >
            existingBooking.startTime
        );
      }
    );

  if (hasOverlap) {
    throw new Error(
      "Vehicle is already assigned to another booking during this time"
    );
  }

  // ----------------------------------------------
  // 9. Assign vehicle
  // ----------------------------------------------

  booking.vehicle = vehicleId;

  // ----------------------------------------------
  // 10. Change status
  // ----------------------------------------------

  booking.status = "ASSIGNED";

  return await booking.save();
};

// ======================================================
// Admin: Complete Booking
// ======================================================

const completeBooking = async (
  bookingId
) => {
  const booking =
    await Booking.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status !== "ASSIGNED") {
    throw new Error(
      `Booking cannot be completed because its current status is ${booking.status}`
    );
  }

  booking.status = "COMPLETED";

  return await booking.save();
};

// ======================================================
// Export Services
// ======================================================

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