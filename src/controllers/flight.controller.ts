import { Request, Response } from "express";
import { createFlight, updateFlight, deleteFlight } from "../repositories/flight.repository.js";

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

export const deleteFlightController = async (req: Request, res: Response) => {
  try {
    const flightId = Number(req.params.id);
    const deletedFlight = await deleteFlight({id: flightId});

    res.json({
      message: "Flight deleted successfully",
      data: deletedFlight,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};