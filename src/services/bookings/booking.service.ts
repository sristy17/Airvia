import { pool } from "../../config/db.js";
import {
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  cancelBookingTx,
  createBooking,
} from "../../repositories/booking.repository.js";

import { CreateBookingDTO, Booking } from "./dto/booking.dto.js";
import { addBookingJob } from "../../queue/booking.queue.js";

const VALID_STATUS = ["CONFIRMED", "CANCELLED", "PENDING"];

export const createBookingService = async (
  data: CreateBookingDTO
): Promise<{ message: string; booking: Booking }> => {
  if (!data.seat_number) {
    throw new Error("Seat number is required");
  }

  if (!data.flight_id || !data.customer_id) {
    throw new Error("Flight ID and Customer ID required");
  }

  const client = await pool.connect();

  try {
    const booking = await createBooking(client, {
      ...data,
      seat_number: data.seat_number.trim(),
    });

    return {
      message: "Booking created",
      booking,
    };
  } finally {
    client.release();
  }
};

export const approveBookingService = async (
  bookingId: number
): Promise<{ message: string }> => {
  if (!bookingId || isNaN(bookingId)) {
    throw new Error("Valid booking ID required");
  }

  const booking = await getBookingById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status !== "PENDING") {
    throw new Error("Only pending bookings can be processed");
  }

  await addBookingJob(bookingId);

  return {
    message: "Booking sent for processing",
  };
};

export const rejectBookingService = async (
  bookingId: number
): Promise<{ message: string }> => {
  if (!bookingId || isNaN(bookingId)) {
    throw new Error("Valid booking ID required");
  }

  const booking = await getBookingById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status !== "PENDING") {
    throw new Error("Only pending bookings can be rejected");
  }

  await updateBookingStatus(bookingId, "CANCELLED");

  return {
    message: "Booking rejected",
  };
};

export const getBookingsService = async (): Promise<Booking[]> => {
  return await getBookings();
};

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

export const cancelBookingService = async (
  bookingId: number
): Promise<{ message: string }> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await cancelBookingTx(client, bookingId);

    await client.query("COMMIT");

    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

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