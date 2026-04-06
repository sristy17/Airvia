import { pool } from "../../config/db.js";
import {
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  cancelBookingTx,
} from "../../repositories/booking.repository.js";

import { CreateBookingDTO, Booking } from "./dto/booking.dto.js";
import { bookingQueue } from "../../queue/booking.queue.js";

const VALID_STATUS = ["CONFIRMED", "CANCELLED", "PENDING", "COMPLETED"];

export const createBookingService = async (
  data: CreateBookingDTO
): Promise<{ message: string; status: string }> => {
  if (!data.seat_number) {
    throw new Error("Seat number is required");
  }

  if (!data.flight_id || !data.customer_id) {
    throw new Error("Flight ID and Customer ID required");
  }

  const seatNumber = data.seat_number.trim();

  await bookingQueue.add(
    "create-booking",
    {
      flight_id: data.flight_id,
      customer_id: data.customer_id,
      seat_number: seatNumber,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      jobId: `${data.flight_id}-${seatNumber}`,
    }
  );

  return {
    message: "Booking request queued successfully",
    status: "PENDING",
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