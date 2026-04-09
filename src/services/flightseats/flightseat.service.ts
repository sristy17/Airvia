import {
  getAvailableSeats
} from "../../repositories/flightseat.repository.js";

/**
 * Get available seats for a given flight
 *
 * Fetches all seats that are:
 * - Not booked
 * - Not currently locked OR lock has expired
 *
 * @param {number} flightId - Flight ID
 * @returns {Promise<any[]>} List of available seats
 */

export const getAvailableSeatsService = async (flightId: number) => {
  if (!flightId) throw new Error("Flight ID required");

  return await getAvailableSeats(flightId);
};