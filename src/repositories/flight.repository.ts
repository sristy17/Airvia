import { pool } from "../config/db.js";
import { CreateFlightDTO, UpdateFlightDTO } from "../services/flights/dto/flight.dto.js";

// CREATE
export const createFlight = async (data: CreateFlightDTO) => {
  const query = `
    INSERT INTO flights 
    (airline, arrival_time, departure_time, total_seats, available_seats)
    VALUES ($1, $2, $3, $4, $4)
    RETURNING *;
  `;

  const result = await pool.query(query, [
    data.airline,
    data.arrival_time,
    data.departure_time,
    data.total_seats,
  ]);

  return result.rows[0];
};

// GET ALL
export const getFlights = async () => {
  const result = await pool.query(`SELECT * FROM flights ORDER BY flight_id`);
  return result.rows;
};

// GET BY ID
export const getFlightById = async (id: number) => {
  const result = await pool.query(
    `SELECT * FROM flights WHERE flight_id = $1`,
    [id]
  );
  return result.rows[0];
};

// UPDATE
export const updateFlight = async (
  flightId: number,
  data: UpdateFlightDTO
) => {
  const allowedFields = [
    "airline",
    "arrival_time",
    "departure_time",
    "total_seats",
  ];

  const fields: string[] = [];
  const values: any[] = [];
  let index = 1;

  for (const key of allowedFields) {
    if ((data as any)[key] !== undefined) {
      fields.push(`${key} = $${index}`);
      values.push((data as any)[key]);
      index++;
    }
  }

  if (fields.length === 0) {
    throw new Error("No valid fields provided");
  }

  const query = `
    UPDATE flights
    SET ${fields.join(", ")}
    WHERE flight_id = $${index}
    RETURNING *;
  `;

  values.push(flightId);

  const result = await pool.query(query, values);
  return result.rows[0];
};

// DELETE
export const deleteFlight = async (flightId: number) => {
  const result = await pool.query(
    `DELETE FROM flights WHERE flight_id = $1 RETURNING *`,
    [flightId]
  );
  return result.rows[0];
};