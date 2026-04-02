import express from "express";
import {
  createBookingController,
  getBookingsController,
  getBookingByIdController,
  updateBookingStatusController,
  deleteBookingController,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/bookings", createBookingController);
router.get("/bookings", getBookingsController);
router.get("/bookings/:id", getBookingByIdController);
router.put("/bookings/:id/status", updateBookingStatusController);
router.delete("/bookings/:id", deleteBookingController);

export default router;