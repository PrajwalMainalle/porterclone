import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/bookings/${bookingId}`
      );

      setBooking(response.data?.data || null);
    } catch (error) {
      console.error(
        "Fetch booking error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load booking"
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelLoading(true);
      setError("");
      setSuccess("");

      await api.patch(
        `/bookings/${bookingId}/cancel`,
        {}
      );

      setSuccess(
        "Booking cancelled successfully."
      );

      await fetchBooking();
    } catch (error) {
      console.error(
        "Cancel booking error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to cancel booking"
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div className="page-loading">
        Loading booking...
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="booking-details-page">
        <div className="error-box">
          {error}
        </div>

        <button
          className="secondary-button"
          onClick={() =>
            navigate("/employee/bookings")
          }
        >
          Back to My Bookings
        </button>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="booking-details-page">
        <div className="empty-state">
          Booking not found.
        </div>

        <button
          className="secondary-button"
          onClick={() =>
            navigate("/employee/bookings")
          }
        >
          Back to My Bookings
        </button>
      </div>
    );
  }

  const canCancel = ![
    "CANCELLED",
    "COMPLETED",
    "REJECTED",
  ].includes(booking.status);

  return (
    <div className="booking-details-page">

      {/* Header */}

      <div className="booking-details-header">

        <div>
          <h1>Booking Details</h1>

          <p>
            View complete information about
            your vehicle booking.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={() =>
            navigate("/employee/bookings")
          }
        >
          ← Back to My Bookings
        </button>

      </div>

      {/* Messages */}

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {success && (
        <div className="success-box">
          {success}
        </div>
      )}

      {/* Booking Card */}

      <div className="booking-details-card">

        {/* Booking Header */}

        <div className="booking-card-header">

          <div>
            <span className="booking-label">
              Booking ID
            </span>

            <h2>
              {booking._id}
            </h2>
          </div>

          <span
            className={`status ${booking.status.toLowerCase()}`}
          >
            {booking.status}
          </span>

        </div>

        {/* Route */}

        <div className="details-section">

          <h3>Trip Information</h3>

          <div className="details-grid">

            <div className="detail-item">
              <span>Pickup Location</span>

              <strong>
                {booking.pickupLocation}
              </strong>
            </div>

            <div className="detail-item">
              <span>Drop Location</span>

              <strong>
                {booking.dropLocation}
              </strong>
            </div>

          </div>

        </div>

        {/* Schedule */}

        <div className="details-section">

          <h3>Schedule</h3>

          <div className="details-grid">

            <div className="detail-item">
              <span>Booking Date</span>

              <strong>
                {formatDate(
                  booking.bookingDate
                )}
              </strong>
            </div>

            <div className="detail-item">
              <span>Start Time</span>

              <strong>
                {booking.startTime}
              </strong>
            </div>

            <div className="detail-item">
              <span>End Time</span>

              <strong>
                {booking.endTime}
              </strong>
            </div>

          </div>

        </div>

        {/* Booking Information */}

        <div className="details-section">

          <h3>Booking Information</h3>

          <div className="details-grid">

            <div className="detail-item">
              <span>Required Capacity</span>

              <strong>
                {booking.requiredCapacity}
                {" "}
                passengers
              </strong>
            </div>

            <div className="detail-item">
              <span>Purpose</span>

              <strong>
                {booking.purpose}
              </strong>
            </div>

          </div>

        </div>

        {/* Vehicle */}

        <div className="details-section">

          <h3>Vehicle Information</h3>

          {booking.vehicle ? (
            <div className="vehicle-details">

              <div className="detail-item">
                <span>Vehicle Number</span>

                <strong>
                  {booking.vehicle.vehicleNumber}
                </strong>
              </div>

              <div className="detail-item">
                <span>Vehicle Type</span>

                <strong>
                  {booking.vehicle.vehicleType ||
                    "-"}
                </strong>
              </div>

              {booking.vehicle.model && (
                <div className="detail-item">
                  <span>Model</span>

                  <strong>
                    {booking.vehicle.model}
                  </strong>
                </div>
              )}

              {booking.vehicle.capacity && (
                <div className="detail-item">
                  <span>Capacity</span>

                  <strong>
                    {booking.vehicle.capacity}
                  </strong>
                </div>
              )}

            </div>
          ) : (
            <div className="not-assigned">
              Vehicle has not been assigned yet.
            </div>
          )}

        </div>

        {/* Rejection Reason */}

        {booking.rejectionReason && (
          <div className="reason-box rejection-reason">

            <h3>Rejection Reason</h3>

            <p>
              {booking.rejectionReason}
            </p>

          </div>
        )}

        {/* Cancellation Reason */}

        {booking.cancellationReason && (
          <div className="reason-box cancellation-reason">

            <h3>Cancellation Reason</h3>

            <p>
              {booking.cancellationReason}
            </p>

          </div>
        )}

        {/* Actions */}

        <div className="booking-details-actions">

          {canCancel && (
            <button
              className="danger-button"
              disabled={cancelLoading}
              onClick={cancelBooking}
            >
              {cancelLoading
                ? "Cancelling..."
                : "Cancel Booking"}
            </button>
          )}

          <button
            className="secondary-button"
            onClick={() =>
              navigate("/employee/bookings")
            }
          >
            Back to My Bookings
          </button>

        </div>

      </div>

    </div>
  );
};

export default BookingDetails;