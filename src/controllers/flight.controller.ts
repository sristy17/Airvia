import { Request, Response } from "express";
import { createFlight } from "../repositories/flight.repository.js";

export const createFlightController = async (req: Request, res: Response) => {
  try {
    const flight = await createFlight(req.body);
    res.status(201).json(flight);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};