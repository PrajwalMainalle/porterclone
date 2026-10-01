import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // Fetch Dashboard Data
  // ======================================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [bookingsResponse, vehiclesResponse] =
  await Promise.all([
    api.get("/bookings"),
    api.get("/vehicles/admin"),
  ]);

      setBookings(bookingsResponse.data.data);
      setVehicles(vehiclesResponse.data.data);
    } catch (error) {
      console.error("Dashboard error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // Statistics
  // ======================================================

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "PENDING"
  ).length;

  const approvedBookings = bookings.filter(
    (booking) => booking.status === "APPROVED"
  ).length;

  const assignedBookings = bookings.filter(
    (booking) => booking.status === "ASSIGNED"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "COMPLETED"
  ).length;

  const rejectedBookings = bookings.filter(
    (booking) => booking.status === "REJECTED"
  ).length;

  // ======================================================
  // Logout
  // ======================================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ======================================================
  // Loading
  // ======================================================

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* ==================================================
          Sidebar
      ================================================== */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          <h2>Porter Clone</h2>
          <p>Admin Panel</p>
        </div>

        <nav className="sidebar-nav">

          <button
            className="nav-item active"
            onClick={() => navigate("/admin")}
          >
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/admin/bookings")}
          >
            Bookings
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/admin/vehicles")}
          >
            Vehicles
          </button>

        </nav>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>

      {/* ==================================================
          Main Content
      ================================================== */}

      <main className="dashboard-main">

        {/* Header */}

        <header className="dashboard-header">

          <div>
            <h1>Admin Dashboard</h1>

            <p>
              Welcome back, {user?.name || "Admin"}
            </p>
          </div>

          <div className="admin-info">
            <strong>
              {user?.name}
            </strong>

            <span>
              {user?.role}
            </span>
          </div>

        </header>

        {/* Error */}

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {/* ==================================================
            Statistics
        ================================================== */}

        <section className="stats-grid">

          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p>{totalBookings}</p>
          </div>

          <div className="stat-card">
            <h3>Pending</h3>
            <p>{pendingBookings}</p>
          </div>

          <div className="stat-card">
            <h3>Approved</h3>
            <p>{approvedBookings}</p>
          </div>

          <div className="stat-card">
            <h3>Assigned</h3>
            <p>{assignedBookings}</p>
          </div>

          <div className="stat-card">
            <h3>Completed</h3>
            <p>{completedBookings}</p>
          </div>

          <div className="stat-card">
            <h3>Rejected</h3>
            <p>{rejectedBookings}</p>
          </div>

        </section>

        {/* ==================================================
            Quick Actions
        ================================================== */}

        <section className="quick-actions">

          <h2>Quick Actions</h2>

          <div className="action-grid">

            <button
              onClick={() =>
                navigate("/admin/bookings")
              }
            >
              Manage Bookings
            </button>

            <button
              onClick={() =>
                navigate("/admin/vehicles")
              }
            >
              Manage Vehicles
            </button>

          </div>

        </section>

        {/* ==================================================
            Recent Bookings
        ================================================== */}

        <section className="recent-section">

          <div className="section-header">

            <h2>Recent Bookings</h2>

            <button
              onClick={() =>
                navigate("/admin/bookings")
              }
            >
              View All
            </button>

          </div>

          {bookings.length === 0 ? (
            <div className="empty-state">
              No bookings found.
            </div>
          ) : (
            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Pickup</th>
                    <th>Drop</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {bookings
                    .slice(0, 5)
                    .map((booking) => (

                      <tr key={booking._id}>

                        <td>
                          {booking.user?.name ||
                            "Unknown"}
                        </td>

                        <td>
                          {booking.pickupLocation}
                        </td>

                        <td>
                          {booking.dropLocation}
                        </td>

                        <td>
                          {new Date(
                            booking.bookingDate
                          ).toLocaleDateString()}
                        </td>

                        <td>
                          {booking.startTime} -{" "}
                          {booking.endTime}
                        </td>

                        <td>
                          <span
                            className={`status ${booking.status.toLowerCase()}`}
                          >
                            {booking.status}
                          </span>
                        </td>

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* ==================================================
            Vehicles
        ================================================== */}

        <section className="recent-section">

          <div className="section-header">

            <h2>Active Vehicles</h2>

            <button
              onClick={() =>
                navigate("/admin/vehicles")
              }
            >
              Manage Vehicles
            </button>

          </div>

          <div className="vehicle-summary">

            <h3>
              {vehicles.length}
            </h3>

            <p>
              Active vehicles available
            </p>

          </div>

        </section>

      </main>

    </div>
  );
};

export default AdminDashboard;