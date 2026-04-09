import {
  createFlight,
  createFlightSeats,
  updateFlight,
  deleteFlight,
  getFlights,
  getFlightById,
  getBookedSeatsCount,
} from "../../repositories/flight.repository.js";

import {
  CreateFlightDTO,
  UpdateFlightDTO,
  Flight,
} from "./dto/flight.dto.js";

import { trimString } from "../../core/utils/trim.js";
import { pool } from "../../config/db.js";

/**
 * Create a new flight with seats
 *
 * Validates input, creates flight record, and generates seat entries
 * within a database transaction.
 *
 * @param {CreateFlightDTO} data - Flight input data
 * @returns {Promise<Flight>} Newly created flight
 */

export const createFlightService = async (
  data: CreateFlightDTO
): Promise<Flight> => {
  const client = await pool.connect();

  try {
    if (!data.airline) throw new Error("Airline is required");

    const airline = trimString(data.airline);

    if (!data.arrival_time || !data.departure_time || !data.total_seats) {
      throw new Error("All fields are required");
    }

    if (new Date(data.departure_time) >= new Date(data.arrival_time)) {
      throw new Error("Departure must be before arrival");
    }

    if (data.total_seats <= 0) {
      throw new Error("Seats must be greater than 0");
    }

    await client.query("BEGIN");

    const flight = await createFlight(client, {
      airline: data.airline,
      arrival_time: data.arrival_time,
      departure_time: data.departure_time,
      total_seats: data.total_seats,
    });

    await createFlightSeats(client, flight.flight_id, data.total_seats);

    await client.query("COMMIT");

    return flight;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

/**
 * Get all flights
 *
 * @returns {Promise<Flight[]>} List of flights
 */

export const getFlightsService = async (): Promise<Flight[]> => {
  return await getFlights();
};

/**
 * Get a flight by ID
 *
 * @param {number} id - Flight ID
 * @returns {Promise<Flight>} Flight record
 */

export const getFlightByIdService = async (id: number): Promise<Flight> => {
  if (!id || isNaN(id)) {
    throw new Error("Valid flight ID required");
  }

  const flight = await getFlightById(id);

  if (!flight) throw new Error("Flight not found");

  return flight;
};

/**
 * Update a flight (partial update supported)
 *
 * Validates input data and ensures seat constraints are maintained.
 *
 * @param {number} flightId - Flight ID
 * @param {UpdateFlightDTO} data - Fields to update
 * @returns {Promise<Flight>} Updated flight record
 */

export const updateFlightService = async (
  flightId: number,
  data: UpdateFlightDTO
): Promise<Flight> => {
  if (!flightId || isNaN(flightId)) {
    throw new Error("Valid flight ID required");
  }

  if (data.airline) {
    data.airline = trimString(data.airline);
  }

  if (data.departure_time && data.arrival_time) {
    if (new Date(data.departure_time) >= new Date(data.arrival_time)) {
      throw new Error("Invalid timing");
    }
  }

  if (data.total_seats !== undefined) {
    const bookedCount = await getBookedSeatsCount(flightId);

    if (data.total_seats < bookedCount) {
      throw new Error("Cannot reduce seats below booked seats");
    }
  }

  const updated = await updateFlight(flightId, data);

  if (!updated) throw new Error("Flight not found");

  return updated;
};

/**
 * Delete a flight
 *
 * @param {number} flightId - Flight ID
 * @returns {Promise<Flight>} Deleted flight record
 */

export const deleteFlightService = async (
  flightId: number
): Promise<Flight> => {
  if (!flightId || isNaN(flightId)) {
    throw new Error("Valid flight ID required");
  }

  const deleted = await deleteFlight(flightId);

  if (!deleted) throw new Error("Flight not found");

  return deleted;
};