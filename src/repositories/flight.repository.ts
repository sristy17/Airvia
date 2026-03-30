import { pool } from "../config/db.js";
import { CreateFlightDTO, Flight, UpdateFlightDTO } from "../services/flights/dto/flight.dto.js";

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

export const updateFlight = async (
  flightId: number,
  data: UpdateFlightDTO
)=>{
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in data) {
    fields.push(`${key} = $${index}`);
    values.push((data as any)[key]);
    index++;
  }

  if (fields.length === 0) {
    throw new Error("No fields provided for update");
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
