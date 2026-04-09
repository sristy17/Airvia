import { PoolClient } from "pg";
import { pool } from "../config/db.js";

/**
 * Create seats for a flight
 *
 * Generates seat numbers (A1, A2, ..., A{n}) with ECONOMY class.
 *
 * @param {PoolClient} client - PostgreSQL transaction client
 * @param {number} flightId - Flight ID
 * @param {number} totalSeats - Total number of seats
 * @returns {Promise<void>}
 */

export const createFlightSeats = async (
  client: PoolClient,
  flightId: number,
  totalSeats: number
): Promise<void> => {
  const values: string[] = [];

  for (let i = 1; i <= totalSeats; i++) {
    values.push(`(${flightId}, 'A${i}', 'ECONOMY')`);
  }

  const query = `
    INSERT INTO flight_seats (flight_id, seat_number, class)
    VALUES ${values.join(",")}
  `;

  await client.query(query);
};

/**
 * Get all available (unbooked and unlocked) seats for a flight
 *
 * @param {number} flightId - Flight ID
 * @returns {Promise<any[]>} List of available seats
 */

export const getAvailableSeats = async (flightId: number) => {
  const result = await pool.query(
    `SELECT * FROM flight_seats
     WHERE flight_id=$1
     AND is_booked=false
     AND (locked_until IS NULL OR locked_until < NOW())`,
    [flightId]
  );

  return result.rows;
};

/**
 * Fetch a specific seat with row-level lock (FOR UPDATE)
 *
 * Used to prevent race conditions during booking.
 *
 * @param {PoolClient} client - PostgreSQL transaction client
 * @param {number} flightId - Flight ID
 * @param {string} seatNumber - Seat number (e.g., A1)
 * @returns {Promise<any>} Seat record
 */

export const getSeatForUpdate = async (
  client: PoolClient,
  flightId: number,
  seatNumber: string
) => {
  const result = await client.query(
    `SELECT * FROM flight_seats
     WHERE flight_id=$1 AND seat_number=$2
     FOR UPDATE`,
    [flightId, seatNumber]
  );

  return result.rows[0];
};

/**
 * Lock a seat temporarily (soft lock)
 *
 * Prevents other users from booking the same seat for a limited time.
 *
 * @param {PoolClient} client - PostgreSQL transaction client
 * @param {number} seatId - Seat ID
 * @returns {Promise<void>}
 */

export const lockSeat = async (client: PoolClient, seatId: number): Promise<void> => {
  await client.query(
    `UPDATE flight_seats
     SET locked_until = NOW() + INTERVAL '5 minutes'
     WHERE id=$1`,
    [seatId]
  );
};

/**
 * Confirm a seat booking
 *
 * Marks the seat as booked and removes any lock.
 *
 * @param {PoolClient} client - PostgreSQL transaction client
 * @param {number} seatId - Seat ID
 * @returns {Promise<void>}
 */

export const confirmSeat = async (client: PoolClient, seatId: number): Promise<void> => {
  await client.query(
    `UPDATE flight_seats
     SET is_booked=true, locked_until=NULL
     WHERE id=$1`,
    [seatId]
  );
};

/**
 * Release a seat (used in cancellation or failure scenarios)
 *
 * Frees the seat and removes any lock.
 *
 * @param {PoolClient} client - PostgreSQL transaction client
 * @param {number} seatId - Seat ID
 * @returns {Promise<void>}
 */

export const releaseSeat = async (client: PoolClient, seatId: number): Promise<void> => {
  await client.query(
    `UPDATE flight_seats
     SET is_booked=false, locked_until=NULL
     WHERE id=$1`,
    [seatId]
  );
};