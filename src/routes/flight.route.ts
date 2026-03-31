import express from "express";
import { createFlightController, updateFlightController } from "../controllers/flight.controller.js";

const router = express.Router();

router.post("/flights", createFlightController);
router.put("/flights/:id", updateFlightController);

export default router;