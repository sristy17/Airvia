import express from "express";
import {
  createBookingController,
  getBookingsController,
  getBookingByIdController,
  approveBookingController,
  rejectBookingController,
  cancelBookingController
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/bookings", createBookingController);
router.get("/bookings", getBookingsController);
router.get("/bookings/:id", getBookingByIdController);
router.patch("/bookings/:id/approve", approveBookingController);
router.patch("/bookings/:id/reject", rejectBookingController);
router.patch("/bookings/:id/cancel", cancelBookingController);

export default router;