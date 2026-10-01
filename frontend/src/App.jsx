import { Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";

import Bookings from "./pages/admin/Bookings";
import Vehicles from "./pages/admin/Vehicles";

import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import CreateBooking from "./pages/employee/CreateBooking";
import MyBookings from "./pages/employee/MyBookings";
import BookingDetails from "./pages/employee/BookingDetails";

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      <Route
        path="/admin/bookings"
        element={<Bookings />}
      />

      <Route
        path="/admin/vehicles"
        element={<Vehicles />}
      />

      <Route
        path="/employee"
        element={<EmployeeDashboard />}
      />

      <Route
        path="/employee/create-booking"
        element={<CreateBooking />}
      />

      <Route
        path="/employee/bookings"
        element={<MyBookings />}
      />

      <Route
        path="/employee/bookings/:bookingId"
        element={<BookingDetails />}
      />
    </Routes>
  );
};

export default App;