import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="employee-dashboard-page">

      {/* Header */}
      <div className="employee-dashboard-header">
        <div>
          <h1>Employee Dashboard</h1>
          <p>Welcome back, Employee</p>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="employee-section">
        <div className="section-title">
          <h2>Quick Actions</h2>
          <p>Manage your vehicle bookings quickly.</p>
        </div>

        <div className="employee-action-grid">

          <button
            className="employee-action-card create"
            onClick={() =>
              navigate("/employee/create-booking")
            }
          >
            <div className="action-icon">+</div>

            <div>
              <h3>Create Booking</h3>
              <p>Request a vehicle for your trip</p>
            </div>
          </button>

          <button
            className="employee-action-card bookings"
            onClick={() =>
              navigate("/employee/bookings")
            }
          >
            <div className="action-icon">📋</div>

            <div>
              <h3>My Bookings</h3>
              <p>View and manage your bookings</p>
            </div>
          </button>

        </div>
      </section>

      {/* Booking Summary */}
      <section className="employee-section">

        <div className="section-title">
          <h2>Booking Summary</h2>
          <p>Your current booking overview.</p>
        </div>

        <div className="employee-stats-grid">

          <div className="employee-stat-card total">
            <div className="stat-card-top">
              <span>Total Bookings</span>
              <span className="stat-icon">📊</span>
            </div>

            <strong>5</strong>

            <p>All your bookings</p>
          </div>

          <div className="employee-stat-card pending">
            <div className="stat-card-top">
              <span>Pending</span>
              <span className="stat-icon">⏳</span>
            </div>

            <strong>1</strong>

            <p>Waiting for approval</p>
          </div>

          <div className="employee-stat-card approved">
            <div className="stat-card-top">
              <span>Approved</span>
              <span className="stat-icon">✓</span>
            </div>

            <strong>2</strong>

            <p>Approved bookings</p>
          </div>

          <div className="employee-stat-card completed">
            <div className="stat-card-top">
              <span>Completed</span>
              <span className="stat-icon">✓</span>
            </div>

            <strong>2</strong>

            <p>Completed trips</p>
          </div>

        </div>

      </section>

    </div>
  );
};

export default EmployeeDashboard;