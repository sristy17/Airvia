import { pool } from "../config/db.js";
import { CreateBookingDTO } from "../services/bookings/dto/booking.dto.js";
import { getSeatForUpdate } from "./flightseat.repository.js";

export const createBooking = async (client: any, data: CreateBookingDTO) => {
  const result = await client.query(
    `INSERT INTO bookings (flight_id, customer_id, seat_number, status)
     VALUES ($1, $2, $3, 'CONFIRMED')
     RETURNING *`,
    [data.flight_id, data.customer_id, data.seat_number]
  );

  return result.rows[0];
};

export const getBookings = async () => {
  const result = await pool.query(
    `SELECT * FROM bookings ORDER BY booking_id`
  );
  return result.rows;
};

export const getBookingById = async (id: number) => {
  const result = await pool.query(
    `SELECT * FROM bookings WHERE booking_id=$1`,
    [id]
  );
  return result.rows[0];
};

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

export const deleteBooking = async (bookingId: number) => {
  const result = await pool.query(
    `DELETE FROM bookings WHERE booking_id=$1 RETURNING *`,
    [bookingId]
  );
  return result.rows[0];
};

export const cancelBookingTx = async (client: any, bookingId: number) => {
  const bookingRes = await client.query(
    `SELECT * FROM bookings WHERE booking_id=$1 FOR UPDATE`,
    [bookingId]
  );

  const booking = bookingRes.rows[0];

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status === "CANCELLED") {
    throw new Error("Already cancelled");
  }

  const seat = await getSeatForUpdate(
    client,
    booking.flight_id,
    booking.seat_number
  );

  if (!seat) {
    throw new Error("Seat not found");
  }

  await client.query(
    `UPDATE flight_seats
     SET is_booked=false, locked_until=NULL
     WHERE id=$1`,
    [seat.id]
  );

  await client.query(
    `UPDATE bookings
     SET status='CANCELLED'
     WHERE booking_id=$1`,
    [bookingId]
  );

  await client.query(
    `UPDATE flights
     SET available_seats = available_seats + 1
     WHERE flight_id=$1`,
    [booking.flight_id]
  );

  return { message: "Booking cancelled successfully" };
};