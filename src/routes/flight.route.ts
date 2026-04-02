import express from "express";
import {
  createFlightController,
  updateFlightController,
  deleteFlightController,
  getFlightsController,
  getFlightByIdController,
} from "../controllers/flight.controller.js";

const router = express.Router();

router.post("/flights", createFlightController);
router.get("/flights", getFlightsController);
router.get("/flights/:id", getFlightByIdController);
router.put("/flights/:id", updateFlightController);
router.delete("/flights/:id", deleteFlightController);

export default router;