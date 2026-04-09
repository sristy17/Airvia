import { Request, Response } from "express";
import { getAvailableSeatsService } from "../services/flightseats/flightseat.service.js";

/**
 * Get available seats for a specific flight
 *
 * @route GET /flights/:flightId/seats
 * @param {Request} req - Express request object (expects flightId in params)
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */

export const getAvailableSeatsController = async (req: Request, res: Response) => {
  try {
    const flightId = Number(req.params.flightId);
    const seats = await getAvailableSeatsService(flightId);
    res.json(seats);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};