import { Request, Response } from "express";
import {
  createFlightService,
  updateFlightService,
  deleteFlightService,
  getFlightsService,
  getFlightByIdService,
} from "../services/flights/flight.service.js";

// CREATE
export const createFlightController = async (req: Request, res: Response) => {
  try {
    const flight = await createFlightService(req.body);
    res.status(201).json(flight);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL
export const getFlightsController = async (req: Request, res: Response) => {
  try {
    const flights = await getFlightsService();
    res.json(flights);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET BY ID
export const getFlightByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const flight = await getFlightByIdService(id);
    res.json(flight);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

// UPDATE
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

// DELETE
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