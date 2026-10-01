import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const MyBooking = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setError("");

      const response = await api.get("/bookings/my");

      const bookingData = response.data?.data;

      setBookings(
        Array.isArray(bookingData)
          ? bookingData
          : []
      );
    } catch (error) {
      console.error(
        "Fetch bookings error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load bookings"
      );

      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelLoading(id);
      setError("");
      setSuccess("");

      await api.patch(
        `/bookings/${id}/cancel`,
        {}
      );

      setSuccess(
        "Booking cancelled successfully."
      );

      await fetchBookings();
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
      setCancelLoading(null);
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
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="my-bookings-page">

      {/* Header */}

      <div className="my-bookings-header">

        <div>
          <h1>My Bookings</h1>

          <p>
            View and manage your vehicle
            bookings.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            navigate(
              "/employee/create-booking"
            )
          }
        >
          + Create Booking
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

      {/* Booking Count */}

      <div className="booking-summary">

        <span>
          Total Bookings
        </span>

        <strong>
          {bookings.length}
        </strong>

      </div>

      {/* Empty State */}

      {bookings.length === 0 ? (

        <div className="empty-state">

          <h2>No bookings found</h2>

          <p>
            You haven't created any vehicle
            bookings yet.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              navigate(
                "/employee/create-booking"
              )
            }
          >
            Create Your First Booking
          </button>

        </div>

      ) : (

        <div className="bookings-list">

          {bookings.map((booking) => (

            <div
              className="booking-card"
              key={booking._id}
            >

              {/* Card Header */}

              <div className="booking-card-header">

                <div>
                  <span className="booking-label">
                    Booking ID
                  </span>

                  <h3>
                    {booking._id}
                  </h3>
                </div>

                <span
                  className={`status ${booking.status.toLowerCase()}`}
                >
                  {booking.status}
                </span>

              </div>

              {/* Route */}

              <div className="booking-route">

                <div className="route-item">

                  <span className="route-label">
                    Pickup
                  </span>

                  <strong>
                    {booking.pickupLocation}
                  </strong>

                </div>

                <div className="route-arrow">
                  →
                </div>

                <div className="route-item">

                  <span className="route-label">
                    Drop
                  </span>

                  <strong>
                    {booking.dropLocation}
                  </strong>

                </div>

              </div>

              {/* Booking Information */}

              <div className="booking-info-grid">

                <div className="booking-info-item">

                  <span>
                    Date
                  </span>

                  <strong>
                    {formatDate(
                      booking.bookingDate
                    )}
                  </strong>

                </div>

                <div className="booking-info-item">

                  <span>
                    Time
                  </span>

                  <strong>
                    {booking.startTime} -{" "}
                    {booking.endTime}
                  </strong>

                </div>

                <div className="booking-info-item">

                  <span>
                    Capacity
                  </span>

                  <strong>
                    {booking.requiredCapacity}
                    {" "}
                    passengers
                  </strong>

                </div>

                <div className="booking-info-item">

                  <span>
                    Vehicle
                  </span>

                  <strong>
                    {booking.vehicle
                      ? booking.vehicle
                          .vehicleNumber
                      : "Not assigned"}
                  </strong>

                </div>

              </div>

              {/* Purpose */}

              <div className="booking-purpose">

                <span>
                  Purpose
                </span>

                <p>
                  {booking.purpose}
                </p>

              </div>

              {/* Actions */}

              <div className="booking-card-actions">

                <button
                  className="secondary-button"
                  onClick={() =>
                    navigate(
                      `/employee/bookings/${booking._id}`
                    )
                  }
                >
                  View Details
                </button>

                {![
                  "CANCELLED",
                  "COMPLETED",
                  "REJECTED",
                ].includes(
                  booking.status
                ) && (

                  <button
                    className="danger-button"
                    disabled={
                      cancelLoading ===
                      booking._id
                    }
                    onClick={() =>
                      cancelBooking(
                        booking._id
                      )
                    }
                  >
                    {cancelLoading ===
                    booking._id
                      ? "Cancelling..."
                      : "Cancel Booking"}
                  </button>

                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default MyBooking;