import { Request, Response } from "express"; 
import {
  createBookingService,
  getBookingsService,
  getBookingByIdService,
  approveBookingService,
  rejectBookingService,
  cancelBookingService
} from "../services/bookings/booking.service.js";

 /* Create a new booking
 *
 * @route POST /bookings
 * @param {Request} req - Express request object (expects booking data in body)
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */

export const createBookingController = async (req: Request, res: Response) => {
  try {
    const result = await createBookingService(req.body as any);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get all bookings
 *
 * @route GET /bookings
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */

export const getBookingsController = async (req: Request, res: Response) => {
  try {
    const bookings = await getBookingsService();
    res.status(200).json(bookings);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get a booking by ID
 *
 * @route GET /bookings/:id
 * @param {Request} req - Express request object (expects booking ID in params)
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */

export const getBookingByIdController = async (req: Request, res: Response) => {
  try {
    const booking = await getBookingByIdService(Number(req.params.id));
    res.status(200).json(booking);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

/**
 * Approve a booking
 *
 * @route PATCH /bookings/:id/approve
 * @param {Request} req - Express request object (expects booking ID in params)
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */

export const approveBookingController = async (req: Request, res: Response) => {
  try {
    const result = await approveBookingService(Number(req.params.id));
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Reject a booking
 *
 * @route PATCH /bookings/:id/reject
 * @param {Request} req - Express request object (expects booking ID in params)
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */

export const rejectBookingController = async (req: Request, res: Response) => {
  try {
    const result = await rejectBookingService(Number(req.params.id));
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Cancel a booking
 *
 * @route PATCH /bookings/:id/cancel
 * @param {Request} req - Express request object (expects booking ID in params)
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */

export const cancelBookingController = async (req: Request, res: Response) => {
  try {
    const result = await cancelBookingService(Number(req.params.id));
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};