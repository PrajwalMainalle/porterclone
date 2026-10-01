const vehicleService = require("../services/vehicleService");

const createVehicle = async (req, res) => {
  try {
    const vehicle =
      await vehicleService.createVehicle(
        req.body
      );

    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error) {
    console.error(
      "Create vehicle error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getActiveVehicles = async (
  req,
  res
) => {
  try {
    const vehicles =
      await vehicleService.getActiveVehicles();

    return res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (error) {
    console.error(
      "Get active vehicles error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
    });
  }
};

const getAllVehicles = async (
  req,
  res
) => {
  try {
    const vehicles =
      await vehicleService.getAllVehicles();

    return res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (error) {
    console.error(
      "Get all vehicles error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
    });
  }
};

const updateVehicle = async (
  req,
  res
) => {
  try {
    const vehicle =
      await vehicleService.updateVehicle(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: vehicle,
    });
  } catch (error) {
    console.error(
      "Update vehicle error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateVehicleStatus = async (
  req,
  res
) => {
  try {
    const vehicle =
      await vehicleService.updateVehicleStatus(
        req.params.id,
        req.body.isActive
      );

    return res.status(200).json({
      success: true,
      message:
        "Vehicle status updated successfully",
      data: vehicle,
    });
  } catch (error) {
    console.error(
      "Update vehicle status error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createVehicle,
  getActiveVehicles,
  getAllVehicles,
  updateVehicle,
  updateVehicleStatus,
};