const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },

    dropLocation: {
      type: String,
      required: true,
      trim: true,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    requiredCapacity: {
      type: Number,
      required: true,
      min: 1,
    },

    purpose: {
      type: String,
      required: true,
      trim: true,
    },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "ASSIGNED",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "PENDING",
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },

    cancellationReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;