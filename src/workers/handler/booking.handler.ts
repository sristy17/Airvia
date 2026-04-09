import { pool } from "../../config/db.js";
import { getBookingById, updateBookingStatus } from "../../repositories/booking.repository.js";
import { 
  getSeatForUpdate, 
  lockSeat, 
  confirmSeat 
} from "../../repositories/flightseat.repository.js";

/**
 * Process a booking asynchronously
 *
 * This function:
 * 1. Starts a database transaction
 * 2. Fetches the booking details
 * 3. Locks the selected seat (row-level lock)
 * 4. Validates seat availability
 * 5. Locks and confirms the seat
 * 6. Updates booking status to CONFIRMED
 * 7. Commits the transaction
 *
 * If any step fails:
 * - Transaction is rolled back
 * - Booking status is updated to FAILED
 *
 * @param {number} bookingId - Booking ID to process
 * @returns {Promise<void>}
 */

export const processBooking = async (bookingId: number) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const booking = await getBookingById(bookingId);
    if (!booking) throw new Error("Booking not found");

    const seat = await getSeatForUpdate(client, booking.flight_id, booking.seat_number);
    if (!seat) throw new Error("Seat not found");

    const isLocked = seat.locked_until && new Date(seat.locked_until) > new Date();

    if (seat.is_booked || isLocked) {
      throw new Error("Seat unavailable");
    }

    await lockSeat(client, seat.id);
    await confirmSeat(client, seat.id);

    await updateBookingStatus(bookingId, "CONFIRMED");

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    await updateBookingStatus(bookingId, "FAILED");
    throw err;
  } finally {
    client.release();
  }
};