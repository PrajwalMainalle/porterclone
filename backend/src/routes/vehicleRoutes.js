const express = require("express");

const {
  createVehicle,
  getActiveVehicles,
  getAllVehicles,
  updateVehicle,
  updateVehicleStatus,
} = require("../controllers/vehicleController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getActiveVehicles
);

router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllVehicles
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createVehicle
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateVehicle
);

router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateVehicleStatus
);

module.exports = router;