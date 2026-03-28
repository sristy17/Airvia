import pool from "../config/db.js";
import { CreateFlightDTO, Flight } from "../types/flight.types.js";

export const createFlight = async (data: CreateFlightDTO): Promise<Flight> => {
  const query = `
    INSERT INTO flights (airline, arrival_time, departure_time, total_seats)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [
    data.airline,
    data.arrival_time,
    data.departure_time,
    data.total_seats,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};