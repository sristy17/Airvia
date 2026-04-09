import express from "express";
import { getAvailableSeatsController } from "../controllers/flightseat.controller.js";

/**
 * Express router for flight seat-related endpoints
 *
 * Routes:
 * - GET /flights/:flightId/seats → Get available seats for a flight
 *
 * @type {import("express").Router}
 */

const router = express.Router();

/**
 * @route GET /flights/:flightId/seats
 * @desc Fetch all available (unbooked and unlocked) seats for a given flight
 */

router.get("/flights/:flightId/seats", getAvailableSeatsController);

export default router;