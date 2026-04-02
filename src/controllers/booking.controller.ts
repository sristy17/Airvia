import { Request, Response } from "express";
import {
  createBookingService,
  getBookingsService,
  getBookingByIdService,
  updateBookingStatusService,
  deleteBookingService,
} from "../services/bookings/booking.service.js";

// CREATE
export const createBookingController = async (req: Request, res: Response) => {
  try {
    const booking = await createBookingService(req.body);
    res.status(201).json(booking);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL
export const getBookingsController = async (req: Request, res: Response) => {
  try {
    const bookings = await getBookingsService();
    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET BY ID
export const getBookingByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const booking = await getBookingByIdService(id);
    res.json(booking);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

// UPDATE STATUS
export const updateBookingStatusController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const booking = await updateBookingStatusService(id, req.body.status);

    res.json({
      message: "Booking updated",
      data: booking,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
export const deleteBookingController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const booking = await deleteBookingService(id);

    res.json({
      message: "Booking deleted",
      data: booking,
    });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};