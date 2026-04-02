import express from "express";
import {
  createBookingController,
  getBookingByIdController,
  getAllBookingsController,
  updateBookingController,
  deleteBookingController,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/booking", createBookingController);
router.get("/booking", getAllBookingsController);
router.get("/booking/:id", getBookingByIdController);
router.put("/booking/:id", updateBookingController);
router.delete("/booking/:id", deleteBookingController);

export default router;