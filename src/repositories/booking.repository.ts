import { pool } from "../config/db.js";
import { CreateBookingDTO } from "../services/bookings/dto/booking.dto.js";

// CREATE
export const createBooking = async (client: any, data: CreateBookingDTO) => {
  const query = `
    INSERT INTO bookings (flight_id, customer_id, seat_number, status)
    VALUES ($1, $2, $3, 'CONFIRMED')
    RETURNING *;
  `;

  const result = await client.query(query, [
    data.flight_id,
    data.customer_id,
    data.seat_number,
  ]);

  return result.rows[0];
};

// GET ALL
export const getBookings = async () => {
  const result = await pool.query(`SELECT * FROM bookings ORDER BY booking_id`);
  return result.rows;
};

// GET BY ID
export const getBookingById = async (id: number) => {
  const result = await pool.query(
    `SELECT * FROM bookings WHERE booking_id = $1`,
    [id]
  );
  return result.rows[0];
};

// UPDATE STATUS
export const updateBookingStatus = async (
  bookingId: number,
  status: string
) => {
  const result = await pool.query(
    `UPDATE bookings SET status=$1 WHERE booking_id=$2 RETURNING *`,
    [status, bookingId]
  );
  return result.rows[0];
};

// DELETE
export const deleteBooking = async (bookingId: number) => {
  const result = await pool.query(
    `DELETE FROM bookings WHERE booking_id=$1 RETURNING *`,
    [bookingId]
  );
  return result.rows[0];
};