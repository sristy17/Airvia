import { pool } from "../config/db.js";
import { CreateBookingDTO, UpdateBookingDTO } from "../services/bookings/dto/booking.dto.js";

export const createBookingRepo = async (data: CreateBookingDTO) => {
  const query = `
    INSERT INTO bookings (flight_id, customer_id, status)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [data.flight_id, data.customer_id, data.status];
  const result = await pool.query(query, values);

  return result.rows[0];
};

export const getBookingByIdRepo = async (id: number) => {
  const result = await pool.query(
    `SELECT * FROM bookings WHERE booking_id = $1`,
    [id]
  );
  return result.rows[0];
};

export const getAllBookingsRepo = async () => {
  const result = await pool.query(`SELECT * FROM bookings`);
  return result.rows;
};

export const updateBookingRepo = async (
  id: number,
  data: UpdateBookingDTO
) => {
  const query = `
    UPDATE bookings
    SET status = COALESCE($1, status)
    WHERE booking_id = $2
    RETURNING *;
  `;

  const values = [data.status, id];
  const result = await pool.query(query, values);

  return result.rows[0];
};

export const deleteBookingRepo = async (id: number) => {
  const result = await pool.query(
    `DELETE FROM bookings WHERE booking_id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};