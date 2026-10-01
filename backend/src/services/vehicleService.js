const Vehicle = require("../models/Vehicle");

const validateVehicleData = ({
  vehicleNumber,
  vehicleType,
  model,
  capacity,
}) => {
  if (!vehicleNumber || !vehicleNumber.trim()) {
    throw new Error("Vehicle number is required");
  }

  if (!vehicleType || !vehicleType.trim()) {
    throw new Error("Vehicle type is required");
  }

  if (!model || !model.trim()) {
    throw new Error("Vehicle model is required");
  }

  if (
    capacity === undefined ||
    capacity === null ||
    capacity === ""
  ) {
    throw new Error("Capacity is required");
  }

  const numericCapacity = Number(capacity);

  if (!Number.isFinite(numericCapacity)) {
    throw new Error("Capacity must be a valid number");
  }

  if (numericCapacity < 1) {
    throw new Error("Capacity must be greater than 0");
  }
};

const createVehicle = async (vehicleData) => {
  validateVehicleData(vehicleData);

  const {
    vehicleNumber,
    vehicleType,
    model,
    capacity,
  } = vehicleData;

  const formattedVehicleNumber =
    vehicleNumber.trim().toUpperCase();

  const existingVehicle = await Vehicle.findOne({
    vehicleNumber: formattedVehicleNumber,
  });

  if (existingVehicle) {
    throw new Error("Vehicle number already exists");
  }

  const vehicle = await Vehicle.create({
    vehicleNumber: formattedVehicleNumber,
    vehicleType: vehicleType.trim(),
    model: model.trim(),
    capacity: Number(capacity),
  });

  return vehicle;
};

const getActiveVehicles = async () => {
  return await Vehicle.find({
    isActive: true,
  }).sort({
    createdAt: -1,
  });
};

const getAllVehicles = async () => {
  return await Vehicle.find().sort({
    createdAt: -1,
  });
};

const updateVehicle = async (
  vehicleId,
  vehicleData
) => {
  const vehicle = await Vehicle.findById(vehicleId);

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  const {
    vehicleNumber,
    vehicleType,
    model,
    capacity,
  } = vehicleData;

  if (vehicleNumber !== undefined) {
    if (!vehicleNumber.trim()) {
      throw new Error(
        "Vehicle number cannot be empty"
      );
    }

    const formattedVehicleNumber =
      vehicleNumber.trim().toUpperCase();

    const existingVehicle =
      await Vehicle.findOne({
        vehicleNumber: formattedVehicleNumber,
        _id: { $ne: vehicleId },
      });

    if (existingVehicle) {
      throw new Error(
        "Vehicle number already exists"
      );
    }

    vehicle.vehicleNumber =
      formattedVehicleNumber;
  }

  if (vehicleType !== undefined) {
    if (!vehicleType.trim()) {
      throw new Error(
        "Vehicle type cannot be empty"
      );
    }

    vehicle.vehicleType =
      vehicleType.trim();
  }

  if (model !== undefined) {
    if (!model.trim()) {
      throw new Error(
        "Vehicle model cannot be empty"
      );
    }

    vehicle.model = model.trim();
  }

  if (capacity !== undefined) {
    const numericCapacity =
      Number(capacity);

    if (!Number.isFinite(numericCapacity)) {
      throw new Error(
        "Capacity must be a valid number"
      );
    }

    if (numericCapacity < 1) {
      throw new Error(
        "Capacity must be greater than 0"
      );
    }

    vehicle.capacity = numericCapacity;
  }

  return await vehicle.save();
};

const updateVehicleStatus = async (
  vehicleId,
  isActive
) => {
  if (typeof isActive !== "boolean") {
    throw new Error(
      "isActive must be true or false"
    );
  }

  const vehicle =
    await Vehicle.findById(vehicleId);

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  vehicle.isActive = isActive;

  return await vehicle.save();
};

module.exports = {
  createVehicle,
  getActiveVehicles,
  getAllVehicles,
  updateVehicle,
  updateVehicleStatus,
};