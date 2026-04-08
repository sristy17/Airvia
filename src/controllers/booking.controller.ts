import { Request, Response } from "express"; 
import {
  createBookingService,
  getBookingsService,
  getBookingByIdService,
  approveBookingService,
  rejectBookingService,
  cancelBookingService
} from "../services/bookings/booking.service.js";

export const createBookingController = async (req: Request, res: Response) => {
  try {
    const result = await createBookingService(req.body as any);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getBookingsController = async (req: Request, res: Response) => {
  try {
    const bookings = await getBookingsService();
    res.status(200).json(bookings);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getBookingByIdController = async (req: Request, res: Response) => {
  try {
    const booking = await getBookingByIdService(Number(req.params.id));
    res.status(200).json(booking);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const approveBookingController = async (req: Request, res: Response) => {
  try {
    const result = await approveBookingService(Number(req.params.id));
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const rejectBookingController = async (req: Request, res: Response) => {
  try {
    const result = await rejectBookingService(Number(req.params.id));
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const cancelBookingController = async (req: Request, res: Response) => {
  try {
    const result = await cancelBookingService(Number(req.params.id));
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};