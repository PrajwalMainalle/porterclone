import { useEffect, useState } from "react";
import api from "../../services/api";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");

  // ======================================================
  // Fetch Bookings
  // ======================================================

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings");

      setBookings(response.data.data || []);
    } catch (error) {
      console.error("Fetch bookings error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to fetch bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // Fetch Vehicles
  // ======================================================

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/vehicles");

      setVehicles(response.data.data || []);
    } catch (error) {
      console.error("Fetch vehicles error:", error);
    }
  };

  // ======================================================
  // Initial Load
  // ======================================================

  useEffect(() => {
    fetchBookings();
    fetchVehicles();
  }, []);

  // ======================================================
  // Approve Booking
  // ======================================================

  const handleApprove = async (bookingId) => {
    try {
      setActionLoading(true);
      setError("");

      await api.patch(
        `/bookings/${bookingId}/approve`
      );

      await fetchBookings();
    } catch (error) {
      console.error("Approve booking error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to approve booking"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ======================================================
  // Open Reject Modal
  // ======================================================

  const openRejectModal = (booking) => {
    setSelectedBooking(booking);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  // ======================================================
  // Reject Booking
  // ======================================================

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError("Rejection reason is required");
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await api.patch(
        `/bookings/${selectedBooking._id}/reject`,
        {
          rejectionReason: rejectionReason.trim(),
        }
      );

      setShowRejectModal(false);
      setSelectedBooking(null);
      setRejectionReason("");

      await fetchBookings();
    } catch (error) {
      console.error("Reject booking error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to reject booking"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ======================================================
  // Open Vehicle Modal
  // ======================================================

  const openVehicleModal = (booking) => {
    setSelectedBooking(booking);
    setSelectedVehicle("");
    setShowVehicleModal(true);
  };

  // ======================================================
  // Assign Vehicle
  // ======================================================

  const handleAssignVehicle = async () => {
    if (!selectedVehicle) {
      setError("Please select a vehicle");
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await api.patch(
        `/bookings/${selectedBooking._id}/assign-vehicle`,
        {
          vehicleId: selectedVehicle,
        }
      );

      setShowVehicleModal(false);
      setSelectedBooking(null);
      setSelectedVehicle("");

      await fetchBookings();
    } catch (error) {
      console.error(
        "Assign vehicle error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to assign vehicle"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ======================================================
  // Complete Booking
  // ======================================================

  const handleComplete = async (bookingId) => {
    try {
      setActionLoading(true);
      setError("");

      await api.patch(
        `/bookings/${bookingId}/complete`
      );

      await fetchBookings();
    } catch (error) {
      console.error(
        "Complete booking error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to complete booking"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ======================================================
  // Format Date
  // ======================================================

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ======================================================
  // Loading
  // ======================================================

  if (loading) {
    return (
      <div className="page-loading">
        Loading bookings...
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="bookings-page">

      {/* Header */}

      <div className="page-header">

        <div>
          <h1>Booking Management</h1>

          <p>
            Manage employee vehicle bookings
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={() => {
            fetchBookings();
            fetchVehicles();
          }}
        >
          Refresh
        </button>

      </div>

      {/* Error */}

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {/* Booking Count */}

      <div className="booking-count">
        Total Bookings: <strong>{bookings.length}</strong>
      </div>

      {/* ==================================================
          Booking Table
      ================================================== */}

      <div className="table-container">

        {bookings.length === 0 ? (
          <div className="empty-state">
            No bookings found.
          </div>
        ) : (

          <table>

            <thead>

              <tr>
                <th>Employee</th>
                <th>Route</th>
                <th>Date</th>
                <th>Time</th>
                <th>Capacity</th>
                <th>Purpose</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {bookings.map((booking) => (

                <tr key={booking._id}>

                  {/* Employee */}

                  <td>
                    <strong>
                      {booking.user?.name ||
                        "Unknown"}
                    </strong>

                    <small>
                      {booking.user?.email}
                    </small>

                    <small>
                      {booking.user?.phone}
                    </small>
                  </td>

                  {/* Route */}

                  <td>
                    <div>
                      <strong>From:</strong>{" "}
                      {booking.pickupLocation}
                    </div>

                    <div>
                      <strong>To:</strong>{" "}
                      {booking.dropLocation}
                    </div>
                  </td>

                  {/* Date */}

                  <td>
                    {formatDate(
                      booking.bookingDate
                    )}
                  </td>

                  {/* Time */}

                  <td>
                    {booking.startTime}
                    {" - "}
                    {booking.endTime}
                  </td>

                  {/* Capacity */}

                  <td>
                    {booking.requiredCapacity}
                  </td>

                  {/* Purpose */}

                  <td>
                    {booking.purpose}
                  </td>

                  {/* Vehicle */}

                  <td>

                    {booking.vehicle ? (
                      <div>
                        <strong>
                          {
                            booking.vehicle
                              .vehicleNumber
                          }
                        </strong>

                        <small>
                          {
                            booking.vehicle
                              .vehicleType
                          }
                        </small>
                      </div>
                    ) : (
                      "Not assigned"
                    )}

                  </td>

                  {/* Status */}

                  <td>

                    <span
                      className={`status ${booking.status.toLowerCase()}`}
                    >
                      {booking.status}
                    </span>

                  </td>

                  {/* Actions */}

                  <td>

                    <div className="action-buttons">

                      {/* Pending */}

                      {booking.status ===
                        "PENDING" && (
                        <>
                          <button
                            className="approve-button"
                            disabled={
                              actionLoading
                            }
                            onClick={() =>
                              handleApprove(
                                booking._id
                              )
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="reject-button"
                            disabled={
                              actionLoading
                            }
                            onClick={() =>
                              openRejectModal(
                                booking
                              )
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* Approved */}

                      {booking.status ===
                        "APPROVED" && (
                        <button
                          className="assign-button"
                          disabled={
                            actionLoading
                          }
                          onClick={() =>
                            openVehicleModal(
                              booking
                            )
                          }
                        >
                          Assign Vehicle
                        </button>
                      )}

                      {/* Assigned */}

                      {booking.status ===
                        "ASSIGNED" && (
                        <button
                          className="complete-button"
                          disabled={
                            actionLoading
                          }
                          onClick={() =>
                            handleComplete(
                              booking._id
                            )
                          }
                        >
                          Complete
                        </button>
                      )}

                      {/* Final statuses */}

                      {[
                        "COMPLETED",
                        "REJECTED",
                        "CANCELLED",
                      ].includes(
                        booking.status
                      ) && (
                        <span className="no-action">
                          No actions
                        </span>
                      )}

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

      {/* ==================================================
          Reject Modal
      ================================================== */}

      {showRejectModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>
              Reject Booking
            </h2>

            <p>
              Please provide a reason for
              rejecting this booking.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) =>
                setRejectionReason(
                  e.target.value
                )
              }
              placeholder="Enter rejection reason"
              rows="4"
            />

            <div className="modal-actions">

              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedBooking(null);
                }}
              >
                Cancel
              </button>

              <button
                className="reject-button"
                disabled={actionLoading}
                onClick={handleReject}
              >
                {actionLoading
                  ? "Rejecting..."
                  : "Reject Booking"}
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ==================================================
          Vehicle Modal
      ================================================== */}

      {showVehicleModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>
              Assign Vehicle
            </h2>

            <p>
              Select a vehicle for this booking.
            </p>

            <select
              value={selectedVehicle}
              onChange={(e) =>
                setSelectedVehicle(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Vehicle
              </option>

              {vehicles.map((vehicle) => (

                <option
                  key={vehicle._id}
                  value={vehicle._id}
                >
                  {vehicle.vehicleNumber} -{" "}
                  {vehicle.vehicleType} -{" "}
                  Capacity: {vehicle.capacity}
                </option>

              ))}

            </select>

            <div className="modal-actions">

              <button
                onClick={() => {
                  setShowVehicleModal(false);
                  setSelectedBooking(null);
                }}
              >
                Cancel
              </button>

              <button
                className="assign-button"
                disabled={actionLoading}
                onClick={handleAssignVehicle}
              >
                {actionLoading
                  ? "Assigning..."
                  : "Assign Vehicle"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Bookings;