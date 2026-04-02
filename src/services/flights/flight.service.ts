import {
  createFlight,
  updateFlight,
  deleteFlight,
  getFlights,
  getFlightById,
} from "../../repositories/flight.repository.js";

import {
  CreateFlightDTO,
  UpdateFlightDTO,
  Flight,
} from "./dto/flight.dto.js";

import { trimString } from "../../core/utils/trim.js";

// CREATE
export const createFlightService = async (
  data: CreateFlightDTO
): Promise<Flight> => {
  const airline = trimString(data.airline);

  if (!airline || !data.arrival_time || !data.departure_time || !data.total_seats) {
    throw new Error("All fields are required");
  }

  if (new Date(data.departure_time) >= new Date(data.arrival_time)) {
    throw new Error("Departure must be before arrival");
  }

  if (data.total_seats <= 0) {
    throw new Error("Seats must be greater than 0");
  }

  return await createFlight({
    ...data,
    airline,
  });
};

// GET ALL
export const getFlightsService = async (): Promise<Flight[]> => {
  return await getFlights();
};

// GET BY ID
export const getFlightByIdService = async (id: number): Promise<Flight> => {
  if (!id) throw new Error("Flight ID required");

  const flight = await getFlightById(id);

  if (!flight) throw new Error("Flight not found");

  return flight;
};

// UPDATE
export const updateFlightService = async (
  flightId: number,
  data: UpdateFlightDTO
): Promise<Flight> => {
  if (!flightId) throw new Error("Flight ID required");

  if (data.airline) {
    data.airline = trimString(data.airline);
  }

  if (data.departure_time && data.arrival_time) {
    if (new Date(data.departure_time) >= new Date(data.arrival_time)) {
      throw new Error("Invalid timing");
    }
  }

  const updated = await updateFlight(flightId, data);

  if (!updated) throw new Error("Flight not found");

  return updated;
};

// DELETE
export const deleteFlightService = async (flightId: number): Promise<Flight> => {
  if (!flightId) throw new Error("Flight ID required");

  const deleted = await deleteFlight(flightId);

  if (!deleted) throw new Error("Flight not found");

  return deleted;
};