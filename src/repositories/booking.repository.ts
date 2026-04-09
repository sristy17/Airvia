import { pool } from "../config/db.js";
import { CreateBookingDTO } from "../services/bookings/dto/booking.dto.js";
import { getSeatForUpdate } from "./flightseat.repository.js";

/**
 * Creates a new booking within a transaction.
 *
 * @param {any} client - PostgreSQL client (transaction context)
 * @param {CreateBookingDTO} data - Booking data
 * @returns {Promise<any>} Newly created booking record
 */

export const createBooking = async (client: any, data: CreateBookingDTO) => {
  const result = await client.query(
    `INSERT INTO bookings (flight_id, customer_id, seat_number, status)
     VALUES ($1, $2, $3, 'PENDING')
     RETURNING *`,
    [data.flight_id, data.customer_id, data.seat_number]
  );

  return result.rows[0];
};

/**
 * Fetch all bookings
 *
 * @returns {Promise<any[]>} List of bookings
 */

export const getBookings = async () => {
  const result = await pool.query(
    `SELECT * FROM bookings ORDER BY booking_id`
  );
  return result.rows;
};

/**
 * Fetch a booking by ID
 *
 * @param {number} id - Booking ID
 * @returns {Promise<any>} Booking record
 */

export const getBookingById = async (id: number) => {
  const result = await pool.query(
    `SELECT * FROM bookings WHERE booking_id=$1`,
    [id]
  );
  return result.rows[0];
};

/**
 * Update booking status
 *
 * @param {number} bookingId - Booking ID
 * @param {string} status - New booking status
 * @returns {Promise<any>} Updated booking record
 */

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

/**
 * Delete a booking
 *
 * @param {number} bookingId - Booking ID
 * @returns {Promise<any>} Deleted booking record
 */

export const deleteBooking = async (bookingId: number) => {
  const result = await pool.query(
    `DELETE FROM bookings WHERE booking_id=$1 RETURNING *`,
    [bookingId]
  );
  return result.rows[0];
};

/**
 * Cancel a booking within a transaction.
 *
 * Steps:
 * 1. Lock booking row (FOR UPDATE)
 * 2. Validate booking existence and status
 * 3. Release seat if assigned
 * 4. Update booking status to CANCELLED
 * 5. Increment available seats in flight
 *
 * @param {any} client - PostgreSQL client (transaction context)
 * @param {number} bookingId - Booking ID
 * @returns {Promise<{ message: string }>}
 */

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

  // Only release seat if one was assigned
  if (booking.seat_number) {
    const seat = await getSeatForUpdate(
      client,
      booking.flight_id,
      booking.seat_number
    );

    if (seat) {
      await client.query(
        `UPDATE flight_seats
         SET is_booked=false, locked_until=NULL
         WHERE id=$1`,
        [seat.id]
      );
    }
  }

  // Update booking status
  await client.query(
    `UPDATE bookings
     SET status='CANCELLED'
     WHERE booking_id=$1`,
    [bookingId]
  );

  // Increment available seats safely
  await client.query(
    `UPDATE flights
     SET available_seats = available_seats + 1
     WHERE flight_id=$1 AND available_seats < total_seats`,
    [booking.flight_id]
  );

  return { message: "Booking cancelled successfully" };
};