import { PoolClient } from "pg";
import { pool } from "../config/db.js";

// CREATE SEATS 
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

// GET AVAILABLE SEATS
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

// GET SEAT FOR UPDATE (LOCK)
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

// LOCK SEAT
export const lockSeat = async (client: PoolClient, seatId: number): Promise<void> => {
  await client.query(
    `UPDATE flight_seats
     SET locked_until = NOW() + INTERVAL '5 minutes'
     WHERE id=$1`,
    [seatId]
  );
};

// CONFIRM SEAT
export const confirmSeat = async (client: PoolClient, seatId: number): Promise<void> => {
  await client.query(
    `UPDATE flight_seats
     SET is_booked=true, locked_until=NULL
     WHERE id=$1`,
    [seatId]
  );
};

// RELEASE SEAT (cancel case)
export const releaseSeat = async (client: PoolClient, seatId: number): Promise<void> => {
  await client.query(
    `UPDATE flight_seats
     SET is_booked=false, locked_until=NULL
     WHERE id=$1`,
    [seatId]
  );
};