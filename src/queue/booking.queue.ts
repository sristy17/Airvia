import { bookingQueue } from "../config/queue.js";

/**
 * Adds a booking job to the BullMQ queue for asynchronous processing.
 *
 * This is typically used to handle background tasks such as:
 * - Seat confirmation
 * - Payment processing
 * - Booking status updates
 *
 * @param {number} bookingId - Unique identifier of the booking
 * @returns {Promise<void>}
 */

export const addBookingJob = async (bookingId: number) => {
  await bookingQueue.add("process-booking", {
    bookingId,
  });
};