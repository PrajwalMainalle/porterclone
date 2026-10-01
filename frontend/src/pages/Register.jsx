import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((previousUser) => ({
      ...previousUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", user);

      if (response.data?.success) {
        setSuccess(
          response.data.message ||
            "Registration successful. Please login."
        );

        setUser({
          name: "",
          email: "",
          phone: "",
          password: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setSuccess(
          response.data?.message ||
            "Registration successful. Please login."
        );

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>Porter Clone</h1>

        <h2>Register</h2>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {success && (
          <p className="success-message">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <div>
            <label>Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={user.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Phone</label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={user.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={user.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <p className="auth-footer">
          Already have an account?{" "}

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
};

export default Register;