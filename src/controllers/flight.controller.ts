import { Request, Response } from "express";
import {
  createFlightService,
  updateFlightService,
  deleteFlightService,
  getFlightsService,
  getFlightByIdService,
} from "../services/flights/flight.service.js";

/**
 * Create a new flight
 *
 * @route POST /flights
 * @param {Request} req - Express request object (expects flight data in body)
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */

export const createFlightController = async (req: Request, res: Response) => {
  try {
    const flight = await createFlightService(req.body);
    res.status(201).json(flight);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get all flights
 *
 * @route GET /flights
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */

export const getFlightsController = async (req: Request, res: Response) => {
  try {
    const flights = await getFlightsService();
    res.json(flights);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get a flight by ID
 *
 * @route GET /flights/:id
 * @param {Request} req - Express request object (expects flight ID in params)
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */

export const getFlightByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const flight = await getFlightByIdService(id);
    res.json(flight);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

/**
 * Update a flight
 *
 * @route PUT /flights/:id
 * @param {Request} req - Express request object (expects flight ID in params and updated data in body)
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */

export const updateFlightController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const flight = await updateFlightService(id, req.body);

    res.json({
      message: "Flight updated successfully",
      data: flight,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Delete a flight
 *
 * @route DELETE /flights/:id
 * @param {Request} req - Express request object (expects flight ID in params)
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */

export const deleteFlightController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const flight = await deleteFlightService(id);

    res.json({
      message: "Flight deleted successfully",
      data: flight,
    });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};