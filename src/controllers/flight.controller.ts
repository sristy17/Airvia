import { Request, Response } from "express";
import { createFlight, updateFlight } from "../repositories/flight.repository.js";

export const createFlightController = async (req: Request, res: Response) => {
  try {
    const flight = await createFlight(req.body);
    res.status(201).json(flight);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFlightController = async (req: Request, res: Response) => {
  try {
    const flightId = Number(req.params.id);
    const updatedFlight = await updateFlight(flightId, req.body);

    res.json({
      message: "Flight updated successfully",
      data: updatedFlight,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};