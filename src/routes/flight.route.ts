import express from "express";
import {
  createFlightController,
  updateFlightController,
  deleteFlightController,
  getFlightsController,
  getFlightByIdController,
} from "../controllers/flight.controller.js";

/**
 * Express router for flight-related endpoints
 *
 * Routes:
 * - POST   /flights       → Create a flight
 * - GET    /flights       → Get all flights
 * - GET    /flights/:id   → Get flight by ID
 * - PUT    /flights/:id   → Update flight
 * - DELETE /flights/:id   → Delete flight
 *
 * @type {import("express").Router}
 */

const router = express.Router();

/**
 * @route POST /flights
 * @desc Create a new flight
 */

router.post("/flights", createFlightController);

/**
 * @route GET /flights
 * @desc Fetch all flights
 */

router.get("/flights", getFlightsController);

/**
 * @route GET /flights/:id
 * @desc Fetch a flight by ID
 */

router.get("/flights/:id", getFlightByIdController);

/**
 * @route PUT /flights/:id
 * @desc Update a flight
 */

router.put("/flights/:id", updateFlightController);

/**
 * @route DELETE /flights/:id
 * @desc Delete a flight
 */

router.delete("/flights/:id", deleteFlightController);

export default router;