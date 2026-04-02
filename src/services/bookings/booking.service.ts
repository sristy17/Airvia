import { pool } from "../../config/db.js";
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from "../../repositories/booking.repository.js";

import {
  CreateBookingDTO,
  Booking,
} from "./dto/booking.dto.js";

import { trimString } from "../../core/utils/trim.js";

// CREATE BOOKING 
export const createBookingService = async (
  data: CreateBookingDTO
): Promise<Booking> => {

  const seat_number = trimString(data.seat_number);

  if (!data.flight_id || !data.customer_id || !seat_number) {
    throw new Error("All fields required");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // check available seats
    const flightRes = await client.query(
      `SELECT available_seats FROM flights WHERE flight_id=$1 FOR UPDATE`,
      [data.flight_id]
    );

    if (!flightRes.rows.length) {
      throw new Error("Flight not found");
    }

    if (flightRes.rows[0].available_seats <= 0) {
      throw new Error("No seats available");
    }

    //prevent duplicate seat booking
    const seatCheck = await client.query(
      `SELECT * FROM bookings 
       WHERE flight_id=$1 AND seat_number=$2 AND status='CONFIRMED'`,
      [data.flight_id, seat_number]
    );

    if (seatCheck.rows.length > 0) {
      throw new Error("Seat already booked");
    }

    //create booking
    const booking = await createBooking(client, {
      ...data,
      seat_number,
    });

    //reduce available seats
    await client.query(
      `UPDATE flights 
       SET available_seats = available_seats - 1 
       WHERE flight_id=$1`,
      [data.flight_id]
    );

    await client.query("COMMIT");

    return booking;

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// GET ALL
export const getBookingsService = async (): Promise<Booking[]> => {
  return await getBookings();
};

// GET BY ID
export const getBookingByIdService = async (id: number): Promise<Booking> => {
  if (!id) throw new Error("Booking ID required");

  const booking = await getBookingById(id);

  if (!booking) throw new Error("Booking not found");

  return booking;
};

// UPDATE STATUS (cancel/complete)
export const updateBookingStatusService = async (
  bookingId: number,
  status: string
): Promise<Booking> => {

  if (!bookingId) throw new Error("Booking ID required");

  const booking = await updateBookingStatus(bookingId, status);

  if (!booking) throw new Error("Booking not found");

  return booking;
};

// DELETE
export const deleteBookingService = async (
  bookingId: number
): Promise<Booking> => {

  if (!bookingId) throw new Error("Booking ID required");

  const deleted = await deleteBooking(bookingId);

  if (!deleted) throw new Error("Booking not found");

  return deleted;
};