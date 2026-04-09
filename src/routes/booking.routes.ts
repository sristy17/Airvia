import express from "express";
import {
  createBookingController,
  getBookingsController,
  getBookingByIdController,
  approveBookingController,
  rejectBookingController,
  cancelBookingController
} from "../controllers/booking.controller.js";

/**
 * Express router for booking-related endpoints
 *
 * Routes:
 * - POST   /bookings             → Create a booking
 * - GET    /bookings             → Get all bookings
 * - GET    /bookings/:id         → Get booking by ID
 * - PATCH  /bookings/:id/approve → Approve booking
 * - PATCH  /bookings/:id/reject  → Reject booking
 * - PATCH  /bookings/:id/cancel  → Cancel booking
 *
 * @type {import("express").Router}
 */

const router = express.Router();

/**
 * @route POST /bookings
 * @desc Create a new booking
 */

router.post("/bookings", createBookingController);

/**
 * @route GET /bookings
 * @desc Fetch all bookings
 */

router.get("/bookings", getBookingsController);

/**
 * @route GET /bookings/:id
 * @desc Fetch booking by ID
 */

router.get("/bookings/:id", getBookingByIdController);

/**
 * @route PATCH /bookings/:id/approve
 * @desc Approve a booking
 */

router.patch("/bookings/:id/approve", approveBookingController);

/**
 * @route PATCH /bookings/:id/reject
 * @desc Reject a booking
 */

router.patch("/bookings/:id/reject", rejectBookingController);

/**
 * @route PATCH /bookings/:id/cancel
 * @desc Cancel a booking
 */

router.patch("/bookings/:id/cancel", cancelBookingController);

export default router;