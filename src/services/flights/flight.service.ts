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
import { pool } from "../../config/db.js";

// create
export const createFlightService = async (
  data: CreateFlightDTO
): Promise<Flight> => {

  const client = await pool.connect();

  try {
    // validations
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

    // auto-create seats
    const values: string[] = [];

    for (let i = 1; i <= data.total_seats; i++) {
      values.push(`(${flight.flight_id}, 'A${i}', 'ECONOMY')`);
    }

    await client.query(`
      INSERT INTO flight_seats (flight_id, seat_number, class)
      VALUES ${values.join(",")}
    `);

    await client.query("COMMIT");

    return flight;

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// get all
export const getFlightsService = async (): Promise<Flight[]> => {
  return await getFlights();
};

// get by id
export const getFlightByIdService = async (id: number): Promise<Flight> => {
  if (!id || isNaN(id)) {
    throw new Error("Valid flight ID required");
  }

  const flight = await getFlightById(id);

  if (!flight) throw new Error("Flight not found");

  return flight;
};

// update
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
    const booked = await pool.query(
      `SELECT COUNT(*) FROM flight_seats
       WHERE flight_id=$1 AND is_booked=true`,
      [flightId]
    );

    const bookedCount = Number(booked.rows[0].count);

    if (data.total_seats < bookedCount) {
      throw new Error("Cannot reduce seats below booked seats");
    }
  }

  const updated = await updateFlight(flightId, data);

  if (!updated) throw new Error("Flight not found");

  return updated;
};

// delete
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