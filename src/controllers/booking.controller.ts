import { Request, Response } from "express";
import {
  createBookingService,
  getBookingByIdService,
  getAllBookingsService,
  updateBookingService,
  deleteBookingService,
} from "../services/bookings/booking.service.js";

export const createBookingController = async (req: Request, res: Response) => {
  try {
    const booking = await createBookingService(req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getBookingByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const booking = await getBookingByIdService(Number(req.params.id));
    res.json({ success: true, data: booking });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getAllBookingsController = async (
  req: Request,
  res: Response
) => {
  try {
    const bookings = await getAllBookingsService();
    res.json({ success: true, data: bookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingController = async (
  req: Request,
  res: Response
) => {
  try {
    const booking = await updateBookingService(
      Number(req.params.id),
      req.body
    );
    res.json({ success: true, data: booking });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteBookingController = async (
  req: Request,
  res: Response
) => {
  try {
    const booking = await deleteBookingService(Number(req.params.id));
    res.json({ success: true, data: booking });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};