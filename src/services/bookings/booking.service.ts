import { pool } from "../../config/db.js";
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from "../../repositories/booking.repository.js";

import {
  getSeatForUpdate,
  confirmSeat,
} from "../../repositories/flightseat.repository.js";

import {
  CreateBookingDTO,
  Booking,
} from "./dto/booking.dto.js";

// allowed statuses (avoid invalid updates)
const VALID_STATUS = ["CONFIRMED", "CANCELLED", "PENDING", "COMPLETED"];

//create booking
export const createBookingService = async (
  data: CreateBookingDTO
): Promise<Booking> => {

  const client = await pool.connect();

  if (!data.seat_number) {
    throw new Error("Seat number is required");
  }

  const seatNumber = data.seat_number.trim();

  try {
    await client.query("BEGIN");

    await client.query("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");

    //Validate flight (LOCK)
    const flightRes = await client.query(
      `SELECT * FROM flights WHERE flight_id=$1 FOR UPDATE`,
      [data.flight_id]
    );

    if (!flightRes.rows.length) {
      throw new Error("Flight not found");
    }

    if (flightRes.rows[0].available_seats <= 0) {
      throw new Error("No seats available");
    }

    //Validate customer
    const customerRes = await client.query(
      `SELECT * FROM customers WHERE customer_id=$1`,
      [data.customer_id]
    );

    if (!customerRes.rows.length) {
      throw new Error("Customer not found");
    }

    //LOCK seat row
    const seat = await getSeatForUpdate(
      client,
      data.flight_id,
      seatNumber
    );

    if (!seat) {
      throw new Error("Seat not found");
    }

    //Seat state checks
    if (seat.is_booked) {
      throw new Error("Seat already booked");
    }

    if (seat.locked_until && new Date(seat.locked_until) > new Date()) {
      throw new Error("Seat temporarily locked");
    }

    //Prevent duplicate booking
    const existing = await client.query(
      `SELECT * FROM bookings
       WHERE flight_id=$1 AND seat_number=$2 AND status='CONFIRMED'
       FOR UPDATE`,
      [data.flight_id, seatNumber]
    );

    if (existing.rows.length) {
      throw new Error("Seat already booked");
    }

    //Create booking
    const booking = await createBooking(client, {
      flight_id: data.flight_id,
      customer_id: data.customer_id,
      seat_number: seatNumber,
    });

    //Confirm seat
    await confirmSeat(client, seat.id);

    //Reduce available seats
    await client.query(
      `UPDATE flights
       SET available_seats = available_seats - 1
       WHERE flight_id=$1`,
      [data.flight_id]
    );

    await client.query("COMMIT");

    return booking;

  } catch (err: any) {
    await client.query("ROLLBACK");

    if (err.code === "23505") {
      throw new Error("Seat already booked (DB constraint)");
    }

    throw err;
  } finally {
    client.release();
  }
};

//get all bookings
export const getBookingsService = async (): Promise<Booking[]> => {
  return await getBookings();
};

//get booking by id
export const getBookingByIdService = async (id: number): Promise<Booking> => {
  if (!id || isNaN(id)) {
    throw new Error("Valid booking ID required");
  }

  const booking = await getBookingById(id);

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
};

//update booking status
export const updateBookingStatusService = async (
  bookingId: number,
  status: string
): Promise<Booking> => {

  if (!bookingId || isNaN(bookingId)) {
    throw new Error("Valid booking ID required");
  }

  if (!status || !VALID_STATUS.includes(status)) {
    throw new Error("Invalid status value");
  }

  const booking = await updateBookingStatus(bookingId, status);

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
};

//cancel booking
export const cancelBookingService = async (
  bookingId: number
): Promise<{ message: string }> => {

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // lock booking
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

    // lock seat
    const seat = await getSeatForUpdate(
      client,
      booking.flight_id,
      booking.seat_number
    );

    if (!seat) {
      throw new Error("Seat not found");
    }

    // release seat
    await client.query(
      `UPDATE flight_seats
       SET is_booked=false, locked_until=NULL
       WHERE id=$1`,
      [seat.id]
    );

    // update booking
    await client.query(
      `UPDATE bookings
       SET status='CANCELLED'
       WHERE booking_id=$1`,
      [bookingId]
    );

    // increase available seats
    await client.query(
      `UPDATE flights
       SET available_seats = available_seats + 1
       WHERE flight_id=$1`,
      [booking.flight_id]
    );

    await client.query("COMMIT");

    return { message: "Booking cancelled successfully" };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

//delete booking
export const deleteBookingService = async (
  bookingId: number
): Promise<Booking> => {

  if (!bookingId || isNaN(bookingId)) {
    throw new Error("Valid booking ID required");
  }

  const deleted = await deleteBooking(bookingId);

  if (!deleted) {
    throw new Error("Booking not found");
  }

  return deleted;
};