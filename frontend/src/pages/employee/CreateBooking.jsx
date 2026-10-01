import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const CreateBooking = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
    requiredCapacity: "",
    purpose: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/bookings", {
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.dropLocation,
        bookingDate: formData.bookingDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        requiredCapacity: Number(formData.requiredCapacity),
        purpose: formData.purpose,
      });

      if (response.data.success) {
        setSuccess("Booking created successfully");

        setTimeout(() => {
          navigate("/employee/bookings");
        }, 800);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create booking"
      );
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="create-booking-page">
      <h1>Create Booking</h1>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Pickup Location</label>
          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Drop Location</label>
          <input
            type="text"
            name="dropLocation"
            value={formData.dropLocation}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Booking Date</label>
          <input
            type="date"
            name="bookingDate"
            value={formData.bookingDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>End Time</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Required Capacity</label>
          <input
            type="number"
            name="requiredCapacity"
            min="1"
            value={formData.requiredCapacity}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Purpose</label>
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Booking"}
        </button>
      </form>
    </div>
  );
};

export default CreateBooking;