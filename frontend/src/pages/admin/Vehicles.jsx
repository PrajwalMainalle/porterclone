import { useEffect, useState } from "react";
import api from "../../services/api";

const initialForm = {
  vehicleNumber: "",
  vehicleType: "",
  model: "",
  capacity: "",
};

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] =
    useState(initialForm);

  const [editingVehicle, setEditingVehicle] =
    useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/vehicles/admin");

      setVehicles(
        Array.isArray(response.data.data)
          ? response.data.data
          : []
      );
    } catch (error) {
      console.error(
        "Fetch vehicles error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load vehicles"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const openAddForm = () => {
    setEditingVehicle(null);
    setFormData(initialForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (vehicle) => {
    setEditingVehicle(vehicle);

    setFormData({
      vehicleNumber:
        vehicle.vehicleNumber || "",
      vehicleType:
        vehicle.vehicleType || "",
      model:
        vehicle.model || "",
      capacity:
        vehicle.capacity || "",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingVehicle(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingVehicle) {
        const response =
          await api.put(
            `/vehicles/${editingVehicle._id}`,
            formData
          );

        setVehicles((previousVehicles) =>
          previousVehicles.map((vehicle) =>
            vehicle._id ===
            editingVehicle._id
              ? response.data.data
              : vehicle
          )
        );

        setSuccess(
          "Vehicle updated successfully."
        );
      } else {
        const response =
          await api.post(
            "/vehicles",
            formData
          );

        setVehicles((previousVehicles) => [
          response.data.data,
          ...previousVehicles,
        ]);

        setSuccess(
          "Vehicle added successfully."
        );
      }

      closeForm();
    } catch (error) {
      console.error(
        "Save vehicle error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save vehicle"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (
    vehicle
  ) => {
    try {
      setError("");
      setSuccess("");

      const response =
        await api.patch(
          `/vehicles/${vehicle._id}/status`,
          {
            isActive: !vehicle.isActive,
          }
        );

      setVehicles((previousVehicles) =>
        previousVehicles.map(
          (currentVehicle) =>
            currentVehicle._id ===
            vehicle._id
              ? response.data.data
              : currentVehicle
        )
      );

      setSuccess(
        response.data.message ||
          "Vehicle status updated successfully."
      );
    } catch (error) {
      console.error(
        "Update vehicle status error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update vehicle status"
      );
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        Loading vehicles...
      </div>
    );
  }

  return (
    <div className="vehicles-page">
      <div className="page-header">
        <div>
          <h1>Vehicles</h1>

          <p>
            Manage company vehicles
          </p>
        </div>

        <div>
          <button
            onClick={openAddForm}
          >
            Add Vehicle
          </button>

          <button
            onClick={fetchVehicles}
          >
            Refresh
          </button>
        </div>
      </div>

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

      {showForm && (
        <section className="vehicle-form-section">
          <h2>
            {editingVehicle
              ? "Edit Vehicle"
              : "Add Vehicle"}
          </h2>

          <form
            onSubmit={handleSubmit}
          >
            <div>
              <label>
                Vehicle Number
              </label>

              <input
                type="text"
                name="vehicleNumber"
                value={
                  formData.vehicleNumber
                }
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>
                Vehicle Type
              </label>

              <input
                type="text"
                name="vehicleType"
                value={
                  formData.vehicleType
                }
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>
                Model
              </label>

              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>
                Capacity
              </label>

              <input
                type="number"
                name="capacity"
                min="1"
                value={
                  formData.capacity
                }
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingVehicle
                  ? "Update Vehicle"
                  : "Add Vehicle"}
              </button>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="vehicles-list-section">
        <h2>
          All Vehicles
        </h2>

        {vehicles.length === 0 ? (
          <p>
            No vehicles found.
          </p>
        ) : (
          <div className="vehicles-table-container">
            <table>
              <thead>
                <tr>
                  <th>
                    Vehicle Number
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Model
                  </th>

                  <th>
                    Capacity
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {vehicles.map(
                  (vehicle) => (
                    <tr
                      key={
                        vehicle._id
                      }
                    >
                      <td>
                        {
                          vehicle.vehicleNumber
                        }
                      </td>

                      <td>
                        {
                          vehicle.vehicleType
                        }
                      </td>

                      <td>
                        {vehicle.model}
                      </td>

                      <td>
                        {
                          vehicle.capacity
                        }
                      </td>

                      <td>
                        {vehicle.isActive
                          ? "ACTIVE"
                          : "INACTIVE"}
                      </td>

                      <td>
                        <button
                          onClick={() =>
                            openEditForm(
                              vehicle
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleStatusChange(
                              vehicle
                            )
                          }
                        >
                          {vehicle.isActive
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Vehicles;