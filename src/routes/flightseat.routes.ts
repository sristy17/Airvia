import express from "express";
import { getAvailableSeatsController } from "../controllers/flightseat.controller.js";

const router = express.Router();

router.get("/flights/:flightId/seats", getAvailableSeatsController);

export default router;