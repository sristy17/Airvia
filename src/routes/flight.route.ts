import express from "express";
import { createFlightController } from "../controllers/flight.controller.js";
import { updateFlightController } from "../controllers/updateFlight.controller.js";

const router = express.Router();

router.post("/flights", createFlightController);
router.put("/flights/:id", updateFlightController);

export default router;