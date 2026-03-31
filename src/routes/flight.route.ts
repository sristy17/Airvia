import express from "express";
import { createFlightController, updateFlightController, deleteFlightController } from "../controllers/flight.controller.js";

const router = express.Router();

router.post("/flights", createFlightController);
router.put("/flights/:id", updateFlightController);
router.delete("/flights/:id", deleteFlightController);

export default router;