import { pool } from "../../config/db.js";

import {
  getAvailableSeats,
  createFlightSeats
} from "../../repositories/flightseat.repository.js";

// GET AVAILABLE SEATS
export const getAvailableSeatsService = async (flightId: number) => {
  if (!flightId) throw new Error("Flight ID required");

  return await getAvailableSeats(flightId);
};
